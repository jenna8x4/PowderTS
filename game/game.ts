import * as CE from "../Canvas-Engine/src/engine/core";

import {Scene} from "../Canvas-Engine/src/engine/scene";
import { Vector2 } from "../Canvas-Engine/src/engine/base_types";

import {world, WorldManager,ctx} from "./world_manager";

import {KeyboardInput} from "../Canvas-Engine/src/engine/input";

import { Powder, Solid } from "./particle";

//create scene
let level = new Scene();
let world_manager = new WorldManager();
window.onload = ()=>{
    //init engine
    CE.init();
    //bind scene
    CE.setActiveScene(level);
    
    level.members.push(world_manager);
    world_manager.origin.scale = new Vector2(10,10);



    for (let index = 0; index < 32; index++) {
        if (index % 2 == 0)
            continue;

        world_manager.addPart(new Powder(new Vector2(5,index)));  
    }

    for (let index = 0; index < 11; index++) {
        world_manager.addPart(new Solid(new Vector2(index,49)));        
    }
 
};

//runs every tick 
level.onUpdate = ()=>{

	
}; 