import {PhaserSettingsService} from "../../../phaser-settings.service";
import {UI_CardInHand} from "../model/ui-card-in-hand";

export class HighlightAnimation {

  private settings: PhaserSettingsService;

  private constructor() {
    this.settings = window['settingsService'];
  }

  private static _INSTANCE: HighlightAnimation;

  public static getInstance(): HighlightAnimation {
    if (!this._INSTANCE)
      this._INSTANCE = new HighlightAnimation();
    return this._INSTANCE;
  }

  private readonly tweens: Map<string, Phaser.Tweens.Tween[]> = new Map<string, Phaser.Tweens.Tween[]>();

  highlight(target: UI_CardInHand, scene: Phaser.Scene) {
    target.getContainer().setDepth(target.getContainer().depth + 10);
    target.getTintTarget().setTint(0x44ff44);

    const raiseTween = scene.tweens.add({
      targets: target.getAnimationTargets(),
      ease: 'Sine.easeInOut',
      delay: 100,
      duration: 250,
      y: target.getContainer().y - this.settings.scaleForHeight(20)
    });
    const zoomTween = scene.tweens.add({
      targets: target.getAnimationTargets(),
      ease: 'Sine.easeInOut',
      delay: 250,
      duration: 500,
      scale: 1.05,
      yoyo: true,
      repeat: -1
    });
    this.tweens.set(target.getId(), [raiseTween, zoomTween]);
  }

  resetHighlight(target: UI_CardInHand, scene: Phaser.Scene) {
    this.tweens.get(target.getId()).forEach(t => {
      t.stop();
      t.remove();
    });
    target.getContainer().setDepth(target.getContainer().depth - 10);
    target.getTintTarget().clearTint();
    scene.tweens.add({
      targets: target.getAnimationTargets(),
      ease: 'Sine.easeInOut',
      delay: 100,
      duration: 250,
      x: target.getX(),
      y: target.getY()
    });
    scene.tweens.add({
      targets: target.getAnimationTargets(),
      ease: 'Sine.easeInOut',
      delay: 100,
      duration: 250,
      scale: 1
    });
  }
}
