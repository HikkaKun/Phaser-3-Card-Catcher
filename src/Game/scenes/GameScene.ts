//#region import

import Phaser from 'phaser';
import Resizer from '~/Plugins/Resizer';
import Globals from '../enums/Globals';
import SceneKeys from '../enums/SceneKeys';
import Card from '../gameObjects/Card';
import Deck from '../gameObjects/Deck';

//#endregion

//#region class helpers
//#endregion

export default class GameScene extends Phaser.Scene {
    //#region private fields

    private _table!: Phaser.GameObjects.Layer;
    private _decksLayer!: Phaser.GameObjects.Layer;

    //#endregion

    //#region public fields
    //#endregion

    //#region lifecycle callbacks

    constructor() {
        super(SceneKeys.Game);
    }

    create() {
        const camera = this.cameras.main;

        camera.setBackgroundColor('#05682D');

        Resizer.camera = camera;

        const cameraCenter = this.add.container((this.game.config.width as number) / 2, (this.game.config.height as number) / 2);
        camera.startFollow(cameraCenter);

        const graphics = this.add.graphics();
        graphics.fillStyle(0xaaaaaa, 1);
        graphics.fillRect(0, 0, 1080, 1080);

        this._table = this.add.layer();
        this._decksLayer = this.add.layer();

        this.deck = this._decksLayer.add(new Deck(this, 540, 540));

        this._throwNewCard();
    }

    //#endregion

    //#region private methods

    private _throwNewCard() {
        const card = new Card(this, 0, 0, Globals.getCardKey(), 3000, 540);
        this._table.add(card);

        card.catchCallback = () => {
            card.stop();
            card.disableInteractive();
            this.tweens.add({
                targets: card,
                ease: Phaser.Math.Easing.Sine.InOut,
                angle: 0,
                duration: 250,
                x: 540,
                y: 540,
                onUpdate: (tween, target) => {
                    card.setOrigin(0.5, 0.5 + 0.5 * tween.progress);
                },
                onComplete: () => {
                    this.deck.add(card);
                    card.x = 0;
                    card.y = 0;
                },
            });

            this._throwNewCard();
        };
    }

    //#endregion

    //#region public methods
    //#endregion

    //#region event handlers
    //#endregion
}
