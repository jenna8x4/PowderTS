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


    //world_manager.addPart(new Powder(new Vector2(80,0)));  

    for (let x = 180; x < 200; x++) {     
        for (let y = 0; y < 200; y++) {     
            world_manager.addPart(new Powder(new Vector2(x,y)));  
        }
    }

    for (let x = 0; x < 100; x++) { 
        world_manager.addPart(new Solid(new Vector2(x+90,x+200)));    
        world_manager.addPart(new Solid(new Vector2(x+90,x+201)));      
    }

    for (let x = 0; x < 100; x++) { 
        world_manager.addPart(new Solid(new Vector2(-x+290,x+200)));    
        world_manager.addPart(new Solid(new Vector2(-x+290,x+201)));      
    }

 
};

//runs every tick 
level.onUpdate = ()=>{

	
}; 