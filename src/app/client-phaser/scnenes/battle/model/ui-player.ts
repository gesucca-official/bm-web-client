import {Opponent, Player} from '../../../../model/player';
import {UI_Item} from './ui-item';
import {UI_AbstractObject} from './ui-abstract-object';
import {DetailsAnimation} from '../animations/details';

// tslint:disable-next-line:class-name
export class UI_Player extends UI_AbstractObject {

  constructor(scene: Phaser.Scene, model: Player | Opponent, nameSize: number, textureNameSuffix?: string, index?: number, qty?: number) {
    super();
    this.model = model;

    this.index = index;
    this.qty = qty;

    this.character = scene.add.image(0, 0,
      textureNameSuffix ? model.character.name + textureNameSuffix : model.character.name)
      .setDisplaySize(this.getWidth(), this.getHeight());

    this.name = this.renderName(scene, this.settingsService.scaleForMin(nameSize));
    this.stats = this.renderStats(scene, this.name.x, this.name.y + this.name.displayHeight * 2);

    this.container = scene.add.container(this.getX(), this.getY(), [this.character, this.name, this.stats]);
    this.container.setName(this.getId());
    this.container.setSize(this.character.displayWidth, this.character.displayHeight);
    this.container.setInteractive();

    this.zone = scene.add.zone(this.container.x, this.container.y, this.container.displayWidth, this.container.displayHeight)
      .setRectangleDropZone(this.container.displayWidth, this.container.displayHeight)
      .setDepth(-1)
      .setData({target: model.playerId})
      .setName(this.getId() + '_dropZone');
    scene.input.enableDebug(this.container);

    for (let i = 0; i < model.character.items.length; i++) {
      const item = new UI_Item(scene, model.character.items[i], this, i);
      this.items.push(item.getContainer().setName(this.getId() + '_item' + i));
    }
    this.container.on('pointerdown', () => DetailsAnimation.getInstance().toggleDetails(this.getId()));
    this.container.on('pointerdown', () => DetailsAnimation.getInstance().focusDetails(this, scene));
    this.container.on('pointerdown', () => DetailsAnimation.getInstance().showSummary(this, scene));
    this.container.on('pointerdown', () => DetailsAnimation.getInstance().zoomObjForDetails(this, scene));
  }

  private readonly items: Phaser.GameObjects.Container[] = [];

  protected readonly model: Player | Opponent;
  protected readonly character: Phaser.GameObjects.Image;

  // damned inheritance, I have to put those here to be able to use in subclasses constructor super call
  protected readonly index: number;
  protected readonly qty: number;

  private readonly name: Phaser.GameObjects.Text;
  private readonly stats: Phaser.GameObjects.Container;
  private readonly zone: Phaser.GameObjects.Zone;

  getItems(): Phaser.GameObjects.Container[] {
    return this.items;
  }

  getId(): string {
    return this.model.playerId;
  }

  getHeight(): number {
    return Math.min(this.settingsService.getScreenHeight() * 0.5, this.getWidth());
  }

  getWidth(): number {
    return Math.min(this.settingsService.getScreenWidth() * 0.35, this.settingsService.getScreenHeight() * 0.5);
  }

  getX(): number {
    return this.character.displayWidth / 2;
  }

  getY(): number {
    return Math.min(
      this.settingsService.getScreenHeight() - this.character.displayHeight / 2,
      (this.settingsService.getScreenHeight() * 0.75) + (this.character.displayHeight / 2)
    );
  }

  getAnimationTargets(): (Phaser.GameObjects.Container | Phaser.GameObjects.Zone)[] {
    const targets: any = [];
    this.items.forEach(i => targets.push(i));
    targets.push(this.container);
    targets.push(this.zone);
    return targets;
  }

  getInteractiveAfterAnimation(): Phaser.GameObjects.Container[] {
    const targets: any = [];
    this.items.forEach(i => targets.push(i));
    return targets;
  }

  getTintTarget(): Phaser.GameObjects.Image {
    return this.character;
  }

  getModel(): Player | Opponent {
    return this.model;
  }

  private renderName(scene: Phaser.Scene, size: number): Phaser.GameObjects.Text {
    return scene.add.text(-this.character.displayWidth * 0.45, -this.character.displayHeight * 0.55, [this.model.playerId])
      .setFontSize(size)
      .setFontFamily('Electrolize')
      .setColor('#ffffff');
  }

  private renderStats(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
    const healthSymbol = scene.add.image(0, 0, 'health')
      .setDisplaySize(this.settingsService.scaleForMin(50), this.settingsService.scaleForMin(50));
    const healthText = scene.add.text(
      this.settingsService.scaleForMin(30),
      -healthSymbol.displayHeight / 2 + this.settingsService.scaleForMin(10),
      '' + this.model.character.resources.HEALTH)
      .setFontSize(this.settingsService.scaleForMin(32))
      .setFontFamily('Electrolize')
      .setColor('#ffffff');

    const alertnessSymbol = scene.add.image(0, this.settingsService.scaleForMin(75), 'alertness')
      .setDisplaySize(this.settingsService.scaleForMin(50), this.settingsService.scaleForMin(50));
    const alertnessText = scene.add.text(
      this.settingsService.scaleForMin(30),
      -alertnessSymbol.displayHeight / 2 + alertnessSymbol.y,
      '' + this.model.character.resources.ALERTNESS)
      .setFontSize(this.settingsService.scaleForMin(32))
      .setFontFamily('Electrolize')
      .setColor('#ffffff');

    return scene.add.container(x, y,
      [healthSymbol, healthText, alertnessSymbol, alertnessText]);
  }

}
