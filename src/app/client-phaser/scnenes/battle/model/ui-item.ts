import {Card} from "../../../../model/card";
import {UI_AbstractObject} from "./ui-abstract-object";
import {DetailsAnimation} from "../animations/details";
import {UI_Player} from "./ui-player";

export class UI_Item extends UI_AbstractObject {

  private readonly player: UI_Player;
  private readonly model: Card;
  private readonly index: number;

  private readonly item: Phaser.GameObjects.Image;
  private readonly zone: Phaser.GameObjects.Zone;

  constructor(scene: Phaser.Scene, model: Card, owner: UI_Player, index: number) {
    super();
    this.player = owner;
    this.model = model;
    this.index = index;

    const item = scene.add.image(0, 0, model.name + '-sprite')
      .setDisplaySize(this.getItemSize(), this.getItemSize());

    this.container = scene.add.container(this.getX(), this.getY(), [item]);
    this.container.setSize(item.displayWidth, item.displayHeight);
    this.container.setName(model.name);
    this.container.setDepth(owner.getContainer().depth + 1);
    this.zone = scene.add.zone(
      this.container.x, this.container.y, this.container.displayWidth, this.container.displayHeight)
      .setRectangleDropZone(this.container.displayWidth, this.container.displayHeight)
      .setData({target: model.name})
      .setName(this.getId() + '_dropZone')
      .setDepth(owner.getContainer().depth + 1);

    scene.input.enableDebug(this.container);

    this.container.on('pointerdown', () => DetailsAnimation.getInstance().toggleDetails(this.getId()));
    this.container.on('pointerdown', () => DetailsAnimation.getInstance().focusDetails(this, scene));
    this.container.on('pointerdown', () => DetailsAnimation.getInstance().showSummary(this, scene));
    this.container.on('pointerdown', () => DetailsAnimation.getInstance().zoomItemForDetails(this, scene));
  }

  getId(): string {
    return this.model.name;
  }

  getHeight(): number {
    return this.getItemSize();
  }

  getWidth(): number {
    return this.getItemSize();
  }

  getX(): number {
    return (-this.player.getContainer().displayWidth / 2) + (this.index * this.player.getContainer().displayWidth / 3)
      + this.getWidth() / 2
      + this.player.getContainer().x;
  }

  getY(): number {
    return this.player.getContainer().y + this.player.getContainer().displayHeight / 2 - this.getHeight() / 2;
  }

  getOwner(): UI_Player {
    return this.player;
  }

  getTintTarget(): Phaser.GameObjects.Image {
    return this.item;
  }

  getModel(): Card {
    return this.model;
  }

  getAnimationTargets(): (Phaser.GameObjects.Container | Phaser.GameObjects.Zone)[] {
    return [this.container, this.zone];
  }

  getInteractiveAfterAnimation(): Phaser.GameObjects.Container[] {
    return [];
  }

  private getItemSize(): number {
    return (this.player.getContainer().displayWidth / 3) - this.settingsService.scaleForMin(25);
  }
}
