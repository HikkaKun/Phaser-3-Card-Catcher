import Phaser from 'phaser';

import PreloadScene from './Game/scenes/PreloadScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    scene: [PreloadScene],
};

export default new Phaser.Game(config);
