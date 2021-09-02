import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Drawable} from "../Canvas-Engine/src/engine/object2D";
import {Particle} from "./particle";
import {Renderer} from "./render";
import {Physics} from "./physics";

export const WorldSize = new Vector2(400,300);

export class World{
    constructor(){
        this.particles = new Array(WorldSize.y);

        for (let index = 0; index < this.particles.length; index++) {            
            this.particles[index] = new Array(WorldSize.x).fill(undefined);
        }
    }

    [Symbol.iterator] = () => {      
        let i = WorldSize.x * WorldSize.y - 1;

        return{
            next:()=>{
                let done = (i < 0);
                if(done){
                    return {done: true};
                } else {
                    let y = Math.floor(i/WorldSize.x);
                    let x = i % WorldSize.x;
                    i -= 1;
                    return{
                        done: false,
                        value: this.particles[y][x]
                    }
                }
            }
        }
    }

    particles:Array<Array<Particle | undefined>>;
    
}

export var world = new World();

export class WorldManager extends Drawable{  
    constructor(){
        super();
        this.paused = false;
        this.frame = 0;
    }

    onUpdate(){      
    }
    
    onRender(){
        super.onRender();

        
        if(!this.paused)
            Physics.step(world);
            
        Renderer.drawFrame(world);
        document.title = ''+(++this.frame);
    }    


    addPart(part: Particle){        
        world.particles[part.position.y][part.position.x] = part;
    }

    paused:boolean;
    frame:number;
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