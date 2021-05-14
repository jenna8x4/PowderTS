import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Drawable} from "../Canvas-Engine/src/engine/object2D";
import {Particle} from "./particle";

export const WorldSize = new Vector2(500,500);

export var ctx:CanvasRenderingContext2D;

export class World{
    constructor(){
        this.particles = new Array(WorldSize.y);


        for (let index = 0; index < this.particles.length; index++) {            
            this.particles[index] = new Array(WorldSize.x).fill(undefined);
        }
    }

    particles:Array<Array<Particle | undefined>>;

}

export var world = new World();

//TODO: Multithreading if i fancy
/*
use this to test if supported

if (typeof(Worker) !== "undefined") {
   //great, your browser supports web workers
} else {
   //not supported
}

*/

export class WorldManager extends Drawable{  
    onUpdate(){      
    }
    
    onRender(){
        super.onRender();

        //do physics
        this.physicsStep();

        //render everything
        ctx = this.ctx;
        for (let y = 0; y < WorldSize.y; y++) {            
            for (let x = 0; x < WorldSize.x; x++) {
                let part = world.particles[y][x]

                if (!part)
                    continue;

                part.step(); 
                ctx.fillStyle = part.color;
                ctx.fillRect(x,y,1,1); //draw rectangle :P
            }
        }
    }    

    physicsStep(){     
        //run particle physics
        for (let y = 0; y < WorldSize.y; y++) {            
            for (let x = 0; x < WorldSize.x; x++) {
                let part = world.particles[y][x]
                part?.step(); 
            }
        }

        //synchronize world position with matrix position
        this.matrixSync();
    }

    matrixSync(){
        for (let y = 0; y < WorldSize.y; y++) {            
            for (let x = 0; x < WorldSize.x; x++) {
                let part = world.particles[y][x]
                

                if (!part)
                    continue;

            
                if (!(part.position.x == x && part.position.y == y)) 
                {
                    if ((part.position.y) < WorldSize.y && (part.position.x) < WorldSize.x) {    
                        if(world.particles[part.position.y][part.position.x]){
                            part.position = new Vector2(x,y);
                            part.step();
                        }
                        else{
                            world.particles[y][x] = undefined;
                            world.particles[(part.position.y)][(part.position.x)] = part;
                        }
                    }
                }
            }
        }
    }

    addPart(part: Particle){        
        world.particles[part.position.y][part.position.x] = part;
    }

}
