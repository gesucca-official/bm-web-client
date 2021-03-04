import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DebugClientComponent} from './client-debug/debug-client.component';
import {PhaserClientComponent} from './client-phaser/phaser-client.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {CodeDialogComponent} from './client-debug/code-dialog/code-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {CharacterCardComponent} from './client-debug/character-card/character-card.component';
import {CardInHandComponent} from './client-debug/card-in-hand/card-in-hand.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {SignInComponent} from './connection/sign-in/sign-in.component';
import {ChooseGameComponent} from './connection/choose-game/choose-game.component';
import {TestBattleSceneComponent} from './client-phaser/scnenes/battle/test-battle-scene/test-battle-scene.component';
import {HomeComponent} from './home/home.component';
import {RouterModule} from '@angular/router';
import {MarkdownModule} from 'ngx-markdown';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RulesComponent} from './home/rules/rules.component';
import {ToolbarComponent} from './home/toolbar/toolbar.component';
import {UserHubComponent} from './user-hub/user-hub.component';
import {SignUpComponent} from './connection/sign-up/sign-up.component';
import {NgxLoadingModule} from 'ngx-loading';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AdminControlPanelComponent} from './user-hub/admin-control-panel/admin-control-panel.component';
import {CollectionComponent} from './user-hub/collection/collection.component';
import {SponsorComponent} from './home/sponsor/sponsor.component';
import {EditDeckComponent} from './user-hub/collection/edit-deck/edit-deck.component';
import {CollectionCardComponent} from './user-hub/collection/collection-card/collection-card.component';
import {CollectionCharacterCardComponent} from './user-hub/collection/character-card/collection-character-card.component';
import {ChooseDeckDialogComponent} from './connection/choose-game/choose-deck-dialog/choose-deck-dialog.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';

@NgModule({
  declarations: [
    AppComponent,
    DebugClientComponent,
    PhaserClientComponent,
    CodeDialogComponent,
    CharacterCardComponent,
    CollectionCharacterCardComponent,
    CardInHandComponent,
    SignInComponent,
    ChooseGameComponent,
    TestBattleSceneComponent,
    HomeComponent,
    RulesComponent,
    ToolbarComponent,
    UserHubComponent,
    SignUpComponent,
    AdminControlPanelComponent,
    AdminControlPanelComponent,
    CollectionComponent,
    SponsorComponent,
    EditDeckComponent,
    CollectionCardComponent,
    CollectionCharacterCardComponent,
    ChooseDeckDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'rules', component: RulesComponent},
      {path: 'hub', component: UserHubComponent},
      {path: 'sign-up', component: SignUpComponent},
      {path: 'phaser', component: PhaserClientComponent},
      {path: '**', redirectTo: '', component: HomeComponent}
    ], {onSameUrlNavigation: 'reload'}),
    LoggerModule.forRoot({
      serverLoggingUrl: '/rest/logs/client/web/',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.DEBUG,
      timestampFormat: 'YYYY-MM-dd_HH:mm:ss.SSS',
    }),
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxLoadingModule,
    MarkdownModule.forRoot({loader: HttpClient}),
  ],
  providers: [
    MatSnackBarModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
