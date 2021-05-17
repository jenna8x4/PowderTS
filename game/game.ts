import * as CE from "../Canvas-Engine/src/engine/core";

import {Scene} from "../Canvas-Engine/src/engine/scene";
import { Vector2 } from "../Canvas-Engine/src/engine/base_types";

import {world, WorldManager} from "./world_manager";

import {KeyboardInput, MouseInput} from "../Canvas-Engine/src/engine/input";

import { Fluid, Powder, Solid } from "./particle";
import { Cursor } from "./cursor";
import { Physics } from "./physics";

//create scene
let level = new Scene();
let world_manager = new WorldManager();
let cursor = new Cursor();

window.onload = ()=>{
    //init engine
    CE.init();
    //bind scene
    CE.setActiveScene(level);
    
    level.members.push(world_manager);
    world_manager.origin.scale = new Vector2(2,2);
        
    level.members.push(cursor);



    //world_manager.addPart(new Powder(new Vector2(80,0)));  

    //Demo world
    for (let x = 60; x < 140; x++) {     
        for (let y = 0; y < 15; y++) {     
            //mix some fluid and powder
            if(x*y % 3 == 0){                
                world_manager.addPart(new Powder(new Vector2(x,y))); 
            }
            else 
                world_manager.addPart(new Fluid(new Vector2(x,y+20))); 
        }
    }

    for (let x = 0; x < 100; x++) { 
        world_manager.addPart(new Solid(new Vector2(x+0,x+60)));    
        world_manager.addPart(new Solid(new Vector2(x+0,x+61)));      
    }

    for (let x = 0; x < 100; x++) { 
        world_manager.addPart(new Solid(new Vector2(-x+200,x+60)));    
        world_manager.addPart(new Solid(new Vector2(-x+200,x+61)));      
    }

    for (let x = 0; x < 50; x++) { 
        world_manager.addPart(new Solid(new Vector2(-x+100,x+190)));    
        world_manager.addPart(new Solid(new Vector2(-x+100,x+191)));      
    }

};

//runs every tick 
level.onUpdate = ()=>{
    

    if (KeyboardInput.isJustPressed("Space")) {
        world_manager.paused = !world_manager.paused;        
    }

    if (KeyboardInput.isJustPressed("f")) {
        world_manager.paused = true;
        Physics.step(world);
    }  

}; 