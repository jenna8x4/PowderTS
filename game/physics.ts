import {World,WorldSize} from "./world_manager";
import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Moveable, Particle} from "./particle";

interface Physics{

    step(sim_state: World):World;

}

class BasicPhysics implements Physics{

    step(sim_state: World){

        for(let part of sim_state)
            if (part instanceof Moveable)
                part.velocity.x = part.velocity.y = 0;

        for(let part of sim_state){
            if(!(part instanceof Moveable) || part.velocity.x || part.velocity.y)
                continue;

            part.step();
        }

        //synchronize world position with matrix position
        //this.matrixSync(sim_state);
        

        return sim_state;
    }

    private matrixSync(sim_state : World){
        for (let y = 0; y < WorldSize.y; y++) {            
            for (let x = 0; x < WorldSize.x; x++) {
                let part = sim_state.particles[y][x]
                

                if (!part)
                    continue;

            
                
                if ((part.position.y) < WorldSize.y && (part.position.x) < WorldSize.x) {    
                    if(sim_state.particles[part.position.y][part.position.x]){
                        
                        part.position = new Vector2(x,y);
                    }
                    else{
                        sim_state.particles[y][x] = undefined;
                        sim_state.particles[part.position.y][part.position.x] = part;
                    }
                }
                
            }
        }
    }

}

export const Physics = new BasicPhysics();