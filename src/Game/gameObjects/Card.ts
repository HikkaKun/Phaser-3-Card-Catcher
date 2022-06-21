//#region import

import Phaser from 'phaser';
import SystemEvents from '~/Plugins/SystemEvents/SystemEvents';
import GameEvents from '../enums/GameEvents';

//#endregion

export default class Card extends Phaser.GameObjects.Image {
    //#region class helpers
    //#endregion

    //#region private fields

    private _tween!: Phaser.Tweens.Tween;
    private _sceneWidth = 0;

    //#endregion

    //#region public fields

    catchCallback!: Function;

    init(flyDuration, texture = null) {
        if (texture != null) {
            this.setTexture(texture);
        }

        const angle = (Phaser.Math.RND.between(360, 540) / 1000) * flyDuration * (Math.random() < 0.5 ? -1 : 1);

        this._tween && this._tween.stop();
        this._tween = this.scene.tweens.add({
            targets: this,
            ease: 'Linear',
            angle: angle,
            duration: flyDuration,
            onUpdate: (tween) => this.onTweenUpdate(tween),
            onComplete: () => this.onTweenComplete(),
        });
    }

    destroy(fromScene?: boolean | undefined): void {
        this._handleEvents(false);
        this._tween && this._tween.stop();

        super.destroy(fromScene);
    }

    //#endregion

    //#region lifecycle callbacks

    constructor(scene, x, y, texture, flyDuration = 3000) {
        super(scene, x, y, texture);

        this.setInteractive();
        this.init(flyDuration);
        this._handleEvents();
        this.onResize(this.scene.scale.gameSize);
    }

    //#endregion

    //#region private methods

    private _handleEvents(isOn = true) {
        const func = isOn ? 'on' : 'off';

        SystemEvents[func](GameEvents.Resize, this.onResize, this);

        this[func]('pointerdown', this.onDown, this);
    }

    //#endregion

    //#region public methods
    //#endregion

    //#region event handlers

    onTweenUpdate(tween: Phaser.Tweens.Tween) {
        const centerX = (this.scene.game.config.width as number) / 2;

        this.x = centerX + this._sceneWidth / 2 - this._sceneWidth * tween.progress;
    }

    onTweenComplete() {
        this.visible = false;
    }

    onResize(gameSize: Phaser.Structs.Size) {
        this.scale = gameSize.height / 4 / this.height;

        this._sceneWidth = gameSize.width + this.height * this.scale;
    }

    onDown() {
        this.catchCallback instanceof Function && this.catchCallback();
    }

    //#endregion
}
