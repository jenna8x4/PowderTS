import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Shape,Outline} from "../Canvas-Engine/src/engine/shape";
import {MouseInput} from "../Canvas-Engine/src/engine/input";
import { ctx } from "../Canvas-Engine/src/engine/renderer";

export class Cursor extends Shape{
    constructor(){
        let defaultShape = [
            new Vector2(10,0),
            new Vector2(10,10),
            new Vector2(0,10),
            new Vector2(0,0)
        ]        

        super(defaultShape,"#0000",new Outline(1,'white'));

        this.origin_in_center = true;
        this.previousPosition = new Vector2(0,0);
    }

    changeRadius(radius : number){
        radius = Math.round(radius);

    }

    onRender(){               
        if(MouseInput.currentPosition)
        {
            this.previousPosition = this.origin.position;
            this.origin.position = MouseInput.currentPosition;
        }
        ctx.clearRect(0,0,10,10);

        super.onRender();
    }

    private previousPosition:Vector2;

}