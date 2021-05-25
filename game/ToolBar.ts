import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import { Drawable } from "../Canvas-Engine/src/engine/object2D";
import { Outline, Shape } from "../Canvas-Engine/src/engine/shape";
import { Tool } from "./cursorTool";
import { Utility } from "./util";
import {world, WorldManager} from "./world_manager";
import { Fluid, Powder, Solid } from "./particle";
import { KeyboardInput, MouseButton, MouseInput } from "../Canvas-Engine/src/engine/input";
import { ctx } from "../Canvas-Engine/src/engine/renderer";
import { cursor,toolbar } from "./game";



export class ToolBar extends Shape{
    constructor(){
        let shape = [
            new Vector2(0,0),
            new Vector2(1,0),
            new Vector2(1,1),
            new Vector2(0,1)
        ]

        super(shape,"#0000",new Outline(1,"white"));

        this.origin.position = new Vector2(0,600);
        this.origin.scale = new Vector2(800,30);


        Tool.Tools.forEach((v,k)=>{
            this.addButton(k);
        });

    }

    addButton(toolName:string){
        let button = new ToolButton(toolName)

        button.origin.position.y = 15;
        button.origin.position.x = 800 - (this.children.length * 60) - 30;

        this.children.push(button);
    }

    updateOutline(){
        //TODO: change button outline based on selection
    }

}

class ToolButton extends Shape{
    constructor(toolName: string){

        let shape = [
            new Vector2(0,0),
            new Vector2(1,0),
            new Vector2(1,1),
            new Vector2(0,1)
        ]

        let tool = Tool.Tools.get(toolName);

        if (!tool) {
            throw `Tool ${toolName} not found`;
        }


        super(shape,tool.color,new Outline(1,"white"));

        this.origin.scale = new Vector2(50,20);
        this.tool = tool;
        this.name = toolName;
        this.origin_in_center = true;
        this.ctxPos = new Vector2(0,0);
    }

    onUpdate(){
        let mouse = MouseInput.currentPosition;

        let pressed :MouseButton;

        

        if(MouseInput.isPressed("LMB") ){
            pressed = "LMB";
        }
        else if(MouseInput.isPressed("RMB") ){
            pressed = "RMB";
        }
        else if(MouseInput.isPressed("ScrollButton") ){
            pressed = "ScrollButton";
        }
        else
            return;
        



        if(mouse.x > this.ctxPos.x 
            &&
           mouse.y > this.ctxPos.y  
           &&
           mouse.x < this.ctxPos.x + 50 
            &&
           mouse.y < this.ctxPos.y + 20 )
        {            
            cursor.tools.set(pressed,this.tool);   
            toolbar.updateOutline(); 
        }

    }

    onRender(){
        super.onRender();


        this.ctxPos = new Vector2(
            ctx.getTransform().e,
            ctx.getTransform().f
        )

        ctx.save();
            ctx.resetTransform();

            ctx.font = "bold 16px Arial";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 0.9;
            
            let width = 50 -ctx.measureText(this.name).width;

            ctx.fillText(   this.name,this.ctxPos.x + width/2,  this.ctxPos.y+16);
            ctx.strokeText( this.name,this.ctxPos.x + width/2,  this.ctxPos.y+16);

        ctx.restore();
    }

    changeOutline(color:string){
        this.outline.color = color;
    }

    ctxPos:Vector2;
    tool : Tool;
    name :string;
}