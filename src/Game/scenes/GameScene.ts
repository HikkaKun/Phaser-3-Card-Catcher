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
    private _currentDeck!: Deck;
    private _boundsDeck!: Deck;

    private _flyDuration = 3000;

    private get _deckMaxBounds(): Phaser.Structs.Size {
        const bounds = this._boundsDeck.getBounds();

        return new Phaser.Structs.Size(bounds.width, bounds.height);
    }

    private get _deckOffsetY(): number {
        const bounds = this._boundsDeck.getBounds();

        return -(bounds.height + bounds.y);
    }

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

        this._calculateDecksPosition(false);
    }

    //#endregion

    //#region private methods

    private _handleEvents(isOn = true) {
        const func = isOn ? 'on' : 'off';

        SystemEvents[func](GameEvents.Resize, this.onResize, this);
    }

    private _throwNewCard(cardInstance?: Card) {
        const texture = Globals.getCardKey();

        if (!texture) {
            //game over
            cardInstance && cardInstance.destroy();

            return;
        }

        const a = this.game.config.height as number;
        const startY = Phaser.Math.RND.between(a * 0.1, a * 0.9);
        const targetY = Phaser.Math.RND.between(a * 0.1, a * 0.9);
        const card =
            cardInstance?.init(this._flyDuration, targetY, texture) ?? new Card(this, -10000, startY, texture, this._flyDuration, targetY);

        card.catchCallback = () => {
            const deck = this._getDeck();
            const startScale = card.scaleMultiplier;

            deck.cards++;

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
                    card.scaleMultiplier = startScale + (deck.scale - startScale) * tween.progress;

                    tween.updateTo('x', deck.x, true);
                    tween.updateTo('y', deck.y, true);
                },
                onComplete: () => {
                    deck.add(card);
                    card.x = 0;
                    card.y = 0;
                    card.scaleMultiplier = 1;
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
            this._currentDeck = new Deck(this, (this.game.config.width as number) / 2, this.game.config.height as number);
            this._decks.add(this._currentDeck);

            this._calculateDecksPosition(false);
        }

        return this._currentDeck;
    }

    private _initDeckMaxBounds() {
        const deck = new Deck(this);

        for (let i = 0; i < Deck.MAX_CARDS; i++) {
            const card = new Card(this, 0, 0, Globals.cards[0], 0, 0);
            card.stopRotation();
            card.setOrigin(0.5, 1);

            deck.add(card);
        }

        deck.setCardAngle(true);

        this._boundsDeck = deck;
    }

    private _calculateDecksPosition(isImmediately = true) {
        if (!this._deckMaxBounds) return;
        if (this._decks.list.length == 0) return;

        const zoomedGameSize = Resizer.zoomedGameSize;

        const length = this._decks.list.length;
        const distanceBetween = zoomedGameSize.width * 0.02; // 2%

        let horizontal = Math.floor(zoomedGameSize.width / this._deckMaxBounds.width);

        while (zoomedGameSize.width - (this._deckMaxBounds.width * horizontal + distanceBetween * (horizontal - 1)) < 0) {
            horizontal -= 1;
        }

        horizontal = Math.max(horizontal, 1);

        const offsetX = zoomedGameSize.width * 0.5;

        for (let i = 0; i < length; i++) {
            const deck = this._decks.list[i] as Deck;

            const x =
                this.cameras.main.worldView.left +
                offsetX +
                (this._deckMaxBounds.width + distanceBetween) * ((i % horizontal) - Math.min(horizontal, length) / 2 + 0.5);

            const y =
                this._deckOffsetY * (1 + Math.floor((length - i - 1) / horizontal)) +
                this.cameras.main.worldView.bottom -
                zoomedGameSize.height * 0.01;

            if (isImmediately) {
                deck.x = x;
                deck.y = y;
            } else {
                deck.x = Phaser.Math.Linear(deck.x, x, 0.1);
                deck.y = Phaser.Math.Linear(deck.y, y, 0.1);
            }

            if (this._deckMaxBounds.width > zoomedGameSize.width) {
                deck.scale = zoomedGameSize.width / this._deckMaxBounds.width;
            }
        }
    }

    //#endregion

    //#region public methods
    //#endregion

    //#region event handlers

    onResize(gameSize: Phaser.Structs.Size, zoom: number, zoomedGameSize: Phaser.Structs.Size) {
        setTimeout(() => {
            this._calculateDecksPosition();
        });
    }

    //#endregion
}
