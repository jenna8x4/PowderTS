import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import { world,WorldSize } from "./world_manager";

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
        this.velocity = new Vector2(0,0);
        this.color = "yellow";
    }
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

    step(){
        if (!this.tryMove(new Vector2(0,1))) { 
            if (Math.random() > 0.5) {
                
                if (!this.tryMove(new Vector2(1,1))){
                    if (!this.tryMove(new Vector2(-1,1))){
                        //this.color = 'yellow';
                        return;
                    }
                    else        
                        //this.color = 'blue';
                }
                //else        
                  //  this.color = 'lime';

            }
            else{

                if (!this.tryMove(new Vector2(-1,1))){
                    if (!this.tryMove(new Vector2(1,1))){
                       // this.color = 'yellow';
                        return;
                    }
                    //else        
                     //   this.color = 'lime';
                }
                //else        
                   // this.color = 'blue';

            }
        }
        //else        
            //this.color = 'aqua';
    }

    weight: number;
    position: Vector2; 
    velocity: Vector2;  
    color:string;
}