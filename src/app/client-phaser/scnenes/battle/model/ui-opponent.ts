import {Opponent, Player} from '../../../../model/player';
import {UI_Player} from './ui-player';

// tslint:disable-next-line:class-name
export class UI_Opponent extends UI_Player {


  constructor(scene: Phaser.Scene, model: Player | Opponent, index: number, qty: number, nameSize: number, textureNameSuffix?: string) {
    super(scene, model, nameSize, textureNameSuffix, index, qty);
  }

  getHeight(): number {
    return Math.min(this.settingsService.getScreenHeight() * 0.55, this.getWidth() * (4 / 3));
  }

  getWidth(): number {
    return Math.min((this.settingsService.getScreenWidth() / this.qty) * 0.85,
      this.settingsService.getScreenWidth() * 0.35);
  }

  getX(): number {
    return this.settingsService.getScreenWidth() -
      (this.settingsService.scaleForMin(25) + ((this.settingsService.getScreenWidth() / this.qty) * this.index)
        + (this.character.displayWidth / 2));
  }

  getY(): number {
    return this.settingsService.scaleForHeight(30) + (this.character.displayHeight / 2);
  }

}
