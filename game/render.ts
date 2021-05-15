import {World,WorldSize,ctx,world} from "./world_manager";

interface Renderer{

    drawFrame(sim_state: World) : void;

}

class CanvasRenderer implements Renderer{

    drawFrame(sim_state: World){
        ctx.strokeStyle = '#777';
        ctx.strokeRect(0,0,400,300);

        for(let part of sim_state){

            if (!part)
                continue;
 

            ctx.fillStyle = part.color;
            ctx.fillRect(part.position.x,part.position.y,1,1); //draw rectangle :P
            
        }
        
    }

}

export const Renderer = new CanvasRenderer();