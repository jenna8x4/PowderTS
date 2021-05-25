import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import { WorldSize } from "./world_manager";

export class Utility{

    static inBounds(position:Vector2){
        if (position.y >= WorldSize.y || position.x >= WorldSize.x ||
            position.y < 0 || position.x < 0 ) 
            return false;

        return true;
    }

    static vectorInterpolate(from:Vector2, to:Vector2, progress:number){
        let out = new Vector2
        (
            to.x - from.x,
            to.y - from.y
        );
        
        out.x *= progress;
        out.y *= progress;
        
        out.x += from.x;
        out.y += from.y;

        return out;     
    }

    static rgbToHex(color :{r:number,g:number,b:number}):string {
        let r = color.r;
        let g = color.g;
        let b = color.b;

        let rhex = r.toString(16);
        rhex = ( rhex.length == 1 ? "0" + rhex : rhex);

        let ghex = g.toString(16);
        ghex = ( ghex.length == 1 ? "0" + ghex : ghex);

        let bhex = b.toString(16);
        bhex = ( bhex.length == 1 ? "0" + bhex : bhex);

        return `#${rhex}${ghex}${bhex}`;
    }

}