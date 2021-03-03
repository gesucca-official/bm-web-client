import {GameService} from '../../../service/game.service';
import {PhaserSettingsService} from '../../phaser-settings.service';
import {UI_CardInHand} from './model/ui-card-in-hand';
import {UI_Opponent} from './model/ui-opponent';
import {ResolvedMoveAnimation} from './animations/resolves-moves';
import {UI_Player} from './model/ui-player';
import {DiscardChoiceAnimation} from './animations/discard-choice';
import {AppComponent} from '../../../app.component';
import {NGXLogger} from 'ngx-logger';

export class BattleScene extends Phaser.Scene {

  public static KEY = 'battleScene';
  private readonly gameService: GameService;
  private readonly settingsService: PhaserSettingsService;
  private readonly logger: NGXLogger;

  player: Phaser.GameObjects.Container;
  opponents: Map<string, Phaser.GameObjects.Container> = new Map<string, Phaser.GameObjects.Container>();
  cards: UI_CardInHand[] = [];

  constructor() {
    super({key: BattleScene.KEY});
    // @ts-ignore
    this.gameService = window.gameService;
    // @ts-ignore
    this.settingsService = window.settingsService;
    // @ts-ignore
    this.logger = window.logger;
  }

  preload(): void {
    // symbols
    this.load.image('health', 'assets/img/health.png');
    this.load.image('alertness', 'assets/img/alertness.png');
    // card template
    this.load.image('card', 'assets/img/card-template.png');
    // card image fallback
    this.load.image('no-img', 'assets/img/cards/no-img.png');
    // player back
    this.load.image(this.gameService.playerState.character.name + '-back',
      'assets/img/characters/' + this.gameService.playerState.character.sprite.replace('.png', '') + '-back.png');
    // opponents front
    this.gameService.opponents.forEach(o => {
      this.load.image(o.character.name, 'assets/img/characters/' + o.character.sprite);
      o.character.items.forEach(i => this.load.image(i.name + '-sprite', 'assets/img/cards/' + i.sprite));
    });
    // cards images
    this.gameService.playerState.cardsInHand.forEach(c => {
      if (c.image) {
        this.load.image(c.name, 'assets/img/cards/' + c.image);
      }
    });
  }

  create(): void {
    this.settingsService.currentScene = this;

    for (let i = 0; i < this.gameService.opponents.length; i++) {
      const oppo = new UI_Opponent(this, this.gameService.opponents[i], i, this.gameService.opponents.length, 36);
      this.opponents.set(this.gameService.opponents[i].playerId, oppo.getContainer());
    }
    for (let i = 0; i < this.gameService.playerState.cardsInHand.length; i++) {
      this.cards.push(new UI_CardInHand(this, this.gameService.playerState.cardsInHand[i], i));
    }
    this.player = new UI_Player(this, this.gameService.playerState, 55, '-back').getContainer();

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
      // TODO turn off details button while dragging
    });
    this.input.on('drop', (pointer, gameObject, dropZone) => {
      this.logger.debug('Drop Event occurred! Logging gameObject and dropZone', AppComponent.SESSION_ID);
      this.logger.debug(gameObject.data.list, AppComponent.SESSION_ID);
      this.logger.debug(dropZone.data.list, AppComponent.SESSION_ID);
      this.handleDropEvent(gameObject.data.list.card, dropZone.data.list.target);
    });

    if (this.gameService.gameState.resolvedMoves && this.gameService.gameState.resolvedMoves.length > 0) {
      this.setupMoveAnimation(0);
    }
    this.playTimeBasedAnimation();
  }

  getPlayerContainer(name: string): Phaser.GameObjects.Container {
    if (name === this.gameService.playerState.playerId) {
      return this.player;
    } else {
      return this.opponents.get(name);
    }
  }

  private playTimeBasedAnimation(): void {
    if (!this.gameService.gameState.timeBasedEffects) {
      return;
    }
  }

  private setupMoveAnimation(index: number): void {
    const animation = new ResolvedMoveAnimation(
      this,
      this.settingsService,
      this.gameService.gameState.resolvedMoves[index],
      (name) => this.getPlayerContainer(name));
    animation.play();
    animation.getOkButton().on('pointerdown', () => {
      animation.resetAndDestroy();
      if (index + 1 < this.gameService.gameState.resolvedMoves.length) {
        this.setupMoveAnimation(index + 1);
      }
    });
  }

  private handleDropEvent(dropped: string, target: string): void {
    if (!target || !confirm(target)) // target is not there when it is a discard action
    {
      return;
    }
    const card = this.getCardObjFromName(dropped);
    if (card.getModel().characterBound) {
      DiscardChoiceAnimation.getInstance().triggerDiscardChoice(this, card, this.cards, (cardToDiscard) => this.gameService.submitMove({
        playedCardName: dropped,
        playerId: this.gameService.playerState.playerId,
        targetId: target,
        gameId: this.gameService.gameId,
        choices: {DISCARD_ONE: cardToDiscard}
      }));
    } else {
      this.gameService.submitMove({
        playedCardName: dropped,
        playerId: this.gameService.playerState.playerId,
        targetId: target, // TODO what happens if target is item?
        gameId: this.gameService.gameId,
        choices: null
      });
    }
  }

  private getCardObjFromName(name: string): UI_CardInHand {
    for (const c of this.cards) {
      if (c.getModel().name === name) {
        return c;
      }
    }
    return null;
  }

}
