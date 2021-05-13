import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Drawable} from "../Canvas-Engine/src/engine/object2D";
import {Particle} from "./particle";

export const WorldSize = new Vector2(100,100);

export var ctx:CanvasRenderingContext2D;

export class World{
    constructor(){
        this.particles = new Array(WorldSize.y);


        for (let index = 0; index < this.particles.length; index++) {            
            this.particles[index] = new Array(WorldSize.x);
        }
    }

    particles:Array<Array<Particle | undefined>>;

}

export var world = new World();



export class WorldManager extends Drawable{  
    onUpdate(){        
    }
    
    onRender(){
        this.physicsStep();
        super.onRender();

        for (let y = 0; y < WorldSize.y; y++) {            
            for (let x = 0; x < WorldSize.x; x++) {
                let part = world.particles[y][x]

                if (!part || !ctx)
                    continue;

                ctx.fillStyle = part.color;
                ctx.fillRect(x,y,1,1); //draw rectangle :P
            }
        }
    }    

    physicsStep(){
        ctx = this.ctx;

        if(!world.particles)
            return;
            
        //run particle physics
        for (let y = 0; y < WorldSize.y; y++) {            
            for (let x = 0; x < WorldSize.x; x++) {
                let part = world.particles[y][x]
                part?.step(); 
            }
        }

        
        //synchronize world position with matrix position
        let bufferWorld = world;
        for (let y = 0; y < WorldSize.y; y++) {            
            for (let x = 0; x < WorldSize.x; x++) {
                let part = world.particles[y][x]
                

                if (!part)
                    continue;
            
                if (part.position.x == x && part.position.y == y) 
                    continue;

                bufferWorld.particles[y][x] = undefined;
                bufferWorld.particles[Math.round(part.position.y)][Math.round(part.position.x)] = part;
            }
        }
        world = bufferWorld;
    }

    addPart(part: Particle){        
        world.particles[part.position.y][part.position.x] = part;
    }
}
