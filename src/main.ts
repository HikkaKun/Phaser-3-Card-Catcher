import 'regenerator-runtime/runtime';

import Phaser from 'phaser';

import PreloadScene from './Game/scenes/PreloadScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1080,
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    backgroundColor: '#05682D',
    scene: [PreloadScene],
};

export default new Phaser.Game(config);
