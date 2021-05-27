import {World,WorldSize} from "./world_manager";
import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Particle} from "./particle";

interface Physics{

    step(sim_state: World):World;

}

class BasicPhysics implements Physics{

    step(sim_state: World){

        for(let part of sim_state){
            if(!part)
                continue;

            part.decide();
        }

        let parts :Array<Particle> = new Array();
        for(let part of sim_state){
            if(!part)
                continue;

            sim_state.particles[part.position.y][part.position.x] = undefined;
            part.step();            
            parts.push(part);
        }


        let conflicts :Map<Particle, Set<Particle>> = new Map();
        for(let part of parts){

            const first = sim_state.particles[part.position.y][part.position.x]
            if(first == undefined){
                sim_state.particles[part.position.y][part.position.x] = part;
            } else {
                let conflict = conflicts.get(first);
                if(!conflict){
                    conflict = new Set([first])
                    conflicts.set(first, conflict);
                }
                conflict.add(part);
            }
        }

        console.log(conflicts.size + ' conflicts');
        for(let [first, conflict] of conflicts.entries()){
            conflicts.delete(first);
            sim_state.particles[first.position.y][first.position.x] = undefined;
            for(let part of conflict){
                part.position.x -= part.velocity.x;
                part.position.y -= part.velocity.y;
                part.velocity.x = 0;
                part.velocity.y = 0;

                const first = sim_state.particles[part.position.y][part.position.x];
                if(first == undefined){
                    sim_state.particles[part.position.y][part.position.x] = part;
                } else {
                    let conflict = conflicts.get(first);
                    if(!conflict){
                        conflict = new Set([first])
                        conflicts.set(first, conflict);
                    }
                    conflict.add(part);
                }
            }
            console.log(conflicts.size + ' conflicts');
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