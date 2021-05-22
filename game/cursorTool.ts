import { Vector2 } from "../Canvas-Engine/src/engine/base_types";
import { MouseInput } from "../Canvas-Engine/src/engine/input";
import { Cursor } from "./cursor";
import { cursor, toolbar } from "./game";
import { Fluid, Powder, Solid } from "./particle";
import { Utility } from "./util";
import { world } from "./world_manager";

export class Tool{
    constructor(placePart : (pos: Vector2) => void, color:string){
        this.callback = placePart;
        this.color = color;
    }

    draw(position:Vector2,radius:number){
        let pos = position;

        pos.x = Math.floor(pos.x / 2);
        pos.y = Math.floor(pos.y / 2);

        //mouse in world
        if(!Utility.inBounds(
            new Vector2(MouseInput.currentPosition.x/2,MouseInput.currentPosition.y/2))
            )
            return;


        for (let y = pos.y; y < (pos.y + (radius)); y++) {  
            for (let x = pos.x; x < (pos.x + (radius)); x++) {

                if(!Utility.inBounds(new Vector2(x,y)))
                    continue;
                    
                this.callback(new Vector2(x,y));                
            }
        }
    }
    
    callback : (pos: Vector2) => void;
    color:string;    

    static Tools : Map<string,Tool> = new Map<string,Tool>([
        ["SAND",

            new Tool(pos=>{

                if (!world.particles[pos.y][pos.x])
                    world.particles[pos.y][pos.x] = new Powder(pos);

            },"yellow")            
        ],
        ["WATR",

            new Tool(pos=>{

                if (!world.particles[pos.y][pos.x])
                    world.particles[pos.y][pos.x] = new Fluid(pos);

            },"aqua")            
        ],
        ["WALL",

            new Tool(pos=>{

                if (!world.particles[pos.y][pos.x])
                    world.particles[pos.y][pos.x] = new Solid(pos);

            },"gray")            
        ],
        ["ERAS",

            new Tool(pos=>{

                if (world.particles[pos.y][pos.x])
                    delete world.particles[pos.y][pos.x];

            },"red")            
        ],
        ["PICK",
            new Tool(pos=>{

                let part = world.particles[pos.y][pos.x];

                if(part){
                    let picked = Tool.Tools.get(part.partName);

                    if(picked){
                        cursor.tools.set("LMB",picked);
                        toolbar.updateOutline();
                        return;

                    }
                }


            },"lime")            
        ],
    ]);
}