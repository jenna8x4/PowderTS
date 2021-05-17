import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import { WorldSize } from "./world_manager";

export class Utility{

    static inBounds(position:Vector2){
        if (position.y >= WorldSize.y || position.x >= WorldSize.x ||
            position.y < 0 || position.x < 0 ) 
            return false;

        return true;
    }

    static vectorInterpolate(eachStep: Function, from:Vector2, to:Vector2){
        let direction = new Vector2(
            to.x - from.x,
            to.y - from.y
        );

        let step = direction.normalized();
        let current = from;

        //while(current)

    }

}