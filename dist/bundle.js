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
exports.MouseInput = exports.KeyboardInput = void 0;
var base_types_1 = __webpack_require__(/*! ./base_types */ "./src/engine/base_types.ts");
var renderer_1 = __webpack_require__(/*! ./renderer */ "./src/engine/renderer.ts");
var KeyState;
(function (KeyState) {
    KeyState[KeyState["PRESSED"] = 0] = "PRESSED";
    KeyState[KeyState["HOLD"] = 1] = "HOLD";
    KeyState[KeyState["RELEASE"] = 2] = "RELEASE";
})(KeyState || (KeyState = {}));
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
        this.ctx = renderer_1.ctx;
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
        this.ctx = renderer_1.ctx;
        if (this.origin_in_center) {
            this.ctx.translate(-(this.origin.scale.x / 2), -(this.origin.scale.y / 2));
        }
        this.ctx.translate(this.origin.position.x, this.origin.position.y);
        if (this.origin_in_center) {
            this.ctx.translate(this.origin.scale.x / 2, this.origin.scale.y / 2);
        }
        this.ctx.rotate(this.origin.rotation * Math.PI / 180);
        if (this.origin_in_center) {
            this.ctx.translate(-(this.origin.scale.x / 2), -(this.origin.scale.y / 2));
        }
        this.ctx.scale(this.origin.scale.x, this.origin.scale.y);
    };
    /**
     * Do not call externaly
     * Called after the object is rendered
     */
    Drawable.prototype.afterRender = function () {
        var _this = this;
        this.children.forEach(function (child) {
            if (child instanceof Drawable && !child.use_local_coordinates)
                _this.ctx.scale(1 / _this.origin.scale.x, 1 / _this.origin.scale.y);
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
        this.ctx.moveTo(this.verticies[0].x, this.verticies[0].y);
        for (var i = 1; i < this.verticies.length; i++) {
            var vertex = this.verticies[i];
            this.ctx.lineTo(vertex.x, vertex.y);
        }
        this.ctx.closePath();
        this.ctx.save();
        this.ctx.resetTransform();
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.lineWidth = this.outline.thickness;
        this.ctx.strokeStyle = this.outline.color;
        this.ctx.stroke();
        this.ctx.restore();
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
var renderer_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/renderer */ "./src/engine/renderer.ts");
var Cursor = /** @class */ (function (_super) {
    __extends(Cursor, _super);
    function Cursor() {
        var _this = this;
        var defaultShape = [
            new base_types_1.Vector2(10, 0),
            new base_types_1.Vector2(10, 10),
            new base_types_1.Vector2(0, 10),
            new base_types_1.Vector2(0, 0)
        ];
        _this = _super.call(this, defaultShape, "#0000", new shape_1.Outline(1, 'white')) || this;
        _this.origin_in_center = true;
        _this.previousPosition = new base_types_1.Vector2(0, 0);
        return _this;
    }
    Cursor.prototype.changeRadius = function (radius) {
        radius = Math.round(radius);
    };
    Cursor.prototype.onRender = function () {
        if (input_1.MouseInput.currentPosition) {
            this.previousPosition = this.origin.position;
            this.origin.position = input_1.MouseInput.currentPosition;
        }
        renderer_1.ctx.clearRect(0, 0, 10, 10);
        _super.prototype.onRender.call(this);
    };
    return Cursor;
}(shape_1.Shape));
exports.Cursor = Cursor;


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
        if (this.position.y + relativePos.y >= world_manager_1.WorldSize.y || this.position.x + relativePos.x >= world_manager_1.WorldSize.x ||
            this.position.y + relativePos.y < 0 || this.position.x + relativePos.x < 0)
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
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
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
        //synchronize world position with matrix position
        //this.matrixSync(sim_state);
        return sim_state;
    };
    BasicPhysics.prototype.matrixSync = function (sim_state) {
        for (var y = 0; y < world_manager_1.WorldSize.y; y++) {
            for (var x = 0; x < world_manager_1.WorldSize.x; x++) {
                var part = sim_state.particles[y][x];
                if (!part)
                    continue;
                if ((part.position.y) < world_manager_1.WorldSize.y && (part.position.x) < world_manager_1.WorldSize.x) {
                    if (sim_state.particles[part.position.y][part.position.x]) {
                        part.position = new base_types_1.Vector2(x, y);
                    }
                    else {
                        sim_state.particles[y][x] = undefined;
                        sim_state.particles[part.position.y][part.position.x] = part;
                    }
                }
            }
        }
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
    //level.members.push(cursor);
    //world_manager.addPart(new Powder(new Vector2(80,0)));  
    //Demo world
    for (var x = 60; x < 140; x++) {
        for (var y = 0; y < 15; y++) {
            //mix some fluid and powder
            if (x * y % 3 == 0)
                world_manager.addPart(new particle_1.Powder(new base_types_1.Vector2(x, y)));
            else
                world_manager.addPart(new particle_1.Fluid(new base_types_1.Vector2(x, y)));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2hhcGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL2N1cnNvci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvcGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BoeXNpY3MudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3JlbmRlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvd29ybGRfbWFuYWdlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtFQUNFO0FBQ0YsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDO0FBTzNCLHdDQUFjO0FBTmxCLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQztBQVF6Qix3Q0FBYztBQVBsQjtFQUNFO0FBQ0YsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBSVgsa0JBQUc7Ozs7Ozs7Ozs7Ozs7O0FDVlA7OztFQUdFO0FBQ0Y7SUFDSSxpQkFBWSxDQUFTLEVBQUMsQ0FBUztRQUMzQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVELHdCQUFNLEdBQU47UUFDSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQ1osSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FDdEM7SUFDVCxDQUFDO0lBRUQsNEJBQVUsR0FBVjtRQUNJLElBQUksU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUU7UUFDL0IsU0FBUyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7UUFDdEIsU0FBUyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7UUFFdEIsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUlMLGNBQUM7QUFBRCxDQUFDO0FBdkJZLDBCQUFPO0FBeUJwQjs7R0FFRztBQUNIO0lBQ0ksbUJBQVksR0FBYSxFQUFFLEdBQVksRUFBRSxLQUFlO1FBQ3BELElBQUksQ0FBQyxRQUFRLEdBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUssQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxHQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssR0FBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFJTCxnQkFBQztBQUFELENBQUM7QUFUWSw4QkFBUzs7Ozs7Ozs7Ozs7Ozs7QUNoQ3RCLGtGQUF3QztBQUN4QyxtRkFBNEM7QUFFNUMsb0ZBQTREO0FBSzVEOztHQUVHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLEtBQVk7SUFDdkMsbUJBQVcsR0FBRyxLQUFLLENBQUM7QUFDeEIsQ0FBQztBQUZELHdDQUVDO0FBQ0Q7O0VBRUU7QUFDRixTQUFnQixJQUFJO0lBQ2hCLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqQixxQkFBYSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JCLGtCQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFbEIsV0FBVyxDQUFDLE1BQU0sRUFBQyxJQUFJLEdBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFORCxvQkFNQztBQUNEOzs7R0FHRztBQUNILFNBQVMsTUFBTTtJQUNYLElBQUcsbUJBQVcsYUFBWCxtQkFBVyx1QkFBWCxtQkFBVyxDQUFFLFFBQVE7UUFDcEIsbUJBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQixtQkFBVyxhQUFYLG1CQUFXLHVCQUFYLG1CQUFXLENBQUUsTUFBTSxFQUFFLENBQUM7SUFFdEIsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3ZCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDbENELHlGQUF1QztBQUN2QyxtRkFBb0M7QUFTcEMsSUFBSyxRQUlKO0FBSkQsV0FBSyxRQUFRO0lBQ1QsNkNBQU87SUFDUCx1Q0FBSTtJQUNKLDZDQUFPO0FBQ1gsQ0FBQyxFQUpJLFFBQVEsS0FBUixRQUFRLFFBSVo7QUFFRDtJQUFBO0lBMERBLENBQUM7SUF6REc7OztPQUdHO0lBQ0ksa0JBQUksR0FBWDtRQUNJLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWdCLENBQUM7UUFFbEQsZ0JBQWdCLENBQUMsU0FBUyxFQUFDLFVBQUMsQ0FBQztZQUN6QixJQUFHLGFBQWEsQ0FBQyxjQUFjO2dCQUMzQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FBQyxDQUFDO1FBRUgsZ0JBQWdCLENBQUMsT0FBTyxFQUFDLFVBQUMsQ0FBQztZQUN2QixJQUFHLGFBQWEsQ0FBQyxjQUFjO2dCQUMzQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdEOztPQUVHO0lBQ0ksdUJBQVMsR0FBaEIsVUFBaUIsR0FBUTtRQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVwQyxJQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekM7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDO0lBQzlELENBQUM7SUFFTSwyQkFBYSxHQUFwQixVQUFxQixHQUFRO1FBQ3pCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXBDLElBQUksS0FBSyxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6QztRQUVELE9BQU8sS0FBSyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDakMsU0FBUztJQUNiLENBQUM7SUFNYyx5QkFBVyxHQUExQixVQUEyQixHQUFXO1FBQ2xDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixJQUFJLE9BQU8sR0FBRyxHQUFXLENBQUM7UUFDMUIsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQVRNLDRCQUFjLEdBQUcsSUFBSSxDQUFDO0lBVWpDLG9CQUFDO0NBQUE7QUExRFksc0NBQWE7QUE0RDFCO0lBQUE7SUErRkEsQ0FBQztJQTlGVSxlQUFJLEdBQVg7UUFDSSxVQUFVLENBQUMsWUFBWSxHQUFHLElBQUksR0FBRyxFQUF3QixDQUFDO1FBQzFELFVBQVUsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUM7UUFFNUMsaUJBQU0sQ0FBQyxXQUFXLEdBQUcsV0FBQztZQUNsQixJQUFHLFVBQVUsQ0FBQyxjQUFjO2dCQUN4QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsVUFBVSxDQUFDLGVBQWUsR0FBRyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkQsQ0FBQyxDQUFDO1FBRUYsaUJBQU0sQ0FBQyxPQUFPLEdBQUcsV0FBQztZQUNkLElBQUcsVUFBVSxDQUFDLGNBQWM7Z0JBQ3hCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUV2QixVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDMUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQzFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUM5QyxDQUFDO1FBRUQsaUJBQU0sQ0FBQyxXQUFXLEdBQUcsV0FBQztZQUNsQixJQUFHLFVBQVUsQ0FBQyxjQUFjO2dCQUN4QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXRGLENBQUM7UUFFRCxpQkFBTSxDQUFDLFNBQVMsR0FBRyxXQUFDO1lBQ2hCLElBQUcsVUFBVSxDQUFDLGNBQWM7Z0JBQ3hCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUV2QixVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdEYsQ0FBQztRQUVELHNCQUFzQjtRQUN0QixJQUFHLFVBQVUsQ0FBQyxjQUFjLEVBQzVCO1lBQ0ksaUJBQU0sQ0FBQyxhQUFhLEdBQUcsV0FBQztnQkFDcEIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLENBQUM7U0FDSjtJQUNMLENBQUM7SUFFTSx5QkFBYyxHQUFyQjtRQUNJLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLEdBQUcsR0FBRyxFQUFDLENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUM7UUFFL0MsVUFBVSxDQUFDLGdCQUFnQixHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQztRQUM1QyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFHTSxvQkFBUyxHQUFoQixVQUFpQixNQUFtQjtRQUNoQyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRCxJQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQzNCLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckQ7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDO0lBQzlELENBQUM7SUFFTSx3QkFBYSxHQUFwQixVQUFxQixNQUFtQjtRQUNwQyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRCxJQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQzNCLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckQ7UUFFRCxPQUFPLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ2pDLFNBQVM7SUFDYixDQUFDO0lBRWMseUJBQWMsR0FBN0IsVUFBOEIsTUFBZTtRQUN6QyxRQUFRLE1BQU0sRUFBRTtZQUNaLEtBQUssQ0FBQztnQkFDRixPQUFPLEtBQUssQ0FBQztZQUNqQixLQUFLLENBQUM7Z0JBQ0YsT0FBTyxjQUFjLENBQUM7WUFDMUIsS0FBSyxDQUFDO2dCQUNGLE9BQU8sS0FBSyxDQUFDO1NBQ3BCO1FBRUQsT0FBTyxLQUFLLENBQUMsQ0FBQyx3QkFBd0I7SUFDMUMsQ0FBQztJQUVNLHlCQUFjLEdBQUcsSUFBSSxDQUFDO0lBS2pDLGlCQUFDO0NBQUE7QUEvRlksZ0NBQVU7Ozs7Ozs7Ozs7Ozs7O0FDNUV2Qix5RkFBK0M7QUFDL0MsbUZBQStCO0FBaUIvQjs7O0dBR0c7QUFDSDtJQUNJO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHNCQUFTLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLGNBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDbkMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztJQUNsQyxDQUFDO0lBQ0Q7O09BRUc7SUFDSCwyQkFBUSxHQUFSO0lBRUEsQ0FBQztJQUVEOzs7T0FHRztJQUNILDJCQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsR0FBRyxHQUFHLGNBQUcsQ0FBQztRQUVmLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3pFO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxFLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25FO1FBQ0UsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUV6RCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN6RTtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUc1RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsOEJBQVcsR0FBWDtRQUFBLGlCQU9DO1FBTkcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsZUFBSztZQUN2QixJQUFJLEtBQUssWUFBWSxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCO2dCQUN6RCxLQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVoRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBUUwsZUFBQztBQUFELENBQUM7QUEzRFksNEJBQVE7Ozs7Ozs7Ozs7Ozs7O0FDdEJyQixtRkFBNEM7QUFDNUMsdUVBQW1DO0FBS25DOzs7R0FHRztBQUNILFNBQWdCLElBQUk7SUFDaEIsY0FBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBdUIsQ0FBQztJQUM3RSxXQUFHLEdBQUcsY0FBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztBQUVuQyxDQUFDO0FBSkQsb0JBSUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFnQixNQUFNO0lBQ2xCLElBQUcsTUFBTSxDQUFDLGNBQWMsRUFBQztRQUNyQixvQkFBWSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDakMscUJBQWEsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0tBQ3RDO0lBRUQsV0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLGNBQU0sQ0FBQyxLQUFLLEVBQUMsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLGtCQUFXLGFBQVgsa0JBQVcsdUJBQVgsa0JBQVcsQ0FBRSxNQUFNLEVBQUUsQ0FBQztBQUMxQixDQUFDO0FBUkQsd0JBUUM7Ozs7Ozs7Ozs7Ozs7O0FDM0JELG1GQUFzQztBQUV0Qzs7O0dBR0c7QUFDSDtJQUNJO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELHNCQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFLO1lBQ3RCLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLFFBQVE7WUFDYixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELHNCQUFNLEdBQU47UUFFSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFLO1lBQ3RCLGNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNYLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDcEIsY0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUlMLFlBQUM7QUFBRCxDQUFDO0FBMUJZLHNCQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1BsQixtRkFBb0M7QUFHcEM7O0dBRUc7QUFDSDtJQUNJLGlCQUFZLEtBQWEsRUFBQyxLQUFhO1FBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFHTCxjQUFDO0FBQUQsQ0FBQztBQVBZLDBCQUFPO0FBU3BCOzs7R0FHRztBQUNIO0lBQTJCLHlCQUFRO0lBQy9CLGVBQVksU0FBb0IsRUFBRSxLQUFjLEVBQUMsT0FBaUI7UUFBbEUsWUFDSSxpQkFBTyxTQU1WO1FBSkcsS0FBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFFM0IsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3JDLEtBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsRUFBQyxPQUFPLENBQUMsQ0FBQzs7SUFDOUQsQ0FBQztJQUVEOzs7T0FHRztJQUNILHdCQUFRLEdBQVI7UUFDSSxpQkFBTSxRQUFRLFdBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWpDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVyQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWhCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUd2QixDQUFDO0lBS0wsWUFBQztBQUFELENBQUMsQ0E1QzBCLG1CQUFRLEdBNENsQztBQTVDWSxzQkFBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQmxCLG1IQUFpRTtBQUNqRSxvR0FBZ0U7QUFDaEUsb0dBQTZEO0FBQzdELDZHQUEyRDtBQUUzRDtJQUE0QiwwQkFBSztJQUM3QjtRQUFBLGlCQVlDO1FBWEcsSUFBSSxZQUFZLEdBQUc7WUFDZixJQUFJLG9CQUFPLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLG9CQUFPLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQztZQUNsQixJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQztZQUNqQixJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztTQUNuQjtRQUVELDBCQUFNLFlBQVksRUFBQyxPQUFPLEVBQUMsSUFBSSxlQUFPLENBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQUM7UUFFbkQsS0FBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixLQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQzs7SUFDN0MsQ0FBQztJQUVELDZCQUFZLEdBQVosVUFBYSxNQUFlO1FBQ3hCLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWhDLENBQUM7SUFFRCx5QkFBUSxHQUFSO1FBQ0ksSUFBRyxrQkFBVSxDQUFDLGVBQWUsRUFDN0I7WUFDSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsa0JBQVUsQ0FBQyxlQUFlLENBQUM7U0FDckQ7UUFDRCxjQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpCLGlCQUFNLFFBQVEsV0FBRSxDQUFDO0lBQ3JCLENBQUM7SUFJTCxhQUFDO0FBQUQsQ0FBQyxDQWpDMkIsYUFBSyxHQWlDaEM7QUFqQ1ksd0JBQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTG5CLG1IQUFpRTtBQUNqRSw2RkFBa0Q7QUFFbEQ7SUFDSSxrQkFBWSxRQUFnQjtRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRUQsdUJBQUksR0FBSjtJQUNBLENBQUM7SUFBQSxDQUFDO0lBSU4sZUFBQztBQUFELENBQUM7QUFYWSw0QkFBUTtBQWFyQjtJQUE4Qiw0QkFBUTtJQUNsQyxrQkFBWSxRQUFnQjtRQUE1QixZQUNJLGtCQUFNLFFBQVEsQ0FBQyxTQUlsQjtRQUZHLEtBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLEtBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQzs7SUFDckMsQ0FBQztJQUVELDBCQUFPLEdBQVAsVUFBUSxXQUFvQjtRQUN4QixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUkseUJBQVMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSx5QkFBUyxDQUFDLENBQUM7WUFDNUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ3RFLE9BQU8sS0FBSyxDQUFDO1FBRWpCLElBQUksTUFBTSxHQUFHLHFCQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0YsSUFBSSxNQUFNLElBQUksU0FBUyxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUFBLENBQUM7U0FDckM7YUFFRDtZQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNqQyxPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0wsQ0FBQztJQUVELDBCQUFPLEdBQVAsVUFBUSxXQUFvQjtRQUN4QixJQUFJLE1BQU0sR0FBRyxxQkFBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNGLElBQUcsTUFBTSxZQUFZLFFBQVEsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQzVEO1lBQ0ksbUJBQW1CO1lBQ25CLHFCQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDOUQscUJBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUVsRSxJQUFJLE1BQU0sR0FBRyxJQUFJLG9CQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU5RCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUVwQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztZQUV2QixxQkFBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3pELHFCQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7WUFFL0QsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFLTCxlQUFDO0FBQUQsQ0FBQyxDQXJENkIsUUFBUSxHQXFEckM7QUFyRFksNEJBQVE7QUF1RHJCLDhDQUE4QztBQUU5QztJQUEyQix5QkFBUTtJQUMvQixlQUFZLFFBQWdCO1FBQTVCLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBRWxCO1FBREcsS0FBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7O0lBQ3hCLENBQUM7SUFFRCxvQkFBSSxHQUFKO0lBQ0EsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQUFDLENBUjBCLFFBQVEsR0FRbEM7QUFSWSxzQkFBSztBQVVsQjtJQUE0QiwwQkFBUTtJQUNoQyxnQkFBWSxRQUFnQjtRQUE1QixZQUNJLGtCQUFNLFFBQVEsQ0FBQyxTQUdsQjtRQUZHLEtBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1FBQ3RCLEtBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztJQUNwQixDQUFDO0lBRUQscUJBQUksR0FBSjtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNqQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7Z0JBRXJCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztvQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7d0JBQ2pDLE9BQU8sS0FBSyxDQUFDO3FCQUNoQjtpQkFDSjthQUVKO2lCQUNHO2dCQUVBLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO29CQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7d0JBQ2hDLE9BQU8sS0FBSyxDQUFDO3FCQUNoQjtpQkFDSjthQUVKO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUwsYUFBQztBQUFELENBQUMsQ0FoQzJCLFFBQVEsR0FnQ25DO0FBaENZLHdCQUFNO0FBa0NuQjtJQUEyQix5QkFBUTtJQUMvQixlQUFZLFFBQWdCO1FBQTVCLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBRWxCO1FBREcsS0FBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7O0lBQ3hCLENBQUM7SUFFRCxvQkFBSSxHQUFKO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsRUFBRTtnQkFFckIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO29CQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQzt3QkFDakMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUNoQixPQUFPLElBQUksQ0FBQztxQkFDZjtpQkFDSjthQUVKO2lCQUNHO2dCQUVBLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO29CQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7d0JBQ2hDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFDaEIsT0FBTyxJQUFJLENBQUM7cUJBQ2Y7aUJBQ0o7YUFFSjtTQUNKO1FBR0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELHdCQUFRLEdBQVI7UUFDSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7WUFFckIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO2dCQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztvQkFDakMsT0FBTyxLQUFLLENBQUM7aUJBQ2hCO2FBQ0o7U0FFSjthQUNHO1lBRUEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7Z0JBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztvQkFDaEMsT0FBTyxLQUFLLENBQUM7aUJBQ2hCO2FBQ0o7U0FFSjtJQUNMLENBQUM7SUFFTCxZQUFDO0FBQUQsQ0FBQyxDQXZEMEIsUUFBUSxHQXVEbEM7QUF2RFksc0JBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNySGxCLDZGQUFnRDtBQUNoRCxtSEFBaUU7QUFTakU7SUFBQTtJQTZEQSxDQUFDO0lBM0RHLDJCQUFJLEdBQUosVUFBSyxTQUFnQjs7UUFDakIsSUFBSSxLQUFLLEdBQW9CLEVBQUUsQ0FBQztRQUdoQyw4REFBOEQ7UUFFOUQsNEJBQTRCO1FBQzVCLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRTtRQUM5QixJQUFJLFNBQVMsQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLEVBQUU7WUFDbEMsU0FBUyxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztTQUNwQzs7WUFFRCxLQUFnQixvQ0FBUyxnR0FBQztnQkFBdEIsSUFBSSxJQUFJO2dCQUNSLElBQUcsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQzVCLFNBQVM7Z0JBR2IsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO2dCQUVsRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1osS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBRWhFOzs7Ozs7Ozs7UUFFRCxpREFBaUQ7UUFDakQsNkJBQTZCO1FBRzdCLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFTyxpQ0FBVSxHQUFsQixVQUFtQixTQUFpQjtRQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcseUJBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHlCQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsQyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFHcEMsSUFBSSxDQUFDLElBQUk7b0JBQ0wsU0FBUztnQkFJYixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyx5QkFBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcseUJBQVMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3BFLElBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUM7d0JBRXJELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztxQkFDcEM7eUJBQ0c7d0JBQ0EsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7d0JBQ3RDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztxQkFDaEU7aUJBQ0o7YUFFSjtTQUNKO0lBQ0wsQ0FBQztJQUVMLG1CQUFDO0FBQUQsQ0FBQztBQUVZLGVBQU8sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEUxQyw2R0FBK0Q7QUFRL0Q7SUFBQTtJQW1CQSxDQUFDO0lBakJHLGtDQUFTLEdBQVQsVUFBVSxTQUFnQjs7UUFDdEIsY0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7UUFDekIsY0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQzs7WUFFNUIsS0FBZ0Isb0NBQVMsZ0dBQUM7Z0JBQXRCLElBQUksSUFBSTtnQkFFUixJQUFJLENBQUMsSUFBSTtvQkFDTCxTQUFTO2dCQUdiLGNBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDM0IsY0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7YUFFekU7Ozs7Ozs7OztJQUVMLENBQUM7SUFFTCxxQkFBQztBQUFELENBQUM7QUFFWSxnQkFBUSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUI3QyxtSEFBaUU7QUFDakUsNkdBQThEO0FBRTlELHdFQUFrQztBQUNsQywyRUFBa0M7QUFFckIsaUJBQVMsR0FBRyxJQUFJLG9CQUFPLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRTlDO0lBQ0k7UUFBQSxpQkFRQztRQTRCRCxLQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRztZQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFVixPQUFNO2dCQUNGLElBQUksRUFBQztvQkFDRCxPQUFNO3dCQUNGLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFTLENBQUMsQ0FBQyxHQUFHLGlCQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUM1QyxLQUFLLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztxQkFDL0I7Z0JBQ0wsQ0FBQzthQUNKO1FBQ0wsQ0FBQztRQTlDRyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBRTVCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4QyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDeEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNsRTtJQUNMLENBQUM7SUFFRCxXQUFXO0lBQ0gsMkJBQVcsR0FBbkIsVUFBb0IsQ0FBVTtRQUMxQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxpQkFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxpQkFBUyxDQUFDLENBQUMsQ0FBQyxHQUFDLGlCQUFTLENBQUMsQ0FBQyxDQUFDO1FBRWxELElBQUksR0FBRyxDQUFDO1FBRVIsUUFBUSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDN0IsS0FBSyxDQUFDO2dCQUNGLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsTUFBTTtZQUNWLEtBQUssQ0FBQztnQkFDRixHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLE1BQU07WUFFVixLQUFLLENBQUM7Z0JBQ0YsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQztnQkFDN0QsTUFBTTtZQUVWO2dCQUNJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixNQUFNO1NBQ2I7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFrQkwsWUFBQztBQUFELENBQUM7QUF0RFksc0JBQUs7QUF3RFAsYUFBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFFL0I7SUFBa0MsZ0NBQVE7SUFDdEM7UUFBQSxZQUNJLGlCQUFPLFNBRVY7UUFERyxLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzs7SUFDeEIsQ0FBQztJQUVELCtCQUFRLEdBQVI7SUFDQSxDQUFDO0lBRUQsK0JBQVEsR0FBUjtRQUNJLGlCQUFNLFFBQVEsV0FBRSxDQUFDO1FBR2pCLElBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUNYLGlCQUFPLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxDQUFDO1FBRXhCLGlCQUFRLENBQUMsU0FBUyxDQUFDLGFBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFHRCw4QkFBTyxHQUFQLFVBQVEsSUFBYztRQUNsQixhQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDN0QsQ0FBQztJQUdMLG1CQUFDO0FBQUQsQ0FBQyxDQXpCaUMsbUJBQVEsR0F5QnpDO0FBekJZLG9DQUFZO0FBNkJ6QixpQ0FBaUM7QUFDakM7Ozs7Ozs7OztFQVNFOzs7Ozs7O1VDekdGO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7Ozs7QUNyQkEsNkZBQXVEO0FBRXZELG9HQUF3RDtBQUN4RCxtSEFBaUU7QUFFakUsNkZBQW9EO0FBRXBELG9HQUE0RTtBQUU1RSw4RUFBa0Q7QUFDbEQsd0VBQWtDO0FBQ2xDLDJFQUFvQztBQUVwQyxjQUFjO0FBQ2QsSUFBSSxLQUFLLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztBQUN4QixJQUFJLGFBQWEsR0FBRyxJQUFJLDRCQUFZLEVBQUUsQ0FBQztBQUN2QyxJQUFJLE1BQU0sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0FBRTFCLE1BQU0sQ0FBQyxNQUFNLEdBQUc7SUFDWixhQUFhO0lBQ2IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1YsWUFBWTtJQUNaLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFekIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDbEMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztJQUc5Qyw2QkFBNkI7SUFJN0IseURBQXlEO0lBRXpELFlBQVk7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekIsMkJBQTJCO1lBQzNCLElBQUcsQ0FBQyxHQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDWCxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksaUJBQU0sQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Z0JBRXBELGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxnQkFBSyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFEO0tBQ0o7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFCLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxnQkFBSyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQUFLLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMzRDtJQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQUFLLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxnQkFBSyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM5RDtJQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDekIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQUFLLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxnQkFBSyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRDtBQUVMLENBQUMsQ0FBQztBQUVGLGtCQUFrQjtBQUNsQixLQUFLLENBQUMsUUFBUSxHQUFHO0lBR2IsSUFBSSxxQkFBYSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUN0QyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztLQUNoRDtJQUVELElBQUkscUJBQWEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbEMsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDNUIsaUJBQU8sQ0FBQyxJQUFJLENBQUMscUJBQUssQ0FBQyxDQUFDO0tBQ3ZCO0FBRUwsQ0FBQyxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlF1ZXJyeSBzZWxlY3RvciBmb3IgdGhlIGNhbnZhcyBlbGVtZW50XHJcbiovXHJcbmNvbnN0IGNhbnZhc1NlbGVjdG9yID0gXCIjZ2FtZVwiO1xyXG5jb25zdCByZXNpemVWaWV3cG9ydCA9IGZhbHNlO1xyXG4vKipUYXJnZXQgZnJhbWVzIHBlciBzZWNvbmRcclxuKi9cclxuY29uc3QgZnBzID0gNjA7XHJcblxyXG5leHBvcnQge1xyXG4gICAgY2FudmFzU2VsZWN0b3IsICAgIFxyXG4gICAgZnBzLFxyXG4gICAgcmVzaXplVmlld3BvcnRcclxufSIsIi8qKlxyXG4gKiAyRCBWZWN0b3JcclxuICogU3RvcmVzIFggYW5kIFlcclxuKi9cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjIgIHtcclxuICAgIGNvbnN0cnVjdG9yKFggOm51bWJlcixZIDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMueCA9IFg7XHJcbiAgICAgICAgdGhpcy55ID0gWTtcclxuICAgIH1cclxuXHJcbiAgICBsZW5naHQoKXtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICBNYXRoLnBvdyh0aGlzLngsMikgKyBNYXRoLnBvdyh0aGlzLnksMilcclxuICAgICAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIG5vcm1hbGl6ZWQoKXtcclxuICAgICAgICBsZXQgbmV3VmVjdG9yID0gbmV3IFZlY3RvcjIodGhpcy54LHRoaXMueSk7XHJcbiAgICAgICAgbGV0IGxlbmdodCA9IG5ld1ZlY3Rvci5sZW5naHQoKVxyXG4gICAgICAgIG5ld1ZlY3Rvci54IC89IGxlbmdodDtcclxuICAgICAgICBuZXdWZWN0b3IueSAvPSBsZW5naHQ7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdWZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgeDpudW1iZXI7XHJcbiAgICB5Om51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFN0b3JlcyBwb3NpdGlvbiByb3RhdGlvbiAoZGVncmVlcykgYW5kIHNjYWxlXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKHBvcz8gOlZlY3RvcjIsIHJvdD8gOm51bWJlciwgc2NhbGU/IDpWZWN0b3IyKXtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uICAgPSBwb3MgPyBwb3MgICAgIDogbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uICAgPSByb3QgPyByb3QgICAgIDogMDtcclxuICAgICAgICB0aGlzLnNjYWxlICAgICAgPSBzY2FsZSA/IHNjYWxlIDogbmV3IFZlY3RvcjIoMSwxKTtcclxuICAgIH1cclxuICAgIHBvc2l0aW9uOiBWZWN0b3IyO1xyXG4gICAgcm90YXRpb246IG51bWJlcjtcclxuICAgIHNjYWxlOiBWZWN0b3IyO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlbmRlcmluZyBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5pbXBvcnQgKiBhcyBDb25maWcgZnJvbSBcIi4vLi4vZW5naW5lQ29uZmlnXCI7XHJcbmltcG9ydCB7U2NlbmV9IGZyb20gXCIuL3NjZW5lXCI7XHJcbmltcG9ydCB7S2V5Ym9hcmRJbnB1dCwgTW91c2VJbnB1dH0gZnJvbSBcIi4vLi4vZW5naW5lL2lucHV0XCI7XHJcblxyXG5cclxuZXhwb3J0IHZhciBhY3RpdmVTY2VuZSA6IFNjZW5lIHwgdW5kZWZpbmVkXHJcblxyXG4vKipcclxuICogU2V0IHRoZSBzY2VuZSB5b3Ugd2FudCB0byBiZSBjdXJyZW50bHkgZGlzcGxheWVkIGFuZCB1cGRhdGVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0QWN0aXZlU2NlbmUoc2NlbmUgOlNjZW5lKXtcclxuICAgIGFjdGl2ZVNjZW5lID0gc2NlbmU7XHJcbn1cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgdGhlIGVuZ2luZVxyXG4qL1xyXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIFJlbmRlcmluZy5pbml0KCk7XHJcbiAgICBLZXlib2FyZElucHV0LmluaXQoKTtcclxuICAgIE1vdXNlSW5wdXQuaW5pdCgpO1xyXG5cclxuICAgIHNldEludGVydmFsKHVwZGF0ZSwxMDAwL0NvbmZpZy5mcHMpO1xyXG59XHJcbi8qKlxyXG4gKiBEb24ndCB1c2UgZXh0ZXJuYWx5LlxyXG4gKiBDYWxscyBvblVwZGF0ZSBhbmQgb25SZW5kZXIgbWV0aG9kc1xyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlKCl7XHJcbiAgICBpZihhY3RpdmVTY2VuZT8ub25VcGRhdGUpXHJcbiAgICAgICAgYWN0aXZlU2NlbmUub25VcGRhdGUoKTtcclxuICAgIGFjdGl2ZVNjZW5lPy51cGRhdGUoKTtcclxuXHJcbiAgICBSZW5kZXJpbmcucmVuZGVyKCk7XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyBjYW52YXMgfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5cclxuLyoqXHJcbiAqIE1vc3Qgb2Yga2V5cyBwcmVzZW50IG9uIHRoZSBrZXlib2FyZCBhcyBhIHN0cmluZyB1bmlvbi4gUGxlYXNlIHJlcG9ydCBhbnkgbWlzc2luZyBrZXlzLlxyXG4gKi9cclxudHlwZSBLZXkgPSBcIlRhYlwiIHwgXCJBbHRcIiB8IFwiQWx0R3JhcGhcIiB8IFwiQmFja3NwYWNlXCIgfCBcIkNvbnRyb2xcIiB8XCJTaGlmdFwiIHwgXCJTcGFjZVwiIHwgXCJDb250ZXh0TWVudVwiIHwgXCJFbnRlclwiIHwgXCJOdW1Mb2NrXCIgfCBcIkhvbWVcIiB8IFwiUGFnZVVwXCIgfCBcIlBhZ2VEb3duXCIgfCBcIkluc2VydFwiIHwgXCJEZWxldGVcIiB8IFwiQXJyb3dVcFwiIHwgXCJBcnJvd0Rvd25cIiB8IFwiQXJyb3dSaWdodFwiIHwgXCJBcnJvd0xlZnRcIiB8XCIhXCIgfCBcIlxcXCJcInwgXCIjXCIgfCBcIiRcIiB8IFwiJVwiIHwgXCImXCIgfCBcIidcIiB8IFwiKFwiIHwgXCIpXCIgfCBcIipcIiB8IFwiK1wiIHwgXCIsXCIgfCBcIi1cIiB8IFwiLlwiIHwgXCIvXCIgfCBcIjBcIiB8IFwiMVwiIHwgXCIyXCIgfCBcIjNcIiB8IFwiNFwiIHwgXCI1XCIgfCBcIjZcIiB8IFwiN1wiIHwgXCI4XCIgfCBcIjlcIiB8IFwiOlwiIHwgXCI7XCIgfCBcIjxcIiB8IFwiPVwiIHwgXCI+XCIgfCBcIj9cIiB8IFwiQFwiIHwgXCJBXCIgfCBcIkJcIiB8IFwiQ1wiIHwgXCJEXCIgfCBcIkVcIiB8IFwiRlwiIHwgXCJHXCIgfCBcIkhcIiB8IFwiSVwiIHwgXCJKXCIgfCBcIktcIiB8IFwiTFwiIHwgXCJNXCIgfCBcIk5cIiB8IFwiT1wiIHwgXCJQXCIgfCBcIlFcIiB8IFwiUlwiIHwgXCJTXCIgfCBcIlRcIiB8IFwiVVwiIHwgXCJWXCIgfCBcIldcIiB8IFwiWFwiIHwgXCJZXCIgfCBcIlpcIiB8IFwiW1wiIHwgXCJcXFxcXCIgfCBcIl1cIiB8IFwiXlwiIHwgXCJfXCIgfCBcImBcIiB8IFwiYVwiIHwgXCJiXCIgfCBcImNcIiB8IFwiZFwiIHwgXCJlXCIgfCBcImZcIiB8IFwiZ1wiIHwgXCJoXCIgfCBcImlcIiB8IFwialwiIHwgXCJrXCIgfCBcImxcIiB8IFwibVwiIHwgXCJuXCIgfCBcIm9cIiB8IFwicFwiIHwgXCJxXCIgfCBcInJcIiB8IFwic1wiIHwgXCJ0XCIgfCBcInVcIiB8IFwidlwiIHwgXCJ3XCIgfCBcInhcIiB8IFwieVwiIHwgXCJ6XCIgfCBcIntcIiB8IFwifFwiIHwgXCJ9XCIgfCBcIn5cIiA7XHJcblxyXG50eXBlIE1vdXNlQnV0dG9uID0gXCJMTUJcIiB8IFwiU2Nyb2xsQnV0dG9uXCIgfCBcIlJNQlwiOyBcclxuXHJcbmVudW0gS2V5U3RhdGV7XHJcbiAgICBQUkVTU0VELFxyXG4gICAgSE9MRCxcclxuICAgIFJFTEVBU0UsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBLZXlib2FyZElucHV0e1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJzIGZvciBrZXkgcHJlc3Nlcy5cclxuICAgICAqIEFsbHJlYWR5IGNhbGxlZCBieSB0aGUgaW5pdCBmdW5jdGlvbiBmcm9tIGNvcmUudHNcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcyA9IG5ldyBNYXA8S2V5LEtleVN0YXRlPigpO1xyXG5cclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLChlKT0+eyAgIFxyXG4gICAgICAgICAgICBpZihLZXlib2FyZElucHV0LnByZXZlbnREZWZhdWx0KSAgICBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzLnNldChLZXlib2FyZElucHV0LnN0cmluZ1RvS2V5KGUua2V5KSxLZXlTdGF0ZS5QUkVTU0VEKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsKGUpPT57ICAgIFxyXG4gICAgICAgICAgICBpZihLZXlib2FyZElucHV0LnByZXZlbnREZWZhdWx0KSAgICBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgXHJcblxyXG4gICAgICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcy5zZXQoS2V5Ym9hcmRJbnB1dC5zdHJpbmdUb0tleShlLmtleSksS2V5U3RhdGUuUkVMRUFTRSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGZvciBwcmVzc2VkIGtleVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaXNQcmVzc2VkKGtleTogS2V5KXtcclxuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmtleVN0YXRlcy5nZXQoa2V5KTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlTdGF0ZXMuc2V0KGtleSxLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAhKHN0YXRlID09PSB1bmRlZmluZWQgfHwgc3RhdGUgPT0gS2V5U3RhdGUuUkVMRUFTRSlcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNKdXN0UHJlc3NlZChrZXk6IEtleSl7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5rZXlTdGF0ZXMuZ2V0KGtleSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlTdGF0ZXMuc2V0KGtleSxLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEO1xyXG4gICAgICAgIC8vcmV0dXJuIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwcmV2ZW50RGVmYXVsdCA9IHRydWU7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMga2V5U3RhdGVzOiBNYXA8S2V5LEtleVN0YXRlPjtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzdHJpbmdUb0tleShrZXkgOnN0cmluZyl7ICAgICAgICBcclxuICAgICAgICBsZXQgdmFsID0ga2V5LnJlcGxhY2UoXCJEZWFkXCIsXCJ+XCIpO1xyXG4gICAgICAgIHZhbCA9IHZhbC5yZXBsYWNlKFwiIFwiLFwiU3BhY2VcIik7XHJcbiAgICAgICAgbGV0IGtleXR5cGUgPSB2YWwgIGFzIEtleTtcclxuICAgICAgICByZXR1cm4ga2V5dHlwZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1vdXNlSW5wdXR7XHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzID0gbmV3IE1hcDxNb3VzZUJ1dHRvbixLZXlTdGF0ZT4oKTtcclxuICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UgPSB7eDowLHk6MCx6OjB9O1xyXG5cclxuICAgICAgICBjYW52YXMub25tb3VzZW1vdmUgPSBlID0+IHsgICBcclxuICAgICAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKGUueCwgZS55KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY2FudmFzLm9ud2hlZWwgPSBlID0+IHsgICAgXHJcbiAgICAgICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlLnggKz0gZS5kZWx0YVg7XHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZS55ICs9IGUuZGVsdGFZO1xyXG4gICAgICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UueiArPSBlLmRlbHRhWjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KSAgICBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChNb3VzZUlucHV0Lm51bWJlclRvQnV0dG9uKGUuYnV0dG9uKSxLZXlTdGF0ZS5QUkVTU0VEKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FudmFzLm9ubW91c2V1cCA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KSAgICBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChNb3VzZUlucHV0Lm51bWJlclRvQnV0dG9uKGUuYnV0dG9uKSxLZXlTdGF0ZS5SRUxFQVNFKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9wcmV2ZW50IGNvbnRleHQgbWVudVxyXG4gICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYW52YXMub25jb250ZXh0bWVudSA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRXaGVlbE9mZnNldCgpe1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2U7XHJcbiAgICAgICAgbGV0IG91dCA9IHt4Om9mZnNldC54LCB5Om9mZnNldC55LCB6Om9mZnNldC56fTtcclxuXHJcbiAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlID0ge3g6MCx5OjAsejowfTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzdGF0aWMgaXNQcmVzc2VkKGJ1dHRvbjogTW91c2VCdXR0b24pe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLmdldChidXR0b24pO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRCkge1xyXG4gICAgICAgICAgICBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5zZXQoYnV0dG9uLEtleVN0YXRlLkhPTEQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICEoc3RhdGUgPT09IHVuZGVmaW5lZCB8fCBzdGF0ZSA9PSBLZXlTdGF0ZS5SRUxFQVNFKVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc0p1c3RQcmVzc2VkKGJ1dHRvbjogTW91c2VCdXR0b24pe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLmdldChidXR0b24pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChidXR0b24sS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRDtcclxuICAgICAgICAvL3JldHVybiBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBudW1iZXJUb0J1dHRvbihudW1iZXIgOiBudW1iZXIgKSA6IE1vdXNlQnV0dG9ue1xyXG4gICAgICAgIHN3aXRjaCAobnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIkxNQlwiO1xyXG4gICAgICAgICAgICBjYXNlIDE6ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiU2Nyb2xsQnV0dG9uXCI7XHJcbiAgICAgICAgICAgIGNhc2UgMjogICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJSTUJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBcIkxNQlwiOyAvL3RoYXRzIG5vdCBnb25uYSBoYXBwZW5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcHJldmVudERlZmF1bHQgPSB0cnVlO1xyXG4gICAgc3RhdGljIGN1cnJlbnRQb3NpdGlvbjogVmVjdG9yMjtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBidXR0b25TdGF0ZXM6IE1hcDxNb3VzZUJ1dHRvbixLZXlTdGF0ZT47XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtb3VzZVdoZWVsQ2hhbmdlIDoge3g6bnVtYmVyLCB5Om51bWJlciwgejpudW1iZXJ9O1xyXG59IiwiaW1wb3J0IHtWZWN0b3IyLFRyYW5zZm9ybX0gZnJvbSBcIi4vYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQge2N0eH0gZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBCYXNlIGZvciBjaGlsZHJlbiBwb2x5bW9ycGhpc21cclxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIHdoZW4gY3JlYXRpbmcgYSBjb21wb25lbnQgLyBjaGlsZC5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0MkQge1xyXG4gICAgLy9IYXBwZW5zIGV2ZXJ5IHRpY2tcclxuICAgIG9uVXBkYXRlKCkgOnZvaWQ7IFxyXG4gICAgLy9DYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgIG9uUmVuZGVyKCkgOnZvaWQ7IFxyXG4gICAgYWZ0ZXJSZW5kZXIoKSA6dm9pZDsgXHJcblxyXG4gICAgb3JpZ2luOiBUcmFuc2Zvcm07ICAgIFxyXG4gICAgY2hpbGRyZW46IEFycmF5PE9iamVjdDJEPjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEJhc2UgZm9yIGNoaWxkcmVuIHRoYXQgd2FudCB0byByZW5kZXIgc29tZXRoaW5nLlxyXG4gKiBFeHRlbmQgdGhpcyBjbGFzcyBmb3IgY3R4IGFjY2VzcyBhbmQgb3JpZ2luIHRyYW5zZm9ybSBoYW5kZWxpbmcuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRHJhd2FibGUgaW1wbGVtZW50cyBPYmplY3QyRCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMub3JpZ2luID0gbmV3IFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLmN0eCA9IGN0eDtcclxuICAgICAgICB0aGlzLnVzZV9sb2NhbF9jb29yZGluYXRlcyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub3JpZ2luX2luX2NlbnRlciA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqL1xyXG4gICAgb25VcGRhdGUoKXtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqIENhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgICovXHJcbiAgICBvblJlbmRlcigpeyAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuY3R4ID0gY3R4O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtKHRoaXMub3JpZ2luLnNjYWxlLngvMiksLSh0aGlzLm9yaWdpbi5zY2FsZS55LzIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMub3JpZ2luLnBvc2l0aW9uLngsdGhpcy5vcmlnaW4ucG9zaXRpb24ueSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMub3JpZ2luLnNjYWxlLngvMix0aGlzLm9yaWdpbi5zY2FsZS55LzIpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgICAgIHRoaXMuY3R4LnJvdGF0ZSh0aGlzLm9yaWdpbi5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtKHRoaXMub3JpZ2luLnNjYWxlLngvMiksLSh0aGlzLm9yaWdpbi5zY2FsZS55LzIpKTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIHRoaXMuY3R4LnNjYWxlKHRoaXMub3JpZ2luLnNjYWxlLngsdGhpcy5vcmlnaW4uc2NhbGUueSk7ICAgICAgXHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XHJcbiAgICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgICovXHJcbiAgICBhZnRlclJlbmRlcigpeyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRHJhd2FibGUgJiYgIWNoaWxkLnVzZV9sb2NhbF9jb29yZGluYXRlcylcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnNjYWxlKDEvdGhpcy5vcmlnaW4uc2NhbGUueCwxL3RoaXMub3JpZ2luLnNjYWxlLnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY2hpbGQub25SZW5kZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb3JpZ2luOiBUcmFuc2Zvcm07ICAgIFxyXG4gICAgY2hpbGRyZW46IEFycmF5PE9iamVjdDJEPjtcclxuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgdXNlX2xvY2FsX2Nvb3JkaW5hdGVzOiBib29sZWFuO1xyXG4gICAgb3JpZ2luX2luX2NlbnRlcjogYm9vbGVhbjtcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBDb25maWcgZnJvbSBcIi4vLi4vZW5naW5lQ29uZmlnXCI7XHJcbmltcG9ydCB7YWN0aXZlU2NlbmV9IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCB2YXIgY3R4IDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbmV4cG9ydCB2YXIgY2FudmFzIDpIVE1MQ2FudmFzRWxlbWVudDtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIHRoZSBjYW52YXMgY29udGV4dC5cclxuICogQWxscmVhZHkgY2FsbGVkIGJ5IHRoZSBpbml0IGZ1bmN0aW9uIGZyb20gY29yZS50c1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKXtcclxuICAgIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoQ29uZmlnLmNhbnZhc1NlbGVjdG9yKSEgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlcyB2aWV3cG9ydCBzaXplLFxyXG4gKiBjYWxscyBhbGwgdGhlIG9uUmVuZGVyIG1ldGhvZHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoKXsgIFxyXG4gICAgaWYoQ29uZmlnLnJlc2l6ZVZpZXdwb3J0KXtcclxuICAgICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5jbGVhclJlY3QoMCwwLGNhbnZhcy53aWR0aCxjYW52YXMuaGVpZ2h0KTtcclxuICAgIGFjdGl2ZVNjZW5lPy5yZW5kZXIoKTtcclxufSIsImltcG9ydCB7RHJhd2FibGUsIE9iamVjdDJEfSBmcm9tIFwiLi9vYmplY3QyRFwiXHJcbmltcG9ydCB7Y3R4LGNhbnZhc30gZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBSb290IGZvciBhbGwgdGhlIGVsZW1lbnRzIGluc2lkZSB5b3VyIGxldmVsLlxyXG4gKiBPYmplY3RzIG5vdCBhIG1lbWJlciBvZiB0aGUgYWN0aXZlIHNjZW5lIHdvbnQgYmUgY2FsbGVkIHZpYSBvblVwZGF0ZSBhbmQgb25SZW5kZXIuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2NlbmV7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKGNoaWxkPT57XHJcbiAgICAgICAgICAgIGNoaWxkLm9uVXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uVXBkYXRlKVxyXG4gICAgICAgICAgICB0aGlzLm9uVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tZW1iZXJzLmZvckVhY2goY2hpbGQ9PntcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY2hpbGQub25SZW5kZXIoKTtcclxuICAgICAgICAgICAgY2hpbGQuYWZ0ZXJSZW5kZXIoKTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gICBcclxuXHJcbiAgICBvblVwZGF0ZTogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XHJcbiAgICBtZW1iZXJzOiBBcnJheTxPYmplY3QyRD47XHJcbn0iLCJpbXBvcnQge0RyYXdhYmxlfSBmcm9tIFwiLi9vYmplY3QyRFwiO1xyXG5pbXBvcnQge1ZlY3RvcjIsVHJhbnNmb3JtfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XHJcblxyXG4vKipcclxuICogRGVmaW5lcyBhIHNoZXBlJ3Mgb3V0bGluZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE91dGxpbmUge1xyXG4gICAgY29uc3RydWN0b3Iod2lkdGg6IG51bWJlcixjb2xvcjogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy50aGlja25lc3MgPSB3aWR0aDtcclxuICAgIH1cclxuICAgIHRoaWNrbmVzczogbnVtYmVyO1xyXG4gICAgY29sb3I6IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIFNvbGlkIGNvbG9yIGRyYXdhYmxlIGVsZW1lbnRcclxuICogVXNlIGZvciBjdXN0b20gcG9seWdvbiBzaGFwZXMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2hhcGUgZXh0ZW5kcyBEcmF3YWJsZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih2ZXJ0aWNpZXM6IFZlY3RvcjJbXSwgY29sb3I/OiBzdHJpbmcsb3V0bGluZT86IE91dGxpbmUpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGljaWVzID0gdmVydGljaWVzO1xyXG5cclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPyBjb2xvciA6IFwid2hpdGVcIjtcclxuICAgICAgICB0aGlzLm91dGxpbmUgPSBvdXRsaW5lID8gb3V0bGluZSA6IG5ldyBPdXRsaW5lKDAsJyMwMDAwJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqIENhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgICovXHJcbiAgICBvblJlbmRlcigpe1xyXG4gICAgICAgIHN1cGVyLm9uUmVuZGVyKCk7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8odGhpcy52ZXJ0aWNpZXNbMF0ueCx0aGlzLnZlcnRpY2llc1swXS55KTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMudmVydGljaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMudmVydGljaWVzW2ldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHZlcnRleC54LHZlcnRleC55KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuICAgICAgICB0aGlzLmN0eC5yZXNldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHRoaXMub3V0bGluZS50aGlja25lc3M7XHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLm91dGxpbmUuY29sb3I7XHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7ICAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICB2ZXJ0aWNpZXM6IFZlY3RvcjJbXTtcclxuICAgIG91dGxpbmU6IE91dGxpbmU7XHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQge1NoYXBlLE91dGxpbmV9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvc2hhcGVcIjtcclxuaW1wb3J0IHtNb3VzZUlucHV0fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2lucHV0XCI7XHJcbmltcG9ydCB7IGN0eCB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvcmVuZGVyZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDdXJzb3IgZXh0ZW5kcyBTaGFwZXtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgbGV0IGRlZmF1bHRTaGFwZSA9IFtcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMTAsMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDEwLDEwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMCwxMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMClcclxuICAgICAgICBdICAgICAgICBcclxuXHJcbiAgICAgICAgc3VwZXIoZGVmYXVsdFNoYXBlLFwiIzAwMDBcIixuZXcgT3V0bGluZSgxLCd3aGl0ZScpKTtcclxuXHJcbiAgICAgICAgdGhpcy5vcmlnaW5faW5fY2VudGVyID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24gPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVJhZGl1cyhyYWRpdXMgOiBudW1iZXIpe1xyXG4gICAgICAgIHJhZGl1cyA9IE1hdGgucm91bmQocmFkaXVzKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgb25SZW5kZXIoKXsgICAgICAgICAgICAgICBcclxuICAgICAgICBpZihNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IHRoaXMub3JpZ2luLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbiA9IE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsMCwxMCwxMCk7XHJcblxyXG4gICAgICAgIHN1cGVyLm9uUmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcmV2aW91c1Bvc2l0aW9uOlZlY3RvcjI7XHJcblxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyB3b3JsZCxXb3JsZFNpemUgfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFydGljbGV7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IFwid2hpdGVcIjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RlcCgpe1xyXG4gICAgfTtcclxuICAgXHJcbiAgICBwb3NpdGlvbjogVmVjdG9yMjsgXHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW92ZWFibGUgZXh0ZW5kcyBQYXJ0aWNsZXsgICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICBzdXBlcihwb3NpdGlvbilcclxuXHJcbiAgICAgICAgdGhpcy53ZWlnaHQgPSAxO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeU1vdmUocmVsYXRpdmVQb3M6IFZlY3RvcjIpIDpib29sZWFue1xyXG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueSA+PSBXb3JsZFNpemUueSB8fCB0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueCA+PSBXb3JsZFNpemUueCB8fFxyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueSA8IDAgfHwgdGhpcy5wb3NpdGlvbi54K3JlbGF0aXZlUG9zLnggPCAwICkgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXQgIT0gdW5kZWZpbmVkKSB7IFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cnlTd2FwKHJlbGF0aXZlUG9zKTs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCArPSByZWxhdGl2ZVBvcy54OyBcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHJlbGF0aXZlUG9zLnk7IFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5U3dhcChyZWxhdGl2ZVBvczogVmVjdG9yMikgOmJvb2xlYW57ICAgICAgICBcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XHJcblxyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIE1vdmVhYmxlICYmIHRhcmdldC53ZWlnaHQgPCB0aGlzLndlaWdodClcclxuICAgICAgICB7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL1N3YXAhICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdvcmxkLnBhcnRpY2xlc1t0aGlzLnBvc2l0aW9uLnldW3RoaXMucG9zaXRpb24ueF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHdvcmxkLnBhcnRpY2xlc1t0YXJnZXQucG9zaXRpb24ueV1bdGFyZ2V0LnBvc2l0aW9uLnhdID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1BvcyA9IG5ldyBWZWN0b3IyKHRhcmdldC5wb3NpdGlvbi54LHRhcmdldC5wb3NpdGlvbi55KTtcclxuXHJcbiAgICAgICAgICAgIHRhcmdldC5wb3NpdGlvbi54ID0gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgICAgICAgICB0YXJnZXQucG9zaXRpb24ueSA9IHRoaXMucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3M7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbdGhpcy5wb3NpdGlvbi55XVt0aGlzLnBvc2l0aW9uLnhdID0gdGhpcztcclxuICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3RhcmdldC5wb3NpdGlvbi55XVt0YXJnZXQucG9zaXRpb24ueF0gPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHZlbG9jaXR5OiBWZWN0b3IyOyAgICBcclxuICAgIHdlaWdodDogbnVtYmVyO1xyXG5cclxufVxyXG5cclxuLy80IEJhc2UgcGFydGljbGUgdHlwZXMgU29saWQgUG93ZGVyIEZsdWlkIEdhc1xyXG5cclxuZXhwb3J0IGNsYXNzIFNvbGlkIGV4dGVuZHMgUGFydGljbGV7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICBzdXBlcihwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IFwiZ3JheVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHN0ZXAoKXtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvd2RlciBleHRlbmRzIE1vdmVhYmxle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgc3VwZXIocG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcInllbGxvd1wiO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gMjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMCwxKSkpIHsgXHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGbHVpZCBleHRlbmRzIE1vdmVhYmxle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgc3VwZXIocG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcImFxdWFcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMCwxKSkpIHsgXHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVTaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlU2lkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVNpZGUoKXtcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMCkpKXtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDApKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMCkpKXtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMCkpKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7V29ybGQsV29ybGRTaXplfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtQYXJ0aWNsZX0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuXHJcbmludGVyZmFjZSBQaHlzaWNze1xyXG5cclxuICAgIHN0ZXAoc2ltX3N0YXRlOiBXb3JsZCk6V29ybGQ7XHJcblxyXG59XHJcblxyXG5jbGFzcyBCYXNpY1BoeXNpY3MgaW1wbGVtZW50cyBQaHlzaWNze1xyXG5cclxuICAgIHN0ZXAoc2ltX3N0YXRlOiBXb3JsZCl7XHJcbiAgICAgICAgbGV0IG1vdmVkIDpBcnJheTxQYXJ0aWNsZT4gPSBbXTtcclxuXHJcblxyXG4gICAgICAgIC8vc2ltX3N0YXRlLml0dGVyYXRvckRpcmVjdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqMyk7XHJcblxyXG4gICAgICAgIC8vVGhpcyBsaW5lIGZpeGVzIGV2ZXJ5dGhpbmdcclxuICAgICAgICBzaW1fc3RhdGUuaXR0ZXJhdG9yRGlyZWN0aW9uKytcclxuICAgICAgICBpZiAoc2ltX3N0YXRlLml0dGVyYXRvckRpcmVjdGlvbiA+IDMpIHtcclxuICAgICAgICAgICAgc2ltX3N0YXRlLml0dGVyYXRvckRpcmVjdGlvbiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IobGV0IHBhcnQgb2Ygc2ltX3N0YXRlKXtcclxuICAgICAgICAgICAgaWYoIXBhcnQgfHwgbW92ZWQuaW5jbHVkZXMocGFydCkpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICBwYXJ0LnN0ZXAoKTsgICAgIFxyXG4gICAgICAgICAgICBtb3ZlZC5wdXNoKHBhcnQpO1xyXG5cclxuICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSBwYXJ0O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vc3luY2hyb25pemUgd29ybGQgcG9zaXRpb24gd2l0aCBtYXRyaXggcG9zaXRpb25cclxuICAgICAgICAvL3RoaXMubWF0cml4U3luYyhzaW1fc3RhdGUpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICByZXR1cm4gc2ltX3N0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWF0cml4U3luYyhzaW1fc3RhdGUgOiBXb3JsZCl7XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBXb3JsZFNpemUueTsgeSsrKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgV29ybGRTaXplLng7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcnQgPSBzaW1fc3RhdGUucGFydGljbGVzW3ldW3hdXHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXBhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKChwYXJ0LnBvc2l0aW9uLnkpIDwgV29ybGRTaXplLnkgJiYgKHBhcnQucG9zaXRpb24ueCkgPCBXb3JsZFNpemUueCkgeyAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZihzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0LnBvc2l0aW9uID0gbmV3IFZlY3RvcjIoeCx5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1t5XVt4XSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSBwYXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFBoeXNpY3MgPSBuZXcgQmFzaWNQaHlzaWNzKCk7IiwiaW1wb3J0IHtXb3JsZCxXb3JsZFNpemUsd29ybGR9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuaW1wb3J0IHtjYW52YXMsY3R4fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3JlbmRlcmVyXCJcclxuXHJcbmludGVyZmFjZSBSZW5kZXJlcntcclxuXHJcbiAgICBkcmF3RnJhbWUoc2ltX3N0YXRlOiBXb3JsZCkgOiB2b2lkO1xyXG5cclxufVxyXG5cclxuY2xhc3MgQ2FudmFzUmVuZGVyZXIgaW1wbGVtZW50cyBSZW5kZXJlcntcclxuXHJcbiAgICBkcmF3RnJhbWUoc2ltX3N0YXRlOiBXb3JsZCl7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyM3NzcnO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KDAsMCw0MDAsMzAwKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHNpbV9zdGF0ZSl7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBhcnQpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuIFxyXG5cclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHBhcnQuY29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdChwYXJ0LnBvc2l0aW9uLngscGFydC5wb3NpdGlvbi55LDEsMSk7IC8vZHJhdyByZWN0YW5nbGUgOlBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFJlbmRlcmVyID0gbmV3IENhbnZhc1JlbmRlcmVyKCk7IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQge0RyYXdhYmxlfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL29iamVjdDJEXCI7XHJcbmltcG9ydCB7UGFydGljbGV9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcbmltcG9ydCB7UmVuZGVyZXJ9IGZyb20gXCIuL3JlbmRlclwiO1xyXG5pbXBvcnQge1BoeXNpY3N9IGZyb20gXCIuL3BoeXNpY3NcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBXb3JsZFNpemUgPSBuZXcgVmVjdG9yMig0MDAsMzAwKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5pdHRlcmF0b3JEaXJlY3Rpb24gPSAyO1xyXG5cclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ldyBBcnJheShXb3JsZFNpemUueSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGluZGV4KyspIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXNbaW5kZXhdID0gbmV3IEFycmF5KFdvcmxkU2l6ZS54KS5maWxsKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vSXR0ZXJhdG9yXHJcbiAgICBwcml2YXRlIGdldEl0dGVyVmFsKGkgOiBudW1iZXIpeyBcclxuICAgICAgICBsZXQgeSA9IE1hdGguZmxvb3IoaS9Xb3JsZFNpemUueCk7XHJcbiAgICAgICAgbGV0IHggPSBpIC0gTWF0aC5mbG9vcihpL1dvcmxkU2l6ZS54KSpXb3JsZFNpemUueDtcclxuXHJcbiAgICAgICAgbGV0IG91dDtcclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuaXR0ZXJhdG9yRGlyZWN0aW9uKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIG91dCA9IHRoaXMucGFydGljbGVzW3ldW1dvcmxkU2l6ZS54IC0geCAtMV07ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBvdXQgPSB0aGlzLnBhcnRpY2xlc1tXb3JsZFNpemUueSAtIHkgLSAxXVt4XTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIG91dCA9IHRoaXMucGFydGljbGVzW1dvcmxkU2l6ZS55IC0geSAtMV1bV29ybGRTaXplLnggLSB4IC0xXTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBvdXQgPSB0aGlzLnBhcnRpY2xlc1t5XVt4XTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIFtTeW1ib2wuaXRlcmF0b3JdID0gKCkgPT4geyAgICAgIFxyXG4gICAgICAgIGxldCBpID0gMDtcclxuXHJcbiAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICBuZXh0OigpPT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm57XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZTogKGkgPj0gKFdvcmxkU2l6ZS54ICogV29ybGRTaXplLnkgLSAxKSksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuZ2V0SXR0ZXJWYWwoaSsrKSAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBhcnRpY2xlczpBcnJheTxBcnJheTxQYXJ0aWNsZSB8IHVuZGVmaW5lZD4+O1xyXG5cclxuICAgIGl0dGVyYXRvckRpcmVjdGlvbiA6bnVtYmVyOyAvLzAtMyB0bCB0ciBibCBiclxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgd29ybGQgPSBuZXcgV29ybGQoKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZE1hbmFnZXIgZXh0ZW5kcyBEcmF3YWJsZXsgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgb25VcGRhdGUoKXsgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25SZW5kZXIoKXtcclxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZighdGhpcy5wYXVzZWQpXHJcbiAgICAgICAgICAgIFBoeXNpY3Muc3RlcCh3b3JsZCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIFJlbmRlcmVyLmRyYXdGcmFtZSh3b3JsZCk7XHJcbiAgICB9ICAgIFxyXG5cclxuXHJcbiAgICBhZGRQYXJ0KHBhcnQ6IFBhcnRpY2xlKXsgICAgICAgIFxyXG4gICAgICAgIHdvcmxkLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSBwYXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlZDpib29sZWFuO1xyXG59XHJcblxyXG5cclxuXHJcbi8vVE9ETzogTXVsdGl0aHJlYWRpbmcgaWYgaSBmYW5jeVxyXG4vKlxyXG51c2UgdGhpcyB0byB0ZXN0IGlmIHN1cHBvcnRlZFxyXG5cclxuaWYgKHR5cGVvZihXb3JrZXIpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgIC8vZ3JlYXQsIHlvdXIgYnJvd3NlciBzdXBwb3J0cyB3ZWIgd29ya2Vyc1xyXG59IGVsc2Uge1xyXG4gICAvL25vdCBzdXBwb3J0ZWRcclxufVxyXG5cclxuKi8iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCAqIGFzIENFIGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvY29yZVwiO1xyXG5cclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zY2VuZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcblxyXG5pbXBvcnQge3dvcmxkLCBXb3JsZE1hbmFnZXJ9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuXHJcbmltcG9ydCB7S2V5Ym9hcmRJbnB1dCwgTW91c2VJbnB1dH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9pbnB1dFwiO1xyXG5cclxuaW1wb3J0IHsgRmx1aWQsIFBvd2RlciwgU29saWQgfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5pbXBvcnQgeyBDdXJzb3IgfSBmcm9tIFwiLi9jdXJzb3JcIjtcclxuaW1wb3J0IHsgUGh5c2ljcyB9IGZyb20gXCIuL3BoeXNpY3NcIjtcclxuXHJcbi8vY3JlYXRlIHNjZW5lXHJcbmxldCBsZXZlbCA9IG5ldyBTY2VuZSgpO1xyXG5sZXQgd29ybGRfbWFuYWdlciA9IG5ldyBXb3JsZE1hbmFnZXIoKTtcclxubGV0IGN1cnNvciA9IG5ldyBDdXJzb3IoKTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKT0+e1xyXG4gICAgLy9pbml0IGVuZ2luZVxyXG4gICAgQ0UuaW5pdCgpO1xyXG4gICAgLy9iaW5kIHNjZW5lXHJcbiAgICBDRS5zZXRBY3RpdmVTY2VuZShsZXZlbCk7XHJcbiAgICBcclxuICAgIGxldmVsLm1lbWJlcnMucHVzaCh3b3JsZF9tYW5hZ2VyKTtcclxuICAgIHdvcmxkX21hbmFnZXIub3JpZ2luLnNjYWxlID0gbmV3IFZlY3RvcjIoMiwyKTtcclxuICAgIFxyXG4gICAgXHJcbiAgICAvL2xldmVsLm1lbWJlcnMucHVzaChjdXJzb3IpO1xyXG5cclxuXHJcblxyXG4gICAgLy93b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFBvd2RlcihuZXcgVmVjdG9yMig4MCwwKSkpOyAgXHJcblxyXG4gICAgLy9EZW1vIHdvcmxkXHJcbiAgICBmb3IgKGxldCB4ID0gNjA7IHggPCAxNDA7IHgrKykgeyAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxNTsgeSsrKSB7ICAgICBcclxuICAgICAgICAgICAgLy9taXggc29tZSBmbHVpZCBhbmQgcG93ZGVyXHJcbiAgICAgICAgICAgIGlmKHgqeSAlIDMgPT0gMClcclxuICAgICAgICAgICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgUG93ZGVyKG5ldyBWZWN0b3IyKHgseSkpKTsgXHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IEZsdWlkKG5ldyBWZWN0b3IyKHgseSkpKTsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTAwOyB4KyspIHsgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4KzAseCs2MCkpKTsgICAgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4KzAseCs2MSkpKTsgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwMDsgeCsrKSB7IFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMjAwLHgrNjApKSk7ICAgIFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMjAwLHgrNjEpKSk7ICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCA1MDsgeCsrKSB7IFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMTAwLHgrMTkwKSkpOyAgICBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzEwMCx4KzE5MSkpKTsgICAgICBcclxuICAgIH1cclxuIFxyXG59O1xyXG5cclxuLy9ydW5zIGV2ZXJ5IHRpY2sgXHJcbmxldmVsLm9uVXBkYXRlID0gKCk9PntcclxuICAgIFxyXG5cclxuICAgIGlmIChLZXlib2FyZElucHV0LmlzSnVzdFByZXNzZWQoXCJTcGFjZVwiKSkge1xyXG4gICAgICAgIHdvcmxkX21hbmFnZXIucGF1c2VkID0gIXdvcmxkX21hbmFnZXIucGF1c2VkOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKEtleWJvYXJkSW5wdXQuaXNKdXN0UHJlc3NlZChcImZcIikpIHtcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLnBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgUGh5c2ljcy5zdGVwKHdvcmxkKTtcclxuICAgIH0gICBcclxuXHRcclxufTsgIl0sInNvdXJjZVJvb3QiOiIifQ==