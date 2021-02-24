import {PhaserSettingsService} from '../../../phaser-settings.service';
import {GameService} from '../../../../service/game.service';

// tslint:disable-next-line:class-name
export abstract class UI_AbstractObject {

  protected constructor() {
    // @ts-ignore
    this.settingsService = window.settingsService;
    // @ts-ignore
    this.gameService = window.gameService;
  }

  protected container: Phaser.GameObjects.Container;

  protected settingsService: PhaserSettingsService;
  protected gameService: GameService;

  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  abstract getId(): string;

  abstract getModel(): any;

  abstract getX(): number;

  abstract getY(): number;

  abstract getWidth(): number;

  abstract getHeight(): number;

  abstract getAnimationTargets(): (Phaser.GameObjects.Container | Phaser.GameObjects.Zone)[];

  abstract getInteractiveAfterAnimation(): Phaser.GameObjects.Container[];

  abstract getTintTarget(): Phaser.GameObjects.Image;
}
