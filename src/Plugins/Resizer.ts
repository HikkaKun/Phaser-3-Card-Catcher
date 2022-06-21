//#region import

import Phaser from 'phaser';
import GameEvents from '~/Game/enums/GameEvents';
import SystemEvents from './SystemEvents/SystemEvents';

//#endregion

//#region class helpers
//#endregion

class Resizer {
    //#region private fields

    private _camera!: Phaser.Cameras.Scene2D.Camera;

    //#endregion

    //#region public fields

    game!: Phaser.Game;

    get camera() {
        return this._camera;
    }

    set camera(camera: Phaser.Cameras.Scene2D.Camera) {
        this._camera = camera;

        this.onResize(this.game.scale.gameSize);
    }

    //#endregion

    //#region lifecycle callbacks

    constructor() {}

    //#endregion

    //#region private methods
    //#endregion

    //#region public methods
    //#endregion

    //#region event handlers

    onResize(gameSize: Phaser.Structs.Size, baseSize = null, displaySize = null, preWidth = null, preHeight = null) {
        const camera = this.camera;

        const width = this.game.config.width as number;
        const height = this.game.config.height as number;

        const isLandscape = gameSize.width > gameSize.height;
        let zoom = 1;

        if (isLandscape) {
            zoom = gameSize.height / height;
        } else {
            zoom = gameSize.width / width;
        }

        camera.zoom = zoom;

        SystemEvents.emit(GameEvents.Resize, gameSize, zoom);
    }

    //#endregion
}

export default new Resizer();
