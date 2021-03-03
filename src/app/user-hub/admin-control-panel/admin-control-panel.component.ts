import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-admin-control-panel',
  templateUrl: './admin-control-panel.component.html',
  styleUrls: ['./admin-control-panel.component.css']
})
export class AdminControlPanelComponent implements OnInit {

  loggedGamesQty: number;
  webClientLogLinesQty: number;

  constructor(protected http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<number>('/rest/logs/back/games/qty').subscribe(res => this.loggedGamesQty = res);
    this.http.get<number>('/rest/logs/client/web/qty').subscribe(res => this.webClientLogLinesQty = res);
  }

  showUnfinishedGames(): void {
    window.open('/rest/logs/back/games/open', '_blank');
  }

  downloadAllGames(): void {
    window.open('/rest/logs/back/games/drain', '_blank');
  }

  downloadAllWebClientLogs(): void {
    window.open('/rest/logs/client/web/drain', '_blank');
  }

  deleteAllGames(): void {
    if (confirm('This will delete logs from DB, are you sure?')) {
      this.http.delete<void>('/rest/logs/back/games/delete').subscribe(res => {
        alert('Logs Deleted');
        this.ngOnInit();
      });
    }
  }

  deleteAllClientLogs(): void {
    if (confirm('This will delete logs from DB, are you sure?')) {
      this.http.delete<void>('/rest/logs/client/web/delete').subscribe(res => {
        alert('Logs Deleted');
        this.ngOnInit();
      });
    }
  }
}
