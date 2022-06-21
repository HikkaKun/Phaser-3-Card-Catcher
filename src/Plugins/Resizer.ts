//#region import

import Phaser from 'phaser';
import GameEvents from '~/Game/enums/GameEvents';
import SystemEvents from './SystemEvents/SystemEvents';

//#endregion

//#region class helpers
//#endregion

class Resizer {
    //#region private fields
    //#endregion

    //#region public fields

    camera!: Phaser.Cameras.Scene2D.Camera;
    game!: Phaser.Game;

    //#endregion

    //#region lifecycle callbacks

    constructor() {}

    //#endregion

    //#region private methods
    //#endregion

    //#region public methods
    //#endregion

    //#region event handlers

    onResize(gameSize: Phaser.Structs.Size, baseSize, displaySize, preWidth, preHeight) {
        const camera = this.camera;

        const width = this.game.config.width as number;
        const height = this.game.config.height as number;

        const zoom = Math.max(width / gameSize.width, height / gameSize.height);

        camera.zoom = zoom;

        SystemEvents.emit(GameEvents.Resize, gameSize);
    }

    //#endregion
}

export default new Resizer();
