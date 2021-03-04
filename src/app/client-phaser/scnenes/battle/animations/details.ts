import {UI_AbstractObject} from '../model/ui-abstract-object';
import {PhaserSettingsService} from '../../../phaser-settings.service';
import {UI_Item} from '../model/ui-item';
import {LogService} from '../../../../service/log.service';

export class DetailsAnimation {

  private constructor() {
    // @ts-ignore
    this.settings = window.settingsService;
    // @ts-ignore
    this.logger = window.logger;
  }

  private static _INSTANCE: DetailsAnimation;

  private settings: PhaserSettingsService;
  private logger: LogService;

  // toggle behaviour of details methods, allowing them to listen for events (es. click to do/re click to cancel)
  private readonly detailsShownFor: Map<string, boolean> = new Map<string, boolean>();

  private readonly originPosOf: Map<string, [number, number]> = new Map<string, [number, number]>();
  private readonly originScaleOf: Map<string, number> = new Map<string, number>();

  // objects added to scene
  private blurredBackground: Map<string, Phaser.GameObjects.Rectangle> = new Map<string, Phaser.GameObjects.Rectangle>();
  private summary: Map<string, Phaser.GameObjects.Text> = new Map<string, Phaser.GameObjects.Text>();

  // tween added to animation targets
  private tween: Map<string, Phaser.Tweens.Tween> = new Map<string, Phaser.Tweens.Tween>();

  public static getInstance(): DetailsAnimation {
    if (!this._INSTANCE) {
      this._INSTANCE = new DetailsAnimation();
    }
    return this._INSTANCE;
  }

  public toggleDetails(objId: string): void {
    if (!this.detailsShownFor.get(objId)) {
      this.detailsShownFor.set(objId, true);
    } else {
      this.detailsShownFor.set(objId, !this.detailsShownFor.get(objId));
    }
    this.logger.debug('Toggled details view for Obj ' + objId + ': toggle is now ' + this.detailsShownFor.get(objId));
    this.logger.debug(this.detailsShownFor);
  }

  public focusDetails(obj: UI_AbstractObject, scene: Phaser.Scene): void {
    if (this.detailsShownFor.get(obj.getId())) {
      const bg = scene.add.rectangle(0, 0,
        this.settings.getScreenWidth(),
        this.settings.getScreenHeight(), 0x9e9e9e, 0.75)
        .setOrigin(0, 0)
        .setDepth(1)
        .setInteractive(); // this prevents things underneath it to be clicked
      this.blurredBackground.set(obj.getId(), bg);
      this.logger.debug('Focused Obj ' + obj.getId() + ' with blurred background');
    } else {
      this.blurredBackground.get(obj.getId()).destroy();
      this.logger.debug('Destroyed blurred Background created for Obj ' + obj.getId());
    }
  }

  public showSummary(obj: UI_AbstractObject, scene: Phaser.Scene): void {
    if (this.detailsShownFor.get(obj.getId())) {
      const summary = scene.add.text(this.settings.getScreenWidth() / 2, this.settings.getScreenHeight() / 3,
        JSON.stringify(obj.getModel(), null, 2))
        .setFontSize(this.settings.scaleForMin(30))
        .setFontFamily('Electrolize')
        .setColor('#000000').setDepth(100);
      this.summary.set(obj.getId(), summary);
      this.logger.debug('Summary shown for Obj ' + obj.getId());
    } else {
      this.summary.get(obj.getId()).destroy();
      this.logger.debug('Destroyed Summary of Obj ' + obj.getId());
    }
  }

  public zoomObjForDetails(obj: UI_AbstractObject, scene: Phaser.Scene): void {
    if (this.detailsShownFor.get(obj.getId())) {
      this.logger.debug('Placing zoomed Obj ' + obj.getId());
      obj.getAnimationTargets().forEach(target => {
        target.setDepth(target.depth + 5);
        this.originPosOf.set(target.name, [target.x, target.y]);
        this.tween.get(obj.getId())?.remove();
        this.tween.delete(obj.getId() + '.' + target.name);
        const tween = scene.tweens.add({
          targets: target,
          ease: 'Sine.easeInOut',
          delay: 100,
          duration: 250,
          x: (target.x - obj.getX() + obj.getContainer().displayWidth / 2) * 1.5 + this.settings.scaleForWidth(35),
          y: (target.y - obj.getY()) * 1.5 + (this.settings.getScreenHeight() / 2),
          scale: 1.5
        });
        this.tween.set(obj.getId() + '.' + target.name, tween);
        this.logger.debug('Animation Target: ' + target.name);
        this.logger.debug('Animation Target X: ' + target.x);
        this.logger.debug('Whole Obj X: ' + obj.getX());
        this.logger.debug('Animation Target Y: ' + target.y);
        this.logger.debug('Whole Obj Y: ' + obj.getY());
      });
      obj.getInteractiveAfterAnimation().forEach(i => i.setInteractive());
    } else {
      obj.getAnimationTargets().forEach(target => {
        target.setDepth(target.depth - 5);
        this.tween.get(obj.getId())?.remove();
        this.tween.delete(obj.getId() + '.' + target.name);
        const tween = scene.tweens.add({
          targets: target,
          ease: 'Sine.easeInOut',
          delay: 100,
          duration: 250,
          x: this.originPosOf.get(target.name) [0],
          y: this.originPosOf.get(target.name) [1],
          scale: 1
        });
        this.tween.set(obj.getId() + '.' + target.name, tween);
      });
      obj.getInteractiveAfterAnimation().forEach(i => i.disableInteractive());
    }
  }

  // I have long thought about the existence of this, but I never bothered to generalize it with the above
  // TODO a factorization is sure needed, dunno about the deeper stuff
  public zoomItemForDetails(item: UI_Item, scene: Phaser.Scene, ): void {
    if (this.detailsShownFor.get(item.getId())) {
      this.summary.get(item.getOwner().getId()).setVisible(false);
      this.blurredBackground.get(item.getOwner().getId()).setVisible(false);
      item.getAnimationTargets().forEach(target => {
        target.setDepth(target.depth + 5);
        // I have to change the name to avoid overriding the original position set in players details
        this.originPosOf.set(target.name + '_itemDetails', [target.x, target.y]);
        this.originScaleOf.set(target.name + '_itemDetails', target.scale);

        this.tween.get(item.getId())?.remove();
        this.tween.delete(item.getId() + '.' + target.name);
        const tween = scene.tweens.add({
          targets: target,
          ease: 'Sine.easeInOut',
          delay: 100,
          duration: 250,
          x: item.getOwner().getContainer().x,
          y: item.getOwner().getContainer().y,
          scale: 3
        });
        this.tween.set(item.getId() + '.' + target.name, tween);
      });
      item.getOwner().getContainer().setAlpha(0.5);
    } else {
      this.summary.get(item.getOwner().getId()).setVisible(true);
      this.blurredBackground.get(item.getOwner().getId()).setVisible(true);
      item.getAnimationTargets().forEach(target => {
        target.setDepth(target.depth - 1);
        this.tween.get(item.getId())?.remove();
        this.tween.delete(item.getId() + '.' + target.name);
        const tween = scene.tweens.add({
          targets: target,
          ease: 'Sine.easeInOut',
          delay: 100,
          duration: 250,
          x: this.originPosOf.get(target.name + '_itemDetails') [0],
          y: this.originPosOf.get(target.name + '_itemDetails') [1],
          scale: this.originScaleOf.get(target.name + '_itemDetails')
        });
        this.tween.set(item.getId() + '.' + target.name, tween);
      });
      item.getOwner().getContainer().setAlpha(1);
    }
  }

}
