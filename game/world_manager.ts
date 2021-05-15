import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Drawable} from "../Canvas-Engine/src/engine/object2D";
import {Particle} from "./particle";
import {Renderer} from "./render";
import {Physics} from "./physics";

export const WorldSize = new Vector2(500,500);

export var ctx:CanvasRenderingContext2D;

export class World{
    constructor(){
        this.particles = new Array(WorldSize.y);

        for (let index = 0; index < this.particles.length; index++) {            
            this.particles[index] = new Array(WorldSize.x).fill(undefined);
        }
    }

    //Itterator
    private getItterVal(i : number){ 
        let x = Math.floor(i/WorldSize.x);
        let y = i - Math.floor(i/WorldSize.x)*WorldSize.x;

        let out = this.particles[y][x];
        return out;
    }
    [Symbol.iterator] = () => {
        let i = 0;
        return{
            next:()=>{
                return{
                    done: (i >= WorldSize.x * WorldSize.y),
                    value: this.getItterVal(i++)                        
                }
            }
        }
    }

    particles:Array<Array<Particle | undefined>>;

    
}

export var world = new World();

export class WorldManager extends Drawable{  
    onUpdate(){      
    }
    
    onRender(){
        super.onRender();

        //do physics
        Physics.step(world);

        //render everything
        ctx = this.ctx;
        Renderer.drawFrame(world);
    }    


    addPart(part: Particle){        
        world.particles[part.position.y][part.position.x] = part;
    }

}



//TODO: Multithreading if i fancy
/*
use this to test if supported

if (typeof(Worker) !== "undefined") {
   //great, your browser supports web workers
} else {
   //not supported
}

*/