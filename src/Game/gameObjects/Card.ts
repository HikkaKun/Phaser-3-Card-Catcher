//#region import

import Phaser from 'phaser';
import Resizer from '~/Plugins/Resizer';
import SystemEvents from '~/Plugins/SystemEvents/SystemEvents';
import GameEvents from '../enums/GameEvents';

//#endregion

//#region class helpers
//#endregion
export default class Card extends Phaser.GameObjects.Image {
    //#region private fields

    private _tween!: Phaser.Tweens.Tween;
    private _sceneWidth = 0;

    private _scaleMultiplier = 1;
    private _screenHeightScaler = 1;

    //#endregion

    //#region public fields

    get scaleMultiplier() {
        return this._scaleMultiplier;
    }

    set scaleMultiplier(value) {
        this._scaleMultiplier = value;

        this._updateSize();
    }

    catchCallback!: Function;
    completeCallback!: Function;

    init(flyDuration: number, targetY: number, texture?: string, isRotating = true) {
        if (texture != null) {
            this.setTexture(texture);
        }

        const angle = (Phaser.Math.RND.between(360, 540) / 1000) * flyDuration * (Math.random() < 0.5 ? -1 : 1);

        this._tween && this._tween.stop();

        if (isRotating) {
            this._tween = this.scene.tweens.add({
                targets: this,
                ease: 'Linear',
                angle: angle,
                y: targetY,
                duration: flyDuration,
                onUpdate: (tween) => this.onTweenUpdate(tween),
                onComplete: () => this.onTweenComplete(),
            });
        }

        return this;
    }

    destroy(fromScene?: boolean | undefined): void {
        this._handleEvents(false);
        this._tween && this._tween.stop();

        super.destroy(fromScene);
    }

    //#endregion

    //#region lifecycle callbacks

    constructor(scene, x, y, texture: string, flyDuration: number, targetY: number, isRotating = true) {
        super(scene, x, y, texture);

        this.setInteractive();
        this.init(flyDuration, targetY, undefined, isRotating);
        this._handleEvents();
        this.onResize(Resizer.gameSize, Resizer.zoom, Resizer.zoomedGameSize);
    }

    //#endregion

    //#region private methods

    private _handleEvents(isOn = true) {
        const func = isOn ? 'on' : 'off';

        SystemEvents[func](GameEvents.Resize, this.onResize, this);

        this[func]('pointerdown', this.onDown, this);
    }

    private _updateSize() {
        this.scale = this._screenHeightScaler * this._scaleMultiplier;
    }

    //#endregion

    //#region public methods

    stopRotation() {
        this._tween && this._tween.stop();
    }

    //#endregion

    //#region event handlers

    onTweenUpdate(tween: Phaser.Tweens.Tween) {
        const centerX = (this.scene.game.config.width as number) / 2;

        this.x = centerX + this._sceneWidth / 2 - this._sceneWidth * tween.progress;
    }

    onTweenComplete() {
        this.completeCallback instanceof Function && this.completeCallback();
    }

    onResize(gameSize: Phaser.Structs.Size, zoom: number, zoomedGameSize: Phaser.Structs.Size) {
        this._screenHeightScaler = zoomedGameSize.height / 4 / this.height;

        this._sceneWidth = zoomedGameSize.width + this.height * this.scale;

        this._updateSize();
    }

    onDown() {
        this.catchCallback instanceof Function && this.catchCallback();
    }

    //#endregion
}
