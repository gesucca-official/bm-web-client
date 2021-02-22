export class TitleScene extends Phaser.Scene {

  public static KEY = 'titleScene';

  title: Phaser.GameObjects.Text;
  browseText: Phaser.GameObjects.Text;
  private settingsService: any;

  constructor() {
    super({key: TitleScene.KEY});
    this.settingsService = window['settingsService'];
  }

  preload() {
  }

  create() {
    this.title = this.add.text(
      this.settingsService.getScreenWidth() / 2,
      this.settingsService.getScreenHeight() / 2,
      ['BOTTE MICIDIALI'])
      .setOrigin(0.5, 0.5)
      .setFontSize(this.settingsService.scaleForMin(72) * window.devicePixelRatio)
      .setFontFamily('Electrolize')
      .setColor('#00ffff');

    this.browseText = this.add.text(
      this.settingsService.getScreenWidth() * (12 / 16),
      this.settingsService.getScreenHeight() * (14 / 16),
      ['BROWSE CARDS'])
      .setFontSize(this.settingsService.scaleForMin(24) * window.devicePixelRatio)
      .setFontFamily('Electrolize')
      .setColor('#00ffff')
      .on('pointerdown', () => alert('clicked'))
      .on('pointerover', () => this.browseText.setColor('#ff69b4'))
      .on('pointerout', () => this.browseText.setColor('#00ffff'))
      .setInteractive();
  }

}
