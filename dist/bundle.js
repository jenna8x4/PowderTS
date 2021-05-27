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
var resizeViewport = true;
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
        this.velocity = new base_types_1.Vector2(0, 0);
        this.color = "white";
    }
    Particle.prototype.decide = function () {
    };
    Particle.prototype.step = function () {
        if (this.velocity != undefined) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    };
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
            this.velocity.x = relativePos.x;
            this.velocity.y = relativePos.y;
            return true;
        }
    };
    Moveable.prototype.trySwap = function (relativePos) {
        var target = world_manager_1.world.particles[this.position.y + relativePos.y][this.position.x + relativePos.x];
        if (target instanceof Moveable && target.weight < this.weight) {
            //Swap!            
            target.velocity.x = this.position.x - target.position.x;
            target.velocity.y = this.position.y - target.position.y;
            this.velocity.x = target.velocity.x;
            this.velocity.y = target.velocity.y;
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
    Powder.prototype.decide = function () {
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
    Fluid.prototype.decide = function () {
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Physics = void 0;
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var BasicPhysics = /** @class */ (function () {
    function BasicPhysics() {
    }
    BasicPhysics.prototype.step = function (sim_state) {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e;
        try {
            for (var sim_state_1 = __values(sim_state), sim_state_1_1 = sim_state_1.next(); !sim_state_1_1.done; sim_state_1_1 = sim_state_1.next()) {
                var part = sim_state_1_1.value;
                if (!part)
                    continue;
                part.decide();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (sim_state_1_1 && !sim_state_1_1.done && (_a = sim_state_1.return)) _a.call(sim_state_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var parts = new Array();
        try {
            for (var sim_state_2 = __values(sim_state), sim_state_2_1 = sim_state_2.next(); !sim_state_2_1.done; sim_state_2_1 = sim_state_2.next()) {
                var part = sim_state_2_1.value;
                if (!part)
                    continue;
                sim_state.particles[part.position.y][part.position.x] = undefined;
                part.step();
                parts.push(part);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (sim_state_2_1 && !sim_state_2_1.done && (_b = sim_state_2.return)) _b.call(sim_state_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var conflicts = new Map();
        try {
            for (var parts_1 = __values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
                var part = parts_1_1.value;
                var first = sim_state.particles[part.position.y][part.position.x];
                if (first == undefined) {
                    sim_state.particles[part.position.y][part.position.x] = part;
                }
                else {
                    var conflict = conflicts.get(first);
                    if (!conflict) {
                        conflict = new Set([first]);
                        conflicts.set(first, conflict);
                    }
                    conflict.add(part);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (parts_1_1 && !parts_1_1.done && (_c = parts_1.return)) _c.call(parts_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        console.log(conflicts.size + ' conflicts');
        try {
            for (var _f = __values(conflicts.entries()), _g = _f.next(); !_g.done; _g = _f.next()) {
                var _h = __read(_g.value, 2), first = _h[0], conflict = _h[1];
                conflicts.delete(first);
                sim_state.particles[first.position.y][first.position.x] = undefined;
                try {
                    for (var conflict_1 = (e_5 = void 0, __values(conflict)), conflict_1_1 = conflict_1.next(); !conflict_1_1.done; conflict_1_1 = conflict_1.next()) {
                        var part = conflict_1_1.value;
                        part.position.x -= part.velocity.x;
                        part.position.y -= part.velocity.y;
                        part.velocity.x = 0;
                        part.velocity.y = 0;
                        var first_1 = sim_state.particles[part.position.y][part.position.x];
                        if (first_1 == undefined) {
                            sim_state.particles[part.position.y][part.position.x] = part;
                        }
                        else {
                            var conflict_2 = conflicts.get(first_1);
                            if (!conflict_2) {
                                conflict_2 = new Set([first_1]);
                                conflicts.set(first_1, conflict_2);
                            }
                            conflict_2.add(part);
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (conflict_1_1 && !conflict_1_1.done && (_e = conflict_1.return)) _e.call(conflict_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                console.log(conflicts.size + ' conflicts');
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
            }
            finally { if (e_4) throw e_4.error; }
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
                    var done = (i >= (exports.WorldSize.x * exports.WorldSize.y));
                    if (done) {
                        return { done: true };
                    }
                    else {
                        var y = Math.floor(i / exports.WorldSize.x);
                        var x = i - Math.floor(i / exports.WorldSize.x) * exports.WorldSize.x;
                        i += 1;
                        return {
                            done: false,
                            value: _this.particles[y][x]
                        };
                    }
                }
            };
        };
        this.particles = new Array(exports.WorldSize.y);
        for (var index = 0; index < this.particles.length; index++) {
            this.particles[index] = new Array(exports.WorldSize.x).fill(undefined);
        }
    }
    return World;
}());
exports.World = World;
exports.world = new World();
var WorldManager = /** @class */ (function (_super) {
    __extends(WorldManager, _super);
    function WorldManager() {
        var _this = _super.call(this) || this;
        _this.paused = false;
        _this.frame = 0;
        return _this;
    }
    WorldManager.prototype.onUpdate = function () {
    };
    WorldManager.prototype.onRender = function () {
        _super.prototype.onRender.call(this);
        if (!this.paused)
            physics_1.Physics.step(exports.world);
        render_1.Renderer.drawFrame(exports.world);
        document.title = '' + (++this.frame);
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
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
        for (var y = 0; y < 8; y++) {
            //mix some fluid and powder
            world_manager.addPart(new particle_1.Powder(new base_types_1.Vector2(x, y)));
        }
    }
    for (var x = 60; x < 140; x++) {
        for (var y = 15; y < 22; y++) {
            //mix some fluid and powder
            world_manager.addPart(new particle_1.Fluid(new base_types_1.Vector2(x, y)));
        }
    }
    for (var x = 0; x < 100; x++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(x + 0, x + 60)));
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(x + 0, x + 61)));
    }
    for (var x = 0; x < 100; x++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 220, x + 60)));
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 220, x + 61)));
    }
    for (var x = 0; x < 50; x++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 98, x + 190)));
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 98, x + 191)));
    }
    for (var x = 0; x < 10; x++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(x + 98, 190)));
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(x + 98, 191)));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2hhcGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL2N1cnNvci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvcGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BoeXNpY3MudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3JlbmRlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvd29ybGRfbWFuYWdlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtFQUNFO0FBQ0YsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDO0FBTzNCLHdDQUFjO0FBTmxCLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQztBQVF4Qix3Q0FBYztBQVBsQjtFQUNFO0FBQ0YsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBSVgsa0JBQUc7Ozs7Ozs7Ozs7Ozs7O0FDVlA7OztFQUdFO0FBQ0Y7SUFDSSxpQkFBWSxDQUFTLEVBQUMsQ0FBUztRQUMzQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVELHdCQUFNLEdBQU47UUFDSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQ1osSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FDdEM7SUFDVCxDQUFDO0lBRUQsNEJBQVUsR0FBVjtRQUNJLElBQUksU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUU7UUFDL0IsU0FBUyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7UUFDdEIsU0FBUyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7UUFFdEIsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUlMLGNBQUM7QUFBRCxDQUFDO0FBdkJZLDBCQUFPO0FBeUJwQjs7R0FFRztBQUNIO0lBQ0ksbUJBQVksR0FBYSxFQUFFLEdBQVksRUFBRSxLQUFlO1FBQ3BELElBQUksQ0FBQyxRQUFRLEdBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUssQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxHQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssR0FBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFJTCxnQkFBQztBQUFELENBQUM7QUFUWSw4QkFBUzs7Ozs7Ozs7Ozs7Ozs7QUNoQ3RCLGtGQUF3QztBQUN4QyxtRkFBNEM7QUFFNUMsb0ZBQTREO0FBSzVEOztHQUVHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLEtBQVk7SUFDdkMsbUJBQVcsR0FBRyxLQUFLLENBQUM7QUFDeEIsQ0FBQztBQUZELHdDQUVDO0FBQ0Q7O0VBRUU7QUFDRixTQUFnQixJQUFJO0lBQ2hCLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqQixxQkFBYSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JCLGtCQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFbEIsV0FBVyxDQUFDLE1BQU0sRUFBQyxJQUFJLEdBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFORCxvQkFNQztBQUNEOzs7R0FHRztBQUNILFNBQVMsTUFBTTtJQUNYLElBQUcsbUJBQVcsYUFBWCxtQkFBVyx1QkFBWCxtQkFBVyxDQUFFLFFBQVE7UUFDcEIsbUJBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQixtQkFBVyxhQUFYLG1CQUFXLHVCQUFYLG1CQUFXLENBQUUsTUFBTSxFQUFFLENBQUM7SUFFdEIsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3ZCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDbENELHlGQUF1QztBQUN2QyxtRkFBb0M7QUFTcEMsSUFBSyxRQUlKO0FBSkQsV0FBSyxRQUFRO0lBQ1QsNkNBQU87SUFDUCx1Q0FBSTtJQUNKLDZDQUFPO0FBQ1gsQ0FBQyxFQUpJLFFBQVEsS0FBUixRQUFRLFFBSVo7QUFFRDtJQUFBO0lBMERBLENBQUM7SUF6REc7OztPQUdHO0lBQ0ksa0JBQUksR0FBWDtRQUNJLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWdCLENBQUM7UUFFbEQsZ0JBQWdCLENBQUMsU0FBUyxFQUFDLFVBQUMsQ0FBQztZQUN6QixJQUFHLGFBQWEsQ0FBQyxjQUFjO2dCQUMzQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FBQyxDQUFDO1FBRUgsZ0JBQWdCLENBQUMsT0FBTyxFQUFDLFVBQUMsQ0FBQztZQUN2QixJQUFHLGFBQWEsQ0FBQyxjQUFjO2dCQUMzQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdEOztPQUVHO0lBQ0ksdUJBQVMsR0FBaEIsVUFBaUIsR0FBUTtRQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVwQyxJQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekM7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDO0lBQzlELENBQUM7SUFFTSwyQkFBYSxHQUFwQixVQUFxQixHQUFRO1FBQ3pCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXBDLElBQUksS0FBSyxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6QztRQUVELE9BQU8sS0FBSyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDakMsU0FBUztJQUNiLENBQUM7SUFNYyx5QkFBVyxHQUExQixVQUEyQixHQUFXO1FBQ2xDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixJQUFJLE9BQU8sR0FBRyxHQUFXLENBQUM7UUFDMUIsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQVRNLDRCQUFjLEdBQUcsSUFBSSxDQUFDO0lBVWpDLG9CQUFDO0NBQUE7QUExRFksc0NBQWE7QUE0RDFCO0lBQUE7SUErRkEsQ0FBQztJQTlGVSxlQUFJLEdBQVg7UUFDSSxVQUFVLENBQUMsWUFBWSxHQUFHLElBQUksR0FBRyxFQUF3QixDQUFDO1FBQzFELFVBQVUsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUM7UUFFNUMsaUJBQU0sQ0FBQyxXQUFXLEdBQUcsV0FBQztZQUNsQixJQUFHLFVBQVUsQ0FBQyxjQUFjO2dCQUN4QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsVUFBVSxDQUFDLGVBQWUsR0FBRyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkQsQ0FBQyxDQUFDO1FBRUYsaUJBQU0sQ0FBQyxPQUFPLEdBQUcsV0FBQztZQUNkLElBQUcsVUFBVSxDQUFDLGNBQWM7Z0JBQ3hCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUV2QixVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDMUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQzFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUM5QyxDQUFDO1FBRUQsaUJBQU0sQ0FBQyxXQUFXLEdBQUcsV0FBQztZQUNsQixJQUFHLFVBQVUsQ0FBQyxjQUFjO2dCQUN4QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXRGLENBQUM7UUFFRCxpQkFBTSxDQUFDLFNBQVMsR0FBRyxXQUFDO1lBQ2hCLElBQUcsVUFBVSxDQUFDLGNBQWM7Z0JBQ3hCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUV2QixVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdEYsQ0FBQztRQUVELHNCQUFzQjtRQUN0QixJQUFHLFVBQVUsQ0FBQyxjQUFjLEVBQzVCO1lBQ0ksaUJBQU0sQ0FBQyxhQUFhLEdBQUcsV0FBQztnQkFDcEIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLENBQUM7U0FDSjtJQUNMLENBQUM7SUFFTSx5QkFBYyxHQUFyQjtRQUNJLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLEdBQUcsR0FBRyxFQUFDLENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUM7UUFFL0MsVUFBVSxDQUFDLGdCQUFnQixHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQztRQUM1QyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFHTSxvQkFBUyxHQUFoQixVQUFpQixNQUFtQjtRQUNoQyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRCxJQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQzNCLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckQ7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDO0lBQzlELENBQUM7SUFFTSx3QkFBYSxHQUFwQixVQUFxQixNQUFtQjtRQUNwQyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRCxJQUFJLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQzNCLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckQ7UUFFRCxPQUFPLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ2pDLFNBQVM7SUFDYixDQUFDO0lBRWMseUJBQWMsR0FBN0IsVUFBOEIsTUFBZTtRQUN6QyxRQUFRLE1BQU0sRUFBRTtZQUNaLEtBQUssQ0FBQztnQkFDRixPQUFPLEtBQUssQ0FBQztZQUNqQixLQUFLLENBQUM7Z0JBQ0YsT0FBTyxjQUFjLENBQUM7WUFDMUIsS0FBSyxDQUFDO2dCQUNGLE9BQU8sS0FBSyxDQUFDO1NBQ3BCO1FBRUQsT0FBTyxLQUFLLENBQUMsQ0FBQyx3QkFBd0I7SUFDMUMsQ0FBQztJQUVNLHlCQUFjLEdBQUcsSUFBSSxDQUFDO0lBS2pDLGlCQUFDO0NBQUE7QUEvRlksZ0NBQVU7Ozs7Ozs7Ozs7Ozs7O0FDNUV2Qix5RkFBK0M7QUFDL0MsbUZBQStCO0FBaUIvQjs7O0dBR0c7QUFDSDtJQUNJO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHNCQUFTLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLGNBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDbkMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztJQUNsQyxDQUFDO0lBQ0Q7O09BRUc7SUFDSCwyQkFBUSxHQUFSO0lBRUEsQ0FBQztJQUVEOzs7T0FHRztJQUNILDJCQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsR0FBRyxHQUFHLGNBQUcsQ0FBQztRQUVmLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3pFO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxFLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25FO1FBQ0UsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUV6RCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN6RTtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUc1RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsOEJBQVcsR0FBWDtRQUFBLGlCQU9DO1FBTkcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsZUFBSztZQUN2QixJQUFJLEtBQUssWUFBWSxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCO2dCQUN6RCxLQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVoRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBUUwsZUFBQztBQUFELENBQUM7QUEzRFksNEJBQVE7Ozs7Ozs7Ozs7Ozs7O0FDdEJyQixtRkFBNEM7QUFDNUMsdUVBQW1DO0FBS25DOzs7R0FHRztBQUNILFNBQWdCLElBQUk7SUFDaEIsY0FBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBdUIsQ0FBQztJQUM3RSxXQUFHLEdBQUcsY0FBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztBQUVuQyxDQUFDO0FBSkQsb0JBSUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFnQixNQUFNO0lBQ2xCLElBQUcsTUFBTSxDQUFDLGNBQWMsRUFBQztRQUNyQixvQkFBWSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDakMscUJBQWEsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0tBQ3RDO0lBRUQsV0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLGNBQU0sQ0FBQyxLQUFLLEVBQUMsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLGtCQUFXLGFBQVgsa0JBQVcsdUJBQVgsa0JBQVcsQ0FBRSxNQUFNLEVBQUUsQ0FBQztBQUMxQixDQUFDO0FBUkQsd0JBUUM7Ozs7Ozs7Ozs7Ozs7O0FDM0JELG1GQUFzQztBQUV0Qzs7O0dBR0c7QUFDSDtJQUNJO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELHNCQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFLO1lBQ3RCLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLFFBQVE7WUFDYixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELHNCQUFNLEdBQU47UUFFSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFLO1lBQ3RCLGNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNYLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDcEIsY0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUlMLFlBQUM7QUFBRCxDQUFDO0FBMUJZLHNCQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1BsQixtRkFBb0M7QUFHcEM7O0dBRUc7QUFDSDtJQUNJLGlCQUFZLEtBQWEsRUFBQyxLQUFhO1FBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFHTCxjQUFDO0FBQUQsQ0FBQztBQVBZLDBCQUFPO0FBU3BCOzs7R0FHRztBQUNIO0lBQTJCLHlCQUFRO0lBQy9CLGVBQVksU0FBb0IsRUFBRSxLQUFjLEVBQUMsT0FBaUI7UUFBbEUsWUFDSSxpQkFBTyxTQU1WO1FBSkcsS0FBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFFM0IsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3JDLEtBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsRUFBQyxPQUFPLENBQUMsQ0FBQzs7SUFDOUQsQ0FBQztJQUVEOzs7T0FHRztJQUNILHdCQUFRLEdBQVI7UUFDSSxpQkFBTSxRQUFRLFdBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWpDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVyQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWhCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUd2QixDQUFDO0lBS0wsWUFBQztBQUFELENBQUMsQ0E1QzBCLG1CQUFRLEdBNENsQztBQTVDWSxzQkFBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQmxCLG1IQUFpRTtBQUNqRSxvR0FBZ0U7QUFDaEUsb0dBQTZEO0FBQzdELDZHQUEyRDtBQUUzRDtJQUE0QiwwQkFBSztJQUM3QjtRQUFBLGlCQVlDO1FBWEcsSUFBSSxZQUFZLEdBQUc7WUFDZixJQUFJLG9CQUFPLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLG9CQUFPLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQztZQUNsQixJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQztZQUNqQixJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztTQUNuQjtRQUVELDBCQUFNLFlBQVksRUFBQyxPQUFPLEVBQUMsSUFBSSxlQUFPLENBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQUM7UUFFbkQsS0FBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixLQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQzs7SUFDN0MsQ0FBQztJQUVELDZCQUFZLEdBQVosVUFBYSxNQUFlO1FBQ3hCLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWhDLENBQUM7SUFFRCx5QkFBUSxHQUFSO1FBQ0ksSUFBRyxrQkFBVSxDQUFDLGVBQWUsRUFDN0I7WUFDSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsa0JBQVUsQ0FBQyxlQUFlLENBQUM7U0FDckQ7UUFDRCxjQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpCLGlCQUFNLFFBQVEsV0FBRSxDQUFDO0lBQ3JCLENBQUM7SUFJTCxhQUFDO0FBQUQsQ0FBQyxDQWpDMkIsYUFBSyxHQWlDaEM7QUFqQ1ksd0JBQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTG5CLG1IQUFpRTtBQUNqRSw2RkFBa0Q7QUFFbEQ7SUFDSSxrQkFBWSxRQUFnQjtRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksb0JBQU8sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVELHlCQUFNLEdBQU47SUFDQSxDQUFDO0lBRUQsdUJBQUksR0FBSjtRQUNJLElBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxTQUFTLEVBQUM7WUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDdEM7SUFDTCxDQUFDO0lBS0wsZUFBQztBQUFELENBQUM7QUFwQlksNEJBQVE7QUFzQnJCO0lBQThCLDRCQUFRO0lBQ2xDLGtCQUFZLFFBQWdCO1FBQTVCLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBSWxCO1FBRkcsS0FBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDaEIsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDOztJQUNyQyxDQUFDO0lBRUQsMEJBQU8sR0FBUCxVQUFRLFdBQW9CO1FBQ3hCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSx5QkFBUyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLHlCQUFTLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDdEUsT0FBTyxLQUFLLENBQUM7UUFFakIsSUFBSSxNQUFNLEdBQUcscUJBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzRixJQUFJLE1BQU0sSUFBSSxTQUFTLEVBQUU7WUFDckIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQUEsQ0FBQztTQUNyQzthQUVEO1lBQ0ksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsMEJBQU8sR0FBUCxVQUFRLFdBQW9CO1FBQ3hCLElBQUksTUFBTSxHQUFHLHFCQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0YsSUFBRyxNQUFNLFlBQVksUUFBUSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFDNUQ7WUFDSSxtQkFBbUI7WUFDbkIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDeEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFFcEMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFLTCxlQUFDO0FBQUQsQ0FBQyxDQTdDNkIsUUFBUSxHQTZDckM7QUE3Q1ksNEJBQVE7QUErQ3JCLDhDQUE4QztBQUU5QztJQUEyQix5QkFBUTtJQUMvQixlQUFZLFFBQWdCO1FBQTVCLFlBQ0ksa0JBQU0sUUFBUSxDQUFDLFNBRWxCO1FBREcsS0FBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7O0lBQ3hCLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FBQyxDQUwwQixRQUFRLEdBS2xDO0FBTFksc0JBQUs7QUFPbEI7SUFBNEIsMEJBQVE7SUFDaEMsZ0JBQVksUUFBZ0I7UUFBNUIsWUFDSSxrQkFBTSxRQUFRLENBQUMsU0FHbEI7UUFGRyxLQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztRQUN0QixLQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7SUFDcEIsQ0FBQztJQUVELHVCQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDakMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFO2dCQUVyQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7b0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO3dCQUNqQyxPQUFPLEtBQUssQ0FBQztxQkFDaEI7aUJBQ0o7YUFFSjtpQkFDRztnQkFFQSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztvQkFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO3dCQUNoQyxPQUFPLEtBQUssQ0FBQztxQkFDaEI7aUJBQ0o7YUFFSjtTQUNKO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVMLGFBQUM7QUFBRCxDQUFDLENBaEMyQixRQUFRLEdBZ0NuQztBQWhDWSx3QkFBTTtBQWtDbkI7SUFBMkIseUJBQVE7SUFDL0IsZUFBWSxRQUFnQjtRQUE1QixZQUNJLGtCQUFNLFFBQVEsQ0FBQyxTQUVsQjtRQURHLEtBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDOztJQUN4QixDQUFDO0lBRUQsc0JBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNqQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7Z0JBRXJCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztvQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7d0JBQ2pDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFDaEIsT0FBTyxJQUFJLENBQUM7cUJBQ2Y7aUJBQ0o7YUFFSjtpQkFDRztnQkFFQSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztvQkFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO3dCQUNoQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQ2hCLE9BQU8sSUFBSSxDQUFDO3FCQUNmO2lCQUNKO2FBRUo7U0FDSjtRQUdELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCx3QkFBUSxHQUFSO1FBQ0ksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFO1lBRXJCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztnQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7b0JBQ2pDLE9BQU8sS0FBSyxDQUFDO2lCQUNoQjthQUNKO1NBRUo7YUFDRztZQUVBLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO2dCQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7b0JBQ2hDLE9BQU8sS0FBSyxDQUFDO2lCQUNoQjthQUNKO1NBRUo7SUFDTCxDQUFDO0lBRUwsWUFBQztBQUFELENBQUMsQ0F2RDBCLFFBQVEsR0F1RGxDO0FBdkRZLHNCQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25IbEIsNkZBQWdEO0FBQ2hELG1IQUFpRTtBQVNqRTtJQUFBO0lBa0dBLENBQUM7SUFoR0csMkJBQUksR0FBSixVQUFLLFNBQWdCOzs7WUFFakIsS0FBZ0Isb0NBQVMsZ0dBQUM7Z0JBQXRCLElBQUksSUFBSTtnQkFDUixJQUFHLENBQUMsSUFBSTtvQkFDSixTQUFTO2dCQUViLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNqQjs7Ozs7Ozs7O1FBRUQsSUFBSSxLQUFLLEdBQW9CLElBQUksS0FBSyxFQUFFLENBQUM7O1lBQ3pDLEtBQWdCLG9DQUFTLGdHQUFDO2dCQUF0QixJQUFJLElBQUk7Z0JBQ1IsSUFBRyxDQUFDLElBQUk7b0JBQ0osU0FBUztnQkFFYixTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7Z0JBQ2xFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDWixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3BCOzs7Ozs7Ozs7UUFHRCxJQUFJLFNBQVMsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7WUFDeEQsS0FBZ0IsNEJBQUssNEVBQUM7Z0JBQWxCLElBQUksSUFBSTtnQkFFUixJQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25FLElBQUcsS0FBSyxJQUFJLFNBQVMsRUFBQztvQkFDbEIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUNoRTtxQkFBTTtvQkFDSCxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwQyxJQUFHLENBQUMsUUFBUSxFQUFDO3dCQUNULFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUMzQixTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztxQkFDbEM7b0JBQ0QsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDdEI7YUFDSjs7Ozs7Ozs7O1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDOztZQUMzQyxLQUE2QiwyQkFBUyxDQUFDLE9BQU8sRUFBRSw2Q0FBQztnQkFBekMsNEJBQWlCLEVBQWhCLEtBQUssVUFBRSxRQUFRO2dCQUNwQixTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QixTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7O29CQUNwRSxLQUFnQixpREFBUSw0RkFBQzt3QkFBckIsSUFBSSxJQUFJO3dCQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUNuQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBRXBCLElBQU0sT0FBSyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwRSxJQUFHLE9BQUssSUFBSSxTQUFTLEVBQUM7NEJBQ2xCLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzt5QkFDaEU7NkJBQU07NEJBQ0gsSUFBSSxVQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFLLENBQUMsQ0FBQzs0QkFDcEMsSUFBRyxDQUFDLFVBQVEsRUFBQztnQ0FDVCxVQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFLLENBQUMsQ0FBQztnQ0FDM0IsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFLLEVBQUUsVUFBUSxDQUFDLENBQUM7NkJBQ2xDOzRCQUNELFVBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7eUJBQ3RCO3FCQUNKOzs7Ozs7Ozs7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDO2FBQzlDOzs7Ozs7Ozs7UUFJRCxpREFBaUQ7UUFDakQsNkJBQTZCO1FBRzdCLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFTyxpQ0FBVSxHQUFsQixVQUFtQixTQUFpQjtRQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcseUJBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHlCQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsQyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFHcEMsSUFBSSxDQUFDLElBQUk7b0JBQ0wsU0FBUztnQkFJYixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyx5QkFBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcseUJBQVMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3BFLElBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUM7d0JBRXJELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztxQkFDcEM7eUJBQ0c7d0JBQ0EsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7d0JBQ3RDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztxQkFDaEU7aUJBQ0o7YUFFSjtTQUNKO0lBQ0wsQ0FBQztJQUVMLG1CQUFDO0FBQUQsQ0FBQztBQUVZLGVBQU8sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0cxQyw2R0FBK0Q7QUFRL0Q7SUFBQTtJQW1CQSxDQUFDO0lBakJHLGtDQUFTLEdBQVQsVUFBVSxTQUFnQjs7UUFDdEIsY0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7UUFDekIsY0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQzs7WUFFNUIsS0FBZ0Isb0NBQVMsZ0dBQUM7Z0JBQXRCLElBQUksSUFBSTtnQkFFUixJQUFJLENBQUMsSUFBSTtvQkFDTCxTQUFTO2dCQUdiLGNBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDM0IsY0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7YUFFekU7Ozs7Ozs7OztJQUVMLENBQUM7SUFFTCxxQkFBQztBQUFELENBQUM7QUFFWSxnQkFBUSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUI3QyxtSEFBaUU7QUFDakUsNkdBQThEO0FBRTlELHdFQUFrQztBQUNsQywyRUFBa0M7QUFFckIsaUJBQVMsR0FBRyxJQUFJLG9CQUFPLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRTlDO0lBQ0k7UUFBQSxpQkFNQztRQUVELEtBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHO1lBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVWLE9BQU07Z0JBQ0YsSUFBSSxFQUFDO29CQUNELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQVMsQ0FBQyxDQUFDLEdBQUcsaUJBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxJQUFHLElBQUksRUFBQzt3QkFDSixPQUFPLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO3FCQUN2Qjt5QkFBTTt3QkFDSCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxpQkFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsaUJBQVMsQ0FBQyxDQUFDLENBQUMsR0FBQyxpQkFBUyxDQUFDLENBQUMsQ0FBQzt3QkFDbEQsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDUCxPQUFNOzRCQUNGLElBQUksRUFBRSxLQUFLOzRCQUNYLEtBQUssRUFBRSxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDOUI7cUJBQ0o7Z0JBQ0wsQ0FBQzthQUNKO1FBQ0wsQ0FBQztRQTFCRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEMsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3hELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDbEU7SUFDTCxDQUFDO0lBeUJMLFlBQUM7QUFBRCxDQUFDO0FBaENZLHNCQUFLO0FBa0NQLGFBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBRS9CO0lBQWtDLGdDQUFRO0lBQ3RDO1FBQUEsWUFDSSxpQkFBTyxTQUdWO1FBRkcsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsS0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7O0lBQ25CLENBQUM7SUFFRCwrQkFBUSxHQUFSO0lBQ0EsQ0FBQztJQUVELCtCQUFRLEdBQVI7UUFDSSxpQkFBTSxRQUFRLFdBQUUsQ0FBQztRQUdqQixJQUFHLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDWCxpQkFBTyxDQUFDLElBQUksQ0FBQyxhQUFLLENBQUMsQ0FBQztRQUV4QixpQkFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFLLENBQUMsQ0FBQztRQUMxQixRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsR0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFHRCw4QkFBTyxHQUFQLFVBQVEsSUFBYztRQUNsQixhQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDN0QsQ0FBQztJQUlMLG1CQUFDO0FBQUQsQ0FBQyxDQTVCaUMsbUJBQVEsR0E0QnpDO0FBNUJZLG9DQUFZO0FBZ0N6QixpQ0FBaUM7QUFDakM7Ozs7Ozs7OztFQVNFOzs7Ozs7O1VDdEZGO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQSw2RkFBdUQ7QUFFdkQsb0dBQXdEO0FBQ3hELG1IQUFpRTtBQUVqRSw2RkFBb0Q7QUFFcEQsb0dBQTRFO0FBRTVFLDhFQUFrRDtBQUNsRCx3RUFBa0M7QUFDbEMsMkVBQW9DO0FBRXBDLGNBQWM7QUFDZCxJQUFJLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO0FBQ3hCLElBQUksYUFBYSxHQUFHLElBQUksNEJBQVksRUFBRSxDQUFDO0FBQ3ZDLElBQUksTUFBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7QUFFMUIsTUFBTSxDQUFDLE1BQU0sR0FBRztJQUNaLGFBQWE7SUFDYixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDVixZQUFZO0lBQ1osRUFBRSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV6QixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNsQyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBRzlDLDZCQUE2QjtJQUk3Qix5REFBeUQ7SUFFekQsWUFBWTtJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QiwyQkFBMkI7WUFDM0IsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGlCQUFNLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkQ7S0FDSjtJQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQiwyQkFBMkI7WUFDM0IsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQUFLLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEQ7S0FDSjtJQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQUFLLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RCxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksZ0JBQUssQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNEO0lBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQixhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksZ0JBQUssQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUMsR0FBRyxFQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQUFLLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzlEO0lBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN6QixhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksZ0JBQUssQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUMsRUFBRSxFQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQUFLLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLEVBQUUsRUFBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzlEO0lBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN6QixhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksZ0JBQUssQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxHQUFDLEVBQUUsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQUFLLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsR0FBQyxFQUFFLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNEO0FBRUwsQ0FBQyxDQUFDO0FBRUYsa0JBQWtCO0FBQ2xCLEtBQUssQ0FBQyxRQUFRLEdBQUc7SUFHYixJQUFJLHFCQUFhLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3RDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0tBQ2hEO0lBRUQsSUFBSSxxQkFBYSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNsQyxhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUM1QixpQkFBTyxDQUFDLElBQUksQ0FBQyxxQkFBSyxDQUFDLENBQUM7S0FDdkI7QUFFTCxDQUFDLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqUXVlcnJ5IHNlbGVjdG9yIGZvciB0aGUgY2FudmFzIGVsZW1lbnRcbiovXG5jb25zdCBjYW52YXNTZWxlY3RvciA9IFwiI2dhbWVcIjtcbmNvbnN0IHJlc2l6ZVZpZXdwb3J0ID0gdHJ1ZTtcbi8qKlRhcmdldCBmcmFtZXMgcGVyIHNlY29uZFxuKi9cbmNvbnN0IGZwcyA9IDYwO1xuXG5leHBvcnQge1xuICAgIGNhbnZhc1NlbGVjdG9yLCAgICBcbiAgICBmcHMsXG4gICAgcmVzaXplVmlld3BvcnRcbn0iLCIvKipcbiAqIDJEIFZlY3RvclxuICogU3RvcmVzIFggYW5kIFlcbiovXG5leHBvcnQgY2xhc3MgVmVjdG9yMiAge1xuICAgIGNvbnN0cnVjdG9yKFggOm51bWJlcixZIDpudW1iZXIpe1xuICAgICAgICB0aGlzLnggPSBYO1xuICAgICAgICB0aGlzLnkgPSBZO1xuICAgIH1cblxuICAgIGxlbmdodCgpe1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFxuICAgICAgICAgICAgTWF0aC5wb3codGhpcy54LDIpICsgTWF0aC5wb3codGhpcy55LDIpXG4gICAgICAgICAgICApXG4gICAgfVxuXG4gICAgbm9ybWFsaXplZCgpe1xuICAgICAgICBsZXQgbmV3VmVjdG9yID0gbmV3IFZlY3RvcjIodGhpcy54LHRoaXMueSk7XG4gICAgICAgIGxldCBsZW5naHQgPSBuZXdWZWN0b3IubGVuZ2h0KClcbiAgICAgICAgbmV3VmVjdG9yLnggLz0gbGVuZ2h0O1xuICAgICAgICBuZXdWZWN0b3IueSAvPSBsZW5naHQ7XG5cbiAgICAgICAgcmV0dXJuIG5ld1ZlY3RvcjtcbiAgICB9XG5cbiAgICB4Om51bWJlcjtcbiAgICB5Om51bWJlcjtcbn1cblxuLyoqXG4gKiBTdG9yZXMgcG9zaXRpb24gcm90YXRpb24gKGRlZ3JlZXMpIGFuZCBzY2FsZVxuICovXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtIHtcbiAgICBjb25zdHJ1Y3Rvcihwb3M/IDpWZWN0b3IyLCByb3Q/IDpudW1iZXIsIHNjYWxlPyA6VmVjdG9yMil7XG4gICAgICAgIHRoaXMucG9zaXRpb24gICA9IHBvcyA/IHBvcyAgICAgOiBuZXcgVmVjdG9yMigwLDApO1xuICAgICAgICB0aGlzLnJvdGF0aW9uICAgPSByb3QgPyByb3QgICAgIDogMDtcbiAgICAgICAgdGhpcy5zY2FsZSAgICAgID0gc2NhbGUgPyBzY2FsZSA6IG5ldyBWZWN0b3IyKDEsMSk7XG4gICAgfVxuICAgIHBvc2l0aW9uOiBWZWN0b3IyO1xuICAgIHJvdGF0aW9uOiBudW1iZXI7XG4gICAgc2NhbGU6IFZlY3RvcjI7XG59XG4iLCJpbXBvcnQgKiBhcyBSZW5kZXJpbmcgZnJvbSBcIi4vcmVuZGVyZXJcIjtcbmltcG9ydCAqIGFzIENvbmZpZyBmcm9tIFwiLi8uLi9lbmdpbmVDb25maWdcIjtcbmltcG9ydCB7U2NlbmV9IGZyb20gXCIuL3NjZW5lXCI7XG5pbXBvcnQge0tleWJvYXJkSW5wdXQsIE1vdXNlSW5wdXR9IGZyb20gXCIuLy4uL2VuZ2luZS9pbnB1dFwiO1xuXG5cbmV4cG9ydCB2YXIgYWN0aXZlU2NlbmUgOiBTY2VuZSB8IHVuZGVmaW5lZFxuXG4vKipcbiAqIFNldCB0aGUgc2NlbmUgeW91IHdhbnQgdG8gYmUgY3VycmVudGx5IGRpc3BsYXllZCBhbmQgdXBkYXRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0QWN0aXZlU2NlbmUoc2NlbmUgOlNjZW5lKXtcbiAgICBhY3RpdmVTY2VuZSA9IHNjZW5lO1xufVxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBlbmdpbmVcbiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBSZW5kZXJpbmcuaW5pdCgpO1xuICAgIEtleWJvYXJkSW5wdXQuaW5pdCgpO1xuICAgIE1vdXNlSW5wdXQuaW5pdCgpO1xuXG4gICAgc2V0SW50ZXJ2YWwodXBkYXRlLDEwMDAvQ29uZmlnLmZwcyk7XG59XG4vKipcbiAqIERvbid0IHVzZSBleHRlcm5hbHkuXG4gKiBDYWxscyBvblVwZGF0ZSBhbmQgb25SZW5kZXIgbWV0aG9kc1xuICovXG5mdW5jdGlvbiB1cGRhdGUoKXtcbiAgICBpZihhY3RpdmVTY2VuZT8ub25VcGRhdGUpXG4gICAgICAgIGFjdGl2ZVNjZW5lLm9uVXBkYXRlKCk7XG4gICAgYWN0aXZlU2NlbmU/LnVwZGF0ZSgpO1xuXG4gICAgUmVuZGVyaW5nLnJlbmRlcigpO1xufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XG5pbXBvcnQgeyBjYW52YXMgfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xuXG4vKipcbiAqIE1vc3Qgb2Yga2V5cyBwcmVzZW50IG9uIHRoZSBrZXlib2FyZCBhcyBhIHN0cmluZyB1bmlvbi4gUGxlYXNlIHJlcG9ydCBhbnkgbWlzc2luZyBrZXlzLlxuICovXG50eXBlIEtleSA9IFwiVGFiXCIgfCBcIkFsdFwiIHwgXCJBbHRHcmFwaFwiIHwgXCJCYWNrc3BhY2VcIiB8IFwiQ29udHJvbFwiIHxcIlNoaWZ0XCIgfCBcIlNwYWNlXCIgfCBcIkNvbnRleHRNZW51XCIgfCBcIkVudGVyXCIgfCBcIk51bUxvY2tcIiB8IFwiSG9tZVwiIHwgXCJQYWdlVXBcIiB8IFwiUGFnZURvd25cIiB8IFwiSW5zZXJ0XCIgfCBcIkRlbGV0ZVwiIHwgXCJBcnJvd1VwXCIgfCBcIkFycm93RG93blwiIHwgXCJBcnJvd1JpZ2h0XCIgfCBcIkFycm93TGVmdFwiIHxcIiFcIiB8IFwiXFxcIlwifCBcIiNcIiB8IFwiJFwiIHwgXCIlXCIgfCBcIiZcIiB8IFwiJ1wiIHwgXCIoXCIgfCBcIilcIiB8IFwiKlwiIHwgXCIrXCIgfCBcIixcIiB8IFwiLVwiIHwgXCIuXCIgfCBcIi9cIiB8IFwiMFwiIHwgXCIxXCIgfCBcIjJcIiB8IFwiM1wiIHwgXCI0XCIgfCBcIjVcIiB8IFwiNlwiIHwgXCI3XCIgfCBcIjhcIiB8IFwiOVwiIHwgXCI6XCIgfCBcIjtcIiB8IFwiPFwiIHwgXCI9XCIgfCBcIj5cIiB8IFwiP1wiIHwgXCJAXCIgfCBcIkFcIiB8IFwiQlwiIHwgXCJDXCIgfCBcIkRcIiB8IFwiRVwiIHwgXCJGXCIgfCBcIkdcIiB8IFwiSFwiIHwgXCJJXCIgfCBcIkpcIiB8IFwiS1wiIHwgXCJMXCIgfCBcIk1cIiB8IFwiTlwiIHwgXCJPXCIgfCBcIlBcIiB8IFwiUVwiIHwgXCJSXCIgfCBcIlNcIiB8IFwiVFwiIHwgXCJVXCIgfCBcIlZcIiB8IFwiV1wiIHwgXCJYXCIgfCBcIllcIiB8IFwiWlwiIHwgXCJbXCIgfCBcIlxcXFxcIiB8IFwiXVwiIHwgXCJeXCIgfCBcIl9cIiB8IFwiYFwiIHwgXCJhXCIgfCBcImJcIiB8IFwiY1wiIHwgXCJkXCIgfCBcImVcIiB8IFwiZlwiIHwgXCJnXCIgfCBcImhcIiB8IFwiaVwiIHwgXCJqXCIgfCBcImtcIiB8IFwibFwiIHwgXCJtXCIgfCBcIm5cIiB8IFwib1wiIHwgXCJwXCIgfCBcInFcIiB8IFwiclwiIHwgXCJzXCIgfCBcInRcIiB8IFwidVwiIHwgXCJ2XCIgfCBcIndcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInpcIiB8IFwie1wiIHwgXCJ8XCIgfCBcIn1cIiB8IFwiflwiIDtcblxudHlwZSBNb3VzZUJ1dHRvbiA9IFwiTE1CXCIgfCBcIlNjcm9sbEJ1dHRvblwiIHwgXCJSTUJcIjsgXG5cbmVudW0gS2V5U3RhdGV7XG4gICAgUFJFU1NFRCxcbiAgICBIT0xELFxuICAgIFJFTEVBU0UsXG59XG5cbmV4cG9ydCBjbGFzcyBLZXlib2FyZElucHV0e1xuICAgIC8qKlxuICAgICAqIEFkZCBldmVudCBsaXN0ZW5lcnMgZm9yIGtleSBwcmVzc2VzLlxuICAgICAqIEFsbHJlYWR5IGNhbGxlZCBieSB0aGUgaW5pdCBmdW5jdGlvbiBmcm9tIGNvcmUudHNcbiAgICAgKi9cbiAgICBzdGF0aWMgaW5pdCgpe1xuICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcyA9IG5ldyBNYXA8S2V5LEtleVN0YXRlPigpO1xuXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsKGUpPT57ICAgXG4gICAgICAgICAgICBpZihLZXlib2FyZElucHV0LnByZXZlbnREZWZhdWx0KSAgICBcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzLnNldChLZXlib2FyZElucHV0LnN0cmluZ1RvS2V5KGUua2V5KSxLZXlTdGF0ZS5QUkVTU0VEKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsKGUpPT57ICAgIFxuICAgICAgICAgICAgaWYoS2V5Ym9hcmRJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyBcblxuICAgICAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMuc2V0KEtleWJvYXJkSW5wdXQuc3RyaW5nVG9LZXkoZS5rZXkpLEtleVN0YXRlLlJFTEVBU0UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBcbiAgICAvKipcbiAgICAgKiBDaGVjayBmb3IgcHJlc3NlZCBrZXlcbiAgICAgKi9cbiAgICBzdGF0aWMgaXNQcmVzc2VkKGtleTogS2V5KXtcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5rZXlTdGF0ZXMuZ2V0KGtleSk7XG5cbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcbiAgICAgICAgICAgIHRoaXMua2V5U3RhdGVzLnNldChrZXksS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIShzdGF0ZSA9PT0gdW5kZWZpbmVkIHx8IHN0YXRlID09IEtleVN0YXRlLlJFTEVBU0UpXG4gICAgfVxuXG4gICAgc3RhdGljIGlzSnVzdFByZXNzZWQoa2V5OiBLZXkpe1xuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmtleVN0YXRlcy5nZXQoa2V5KTtcbiAgICAgICAgXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XG4gICAgICAgICAgICB0aGlzLmtleVN0YXRlcy5zZXQoa2V5LEtleVN0YXRlLkhPTEQpOyAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQ7XG4gICAgICAgIC8vcmV0dXJuIFxuICAgIH1cblxuICAgIHN0YXRpYyBwcmV2ZW50RGVmYXVsdCA9IHRydWU7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBrZXlTdGF0ZXM6IE1hcDxLZXksS2V5U3RhdGU+O1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc3RyaW5nVG9LZXkoa2V5IDpzdHJpbmcpeyAgICAgICAgXG4gICAgICAgIGxldCB2YWwgPSBrZXkucmVwbGFjZShcIkRlYWRcIixcIn5cIik7XG4gICAgICAgIHZhbCA9IHZhbC5yZXBsYWNlKFwiIFwiLFwiU3BhY2VcIik7XG4gICAgICAgIGxldCBrZXl0eXBlID0gdmFsICBhcyBLZXk7XG4gICAgICAgIHJldHVybiBrZXl0eXBlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1vdXNlSW5wdXR7XG4gICAgc3RhdGljIGluaXQoKXtcbiAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMgPSBuZXcgTWFwPE1vdXNlQnV0dG9uLEtleVN0YXRlPigpO1xuICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UgPSB7eDowLHk6MCx6OjB9O1xuXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlbW92ZSA9IGUgPT4geyAgIFxuICAgICAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKGUueCwgZS55KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9O1xuXG4gICAgICAgIGNhbnZhcy5vbndoZWVsID0gZSA9PiB7ICAgIFxuICAgICAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UueCArPSBlLmRlbHRhWDtcbiAgICAgICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZS55ICs9IGUuZGVsdGFZO1xuICAgICAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlLnogKz0gZS5kZWx0YVo7XG4gICAgICAgIH1cblxuICAgICAgICBjYW52YXMub25tb3VzZWRvd24gPSBlID0+IHtcbiAgICAgICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuc2V0KE1vdXNlSW5wdXQubnVtYmVyVG9CdXR0b24oZS5idXR0b24pLEtleVN0YXRlLlBSRVNTRUQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgY2FudmFzLm9ubW91c2V1cCA9IGUgPT4ge1xuICAgICAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5zZXQoTW91c2VJbnB1dC5udW1iZXJUb0J1dHRvbihlLmJ1dHRvbiksS2V5U3RhdGUuUkVMRUFTRSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICAvL3ByZXZlbnQgY29udGV4dCBtZW51XG4gICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhbnZhcy5vbmNvbnRleHRtZW51ID0gZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFdoZWVsT2Zmc2V0KCl7XG4gICAgICAgIGxldCBvZmZzZXQgPSBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2U7XG4gICAgICAgIGxldCBvdXQgPSB7eDpvZmZzZXQueCwgeTpvZmZzZXQueSwgejpvZmZzZXQuen07XG5cbiAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlID0ge3g6MCx5OjAsejowfTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cblxuICAgIHN0YXRpYyBpc1ByZXNzZWQoYnV0dG9uOiBNb3VzZUJ1dHRvbil7XG4gICAgICAgIGxldCBzdGF0ZSA9IE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLmdldChidXR0b24pO1xuXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XG4gICAgICAgICAgICBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5zZXQoYnV0dG9uLEtleVN0YXRlLkhPTEQpOyAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEoc3RhdGUgPT09IHVuZGVmaW5lZCB8fCBzdGF0ZSA9PSBLZXlTdGF0ZS5SRUxFQVNFKVxuICAgIH1cblxuICAgIHN0YXRpYyBpc0p1c3RQcmVzc2VkKGJ1dHRvbjogTW91c2VCdXR0b24pe1xuICAgICAgICBsZXQgc3RhdGUgPSBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5nZXQoYnV0dG9uKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XG4gICAgICAgICAgICBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5zZXQoYnV0dG9uLEtleVN0YXRlLkhPTEQpOyAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQ7XG4gICAgICAgIC8vcmV0dXJuIFxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIG51bWJlclRvQnV0dG9uKG51bWJlciA6IG51bWJlciApIDogTW91c2VCdXR0b257XG4gICAgICAgIHN3aXRjaCAobnVtYmVyKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTE1CXCI7XG4gICAgICAgICAgICBjYXNlIDE6ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiBcIlNjcm9sbEJ1dHRvblwiO1xuICAgICAgICAgICAgY2FzZSAyOiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJSTUJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBcIkxNQlwiOyAvL3RoYXRzIG5vdCBnb25uYSBoYXBwZW5cbiAgICB9XG5cbiAgICBzdGF0aWMgcHJldmVudERlZmF1bHQgPSB0cnVlO1xuICAgIHN0YXRpYyBjdXJyZW50UG9zaXRpb246IFZlY3RvcjI7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBidXR0b25TdGF0ZXM6IE1hcDxNb3VzZUJ1dHRvbixLZXlTdGF0ZT47XG4gICAgcHJpdmF0ZSBzdGF0aWMgbW91c2VXaGVlbENoYW5nZSA6IHt4Om51bWJlciwgeTpudW1iZXIsIHo6bnVtYmVyfTtcbn0iLCJpbXBvcnQge1ZlY3RvcjIsVHJhbnNmb3JtfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XG5pbXBvcnQge2N0eH0gZnJvbSBcIi4vcmVuZGVyZXJcIjtcblxuLyoqXG4gKiBCYXNlIGZvciBjaGlsZHJlbiBwb2x5bW9ycGhpc21cbiAqIEltcGxlbWVudCB0aGlzIGludGVyZmFjZSB3aGVuIGNyZWF0aW5nIGEgY29tcG9uZW50IC8gY2hpbGQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0MkQge1xuICAgIC8vSGFwcGVucyBldmVyeSB0aWNrXG4gICAgb25VcGRhdGUoKSA6dm9pZDsgXG4gICAgLy9DYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcbiAgICBvblJlbmRlcigpIDp2b2lkOyBcbiAgICBhZnRlclJlbmRlcigpIDp2b2lkOyBcblxuICAgIG9yaWdpbjogVHJhbnNmb3JtOyAgICBcbiAgICBjaGlsZHJlbjogQXJyYXk8T2JqZWN0MkQ+O1xufVxuXG4vKipcbiAqIEJhc2UgZm9yIGNoaWxkcmVuIHRoYXQgd2FudCB0byByZW5kZXIgc29tZXRoaW5nLlxuICogRXh0ZW5kIHRoaXMgY2xhc3MgZm9yIGN0eCBhY2Nlc3MgYW5kIG9yaWdpbiB0cmFuc2Zvcm0gaGFuZGVsaW5nLlxuICovXG5leHBvcnQgY2xhc3MgRHJhd2FibGUgaW1wbGVtZW50cyBPYmplY3QyRCB7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5vcmlnaW4gPSBuZXcgVHJhbnNmb3JtKCk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5jdHggPSBjdHg7XG4gICAgICAgIHRoaXMudXNlX2xvY2FsX2Nvb3JkaW5hdGVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMub3JpZ2luX2luX2NlbnRlciA9IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcbiAgICAgKi9cbiAgICBvblVwZGF0ZSgpe1xuICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XG4gICAgICogQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXG4gICAgICovXG4gICAgb25SZW5kZXIoKXsgICAgICAgICBcbiAgICAgICAgdGhpcy5jdHggPSBjdHg7XG5cbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xuICAgICAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKC0odGhpcy5vcmlnaW4uc2NhbGUueC8yKSwtKHRoaXMub3JpZ2luLnNjYWxlLnkvMikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSh0aGlzLm9yaWdpbi5wb3NpdGlvbi54LHRoaXMub3JpZ2luLnBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSh0aGlzLm9yaWdpbi5zY2FsZS54LzIsdGhpcy5vcmlnaW4uc2NhbGUueS8yKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgICAgIHRoaXMuY3R4LnJvdGF0ZSh0aGlzLm9yaWdpbi5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODApO1xuICAgICAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtKHRoaXMub3JpZ2luLnNjYWxlLngvMiksLSh0aGlzLm9yaWdpbi5zY2FsZS55LzIpKTtcbiAgICAgICAgfSAgICBcbiAgICAgICAgdGhpcy5jdHguc2NhbGUodGhpcy5vcmlnaW4uc2NhbGUueCx0aGlzLm9yaWdpbi5zY2FsZS55KTsgICAgICBcblxuICAgICAgICBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcbiAgICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxuICAgICAqL1xuICAgIGFmdGVyUmVuZGVyKCl7ICAgICAgICBcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIERyYXdhYmxlICYmICFjaGlsZC51c2VfbG9jYWxfY29vcmRpbmF0ZXMpXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc2NhbGUoMS90aGlzLm9yaWdpbi5zY2FsZS54LDEvdGhpcy5vcmlnaW4uc2NhbGUueSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNoaWxkLm9uUmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgb3JpZ2luOiBUcmFuc2Zvcm07ICAgIFxuICAgIGNoaWxkcmVuOiBBcnJheTxPYmplY3QyRD47XG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgdXNlX2xvY2FsX2Nvb3JkaW5hdGVzOiBib29sZWFuO1xuICAgIG9yaWdpbl9pbl9jZW50ZXI6IGJvb2xlYW47XG59XG4iLCJpbXBvcnQgKiBhcyBDb25maWcgZnJvbSBcIi4vLi4vZW5naW5lQ29uZmlnXCI7XG5pbXBvcnQge2FjdGl2ZVNjZW5lfSBmcm9tIFwiLi9jb3JlXCI7XG5cbmV4cG9ydCB2YXIgY3R4IDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5leHBvcnQgdmFyIGNhbnZhcyA6SFRNTENhbnZhc0VsZW1lbnQ7XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgY2FudmFzIGNvbnRleHQuXG4gKiBBbGxyZWFkeSBjYWxsZWQgYnkgdGhlIGluaXQgZnVuY3Rpb24gZnJvbSBjb3JlLnRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCl7XG4gICAgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihDb25maWcuY2FudmFzU2VsZWN0b3IpISBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG5cbn1cblxuLyoqXG4gKiBVcGRhdGVzIHZpZXdwb3J0IHNpemUsXG4gKiBjYWxscyBhbGwgdGhlIG9uUmVuZGVyIG1ldGhvZHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcigpeyAgXG4gICAgaWYoQ29uZmlnLnJlc2l6ZVZpZXdwb3J0KXtcbiAgICAgICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgY3R4LmNsZWFyUmVjdCgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xuICAgIGFjdGl2ZVNjZW5lPy5yZW5kZXIoKTtcbn0iLCJpbXBvcnQge0RyYXdhYmxlLCBPYmplY3QyRH0gZnJvbSBcIi4vb2JqZWN0MkRcIlxuaW1wb3J0IHtjdHgsY2FudmFzfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xuXG4vKipcbiAqIFJvb3QgZm9yIGFsbCB0aGUgZWxlbWVudHMgaW5zaWRlIHlvdXIgbGV2ZWwuXG4gKiBPYmplY3RzIG5vdCBhIG1lbWJlciBvZiB0aGUgYWN0aXZlIHNjZW5lIHdvbnQgYmUgY2FsbGVkIHZpYSBvblVwZGF0ZSBhbmQgb25SZW5kZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBTY2VuZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLm1lbWJlcnMgPSBbXTtcbiAgICB9XG5cbiAgICB1cGRhdGUoKXtcbiAgICAgICAgdGhpcy5tZW1iZXJzLmZvckVhY2goY2hpbGQ9PntcbiAgICAgICAgICAgIGNoaWxkLm9uVXBkYXRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLm9uVXBkYXRlKVxuICAgICAgICAgICAgdGhpcy5vblVwZGF0ZSgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy5tZW1iZXJzLmZvckVhY2goY2hpbGQ9PntcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgICBjaGlsZC5vblJlbmRlcigpO1xuICAgICAgICAgICAgY2hpbGQuYWZ0ZXJSZW5kZXIoKTtcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgIH0pO1xuICAgIH0gICBcblxuICAgIG9uVXBkYXRlOiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcbiAgICBtZW1iZXJzOiBBcnJheTxPYmplY3QyRD47XG59IiwiaW1wb3J0IHtEcmF3YWJsZX0gZnJvbSBcIi4vb2JqZWN0MkRcIjtcbmltcG9ydCB7VmVjdG9yMixUcmFuc2Zvcm19IGZyb20gXCIuL2Jhc2VfdHlwZXNcIjtcblxuLyoqXG4gKiBEZWZpbmVzIGEgc2hlcGUncyBvdXRsaW5lXG4gKi9cbmV4cG9ydCBjbGFzcyBPdXRsaW5lIHtcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aDogbnVtYmVyLGNvbG9yOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMudGhpY2tuZXNzID0gd2lkdGg7XG4gICAgfVxuICAgIHRoaWNrbmVzczogbnVtYmVyO1xuICAgIGNvbG9yOiBzdHJpbmc7XG59XG5cbi8qKlxuICogU29saWQgY29sb3IgZHJhd2FibGUgZWxlbWVudFxuICogVXNlIGZvciBjdXN0b20gcG9seWdvbiBzaGFwZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTaGFwZSBleHRlbmRzIERyYXdhYmxlIHtcbiAgICBjb25zdHJ1Y3Rvcih2ZXJ0aWNpZXM6IFZlY3RvcjJbXSwgY29sb3I/OiBzdHJpbmcsb3V0bGluZT86IE91dGxpbmUpe1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMudmVydGljaWVzID0gdmVydGljaWVzO1xuXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciA/IGNvbG9yIDogXCJ3aGl0ZVwiO1xuICAgICAgICB0aGlzLm91dGxpbmUgPSBvdXRsaW5lID8gb3V0bGluZSA6IG5ldyBPdXRsaW5lKDAsJyMwMDAwJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XG4gICAgICogQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXG4gICAgICovXG4gICAgb25SZW5kZXIoKXtcbiAgICAgICAgc3VwZXIub25SZW5kZXIoKTtcbiAgICAgICBcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKHRoaXMudmVydGljaWVzWzBdLngsdGhpcy52ZXJ0aWNpZXNbMF0ueSk7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMudmVydGljaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLnZlcnRpY2llc1tpXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHZlcnRleC54LHZlcnRleC55KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcblxuICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgICAgIHRoaXMuY3R4LnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB0aGlzLm91dGxpbmUudGhpY2tuZXNzO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IHRoaXMub3V0bGluZS5jb2xvcjtcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7ICAgICAgICBcblxuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG5cbiAgICAgICAgXG4gICAgfVxuXG4gICAgdmVydGljaWVzOiBWZWN0b3IyW107XG4gICAgb3V0bGluZTogT3V0bGluZTtcbiAgICBjb2xvcjogc3RyaW5nO1xufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcbmltcG9ydCB7U2hhcGUsT3V0bGluZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zaGFwZVwiO1xuaW1wb3J0IHtNb3VzZUlucHV0fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2lucHV0XCI7XG5pbXBvcnQgeyBjdHggfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3JlbmRlcmVyXCI7XG5cbmV4cG9ydCBjbGFzcyBDdXJzb3IgZXh0ZW5kcyBTaGFwZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBsZXQgZGVmYXVsdFNoYXBlID0gW1xuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMTAsMCksXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigxMCwxMCksXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigwLDEwKSxcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMClcbiAgICAgICAgXSAgICAgICAgXG5cbiAgICAgICAgc3VwZXIoZGVmYXVsdFNoYXBlLFwiIzAwMDBcIixuZXcgT3V0bGluZSgxLCd3aGl0ZScpKTtcblxuICAgICAgICB0aGlzLm9yaWdpbl9pbl9jZW50ZXIgPSB0cnVlO1xuICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24gPSBuZXcgVmVjdG9yMigwLDApO1xuICAgIH1cblxuICAgIGNoYW5nZVJhZGl1cyhyYWRpdXMgOiBudW1iZXIpe1xuICAgICAgICByYWRpdXMgPSBNYXRoLnJvdW5kKHJhZGl1cyk7XG5cbiAgICB9XG5cbiAgICBvblJlbmRlcigpeyAgICAgICAgICAgICAgIFxuICAgICAgICBpZihNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c1Bvc2l0aW9uID0gdGhpcy5vcmlnaW4ucG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbiA9IE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwwLDEwLDEwKTtcblxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJldmlvdXNQb3NpdGlvbjpWZWN0b3IyO1xuXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xuaW1wb3J0IHsgd29ybGQsV29ybGRTaXplIH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgUGFydGljbGV7XG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBWZWN0b3IyKDAsMCk7XG4gICAgICAgIHRoaXMuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgfVxuICAgIFxuICAgIGRlY2lkZSgpe1xuICAgIH1cbiAgICBcbiAgICBzdGVwKCl7XG4gICAgICAgIGlmKHRoaXMudmVsb2NpdHkgIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5Lng7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55O1xuICAgICAgICB9XG4gICAgfVxuICAgXG4gICAgcG9zaXRpb246IFZlY3RvcjI7IFxuICAgIHZlbG9jaXR5OiBWZWN0b3IyO1xuICAgIGNvbG9yOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBNb3ZlYWJsZSBleHRlbmRzIFBhcnRpY2xleyAgICBcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcbiAgICAgICAgc3VwZXIocG9zaXRpb24pXG5cbiAgICAgICAgdGhpcy53ZWlnaHQgPSAxO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwwKTtcbiAgICB9XG5cbiAgICB0cnlNb3ZlKHJlbGF0aXZlUG9zOiBWZWN0b3IyKSA6Ym9vbGVhbntcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55ID49IFdvcmxkU2l6ZS55IHx8IHRoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54ID49IFdvcmxkU2l6ZS54IHx8XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueSA8IDAgfHwgdGhpcy5wb3NpdGlvbi54K3JlbGF0aXZlUG9zLnggPCAwICkgXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgICAgICBcblxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XG5cbiAgICAgICAgaWYgKHRhcmdldCAhPSB1bmRlZmluZWQpIHsgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cnlTd2FwKHJlbGF0aXZlUG9zKTs7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSByZWxhdGl2ZVBvcy54OyBcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueSA9IHJlbGF0aXZlUG9zLnk7IFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cnlTd2FwKHJlbGF0aXZlUG9zOiBWZWN0b3IyKSA6Ym9vbGVhbnsgICAgICAgIFxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XG5cbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTW92ZWFibGUgJiYgdGFyZ2V0LndlaWdodCA8IHRoaXMud2VpZ2h0KVxuICAgICAgICB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9Td2FwISAgICAgICAgICAgIFxuICAgICAgICAgICAgdGFyZ2V0LnZlbG9jaXR5LnggPSB0aGlzLnBvc2l0aW9uLnggLSB0YXJnZXQucG9zaXRpb24ueDtcbiAgICAgICAgICAgIHRhcmdldC52ZWxvY2l0eS55ID0gdGhpcy5wb3NpdGlvbi55IC0gdGFyZ2V0LnBvc2l0aW9uLnk7XG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSB0YXJnZXQudmVsb2NpdHkueDtcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueSA9IHRhcmdldC52ZWxvY2l0eS55O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmVsb2NpdHk6IFZlY3RvcjI7ICAgIFxuICAgIHdlaWdodDogbnVtYmVyO1xuXG59XG5cbi8vNCBCYXNlIHBhcnRpY2xlIHR5cGVzIFNvbGlkIFBvd2RlciBGbHVpZCBHYXNcblxuZXhwb3J0IGNsYXNzIFNvbGlkIGV4dGVuZHMgUGFydGljbGV7XG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XG4gICAgICAgIHN1cGVyKHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5jb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvd2RlciBleHRlbmRzIE1vdmVhYmxle1xuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xuICAgICAgICBzdXBlcihwb3NpdGlvbik7XG4gICAgICAgIHRoaXMuY29sb3IgPSBcInllbGxvd1wiO1xuICAgICAgICB0aGlzLndlaWdodCA9IDI7XG4gICAgfVxuXG4gICAgZGVjaWRlKCl7XG4gICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDAsMSkpKSB7IFxuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDEpKSl7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gICAgICBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDEpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBGbHVpZCBleHRlbmRzIE1vdmVhYmxle1xuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xuICAgICAgICBzdXBlcihwb3NpdGlvbik7XG4gICAgICAgIHRoaXMuY29sb3IgPSBcImFxdWFcIjtcbiAgICB9XG4gICAgXG4gICAgZGVjaWRlKCl7XG4gICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDAsMSkpKSB7IFxuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDEpKSl7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVTaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgIFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVNpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIG1vdmVTaWRlKCl7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDApKSl7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMCkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gICAgICBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDApKSl7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwwKSkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQge1dvcmxkLFdvcmxkU2l6ZX0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xuaW1wb3J0IHtQYXJ0aWNsZX0gZnJvbSBcIi4vcGFydGljbGVcIjtcblxuaW50ZXJmYWNlIFBoeXNpY3N7XG5cbiAgICBzdGVwKHNpbV9zdGF0ZTogV29ybGQpOldvcmxkO1xuXG59XG5cbmNsYXNzIEJhc2ljUGh5c2ljcyBpbXBsZW1lbnRzIFBoeXNpY3N7XG5cbiAgICBzdGVwKHNpbV9zdGF0ZTogV29ybGQpe1xuXG4gICAgICAgIGZvcihsZXQgcGFydCBvZiBzaW1fc3RhdGUpe1xuICAgICAgICAgICAgaWYoIXBhcnQpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIHBhcnQuZGVjaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFydHMgOkFycmF5PFBhcnRpY2xlPiA9IG5ldyBBcnJheSgpO1xuICAgICAgICBmb3IobGV0IHBhcnQgb2Ygc2ltX3N0YXRlKXtcbiAgICAgICAgICAgIGlmKCFwYXJ0KVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHBhcnQuc3RlcCgpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgcGFydHMucHVzaChwYXJ0KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgbGV0IGNvbmZsaWN0cyA6TWFwPFBhcnRpY2xlLCBTZXQ8UGFydGljbGU+PiA9IG5ldyBNYXAoKTtcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHBhcnRzKXtcblxuICAgICAgICAgICAgY29uc3QgZmlyc3QgPSBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XVxuICAgICAgICAgICAgaWYoZmlyc3QgPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHBhcnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBjb25mbGljdCA9IGNvbmZsaWN0cy5nZXQoZmlyc3QpO1xuICAgICAgICAgICAgICAgIGlmKCFjb25mbGljdCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZsaWN0ID0gbmV3IFNldChbZmlyc3RdKVxuICAgICAgICAgICAgICAgICAgICBjb25mbGljdHMuc2V0KGZpcnN0LCBjb25mbGljdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbmZsaWN0LmFkZChwYXJ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbmZsaWN0cy5zaXplICsgJyBjb25mbGljdHMnKTtcbiAgICAgICAgZm9yKGxldCBbZmlyc3QsIGNvbmZsaWN0XSBvZiBjb25mbGljdHMuZW50cmllcygpKXtcbiAgICAgICAgICAgIGNvbmZsaWN0cy5kZWxldGUoZmlyc3QpO1xuICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1tmaXJzdC5wb3NpdGlvbi55XVtmaXJzdC5wb3NpdGlvbi54XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGZvcihsZXQgcGFydCBvZiBjb25mbGljdCl7XG4gICAgICAgICAgICAgICAgcGFydC5wb3NpdGlvbi54IC09IHBhcnQudmVsb2NpdHkueDtcbiAgICAgICAgICAgICAgICBwYXJ0LnBvc2l0aW9uLnkgLT0gcGFydC52ZWxvY2l0eS55O1xuICAgICAgICAgICAgICAgIHBhcnQudmVsb2NpdHkueCA9IDA7XG4gICAgICAgICAgICAgICAgcGFydC52ZWxvY2l0eS55ID0gMDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0ID0gc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF07XG4gICAgICAgICAgICAgICAgaWYoZmlyc3QgPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSBwYXJ0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb25mbGljdCA9IGNvbmZsaWN0cy5nZXQoZmlyc3QpO1xuICAgICAgICAgICAgICAgICAgICBpZighY29uZmxpY3Qpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmxpY3QgPSBuZXcgU2V0KFtmaXJzdF0pXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25mbGljdHMuc2V0KGZpcnN0LCBjb25mbGljdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uZmxpY3QuYWRkKHBhcnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbmZsaWN0cy5zaXplICsgJyBjb25mbGljdHMnKTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICAvL3N5bmNocm9uaXplIHdvcmxkIHBvc2l0aW9uIHdpdGggbWF0cml4IHBvc2l0aW9uXG4gICAgICAgIC8vdGhpcy5tYXRyaXhTeW5jKHNpbV9zdGF0ZSk7XG4gICAgICAgIFxuXG4gICAgICAgIHJldHVybiBzaW1fc3RhdGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtYXRyaXhTeW5jKHNpbV9zdGF0ZSA6IFdvcmxkKXtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBXb3JsZFNpemUueTsgeSsrKSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFdvcmxkU2l6ZS54OyB4KyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFydCA9IHNpbV9zdGF0ZS5wYXJ0aWNsZXNbeV1beF1cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIGlmICghcGFydClcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICgocGFydC5wb3NpdGlvbi55KSA8IFdvcmxkU2l6ZS55ICYmIChwYXJ0LnBvc2l0aW9uLngpIDwgV29ybGRTaXplLngpIHsgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmKHNpbV9zdGF0ZS5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFydC5wb3NpdGlvbiA9IG5ldyBWZWN0b3IyKHgseSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbV9zdGF0ZS5wYXJ0aWNsZXNbeV1beF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHBhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IFBoeXNpY3MgPSBuZXcgQmFzaWNQaHlzaWNzKCk7IiwiaW1wb3J0IHtXb3JsZCxXb3JsZFNpemUsd29ybGR9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcbmltcG9ydCB7Y2FudmFzLGN0eH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9yZW5kZXJlclwiXG5cbmludGVyZmFjZSBSZW5kZXJlcntcblxuICAgIGRyYXdGcmFtZShzaW1fc3RhdGU6IFdvcmxkKSA6IHZvaWQ7XG5cbn1cblxuY2xhc3MgQ2FudmFzUmVuZGVyZXIgaW1wbGVtZW50cyBSZW5kZXJlcntcblxuICAgIGRyYXdGcmFtZShzaW1fc3RhdGU6IFdvcmxkKXtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyM3NzcnO1xuICAgICAgICBjdHguc3Ryb2tlUmVjdCgwLDAsNDAwLDMwMCk7XG5cbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHNpbV9zdGF0ZSl7XG5cbiAgICAgICAgICAgIGlmICghcGFydClcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiBcblxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHBhcnQuY29sb3I7XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QocGFydC5wb3NpdGlvbi54LHBhcnQucG9zaXRpb24ueSwxLDEpOyAvL2RyYXcgcmVjdGFuZ2xlIDpQXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IFJlbmRlcmVyID0gbmV3IENhbnZhc1JlbmRlcmVyKCk7IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xuaW1wb3J0IHtEcmF3YWJsZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9vYmplY3QyRFwiO1xuaW1wb3J0IHtQYXJ0aWNsZX0gZnJvbSBcIi4vcGFydGljbGVcIjtcbmltcG9ydCB7UmVuZGVyZXJ9IGZyb20gXCIuL3JlbmRlclwiO1xuaW1wb3J0IHtQaHlzaWNzfSBmcm9tIFwiLi9waHlzaWNzXCI7XG5cbmV4cG9ydCBjb25zdCBXb3JsZFNpemUgPSBuZXcgVmVjdG9yMig0MDAsMzAwKTtcblxuZXhwb3J0IGNsYXNzIFdvcmxke1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3IEFycmF5KFdvcmxkU2l6ZS55KTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpbmRleCsrKSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlc1tpbmRleF0gPSBuZXcgQXJyYXkoV29ybGRTaXplLngpLmZpbGwodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFtTeW1ib2wuaXRlcmF0b3JdID0gKCkgPT4geyAgICAgIFxuICAgICAgICBsZXQgaSA9IDA7XG5cbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgbmV4dDooKT0+e1xuICAgICAgICAgICAgICAgIGxldCBkb25lID0gKGkgPj0gKFdvcmxkU2l6ZS54ICogV29ybGRTaXplLnkpKTtcbiAgICAgICAgICAgICAgICBpZihkb25lKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtkb25lOiB0cnVlfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgeSA9IE1hdGguZmxvb3IoaS9Xb3JsZFNpemUueCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB4ID0gaSAtIE1hdGguZmxvb3IoaS9Xb3JsZFNpemUueCkqV29ybGRTaXplLng7XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5wYXJ0aWNsZXNbeV1beF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhcnRpY2xlczpBcnJheTxBcnJheTxQYXJ0aWNsZSB8IHVuZGVmaW5lZD4+O1xuICAgIFxufVxuXG5leHBvcnQgdmFyIHdvcmxkID0gbmV3IFdvcmxkKCk7XG5cbmV4cG9ydCBjbGFzcyBXb3JsZE1hbmFnZXIgZXh0ZW5kcyBEcmF3YWJsZXsgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgIH1cblxuICAgIG9uVXBkYXRlKCl7ICAgICAgXG4gICAgfVxuICAgIFxuICAgIG9uUmVuZGVyKCl7XG4gICAgICAgIHN1cGVyLm9uUmVuZGVyKCk7XG5cbiAgICAgICAgXG4gICAgICAgIGlmKCF0aGlzLnBhdXNlZClcbiAgICAgICAgICAgIFBoeXNpY3Muc3RlcCh3b3JsZCk7XG4gICAgICAgICAgICBcbiAgICAgICAgUmVuZGVyZXIuZHJhd0ZyYW1lKHdvcmxkKTtcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSAnJysoKyt0aGlzLmZyYW1lKTtcbiAgICB9ICAgIFxuXG5cbiAgICBhZGRQYXJ0KHBhcnQ6IFBhcnRpY2xlKXsgICAgICAgIFxuICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdID0gcGFydDtcbiAgICB9XG5cbiAgICBwYXVzZWQ6Ym9vbGVhbjtcbiAgICBmcmFtZTpudW1iZXI7XG59XG5cblxuXG4vL1RPRE86IE11bHRpdGhyZWFkaW5nIGlmIGkgZmFuY3lcbi8qXG51c2UgdGhpcyB0byB0ZXN0IGlmIHN1cHBvcnRlZFxuXG5pZiAodHlwZW9mKFdvcmtlcikgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgIC8vZ3JlYXQsIHlvdXIgYnJvd3NlciBzdXBwb3J0cyB3ZWIgd29ya2Vyc1xufSBlbHNlIHtcbiAgIC8vbm90IHN1cHBvcnRlZFxufVxuXG4qLyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgKiBhcyBDRSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2NvcmVcIjtcblxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zY2VuZVwiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xuXG5pbXBvcnQge3dvcmxkLCBXb3JsZE1hbmFnZXJ9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcblxuaW1wb3J0IHtLZXlib2FyZElucHV0LCBNb3VzZUlucHV0fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2lucHV0XCI7XG5cbmltcG9ydCB7IEZsdWlkLCBQb3dkZXIsIFNvbGlkIH0gZnJvbSBcIi4vcGFydGljbGVcIjtcbmltcG9ydCB7IEN1cnNvciB9IGZyb20gXCIuL2N1cnNvclwiO1xuaW1wb3J0IHsgUGh5c2ljcyB9IGZyb20gXCIuL3BoeXNpY3NcIjtcblxuLy9jcmVhdGUgc2NlbmVcbmxldCBsZXZlbCA9IG5ldyBTY2VuZSgpO1xubGV0IHdvcmxkX21hbmFnZXIgPSBuZXcgV29ybGRNYW5hZ2VyKCk7XG5sZXQgY3Vyc29yID0gbmV3IEN1cnNvcigpO1xuXG53aW5kb3cub25sb2FkID0gKCk9PntcbiAgICAvL2luaXQgZW5naW5lXG4gICAgQ0UuaW5pdCgpO1xuICAgIC8vYmluZCBzY2VuZVxuICAgIENFLnNldEFjdGl2ZVNjZW5lKGxldmVsKTtcbiAgICBcbiAgICBsZXZlbC5tZW1iZXJzLnB1c2god29ybGRfbWFuYWdlcik7XG4gICAgd29ybGRfbWFuYWdlci5vcmlnaW4uc2NhbGUgPSBuZXcgVmVjdG9yMigyLDIpO1xuICAgIFxuICAgIFxuICAgIC8vbGV2ZWwubWVtYmVycy5wdXNoKGN1cnNvcik7XG5cblxuXG4gICAgLy93b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFBvd2RlcihuZXcgVmVjdG9yMig4MCwwKSkpOyAgXG5cbiAgICAvL0RlbW8gd29ybGRcbiAgICBmb3IgKGxldCB4ID0gNjA7IHggPCAxNDA7IHgrKykgeyAgICAgXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgODsgeSsrKSB7ICAgICBcbiAgICAgICAgICAgIC8vbWl4IHNvbWUgZmx1aWQgYW5kIHBvd2RlclxuICAgICAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBQb3dkZXIobmV3IFZlY3RvcjIoeCx5KSkpOyBcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCB4ID0gNjA7IHggPCAxNDA7IHgrKykgeyAgICAgXG4gICAgICAgIGZvciAobGV0IHkgPSAxNTsgeSA8IDIyOyB5KyspIHsgICAgIFxuICAgICAgICAgICAgLy9taXggc29tZSBmbHVpZCBhbmQgcG93ZGVyXG4gICAgICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IEZsdWlkKG5ldyBWZWN0b3IyKHgseSkpKTsgXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwMDsgeCsrKSB7IFxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKHgrMCx4KzYwKSkpOyAgICBcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4KzAseCs2MSkpKTsgICAgICBcbiAgICB9XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwMDsgeCsrKSB7IFxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzIyMCx4KzYwKSkpOyAgICBcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsyMjAseCs2MSkpKTsgICAgICBcbiAgICB9XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDUwOyB4KyspIHsgXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrOTgseCsxOTApKSk7ICAgIFxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14Kzk4LHgrMTkxKSkpOyAgICAgIFxuICAgIH1cblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTA7IHgrKykgeyBcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4Kzk4LDE5MCkpKTsgICAgXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoeCs5OCwxOTEpKSk7ICAgICAgXG4gICAgfVxuIFxufTtcblxuLy9ydW5zIGV2ZXJ5IHRpY2sgXG5sZXZlbC5vblVwZGF0ZSA9ICgpPT57XG4gICAgXG5cbiAgICBpZiAoS2V5Ym9hcmRJbnB1dC5pc0p1c3RQcmVzc2VkKFwiU3BhY2VcIikpIHtcbiAgICAgICAgd29ybGRfbWFuYWdlci5wYXVzZWQgPSAhd29ybGRfbWFuYWdlci5wYXVzZWQ7ICAgICAgICBcbiAgICB9XG5cbiAgICBpZiAoS2V5Ym9hcmRJbnB1dC5pc0p1c3RQcmVzc2VkKFwiZlwiKSkge1xuICAgICAgICB3b3JsZF9tYW5hZ2VyLnBhdXNlZCA9IHRydWU7XG4gICAgICAgIFBoeXNpY3Muc3RlcCh3b3JsZCk7XG4gICAgfSAgIFxuXHRcbn07ICJdLCJzb3VyY2VSb290IjoiIn0=