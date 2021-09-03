import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Drawable} from "../Canvas-Engine/src/engine/object2D";
import {Particle, Moveable} from "./particle";
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

    [Symbol.iterator] = () : Iterator<Particle> => {
        let y : number = WorldSize.y;
        let particles : Array<Particle> = [];
        return{
            next:(): IteratorResult<Particle> => {
                while (y > 0 && particles.length === 0) {
                    y--;
                    for (let x = 0; x < WorldSize.x; ++x) {
                        let p = this.particles[y][x]
                        if (p instanceof Particle) {
                            particles.push(p);
                        }
                    }
                }
                let done = (particles.length === 0);
                if(done){
                    return {done: true, value: undefined};
                } else {
                    let i = Math.floor(Math.random() * particles.length);
                    let p = particles[i];
                    particles[i] = particles[particles.length - 1];
                    particles.length--;
                    return{
                        done: false,
                        value: p
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