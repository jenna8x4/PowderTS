import {World,WorldSize} from "./world_manager";
import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Moveable, Particle} from "./particle";

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
            if(!part || !(part instanceof Moveable) || moved.includes(part))
                continue;
            
                
            sim_state.particles[part.position.y][part.position.x] = undefined;

            part.step();     
            moved.push(part);

            sim_state.particles[part.position.y][part.position.x] = part;
            
        }

        return sim_state;
    }
}

export const Physics = new BasicPhysics();