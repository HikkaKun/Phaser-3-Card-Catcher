//#region import

import Phaser from 'phaser';
import Card from './Card';

//#endregion

//#region class helpers
//#endregion

export default class Deck extends Phaser.GameObjects.Container {
    //#region private fields
    //#endregion

    //#region public fields

    static MAX_ANGLE = 150;
    static MAX_ANGLE_BETWEEN = 30;
    static MIN_ANGLE_BETWEEN = 10;
    static ANGLE_OFFSET = (180 - Deck.MAX_ANGLE) / 2;

    //#endregion

    //#region lifecycle callbacks

    constructor(scene, x?, y?) {
        super(scene, x, y);

        this._handleEvents();
    }

    //#endregion

    //#region private methods

    private _handleEvents(isOn = true) {
        const func = isOn ? 'on' : 'off';

        this.scene.events.on('update', this.onUpdate, this);
    }

    //#endregion

    //#region public methods
    //#endregion

    //#region event handlers

    onUpdate(sys, time, delta) {
        if (this.list.length == 0) return;

        const length = this.list.length;
        const angle1 = Deck.MAX_ANGLE / (length + 1);
        const angle = Phaser.Math.Clamp(angle1, Deck.MIN_ANGLE_BETWEEN, Deck.MAX_ANGLE_BETWEEN);

        for (let i = 0; i < length; i++) {
            const card = this.list[i] as Card;

            card.angle = angle * i + (Deck.MAX_ANGLE - angle * (length - 1)) * 0.5 - Deck.MAX_ANGLE + 90 - Deck.ANGLE_OFFSET;
        }
    }

    //#endregion
}
