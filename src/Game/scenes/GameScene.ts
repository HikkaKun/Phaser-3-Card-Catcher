//#region import

import Phaser from 'phaser';
import Resizer from '~/Plugins/Resizer';
import SystemEvents from '~/Plugins/SystemEvents/SystemEvents';
import GameEvents from '../enums/GameEvents';
import Globals from '../enums/Globals';
import SceneKeys from '../enums/SceneKeys';
import Card from '../gameObjects/Card';
import Deck from '../gameObjects/Deck';

//#endregion

//#region class helpers
//#endregion

export default class GameScene extends Phaser.Scene {
    //#region private fields

    private _decks!: Phaser.GameObjects.Container;
    private _deckMaxBounds!: Phaser.Structs.Size;
    private _currentDeck!: Deck;

    private _flyDuration = 3000;

    //#endregion

    //#region public fields
    //#endregion

    //#region lifecycle callbacks

    constructor() {
        super(SceneKeys.Game);
    }

    create() {
        this._initDeckMaxBounds();
        this._handleEvents();

        const camera = this.cameras.main;

        camera.setBackgroundColor('#05682D');

        Resizer.camera = camera;

        const cameraCenter = this.add.container((this.game.config.width as number) / 2, (this.game.config.height as number) / 2);
        camera.startFollow(cameraCenter);

        this._decks = this.add.container();

        this._throwNewCard();
    }

    update(time: number, delta: number): void {
        if (!this._deckMaxBounds) return;

        //calculate decks grid here
    }

    //#endregion

    //#region private methods

    private _handleEvents(isOn = true) {
        const func = isOn ? 'on' : 'off';

        SystemEvents[func](GameEvents.Resize, this.onResize, this);
    }

    private _throwNewCard(cardInstance?: Card) {
        const a = this.game.config.height as number;
        const startY = Phaser.Math.RND.between(a * 0.1, a * 0.9);
        const targetY = Phaser.Math.RND.between(a * 0.1, a * 0.9);
        const card =
            cardInstance?.init(this._flyDuration, targetY, Globals.getCardKey()) ??
            new Card(this, -10000, startY, Globals.getCardKey(), this._flyDuration, targetY);

        card.catchCallback = () => {
            const deck = this._getDeck();

            card.stopRotation();
            card.disableInteractive();
            this.tweens.add({
                targets: card,
                ease: Phaser.Math.Easing.Sine.InOut,
                angle: 0,
                duration: 250,
                x: deck.x,
                y: deck.y,
                onUpdate: (tween, target) => {
                    card.setOrigin(0.5, 0.5 + 0.5 * tween.progress);

                    tween.updateTo('x', deck.x, true);
                    tween.updateTo('y', deck.y, true);
                },
                onComplete: () => {
                    deck.add(card);
                    card.x = 0;
                    card.y = 0;
                },
            });

            this._flyDuration -= 50;
            this._throwNewCard();
        };

        card.completeCallback = () => {
            this._throwNewCard(card);
        };

        this.add.existing(card);
    }

    private _getDeck(): Deck {
        if (this._currentDeck == null || this._currentDeck.isFull) {
            this._currentDeck = new Deck(this, 540, 540);
            this._decks.add(this._currentDeck);
        }

        return this._currentDeck;
    }

    private _initDeckMaxBounds() {
        const deck = new Deck(this, 540, 540);

        for (let i = 0; i < Deck.MAX_CARDS; i++) {
            const card = new Card(this, 0, 0, Globals.cards[0], 0, 0);
            card.stopRotation();
            card.setOrigin(0.5, 1);

            deck.add(card);
        }

        deck.setCardAngle(true);

        setTimeout(() => {
            const bounds = deck.getBounds();

            this._deckMaxBounds = new Phaser.Structs.Size(bounds.width, bounds.height);

            deck.destroy();
        });
    }

    //#endregion

    //#region public methods
    //#endregion

    //#region event handlers

    onResize(gameSize: Phaser.Structs.Size, zoom: number) {}

    //#endregion
}
