import Phaser from 'phaser';

import PreloadScene from './Game/scenes/PreloadScene';
import GameScene from './Game/scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1080,
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: [PreloadScene, GameScene],
};

export default new Phaser.Game(config);
