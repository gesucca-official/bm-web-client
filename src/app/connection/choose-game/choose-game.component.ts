import {AfterViewInit, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {WebsocketService} from "../../service/websocket.service";
import {GameService} from "../../service/game.service";
import {SessionService} from "../../service/session.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../model/user";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {ChooseDeckDialogComponent} from "./choose-deck-dialog/choose-deck-dialog.component";
import {Deck} from "../../model/deck";

@Component({
  selector: 'app-choose-game',
  templateUrl: './choose-game.component.html',
  styleUrls: ['./choose-game.component.css']
})
export class ChooseGameComponent implements AfterViewInit {

  @Output() joinGameRequest: EventEmitter<{ game: string, deck?: Deck }> = new EventEmitter<{ game: string, deck?: Deck }>();

  constructor(public websocketService: WebsocketService,
              public gameService: GameService,
              public sessionService: SessionService,
              public dialog: MatDialog) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<User>(this.sessionService.usersConnected);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngDoCheck() {
    if (this.dataSource.data !== this.sessionService.usersConnected)
      this.dataSource = new MatTableDataSource<User>(this.sessionService.usersConnected);
  }

  joinOpenGame(game: string) {
    this.dialog.open(ChooseDeckDialogComponent, {})
      .afterClosed().subscribe(result => {
      if (result)
        this.joinGame(game, result)
    })
  }

  joinGame(game: string, deck?: Deck) {
    this.joinGameRequest.emit({game, deck});
  }

  addComPlayerToFfaGame() {
    this.websocketService.addComToGame();
  }

  forceStartFfaGame() {
    this.websocketService.forceStartFfaGame();
  }

}
