import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import { world,WorldSize } from "./world_manager";

export class Particle{
    constructor(position:Vector2){
        this.position = position;
        this.velocity = new Vector2(0,0);
        this.color = "white";
    }
    
    decide(){
    }
    
    step(){
        if(this.velocity != undefined){
            const newX = this.position.x + this.velocity.x;
            if(0 <= newX && newX < WorldSize.x){
                this.position.x = newX;
            }else{
                this.velocity.x = 0;
            }
            const newY = this.position.y + this.velocity.y;
            if(0 <= newY && newY < WorldSize.y){
                this.position.y = newY;
            }else{
                this.velocity.y = 0;
            }
        }
    }
   
    position: Vector2; 
    velocity: Vector2;
    color: string;
}

export class Moveable extends Particle{    
    constructor(position:Vector2){
        super(position)

        this.weight = 1;
        this.velocity = new Vector2(0,0);
    }

    tryMove(relativePos: Vector2) :boolean{
        if (this.position.y+relativePos.y >= WorldSize.y || this.position.x+relativePos.x >= WorldSize.x ||
            this.position.y+relativePos.y < 0 || this.position.x+relativePos.x < 0 ) 
            return false;        

        let target = world.particles[this.position.y+relativePos.y][this.position.x+relativePos.x];

        if (target != undefined) { 
            return this.trySwap(relativePos);;
        }
        else
        {
            this.velocity.x = relativePos.x; 
            this.velocity.y = relativePos.y; 
            return true;
        }
    }

    trySwap(relativePos: Vector2) :boolean{        
        let target = world.particles[this.position.y+relativePos.y][this.position.x+relativePos.x];

        if(target instanceof Moveable && target.weight < this.weight)
        {                
            //Swap!            
            this.velocity.x = target.position.x - this.position.x;
            this.velocity.y = target.position.y - this.position.y;
            //target.velocity.x = -this.velocity.x;
            //target.velocity.y = -this.velocity.y;
            
            return true;
        }
        return false;
    }

    velocity: Vector2;    
    weight: number;

}

//4 Base particle types Solid Powder Fluid Gas

export class Solid extends Particle{
    constructor(position:Vector2){
        super(position);
        this.color = "gray";
    }
}

export class Powder extends Moveable{
    constructor(position:Vector2){
        super(position);
        if (Math.random() < 0.6) {
            this.color = "yellow";
        } else {
            this.color = "khaki";
        }
        this.weight = 2;
    }

    decide(){
        if (!this.tryMove(new Vector2(0,1))) { 
            if (Math.random() > 0.5) {
                
                if (!this.tryMove(new Vector2(1,1))){
                    return false;
                }

            }
            else{

                if (!this.tryMove(new Vector2(-1,1))){
                    return false;
                }

            }
        }
        
        return true;
    }

}

export class Fluid extends Moveable{
    constructor(position:Vector2){
        super(position);
        if (Math.random() < 0.6) {
            this.color = "aqua";
        } else {
            this.color = "lightseagreen";
        }
    }
    
    decide(){
        if (!this.tryMove(new Vector2(0,1))) { 
            if (Math.random() > 0.5) {
                
                if (!this.tryMove(new Vector2(1,1))){
                    this.moveSide();
                    return true;
                }

            }
            else{

                if (!this.tryMove(new Vector2(-1,1))){
                    this.moveSide();
                    return true;
                }

            }
        }


        return true;
    }

    moveSide(){
        if (Math.random() > 0.5) {
                
            if (!this.tryMove(new Vector2(1,0))){
                return false;
            }

        }
        else{

            if (!this.tryMove(new Vector2(-1,0))){
                return false;
            }

        }
    }

}