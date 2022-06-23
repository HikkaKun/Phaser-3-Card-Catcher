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
    private _isLandscape!: boolean;
    private _zoom = 1;
    private _gameSize!: Phaser.Structs.Size;
    private _zoomedGameSize!: Phaser.Structs.Size;

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

    get isLandscape() {
        return this._isLandscape;
    }

    get zoom() {
        return this._zoom;
    }

    get gameSize() {
        return this._gameSize;
    }

    get zoomedGameSize() {
        return this._zoomedGameSize;
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

        this._isLandscape = isLandscape;

        let zoom = 1;

        if (isLandscape) {
            zoom = gameSize.height / height;
        } else {
            zoom = gameSize.width / width;
        }

        camera.zoom = zoom;
        this._zoom = zoom;
        this._gameSize = gameSize;
        this._zoomedGameSize = new Phaser.Structs.Size(gameSize.width / zoom, gameSize.height / zoom);

        SystemEvents.emit(GameEvents.Resize, gameSize, zoom, this.zoomedGameSize);
    }

    //#endregion
}

export default new Resizer();
