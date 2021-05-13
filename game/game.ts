import * as CE from "../Canvas-Engine/src/engine/core";

import {Scene} from "../Canvas-Engine/src/engine/scene";
import { Vector2 } from "../Canvas-Engine/src/engine/base_types";

import {Object2D} from "../Canvas-Engine/src/engine/object2D";
import {Sprite} from "../Canvas-Engine/src/engine/sprite";
import {Outline, Shape} from "../Canvas-Engine/src/engine/shape";

import {KeyboardInput} from "../Canvas-Engine/src/engine/input";

//create scene
let level = new Scene();
window.onload = ()=>{
    //init engine
    CE.init();
    //bind scene
    CE.setActiveScene(level);
    
};
//runs every tick
level.onUpdate = ()=>{
	
}; 