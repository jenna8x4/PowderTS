/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/engineConfig.ts":
/*!*****************************!*\
  !*** ./src/engineConfig.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resizeViewport = exports.fps = exports.canvasSelector = void 0;
/**Querry selector for the canvas element
*/
var canvasSelector = "#game";
exports.canvasSelector = canvasSelector;
var resizeViewport = false;
exports.resizeViewport = resizeViewport;
/**Target frames per second
*/
var fps = 60;
exports.fps = fps;


/***/ }),

/***/ "./src/engine/base_types.ts":
/*!**********************************!*\
  !*** ./src/engine/base_types.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transform = exports.Vector2 = void 0;
/**
 * 2D Vector
 * Stores X and Y
*/
var Vector2 = /** @class */ (function () {
    function Vector2(X, Y) {
        this.x = X;
        this.y = Y;
    }
    Vector2.prototype.lenght = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    Vector2.prototype.normalized = function () {
        var newVector = new Vector2(this.x, this.y);
        var lenght = newVector.lenght();
        newVector.x /= lenght;
        newVector.y /= lenght;
        return newVector;
    };
    return Vector2;
}());
exports.Vector2 = Vector2;
/**
 * Stores position rotation (degrees) and scale
 */
var Transform = /** @class */ (function () {
    function Transform(pos, rot, scale) {
        this.position = pos ? pos : new Vector2(0, 0);
        this.rotation = rot ? rot : 0;
        this.scale = scale ? scale : new Vector2(1, 1);
    }
    return Transform;
}());
exports.Transform = Transform;


/***/ }),

/***/ "./src/engine/core.ts":
/*!****************************!*\
  !*** ./src/engine/core.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.init = exports.setActiveScene = exports.activeScene = void 0;
var Rendering = __webpack_require__(/*! ./renderer */ "./src/engine/renderer.ts");
var Config = __webpack_require__(/*! ./../engineConfig */ "./src/engineConfig.ts");
var input_1 = __webpack_require__(/*! ./../engine/input */ "./src/engine/input.ts");
/**
 * Set the scene you want to be currently displayed and updated
 */
function setActiveScene(scene) {
    exports.activeScene = scene;
}
exports.setActiveScene = setActiveScene;
/**
 * Initialize the engine
*/
function init() {
    Rendering.init();
    input_1.KeyboardInput.init();
    input_1.MouseInput.init();
    setInterval(update, 1000 / Config.fps);
}
exports.init = init;
/**
 * Don't use externaly.
 * Calls onUpdate and onRender methods
 */
function update() {
    if (exports.activeScene === null || exports.activeScene === void 0 ? void 0 : exports.activeScene.onUpdate)
        exports.activeScene.onUpdate();
    exports.activeScene === null || exports.activeScene === void 0 ? void 0 : exports.activeScene.update();
    Rendering.render();
}


/***/ }),

/***/ "./src/engine/input.ts":
/*!*****************************!*\
  !*** ./src/engine/input.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MouseInput = exports.KeyboardInput = exports.KeyState = void 0;
var base_types_1 = __webpack_require__(/*! ./base_types */ "./src/engine/base_types.ts");
var renderer_1 = __webpack_require__(/*! ./renderer */ "./src/engine/renderer.ts");
var KeyState;
(function (KeyState) {
    KeyState[KeyState["PRESSED"] = 0] = "PRESSED";
    KeyState[KeyState["HOLD"] = 1] = "HOLD";
    KeyState[KeyState["RELEASE"] = 2] = "RELEASE";
})(KeyState = exports.KeyState || (exports.KeyState = {}));
var KeyboardInput = /** @class */ (function () {
    function KeyboardInput() {
    }
    /**
     * Add event listeners for key presses.
     * Allready called by the init function from core.ts
     */
    KeyboardInput.init = function () {
        KeyboardInput.keyStates = new Map();
        addEventListener("keydown", function (e) {
            if (KeyboardInput.preventDefault)
                e.preventDefault();
            KeyboardInput.keyStates.set(KeyboardInput.stringToKey(e.key), KeyState.PRESSED);
        });
        addEventListener("keyup", function (e) {
            if (KeyboardInput.preventDefault)
                e.preventDefault();
            KeyboardInput.keyStates.set(KeyboardInput.stringToKey(e.key), KeyState.RELEASE);
        });
    };
    /**
     * Check for pressed key
     */
    KeyboardInput.isPressed = function (key) {
        var state = this.keyStates.get(key);
        if (state == KeyState.PRESSED) {
            this.keyStates.set(key, KeyState.HOLD);
        }
        return !(state === undefined || state == KeyState.RELEASE);
    };
    KeyboardInput.isJustPressed = function (key) {
        var state = this.keyStates.get(key);
        if (state == KeyState.PRESSED) {
            this.keyStates.set(key, KeyState.HOLD);
        }
        return state == KeyState.PRESSED;
        //return 
    };
    KeyboardInput.stringToKey = function (key) {
        var val = key.replace("Dead", "~");
        val = val.replace(" ", "Space");
        var keytype = val;
        return keytype;
    };
    KeyboardInput.preventDefault = true;
    return KeyboardInput;
}());
exports.KeyboardInput = KeyboardInput;
var MouseInput = /** @class */ (function () {
    function MouseInput() {
    }
    MouseInput.init = function () {
        MouseInput.buttonStates = new Map();
        MouseInput.mouseWheelChange = { x: 0, y: 0, z: 0 };
        renderer_1.canvas.onmousemove = function (e) {
            if (MouseInput.preventDefault)
                e.preventDefault();
            MouseInput.currentPosition = new base_types_1.Vector2(e.x, e.y);
        };
        renderer_1.canvas.onwheel = function (e) {
            if (MouseInput.preventDefault)
                e.preventDefault();
            MouseInput.mouseWheelChange.x += e.deltaX;
            MouseInput.mouseWheelChange.y += e.deltaY;
            MouseInput.mouseWheelChange.z += e.deltaZ;
        };
        renderer_1.canvas.onmousedown = function (e) {
            if (MouseInput.preventDefault)
                e.preventDefault();
            MouseInput.buttonStates.set(MouseInput.numberToButton(e.button), KeyState.PRESSED);
        };
        renderer_1.canvas.onmouseup = function (e) {
            if (MouseInput.preventDefault)
                e.preventDefault();
            MouseInput.buttonStates.set(MouseInput.numberToButton(e.button), KeyState.RELEASE);
        };
        //prevent context menu
        if (MouseInput.preventDefault) {
            renderer_1.canvas.oncontextmenu = function (e) {
                e.preventDefault();
            };
        }
    };
    MouseInput.getWheelOffset = function () {
        var offset = MouseInput.mouseWheelChange;
        var out = { x: offset.x, y: offset.y, z: offset.z };
        MouseInput.mouseWheelChange = { x: 0, y: 0, z: 0 };
        return out;
    };
    MouseInput.isPressed = function (button) {
        var state = MouseInput.buttonStates.get(button);
        if (state == KeyState.PRESSED) {
            MouseInput.buttonStates.set(button, KeyState.HOLD);
        }
        return !(state === undefined || state == KeyState.RELEASE);
    };
    MouseInput.isJustPressed = function (button) {
        var state = MouseInput.buttonStates.get(button);
        if (state == KeyState.PRESSED) {
            MouseInput.buttonStates.set(button, KeyState.HOLD);
        }
        return state == KeyState.PRESSED;
        //return 
    };
    MouseInput.numberToButton = function (number) {
        switch (number) {
            case 0:
                return "LMB";
            case 1:
                return "ScrollButton";
            case 2:
                return "RMB";
        }
        return "LMB"; //thats not gonna happen
    };
    MouseInput.preventDefault = true;
    return MouseInput;
}());
exports.MouseInput = MouseInput;


/***/ }),

/***/ "./src/engine/object2D.ts":
/*!********************************!*\
  !*** ./src/engine/object2D.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Drawable = void 0;
var base_types_1 = __webpack_require__(/*! ./base_types */ "./src/engine/base_types.ts");
var renderer_1 = __webpack_require__(/*! ./renderer */ "./src/engine/renderer.ts");
/**
 * Base for children that want to render something.
 * Extend this class for ctx access and origin transform handeling.
 */
var Drawable = /** @class */ (function () {
    function Drawable() {
        this.origin = new base_types_1.Transform();
        this.children = [];
        this.use_local_coordinates = false;
        this.origin_in_center = false;
    }
    /**
     * Do not call externaly
     */
    Drawable.prototype.onUpdate = function () {
    };
    /**
     * Do not call externaly
     * Called before the object is rendered
     */
    Drawable.prototype.onRender = function () {
        if (this.origin_in_center) {
            renderer_1.ctx.translate(-(this.origin.scale.x / 2), -(this.origin.scale.y / 2));
        }
        renderer_1.ctx.translate(this.origin.position.x, this.origin.position.y);
        if (this.origin_in_center) {
            renderer_1.ctx.translate(this.origin.scale.x / 2, this.origin.scale.y / 2);
        }
        renderer_1.ctx.rotate(this.origin.rotation * Math.PI / 180);
        if (this.origin_in_center) {
            renderer_1.ctx.translate(-(this.origin.scale.x / 2), -(this.origin.scale.y / 2));
        }
        renderer_1.ctx.scale(this.origin.scale.x, this.origin.scale.y);
    };
    /**
     * Do not call externaly
     * Called after the object is rendered
     */
    Drawable.prototype.afterRender = function () {
        var _this = this;
        this.children.forEach(function (child) {
            if (child instanceof Drawable && !child.use_local_coordinates)
                renderer_1.ctx.scale(1 / _this.origin.scale.x, 1 / _this.origin.scale.y);
            child.onRender();
        });
    };
    return Drawable;
}());
exports.Drawable = Drawable;


/***/ }),

/***/ "./src/engine/renderer.ts":
/*!********************************!*\
  !*** ./src/engine/renderer.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.render = exports.init = exports.canvas = exports.ctx = void 0;
var Config = __webpack_require__(/*! ./../engineConfig */ "./src/engineConfig.ts");
var core_1 = __webpack_require__(/*! ./core */ "./src/engine/core.ts");
/**
 * Creates the canvas context.
 * Allready called by the init function from core.ts
 */
function init() {
    exports.canvas = document.querySelector(Config.canvasSelector);
    exports.ctx = exports.canvas.getContext('2d');
}
exports.init = init;
/**
 * Updates viewport size,
 * calls all the onRender methods
 */
function render() {
    if (Config.resizeViewport) {
        exports.canvas.width = window.innerWidth;
        exports.canvas.height = window.innerHeight;
    }
    exports.ctx.clearRect(0, 0, exports.canvas.width, exports.canvas.height);
    core_1.activeScene === null || core_1.activeScene === void 0 ? void 0 : core_1.activeScene.render();
}
exports.render = render;


/***/ }),

/***/ "./src/engine/scene.ts":
/*!*****************************!*\
  !*** ./src/engine/scene.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Scene = void 0;
var renderer_1 = __webpack_require__(/*! ./renderer */ "./src/engine/renderer.ts");
/**
 * Root for all the elements inside your level.
 * Objects not a member of the active scene wont be called via onUpdate and onRender.
 */
var Scene = /** @class */ (function () {
    function Scene() {
        this.members = [];
    }
    Scene.prototype.update = function () {
        this.members.forEach(function (child) {
            child.onUpdate();
        });
        if (this.onUpdate)
            this.onUpdate();
    };
    Scene.prototype.render = function () {
        this.members.forEach(function (child) {
            renderer_1.ctx.save();
            child.onRender();
            child.afterRender();
            renderer_1.ctx.restore();
        });
    };
    return Scene;
}());
exports.Scene = Scene;


/***/ }),

/***/ "./src/engine/shape.ts":
/*!*****************************!*\
  !*** ./src/engine/shape.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Shape = exports.Outline = void 0;
var object2D_1 = __webpack_require__(/*! ./object2D */ "./src/engine/object2D.ts");
var renderer_1 = __webpack_require__(/*! ./renderer */ "./src/engine/renderer.ts");
/**
 * Defines a shepe's outline
 */
var Outline = /** @class */ (function () {
    function Outline(width, color) {
        this.color = color;
        this.thickness = width;
    }
    return Outline;
}());
exports.Outline = Outline;
/**
 * Solid color drawable element
 * Use for custom polygon shapes.
 */
var Shape = /** @class */ (function (_super) {
    __extends(Shape, _super);
    function Shape(verticies, color, outline) {
        var _this = _super.call(this) || this;
        _this.verticies = verticies;
        _this.color = color ? color : "white";
        _this.outline = outline ? outline : new Outline(0, '#0000');
        return _this;
    }
    /**
     * Do not call externaly
     * Called before the object is rendered
     */
    Shape.prototype.onRender = function () {
        _super.prototype.onRender.call(this);
        renderer_1.ctx.beginPath();
        renderer_1.ctx.moveTo(this.verticies[0].x, this.verticies[0].y);
        for (var i = 1; i < this.verticies.length; i++) {
            var vertex = this.verticies[i];
            renderer_1.ctx.lineTo(vertex.x, vertex.y);
        }
        renderer_1.ctx.closePath();
        renderer_1.ctx.save();
        renderer_1.ctx.resetTransform();
        renderer_1.ctx.fillStyle = this.color;
        renderer_1.ctx.fill();
        renderer_1.ctx.lineWidth = this.outline.thickness;
        renderer_1.ctx.strokeStyle = this.outline.color;
        renderer_1.ctx.stroke();
        renderer_1.ctx.restore();
    };
    return Shape;
}(object2D_1.Drawable));
exports.Shape = Shape;


/***/ }),

/***/ "../game/cursor.ts":
/*!*************************!*\
  !*** ../game/cursor.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Cursor = void 0;
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var shape_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/shape */ "./src/engine/shape.ts");
var input_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/input */ "./src/engine/input.ts");
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var particle_1 = __webpack_require__(/*! ./particle */ "../game/particle.ts");
var cursorTool_1 = __webpack_require__(/*! ./cursorTool */ "../game/cursorTool.ts");
var Cursor = /** @class */ (function (_super) {
    __extends(Cursor, _super);
    function Cursor() {
        var _this = this;
        var defaultShape = [
            new base_types_1.Vector2(2, 0),
            new base_types_1.Vector2(2, 2),
            new base_types_1.Vector2(0, 2),
            new base_types_1.Vector2(0, 0)
        ];
        _this = _super.call(this, defaultShape, "#0000", new shape_1.Outline(1, '#FFF9')) || this;
        _this.origin_in_center = true;
        _this.radius = 1;
        _this.tools = new Map();
        _this.tools.set("LMB", new cursorTool_1.Tool(function (pos) {
            if (!world_manager_1.world.particles[pos.y][pos.x])
                world_manager_1.world.particles[pos.y][pos.x] = new particle_1.Powder(pos);
        }));
        _this.tools.set("RMB", new cursorTool_1.Tool(function (pos) {
            delete world_manager_1.world.particles[pos.y][pos.x];
        }));
        _this.tools.set("ScrollButton", new cursorTool_1.Tool(function (pos) {
            if (!world_manager_1.world.particles[pos.y][pos.x])
                world_manager_1.world.particles[pos.y][pos.x] = new particle_1.Solid(pos);
        }));
        return _this;
    }
    Cursor.prototype.changeRadius = function (radius) {
        radius = Math.round(radius);
        this.verticies = [
            new base_types_1.Vector2(radius * 2, 0),
            new base_types_1.Vector2(radius * 2, radius * 2),
            new base_types_1.Vector2(0, radius * 2),
            new base_types_1.Vector2(0, 0)
        ];
    };
    Cursor.prototype.onUpdate = function () {
        var _this = this;
        this.radius -= input_1.MouseInput.getWheelOffset().y / 100;
        if (this.radius < 1) {
            this.radius = 1;
        }
        this.changeRadius(this.radius);
        this.tools.forEach(function (tool, button) {
            if (input_1.MouseInput.isPressed(button)) {
                tool.draw(_this);
                return;
            }
        });
    };
    Cursor.prototype.onRender = function () {
        if (input_1.MouseInput.currentPosition) {
            this.origin.position.x = Math.round(input_1.MouseInput.currentPosition.x / 2) * 2;
            this.origin.position.y = Math.round(input_1.MouseInput.currentPosition.y / 2) * 2;
            this.origin.position.x -= this.radius;
            this.origin.position.y -= this.radius;
        }
        //console.log(this.ctx == ctx);
        _super.prototype.onRender.call(this);
    };
    return Cursor;
}(shape_1.Shape));
exports.Cursor = Cursor;


/***/ }),

/***/ "../game/cursorTool.ts":
/*!*****************************!*\
  !*** ../game/cursorTool.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tool = void 0;
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var Tool = /** @class */ (function () {
    function Tool(placePart) {
        this.callback = placePart;
    }
    Tool.prototype.draw = function (cursor) {
        var pos = cursor.origin.position;
        pos.x = Math.floor(pos.x / 2);
        pos.y = Math.floor(pos.y / 2);
        for (var y = pos.y; y < (pos.y + (cursor.radius)); y++) {
            for (var x = pos.x; x < (pos.x + (cursor.radius)); x++) {
                this.callback(new base_types_1.Vector2(x, y));
            }
        }
    };
    return Tool;
}());
exports.Tool = Tool;


/***/ }),

/***/ "../game/particle.ts":
/*!***************************!*\
  !*** ../game/particle.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Fluid = exports.Powder = exports.Solid = exports.Moveable = exports.Particle = void 0;
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var util_1 = __webpack_require__(/*! ./util */ "../game/util.ts");
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var Particle = /** @class */ (function () {
    function Particle(position) {
        this.position = position;
        this.color = "white";
    }
    Particle.prototype.step = function () {
    };
    ;
    return Particle;
}());
exports.Particle = Particle;
var Moveable = /** @class */ (function (_super) {
    __extends(Moveable, _super);
    function Moveable(position) {
        var _this = _super.call(this, position) || this;
        _this.weight = 1;
        _this.velocity = new base_types_1.Vector2(0, 0);
        return _this;
    }
    Moveable.prototype.tryMove = function (relativePos) {
        if (!util_1.Utility.inBounds(new base_types_1.Vector2(this.position.x + relativePos.x, this.position.y + relativePos.y)))
            return false;
        var target = world_manager_1.world.particles[this.position.y + relativePos.y][this.position.x + relativePos.x];
        if (target != undefined) {
            return this.trySwap(relativePos);
            ;
        }
        else {
            this.position.x += relativePos.x;
            this.position.y += relativePos.y;
            return true;
        }
    };
    Moveable.prototype.trySwap = function (relativePos) {
        var target = world_manager_1.world.particles[this.position.y + relativePos.y][this.position.x + relativePos.x];
        if (target instanceof Moveable && target.weight < this.weight) {
            //Swap!            
            world_manager_1.world.particles[this.position.y][this.position.x] = undefined;
            world_manager_1.world.particles[target.position.y][target.position.x] = undefined;
            var newPos = new base_types_1.Vector2(target.position.x, target.position.y);
            target.position.x = this.position.x;
            target.position.y = this.position.y;
            this.position = newPos;
            world_manager_1.world.particles[this.position.y][this.position.x] = this;
            world_manager_1.world.particles[target.position.y][target.position.x] = target;
            return true;
        }
        return false;
    };
    return Moveable;
}(Particle));
exports.Moveable = Moveable;
//4 Base particle types Solid Powder Fluid Gas
var Solid = /** @class */ (function (_super) {
    __extends(Solid, _super);
    function Solid(position) {
        var _this = _super.call(this, position) || this;
        _this.color = "gray";
        return _this;
    }
    Solid.prototype.step = function () {
    };
    return Solid;
}(Particle));
exports.Solid = Solid;
var Powder = /** @class */ (function (_super) {
    __extends(Powder, _super);
    function Powder(position) {
        var _this = _super.call(this, position) || this;
        _this.color = "yellow";
        _this.weight = 2;
        return _this;
    }
    Powder.prototype.step = function () {
        if (!this.tryMove(new base_types_1.Vector2(0, 1))) {
            if (Math.random() > 0.5) {
                if (!this.tryMove(new base_types_1.Vector2(1, 1))) {
                    if (!this.tryMove(new base_types_1.Vector2(-1, 1))) {
                        return false;
                    }
                }
            }
            else {
                if (!this.tryMove(new base_types_1.Vector2(-1, 1))) {
                    if (!this.tryMove(new base_types_1.Vector2(1, 1))) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    return Powder;
}(Moveable));
exports.Powder = Powder;
var Fluid = /** @class */ (function (_super) {
    __extends(Fluid, _super);
    function Fluid(position) {
        var _this = _super.call(this, position) || this;
        _this.color = "aqua";
        return _this;
    }
    Fluid.prototype.step = function () {
        if (!this.tryMove(new base_types_1.Vector2(0, 1))) {
            if (Math.random() > 0.5) {
                if (!this.tryMove(new base_types_1.Vector2(1, 1))) {
                    if (!this.tryMove(new base_types_1.Vector2(-1, 1))) {
                        this.moveSide();
                        return true;
                    }
                }
            }
            else {
                if (!this.tryMove(new base_types_1.Vector2(-1, 1))) {
                    if (!this.tryMove(new base_types_1.Vector2(1, 1))) {
                        this.moveSide();
                        return true;
                    }
                }
            }
        }
        return true;
    };
    Fluid.prototype.moveSide = function () {
        if (Math.random() > 0.5) {
            if (!this.tryMove(new base_types_1.Vector2(1, 0))) {
                if (!this.tryMove(new base_types_1.Vector2(-1, 0))) {
                    return false;
                }
            }
        }
        else {
            if (!this.tryMove(new base_types_1.Vector2(-1, 0))) {
                if (!this.tryMove(new base_types_1.Vector2(1, 0))) {
                    return false;
                }
            }
        }
    };
    return Fluid;
}(Moveable));
exports.Fluid = Fluid;


/***/ }),

/***/ "../game/physics.ts":
/*!**************************!*\
  !*** ../game/physics.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports) {


var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Physics = void 0;
var BasicPhysics = /** @class */ (function () {
    function BasicPhysics() {
    }
    BasicPhysics.prototype.step = function (sim_state) {
        var e_1, _a;
        var moved = [];
        //sim_state.itteratorDirection = Math.floor(Math.random() *3);
        //This line fixes everything
        sim_state.itteratorDirection++;
        if (sim_state.itteratorDirection > 3) {
            sim_state.itteratorDirection = 0;
        }
        try {
            for (var sim_state_1 = __values(sim_state), sim_state_1_1 = sim_state_1.next(); !sim_state_1_1.done; sim_state_1_1 = sim_state_1.next()) {
                var part = sim_state_1_1.value;
                if (!part || moved.includes(part))
                    continue;
                sim_state.particles[part.position.y][part.position.x] = undefined;
                part.step();
                moved.push(part);
                sim_state.particles[part.position.y][part.position.x] = part;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (sim_state_1_1 && !sim_state_1_1.done && (_a = sim_state_1.return)) _a.call(sim_state_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return sim_state;
    };
    return BasicPhysics;
}());
exports.Physics = new BasicPhysics();


/***/ }),

/***/ "../game/render.ts":
/*!*************************!*\
  !*** ../game/render.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Renderer = void 0;
var renderer_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/renderer */ "./src/engine/renderer.ts");
var CanvasRenderer = /** @class */ (function () {
    function CanvasRenderer() {
    }
    CanvasRenderer.prototype.drawFrame = function (sim_state) {
        var e_1, _a;
        renderer_1.ctx.strokeStyle = '#777';
        renderer_1.ctx.strokeRect(0, 0, 400, 300);
        try {
            for (var sim_state_1 = __values(sim_state), sim_state_1_1 = sim_state_1.next(); !sim_state_1_1.done; sim_state_1_1 = sim_state_1.next()) {
                var part = sim_state_1_1.value;
                if (!part)
                    continue;
                renderer_1.ctx.fillStyle = part.color;
                renderer_1.ctx.fillRect(part.position.x, part.position.y, 1, 1); //draw rectangle :P
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (sim_state_1_1 && !sim_state_1_1.done && (_a = sim_state_1.return)) _a.call(sim_state_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return CanvasRenderer;
}());
exports.Renderer = new CanvasRenderer();


/***/ }),

/***/ "../game/util.ts":
/*!***********************!*\
  !*** ../game/util.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utility = void 0;
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var Utility = /** @class */ (function () {
    function Utility() {
    }
    Utility.inBounds = function (position) {
        if (position.y >= world_manager_1.WorldSize.y || position.x >= world_manager_1.WorldSize.x ||
            position.y < 0 || position.x < 0)
            return false;
        return true;
    };
    Utility.vectorInterpolate = function (eachStep, from, to) {
        var direction = new base_types_1.Vector2(to.x - from.x, to.y - from.y);
        var step = direction.normalized();
        var current = from;
        //while(current)
    };
    return Utility;
}());
exports.Utility = Utility;


/***/ }),

/***/ "../game/world_manager.ts":
/*!********************************!*\
  !*** ../game/world_manager.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorldManager = exports.world = exports.World = exports.WorldSize = void 0;
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var object2D_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/object2D */ "./src/engine/object2D.ts");
var render_1 = __webpack_require__(/*! ./render */ "../game/render.ts");
var physics_1 = __webpack_require__(/*! ./physics */ "../game/physics.ts");
exports.WorldSize = new base_types_1.Vector2(400, 300);
var World = /** @class */ (function () {
    function World() {
        var _this = this;
        this[Symbol.iterator] = function () {
            var i = 0;
            return {
                next: function () {
                    return {
                        done: (i >= (exports.WorldSize.x * exports.WorldSize.y - 1)),
                        value: _this.getItterVal(i++)
                    };
                }
            };
        };
        this.itteratorDirection = 2;
        this.particles = new Array(exports.WorldSize.y);
        for (var index = 0; index < this.particles.length; index++) {
            this.particles[index] = new Array(exports.WorldSize.x).fill(undefined);
        }
    }
    //Itterator
    World.prototype.getItterVal = function (i) {
        var y = Math.floor(i / exports.WorldSize.x);
        var x = i - Math.floor(i / exports.WorldSize.x) * exports.WorldSize.x;
        var out;
        switch (this.itteratorDirection) {
            case 1:
                out = this.particles[y][exports.WorldSize.x - x - 1];
                break;
            case 2:
                out = this.particles[exports.WorldSize.y - y - 1][x];
                break;
            case 3:
                out = this.particles[exports.WorldSize.y - y - 1][exports.WorldSize.x - x - 1];
                break;
            default:
                out = this.particles[y][x];
                break;
        }
        return out;
    };
    return World;
}());
exports.World = World;
exports.world = new World();
var WorldManager = /** @class */ (function (_super) {
    __extends(WorldManager, _super);
    function WorldManager() {
        var _this = _super.call(this) || this;
        _this.paused = false;
        return _this;
    }
    WorldManager.prototype.onUpdate = function () {
    };
    WorldManager.prototype.onRender = function () {
        _super.prototype.onRender.call(this);
        if (!this.paused)
            physics_1.Physics.step(exports.world);
        render_1.Renderer.drawFrame(exports.world);
    };
    WorldManager.prototype.addPart = function (part) {
        exports.world.particles[part.position.y][part.position.x] = part;
    };
    return WorldManager;
}(object2D_1.Drawable));
exports.WorldManager = WorldManager;
//TODO: Multithreading if i fancy
/*
use this to test if supported

if (typeof(Worker) !== "undefined") {
   //great, your browser supports web workers
} else {
   //not supported
}

*/ 


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!***********************!*\
  !*** ../game/game.ts ***!
  \***********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var CE = __webpack_require__(/*! ../Canvas-Engine/src/engine/core */ "./src/engine/core.ts");
var scene_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/scene */ "./src/engine/scene.ts");
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var input_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/input */ "./src/engine/input.ts");
var particle_1 = __webpack_require__(/*! ./particle */ "../game/particle.ts");
var cursor_1 = __webpack_require__(/*! ./cursor */ "../game/cursor.ts");
var physics_1 = __webpack_require__(/*! ./physics */ "../game/physics.ts");
//create scene
var level = new scene_1.Scene();
var world_manager = new world_manager_1.WorldManager();
var cursor = new cursor_1.Cursor();
window.onload = function () {
    //init engine
    CE.init();
    //bind scene
    CE.setActiveScene(level);
    level.members.push(world_manager);
    world_manager.origin.scale = new base_types_1.Vector2(2, 2);
    level.members.push(cursor);
    //world_manager.addPart(new Powder(new Vector2(80,0)));  
    //Demo world
    for (var x = 60; x < 140; x++) {
        for (var y = 0; y < 15; y++) {
            //mix some fluid and powder
            if (x * y % 3 == 0) {
                world_manager.addPart(new particle_1.Powder(new base_types_1.Vector2(x, y)));
            }
            else
                world_manager.addPart(new particle_1.Fluid(new base_types_1.Vector2(x, y + 20)));
        }
    }
    for (var x = 0; x < 100; x++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(x + 0, x + 60)));
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(x + 0, x + 61)));
    }
    for (var x = 0; x < 100; x++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 200, x + 60)));
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 200, x + 61)));
    }
    for (var x = 0; x < 50; x++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 100, x + 190)));
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 100, x + 191)));
    }
};
//runs every tick 
level.onUpdate = function () {
    if (input_1.KeyboardInput.isJustPressed("Space")) {
        world_manager.paused = !world_manager.paused;
    }
    if (input_1.KeyboardInput.isJustPressed("f")) {
        world_manager.paused = true;
        physics_1.Physics.step(world_manager_1.world);
    }
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2hhcGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL2N1cnNvci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvY3Vyc29yVG9vbC50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvcGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BoeXNpY3MudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3JlbmRlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvdXRpbC50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvd29ybGRfbWFuYWdlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtFQUNFO0FBQ0YsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFD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Q0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQzVCLGlCQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFLLENBQUMsQ0FBQztLQUN2QjtBQUVMLENBQUMsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipRdWVycnkgc2VsZWN0b3IgZm9yIHRoZSBjYW52YXMgZWxlbWVudFxyXG4qL1xyXG5jb25zdCBjYW52YXNTZWxlY3RvciA9IFwiI2dhbWVcIjtcclxuY29uc3QgcmVzaXplVmlld3BvcnQgPSBmYWxzZTtcclxuLyoqVGFyZ2V0IGZyYW1lcyBwZXIgc2Vjb25kXHJcbiovXHJcbmNvbnN0IGZwcyA9IDYwO1xyXG5cclxuZXhwb3J0IHtcclxuICAgIGNhbnZhc1NlbGVjdG9yLCAgICBcclxuICAgIGZwcyxcclxuICAgIHJlc2l6ZVZpZXdwb3J0XHJcbn0iLCIvKipcclxuICogMkQgVmVjdG9yXHJcbiAqIFN0b3JlcyBYIGFuZCBZXHJcbiovXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IyICB7XHJcbiAgICBjb25zdHJ1Y3RvcihYIDpudW1iZXIsWSA6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnggPSBYO1xyXG4gICAgICAgIHRoaXMueSA9IFk7XHJcbiAgICB9XHJcblxyXG4gICAgbGVuZ2h0KCl7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChcclxuICAgICAgICAgICAgTWF0aC5wb3codGhpcy54LDIpICsgTWF0aC5wb3codGhpcy55LDIpXHJcbiAgICAgICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBub3JtYWxpemVkKCl7XHJcbiAgICAgICAgbGV0IG5ld1ZlY3RvciA9IG5ldyBWZWN0b3IyKHRoaXMueCx0aGlzLnkpO1xyXG4gICAgICAgIGxldCBsZW5naHQgPSBuZXdWZWN0b3IubGVuZ2h0KClcclxuICAgICAgICBuZXdWZWN0b3IueCAvPSBsZW5naHQ7XHJcbiAgICAgICAgbmV3VmVjdG9yLnkgLz0gbGVuZ2h0O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3VmVjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHg6bnVtYmVyO1xyXG4gICAgeTpudW1iZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTdG9yZXMgcG9zaXRpb24gcm90YXRpb24gKGRlZ3JlZXMpIGFuZCBzY2FsZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3M/IDpWZWN0b3IyLCByb3Q/IDpudW1iZXIsIHNjYWxlPyA6VmVjdG9yMil7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiAgID0gcG9zID8gcG9zICAgICA6IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiAgID0gcm90ID8gcm90ICAgICA6IDA7XHJcbiAgICAgICAgdGhpcy5zY2FsZSAgICAgID0gc2NhbGUgPyBzY2FsZSA6IG5ldyBWZWN0b3IyKDEsMSk7XHJcbiAgICB9XHJcbiAgICBwb3NpdGlvbjogVmVjdG9yMjtcclxuICAgIHJvdGF0aW9uOiBudW1iZXI7XHJcbiAgICBzY2FsZTogVmVjdG9yMjtcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZW5kZXJpbmcgZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuaW1wb3J0ICogYXMgQ29uZmlnIGZyb20gXCIuLy4uL2VuZ2luZUNvbmZpZ1wiO1xyXG5pbXBvcnQge1NjZW5lfSBmcm9tIFwiLi9zY2VuZVwiO1xyXG5pbXBvcnQge0tleWJvYXJkSW5wdXQsIE1vdXNlSW5wdXR9IGZyb20gXCIuLy4uL2VuZ2luZS9pbnB1dFwiO1xyXG5cclxuXHJcbmV4cG9ydCB2YXIgYWN0aXZlU2NlbmUgOiBTY2VuZSB8IHVuZGVmaW5lZFxyXG5cclxuLyoqXHJcbiAqIFNldCB0aGUgc2NlbmUgeW91IHdhbnQgdG8gYmUgY3VycmVudGx5IGRpc3BsYXllZCBhbmQgdXBkYXRlZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEFjdGl2ZVNjZW5lKHNjZW5lIDpTY2VuZSl7XHJcbiAgICBhY3RpdmVTY2VuZSA9IHNjZW5lO1xyXG59XHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIHRoZSBlbmdpbmVcclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBSZW5kZXJpbmcuaW5pdCgpO1xyXG4gICAgS2V5Ym9hcmRJbnB1dC5pbml0KCk7XHJcbiAgICBNb3VzZUlucHV0LmluaXQoKTtcclxuXHJcbiAgICBzZXRJbnRlcnZhbCh1cGRhdGUsMTAwMC9Db25maWcuZnBzKTtcclxufVxyXG4vKipcclxuICogRG9uJ3QgdXNlIGV4dGVybmFseS5cclxuICogQ2FsbHMgb25VcGRhdGUgYW5kIG9uUmVuZGVyIG1ldGhvZHNcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZSgpe1xyXG4gICAgaWYoYWN0aXZlU2NlbmU/Lm9uVXBkYXRlKVxyXG4gICAgICAgIGFjdGl2ZVNjZW5lLm9uVXBkYXRlKCk7XHJcbiAgICBhY3RpdmVTY2VuZT8udXBkYXRlKCk7XHJcblxyXG4gICAgUmVuZGVyaW5nLnJlbmRlcigpO1xyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHsgY2FudmFzIH0gZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBNb3N0IG9mIGtleXMgcHJlc2VudCBvbiB0aGUga2V5Ym9hcmQgYXMgYSBzdHJpbmcgdW5pb24uIFBsZWFzZSByZXBvcnQgYW55IG1pc3Npbmcga2V5cy5cclxuICovXHJcbmV4cG9ydCB0eXBlIEtleSA9IFwiVGFiXCIgfCBcIkFsdFwiIHwgXCJBbHRHcmFwaFwiIHwgXCJCYWNrc3BhY2VcIiB8IFwiQ29udHJvbFwiIHxcIlNoaWZ0XCIgfCBcIlNwYWNlXCIgfCBcIkNvbnRleHRNZW51XCIgfCBcIkVudGVyXCIgfCBcIk51bUxvY2tcIiB8IFwiSG9tZVwiIHwgXCJQYWdlVXBcIiB8IFwiUGFnZURvd25cIiB8IFwiSW5zZXJ0XCIgfCBcIkRlbGV0ZVwiIHwgXCJBcnJvd1VwXCIgfCBcIkFycm93RG93blwiIHwgXCJBcnJvd1JpZ2h0XCIgfCBcIkFycm93TGVmdFwiIHxcIiFcIiB8IFwiXFxcIlwifCBcIiNcIiB8IFwiJFwiIHwgXCIlXCIgfCBcIiZcIiB8IFwiJ1wiIHwgXCIoXCIgfCBcIilcIiB8IFwiKlwiIHwgXCIrXCIgfCBcIixcIiB8IFwiLVwiIHwgXCIuXCIgfCBcIi9cIiB8IFwiMFwiIHwgXCIxXCIgfCBcIjJcIiB8IFwiM1wiIHwgXCI0XCIgfCBcIjVcIiB8IFwiNlwiIHwgXCI3XCIgfCBcIjhcIiB8IFwiOVwiIHwgXCI6XCIgfCBcIjtcIiB8IFwiPFwiIHwgXCI9XCIgfCBcIj5cIiB8IFwiP1wiIHwgXCJAXCIgfCBcIkFcIiB8IFwiQlwiIHwgXCJDXCIgfCBcIkRcIiB8IFwiRVwiIHwgXCJGXCIgfCBcIkdcIiB8IFwiSFwiIHwgXCJJXCIgfCBcIkpcIiB8IFwiS1wiIHwgXCJMXCIgfCBcIk1cIiB8IFwiTlwiIHwgXCJPXCIgfCBcIlBcIiB8IFwiUVwiIHwgXCJSXCIgfCBcIlNcIiB8IFwiVFwiIHwgXCJVXCIgfCBcIlZcIiB8IFwiV1wiIHwgXCJYXCIgfCBcIllcIiB8IFwiWlwiIHwgXCJbXCIgfCBcIlxcXFxcIiB8IFwiXVwiIHwgXCJeXCIgfCBcIl9cIiB8IFwiYFwiIHwgXCJhXCIgfCBcImJcIiB8IFwiY1wiIHwgXCJkXCIgfCBcImVcIiB8IFwiZlwiIHwgXCJnXCIgfCBcImhcIiB8IFwiaVwiIHwgXCJqXCIgfCBcImtcIiB8IFwibFwiIHwgXCJtXCIgfCBcIm5cIiB8IFwib1wiIHwgXCJwXCIgfCBcInFcIiB8IFwiclwiIHwgXCJzXCIgfCBcInRcIiB8IFwidVwiIHwgXCJ2XCIgfCBcIndcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInpcIiB8IFwie1wiIHwgXCJ8XCIgfCBcIn1cIiB8IFwiflwiIDtcclxuXHJcbmV4cG9ydCB0eXBlIE1vdXNlQnV0dG9uID0gXCJMTUJcIiB8IFwiU2Nyb2xsQnV0dG9uXCIgfCBcIlJNQlwiOyBcclxuXHJcbmV4cG9ydCBlbnVtIEtleVN0YXRle1xyXG4gICAgUFJFU1NFRCxcclxuICAgIEhPTEQsXHJcbiAgICBSRUxFQVNFLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgS2V5Ym9hcmRJbnB1dHtcclxuICAgIC8qKlxyXG4gICAgICogQWRkIGV2ZW50IGxpc3RlbmVycyBmb3Iga2V5IHByZXNzZXMuXHJcbiAgICAgKiBBbGxyZWFkeSBjYWxsZWQgYnkgdGhlIGluaXQgZnVuY3Rpb24gZnJvbSBjb3JlLnRzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMgPSBuZXcgTWFwPEtleSxLZXlTdGF0ZT4oKTtcclxuXHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwoZSk9PnsgICBcclxuICAgICAgICAgICAgaWYoS2V5Ym9hcmRJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcy5zZXQoS2V5Ym9hcmRJbnB1dC5zdHJpbmdUb0tleShlLmtleSksS2V5U3RhdGUuUFJFU1NFRCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLChlKT0+eyAgICBcclxuICAgICAgICAgICAgaWYoS2V5Ym9hcmRJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IFxyXG5cclxuICAgICAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMuc2V0KEtleWJvYXJkSW5wdXQuc3RyaW5nVG9LZXkoZS5rZXkpLEtleVN0YXRlLlJFTEVBU0UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBmb3IgcHJlc3NlZCBrZXlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGlzUHJlc3NlZChrZXk6IEtleSl7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5rZXlTdGF0ZXMuZ2V0KGtleSk7XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XHJcbiAgICAgICAgICAgIHRoaXMua2V5U3RhdGVzLnNldChrZXksS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gIShzdGF0ZSA9PT0gdW5kZWZpbmVkIHx8IHN0YXRlID09IEtleVN0YXRlLlJFTEVBU0UpXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGlzSnVzdFByZXNzZWQoa2V5OiBLZXkpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMua2V5U3RhdGVzLmdldChrZXkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XHJcbiAgICAgICAgICAgIHRoaXMua2V5U3RhdGVzLnNldChrZXksS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRDtcclxuICAgICAgICAvL3JldHVybiBcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcHJldmVudERlZmF1bHQgPSB0cnVlO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGtleVN0YXRlczogTWFwPEtleSxLZXlTdGF0ZT47XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc3RyaW5nVG9LZXkoa2V5IDpzdHJpbmcpeyAgICAgICAgXHJcbiAgICAgICAgbGV0IHZhbCA9IGtleS5yZXBsYWNlKFwiRGVhZFwiLFwiflwiKTtcclxuICAgICAgICB2YWwgPSB2YWwucmVwbGFjZShcIiBcIixcIlNwYWNlXCIpO1xyXG4gICAgICAgIGxldCBrZXl0eXBlID0gdmFsICBhcyBLZXk7XHJcbiAgICAgICAgcmV0dXJuIGtleXR5cGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNb3VzZUlucHV0e1xyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgICAgICBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcyA9IG5ldyBNYXA8TW91c2VCdXR0b24sS2V5U3RhdGU+KCk7XHJcbiAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlID0ge3g6MCx5OjAsejowfTtcclxuXHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vtb3ZlID0gZSA9PiB7ICAgXHJcbiAgICAgICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgTW91c2VJbnB1dC5jdXJyZW50UG9zaXRpb24gPSBuZXcgVmVjdG9yMihlLngsIGUueSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNhbnZhcy5vbndoZWVsID0gZSA9PiB7ICAgIFxyXG4gICAgICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KSAgICBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZS54ICs9IGUuZGVsdGFYO1xyXG4gICAgICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UueSArPSBlLmRlbHRhWTtcclxuICAgICAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlLnogKz0gZS5kZWx0YVo7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYW52YXMub25tb3VzZWRvd24gPSBlID0+IHtcclxuICAgICAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5zZXQoTW91c2VJbnB1dC5udW1iZXJUb0J1dHRvbihlLmJ1dHRvbiksS2V5U3RhdGUuUFJFU1NFRCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNldXAgPSBlID0+IHtcclxuICAgICAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5zZXQoTW91c2VJbnB1dC5udW1iZXJUb0J1dHRvbihlLmJ1dHRvbiksS2V5U3RhdGUuUkVMRUFTRSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vcHJldmVudCBjb250ZXh0IG1lbnVcclxuICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FudmFzLm9uY29udGV4dG1lbnUgPSBlID0+IHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0V2hlZWxPZmZzZXQoKXtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlO1xyXG4gICAgICAgIGxldCBvdXQgPSB7eDpvZmZzZXQueCwgeTpvZmZzZXQueSwgejpvZmZzZXQuen07XHJcblxyXG4gICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZSA9IHt4OjAseTowLHo6MH07XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc3RhdGljIGlzUHJlc3NlZChidXR0b246IE1vdXNlQnV0dG9uKXtcclxuICAgICAgICBsZXQgc3RhdGUgPSBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5nZXQoYnV0dG9uKTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcclxuICAgICAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuc2V0KGJ1dHRvbixLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAhKHN0YXRlID09PSB1bmRlZmluZWQgfHwgc3RhdGUgPT0gS2V5U3RhdGUuUkVMRUFTRSlcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNKdXN0UHJlc3NlZChidXR0b246IE1vdXNlQnV0dG9uKXtcclxuICAgICAgICBsZXQgc3RhdGUgPSBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5nZXQoYnV0dG9uKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRCkge1xyXG4gICAgICAgICAgICBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5zZXQoYnV0dG9uLEtleVN0YXRlLkhPTEQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQ7XHJcbiAgICAgICAgLy9yZXR1cm4gXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbnVtYmVyVG9CdXR0b24obnVtYmVyIDogbnVtYmVyICkgOiBNb3VzZUJ1dHRvbntcclxuICAgICAgICBzd2l0Y2ggKG51bWJlcikge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJMTUJcIjtcclxuICAgICAgICAgICAgY2FzZSAxOiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlNjcm9sbEJ1dHRvblwiO1xyXG4gICAgICAgICAgICBjYXNlIDI6ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiUk1CXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gXCJMTUJcIjsgLy90aGF0cyBub3QgZ29ubmEgaGFwcGVuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcclxuICAgIHN0YXRpYyBjdXJyZW50UG9zaXRpb246IFZlY3RvcjI7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnV0dG9uU3RhdGVzOiBNYXA8TW91c2VCdXR0b24sS2V5U3RhdGU+O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbW91c2VXaGVlbENoYW5nZSA6IHt4Om51bWJlciwgeTpudW1iZXIsIHo6bnVtYmVyfTtcclxufSIsImltcG9ydCB7VmVjdG9yMixUcmFuc2Zvcm19IGZyb20gXCIuL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtjdHh9IGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcblxyXG4vKipcclxuICogQmFzZSBmb3IgY2hpbGRyZW4gcG9seW1vcnBoaXNtXHJcbiAqIEltcGxlbWVudCB0aGlzIGludGVyZmFjZSB3aGVuIGNyZWF0aW5nIGEgY29tcG9uZW50IC8gY2hpbGQuXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdDJEIHtcclxuICAgIC8vSGFwcGVucyBldmVyeSB0aWNrXHJcbiAgICBvblVwZGF0ZSgpIDp2b2lkOyBcclxuICAgIC8vQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXHJcbiAgICBvblJlbmRlcigpIDp2b2lkOyBcclxuICAgIGFmdGVyUmVuZGVyKCkgOnZvaWQ7IFxyXG5cclxuICAgIG9yaWdpbjogVHJhbnNmb3JtOyAgICBcclxuICAgIGNoaWxkcmVuOiBBcnJheTxPYmplY3QyRD47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCYXNlIGZvciBjaGlsZHJlbiB0aGF0IHdhbnQgdG8gcmVuZGVyIHNvbWV0aGluZy5cclxuICogRXh0ZW5kIHRoaXMgY2xhc3MgZm9yIGN0eCBhY2Nlc3MgYW5kIG9yaWdpbiB0cmFuc2Zvcm0gaGFuZGVsaW5nLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERyYXdhYmxlIGltcGxlbWVudHMgT2JqZWN0MkQge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLm9yaWdpbiA9IG5ldyBUcmFuc2Zvcm0oKTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy51c2VfbG9jYWxfY29vcmRpbmF0ZXMgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9yaWdpbl9pbl9jZW50ZXIgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XHJcbiAgICAgKi9cclxuICAgIG9uVXBkYXRlKCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XHJcbiAgICAgKiBDYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgICAqL1xyXG4gICAgb25SZW5kZXIoKXsgICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XHJcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoLSh0aGlzLm9yaWdpbi5zY2FsZS54LzIpLC0odGhpcy5vcmlnaW4uc2NhbGUueS8yKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC50cmFuc2xhdGUodGhpcy5vcmlnaW4ucG9zaXRpb24ueCx0aGlzLm9yaWdpbi5wb3NpdGlvbi55KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKHRoaXMub3JpZ2luLnNjYWxlLngvMix0aGlzLm9yaWdpbi5zY2FsZS55LzIpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgICAgIGN0eC5yb3RhdGUodGhpcy5vcmlnaW4ucm90YXRpb24gKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKC0odGhpcy5vcmlnaW4uc2NhbGUueC8yKSwtKHRoaXMub3JpZ2luLnNjYWxlLnkvMikpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgY3R4LnNjYWxlKHRoaXMub3JpZ2luLnNjYWxlLngsdGhpcy5vcmlnaW4uc2NhbGUueSk7ICAgICAgXHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XHJcbiAgICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgICovXHJcbiAgICBhZnRlclJlbmRlcigpeyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRHJhd2FibGUgJiYgIWNoaWxkLnVzZV9sb2NhbF9jb29yZGluYXRlcylcclxuICAgICAgICAgICAgICAgIGN0eC5zY2FsZSgxL3RoaXMub3JpZ2luLnNjYWxlLngsMS90aGlzLm9yaWdpbi5zY2FsZS55KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNoaWxkLm9uUmVuZGVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIG9yaWdpbjogVHJhbnNmb3JtOyAgICBcclxuICAgIGNoaWxkcmVuOiBBcnJheTxPYmplY3QyRD47XHJcbiAgICB1c2VfbG9jYWxfY29vcmRpbmF0ZXM6IGJvb2xlYW47XHJcbiAgICBvcmlnaW5faW5fY2VudGVyOiBib29sZWFuO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIENvbmZpZyBmcm9tIFwiLi8uLi9lbmdpbmVDb25maWdcIjtcclxuaW1wb3J0IHthY3RpdmVTY2VuZX0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IHZhciBjdHggOkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuZXhwb3J0IHZhciBjYW52YXMgOkhUTUxDYW52YXNFbGVtZW50O1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgdGhlIGNhbnZhcyBjb250ZXh0LlxyXG4gKiBBbGxyZWFkeSBjYWxsZWQgYnkgdGhlIGluaXQgZnVuY3Rpb24gZnJvbSBjb3JlLnRzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpe1xyXG4gICAgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihDb25maWcuY2FudmFzU2VsZWN0b3IpISBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGVzIHZpZXdwb3J0IHNpemUsXHJcbiAqIGNhbGxzIGFsbCB0aGUgb25SZW5kZXIgbWV0aG9kc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcigpeyAgXHJcbiAgICBpZihDb25maWcucmVzaXplVmlld3BvcnQpe1xyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgIFxyXG4gICAgYWN0aXZlU2NlbmU/LnJlbmRlcigpO1xyXG59IiwiaW1wb3J0IHtEcmF3YWJsZSwgT2JqZWN0MkR9IGZyb20gXCIuL29iamVjdDJEXCJcclxuaW1wb3J0IHtjdHgsY2FudmFzfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5cclxuLyoqXHJcbiAqIFJvb3QgZm9yIGFsbCB0aGUgZWxlbWVudHMgaW5zaWRlIHlvdXIgbGV2ZWwuXHJcbiAqIE9iamVjdHMgbm90IGEgbWVtYmVyIG9mIHRoZSBhY3RpdmUgc2NlbmUgd29udCBiZSBjYWxsZWQgdmlhIG9uVXBkYXRlIGFuZCBvblJlbmRlci5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTY2VuZXtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5tZW1iZXJzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCl7XHJcbiAgICAgICAgdGhpcy5tZW1iZXJzLmZvckVhY2goY2hpbGQ9PntcclxuICAgICAgICAgICAgY2hpbGQub25VcGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub25VcGRhdGUpXHJcbiAgICAgICAgICAgIHRoaXMub25VcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm1lbWJlcnMuZm9yRWFjaChjaGlsZD0+e1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjaGlsZC5vblJlbmRlcigpO1xyXG4gICAgICAgICAgICBjaGlsZC5hZnRlclJlbmRlcigpO1xyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSAgIFxyXG5cclxuICAgIG9uVXBkYXRlOiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcclxuICAgIG1lbWJlcnM6IEFycmF5PE9iamVjdDJEPjtcclxufSIsImltcG9ydCB7RHJhd2FibGV9IGZyb20gXCIuL29iamVjdDJEXCI7XHJcbmltcG9ydCB7VmVjdG9yMixUcmFuc2Zvcm19IGZyb20gXCIuL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHsgY3R4IH0gZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBEZWZpbmVzIGEgc2hlcGUncyBvdXRsaW5lXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgT3V0bGluZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aDogbnVtYmVyLGNvbG9yOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnRoaWNrbmVzcyA9IHdpZHRoO1xyXG4gICAgfVxyXG4gICAgdGhpY2tuZXNzOiBudW1iZXI7XHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogU29saWQgY29sb3IgZHJhd2FibGUgZWxlbWVudFxyXG4gKiBVc2UgZm9yIGN1c3RvbSBwb2x5Z29uIHNoYXBlcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTaGFwZSBleHRlbmRzIERyYXdhYmxlIHtcclxuICAgIGNvbnN0cnVjdG9yKHZlcnRpY2llczogVmVjdG9yMltdLCBjb2xvcj86IHN0cmluZyxvdXRsaW5lPzogT3V0bGluZSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0aWNpZXMgPSB2ZXJ0aWNpZXM7XHJcblxyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciA/IGNvbG9yIDogXCJ3aGl0ZVwiO1xyXG4gICAgICAgIHRoaXMub3V0bGluZSA9IG91dGxpbmUgPyBvdXRsaW5lIDogbmV3IE91dGxpbmUoMCwnIzAwMDAnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICogQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXHJcbiAgICAgKi9cclxuICAgIG9uUmVuZGVyKCl7XHJcbiAgICAgICAgc3VwZXIub25SZW5kZXIoKTtcclxuICAgICAgIFxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKHRoaXMudmVydGljaWVzWzBdLngsdGhpcy52ZXJ0aWNpZXNbMF0ueSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnZlcnRpY2llcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLnZlcnRpY2llc1tpXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8odmVydGV4LngsdmVydGV4LnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LnJlc2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICBcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gdGhpcy5vdXRsaW5lLnRoaWNrbmVzcztcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLm91dGxpbmUuY29sb3I7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpOyAgICAgICAgXHJcblxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHZlcnRpY2llczogVmVjdG9yMltdO1xyXG4gICAgb3V0bGluZTogT3V0bGluZTtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7U2hhcGUsT3V0bGluZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zaGFwZVwiO1xyXG5pbXBvcnQge01vdXNlQnV0dG9uLCBNb3VzZUlucHV0fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2lucHV0XCI7XHJcbmltcG9ydCB7IGN0eCB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvcmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgd29ybGQgfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEZsdWlkLCBQb3dkZXIsIFNvbGlkIH0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuaW1wb3J0IHsgVXRpbGl0eSB9IGZyb20gXCIuL3V0aWxcIjtcclxuaW1wb3J0IHsgVG9vbCB9IGZyb20gXCIuL2N1cnNvclRvb2xcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDdXJzb3IgZXh0ZW5kcyBTaGFwZXtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgbGV0IGRlZmF1bHRTaGFwZSA9IFtcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMiwwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMiwyKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMCwyKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMCwwKVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHN1cGVyKGRlZmF1bHRTaGFwZSxcIiMwMDAwXCIsbmV3IE91dGxpbmUoMSwnI0ZGRjknKSk7XHJcblxyXG4gICAgICAgIHRoaXMub3JpZ2luX2luX2NlbnRlciA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSAxO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2xzID0gbmV3IE1hcDxNb3VzZUJ1dHRvbixUb29sPigpO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2xzLnNldChcIkxNQlwiLG5ldyBUb29sKHBvcz0+e1xyXG4gICAgICAgICAgICBpZiAoIXdvcmxkLnBhcnRpY2xlc1twb3MueV1bcG9zLnhdKVxyXG4gICAgICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3Bvcy55XVtwb3MueF0gPSBuZXcgUG93ZGVyKHBvcyk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2xzLnNldChcIlJNQlwiLG5ldyBUb29sKHBvcz0+e1xyXG4gICAgICAgICAgICBkZWxldGUgd29ybGQucGFydGljbGVzW3Bvcy55XVtwb3MueF07XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2xzLnNldChcIlNjcm9sbEJ1dHRvblwiLG5ldyBUb29sKHBvcz0+e1xyXG4gICAgICAgICAgICBpZiAoIXdvcmxkLnBhcnRpY2xlc1twb3MueV1bcG9zLnhdKVxyXG4gICAgICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3Bvcy55XVtwb3MueF0gPSBuZXcgU29saWQocG9zKTtcclxuICAgICAgICB9KSk7XHJcblxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUmFkaXVzKHJhZGl1cyA6IG51bWJlcil7XHJcbiAgICAgICAgcmFkaXVzID0gTWF0aC5yb3VuZChyYWRpdXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudmVydGljaWVzID0gW1xyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMihyYWRpdXMqMiwwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIocmFkaXVzKjIscmFkaXVzKjIpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigwLHJhZGl1cyoyKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMCwwKVxyXG4gICAgICAgIF0gICAgICAgIFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBvblVwZGF0ZSgpe1xyXG4gICAgICAgIHRoaXMucmFkaXVzIC09IE1vdXNlSW5wdXQuZ2V0V2hlZWxPZmZzZXQoKS55IC8gMTAwO1xyXG4gICAgICAgIGlmICh0aGlzLnJhZGl1cyA8IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5yYWRpdXMgPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VSYWRpdXModGhpcy5yYWRpdXMpO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2xzLmZvckVhY2goKHRvb2wsYnV0dG9uKT0+e1xyXG4gICAgICAgICAgICBpZiAoTW91c2VJbnB1dC5pc1ByZXNzZWQoYnV0dG9uKSkge1xyXG4gICAgICAgICAgICAgICAgdG9vbC5kcmF3KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZW5kZXIoKXsgICAgICAgICAgICAgICBcclxuICAgICAgICBpZihNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luLnBvc2l0aW9uLnggPSBNYXRoLnJvdW5kKCBNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbi54IC8yKSAqMjtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4ucG9zaXRpb24ueSA9IE1hdGgucm91bmQoTW91c2VJbnB1dC5jdXJyZW50UG9zaXRpb24ueSAvMikgKiAyO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4ucG9zaXRpb24ueCAtPSB0aGlzLnJhZGl1cztcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4ucG9zaXRpb24ueSAtPSB0aGlzLnJhZGl1cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5jdHggPT0gY3R4KTtcclxuXHJcbiAgICAgICAgc3VwZXIub25SZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByYWRpdXM6bnVtYmVyO1xyXG4gICAgdG9vbHM6TWFwPE1vdXNlQnV0dG9uLFRvb2w+O1xyXG5cclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHsgQ3Vyc29yIH0gZnJvbSBcIi4vY3Vyc29yXCI7XHJcbmltcG9ydCB7IHdvcmxkIH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRvb2x7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZVBhcnQgOiAocG9zOiBWZWN0b3IyKSA9PiB2b2lkKXtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gcGxhY2VQYXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3Vyc29yOkN1cnNvcil7XHJcbiAgICAgICAgbGV0IHBvcyA9IGN1cnNvci5vcmlnaW4ucG9zaXRpb247XHJcbiAgICAgICAgcG9zLnggPSBNYXRoLmZsb29yKHBvcy54IC8gMik7XHJcbiAgICAgICAgcG9zLnkgPSBNYXRoLmZsb29yKHBvcy55IC8gMik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHkgPSBwb3MueTsgeSA8IChwb3MueSArIChjdXJzb3IucmFkaXVzKSk7IHkrKykgeyAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBwb3MueDsgeCA8IChwb3MueCArIChjdXJzb3IucmFkaXVzKSk7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFjayhuZXcgVmVjdG9yMih4LHkpKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNhbGxiYWNrIDogKHBvczogVmVjdG9yMikgPT4gdm9pZDtcclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHsgVXRpbGl0eSB9IGZyb20gXCIuL3V0aWxcIjtcclxuaW1wb3J0IHsgd29ybGQsV29ybGRTaXplIH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhcnRpY2xle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0ZXAoKXtcclxuICAgIH07XHJcbiAgIFxyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7IFxyXG4gICAgY29sb3I6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUGFydGljbGV7ICAgIFxyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgc3VwZXIocG9zaXRpb24pXHJcblxyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gMTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlNb3ZlKHJlbGF0aXZlUG9zOiBWZWN0b3IyKSA6Ym9vbGVhbntcclxuICAgICAgICBpZiAoIVV0aWxpdHkuaW5Cb3VuZHMobmV3IFZlY3RvcjIodGhpcy5wb3NpdGlvbi54K3JlbGF0aXZlUG9zLngsdGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnkpKSkgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXQgIT0gdW5kZWZpbmVkKSB7IFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cnlTd2FwKHJlbGF0aXZlUG9zKTs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCArPSByZWxhdGl2ZVBvcy54OyBcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHJlbGF0aXZlUG9zLnk7IFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5U3dhcChyZWxhdGl2ZVBvczogVmVjdG9yMikgOmJvb2xlYW57ICAgICAgICBcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XHJcblxyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIE1vdmVhYmxlICYmIHRhcmdldC53ZWlnaHQgPCB0aGlzLndlaWdodClcclxuICAgICAgICB7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL1N3YXAhICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdvcmxkLnBhcnRpY2xlc1t0aGlzLnBvc2l0aW9uLnldW3RoaXMucG9zaXRpb24ueF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHdvcmxkLnBhcnRpY2xlc1t0YXJnZXQucG9zaXRpb24ueV1bdGFyZ2V0LnBvc2l0aW9uLnhdID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1BvcyA9IG5ldyBWZWN0b3IyKHRhcmdldC5wb3NpdGlvbi54LHRhcmdldC5wb3NpdGlvbi55KTtcclxuXHJcbiAgICAgICAgICAgIHRhcmdldC5wb3NpdGlvbi54ID0gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgICAgICAgICB0YXJnZXQucG9zaXRpb24ueSA9IHRoaXMucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3M7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbdGhpcy5wb3NpdGlvbi55XVt0aGlzLnBvc2l0aW9uLnhdID0gdGhpcztcclxuICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3RhcmdldC5wb3NpdGlvbi55XVt0YXJnZXQucG9zaXRpb24ueF0gPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHZlbG9jaXR5OiBWZWN0b3IyOyAgICBcclxuICAgIHdlaWdodDogbnVtYmVyO1xyXG5cclxufVxyXG5cclxuLy80IEJhc2UgcGFydGljbGUgdHlwZXMgU29saWQgUG93ZGVyIEZsdWlkIEdhc1xyXG5cclxuZXhwb3J0IGNsYXNzIFNvbGlkIGV4dGVuZHMgUGFydGljbGV7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICBzdXBlcihwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IFwiZ3JheVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHN0ZXAoKXtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvd2RlciBleHRlbmRzIE1vdmVhYmxle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgc3VwZXIocG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcInllbGxvd1wiO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gMjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMCwxKSkpIHsgXHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGbHVpZCBleHRlbmRzIE1vdmVhYmxle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgc3VwZXIocG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcImFxdWFcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMCwxKSkpIHsgXHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVTaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlU2lkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVNpZGUoKXtcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMCkpKXtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDApKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMCkpKXtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMCkpKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7V29ybGQsV29ybGRTaXplfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtQYXJ0aWNsZX0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuXHJcbmludGVyZmFjZSBQaHlzaWNze1xyXG5cclxuICAgIHN0ZXAoc2ltX3N0YXRlOiBXb3JsZCk6V29ybGQ7XHJcblxyXG59XHJcblxyXG5jbGFzcyBCYXNpY1BoeXNpY3MgaW1wbGVtZW50cyBQaHlzaWNze1xyXG5cclxuICAgIHN0ZXAoc2ltX3N0YXRlOiBXb3JsZCl7XHJcbiAgICAgICAgbGV0IG1vdmVkIDpBcnJheTxQYXJ0aWNsZT4gPSBbXTtcclxuXHJcbiAgICAgICAgLy9zaW1fc3RhdGUuaXR0ZXJhdG9yRGlyZWN0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICozKTtcclxuXHJcbiAgICAgICAgLy9UaGlzIGxpbmUgZml4ZXMgZXZlcnl0aGluZ1xyXG4gICAgICAgIHNpbV9zdGF0ZS5pdHRlcmF0b3JEaXJlY3Rpb24rK1xyXG4gICAgICAgIGlmIChzaW1fc3RhdGUuaXR0ZXJhdG9yRGlyZWN0aW9uID4gMykge1xyXG4gICAgICAgICAgICBzaW1fc3RhdGUuaXR0ZXJhdG9yRGlyZWN0aW9uID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcihsZXQgcGFydCBvZiBzaW1fc3RhdGUpe1xyXG4gICAgICAgICAgICBpZighcGFydCB8fCBtb3ZlZC5pbmNsdWRlcyhwYXJ0KSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgIHBhcnQuc3RlcCgpOyAgICAgXHJcbiAgICAgICAgICAgIG1vdmVkLnB1c2gocGFydCk7XHJcblxyXG4gICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHBhcnQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNpbV9zdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFBoeXNpY3MgPSBuZXcgQmFzaWNQaHlzaWNzKCk7IiwiaW1wb3J0IHtXb3JsZCxXb3JsZFNpemUsd29ybGR9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuaW1wb3J0IHtjYW52YXMsY3R4fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3JlbmRlcmVyXCJcclxuXHJcbmludGVyZmFjZSBSZW5kZXJlcntcclxuXHJcbiAgICBkcmF3RnJhbWUoc2ltX3N0YXRlOiBXb3JsZCkgOiB2b2lkO1xyXG5cclxufVxyXG5cclxuY2xhc3MgQ2FudmFzUmVuZGVyZXIgaW1wbGVtZW50cyBSZW5kZXJlcntcclxuXHJcbiAgICBkcmF3RnJhbWUoc2ltX3N0YXRlOiBXb3JsZCl7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyM3NzcnO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KDAsMCw0MDAsMzAwKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHNpbV9zdGF0ZSl7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBhcnQpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuIFxyXG5cclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHBhcnQuY29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdChwYXJ0LnBvc2l0aW9uLngscGFydC5wb3NpdGlvbi55LDEsMSk7IC8vZHJhdyByZWN0YW5nbGUgOlBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFJlbmRlcmVyID0gbmV3IENhbnZhc1JlbmRlcmVyKCk7IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyBXb3JsZFNpemUgfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXRpbGl0eXtcclxuXHJcbiAgICBzdGF0aWMgaW5Cb3VuZHMocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uLnkgPj0gV29ybGRTaXplLnkgfHwgcG9zaXRpb24ueCA+PSBXb3JsZFNpemUueCB8fFxyXG4gICAgICAgICAgICBwb3NpdGlvbi55IDwgMCB8fCBwb3NpdGlvbi54IDwgMCApIFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB2ZWN0b3JJbnRlcnBvbGF0ZShlYWNoU3RlcDogRnVuY3Rpb24sIGZyb206VmVjdG9yMiwgdG86VmVjdG9yMil7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IG5ldyBWZWN0b3IyKFxyXG4gICAgICAgICAgICB0by54IC0gZnJvbS54LFxyXG4gICAgICAgICAgICB0by55IC0gZnJvbS55XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IHN0ZXAgPSBkaXJlY3Rpb24ubm9ybWFsaXplZCgpO1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gZnJvbTtcclxuXHJcbiAgICAgICAgLy93aGlsZShjdXJyZW50KVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7RHJhd2FibGV9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvb2JqZWN0MkRcIjtcclxuaW1wb3J0IHtQYXJ0aWNsZX0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuaW1wb3J0IHtSZW5kZXJlcn0gZnJvbSBcIi4vcmVuZGVyXCI7XHJcbmltcG9ydCB7UGh5c2ljc30gZnJvbSBcIi4vcGh5c2ljc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdvcmxkU2l6ZSA9IG5ldyBWZWN0b3IyKDQwMCwzMDApO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxke1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLml0dGVyYXRvckRpcmVjdGlvbiA9IDI7XHJcblxyXG4gICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3IEFycmF5KFdvcmxkU2l6ZS55KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucGFydGljbGVzLmxlbmd0aDsgaW5kZXgrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlc1tpbmRleF0gPSBuZXcgQXJyYXkoV29ybGRTaXplLngpLmZpbGwodW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9JdHRlcmF0b3JcclxuICAgIHByaXZhdGUgZ2V0SXR0ZXJWYWwoaSA6IG51bWJlcil7IFxyXG4gICAgICAgIGxldCB5ID0gTWF0aC5mbG9vcihpL1dvcmxkU2l6ZS54KTtcclxuICAgICAgICBsZXQgeCA9IGkgLSBNYXRoLmZsb29yKGkvV29ybGRTaXplLngpKldvcmxkU2l6ZS54O1xyXG5cclxuICAgICAgICBsZXQgb3V0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5pdHRlcmF0b3JEaXJlY3Rpb24pIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdGhpcy5wYXJ0aWNsZXNbeV1bV29ybGRTaXplLnggLSB4IC0xXTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBicmVhazsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIG91dCA9IHRoaXMucGFydGljbGVzW1dvcmxkU2l6ZS55IC0geSAtIDFdW3hdOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdGhpcy5wYXJ0aWNsZXNbV29ybGRTaXplLnkgLSB5IC0xXVtXb3JsZFNpemUueCAtIHggLTFdOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIG91dCA9IHRoaXMucGFydGljbGVzW3ldW3hdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgW1N5bWJvbC5pdGVyYXRvcl0gPSAoKSA9PiB7ICAgICAgXHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG5cclxuICAgICAgICByZXR1cm57XHJcbiAgICAgICAgICAgIG5leHQ6KCk9PntcclxuICAgICAgICAgICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgICAgICAgICBkb25lOiAoaSA+PSAoV29ybGRTaXplLnggKiBXb3JsZFNpemUueSAtIDEpKSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5nZXRJdHRlclZhbChpKyspICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcGFydGljbGVzOkFycmF5PEFycmF5PFBhcnRpY2xlIHwgdW5kZWZpbmVkPj47XHJcblxyXG4gICAgaXR0ZXJhdG9yRGlyZWN0aW9uIDpudW1iZXI7IC8vMC0zIHRsIHRyIGJsIGJyXHJcbiAgICBcclxufVxyXG5cclxuZXhwb3J0IHZhciB3b3JsZCA9IG5ldyBXb3JsZCgpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkTWFuYWdlciBleHRlbmRzIERyYXdhYmxleyAgXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBvblVwZGF0ZSgpeyAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvblJlbmRlcigpe1xyXG4gICAgICAgIHN1cGVyLm9uUmVuZGVyKCk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCF0aGlzLnBhdXNlZClcclxuICAgICAgICAgICAgUGh5c2ljcy5zdGVwKHdvcmxkKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgUmVuZGVyZXIuZHJhd0ZyYW1lKHdvcmxkKTtcclxuICAgIH0gICAgXHJcblxyXG5cclxuICAgIGFkZFBhcnQocGFydDogUGFydGljbGUpeyAgICAgICAgXHJcbiAgICAgICAgd29ybGQucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHBhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2VkOmJvb2xlYW47XHJcbn1cclxuXHJcblxyXG5cclxuLy9UT0RPOiBNdWx0aXRocmVhZGluZyBpZiBpIGZhbmN5XHJcbi8qXHJcbnVzZSB0aGlzIHRvIHRlc3QgaWYgc3VwcG9ydGVkXHJcblxyXG5pZiAodHlwZW9mKFdvcmtlcikgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgLy9ncmVhdCwgeW91ciBicm93c2VyIHN1cHBvcnRzIHdlYiB3b3JrZXJzXHJcbn0gZWxzZSB7XHJcbiAgIC8vbm90IHN1cHBvcnRlZFxyXG59XHJcblxyXG4qLyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0ICogYXMgQ0UgZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9jb3JlXCI7XHJcblxyXG5pbXBvcnQge1NjZW5lfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3NjZW5lXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuXHJcbmltcG9ydCB7d29ybGQsIFdvcmxkTWFuYWdlcn0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5cclxuaW1wb3J0IHtLZXlib2FyZElucHV0LCBNb3VzZUlucHV0fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2lucHV0XCI7XHJcblxyXG5pbXBvcnQgeyBGbHVpZCwgUG93ZGVyLCBTb2xpZCB9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcbmltcG9ydCB7IEN1cnNvciB9IGZyb20gXCIuL2N1cnNvclwiO1xyXG5pbXBvcnQgeyBQaHlzaWNzIH0gZnJvbSBcIi4vcGh5c2ljc1wiO1xyXG5cclxuLy9jcmVhdGUgc2NlbmVcclxubGV0IGxldmVsID0gbmV3IFNjZW5lKCk7XHJcbmxldCB3b3JsZF9tYW5hZ2VyID0gbmV3IFdvcmxkTWFuYWdlcigpO1xyXG5sZXQgY3Vyc29yID0gbmV3IEN1cnNvcigpO1xyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpPT57XHJcbiAgICAvL2luaXQgZW5naW5lXHJcbiAgICBDRS5pbml0KCk7XHJcbiAgICAvL2JpbmQgc2NlbmVcclxuICAgIENFLnNldEFjdGl2ZVNjZW5lKGxldmVsKTtcclxuICAgIFxyXG4gICAgbGV2ZWwubWVtYmVycy5wdXNoKHdvcmxkX21hbmFnZXIpO1xyXG4gICAgd29ybGRfbWFuYWdlci5vcmlnaW4uc2NhbGUgPSBuZXcgVmVjdG9yMigyLDIpO1xyXG4gICAgICAgIFxyXG4gICAgbGV2ZWwubWVtYmVycy5wdXNoKGN1cnNvcik7XHJcblxyXG5cclxuXHJcbiAgICAvL3dvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgUG93ZGVyKG5ldyBWZWN0b3IyKDgwLDApKSk7ICBcclxuXHJcbiAgICAvL0RlbW8gd29ybGRcclxuICAgIGZvciAobGV0IHggPSA2MDsgeCA8IDE0MDsgeCsrKSB7ICAgICBcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDE1OyB5KyspIHsgICAgIFxyXG4gICAgICAgICAgICAvL21peCBzb21lIGZsdWlkIGFuZCBwb3dkZXJcclxuICAgICAgICAgICAgaWYoeCp5ICUgMyA9PSAwKXsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFBvd2RlcihuZXcgVmVjdG9yMih4LHkpKSk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IEZsdWlkKG5ldyBWZWN0b3IyKHgseSsyMCkpKTsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTAwOyB4KyspIHsgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4KzAseCs2MCkpKTsgICAgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4KzAseCs2MSkpKTsgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwMDsgeCsrKSB7IFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMjAwLHgrNjApKSk7ICAgIFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMjAwLHgrNjEpKSk7ICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCA1MDsgeCsrKSB7IFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMTAwLHgrMTkwKSkpOyAgICBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzEwMCx4KzE5MSkpKTsgICAgICBcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL3J1bnMgZXZlcnkgdGljayBcclxubGV2ZWwub25VcGRhdGUgPSAoKT0+e1xyXG4gICAgXHJcblxyXG4gICAgaWYgKEtleWJvYXJkSW5wdXQuaXNKdXN0UHJlc3NlZChcIlNwYWNlXCIpKSB7XHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5wYXVzZWQgPSAhd29ybGRfbWFuYWdlci5wYXVzZWQ7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoS2V5Ym9hcmRJbnB1dC5pc0p1c3RQcmVzc2VkKFwiZlwiKSkge1xyXG4gICAgICAgIHdvcmxkX21hbmFnZXIucGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICBQaHlzaWNzLnN0ZXAod29ybGQpO1xyXG4gICAgfSAgXHJcblxyXG59OyAiXSwic291cmNlUm9vdCI6IiJ9