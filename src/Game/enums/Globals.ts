//#region import

import Utilities from '~/Plugins/Utilities';

//#endregion

//#region class helpers
//#endregion

class Globals {
    //#region private fields

    private _currentCardIndex = 0;

    //#endregion

    //#region public fields

    cards: string[] = [];

    //#endregion

    //#region lifecycle callbacks

    constructor() {}

    //#endregion

    //#region private methods
    //#endregion

    //#region public methods

    getCardKey() {
        if (this._currentCardIndex == this.cards.length) {
            return undefined;
        }

        return this.cards[this._currentCardIndex++];
    }

    //#endregion

    //#region event handlers
    //#endregion
}

export default new Globals();
