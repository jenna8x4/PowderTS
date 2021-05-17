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

        this.tools = new Map<MouseButton,Tool>();

        this.tools.set("LMB",new Tool(pos=>{
            if (!world.particles[pos.y][pos.x])
                world.particles[pos.y][pos.x] = new Powder(pos);
        }));

        this.tools.set("RMB",new Tool(pos=>{
            delete world.particles[pos.y][pos.x];
        }));

        this.tools.set("ScrollButton",new Tool(pos=>{
            if (!world.particles[pos.y][pos.x])
                world.particles[pos.y][pos.x] = new Solid(pos);
        }));



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

        this.tools.forEach((tool,button)=>{
            if (MouseInput.isPressed(button)) {
                tool.draw(this);
                return;
            }
        });
    }

    onRender(){               
        if(MouseInput.currentPosition)
        {
            this.origin.position.x = Math.round( MouseInput.currentPosition.x /2) *2;
            this.origin.position.y = Math.round(MouseInput.currentPosition.y /2) * 2;

            this.origin.position.x -= this.radius;
            this.origin.position.y -= this.radius;
        }

        //console.log(this.ctx == ctx);

        super.onRender();
    }

    radius:number;
    tools:Map<MouseButton,Tool>;

}