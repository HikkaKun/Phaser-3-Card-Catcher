//#region import

import Phaser from 'phaser';
import Resizer from '../../Plugins/Resizer';
import Globals from '../enums/Globals';
import SceneKeys from '../enums/SceneKeys';
import TextureKeys from '../enums/TextureKeys';

//#endregion

//#region class helpers
//#endregion

export default class PreloadScene extends Phaser.Scene {
    //#region private fields

    private _text!: Phaser.GameObjects.Text;

    //#endregion

    //#region public fields
    //#endregion

    //#region lifecycle callbacks

    constructor() {
        super(SceneKeys.Preload);
    }

    create() {
        this._initResizer();
        this._initText();

        this.load.image(TextureKeys.Background, 'images/background.jpg');

        this._loadCards();
    }

    //#endregion

    //#region private methods

    private _initResizer() {
        Resizer.game = this.game;
        Resizer.camera = this.cameras.main;

        this.scale.on(Phaser.Scale.Events.RESIZE, Resizer.onResize, Resizer);
    }

    private _initText() {
        this._text = this.add
            .text((this.game.config.width as number) / 2, (this.game.config.height as number) / 2, 'Fetching new deck...', {
                fontSize: '56pt',
                align: 'center',
            })
            .setOrigin(0.5);
        this.cameras.main.startFollow(this._text);
    }

    private async _loadCards() {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52');

        if (!response.ok) {
            this._text.text = 'Cant connect to\ndeckofcardsapi.com';

            return;
        }

        const data = await response.json();

        this._text.text = 'Loading images...';

        for (const card of data.cards) {
            Globals.cards.push(card.code);
            this.load.image(card.code, card.image);
        }

        this.load.start();
        this.load.once('complete', this.onLoadingComplete, this);
    }

    //#endregion

    //#region public methods
    //#endregion

    //#region event handlers

    onLoadingComplete() {
        this._text.text = 'Done';

        this.scene.start(SceneKeys.Game);
    }

    //#endregion
}
