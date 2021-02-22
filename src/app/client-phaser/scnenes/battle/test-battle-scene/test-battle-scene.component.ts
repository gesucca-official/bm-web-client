import {Component, OnInit} from '@angular/core';
import Phaser from "phaser";
import {PhaserSettingsService} from "../../../phaser-settings.service";
import {BattleScene} from "../battle-scene";
import {GameService} from "../../../../service/game.service";

@Component({
  selector: 'app-test-battle-scene',
  templateUrl: './test-battle-scene.component.html',
  styleUrls: ['./test-battle-scene.component.css']
})
export class TestBattleSceneComponent implements OnInit {

  config: Phaser.Types.Core.GameConfig;

  constructor(protected gameService: GameService, protected settingsService: PhaserSettingsService) {
  }

  ngOnInit(): void {
    window['gameService'] = this.gameService;
    window['settingsService'] = this.settingsService;
    this.gameService.gameState = JSON.parse(
      //'{"gameId":"04f0b1b20353f62d97a6e71859e1999dd1d006957db72fdd48c0fc7b1f64328a","players":{"asd":{"playerId":"asd","character":{"name":"Tossico del Serraglio","itemsSize":3,"items":[],"resources":{"HEALTH":100,"ALERTNESS":35,"TOXICITY":10},"statuses":[],"immunities":["TOXICITY"],"timers":[],"sprite":"tossico.png"},"cardsInHand":[{"priority":1,"cost":{},"canTarget":["NEAR_ITEM"],"boundToCharacter":null,"name":"Desiderio Incontrollabile","effect":"<p>Basic Action <i>(you can always do this if its conditions are met)</i></p><p>Grab an Item near you and immediately use it. You lose half of your Alertness, rounded down.</p>","image":"no-img.png","sprite":null,"bindingName":"com.basic.ToxicGrab","characterBound":false,"basicAction":true,"lastResort":false,"item":false},{"priority":2,"cost":{},"canTarget":["OPPONENT"],"boundToCharacter":"junkie.character.ToxicJunkie","name":"Ghigno co\' i\' Denti Marci","effect":"<p>Fallback Move <i>(discard another card instead of this)</i></p><p>Quick Move <i>(you act first than others when doing this)</i></p><p>-5 Alertness to Target and +5 Alertness to you.</p>","image":"no-img.png","sprite":null,"bindingName":"junkie.character.RottenSmile","characterBound":true,"basicAction":false,"lastResort":false,"item":false},{"priority":1,"cost":{},"canTarget":["OPPONENT"],"boundToCharacter":"junkie.character.ToxicJunkie","name":"Ago Marcio e Spezzato","effect":"<p>Fallback Move <i>(discard another card instead of this)</i></p><p>5 Cut Damage to Target and +5 Toxicity to both you and Target.</p>","image":"no-img.png","sprite":null,"bindingName":"junkie.character.PatheticBlade","characterBound":true,"basicAction":false,"lastResort":false,"item":false},{"priority":2,"cost":{"ALERTNESS":10},"canTarget":["SELF"],"boundToCharacter":null,"name":"Presa Male di Brutto","effect":"<p>Quick Move <i>(you act first than others when doing this)</i></p><p>Double your Toxicity, but You lose immunity to it for 3 Turns.</p>","image":"no-img.png","sprite":null,"bindingName":"junkie.BadTrip","characterBound":false,"basicAction":false,"lastResort":false,"item":false},{"priority":1,"cost":{"TOXICITY":10},"canTarget":["OPPONENT"],"boundToCharacter":null,"name":"Tossicone Scatarrante","effect":"<p>-5 Alertness and +5 Toxicity to Target.</p>","image":"no-img.png","sprite":null,"bindingName":"junkie.Cough","characterBound":false,"basicAction":false,"lastResort":false,"item":false},{"priority":1,"cost":{"TOXICITY":5},"canTarget":["OPPONENT"],"boundToCharacter":null,"name":"Rabbia Psicotica da Meth","effect":"<p>15 Hit Damage to Target and 5 Hit Damage to you.</p>","image":"no-img.png","sprite":null,"bindingName":"junkie.MethDrivenRage","characterBound":false,"basicAction":false,"lastResort":false,"item":false}],"deck":17},"ComPlayer_5352":{"playerId":"ComPlayer_5352","character":{"name":"Tossico del Serraglio","itemsSize":3,"items":[{"priority":1,"cost":{},"canTarget":["SELF"],"boundToCharacter":null,"name":"Peroni da 66, calda","effect":"<p>Alcohol: +5. Equip (single use): next Hit Damage you deal is increased and turned to Cut Damage.</p>","image":"no-img.png","sprite":"item-sprite.png","bindingName":"com.items.RottenBeer","characterBound":false,"basicAction":false,"lastResort":false,"item":true}],"resources":{"HEALTH":100,"ALERTNESS":35,"TOXICITY":10},"statuses":[],"immunities":["TOXICITY"],"timers":[],"sprite":"tossico.png"},"cardsInHand":6,"deck":16}},"resolvedMoves":[],"timeBasedEffects":{},"over":false,"winner":"NONE"}'
      '{"gameId":"8927d7a654bc18d57406089e5032ad45b8932764628699fe29e389e29632e1a7","players":{"ComPlayer_9373":{"playerId":"ComPlayer_9373","character":{"name":"Tossico del Serraglio","itemsSize":3,"items":[{"cost":{},"priority":1,"canTarget":["SELF"],"name":"Tennents Super","effect":"<p>Alcohol: +10. Spawn a Broken Beer Bottle Token near you.</p>","image":null,"sprite":"item-sprite.png","lastResort":false,"item":true,"basicAction":false,"characterBound":false},{"cost":{},"priority":1,"canTarget":["SELF"],"name":"Tennents Super","effect":"<p>Alcohol: +10. Spawn a Broken Beer Bottle Token near you.</p>","image":null,"sprite":"item-sprite.png","lastResort":false,"item":true,"basicAction":false,"characterBound":false}],"resources":{"HEALTH":85,"ALERTNESS":35,"TOXICITY":10},"statuses":[],"immunities":["TOXICITY"],"sprite":"tossico.png"},"cardsInHand":6,"deck":8},"ComPlayer_2078":{"playerId":"ComPlayer_2078","character":{"name":"Spazienzio de la Ucciso","itemsSize":1,"items":[],"resources":{"HEALTH":100,"ALERTNESS":20,"VIOLENCE":15},"statuses":[],"immunities":[],"sprite":"spazienzio.png"},"cardsInHand":6,"deck":16},"ComPlayer_1155":{"playerId":"ComPlayer_1155","character":{"name":"Tossico del Serraglio","itemsSize":3,"items":[{"cost":{},"priority":1,"canTarget":["SELF"],"name":"Tennents Super","effect":"<p>Alcohol: +10. Spawn a Broken Beer Bottle Token near you.</p>","image":null,"sprite":"item-sprite.png","lastResort":false,"item":true,"basicAction":false,"characterBound":false},{"cost":{},"priority":1,"canTarget":["SELF"],"name":"Tennents Super","effect":"<p>Alcohol: +10. Spawn a Broken Beer Bottle Token near you.</p>","image":null,"sprite":"item-sprite.png","lastResort":false,"item":true,"basicAction":false,"characterBound":false},{"cost":{},"priority":1,"canTarget":["SELF"],"name":"Peroni da 66, calda","effect":"<p>Alcohol: +5. Equip (single use): next Hit Damage you deal is increased and turned to Cut Damage.</p>","image":null,"sprite":"item-sprite.png","lastResort":false,"item":true,"basicAction":false,"characterBound":false}],"resources":{"HEALTH":100,"ALERTNESS":40,"TOXICITY":10},"statuses":[],"immunities":["TOXICITY"],"sprite":"tossico.png"},"cardsInHand":6,"deck":7},"ComPlayer_7794":{"playerId":"ComPlayer_7794","character":{"name":"Tossico del Serraglio","itemsSize":3,"items":[{"cost":{},"priority":1,"canTarget":["SELF"],"name":"Peroni da 66, calda","effect":"<p>Alcohol: +5. Equip (single use): next Hit Damage you deal is increased and turned to Cut Damage.</p>","image":null,"sprite":"item-sprite.png","lastResort":false,"item":true,"basicAction":false,"characterBound":false}],"resources":{"HEALTH":100,"ALERTNESS":20,"TOXICITY":10},"statuses":[],"immunities":["TOXICITY"],"sprite":"tossico.png"},"cardsInHand":6,"deck":9},"asd":{"playerId":"Player1","character":{"name":"Tossico del Serraglio","itemsSize":3,"items":[{"cost":{},"priority":1,"canTarget":["SELF"],"name":"Peroni da 66, calda","effect":"<p>Alcohol: +5. Equip (single use): next Hit Damage you deal is increased and turned to Cut Damage.</p>","image":null,"sprite":"item-sprite.png","lastResort":false,"item":true,"basicAction":false,"characterBound":false}],"resources":{"HEALTH":95,"ALERTNESS":35,"TOXICITY":5},"statuses":[],"immunities":["TOXICITY"],"sprite":"tossico.png"},"cardsInHand":[{"cost":{},"priority":1,"canTarget":["NEAR_ITEM"],"name":"Desiderio Incontrollabile","effect":"<p>Basic Action <i>(you can always do this if its conditions are met)</i></p><p>Grab an Item near you and immediately use it. You lose half of your Alertness, rounded down.</p>","image":null,"sprite":null,"lastResort":false,"item":false,"basicAction":true,"characterBound":false},{"cost":{},"priority":2,"canTarget":["OPPONENT"],"name":"Ghigno co\' i\' Denti Marci","effect":"<p>Fallback Move <i>(discard another card instead of this)</i></p><p>Quick Move <i>(you act first than others when doing this)</i></p><p>-5 Alertness to Target and +5 Alertness to you.</p>","image":null,"sprite":null,"lastResort":false,"item":false,"basicAction":false,"characterBound":true},{"cost":{},"priority":1,"canTarget":["OPPONENT"],"name":"Ago Marcio e Spezzato","effect":"<p>Fallback Move <i>(discard another card instead of this)</i></p><p>5 Cut Damage to Target and +5 Toxicity to both you and Target.</p>","image":null,"sprite":null,"lastResort":false,"item":false,"basicAction":false,"characterBound":true},{"cost":{},"priority":1,"canTarget":["NEAR_ITEM"],"name":"Grab","effect":"<p>Grab an Item near you and immediately use it.</p>","image":"grab.png","sprite":null,"lastResort":false,"item":false,"basicAction":false,"characterBound":false},{"cost":{"TOXICITY":10},"priority":1,"canTarget":["OPPONENT"],"name":"Tossicone Scatarrante","effect":"<p>-5 Alertness and +5 Toxicity to Target.</p>","image":null,"sprite":null,"lastResort":false,"item":false,"basicAction":false,"characterBound":false},{"cost":{"ALERTNESS":10},"priority":0,"canTarget":["FAR_ITEM"],"name":"Steal","effect":"<p>Slow Move <i>(others act first when you are doing this)</i></p><p>Steal an Item from Target and place it near you, ready to be used.</p>","image":null,"sprite":null,"lastResort":false,"item":false,"basicAction":false,"characterBound":false}],"deck":8}},"resolvedMoves":[{"playedCardName":"Ghigno co\' i\' Denti Marci","playerId":"ComPlayer_1155","targetId":"ComPlayer_7794","gameId":"8927d7a654bc18d57406089e5032ad45b8932764628699fe29e389e29632e1a7","choices":{"DISCARD_ONE":"Rabbia Psicotica da Meth"},"moveReport":{"OPPONENT":["ALERTNESS: 25->20 (-5)"],"SELF":["ALERTNESS: 35->40 (5)"]},"void":false},{"playedCardName":"Rabbia Psicotica da Meth","playerId":"Player1","targetId":"ComPlayer_9373","gameId":"8927d7a654bc18d57406089e5032ad45b8932764628699fe29e389e29632e1a7","choices":null,"moveReport":{"OPPONENT":["HEALTH: 100->85 (-15)"],"SELF":["HEALTH: 100->95 (-5)"]},"void":false},{"playedCardName":"BELLO IL TUO GIOCATTOLO SI","playerId":"ComPlayer_2078","targetId":"Player1","gameId":"8927d7a654bc18d57406089e5032ad45b8932764628699fe29e389e29632e1a7","choices":{"TARGET_ITEM":"Tennents Super"},"moveReport":{"OPPONENT":["Destroyed Tennents Super"],"SELF":[]},"void":false},{"playedCardName":"Steal","playerId":"ComPlayer_7794","targetId":"ComPlayer_9373","gameId":"8927d7a654bc18d57406089e5032ad45b8932764628699fe29e389e29632e1a7","choices":{"TARGET_ITEM":"Tennents Super"},"moveReport":{"OPPONENT":[],"SELF":["Stolen Tennents Super from ComPlayer_9373"]},"void":false},{"playedCardName":"Scatto Repentino","playerId":"ComPlayer_9373","targetId":"ComPlayer_7794","gameId":"8927d7a654bc18d57406089e5032ad45b8932764628699fe29e389e29632e1a7","choices":{},"moveReport":{"OPPONENT":["Switched Place with Target, Items that were near Him now are near You"],"SELF":[]},"void":false}],"timeBasedEffects":{"ComPlayer_9373":[],"ComPlayer_2078":[],"ComPlayer_1155":[],"ComPlayer_7794":[],"Player1":[]},"over":false,"winner":"NONE"}'
    );
    this.gameService.playerId = 'asd';
    this.config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaserClient',
        autoCenter: Phaser.Scale.NONE,
        width: this.settingsService.getScreenWidth(),
        height: this.settingsService.getScreenHeight()
      },
      scene: [BattleScene]
    }
  }

}