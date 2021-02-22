import {PhaserSettingsService} from "../../../phaser-settings.service";
import {GameService} from "../../../../service/game.service";

export abstract class UI_AbstractObject {

  protected container: Phaser.GameObjects.Container;

  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  protected settingsService: PhaserSettingsService;
  protected gameService: GameService;

  protected constructor() {
    this.settingsService = window['settingsService'];
    this.gameService = window['gameService'];
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
