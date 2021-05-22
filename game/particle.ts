import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import { Utility } from "./util";
import { world,WorldSize } from "./world_manager";


export class Particle{
    constructor(position:Vector2){
        this.position = position;
        this.color = {r:255,g:255,b:255};

    }
    
    step(){
    };
   
    position: Vector2; 
    color: {r:number,g:number,b:number};
    partName = "NONE";
}

export class Moveable extends Particle{    
    constructor(position:Vector2){
        super(position)

        this.weight = 1;
        this.velocity = new Vector2(0,0);
    }

    tryMove(relativePos: Vector2) :boolean{
        if (!Utility.inBounds(new Vector2(this.position.x+relativePos.x,this.position.y+relativePos.y))) 
            return false;        

        let target = world.particles[this.position.y+relativePos.y][this.position.x+relativePos.x];

        if (target != undefined) { 
            return this.trySwap(relativePos);;
        }
        else
        {
            this.position.x += relativePos.x; 
            this.position.y += relativePos.y; 
            return true;
        }
    }

    trySwap(relativePos: Vector2) :boolean{        
        let target = world.particles[this.position.y+relativePos.y][this.position.x+relativePos.x];

        if(target instanceof Moveable && target.weight < this.weight)
        {                
            //Swap!            
            world.particles[this.position.y][this.position.x] = undefined;
            world.particles[target.position.y][target.position.x] = undefined;

            let newPos = new Vector2(target.position.x,target.position.y);

            target.position.x = this.position.x;
            target.position.y = this.position.y;

            this.position = newPos;
            
            world.particles[this.position.y][this.position.x] = this;
            world.particles[target.position.y][target.position.x] = target;
            
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
        this.color = {r:120,g:120,b:120};
    }

    step(){
    }

    partName = "WALL";
}

export class Powder extends Moveable{
    constructor(position:Vector2){
        super(position);
        this.color = {r:255,g:255,b:0};;
        this.weight = 2;
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


    partName = "SAND";
}

export class Fluid extends Moveable{
    constructor(position:Vector2){
        super(position);
        this.color = {r:10,g:170,b:255};
    }

    step(){
        if (!this.tryMove(new Vector2(0,1))) { 
            if (Math.random() > 0.5) {
                
                if (!this.tryMove(new Vector2(1,1))){
                    if (!this.tryMove(new Vector2(-1,1))){
                        this.moveSide();
                        return true;
                    }      
                }

            }
            else{

                if (!this.tryMove(new Vector2(-1,1))){
                    if (!this.tryMove(new Vector2(1,1))){
                        this.moveSide();
                        return true;
                    }
                }

            }
        }


        return true;
    }

    moveSide(){
        if (Math.random() > 0.5) {
                
            if (!this.tryMove(new Vector2(1,0))){
                if (!this.tryMove(new Vector2(-1,0))){
                    return false;
                }      
            }

        }
        else{

            if (!this.tryMove(new Vector2(-1,0))){
                if (!this.tryMove(new Vector2(1,0))){
                    return false;
                }
            }

        }
    }


    partName = "WATR";
}