import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import { world } from "./world_manager";

export interface Particle{
    step() :void; //Physics step
    
    weight: number;
    position: Vector2; 
    velocity: Vector2;    
    color: string;
}


export class Solid implements Particle{
    constructor(position:Vector2){
        this.weight = 1;
        this.position = position;
        this.velocity = new Vector2(0,0);
        this.color = "gray";
    }

    step(){
        this.velocity = new Vector2(0,0);
    }

    weight: number;
    position: Vector2; 
    velocity: Vector2;  
    color:string;
}

export class Powder implements Particle{
    constructor(position:Vector2){
        this.weight = 1;
        this.position = position;
        this.gridPos = new Vector2(Math.round(this.position.x),Math.round(this.position.y));
        this.velocity = new Vector2(0,0);
        this.color = "yellow";
    }
    step(){
        this.gridPos = new Vector2(Math.round(this.position.x),Math.round(this.position.y));
        
        if ( world.particles[(this.position.y+1)][this.position.x] ) {
            if (!world.particles[(this.position.y+1)][this.position.x+1] ) 
            {
                this.position.y += 1;
                this.position.x += 1;          
            }
            else if (! world.particles[(this.position.y+1)][this.position.x-1] )
            {
                this.position.y += 1;
                this.position.x += -1;
            }
        }
        else{
            this.position.y += 1;
        }
    }

    weight: number;
    position: Vector2; 
    gridPos: Vector2; 
    velocity: Vector2;  
    color:string;
}