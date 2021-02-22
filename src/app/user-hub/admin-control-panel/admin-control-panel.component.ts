import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-admin-control-panel',
  templateUrl: './admin-control-panel.component.html',
  styleUrls: ['./admin-control-panel.component.css']
})
export class AdminControlPanelComponent implements OnInit {

  loggedGamesQty: number;

  constructor(protected http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<number>('/control-panel/logs/games/qty').subscribe(res => this.loggedGamesQty = res);
  }

  drainLog() {
    window.open('/control-panel/logs/games/drain', "_blank");
  }

  showUnfinished() {
    window.open('/control-panel/logs/games/open', "_blank");
  }
}
