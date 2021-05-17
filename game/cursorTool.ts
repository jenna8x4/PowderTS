import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import { Cursor } from "./cursor";
import { world } from "./world_manager";

export class Tool{
    constructor(placePart : (pos: Vector2) => void){
        this.callback = placePart;
    }

    draw(cursor:Cursor){
        let pos = cursor.origin.position;
        pos.x = Math.floor(pos.x / 2);
        pos.y = Math.floor(pos.y / 2);

        for (let y = pos.y; y < (pos.y + (cursor.radius)); y++) {  
            for (let x = pos.x; x < (pos.x + (cursor.radius)); x++) {
                this.callback(new Vector2(x,y));                
            }
        }
    }
    
    callback : (pos: Vector2) => void;
}