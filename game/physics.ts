import {World,WorldSize,ctx} from "./world_manager";
import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Particle} from "./particle";

interface Physics{

    step(sim_state: World):World;

}

class BasicPhysics implements Physics{

    step(sim_state: World){
        let moved :Array<Particle> = [];


        //sim_state.itteratorDirection = Math.floor(Math.random() *3);

        //This line fixes everything
        sim_state.itteratorDirection++
        if (sim_state.itteratorDirection > 3) {
            sim_state.itteratorDirection = 0;
        }

        for(let part of sim_state){
            if(!part || moved.includes(part))
                continue;
            
                
            sim_state.particles[part.position.y][part.position.x] = undefined;

            part.step();     
            moved.push(part);

            sim_state.particles[part.position.y][part.position.x] = part;
            
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