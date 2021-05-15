import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import { world,WorldSize } from "./world_manager";

export class Particle{
    constructor(position:Vector2){
        this.weight = 1;
        this.position = position;
        this.velocity = new Vector2(0,0);
        this.color = "white";
    }
    
    step() :boolean{
        return true;
    };

    tryMove(relativePos: Vector2) :boolean{
        if (this.position.y+relativePos.y >= WorldSize.y || this.position.x+relativePos.x >= WorldSize.x ||
            this.position.y+relativePos.y < 0 || this.position.x+relativePos.x < 0 ) 
            return false;        

        let target = world.particles[this.position.y+relativePos.y][this.position.x+relativePos.x];

        if (target != undefined) { 
            return false;
        }
        else
        {
            this.position.x += relativePos.x; 
            this.position.y += relativePos.y; 
            return true;
        }
    }

    weight: number;
    position: Vector2; 
    velocity: Vector2;    
    color: string;
}

//4 Base particle types Solid Powder Fluid Gas

export class Solid extends Particle{
    constructor(position:Vector2){
        super(position);
        this.color = "gray";
    }

    step(){
        this.velocity = new Vector2(0,0);
        return true;
    }
}

export class Powder extends Particle{
    constructor(position:Vector2){
        super(position);
        this.color = "yellow";
    }

    step(){
        if (!this.tryMove(new Vector2(0,1))) { 
            if (Math.random() > 0.5) {
                
                if (!this.tryMove(new Vector2(1,1))){
                    if (!this.tryMove(new Vector2(-1,1))){
                        return false;
                    }      
                }

            }
            else{

                if (!this.tryMove(new Vector2(-1,1))){
                    if (!this.tryMove(new Vector2(1,1))){
                        return false;
                    }
                }

            }
        }
        
        return true;
    }

}