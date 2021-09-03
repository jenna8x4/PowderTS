import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import { world,WorldSize } from "./world_manager";

export class Particle{
    constructor(position:Vector2){
        this.position = position;
        this.velocity = new Vector2(0,0);
        this.color = "white";
    }
    
    step(){
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

    shouldSwapWith(other:Moveable){
        return other.weight < this.weight;
    }

    tryMove(x: number, y: number) :boolean{
        if (this.position.y+y >= WorldSize.y || this.position.x+x >= WorldSize.x ||
            this.position.y+y < 0 || this.position.x+x < 0 ) 
            return false;

        let target = world.particles[this.position.y+y][this.position.x+x];

        if (target == undefined) {
            world.particles[this.position.y][this.position.x] = undefined;
            this.velocity.x = x; 
            this.velocity.y = y; 
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            world.particles[this.position.y][this.position.x] = this;
            return true;
        }
        else if(target instanceof Moveable) {
            if (target.velocity.x || target.velocity.y)
                return false;

            if (!this.shouldSwapWith(target))
                return false;
            
            //Swap!
            this.velocity.x = x;
            this.velocity.y = y;
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            target.velocity.x = -x;
            target.velocity.y = -y;
            target.position.x += target.velocity.x;
            target.position.y += target.velocity.y;
            world.particles[this.position.y][this.position.x] = this;
            world.particles[target.position.y][target.position.x] = target;
            
            return true;
        }
        else
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
        this.color = 'rgb(' + [
            Math.floor(240 + Math.random() *  16),
            Math.floor(230 + Math.random() *  26),
            Math.floor(  0 + Math.random() * 140),
        ].join(',') + ')';
        this.weight = 2;
    }

    step(){
        if (!this.tryMove(0,1)) { 
            if (Math.random() > 0.5) {
                if (!this.tryMove(1,1)){
                    return false;
                }
            }
            else{
                if (!this.tryMove(-1,1)){
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
        this.color = 'rgb(' + [
            Math.floor(  0 + Math.random() * 33),
            Math.floor(178 + Math.random() * 78),
            Math.floor(170 + Math.random() * 86),
        ].join(',') + ')';
        this.weight = 1;
    }

    shouldSwapWith(other:Moveable) {
        return other.weight < this.weight ||
            other.weight == this.weight && other instanceof Fluid && Math.random() <= 0.001;
    }
    
    step(){
        if (!this.tryMove(0,1)) { 
            if (Math.random() > 0.5) {
                if (!this.tryMove(1,1) && !this.tryMove(1,0))
                    return false;
            }
            else{
                if (!this.tryMove(-1,1) && !this.tryMove(-1,0))
                    return false;
            }
        }

        return true;
    }

}