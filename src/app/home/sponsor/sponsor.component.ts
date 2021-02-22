import {Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SponsorComponent implements OnInit {

  ngOnInit(): void {
  }

  @HostListener('click')
  onClick(): void {
    window.open('https://www.instagram.com/vodka_spuma/', '_blank');
  }

}
