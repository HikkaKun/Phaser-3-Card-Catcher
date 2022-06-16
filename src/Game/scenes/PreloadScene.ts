//#region import

import Phaser from 'phaser';
import Globals from '../enums/Globals';
import SceneKeys from '../enums/SceneKeys';

//#endregion

//#region class helpers
//#endregion

export default class PreloadScene extends Phaser.Scene {
    //#region private fields
    //#endregion

    //#region public fields
    //#endregion

    //#region lifecycle callbacks

    constructor() {
        super(SceneKeys.Preload);
    }

    preload() {
        fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52').then((response) => {
            response.json().then((data) => this._loadCards(data));
        });
    }

    create() {}
    //#endregion

    //#region private methods

    private _loadCards(data) {
        for (const card of data.cards) {
            Globals.cards.push(card.code);
            this.load.image(card.code, card.image);
        }
    }

    //#endregion

    //#region public methods
    //#endregion

    //#region event handlers
    //#endregion
}
