import Utilities from '~/Plugins/Utilities';

interface IGlobals {
    cards: string[];

    getCardKey: Function;
}

function cardCounter() {
    let i = 0;

    return function () {
        if (i >= Globals.cards.length) {
            Utilities.shuffleArray(Globals.cards);
            i = 0;
        }

        return i++;
    };
}

const getCardIndex = cardCounter();

const Globals: IGlobals = {
    cards: [],

    getCardKey: function () {
        const i = getCardIndex();

        return this.cards[i];
    },
};

export default Globals;
