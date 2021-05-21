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
var util_1 = __webpack_require__(/*! ./util */ "../game/util.ts");
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
            if (!util_1.Utility.inBounds(pos))
                return;
            if (!world_manager_1.world.particles[pos.y][pos.x])
                world_manager_1.world.particles[pos.y][pos.x] = new particle_1.Powder(pos);
        }));
        _this.tools.set("RMB", new cursorTool_1.Tool(function (pos) {
            if (!util_1.Utility.inBounds(pos))
                return;
            delete world_manager_1.world.particles[pos.y][pos.x];
        }));
        _this.tools.set("ScrollButton", new cursorTool_1.Tool(function (pos) {
            if (!util_1.Utility.inBounds(pos))
                return;
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
        this.color = { r: 255, g: 255, b: 255 };
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
        _this.color = { r: 120, g: 120, b: 120 };
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
        _this.color = { r: 255, g: 255, b: 0 };
        ;
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
        _this.color = { r: 10, g: 170, b: 255 };
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
exports.Physics = void 0;
var particle_1 = __webpack_require__(/*! ./particle */ "../game/particle.ts");
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
                if (!part || !(part instanceof particle_1.Moveable) || moved.includes(part))
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
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var renderer_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/renderer */ "./src/engine/renderer.ts");
var util_1 = __webpack_require__(/*! ./util */ "../game/util.ts");
var BasicRenderer = /** @class */ (function () {
    function BasicRenderer() {
    }
    BasicRenderer.prototype.drawFrame = function (sim_state) {
        var e_1, _a;
        try {
            for (var sim_state_1 = __values(sim_state), sim_state_1_1 = sim_state_1.next(); !sim_state_1_1.done; sim_state_1_1 = sim_state_1.next()) {
                var part = sim_state_1_1.value;
                if (!part)
                    continue;
                renderer_1.ctx.fillStyle = util_1.Utility.rgbToHex(part.color);
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
    return BasicRenderer;
}());
var PixelRenderer = /** @class */ (function () {
    function PixelRenderer() {
        this.canvasData = undefined;
        //ctx.imageSmoothingEnabled = false;
    }
    PixelRenderer.prototype.drawFrame = function (sim_state) {
        this.canvasData = renderer_1.ctx.getImageData(0, 0, renderer_1.canvas.width, renderer_1.canvas.height);
        for (var x = 0; x < renderer_1.canvas.width; x++) {
            for (var y = 0; y < renderer_1.canvas.height; y++) {
                var part = world_manager_1.world.particles[Math.floor(y / 2)][Math.floor(x / 2)];
                if (!part)
                    continue;
                var index = (x + y * renderer_1.canvas.width) * 4;
                this.canvasData.data[index + 0] = part.color.r;
                this.canvasData.data[index + 1] = part.color.g;
                this.canvasData.data[index + 2] = part.color.b;
                this.canvasData.data[index + 3] = 255;
            }
        }
        renderer_1.ctx.putImageData(this.canvasData, 0, 0);
    };
    return PixelRenderer;
}());
exports.Renderer = new PixelRenderer();


/***/ }),

/***/ "../game/util.ts":
/*!***********************!*\
  !*** ../game/util.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utility = void 0;
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
    Utility.vectorInterpolate = function (from, to, progress) {
    };
    Utility.rgbToHex = function (color) {
        var r = color.r;
        var g = color.g;
        var b = color.b;
        var rhex = r.toString(16);
        rhex = (rhex.length == 1 ? "0" + rhex : rhex);
        var ghex = g.toString(16);
        ghex = (ghex.length == 1 ? "0" + ghex : ghex);
        var bhex = b.toString(16);
        bhex = (bhex.length == 1 ? "0" + bhex : bhex);
        return "#" + rhex + ghex + bhex;
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
var renderer_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/renderer */ "./src/engine/renderer.ts");
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
        switch (this.itteratorDirection) {
            case 1:
                return this.particles[y][exports.WorldSize.x - x - 1];
            case 2:
                return this.particles[exports.WorldSize.y - y - 1][x];
            case 3:
                return this.particles[exports.WorldSize.y - y - 1][exports.WorldSize.x - x - 1];
            default:
                return this.particles[y][x];
        }
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
        renderer_1.ctx.strokeStyle = '#777';
        renderer_1.ctx.strokeRect(0, 0, 400, 300);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2hhcGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL2N1cnNvci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvY3Vyc29yVG9vbC50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvcGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BoeXNpY3MudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3JlbmRlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvdXRpbC50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvd29ybGRfbWFuYWdlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtFQUNFO0FBQ0YsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFD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QztBQUVGLGtCQUFrQjtBQUNsQixLQUFLLENBQUMsUUFBUSxHQUFHO0lBR2IsSUFBSSxxQkFBYSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUN0QyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztLQUNoRDtJQUVELElBQUkscUJBQWEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbEMsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDNUIsaUJBQU8sQ0FBQyxJQUFJLENBQUMscUJBQUssQ0FBQyxDQUFDO0tBQ3ZCO0FBRUwsQ0FBQyxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlF1ZXJyeSBzZWxlY3RvciBmb3IgdGhlIGNhbnZhcyBlbGVtZW50XHJcbiovXHJcbmNvbnN0IGNhbnZhc1NlbGVjdG9yID0gXCIjZ2FtZVwiO1xyXG5jb25zdCByZXNpemVWaWV3cG9ydCA9IGZhbHNlO1xyXG4vKipUYXJnZXQgZnJhbWVzIHBlciBzZWNvbmRcclxuKi9cclxuY29uc3QgZnBzID0gNjA7XHJcblxyXG5leHBvcnQge1xyXG4gICAgY2FudmFzU2VsZWN0b3IsICAgIFxyXG4gICAgZnBzLFxyXG4gICAgcmVzaXplVmlld3BvcnRcclxufSIsIi8qKlxyXG4gKiAyRCBWZWN0b3JcclxuICogU3RvcmVzIFggYW5kIFlcclxuKi9cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjIgIHtcclxuICAgIGNvbnN0cnVjdG9yKFggOm51bWJlcixZIDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMueCA9IFg7XHJcbiAgICAgICAgdGhpcy55ID0gWTtcclxuICAgIH1cclxuXHJcbiAgICBsZW5naHQoKXtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICBNYXRoLnBvdyh0aGlzLngsMikgKyBNYXRoLnBvdyh0aGlzLnksMilcclxuICAgICAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBub3JtYWxpemVkKCl7XHJcbiAgICAgICAgbGV0IG5ld1ZlY3RvciA9IG5ldyBWZWN0b3IyKHRoaXMueCx0aGlzLnkpO1xyXG4gICAgICAgIGxldCBsZW5naHQgPSBuZXdWZWN0b3IubGVuZ2h0KClcclxuICAgICAgICBuZXdWZWN0b3IueCAvPSBsZW5naHQ7XHJcbiAgICAgICAgbmV3VmVjdG9yLnkgLz0gbGVuZ2h0O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3VmVjdG9yO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB4Om51bWJlcjtcclxuICAgIHk6bnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogU3RvcmVzIHBvc2l0aW9uIHJvdGF0aW9uIChkZWdyZWVzKSBhbmQgc2NhbGVcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xyXG4gICAgY29uc3RydWN0b3IocG9zPyA6VmVjdG9yMiwgcm90PyA6bnVtYmVyLCBzY2FsZT8gOlZlY3RvcjIpe1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gICA9IHBvcyA/IHBvcyAgICAgOiBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gICA9IHJvdCA/IHJvdCAgICAgOiAwO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgICAgICA9IHNjYWxlID8gc2NhbGUgOiBuZXcgVmVjdG9yMigxLDEpO1xyXG4gICAgfVxyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7XHJcbiAgICByb3RhdGlvbjogbnVtYmVyO1xyXG4gICAgc2NhbGU6IFZlY3RvcjI7XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVuZGVyaW5nIGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcbmltcG9ydCAqIGFzIENvbmZpZyBmcm9tIFwiLi8uLi9lbmdpbmVDb25maWdcIjtcclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4vc2NlbmVcIjtcclxuaW1wb3J0IHtLZXlib2FyZElucHV0LCBNb3VzZUlucHV0fSBmcm9tIFwiLi8uLi9lbmdpbmUvaW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgdmFyIGFjdGl2ZVNjZW5lIDogU2NlbmUgfCB1bmRlZmluZWRcclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHNjZW5lIHlvdSB3YW50IHRvIGJlIGN1cnJlbnRseSBkaXNwbGF5ZWQgYW5kIHVwZGF0ZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3RpdmVTY2VuZShzY2VuZSA6U2NlbmUpe1xyXG4gICAgYWN0aXZlU2NlbmUgPSBzY2VuZTtcclxufVxyXG4vKipcclxuICogSW5pdGlhbGl6ZSB0aGUgZW5naW5lXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgUmVuZGVyaW5nLmluaXQoKTtcclxuICAgIEtleWJvYXJkSW5wdXQuaW5pdCgpO1xyXG4gICAgTW91c2VJbnB1dC5pbml0KCk7XHJcblxyXG4gICAgc2V0SW50ZXJ2YWwodXBkYXRlLDEwMDAvQ29uZmlnLmZwcyk7XHJcbn1cclxuLyoqXHJcbiAqIERvbid0IHVzZSBleHRlcm5hbHkuXHJcbiAqIENhbGxzIG9uVXBkYXRlIGFuZCBvblJlbmRlciBtZXRob2RzXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGUoKXtcclxuICAgIGlmKGFjdGl2ZVNjZW5lPy5vblVwZGF0ZSlcclxuICAgICAgICBhY3RpdmVTY2VuZS5vblVwZGF0ZSgpO1xyXG4gICAgYWN0aXZlU2NlbmU/LnVwZGF0ZSgpO1xyXG5cclxuICAgIFJlbmRlcmluZy5yZW5kZXIoKTtcclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7IGNhbnZhcyB9IGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcblxyXG4vKipcclxuICogTW9zdCBvZiBrZXlzIHByZXNlbnQgb24gdGhlIGtleWJvYXJkIGFzIGEgc3RyaW5nIHVuaW9uLiBQbGVhc2UgcmVwb3J0IGFueSBtaXNzaW5nIGtleXMuXHJcbiAqL1xyXG5leHBvcnQgdHlwZSBLZXkgPSBcIlRhYlwiIHwgXCJBbHRcIiB8IFwiQWx0R3JhcGhcIiB8IFwiQmFja3NwYWNlXCIgfCBcIkNvbnRyb2xcIiB8XCJTaGlmdFwiIHwgXCJTcGFjZVwiIHwgXCJDb250ZXh0TWVudVwiIHwgXCJFbnRlclwiIHwgXCJOdW1Mb2NrXCIgfCBcIkhvbWVcIiB8IFwiUGFnZVVwXCIgfCBcIlBhZ2VEb3duXCIgfCBcIkluc2VydFwiIHwgXCJEZWxldGVcIiB8IFwiQXJyb3dVcFwiIHwgXCJBcnJvd0Rvd25cIiB8IFwiQXJyb3dSaWdodFwiIHwgXCJBcnJvd0xlZnRcIiB8XCIhXCIgfCBcIlxcXCJcInwgXCIjXCIgfCBcIiRcIiB8IFwiJVwiIHwgXCImXCIgfCBcIidcIiB8IFwiKFwiIHwgXCIpXCIgfCBcIipcIiB8IFwiK1wiIHwgXCIsXCIgfCBcIi1cIiB8IFwiLlwiIHwgXCIvXCIgfCBcIjBcIiB8IFwiMVwiIHwgXCIyXCIgfCBcIjNcIiB8IFwiNFwiIHwgXCI1XCIgfCBcIjZcIiB8IFwiN1wiIHwgXCI4XCIgfCBcIjlcIiB8IFwiOlwiIHwgXCI7XCIgfCBcIjxcIiB8IFwiPVwiIHwgXCI+XCIgfCBcIj9cIiB8IFwiQFwiIHwgXCJBXCIgfCBcIkJcIiB8IFwiQ1wiIHwgXCJEXCIgfCBcIkVcIiB8IFwiRlwiIHwgXCJHXCIgfCBcIkhcIiB8IFwiSVwiIHwgXCJKXCIgfCBcIktcIiB8IFwiTFwiIHwgXCJNXCIgfCBcIk5cIiB8IFwiT1wiIHwgXCJQXCIgfCBcIlFcIiB8IFwiUlwiIHwgXCJTXCIgfCBcIlRcIiB8IFwiVVwiIHwgXCJWXCIgfCBcIldcIiB8IFwiWFwiIHwgXCJZXCIgfCBcIlpcIiB8IFwiW1wiIHwgXCJcXFxcXCIgfCBcIl1cIiB8IFwiXlwiIHwgXCJfXCIgfCBcImBcIiB8IFwiYVwiIHwgXCJiXCIgfCBcImNcIiB8IFwiZFwiIHwgXCJlXCIgfCBcImZcIiB8IFwiZ1wiIHwgXCJoXCIgfCBcImlcIiB8IFwialwiIHwgXCJrXCIgfCBcImxcIiB8IFwibVwiIHwgXCJuXCIgfCBcIm9cIiB8IFwicFwiIHwgXCJxXCIgfCBcInJcIiB8IFwic1wiIHwgXCJ0XCIgfCBcInVcIiB8IFwidlwiIHwgXCJ3XCIgfCBcInhcIiB8IFwieVwiIHwgXCJ6XCIgfCBcIntcIiB8IFwifFwiIHwgXCJ9XCIgfCBcIn5cIiA7XHJcblxyXG5leHBvcnQgdHlwZSBNb3VzZUJ1dHRvbiA9IFwiTE1CXCIgfCBcIlNjcm9sbEJ1dHRvblwiIHwgXCJSTUJcIjsgXHJcblxyXG5leHBvcnQgZW51bSBLZXlTdGF0ZXtcclxuICAgIFBSRVNTRUQsXHJcbiAgICBIT0xELFxyXG4gICAgUkVMRUFTRSxcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEtleWJvYXJkSW5wdXR7XHJcbiAgICAvKipcclxuICAgICAqIEFkZCBldmVudCBsaXN0ZW5lcnMgZm9yIGtleSBwcmVzc2VzLlxyXG4gICAgICogQWxscmVhZHkgY2FsbGVkIGJ5IHRoZSBpbml0IGZ1bmN0aW9uIGZyb20gY29yZS50c1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzID0gbmV3IE1hcDxLZXksS2V5U3RhdGU+KCk7XHJcblxyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsKGUpPT57ICAgXHJcbiAgICAgICAgICAgIGlmKEtleWJvYXJkSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMuc2V0KEtleWJvYXJkSW5wdXQuc3RyaW5nVG9LZXkoZS5rZXkpLEtleVN0YXRlLlBSRVNTRUQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwoZSk9PnsgICAgXHJcbiAgICAgICAgICAgIGlmKEtleWJvYXJkSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyBcclxuXHJcbiAgICAgICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzLnNldChLZXlib2FyZElucHV0LnN0cmluZ1RvS2V5KGUua2V5KSxLZXlTdGF0ZS5SRUxFQVNFKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgZm9yIHByZXNzZWQga2V5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpc1ByZXNzZWQoa2V5OiBLZXkpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMua2V5U3RhdGVzLmdldChrZXkpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRCkge1xyXG4gICAgICAgICAgICB0aGlzLmtleVN0YXRlcy5zZXQoa2V5LEtleVN0YXRlLkhPTEQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICEoc3RhdGUgPT09IHVuZGVmaW5lZCB8fCBzdGF0ZSA9PSBLZXlTdGF0ZS5SRUxFQVNFKVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc0p1c3RQcmVzc2VkKGtleTogS2V5KXtcclxuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmtleVN0YXRlcy5nZXQoa2V5KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRCkge1xyXG4gICAgICAgICAgICB0aGlzLmtleVN0YXRlcy5zZXQoa2V5LEtleVN0YXRlLkhPTEQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQ7XHJcbiAgICAgICAgLy9yZXR1cm4gXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBrZXlTdGF0ZXM6IE1hcDxLZXksS2V5U3RhdGU+O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHN0cmluZ1RvS2V5KGtleSA6c3RyaW5nKXsgICAgICAgIFxyXG4gICAgICAgIGxldCB2YWwgPSBrZXkucmVwbGFjZShcIkRlYWRcIixcIn5cIik7XHJcbiAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoXCIgXCIsXCJTcGFjZVwiKTtcclxuICAgICAgICBsZXQga2V5dHlwZSA9IHZhbCAgYXMgS2V5O1xyXG4gICAgICAgIHJldHVybiBrZXl0eXBlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW91c2VJbnB1dHtcclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMgPSBuZXcgTWFwPE1vdXNlQnV0dG9uLEtleVN0YXRlPigpO1xyXG4gICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZSA9IHt4OjAseTowLHo6MH07XHJcblxyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlbW92ZSA9IGUgPT4geyAgIFxyXG4gICAgICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KSAgICBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uID0gbmV3IFZlY3RvcjIoZS54LCBlLnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjYW52YXMub253aGVlbCA9IGUgPT4geyAgICBcclxuICAgICAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UueCArPSBlLmRlbHRhWDtcclxuICAgICAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlLnkgKz0gZS5kZWx0YVk7XHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZS56ICs9IGUuZGVsdGFaO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuc2V0KE1vdXNlSW5wdXQubnVtYmVyVG9CdXR0b24oZS5idXR0b24pLEtleVN0YXRlLlBSRVNTRUQpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYW52YXMub25tb3VzZXVwID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuc2V0KE1vdXNlSW5wdXQubnVtYmVyVG9CdXR0b24oZS5idXR0b24pLEtleVN0YXRlLlJFTEVBU0UpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3ByZXZlbnQgY29udGV4dCBtZW51XHJcbiAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhbnZhcy5vbmNvbnRleHRtZW51ID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFdoZWVsT2Zmc2V0KCl7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZTtcclxuICAgICAgICBsZXQgb3V0ID0ge3g6b2Zmc2V0LngsIHk6b2Zmc2V0LnksIHo6b2Zmc2V0Lnp9O1xyXG5cclxuICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UgPSB7eDowLHk6MCx6OjB9O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHN0YXRpYyBpc1ByZXNzZWQoYnV0dG9uOiBNb3VzZUJ1dHRvbil7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuZ2V0KGJ1dHRvbik7XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChidXR0b24sS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gIShzdGF0ZSA9PT0gdW5kZWZpbmVkIHx8IHN0YXRlID09IEtleVN0YXRlLlJFTEVBU0UpXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGlzSnVzdFByZXNzZWQoYnV0dG9uOiBNb3VzZUJ1dHRvbil7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuZ2V0KGJ1dHRvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcclxuICAgICAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuc2V0KGJ1dHRvbixLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEO1xyXG4gICAgICAgIC8vcmV0dXJuIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIG51bWJlclRvQnV0dG9uKG51bWJlciA6IG51bWJlciApIDogTW91c2VCdXR0b257XHJcbiAgICAgICAgc3dpdGNoIChudW1iZXIpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTE1CXCI7XHJcbiAgICAgICAgICAgIGNhc2UgMTogICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJTY3JvbGxCdXR0b25cIjtcclxuICAgICAgICAgICAgY2FzZSAyOiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlJNQlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFwiTE1CXCI7IC8vdGhhdHMgbm90IGdvbm5hIGhhcHBlblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwcmV2ZW50RGVmYXVsdCA9IHRydWU7XHJcbiAgICBzdGF0aWMgY3VycmVudFBvc2l0aW9uOiBWZWN0b3IyO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGJ1dHRvblN0YXRlczogTWFwPE1vdXNlQnV0dG9uLEtleVN0YXRlPjtcclxuICAgIHByaXZhdGUgc3RhdGljIG1vdXNlV2hlZWxDaGFuZ2UgOiB7eDpudW1iZXIsIHk6bnVtYmVyLCB6Om51bWJlcn07XHJcbn0iLCJpbXBvcnQge1ZlY3RvcjIsVHJhbnNmb3JtfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7Y3R4fSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5cclxuLyoqXHJcbiAqIEJhc2UgZm9yIGNoaWxkcmVuIHBvbHltb3JwaGlzbVxyXG4gKiBJbXBsZW1lbnQgdGhpcyBpbnRlcmZhY2Ugd2hlbiBjcmVhdGluZyBhIGNvbXBvbmVudCAvIGNoaWxkLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBPYmplY3QyRCB7XHJcbiAgICAvL0hhcHBlbnMgZXZlcnkgdGlja1xyXG4gICAgb25VcGRhdGUoKSA6dm9pZDsgXHJcbiAgICAvL0NhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgb25SZW5kZXIoKSA6dm9pZDsgXHJcbiAgICBhZnRlclJlbmRlcigpIDp2b2lkOyBcclxuXHJcbiAgICBvcmlnaW46IFRyYW5zZm9ybTsgICAgXHJcbiAgICBjaGlsZHJlbjogQXJyYXk8T2JqZWN0MkQ+O1xyXG59XHJcblxyXG4vKipcclxuICogQmFzZSBmb3IgY2hpbGRyZW4gdGhhdCB3YW50IHRvIHJlbmRlciBzb21ldGhpbmcuXHJcbiAqIEV4dGVuZCB0aGlzIGNsYXNzIGZvciBjdHggYWNjZXNzIGFuZCBvcmlnaW4gdHJhbnNmb3JtIGhhbmRlbGluZy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBEcmF3YWJsZSBpbXBsZW1lbnRzIE9iamVjdDJEIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSBuZXcgVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMudXNlX2xvY2FsX2Nvb3JkaW5hdGVzID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5faW5fY2VudGVyID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICovXHJcbiAgICBvblVwZGF0ZSgpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICogQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXHJcbiAgICAgKi9cclxuICAgIG9uUmVuZGVyKCl7ICAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKC0odGhpcy5vcmlnaW4uc2NhbGUueC8yKSwtKHRoaXMub3JpZ2luLnNjYWxlLnkvMikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHgudHJhbnNsYXRlKHRoaXMub3JpZ2luLnBvc2l0aW9uLngsdGhpcy5vcmlnaW4ucG9zaXRpb24ueSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLm9yaWdpbi5zY2FsZS54LzIsdGhpcy5vcmlnaW4uc2NhbGUueS8yKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICAgICBjdHgucm90YXRlKHRoaXMub3JpZ2luLnJvdGF0aW9uICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSgtKHRoaXMub3JpZ2luLnNjYWxlLngvMiksLSh0aGlzLm9yaWdpbi5zY2FsZS55LzIpKTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIGN0eC5zY2FsZSh0aGlzLm9yaWdpbi5zY2FsZS54LHRoaXMub3JpZ2luLnNjYWxlLnkpOyAgICAgIFxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICogQ2FsbGVkIGFmdGVyIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgICAqL1xyXG4gICAgYWZ0ZXJSZW5kZXIoKXsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIERyYXdhYmxlICYmICFjaGlsZC51c2VfbG9jYWxfY29vcmRpbmF0ZXMpXHJcbiAgICAgICAgICAgICAgICBjdHguc2NhbGUoMS90aGlzLm9yaWdpbi5zY2FsZS54LDEvdGhpcy5vcmlnaW4uc2NhbGUueSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjaGlsZC5vblJlbmRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvcmlnaW46IFRyYW5zZm9ybTsgICAgXHJcbiAgICBjaGlsZHJlbjogQXJyYXk8T2JqZWN0MkQ+O1xyXG4gICAgdXNlX2xvY2FsX2Nvb3JkaW5hdGVzOiBib29sZWFuO1xyXG4gICAgb3JpZ2luX2luX2NlbnRlcjogYm9vbGVhbjtcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBDb25maWcgZnJvbSBcIi4vLi4vZW5naW5lQ29uZmlnXCI7XHJcbmltcG9ydCB7YWN0aXZlU2NlbmV9IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCB2YXIgY3R4IDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbmV4cG9ydCB2YXIgY2FudmFzIDpIVE1MQ2FudmFzRWxlbWVudDtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIHRoZSBjYW52YXMgY29udGV4dC5cclxuICogQWxscmVhZHkgY2FsbGVkIGJ5IHRoZSBpbml0IGZ1bmN0aW9uIGZyb20gY29yZS50c1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKXtcclxuICAgIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoQ29uZmlnLmNhbnZhc1NlbGVjdG9yKSEgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlcyB2aWV3cG9ydCBzaXplLFxyXG4gKiBjYWxscyBhbGwgdGhlIG9uUmVuZGVyIG1ldGhvZHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoKXsgIFxyXG4gICAgaWYoQ29uZmlnLnJlc2l6ZVZpZXdwb3J0KXtcclxuICAgICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICBcclxuICAgIGFjdGl2ZVNjZW5lPy5yZW5kZXIoKTtcclxufSIsImltcG9ydCB7RHJhd2FibGUsIE9iamVjdDJEfSBmcm9tIFwiLi9vYmplY3QyRFwiXHJcbmltcG9ydCB7Y3R4LGNhbnZhc30gZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBSb290IGZvciBhbGwgdGhlIGVsZW1lbnRzIGluc2lkZSB5b3VyIGxldmVsLlxyXG4gKiBPYmplY3RzIG5vdCBhIG1lbWJlciBvZiB0aGUgYWN0aXZlIHNjZW5lIHdvbnQgYmUgY2FsbGVkIHZpYSBvblVwZGF0ZSBhbmQgb25SZW5kZXIuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2NlbmV7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKGNoaWxkPT57XHJcbiAgICAgICAgICAgIGNoaWxkLm9uVXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uVXBkYXRlKVxyXG4gICAgICAgICAgICB0aGlzLm9uVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tZW1iZXJzLmZvckVhY2goY2hpbGQ9PntcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY2hpbGQub25SZW5kZXIoKTtcclxuICAgICAgICAgICAgY2hpbGQuYWZ0ZXJSZW5kZXIoKTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gICBcclxuXHJcbiAgICBvblVwZGF0ZTogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XHJcbiAgICBtZW1iZXJzOiBBcnJheTxPYmplY3QyRD47XHJcbn0iLCJpbXBvcnQge0RyYXdhYmxlfSBmcm9tIFwiLi9vYmplY3QyRFwiO1xyXG5pbXBvcnQge1ZlY3RvcjIsVHJhbnNmb3JtfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7IGN0eCB9IGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcblxyXG4vKipcclxuICogRGVmaW5lcyBhIHNoZXBlJ3Mgb3V0bGluZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE91dGxpbmUge1xyXG4gICAgY29uc3RydWN0b3Iod2lkdGg6IG51bWJlcixjb2xvcjogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy50aGlja25lc3MgPSB3aWR0aDtcclxuICAgIH1cclxuICAgIHRoaWNrbmVzczogbnVtYmVyO1xyXG4gICAgY29sb3I6IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIFNvbGlkIGNvbG9yIGRyYXdhYmxlIGVsZW1lbnRcclxuICogVXNlIGZvciBjdXN0b20gcG9seWdvbiBzaGFwZXMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2hhcGUgZXh0ZW5kcyBEcmF3YWJsZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih2ZXJ0aWNpZXM6IFZlY3RvcjJbXSwgY29sb3I/OiBzdHJpbmcsb3V0bGluZT86IE91dGxpbmUpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGljaWVzID0gdmVydGljaWVzO1xyXG5cclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPyBjb2xvciA6IFwid2hpdGVcIjtcclxuICAgICAgICB0aGlzLm91dGxpbmUgPSBvdXRsaW5lID8gb3V0bGluZSA6IG5ldyBPdXRsaW5lKDAsJyMwMDAwJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqIENhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgICovXHJcbiAgICBvblJlbmRlcigpe1xyXG4gICAgICAgIHN1cGVyLm9uUmVuZGVyKCk7XHJcbiAgICAgICBcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyh0aGlzLnZlcnRpY2llc1swXS54LHRoaXMudmVydGljaWVzWzBdLnkpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy52ZXJ0aWNpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gdGhpcy52ZXJ0aWNpZXNbaV07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdHgubGluZVRvKHZlcnRleC54LHZlcnRleC55KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5yZXNldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMub3V0bGluZS50aGlja25lc3M7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5vdXRsaW5lLmNvbG9yO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTsgICAgICAgIFxyXG5cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICB2ZXJ0aWNpZXM6IFZlY3RvcjJbXTtcclxuICAgIG91dGxpbmU6IE91dGxpbmU7XHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQge1NoYXBlLE91dGxpbmV9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvc2hhcGVcIjtcclxuaW1wb3J0IHtNb3VzZUJ1dHRvbiwgTW91c2VJbnB1dH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9pbnB1dFwiO1xyXG5pbXBvcnQgeyBjdHggfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3JlbmRlcmVyXCI7XHJcbmltcG9ydCB7IHdvcmxkIH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBGbHVpZCwgUG93ZGVyLCBTb2xpZCB9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcbmltcG9ydCB7IFV0aWxpdHkgfSBmcm9tIFwiLi91dGlsXCI7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tIFwiLi9jdXJzb3JUb29sXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ3Vyc29yIGV4dGVuZHMgU2hhcGV7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIGxldCBkZWZhdWx0U2hhcGUgPSBbXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDIsMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDIsMiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMClcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBzdXBlcihkZWZhdWx0U2hhcGUsXCIjMDAwMFwiLG5ldyBPdXRsaW5lKDEsJyNGRkY5JykpO1xyXG5cclxuICAgICAgICB0aGlzLm9yaWdpbl9pbl9jZW50ZXIgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gMTtcclxuXHJcbiAgICAgICAgdGhpcy50b29scyA9IG5ldyBNYXA8TW91c2VCdXR0b24sVG9vbD4oKTtcclxuXHJcbiAgICAgICAgdGhpcy50b29scy5zZXQoXCJMTUJcIixuZXcgVG9vbChwb3M9PntcclxuICAgICAgICAgICAgaWYoIVV0aWxpdHkuaW5Cb3VuZHMocG9zKSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIXdvcmxkLnBhcnRpY2xlc1twb3MueV1bcG9zLnhdKVxyXG4gICAgICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3Bvcy55XVtwb3MueF0gPSBuZXcgUG93ZGVyKHBvcyk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2xzLnNldChcIlJNQlwiLG5ldyBUb29sKHBvcz0+e1xyXG4gICAgICAgICAgICBpZighVXRpbGl0eS5pbkJvdW5kcyhwb3MpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZGVsZXRlIHdvcmxkLnBhcnRpY2xlc1twb3MueV1bcG9zLnhdO1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgdGhpcy50b29scy5zZXQoXCJTY3JvbGxCdXR0b25cIixuZXcgVG9vbChwb3M9PntcclxuICAgICAgICAgICAgaWYoIVV0aWxpdHkuaW5Cb3VuZHMocG9zKSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmICghd29ybGQucGFydGljbGVzW3Bvcy55XVtwb3MueF0pXHJcbiAgICAgICAgICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbcG9zLnldW3Bvcy54XSA9IG5ldyBTb2xpZChwb3MpO1xyXG4gICAgICAgIH0pKTtcclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VSYWRpdXMocmFkaXVzIDogbnVtYmVyKXtcclxuICAgICAgICByYWRpdXMgPSBNYXRoLnJvdW5kKHJhZGl1cyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy52ZXJ0aWNpZXMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKHJhZGl1cyoyLDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMihyYWRpdXMqMixyYWRpdXMqMiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAscmFkaXVzKjIpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigwLDApXHJcbiAgICAgICAgXSAgICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIG9uVXBkYXRlKCl7XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgLT0gTW91c2VJbnB1dC5nZXRXaGVlbE9mZnNldCgpLnkgLyAxMDA7XHJcbiAgICAgICAgaWYgKHRoaXMucmFkaXVzIDwgMSkge1xyXG4gICAgICAgICAgICB0aGlzLnJhZGl1cyA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZVJhZGl1cyh0aGlzLnJhZGl1cyk7XHJcblxyXG4gICAgICAgIHRoaXMudG9vbHMuZm9yRWFjaCgodG9vbCxidXR0b24pPT57XHJcbiAgICAgICAgICAgIGlmIChNb3VzZUlucHV0LmlzUHJlc3NlZChidXR0b24pKSB7XHJcbiAgICAgICAgICAgICAgICB0b29sLmRyYXcodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvblJlbmRlcigpeyAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGlmKE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4ucG9zaXRpb24ueCA9IE1hdGgucm91bmQoIE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uLnggLzIpICoyO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbi55ID0gTWF0aC5yb3VuZChNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbi55IC8yKSAqIDI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbi54IC09IHRoaXMucmFkaXVzO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbi55IC09IHRoaXMucmFkaXVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmN0eCA9PSBjdHgpO1xyXG5cclxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJhZGl1czpudW1iZXI7XHJcbiAgICB0b29sczpNYXA8TW91c2VCdXR0b24sVG9vbD47XHJcblxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyBDdXJzb3IgfSBmcm9tIFwiLi9jdXJzb3JcIjtcclxuaW1wb3J0IHsgd29ybGQgfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVG9vbHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlUGFydCA6IChwb3M6IFZlY3RvcjIpID0+IHZvaWQpe1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBwbGFjZVBhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdXJzb3I6Q3Vyc29yKXtcclxuICAgICAgICBsZXQgcG9zID0gY3Vyc29yLm9yaWdpbi5wb3NpdGlvbjtcclxuICAgICAgICBwb3MueCA9IE1hdGguZmxvb3IocG9zLnggLyAyKTtcclxuICAgICAgICBwb3MueSA9IE1hdGguZmxvb3IocG9zLnkgLyAyKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgeSA9IHBvcy55OyB5IDwgKHBvcy55ICsgKGN1cnNvci5yYWRpdXMpKTsgeSsrKSB7ICBcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHBvcy54OyB4IDwgKHBvcy54ICsgKGN1cnNvci5yYWRpdXMpKTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrKG5ldyBWZWN0b3IyKHgseSkpOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgY2FsbGJhY2sgOiAocG9zOiBWZWN0b3IyKSA9PiB2b2lkO1xyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyBVdGlsaXR5IH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5pbXBvcnQgeyB3b3JsZCxXb3JsZFNpemUgfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFBhcnRpY2xle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSB7cjoyNTUsZzoyNTUsYjoyNTV9O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGVwKCl7XHJcbiAgICB9O1xyXG4gICBcclxuICAgIHBvc2l0aW9uOiBWZWN0b3IyOyBcclxuICAgIGNvbG9yOiB7cjpudW1iZXIsZzpudW1iZXIsYjpudW1iZXJ9O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW92ZWFibGUgZXh0ZW5kcyBQYXJ0aWNsZXsgICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICBzdXBlcihwb3NpdGlvbilcclxuXHJcbiAgICAgICAgdGhpcy53ZWlnaHQgPSAxO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeU1vdmUocmVsYXRpdmVQb3M6IFZlY3RvcjIpIDpib29sZWFue1xyXG4gICAgICAgIGlmICghVXRpbGl0eS5pbkJvdW5kcyhuZXcgVmVjdG9yMih0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueCx0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueSkpKSBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICAgXHJcblxyXG4gICAgICAgIGxldCB0YXJnZXQgPSB3b3JsZC5wYXJ0aWNsZXNbdGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnldW3RoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54XTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldCAhPSB1bmRlZmluZWQpIHsgXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyeVN3YXAocmVsYXRpdmVQb3MpOztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHJlbGF0aXZlUG9zLng7IFxyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gcmVsYXRpdmVQb3MueTsgXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cnlTd2FwKHJlbGF0aXZlUG9zOiBWZWN0b3IyKSA6Ym9vbGVhbnsgICAgICAgIFxyXG4gICAgICAgIGxldCB0YXJnZXQgPSB3b3JsZC5wYXJ0aWNsZXNbdGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnldW3RoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54XTtcclxuXHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTW92ZWFibGUgJiYgdGFyZ2V0LndlaWdodCA8IHRoaXMud2VpZ2h0KVxyXG4gICAgICAgIHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vU3dhcCEgICAgICAgICAgICBcclxuICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueV1bdGhpcy5wb3NpdGlvbi54XSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3RhcmdldC5wb3NpdGlvbi55XVt0YXJnZXQucG9zaXRpb24ueF0gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3UG9zID0gbmV3IFZlY3RvcjIodGFyZ2V0LnBvc2l0aW9uLngsdGFyZ2V0LnBvc2l0aW9uLnkpO1xyXG5cclxuICAgICAgICAgICAgdGFyZ2V0LnBvc2l0aW9uLnggPSB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgIHRhcmdldC5wb3NpdGlvbi55ID0gdGhpcy5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1BvcztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdvcmxkLnBhcnRpY2xlc1t0aGlzLnBvc2l0aW9uLnldW3RoaXMucG9zaXRpb24ueF0gPSB0aGlzO1xyXG4gICAgICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbdGFyZ2V0LnBvc2l0aW9uLnldW3RhcmdldC5wb3NpdGlvbi54XSA9IHRhcmdldDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdmVsb2NpdHk6IFZlY3RvcjI7ICAgIFxyXG4gICAgd2VpZ2h0OiBudW1iZXI7XHJcblxyXG59XHJcblxyXG4vLzQgQmFzZSBwYXJ0aWNsZSB0eXBlcyBTb2xpZCBQb3dkZXIgRmx1aWQgR2FzXHJcblxyXG5leHBvcnQgY2xhc3MgU29saWQgZXh0ZW5kcyBQYXJ0aWNsZXtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xyXG4gICAgICAgIHN1cGVyKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0ge3I6MTIwLGc6MTIwLGI6MTIwfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3dkZXIgZXh0ZW5kcyBNb3ZlYWJsZXtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xyXG4gICAgICAgIHN1cGVyKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0ge3I6MjU1LGc6MjU1LGI6MH07O1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gMjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMCwxKSkpIHsgXHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGbHVpZCBleHRlbmRzIE1vdmVhYmxle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgc3VwZXIocG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSB7cjoxMCxnOjE3MCxiOjI1NX07XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpe1xyXG4gICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDAsMSkpKSB7IFxyXG4gICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlU2lkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9ICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVNpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVTaWRlKCl7XHJcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDApKSl7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwwKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDApKSl7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDApKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQge1dvcmxkLFdvcmxkU2l6ZX0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7TW92ZWFibGUsIFBhcnRpY2xlfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5cclxuaW50ZXJmYWNlIFBoeXNpY3N7XHJcblxyXG4gICAgc3RlcChzaW1fc3RhdGU6IFdvcmxkKTpXb3JsZDtcclxuXHJcbn1cclxuXHJcbmNsYXNzIEJhc2ljUGh5c2ljcyBpbXBsZW1lbnRzIFBoeXNpY3N7XHJcblxyXG4gICAgc3RlcChzaW1fc3RhdGU6IFdvcmxkKXtcclxuICAgICAgICBsZXQgbW92ZWQgOkFycmF5PFBhcnRpY2xlPiA9IFtdO1xyXG5cclxuICAgICAgICAvL3NpbV9zdGF0ZS5pdHRlcmF0b3JEaXJlY3Rpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKjMpO1xyXG5cclxuICAgICAgICAvL1RoaXMgbGluZSBmaXhlcyBldmVyeXRoaW5nXHJcbiAgICAgICAgc2ltX3N0YXRlLml0dGVyYXRvckRpcmVjdGlvbisrXHJcbiAgICAgICAgaWYgKHNpbV9zdGF0ZS5pdHRlcmF0b3JEaXJlY3Rpb24gPiAzKSB7XHJcbiAgICAgICAgICAgIHNpbV9zdGF0ZS5pdHRlcmF0b3JEaXJlY3Rpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHNpbV9zdGF0ZSl7XHJcbiAgICAgICAgICAgIGlmKCFwYXJ0IHx8ICEocGFydCBpbnN0YW5jZW9mIE1vdmVhYmxlKSB8fCBtb3ZlZC5pbmNsdWRlcyhwYXJ0KSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgIHBhcnQuc3RlcCgpOyAgICAgXHJcbiAgICAgICAgICAgIG1vdmVkLnB1c2gocGFydCk7XHJcblxyXG4gICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHBhcnQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNpbV9zdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFBoeXNpY3MgPSBuZXcgQmFzaWNQaHlzaWNzKCk7IiwiaW1wb3J0IHtXb3JsZCxXb3JsZFNpemUsd29ybGR9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuaW1wb3J0IHtjYW52YXMsY3R4fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3JlbmRlcmVyXCJcclxuaW1wb3J0IHsgVXRpbGl0eSB9IGZyb20gXCIuL3V0aWxcIjtcclxuXHJcbmludGVyZmFjZSBSZW5kZXJlcntcclxuXHJcbiAgICBkcmF3RnJhbWUoc2ltX3N0YXRlOiBXb3JsZCkgOiB2b2lkO1xyXG5cclxufVxyXG5cclxuXHJcbmNsYXNzIEJhc2ljUmVuZGVyZXIgaW1wbGVtZW50cyBSZW5kZXJlcntcclxuXHJcbiAgICBkcmF3RnJhbWUoc2ltX3N0YXRlOiBXb3JsZCl7XHJcblxyXG4gICAgICAgIGZvcihsZXQgcGFydCBvZiBzaW1fc3RhdGUpe1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwYXJ0KVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiBcclxuXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBVdGlsaXR5LnJnYlRvSGV4KHBhcnQuY29sb3IpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QocGFydC5wb3NpdGlvbi54LHBhcnQucG9zaXRpb24ueSwxLDEpOyAvL2RyYXcgcmVjdGFuZ2xlIDpQICAgICAgICAgICBcclxuXHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5jbGFzcyBQaXhlbFJlbmRlcmVyIGltcGxlbWVudHMgUmVuZGVyZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhc0RhdGEgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgLy9jdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0ZyYW1lKHNpbV9zdGF0ZTogV29ybGQpe1xyXG4gICAgICAgIHRoaXMuY2FudmFzRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBjYW52YXMud2lkdGg7IHgrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGNhbnZhcy5oZWlnaHQ7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcnQgPSB3b3JsZC5wYXJ0aWNsZXNbTWF0aC5mbG9vcih5LzIpXVtNYXRoLmZsb29yKHgvMildO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghcGFydClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAoeCArIHkgKiBjYW52YXMud2lkdGgpICogNDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhc0RhdGEuZGF0YVtpbmRleCArIDBdID0gcGFydC5jb2xvci5yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXNEYXRhLmRhdGFbaW5kZXggKyAxXSA9IHBhcnQuY29sb3IuZztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzRGF0YS5kYXRhW2luZGV4ICsgMl0gPSBwYXJ0LmNvbG9yLmI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhc0RhdGEuZGF0YVtpbmRleCArIDNdID0gMjU1O1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgIFxyXG4gICAgICAgIGN0eC5wdXRJbWFnZURhdGEodGhpcy5jYW52YXNEYXRhLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBjYW52YXNEYXRhOkltYWdlRGF0YSB8IHVuZGVmaW5lZDtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBSZW5kZXJlciA9IG5ldyBQaXhlbFJlbmRlcmVyKCk7IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyBXb3JsZFNpemUgfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXRpbGl0eXtcclxuXHJcbiAgICBzdGF0aWMgaW5Cb3VuZHMocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uLnkgPj0gV29ybGRTaXplLnkgfHwgcG9zaXRpb24ueCA+PSBXb3JsZFNpemUueCB8fFxyXG4gICAgICAgICAgICBwb3NpdGlvbi55IDwgMCB8fCBwb3NpdGlvbi54IDwgMCApIFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB2ZWN0b3JJbnRlcnBvbGF0ZShmcm9tOlZlY3RvcjIsIHRvOlZlY3RvcjIsIHByb2dyZXNzOm51bWJlcil7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZ2JUb0hleChjb2xvciA6e3I6bnVtYmVyLGc6bnVtYmVyLGI6bnVtYmVyfSk6c3RyaW5nIHtcclxuICAgICAgICBsZXQgciA9IGNvbG9yLnI7XHJcbiAgICAgICAgbGV0IGcgPSBjb2xvci5nO1xyXG4gICAgICAgIGxldCBiID0gY29sb3IuYjtcclxuXHJcbiAgICAgICAgbGV0IHJoZXggPSByLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICByaGV4ID0gKCByaGV4Lmxlbmd0aCA9PSAxID8gXCIwXCIgKyByaGV4IDogcmhleCk7XHJcblxyXG4gICAgICAgIGxldCBnaGV4ID0gZy50b1N0cmluZygxNik7XHJcbiAgICAgICAgZ2hleCA9ICggZ2hleC5sZW5ndGggPT0gMSA/IFwiMFwiICsgZ2hleCA6IGdoZXgpO1xyXG5cclxuICAgICAgICBsZXQgYmhleCA9IGIudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGJoZXggPSAoIGJoZXgubGVuZ3RoID09IDEgPyBcIjBcIiArIGJoZXggOiBiaGV4KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGAjJHtyaGV4fSR7Z2hleH0ke2JoZXh9YDtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7RHJhd2FibGV9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvb2JqZWN0MkRcIjtcclxuaW1wb3J0IHtjdHh9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvcmVuZGVyZXJcIjtcclxuaW1wb3J0IHtQYXJ0aWNsZX0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuaW1wb3J0IHtSZW5kZXJlcn0gZnJvbSBcIi4vcmVuZGVyXCI7XHJcbmltcG9ydCB7UGh5c2ljc30gZnJvbSBcIi4vcGh5c2ljc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdvcmxkU2l6ZSA9IG5ldyBWZWN0b3IyKDQwMCwzMDApO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxke1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLml0dGVyYXRvckRpcmVjdGlvbiA9IDI7XHJcblxyXG4gICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3IEFycmF5KFdvcmxkU2l6ZS55KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucGFydGljbGVzLmxlbmd0aDsgaW5kZXgrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlc1tpbmRleF0gPSBuZXcgQXJyYXkoV29ybGRTaXplLngpLmZpbGwodW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9JdHRlcmF0b3JcclxuICAgIHByaXZhdGUgZ2V0SXR0ZXJWYWwoaSA6IG51bWJlcik6UGFydGljbGUgfCB1bmRlZmluZWR7IFxyXG4gICAgICAgIGxldCB5ID0gTWF0aC5mbG9vcihpL1dvcmxkU2l6ZS54KTtcclxuICAgICAgICBsZXQgeCA9IGkgLSBNYXRoLmZsb29yKGkvV29ybGRTaXplLngpKldvcmxkU2l6ZS54O1xyXG5cclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuaXR0ZXJhdG9yRGlyZWN0aW9uKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnRpY2xlc1t5XVtXb3JsZFNpemUueCAtIHggLTFdOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFydGljbGVzW1dvcmxkU2l6ZS55IC0geSAtIDFdW3hdOyAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZXNbV29ybGRTaXplLnkgLSB5IC0xXVtXb3JsZFNpemUueCAtIHggLTFdOyAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFydGljbGVzW3ldW3hdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBbU3ltYm9sLml0ZXJhdG9yXSA9ICgpID0+IHsgICAgICBcclxuICAgICAgICBsZXQgaSA9IDA7XHJcblxyXG4gICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgbmV4dDooKT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmU6IChpID49IChXb3JsZFNpemUueCAqIFdvcmxkU2l6ZS55IC0gMSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmdldEl0dGVyVmFsKGkrKykgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwYXJ0aWNsZXM6QXJyYXk8QXJyYXk8UGFydGljbGUgfCB1bmRlZmluZWQ+PjtcclxuXHJcbiAgICBpdHRlcmF0b3JEaXJlY3Rpb24gOm51bWJlcjsgLy8wLTMgdGwgdHIgYmwgYnJcclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQgdmFyIHdvcmxkID0gbmV3IFdvcmxkKCk7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRNYW5hZ2VyIGV4dGVuZHMgRHJhd2FibGV7ICBcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVXBkYXRlKCl7ICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uUmVuZGVyKCl7XHJcbiAgICAgICAgc3VwZXIub25SZW5kZXIoKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIXRoaXMucGF1c2VkKVxyXG4gICAgICAgICAgICBQaHlzaWNzLnN0ZXAod29ybGQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBSZW5kZXJlci5kcmF3RnJhbWUod29ybGQpO1xyXG5cclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzc3Nyc7XHJcbiAgICAgICAgY3R4LnN0cm9rZVJlY3QoMCwwLDQwMCwzMDApO1xyXG4gICAgfSAgICBcclxuXHJcblxyXG4gICAgYWRkUGFydChwYXJ0OiBQYXJ0aWNsZSl7ICAgICAgICBcclxuICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdID0gcGFydDtcclxuICAgIH1cclxuXHJcbiAgICBwYXVzZWQ6Ym9vbGVhbjtcclxufVxyXG5cclxuXHJcblxyXG4vL1RPRE86IE11bHRpdGhyZWFkaW5nIGlmIGkgZmFuY3lcclxuLypcclxudXNlIHRoaXMgdG8gdGVzdCBpZiBzdXBwb3J0ZWRcclxuXHJcbmlmICh0eXBlb2YoV29ya2VyKSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAvL2dyZWF0LCB5b3VyIGJyb3dzZXIgc3VwcG9ydHMgd2ViIHdvcmtlcnNcclxufSBlbHNlIHtcclxuICAgLy9ub3Qgc3VwcG9ydGVkXHJcbn1cclxuXHJcbiovIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgKiBhcyBDRSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2NvcmVcIjtcclxuXHJcbmltcG9ydCB7U2NlbmV9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvc2NlbmVcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5cclxuaW1wb3J0IHt3b3JsZCwgV29ybGRNYW5hZ2VyfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5pbXBvcnQge0tleWJvYXJkSW5wdXQsIE1vdXNlSW5wdXR9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvaW5wdXRcIjtcclxuXHJcbmltcG9ydCB7IEZsdWlkLCBQb3dkZXIsIFNvbGlkIH0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuaW1wb3J0IHsgQ3Vyc29yIH0gZnJvbSBcIi4vY3Vyc29yXCI7XHJcbmltcG9ydCB7IFBoeXNpY3MgfSBmcm9tIFwiLi9waHlzaWNzXCI7XHJcblxyXG4vL2NyZWF0ZSBzY2VuZVxyXG5sZXQgbGV2ZWwgPSBuZXcgU2NlbmUoKTtcclxubGV0IHdvcmxkX21hbmFnZXIgPSBuZXcgV29ybGRNYW5hZ2VyKCk7XHJcbmxldCBjdXJzb3IgPSBuZXcgQ3Vyc29yKCk7XHJcblxyXG53aW5kb3cub25sb2FkID0gKCk9PntcclxuICAgIC8vaW5pdCBlbmdpbmVcclxuICAgIENFLmluaXQoKTtcclxuICAgIC8vYmluZCBzY2VuZVxyXG4gICAgQ0Uuc2V0QWN0aXZlU2NlbmUobGV2ZWwpO1xyXG4gICAgXHJcbiAgICBsZXZlbC5tZW1iZXJzLnB1c2god29ybGRfbWFuYWdlcik7XHJcbiAgICB3b3JsZF9tYW5hZ2VyLm9yaWdpbi5zY2FsZSA9IG5ldyBWZWN0b3IyKDIsMik7XHJcbiAgICAgICAgXHJcbiAgICBsZXZlbC5tZW1iZXJzLnB1c2goY3Vyc29yKTtcclxuXHJcblxyXG4gICAgLy93b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFBvd2RlcihuZXcgVmVjdG9yMig4MCwwKSkpOyAgXHJcblxyXG4gICAgLy9EZW1vIHdvcmxkXHJcbiAgICBmb3IgKGxldCB4ID0gNjA7IHggPCAxNDA7IHgrKykgeyAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxNTsgeSsrKSB7ICAgICBcclxuICAgICAgICAgICAgLy9taXggc29tZSBmbHVpZCBhbmQgcG93ZGVyXHJcbiAgICAgICAgICAgIGlmKHgqeSAlIDMgPT0gMCl7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBQb3dkZXIobmV3IFZlY3RvcjIoeCx5KSkpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBGbHVpZChuZXcgVmVjdG9yMih4LHkrMjApKSk7IFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwMDsgeCsrKSB7IFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoeCswLHgrNjApKSk7ICAgIFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoeCswLHgrNjEpKSk7ICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDA7IHgrKykgeyBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzIwMCx4KzYwKSkpOyAgICBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzIwMCx4KzYxKSkpOyAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgNTA7IHgrKykgeyBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzEwMCx4KzE5MCkpKTsgICAgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsxMDAseCsxOTEpKSk7ICAgICAgXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9ydW5zIGV2ZXJ5IHRpY2sgXHJcbmxldmVsLm9uVXBkYXRlID0gKCk9PntcclxuICAgIFxyXG5cclxuICAgIGlmIChLZXlib2FyZElucHV0LmlzSnVzdFByZXNzZWQoXCJTcGFjZVwiKSkge1xyXG4gICAgICAgIHdvcmxkX21hbmFnZXIucGF1c2VkID0gIXdvcmxkX21hbmFnZXIucGF1c2VkOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKEtleWJvYXJkSW5wdXQuaXNKdXN0UHJlc3NlZChcImZcIikpIHtcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLnBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgUGh5c2ljcy5zdGVwKHdvcmxkKTtcclxuICAgIH0gIFxyXG5cclxufTsgIl0sInNvdXJjZVJvb3QiOiIifQ==