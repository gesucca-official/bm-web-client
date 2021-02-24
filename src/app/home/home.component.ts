import {Component, OnInit} from '@angular/core';
import {SponsorComponent} from './sponsor/sponsor.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.snackBar.openFromComponent(SponsorComponent, {duration: 2500, panelClass: 'sponsor'});
  }

  youtubeLink(): void {
    window.document.location.href = 'https://www.youtube.com/channel/UCVn26_2xCJDngLicWKxQRmw';
  }

  instagramLink(): void {
    window.document.location.href = 'https://www.instagram.com/gesucca/';
  }
}

