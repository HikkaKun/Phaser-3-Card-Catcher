//#region import

import Phaser from 'phaser';
import Globals from '../enums/Globals';
import SceneKeys from '../enums/SceneKeys';
import Card from '../gameObjects/Card';

//#endregion

//#region class helpers
//#endregion

export default class GameScene extends Phaser.Scene {
    //#region private fields
    //#endregion

    //#region public fields
    //#endregion

    //#region lifecycle callbacks

    constructor() {
        super(SceneKeys.Game);
    }

    create() {
        const cameraCenter = this.add.container((this.game.config.width as number) / 2, (this.game.config.height as number) / 2);
        this.cameras.main.startFollow(cameraCenter);

        const card = new Card(this, (this.game.config.width as number) / 2, (this.game.config.height as number) / 2, Globals.getCardKey());
        this.add.existing(card);

        card.catchCallback = () => {
            console.log('catch!');
        };
    }

    //#endregion

    //#region private methods
    //#endregion

    //#region public methods
    //#endregion

    //#region event handlers
    //#endregion
}
