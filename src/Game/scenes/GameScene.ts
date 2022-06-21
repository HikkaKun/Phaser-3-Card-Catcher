//#region import

import Phaser from 'phaser';
import Resizer from '~/Plugins/Resizer';
import Globals from '../enums/Globals';
import SceneKeys from '../enums/SceneKeys';
import Card from '../gameObjects/Card';

//#endregion

//#region class helpers
//#endregion

export default class GameScene extends Phaser.Scene {
    //#region private fields

    private _table!: Phaser.GameObjects.Layer;
    private _decks!: Phaser.GameObjects.Layer;

    //#endregion

    //#region public fields
    //#endregion

    //#region lifecycle callbacks

    constructor() {
        super(SceneKeys.Game);
    }

    create() {
        const camera = this.cameras.main;
        Resizer.camera = camera;

        const cameraCenter = this.add.container((this.game.config.width as number) / 2, (this.game.config.height as number) / 2);
        camera.startFollow(cameraCenter);

        const graphics = this.add.graphics();
        graphics.fillStyle(0xaaaaaa, 1);
        graphics.fillRect(0, 0, 1080, 1080);

        this._table = this.add.layer();
        this._decks = this.add.layer();

        this._throwNewCard();
    }

    //#endregion

    //#region private methods

    private _throwNewCard() {
        const card = new Card(this, 0, 0, Globals.getCardKey());
        this._table.add(card);

        card.catchCallback = () => {
            console.log('catch!');
        };
    }

    //#endregion

    //#region public methods
    //#endregion

    //#region event handlers
    //#endregion
}
