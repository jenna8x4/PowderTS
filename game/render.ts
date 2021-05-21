import {World,WorldSize,world} from "./world_manager";
import {canvas,ctx} from "../Canvas-Engine/src/engine/renderer"
import { Utility } from "./util";

interface Renderer{

    drawFrame(sim_state: World) : void;

}


class BasicRenderer implements Renderer{

    drawFrame(sim_state: World){

        for(let part of sim_state){

            if (!part)
                continue;
 

            ctx.fillStyle = Utility.rgbToHex(part.color);
            ctx.fillRect(part.position.x,part.position.y,1,1); //draw rectangle :P           

        }        
    }
}


class PixelRenderer implements Renderer{
    constructor(){

        this.canvasData = undefined;
        //ctx.imageSmoothingEnabled = false;
    }

    drawFrame(sim_state: World){
        this.canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        

        for (let x = 0; x < canvas.width; x++) {            
            for (let y = 0; y < canvas.height; y++) {
                let part = world.particles[Math.floor(y/2)][Math.floor(x/2)];

                if (!part)
                    continue;
                
                
                var index = (x + y * canvas.width) * 4;

                this.canvasData.data[index + 0] = part.color.r;
                this.canvasData.data[index + 1] = part.color.g;
                this.canvasData.data[index + 2] = part.color.b;
                this.canvasData.data[index + 3] = 255;

            }
        }     
        ctx.putImageData(this.canvasData, 0, 0);
    }

    canvasData:ImageData | undefined;

}

export const Renderer = new PixelRenderer();