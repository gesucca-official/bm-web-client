import {UI_CardInHand} from '../model/ui-card-in-hand';
import {HighlightAnimation} from './highlight';
import {DetailsAnimation} from './details';
import {PhaserSettingsService} from '../../../phaser-settings.service';
import {Card} from '../../../../model/card';
import {LogService} from '../../../../service/log.service';

export class DiscardChoiceAnimation {

  private constructor() {
    // @ts-ignore
    this.settings = window.settingsService;
    // @ts-ignore
    this.logger = window.logger;
  }

  private static _INSTANCE: DiscardChoiceAnimation;
  private settings: PhaserSettingsService;
  private logger: LogService;

  public static getInstance(): DiscardChoiceAnimation {
    if (!this._INSTANCE) {
      this._INSTANCE = new DiscardChoiceAnimation();
    }
    return this._INSTANCE;
  }

  public triggerDiscardChoice(scene: Phaser.Scene,
                              playedCard: UI_CardInHand,
                              cardsInHand: UI_CardInHand[],
                              callback: (cardToDiscard: string) => void
  ): void {
    HighlightAnimation.getInstance().resetHighlight(playedCard, scene);
    // I have to let the reset highlight animation end before zooming
    // TODO find a way to intercept the callback of the reset hightlight tween instead of timeoutting
    setTimeout(() => {
      DetailsAnimation.getInstance().toggleDetails(playedCard.getId());
      DetailsAnimation.getInstance().focusDetails(playedCard, scene);
      DetailsAnimation.getInstance().zoomObjForDetails(playedCard, scene);
      playedCard.getContainer().removeAllListeners();
      playedCard.getContainer().setDepth(playedCard.getContainer().depth + 10);
      playedCard.toggleDetailsButton();

      cardsInHand.forEach(c => {
        if ((c.getModel().characterBound || c.getModel().basicAction) && c.getModel().name !== playedCard.getModel().name) {
          c.getContainer().setDepth(0);
        } // get it behind the blur, don't care for consequences since after a card is played I reload the scene
      });

      this.drawDiscardDropZone(scene, playedCard.getModel());

      scene.input.on('drop', (pointer, gameObject, dropZone) => {
        this.logger.debug('Drop Event occurred! Logging gameObject and dropZone');
        this.logger.debug(gameObject.data.list);
        this.logger.debug(dropZone.data.list);
        if (dropZone.data.list.choice === 'DISCARD_ONE') {
          callback(gameObject.data.list.card);
        }
      });
    }, 300);

  }

  private drawDiscardDropZone(scene: Phaser.Scene, card: Card): void {
    const rect = scene.add.rectangle(this.settings.getScreenWidth() / 2, this.settings.getScreenHeight() / 3,
      this.settings.getScreenWidth() / 3, this.settings.getScreenHeight() / 3, 0x343434, 1.0)
      .setOrigin(0, 0)
      .setDepth(5)
      .setInteractive();

    scene.add.text(this.settings.getScreenWidth() / 2, this.settings.getScreenHeight() / 2, ['DISCARD A CARD'])
      .setFontSize(this.settings.scaleForMin(50))
      .setFontFamily('Electrolize')
      .setDepth(5)
      .setColor('#ffffff');

    scene.add.zone(rect.x, rect.y, rect.displayWidth, rect.displayHeight)
      .setRectangleDropZone(rect.displayWidth, rect.displayHeight)
      .setData({choice: 'DISCARD_ONE'}) // TODO some standardization of drop zones data may be needed
      .setDepth(5)
      .setName('Discard_dropZone');
    scene.input.enableDebug(rect);
  }
}
