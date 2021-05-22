import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import {Shape,Outline} from "../Canvas-Engine/src/engine/shape";
import {MouseButton, MouseInput} from "../Canvas-Engine/src/engine/input";
import { ctx } from "../Canvas-Engine/src/engine/renderer";
import { world } from "./world_manager";
import { Fluid, Powder, Solid } from "./particle";
import { Utility } from "./util";
import { Tool } from "./cursorTool";

export class Cursor extends Shape{
    constructor(){
        let defaultShape = [
            new Vector2(2,0),
            new Vector2(2,2),
            new Vector2(0,2),
            new Vector2(0,0)
        ];

        super(defaultShape,"#0000",new Outline(1,'#FFF9'));

        this.origin_in_center = true;
        this.radius = 1;

        this.tools = new Map<MouseButton,Tool | undefined>([
            ["LMB",         Tool.Tools.get("SAND")],
            ["RMB",         Tool.Tools.get("ERAS")],
            ["ScrollButton",Tool.Tools.get("PICK")]
        ]);

        this.wasPressed = false;
        this.lastPos = new Vector2(0,0);
    }

    changeRadius(radius : number){
        radius = Math.round(radius);
        
        this.verticies = [
            new Vector2(radius*2,0),
            new Vector2(radius*2,radius*2),
            new Vector2(0,radius*2),
            new Vector2(0,0)
        ]        

    }

    onUpdate(){
        this.radius -= MouseInput.getWheelOffset().y / 100;
        if (this.radius < 1) {
            this.radius = 1;
        }

        this.changeRadius(this.radius);

        let placed = false;

        this.tools.forEach((tool,button)=>{
            if (MouseInput.isPressed(button)) {
                if(!tool)
                    return;
                    
                    this.draw(tool);
                
                return;
            }
        });
    }

    draw(tool :Tool){
        let myPos = new Vector2(this.origin.position.x,this.origin.position.y);


        let distance = new Vector2(
            myPos.x - this.lastPos.x,
            myPos.y - this.lastPos.y
        )
        let step = 1 / distance.lenght();

        for (let index = 0; index < 1; index+=step) {
            let target = Utility.vectorInterpolate(this.lastPos,myPos,index);


            tool.draw(target,this.radius);
        }       

    }

    onRender(){               
        if(MouseInput.currentPosition)
        {            
            this.lastPos = new Vector2( this.origin.position.x,this.origin.position.y);
           
            this.origin.position.x = Math.round( MouseInput.currentPosition.x /2) *2;
            this.origin.position.y = Math.round(MouseInput.currentPosition.y /2) * 2;

            this.origin.position.x -= this.radius;
            this.origin.position.y -= this.radius;
        }

        //console.log(this.ctx == ctx);

        super.onRender();
    }

    radius:number;
    tools:Map<MouseButton,Tool | undefined>;

    wasPressed:boolean;
    lastPos:Vector2;
}