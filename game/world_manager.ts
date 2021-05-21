import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Drawable} from "../Canvas-Engine/src/engine/object2D";
import {ctx} from "../Canvas-Engine/src/engine/renderer";
import {Particle} from "./particle";
import {Renderer} from "./render";
import {Physics} from "./physics";

export const WorldSize = new Vector2(400,300);

export class World{
    constructor(){
        this.itteratorDirection = 2;

        this.particles = new Array(WorldSize.y);

        for (let index = 0; index < this.particles.length; index++) {            
            this.particles[index] = new Array(WorldSize.x).fill(undefined);
        }
    }

    //Itterator
    private getItterVal(i : number):Particle | undefined{ 
        let y = Math.floor(i/WorldSize.x);
        let x = i - Math.floor(i/WorldSize.x)*WorldSize.x;

        
        switch (this.itteratorDirection) {            
            case 1:
                return this.particles[y][WorldSize.x - x -1];                
                                
            case 2:
                return this.particles[WorldSize.y - y - 1][x];     
            
            case 3:
                return this.particles[WorldSize.y - y -1][WorldSize.x - x -1];     
            
            default:
                return this.particles[y][x];
        }

    }
    [Symbol.iterator] = () => {      
        let i = 0;

        return{
            next:()=>{
                return{
                    done: (i >= (WorldSize.x * WorldSize.y - 1)),
                    value: this.getItterVal(i++)                        
                }
            }
        }
    }

    particles:Array<Array<Particle | undefined>>;

    itteratorDirection :number; //0-3 tl tr bl br
    
}

export var world = new World();

export class WorldManager extends Drawable{  
    constructor(){
        super();
        this.paused = false;
    }

    onUpdate(){      
    }
    
    onRender(){
        super.onRender();

        
        if(!this.paused)
            Physics.step(world);
            
        Renderer.drawFrame(world);

        ctx.strokeStyle = '#777';
        ctx.strokeRect(0,0,400,300);
    }    


    addPart(part: Particle){        
        world.particles[part.position.y][part.position.x] = part;
    }

    paused:boolean;
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