import {Component} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (control.parent === undefined) {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    } else {
      const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
      const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
      return (invalidCtrl || invalidParent);
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  isLoading = false;
  sendCodeClicked = false;

  playerIdFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[A-Za-z0-9]+$')
  ]);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  verificationCodeFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern('^[0-9]+$')
  ]);

  passwordForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(protected http: HttpClient, private formBuilder: FormBuilder, private router: Router) {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, {validator: this.checkPasswords});
  }

  // tslint:disable-next-line:typedef
  async sendVerificationEmail() {
    this.sendCodeClicked = true;
    this.isLoading = true;
    setTimeout(() => this.sendCodeClicked = false, 15000);

    const usernameAvailable = await this.checkUsernameAvailability(this.playerIdFormControl.value);
    if (!usernameAvailable) {
      this.isLoading = false;
      Swal.fire(
        'Error!',
        'This username is already taken. Please choose another.',
        'error'
      ).then();
      return;
    }

    const emailAvailable = await this.checkEmailAvailability(this.emailFormControl.value);
    if (!emailAvailable) {
      this.isLoading = false;
      Swal.fire(
        'Error!',
        'This email has already been used for registration. Please use another one.',
        'error'
      ).then();
      return;
    }

    await this.sendVerificationCode(this.playerIdFormControl.value, this.emailFormControl.value);
    this.isLoading = false;
    Swal.fire(
      'Check Your Email',
      'An email containing your Verification Code has been sent. Please enter that Code to complete your registration.',
      'success'
    ).then();
  }

  signUp(): void {
    this.isLoading = true;
    this.http.post<void>('/rest/sign-up/register', {
      username: this.playerIdFormControl.value,
      password: this.passwordForm.value.password,
      email: this.emailFormControl.value,
      code: this.verificationCodeFormControl.value
    }).subscribe(() => {
      this.isLoading = false;
      Swal.fire(
        'Account Created',
        'Your account has been successfully created. You can now Log In.',
        'success'
      ).then(() => this.router.navigateByUrl('/hub'));
    }, (error => {
      Swal.fire(
        'Error',
        'Your request was refused. Did you entered your Verification Code correctly?',
        'error'
      ).then();
      console.log(error);
    }));
  }

  checkPasswords(group: FormGroup): any {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : {notSame: true};
  }

  private async checkUsernameAvailability(username: string): Promise<boolean> {
    return this.http.get<boolean>('/sign-up/users/' + username + '/available').toPromise();
  }

  private async checkEmailAvailability(email: string): Promise<boolean> {
    return this.http.get<boolean>('/sign-up/mail/' + email + '/available').toPromise();
  }

  private async sendVerificationCode(username: string, email: string): Promise<void> {
    return this.http.post<void>('/rest/sign-up/verify', {
      username,
      email
    }).toPromise();
  }
}
