import {Card} from '../../../../model/card';
import {HighlightAnimation} from '../animations/highlight';
import {UI_AbstractObject} from './ui-abstract-object';
import {DetailsAnimation} from '../animations/details';

// tslint:disable-next-line:class-name
export class UI_CardInHand extends UI_AbstractObject {

  private readonly model: Card;
  private readonly index: number;

  private readonly template: Phaser.GameObjects.Image;

  private detailsButtonShown: boolean;
  private detailsButton: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, model: Card, index: number) {
    super();
    this.model = model;
    this.index = index;

    this.template = this.renderTemplate(scene).setName('template');
    const text = this.renderName(scene, this.template, model);
    const image = this.renderImage(scene, this.template, model);

    this.container = scene.add.container(this.getX(), this.getY(), [this.template, text, image]);

    this.container.setSize(this.template.displayWidth, this.template.displayHeight);
    this.container.setDepth(index + 3);
    this.container.setData({card: model.name});
    this.container.setInteractive();

    scene.input.setDraggable(this.container);
    if (!this.gameService.isPlayable(model, this.gameService.playerState.character)) {
      this.template.setTint(0xd3d3d3);
    }

    this.setCardEvents(scene);

    scene.input.on('drag', () => {
      if (this.detailsButtonShown) {
        this.toggleDetailsButton();
      }
    });
  }

  getIndex(): number {
    return this.index;
  }

  getId(): string {
    return this.model.name;
  }

  getModel(): Card {
    return this.model;
  }

  getAnimationTargets(): (Phaser.GameObjects.Container | Phaser.GameObjects.Zone)[] {
    return [this.container];
  }

  getInteractiveAfterAnimation(): Phaser.GameObjects.Container[] {
    return [];
  }

  getHeight(): number {
    return this.settingsService.scaleForMin(700);
  }

  getWidth(): number {
    return this.settingsService.scaleForMin(500);
  }

  getX(): number {
    return (this.settingsService.getScreenWidth() / 2.5)
      + (this.index * (this.settingsService.getScreenWidth() / 12))
      + (this.template.displayWidth / 2);
  }

  getY(): number {
    return (this.settingsService.getScreenHeight() * 0.75) + (this.template.displayHeight / 2);
  }

  getTintTarget(): Phaser.GameObjects.Image {
    return this.template;
  }

  toggleDetailsButton(): void {
    this.detailsButtonShown = !this.detailsButtonShown;
    if (!this.detailsButtonShown) {
      this.detailsButton.setVisible(false);
    }
  }

  private renderName(scene: Phaser.Scene, template: Phaser.GameObjects.Image, model: Card): Phaser.GameObjects.Text {
    return scene.add.text(this.getTextX(template.displayWidth), this.getTextY(template.displayHeight), [model.name])
      .setFontSize(this.settingsService.scaleForMin(36))
      .setFontFamily('Electrolize')
      .setColor('#000000');
  }

  private renderTemplate(scene: Phaser.Scene): Phaser.GameObjects.Image {
    return scene.add.image(0, 0, 'card')
      .setDisplaySize(this.getWidth(), this.getHeight());
  }

  private displayDetailsButton(scene: Phaser.Scene): Phaser.GameObjects.Container {
    if (this.detailsButton) {
      this.detailsButton.setVisible(true);
      return;
    }
    const button = scene.add.rectangle(0, 0,
      this.settingsService.scaleForMin(200),
      this.settingsService.scaleForMin(100),
      0xa2ff33, 1)
      .setInteractive();
    const text = scene.add.text(0, 0, ['DETAILS'])
      .setFontSize(this.settingsService.scaleForMin(20))
      .setFontFamily('Electrolize')
      .setColor('#000000');
    this.detailsButton = scene.add.container(this.getX() - this.getWidth() / 3, this.getY() - this.getHeight() / 2, [button, text])
      .setSize(this.settingsService.scaleForMin(200), this.settingsService.scaleForMin(100))
      .setDepth(this.container.depth + 1)
      .setInteractive();

    // y can't I set this events on the container?? it doesn't work somehow
    button.on('pointerup', () => {
      HighlightAnimation.getInstance().resetHighlight(this, scene);
      DetailsAnimation.getInstance().toggleDetails(this.getId());
      DetailsAnimation.getInstance().focusDetails(this, scene);
      DetailsAnimation.getInstance().showSummary(this, scene);
      DetailsAnimation.getInstance().zoomObjForDetails(this, scene);

      this.toggleDetailsButton();

      this.container.removeAllListeners();
      this.container.setDepth(this.container.depth + 10); // counter depth reduction caused by reset highlight function
      this.container.once('pointerup', () => {
        HighlightAnimation.getInstance().highlight(this, scene);
        DetailsAnimation.getInstance().toggleDetails(this.getId());
        DetailsAnimation.getInstance().focusDetails(this, scene);
        DetailsAnimation.getInstance().showSummary(this, scene);
        DetailsAnimation.getInstance().zoomObjForDetails(this, scene);
        this.setCardEvents(scene);
      });
    });
  }

  private getTextX(templateWidth: number): number {
    return -(templateWidth / 2) + this.settingsService.scaleForMin(40);
  }

  private getTextY(templateHeight: number): number {
    return -(templateHeight / 2) + this.settingsService.scaleForMin(35);
  }

  private renderImage(scene: Phaser.Scene, template: Phaser.GameObjects.Image, model: Card): Phaser.GameObjects.Image {
    const card = model.image ? model.name : 'no-img';
    return scene.add.image(
      this.getTextX(template.displayWidth),
      this.getTextY(template.displayHeight) + this.settingsService.scaleForMin(50),
      card).setOrigin(0, 0)
      .setDisplaySize(this.settingsService.scaleForMin(420), this.settingsService.scaleForMin(300));
  }

  private setCardEvents(scene: Phaser.Scene): void {
    this.container.on('pointerover', () => HighlightAnimation.getInstance().highlight(this, scene));
    this.container.on('pointerout', () => HighlightAnimation.getInstance().resetHighlight(this, scene));
    this.container.on('pointerdown', () => this.displayDetailsButton(scene));
    this.container.on('pointerdown', () => this.toggleDetailsButton());
  }
}
