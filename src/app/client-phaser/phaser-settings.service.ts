import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PhaserSettingsService {

  get currentScene(): Phaser.Scene {
    return this._currentScene;
  }

  set currentScene(value: Phaser.Scene) {
    this._currentScene = value;
  }

  private _currentScene: Phaser.Scene;

  getScreenWidth(): number {
    return window.innerWidth * window.devicePixelRatio;
  }

  getScreenHeight(): number {
    return window.innerHeight * window.devicePixelRatio;
  }

  // I can specify numbers based on 1080p resolutions
  scaleForWidth(value: number) {
    return (value * this.getScreenWidth()) / 1920;
  }

  scaleForHeight(value: number) {
    return (value * this.getScreenHeight()) / 1080;
  }

  scaleForMin(value: number) {
    return this.scaleForWidth(value) > this.scaleForHeight(value) ? this.scaleForHeight(value) : this.scaleForWidth(value);
  }

}
