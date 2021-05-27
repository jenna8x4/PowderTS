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
            var newX = this.position.x + this.velocity.x;
            if (0 <= newX && newX < world_manager_1.WorldSize.x) {
                this.position.x = newX;
            }
            else {
                this.velocity.x = 0;
            }
            var newY = this.position.y + this.velocity.y;
            if (0 <= newY && newY < world_manager_1.WorldSize.y) {
                this.position.y = newY;
            }
            else {
                this.velocity.y = 0;
            }
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
            this.velocity.x = target.position.x - this.position.x;
            this.velocity.y = target.position.y - this.position.y;
            //target.velocity.x = -this.velocity.x;
            //target.velocity.y = -this.velocity.y;
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
        if (Math.random() < 0.6) {
            _this.color = "yellow";
        }
        else {
            _this.color = "khaki";
        }
        _this.weight = 2;
        return _this;
    }
    Powder.prototype.decide = function () {
        if (!this.tryMove(new base_types_1.Vector2(0, 1))) {
            if (Math.random() > 0.5) {
                if (!this.tryMove(new base_types_1.Vector2(1, 1))) {
                    return false;
                }
            }
            else {
                if (!this.tryMove(new base_types_1.Vector2(-1, 1))) {
                    return false;
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
        if (Math.random() < 0.6) {
            _this.color = "aqua";
        }
        else {
            _this.color = "lightseagreen";
        }
        return _this;
    }
    Fluid.prototype.decide = function () {
        if (!this.tryMove(new base_types_1.Vector2(0, 1))) {
            if (Math.random() > 0.5) {
                if (!this.tryMove(new base_types_1.Vector2(1, 1))) {
                    this.moveSide();
                    return true;
                }
            }
            else {
                if (!this.tryMove(new base_types_1.Vector2(-1, 1))) {
                    this.moveSide();
                    return true;
                }
            }
        }
        return true;
    };
    Fluid.prototype.moveSide = function () {
        if (Math.random() > 0.5) {
            if (!this.tryMove(new base_types_1.Vector2(1, 0))) {
                return false;
            }
        }
        else {
            if (!this.tryMove(new base_types_1.Vector2(-1, 0))) {
                return false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2hhcGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL2N1cnNvci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvcGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BoeXNpY3MudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3JlbmRlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvd29ybGRfbWFuYWdlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtFQUNFO0FBQ0YsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDO0FBTzNCLHdDQUFjO0FBTmxCLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQztBQVF4Qix3Q0FBYztBQVBsQjtFQUNFO0FBQ0YsSUFBTSxHQUFHLEdBQUcsRUFB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LENBQUMsQ0FBQztLQUN2QjtBQUVMLENBQUMsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipRdWVycnkgc2VsZWN0b3IgZm9yIHRoZSBjYW52YXMgZWxlbWVudFxuKi9cbmNvbnN0IGNhbnZhc1NlbGVjdG9yID0gXCIjZ2FtZVwiO1xuY29uc3QgcmVzaXplVmlld3BvcnQgPSB0cnVlO1xuLyoqVGFyZ2V0IGZyYW1lcyBwZXIgc2Vjb25kXG4qL1xuY29uc3QgZnBzID0gNjA7XG5cbmV4cG9ydCB7XG4gICAgY2FudmFzU2VsZWN0b3IsICAgIFxuICAgIGZwcyxcbiAgICByZXNpemVWaWV3cG9ydFxufSIsIi8qKlxuICogMkQgVmVjdG9yXG4gKiBTdG9yZXMgWCBhbmQgWVxuKi9cbmV4cG9ydCBjbGFzcyBWZWN0b3IyICB7XG4gICAgY29uc3RydWN0b3IoWCA6bnVtYmVyLFkgOm51bWJlcil7XG4gICAgICAgIHRoaXMueCA9IFg7XG4gICAgICAgIHRoaXMueSA9IFk7XG4gICAgfVxuXG4gICAgbGVuZ2h0KCl7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoXG4gICAgICAgICAgICBNYXRoLnBvdyh0aGlzLngsMikgKyBNYXRoLnBvdyh0aGlzLnksMilcbiAgICAgICAgICAgIClcbiAgICB9XG5cbiAgICBub3JtYWxpemVkKCl7XG4gICAgICAgIGxldCBuZXdWZWN0b3IgPSBuZXcgVmVjdG9yMih0aGlzLngsdGhpcy55KTtcbiAgICAgICAgbGV0IGxlbmdodCA9IG5ld1ZlY3Rvci5sZW5naHQoKVxuICAgICAgICBuZXdWZWN0b3IueCAvPSBsZW5naHQ7XG4gICAgICAgIG5ld1ZlY3Rvci55IC89IGxlbmdodDtcblxuICAgICAgICByZXR1cm4gbmV3VmVjdG9yO1xuICAgIH1cblxuICAgIHg6bnVtYmVyO1xuICAgIHk6bnVtYmVyO1xufVxuXG4vKipcbiAqIFN0b3JlcyBwb3NpdGlvbiByb3RhdGlvbiAoZGVncmVlcykgYW5kIHNjYWxlXG4gKi9cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xuICAgIGNvbnN0cnVjdG9yKHBvcz8gOlZlY3RvcjIsIHJvdD8gOm51bWJlciwgc2NhbGU/IDpWZWN0b3IyKXtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiAgID0gcG9zID8gcG9zICAgICA6IG5ldyBWZWN0b3IyKDAsMCk7XG4gICAgICAgIHRoaXMucm90YXRpb24gICA9IHJvdCA/IHJvdCAgICAgOiAwO1xuICAgICAgICB0aGlzLnNjYWxlICAgICAgPSBzY2FsZSA/IHNjYWxlIDogbmV3IFZlY3RvcjIoMSwxKTtcbiAgICB9XG4gICAgcG9zaXRpb246IFZlY3RvcjI7XG4gICAgcm90YXRpb246IG51bWJlcjtcbiAgICBzY2FsZTogVmVjdG9yMjtcbn1cbiIsImltcG9ydCAqIGFzIFJlbmRlcmluZyBmcm9tIFwiLi9yZW5kZXJlclwiO1xuaW1wb3J0ICogYXMgQ29uZmlnIGZyb20gXCIuLy4uL2VuZ2luZUNvbmZpZ1wiO1xuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4vc2NlbmVcIjtcbmltcG9ydCB7S2V5Ym9hcmRJbnB1dCwgTW91c2VJbnB1dH0gZnJvbSBcIi4vLi4vZW5naW5lL2lucHV0XCI7XG5cblxuZXhwb3J0IHZhciBhY3RpdmVTY2VuZSA6IFNjZW5lIHwgdW5kZWZpbmVkXG5cbi8qKlxuICogU2V0IHRoZSBzY2VuZSB5b3Ugd2FudCB0byBiZSBjdXJyZW50bHkgZGlzcGxheWVkIGFuZCB1cGRhdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3RpdmVTY2VuZShzY2VuZSA6U2NlbmUpe1xuICAgIGFjdGl2ZVNjZW5lID0gc2NlbmU7XG59XG4vKipcbiAqIEluaXRpYWxpemUgdGhlIGVuZ2luZVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAgIFJlbmRlcmluZy5pbml0KCk7XG4gICAgS2V5Ym9hcmRJbnB1dC5pbml0KCk7XG4gICAgTW91c2VJbnB1dC5pbml0KCk7XG5cbiAgICBzZXRJbnRlcnZhbCh1cGRhdGUsMTAwMC9Db25maWcuZnBzKTtcbn1cbi8qKlxuICogRG9uJ3QgdXNlIGV4dGVybmFseS5cbiAqIENhbGxzIG9uVXBkYXRlIGFuZCBvblJlbmRlciBtZXRob2RzXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZSgpe1xuICAgIGlmKGFjdGl2ZVNjZW5lPy5vblVwZGF0ZSlcbiAgICAgICAgYWN0aXZlU2NlbmUub25VcGRhdGUoKTtcbiAgICBhY3RpdmVTY2VuZT8udXBkYXRlKCk7XG5cbiAgICBSZW5kZXJpbmcucmVuZGVyKCk7XG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL2Jhc2VfdHlwZXNcIjtcbmltcG9ydCB7IGNhbnZhcyB9IGZyb20gXCIuL3JlbmRlcmVyXCI7XG5cbi8qKlxuICogTW9zdCBvZiBrZXlzIHByZXNlbnQgb24gdGhlIGtleWJvYXJkIGFzIGEgc3RyaW5nIHVuaW9uLiBQbGVhc2UgcmVwb3J0IGFueSBtaXNzaW5nIGtleXMuXG4gKi9cbnR5cGUgS2V5ID0gXCJUYWJcIiB8IFwiQWx0XCIgfCBcIkFsdEdyYXBoXCIgfCBcIkJhY2tzcGFjZVwiIHwgXCJDb250cm9sXCIgfFwiU2hpZnRcIiB8IFwiU3BhY2VcIiB8IFwiQ29udGV4dE1lbnVcIiB8IFwiRW50ZXJcIiB8IFwiTnVtTG9ja1wiIHwgXCJIb21lXCIgfCBcIlBhZ2VVcFwiIHwgXCJQYWdlRG93blwiIHwgXCJJbnNlcnRcIiB8IFwiRGVsZXRlXCIgfCBcIkFycm93VXBcIiB8IFwiQXJyb3dEb3duXCIgfCBcIkFycm93UmlnaHRcIiB8IFwiQXJyb3dMZWZ0XCIgfFwiIVwiIHwgXCJcXFwiXCJ8IFwiI1wiIHwgXCIkXCIgfCBcIiVcIiB8IFwiJlwiIHwgXCInXCIgfCBcIihcIiB8IFwiKVwiIHwgXCIqXCIgfCBcIitcIiB8IFwiLFwiIHwgXCItXCIgfCBcIi5cIiB8IFwiL1wiIHwgXCIwXCIgfCBcIjFcIiB8IFwiMlwiIHwgXCIzXCIgfCBcIjRcIiB8IFwiNVwiIHwgXCI2XCIgfCBcIjdcIiB8IFwiOFwiIHwgXCI5XCIgfCBcIjpcIiB8IFwiO1wiIHwgXCI8XCIgfCBcIj1cIiB8IFwiPlwiIHwgXCI/XCIgfCBcIkBcIiB8IFwiQVwiIHwgXCJCXCIgfCBcIkNcIiB8IFwiRFwiIHwgXCJFXCIgfCBcIkZcIiB8IFwiR1wiIHwgXCJIXCIgfCBcIklcIiB8IFwiSlwiIHwgXCJLXCIgfCBcIkxcIiB8IFwiTVwiIHwgXCJOXCIgfCBcIk9cIiB8IFwiUFwiIHwgXCJRXCIgfCBcIlJcIiB8IFwiU1wiIHwgXCJUXCIgfCBcIlVcIiB8IFwiVlwiIHwgXCJXXCIgfCBcIlhcIiB8IFwiWVwiIHwgXCJaXCIgfCBcIltcIiB8IFwiXFxcXFwiIHwgXCJdXCIgfCBcIl5cIiB8IFwiX1wiIHwgXCJgXCIgfCBcImFcIiB8IFwiYlwiIHwgXCJjXCIgfCBcImRcIiB8IFwiZVwiIHwgXCJmXCIgfCBcImdcIiB8IFwiaFwiIHwgXCJpXCIgfCBcImpcIiB8IFwia1wiIHwgXCJsXCIgfCBcIm1cIiB8IFwiblwiIHwgXCJvXCIgfCBcInBcIiB8IFwicVwiIHwgXCJyXCIgfCBcInNcIiB8IFwidFwiIHwgXCJ1XCIgfCBcInZcIiB8IFwid1wiIHwgXCJ4XCIgfCBcInlcIiB8IFwielwiIHwgXCJ7XCIgfCBcInxcIiB8IFwifVwiIHwgXCJ+XCIgO1xuXG50eXBlIE1vdXNlQnV0dG9uID0gXCJMTUJcIiB8IFwiU2Nyb2xsQnV0dG9uXCIgfCBcIlJNQlwiOyBcblxuZW51bSBLZXlTdGF0ZXtcbiAgICBQUkVTU0VELFxuICAgIEhPTEQsXG4gICAgUkVMRUFTRSxcbn1cblxuZXhwb3J0IGNsYXNzIEtleWJvYXJkSW5wdXR7XG4gICAgLyoqXG4gICAgICogQWRkIGV2ZW50IGxpc3RlbmVycyBmb3Iga2V5IHByZXNzZXMuXG4gICAgICogQWxscmVhZHkgY2FsbGVkIGJ5IHRoZSBpbml0IGZ1bmN0aW9uIGZyb20gY29yZS50c1xuICAgICAqL1xuICAgIHN0YXRpYyBpbml0KCl7XG4gICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzID0gbmV3IE1hcDxLZXksS2V5U3RhdGU+KCk7XG5cbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwoZSk9PnsgICBcbiAgICAgICAgICAgIGlmKEtleWJvYXJkSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMuc2V0KEtleWJvYXJkSW5wdXQuc3RyaW5nVG9LZXkoZS5rZXkpLEtleVN0YXRlLlBSRVNTRUQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwoZSk9PnsgICAgXG4gICAgICAgICAgICBpZihLZXlib2FyZElucHV0LnByZXZlbnREZWZhdWx0KSAgICBcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IFxuXG4gICAgICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcy5zZXQoS2V5Ym9hcmRJbnB1dC5zdHJpbmdUb0tleShlLmtleSksS2V5U3RhdGUuUkVMRUFTRSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIFxuICAgIC8qKlxuICAgICAqIENoZWNrIGZvciBwcmVzc2VkIGtleVxuICAgICAqL1xuICAgIHN0YXRpYyBpc1ByZXNzZWQoa2V5OiBLZXkpe1xuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmtleVN0YXRlcy5nZXQoa2V5KTtcblxuICAgICAgICBpZiAoc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRCkge1xuICAgICAgICAgICAgdGhpcy5rZXlTdGF0ZXMuc2V0KGtleSxLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhKHN0YXRlID09PSB1bmRlZmluZWQgfHwgc3RhdGUgPT0gS2V5U3RhdGUuUkVMRUFTRSlcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNKdXN0UHJlc3NlZChrZXk6IEtleSl7XG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMua2V5U3RhdGVzLmdldChrZXkpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcbiAgICAgICAgICAgIHRoaXMua2V5U3RhdGVzLnNldChrZXksS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRDtcbiAgICAgICAgLy9yZXR1cm4gXG4gICAgfVxuXG4gICAgc3RhdGljIHByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcblxuICAgIHByaXZhdGUgc3RhdGljIGtleVN0YXRlczogTWFwPEtleSxLZXlTdGF0ZT47XG5cbiAgICBwcml2YXRlIHN0YXRpYyBzdHJpbmdUb0tleShrZXkgOnN0cmluZyl7ICAgICAgICBcbiAgICAgICAgbGV0IHZhbCA9IGtleS5yZXBsYWNlKFwiRGVhZFwiLFwiflwiKTtcbiAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoXCIgXCIsXCJTcGFjZVwiKTtcbiAgICAgICAgbGV0IGtleXR5cGUgPSB2YWwgIGFzIEtleTtcbiAgICAgICAgcmV0dXJuIGtleXR5cGU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW91c2VJbnB1dHtcbiAgICBzdGF0aWMgaW5pdCgpe1xuICAgICAgICBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcyA9IG5ldyBNYXA8TW91c2VCdXR0b24sS2V5U3RhdGU+KCk7XG4gICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZSA9IHt4OjAseTowLHo6MH07XG5cbiAgICAgICAgY2FudmFzLm9ubW91c2Vtb3ZlID0gZSA9PiB7ICAgXG4gICAgICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KSAgICBcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uID0gbmV3IFZlY3RvcjIoZS54LCBlLnkpO1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG5cbiAgICAgICAgY2FudmFzLm9ud2hlZWwgPSBlID0+IHsgICAgXG4gICAgICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KSAgICBcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZS54ICs9IGUuZGVsdGFYO1xuICAgICAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlLnkgKz0gZS5kZWx0YVk7XG4gICAgICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UueiArPSBlLmRlbHRhWjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IGUgPT4ge1xuICAgICAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5zZXQoTW91c2VJbnB1dC5udW1iZXJUb0J1dHRvbihlLmJ1dHRvbiksS2V5U3RhdGUuUFJFU1NFRCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBjYW52YXMub25tb3VzZXVwID0gZSA9PiB7XG4gICAgICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KSAgICBcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChNb3VzZUlucHV0Lm51bWJlclRvQnV0dG9uKGUuYnV0dG9uKSxLZXlTdGF0ZS5SRUxFQVNFKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcHJldmVudCBjb250ZXh0IG1lbnVcbiAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdClcbiAgICAgICAge1xuICAgICAgICAgICAgY2FudmFzLm9uY29udGV4dG1lbnUgPSBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0V2hlZWxPZmZzZXQoKXtcbiAgICAgICAgbGV0IG9mZnNldCA9IE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZTtcbiAgICAgICAgbGV0IG91dCA9IHt4Om9mZnNldC54LCB5Om9mZnNldC55LCB6Om9mZnNldC56fTtcblxuICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UgPSB7eDowLHk6MCx6OjB9O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuXG4gICAgc3RhdGljIGlzUHJlc3NlZChidXR0b246IE1vdXNlQnV0dG9uKXtcbiAgICAgICAgbGV0IHN0YXRlID0gTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuZ2V0KGJ1dHRvbik7XG5cbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChidXR0b24sS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIShzdGF0ZSA9PT0gdW5kZWZpbmVkIHx8IHN0YXRlID09IEtleVN0YXRlLlJFTEVBU0UpXG4gICAgfVxuXG4gICAgc3RhdGljIGlzSnVzdFByZXNzZWQoYnV0dG9uOiBNb3VzZUJ1dHRvbil7XG4gICAgICAgIGxldCBzdGF0ZSA9IE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLmdldChidXR0b24pO1xuICAgICAgICBcbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChidXR0b24sS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRDtcbiAgICAgICAgLy9yZXR1cm4gXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgbnVtYmVyVG9CdXR0b24obnVtYmVyIDogbnVtYmVyICkgOiBNb3VzZUJ1dHRvbntcbiAgICAgICAgc3dpdGNoIChudW1iZXIpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJMTUJcIjtcbiAgICAgICAgICAgIGNhc2UgMTogICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiU2Nyb2xsQnV0dG9uXCI7XG4gICAgICAgICAgICBjYXNlIDI6ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiBcIlJNQlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFwiTE1CXCI7IC8vdGhhdHMgbm90IGdvbm5hIGhhcHBlblxuICAgIH1cblxuICAgIHN0YXRpYyBwcmV2ZW50RGVmYXVsdCA9IHRydWU7XG4gICAgc3RhdGljIGN1cnJlbnRQb3NpdGlvbjogVmVjdG9yMjtcblxuICAgIHByaXZhdGUgc3RhdGljIGJ1dHRvblN0YXRlczogTWFwPE1vdXNlQnV0dG9uLEtleVN0YXRlPjtcbiAgICBwcml2YXRlIHN0YXRpYyBtb3VzZVdoZWVsQ2hhbmdlIDoge3g6bnVtYmVyLCB5Om51bWJlciwgejpudW1iZXJ9O1xufSIsImltcG9ydCB7VmVjdG9yMixUcmFuc2Zvcm19IGZyb20gXCIuL2Jhc2VfdHlwZXNcIjtcbmltcG9ydCB7Y3R4fSBmcm9tIFwiLi9yZW5kZXJlclwiO1xuXG4vKipcbiAqIEJhc2UgZm9yIGNoaWxkcmVuIHBvbHltb3JwaGlzbVxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIHdoZW4gY3JlYXRpbmcgYSBjb21wb25lbnQgLyBjaGlsZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPYmplY3QyRCB7XG4gICAgLy9IYXBwZW5zIGV2ZXJ5IHRpY2tcbiAgICBvblVwZGF0ZSgpIDp2b2lkOyBcbiAgICAvL0NhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxuICAgIG9uUmVuZGVyKCkgOnZvaWQ7IFxuICAgIGFmdGVyUmVuZGVyKCkgOnZvaWQ7IFxuXG4gICAgb3JpZ2luOiBUcmFuc2Zvcm07ICAgIFxuICAgIGNoaWxkcmVuOiBBcnJheTxPYmplY3QyRD47XG59XG5cbi8qKlxuICogQmFzZSBmb3IgY2hpbGRyZW4gdGhhdCB3YW50IHRvIHJlbmRlciBzb21ldGhpbmcuXG4gKiBFeHRlbmQgdGhpcyBjbGFzcyBmb3IgY3R4IGFjY2VzcyBhbmQgb3JpZ2luIHRyYW5zZm9ybSBoYW5kZWxpbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBEcmF3YWJsZSBpbXBsZW1lbnRzIE9iamVjdDJEIHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLm9yaWdpbiA9IG5ldyBUcmFuc2Zvcm0oKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICAgICAgdGhpcy51c2VfbG9jYWxfY29vcmRpbmF0ZXMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vcmlnaW5faW5fY2VudGVyID0gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxuICAgICAqL1xuICAgIG9uVXBkYXRlKCl7XG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcbiAgICAgKiBDYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcbiAgICAgKi9cbiAgICBvblJlbmRlcigpeyAgICAgICAgIFxuICAgICAgICB0aGlzLmN0eCA9IGN0eDtcblxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLSh0aGlzLm9yaWdpbi5zY2FsZS54LzIpLC0odGhpcy5vcmlnaW4uc2NhbGUueS8yKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMub3JpZ2luLnBvc2l0aW9uLngsdGhpcy5vcmlnaW4ucG9zaXRpb24ueSk7XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xuICAgICAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMub3JpZ2luLnNjYWxlLngvMix0aGlzLm9yaWdpbi5zY2FsZS55LzIpO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMub3JpZ2luLnJvdGF0aW9uICogTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xuICAgICAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKC0odGhpcy5vcmlnaW4uc2NhbGUueC8yKSwtKHRoaXMub3JpZ2luLnNjYWxlLnkvMikpO1xuICAgICAgICB9ICAgIFxuICAgICAgICB0aGlzLmN0eC5zY2FsZSh0aGlzLm9yaWdpbi5zY2FsZS54LHRoaXMub3JpZ2luLnNjYWxlLnkpOyAgICAgIFxuXG4gICAgICAgIFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxuICAgICAqIENhbGxlZCBhZnRlciB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXG4gICAgICovXG4gICAgYWZ0ZXJSZW5kZXIoKXsgICAgICAgIFxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRHJhd2FibGUgJiYgIWNoaWxkLnVzZV9sb2NhbF9jb29yZGluYXRlcylcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zY2FsZSgxL3RoaXMub3JpZ2luLnNjYWxlLngsMS90aGlzLm9yaWdpbi5zY2FsZS55KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2hpbGQub25SZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBvcmlnaW46IFRyYW5zZm9ybTsgICAgXG4gICAgY2hpbGRyZW46IEFycmF5PE9iamVjdDJEPjtcbiAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICB1c2VfbG9jYWxfY29vcmRpbmF0ZXM6IGJvb2xlYW47XG4gICAgb3JpZ2luX2luX2NlbnRlcjogYm9vbGVhbjtcbn1cbiIsImltcG9ydCAqIGFzIENvbmZpZyBmcm9tIFwiLi8uLi9lbmdpbmVDb25maWdcIjtcbmltcG9ydCB7YWN0aXZlU2NlbmV9IGZyb20gXCIuL2NvcmVcIjtcblxuZXhwb3J0IHZhciBjdHggOkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbmV4cG9ydCB2YXIgY2FudmFzIDpIVE1MQ2FudmFzRWxlbWVudDtcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBjYW52YXMgY29udGV4dC5cbiAqIEFsbHJlYWR5IGNhbGxlZCBieSB0aGUgaW5pdCBmdW5jdGlvbiBmcm9tIGNvcmUudHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKXtcbiAgICBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKENvbmZpZy5jYW52YXNTZWxlY3RvcikhIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcblxufVxuXG4vKipcbiAqIFVwZGF0ZXMgdmlld3BvcnQgc2l6ZSxcbiAqIGNhbGxzIGFsbCB0aGUgb25SZW5kZXIgbWV0aG9kc1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKCl7ICBcbiAgICBpZihDb25maWcucmVzaXplVmlld3BvcnQpe1xuICAgICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB9XG5cbiAgICBjdHguY2xlYXJSZWN0KDAsMCxjYW52YXMud2lkdGgsY2FudmFzLmhlaWdodCk7XG4gICAgYWN0aXZlU2NlbmU/LnJlbmRlcigpO1xufSIsImltcG9ydCB7RHJhd2FibGUsIE9iamVjdDJEfSBmcm9tIFwiLi9vYmplY3QyRFwiXG5pbXBvcnQge2N0eCxjYW52YXN9IGZyb20gXCIuL3JlbmRlcmVyXCI7XG5cbi8qKlxuICogUm9vdCBmb3IgYWxsIHRoZSBlbGVtZW50cyBpbnNpZGUgeW91ciBsZXZlbC5cbiAqIE9iamVjdHMgbm90IGEgbWVtYmVyIG9mIHRoZSBhY3RpdmUgc2NlbmUgd29udCBiZSBjYWxsZWQgdmlhIG9uVXBkYXRlIGFuZCBvblJlbmRlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFNjZW5le1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMubWVtYmVycyA9IFtdO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpe1xuICAgICAgICB0aGlzLm1lbWJlcnMuZm9yRWFjaChjaGlsZD0+e1xuICAgICAgICAgICAgY2hpbGQub25VcGRhdGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMub25VcGRhdGUpXG4gICAgICAgICAgICB0aGlzLm9uVXBkYXRlKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLm1lbWJlcnMuZm9yRWFjaChjaGlsZD0+e1xuICAgICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICAgIGNoaWxkLm9uUmVuZGVyKCk7XG4gICAgICAgICAgICBjaGlsZC5hZnRlclJlbmRlcigpO1xuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSAgIFxuXG4gICAgb25VcGRhdGU6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkO1xuICAgIG1lbWJlcnM6IEFycmF5PE9iamVjdDJEPjtcbn0iLCJpbXBvcnQge0RyYXdhYmxlfSBmcm9tIFwiLi9vYmplY3QyRFwiO1xuaW1wb3J0IHtWZWN0b3IyLFRyYW5zZm9ybX0gZnJvbSBcIi4vYmFzZV90eXBlc1wiO1xuXG4vKipcbiAqIERlZmluZXMgYSBzaGVwZSdzIG91dGxpbmVcbiAqL1xuZXhwb3J0IGNsYXNzIE91dGxpbmUge1xuICAgIGNvbnN0cnVjdG9yKHdpZHRoOiBudW1iZXIsY29sb3I6IHN0cmluZyl7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy50aGlja25lc3MgPSB3aWR0aDtcbiAgICB9XG4gICAgdGhpY2tuZXNzOiBudW1iZXI7XG4gICAgY29sb3I6IHN0cmluZztcbn1cblxuLyoqXG4gKiBTb2xpZCBjb2xvciBkcmF3YWJsZSBlbGVtZW50XG4gKiBVc2UgZm9yIGN1c3RvbSBwb2x5Z29uIHNoYXBlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNoYXBlIGV4dGVuZHMgRHJhd2FibGUge1xuICAgIGNvbnN0cnVjdG9yKHZlcnRpY2llczogVmVjdG9yMltdLCBjb2xvcj86IHN0cmluZyxvdXRsaW5lPzogT3V0bGluZSl7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy52ZXJ0aWNpZXMgPSB2ZXJ0aWNpZXM7XG5cbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID8gY29sb3IgOiBcIndoaXRlXCI7XG4gICAgICAgIHRoaXMub3V0bGluZSA9IG91dGxpbmUgPyBvdXRsaW5lIDogbmV3IE91dGxpbmUoMCwnIzAwMDAnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcbiAgICAgKiBDYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcbiAgICAgKi9cbiAgICBvblJlbmRlcigpe1xuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xuICAgICAgIFxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8odGhpcy52ZXJ0aWNpZXNbMF0ueCx0aGlzLnZlcnRpY2llc1swXS55KTtcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy52ZXJ0aWNpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMudmVydGljaWVzW2ldO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8odmVydGV4LngsdmVydGV4LnkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICAgICAgdGhpcy5jdHgucmVzZXRUcmFuc2Zvcm0oKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHRoaXMub3V0bGluZS50aGlja25lc3M7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5vdXRsaW5lLmNvbG9yO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTsgICAgICAgIFxuXG4gICAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcblxuICAgICAgICBcbiAgICB9XG5cbiAgICB2ZXJ0aWNpZXM6IFZlY3RvcjJbXTtcbiAgICBvdXRsaW5lOiBPdXRsaW5lO1xuICAgIGNvbG9yOiBzdHJpbmc7XG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xuaW1wb3J0IHtTaGFwZSxPdXRsaW5lfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3NoYXBlXCI7XG5pbXBvcnQge01vdXNlSW5wdXR9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvaW5wdXRcIjtcbmltcG9ydCB7IGN0eCB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvcmVuZGVyZXJcIjtcblxuZXhwb3J0IGNsYXNzIEN1cnNvciBleHRlbmRzIFNoYXBle1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIGxldCBkZWZhdWx0U2hhcGUgPSBbXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigxMCwwKSxcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDEwLDEwKSxcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMTApLFxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMCwwKVxuICAgICAgICBdICAgICAgICBcblxuICAgICAgICBzdXBlcihkZWZhdWx0U2hhcGUsXCIjMDAwMFwiLG5ldyBPdXRsaW5lKDEsJ3doaXRlJykpO1xuXG4gICAgICAgIHRoaXMub3JpZ2luX2luX2NlbnRlciA9IHRydWU7XG4gICAgICAgIHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKDAsMCk7XG4gICAgfVxuXG4gICAgY2hhbmdlUmFkaXVzKHJhZGl1cyA6IG51bWJlcil7XG4gICAgICAgIHJhZGl1cyA9IE1hdGgucm91bmQocmFkaXVzKTtcblxuICAgIH1cblxuICAgIG9uUmVuZGVyKCl7ICAgICAgICAgICAgICAgXG4gICAgICAgIGlmKE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24gPSB0aGlzLm9yaWdpbi5wb3NpdGlvbjtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luLnBvc2l0aW9uID0gTW91c2VJbnB1dC5jdXJyZW50UG9zaXRpb247XG4gICAgICAgIH1cbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLDAsMTAsMTApO1xuXG4gICAgICAgIHN1cGVyLm9uUmVuZGVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmV2aW91c1Bvc2l0aW9uOlZlY3RvcjI7XG5cbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XG5pbXBvcnQgeyB3b3JsZCxXb3JsZFNpemUgfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBQYXJ0aWNsZXtcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwwKTtcbiAgICAgICAgdGhpcy5jb2xvciA9IFwid2hpdGVcIjtcbiAgICB9XG4gICAgXG4gICAgZGVjaWRlKCl7XG4gICAgfVxuICAgIFxuICAgIHN0ZXAoKXtcbiAgICAgICAgaWYodGhpcy52ZWxvY2l0eSAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgY29uc3QgbmV3WCA9IHRoaXMucG9zaXRpb24ueCArIHRoaXMudmVsb2NpdHkueDtcbiAgICAgICAgICAgIGlmKDAgPD0gbmV3WCAmJiBuZXdYIDwgV29ybGRTaXplLngpe1xuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCA9IG5ld1g7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3WSA9IHRoaXMucG9zaXRpb24ueSArIHRoaXMudmVsb2NpdHkueTtcbiAgICAgICAgICAgIGlmKDAgPD0gbmV3WSAmJiBuZXdZIDwgV29ybGRTaXplLnkpe1xuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSA9IG5ld1k7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnkgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgXG4gICAgcG9zaXRpb246IFZlY3RvcjI7IFxuICAgIHZlbG9jaXR5OiBWZWN0b3IyO1xuICAgIGNvbG9yOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBNb3ZlYWJsZSBleHRlbmRzIFBhcnRpY2xleyAgICBcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcbiAgICAgICAgc3VwZXIocG9zaXRpb24pXG5cbiAgICAgICAgdGhpcy53ZWlnaHQgPSAxO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwwKTtcbiAgICB9XG5cbiAgICB0cnlNb3ZlKHJlbGF0aXZlUG9zOiBWZWN0b3IyKSA6Ym9vbGVhbntcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55ID49IFdvcmxkU2l6ZS55IHx8IHRoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54ID49IFdvcmxkU2l6ZS54IHx8XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueSA8IDAgfHwgdGhpcy5wb3NpdGlvbi54K3JlbGF0aXZlUG9zLnggPCAwICkgXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgICAgICBcblxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XG5cbiAgICAgICAgaWYgKHRhcmdldCAhPSB1bmRlZmluZWQpIHsgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cnlTd2FwKHJlbGF0aXZlUG9zKTs7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSByZWxhdGl2ZVBvcy54OyBcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueSA9IHJlbGF0aXZlUG9zLnk7IFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cnlTd2FwKHJlbGF0aXZlUG9zOiBWZWN0b3IyKSA6Ym9vbGVhbnsgICAgICAgIFxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XG5cbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTW92ZWFibGUgJiYgdGFyZ2V0LndlaWdodCA8IHRoaXMud2VpZ2h0KVxuICAgICAgICB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9Td2FwISAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS54ID0gdGFyZ2V0LnBvc2l0aW9uLnggLSB0aGlzLnBvc2l0aW9uLng7XG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnkgPSB0YXJnZXQucG9zaXRpb24ueSAtIHRoaXMucG9zaXRpb24ueTtcbiAgICAgICAgICAgIC8vdGFyZ2V0LnZlbG9jaXR5LnggPSAtdGhpcy52ZWxvY2l0eS54O1xuICAgICAgICAgICAgLy90YXJnZXQudmVsb2NpdHkueSA9IC10aGlzLnZlbG9jaXR5Lnk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2ZWxvY2l0eTogVmVjdG9yMjsgICAgXG4gICAgd2VpZ2h0OiBudW1iZXI7XG5cbn1cblxuLy80IEJhc2UgcGFydGljbGUgdHlwZXMgU29saWQgUG93ZGVyIEZsdWlkIEdhc1xuXG5leHBvcnQgY2xhc3MgU29saWQgZXh0ZW5kcyBQYXJ0aWNsZXtcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcbiAgICAgICAgc3VwZXIocG9zaXRpb24pO1xuICAgICAgICB0aGlzLmNvbG9yID0gXCJncmF5XCI7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUG93ZGVyIGV4dGVuZHMgTW92ZWFibGV7XG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XG4gICAgICAgIHN1cGVyKHBvc2l0aW9uKTtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjYpIHtcbiAgICAgICAgICAgIHRoaXMuY29sb3IgPSBcInllbGxvd1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb2xvciA9IFwia2hha2lcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndlaWdodCA9IDI7XG4gICAgfVxuXG4gICAgZGVjaWRlKCl7XG4gICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDAsMSkpKSB7IFxuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDEpKSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgRmx1aWQgZXh0ZW5kcyBNb3ZlYWJsZXtcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcbiAgICAgICAgc3VwZXIocG9zaXRpb24pO1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNikge1xuICAgICAgICAgICAgdGhpcy5jb2xvciA9IFwiYXF1YVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb2xvciA9IFwibGlnaHRzZWFncmVlblwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGRlY2lkZSgpe1xuICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigwLDEpKSkgeyBcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVTaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVNpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIG1vdmVTaWRlKCl7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDApKSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMCkpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCB7V29ybGQsV29ybGRTaXplfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XG5pbXBvcnQge1BhcnRpY2xlfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xuXG5pbnRlcmZhY2UgUGh5c2ljc3tcblxuICAgIHN0ZXAoc2ltX3N0YXRlOiBXb3JsZCk6V29ybGQ7XG5cbn1cblxuY2xhc3MgQmFzaWNQaHlzaWNzIGltcGxlbWVudHMgUGh5c2ljc3tcblxuICAgIHN0ZXAoc2ltX3N0YXRlOiBXb3JsZCl7XG5cbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHNpbV9zdGF0ZSl7XG4gICAgICAgICAgICBpZighcGFydClcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgcGFydC5kZWNpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYXJ0cyA6QXJyYXk8UGFydGljbGU+ID0gbmV3IEFycmF5KCk7XG4gICAgICAgIGZvcihsZXQgcGFydCBvZiBzaW1fc3RhdGUpe1xuICAgICAgICAgICAgaWYoIXBhcnQpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIHNpbV9zdGF0ZS5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcGFydC5zdGVwKCk7ICAgICAgICAgICAgXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKHBhcnQpO1xuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgY29uZmxpY3RzIDpNYXA8UGFydGljbGUsIFNldDxQYXJ0aWNsZT4+ID0gbmV3IE1hcCgpO1xuICAgICAgICBmb3IobGV0IHBhcnQgb2YgcGFydHMpe1xuXG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IHNpbV9zdGF0ZS5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdXG4gICAgICAgICAgICBpZihmaXJzdCA9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIHNpbV9zdGF0ZS5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdID0gcGFydDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbmZsaWN0ID0gY29uZmxpY3RzLmdldChmaXJzdCk7XG4gICAgICAgICAgICAgICAgaWYoIWNvbmZsaWN0KXtcbiAgICAgICAgICAgICAgICAgICAgY29uZmxpY3QgPSBuZXcgU2V0KFtmaXJzdF0pXG4gICAgICAgICAgICAgICAgICAgIGNvbmZsaWN0cy5zZXQoZmlyc3QsIGNvbmZsaWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uZmxpY3QuYWRkKHBhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coY29uZmxpY3RzLnNpemUgKyAnIGNvbmZsaWN0cycpO1xuICAgICAgICBmb3IobGV0IFtmaXJzdCwgY29uZmxpY3RdIG9mIGNvbmZsaWN0cy5lbnRyaWVzKCkpe1xuICAgICAgICAgICAgY29uZmxpY3RzLmRlbGV0ZShmaXJzdCk7XG4gICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW2ZpcnN0LnBvc2l0aW9uLnldW2ZpcnN0LnBvc2l0aW9uLnhdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZm9yKGxldCBwYXJ0IG9mIGNvbmZsaWN0KXtcbiAgICAgICAgICAgICAgICBwYXJ0LnBvc2l0aW9uLnggLT0gcGFydC52ZWxvY2l0eS54O1xuICAgICAgICAgICAgICAgIHBhcnQucG9zaXRpb24ueSAtPSBwYXJ0LnZlbG9jaXR5Lnk7XG4gICAgICAgICAgICAgICAgcGFydC52ZWxvY2l0eS54ID0gMDtcbiAgICAgICAgICAgICAgICBwYXJ0LnZlbG9jaXR5LnkgPSAwO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZmlyc3QgPSBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XTtcbiAgICAgICAgICAgICAgICBpZihmaXJzdCA9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHBhcnQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbmZsaWN0ID0gY29uZmxpY3RzLmdldChmaXJzdCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFjb25mbGljdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25mbGljdCA9IG5ldyBTZXQoW2ZpcnN0XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZsaWN0cy5zZXQoZmlyc3QsIGNvbmZsaWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25mbGljdC5hZGQocGFydCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coY29uZmxpY3RzLnNpemUgKyAnIGNvbmZsaWN0cycpO1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIC8vc3luY2hyb25pemUgd29ybGQgcG9zaXRpb24gd2l0aCBtYXRyaXggcG9zaXRpb25cbiAgICAgICAgLy90aGlzLm1hdHJpeFN5bmMoc2ltX3N0YXRlKTtcbiAgICAgICAgXG5cbiAgICAgICAgcmV0dXJuIHNpbV9zdGF0ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1hdHJpeFN5bmMoc2ltX3N0YXRlIDogV29ybGQpe1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IFdvcmxkU2l6ZS55OyB5KyspIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgV29ybGRTaXplLng7IHgrKykge1xuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gc2ltX3N0YXRlLnBhcnRpY2xlc1t5XVt4XVxuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJ0KVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKChwYXJ0LnBvc2l0aW9uLnkpIDwgV29ybGRTaXplLnkgJiYgKHBhcnQucG9zaXRpb24ueCkgPCBXb3JsZFNpemUueCkgeyAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYoc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0LnBvc2l0aW9uID0gbmV3IFZlY3RvcjIoeCx5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1t5XVt4XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbV9zdGF0ZS5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdID0gcGFydDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5leHBvcnQgY29uc3QgUGh5c2ljcyA9IG5ldyBCYXNpY1BoeXNpY3MoKTsiLCJpbXBvcnQge1dvcmxkLFdvcmxkU2l6ZSx3b3JsZH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xuaW1wb3J0IHtjYW52YXMsY3R4fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3JlbmRlcmVyXCJcblxuaW50ZXJmYWNlIFJlbmRlcmVye1xuXG4gICAgZHJhd0ZyYW1lKHNpbV9zdGF0ZTogV29ybGQpIDogdm9pZDtcblxufVxuXG5jbGFzcyBDYW52YXNSZW5kZXJlciBpbXBsZW1lbnRzIFJlbmRlcmVye1xuXG4gICAgZHJhd0ZyYW1lKHNpbV9zdGF0ZTogV29ybGQpe1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzc3Nyc7XG4gICAgICAgIGN0eC5zdHJva2VSZWN0KDAsMCw0MDAsMzAwKTtcblxuICAgICAgICBmb3IobGV0IHBhcnQgb2Ygc2ltX3N0YXRlKXtcblxuICAgICAgICAgICAgaWYgKCFwYXJ0KVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuIFxuXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gcGFydC5jb2xvcjtcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdChwYXJ0LnBvc2l0aW9uLngscGFydC5wb3NpdGlvbi55LDEsMSk7IC8vZHJhdyByZWN0YW5nbGUgOlBcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxufVxuXG5leHBvcnQgY29uc3QgUmVuZGVyZXIgPSBuZXcgQ2FudmFzUmVuZGVyZXIoKTsiLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XG5pbXBvcnQge0RyYXdhYmxlfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL29iamVjdDJEXCI7XG5pbXBvcnQge1BhcnRpY2xlfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xuaW1wb3J0IHtSZW5kZXJlcn0gZnJvbSBcIi4vcmVuZGVyXCI7XG5pbXBvcnQge1BoeXNpY3N9IGZyb20gXCIuL3BoeXNpY3NcIjtcblxuZXhwb3J0IGNvbnN0IFdvcmxkU2l6ZSA9IG5ldyBWZWN0b3IyKDQwMCwzMDApO1xuXG5leHBvcnQgY2xhc3MgV29ybGR7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgQXJyYXkoV29ybGRTaXplLnkpO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGluZGV4KyspIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2luZGV4XSA9IG5ldyBBcnJheShXb3JsZFNpemUueCkuZmlsbCh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgW1N5bWJvbC5pdGVyYXRvcl0gPSAoKSA9PiB7ICAgICAgXG4gICAgICAgIGxldCBpID0gMDtcblxuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICBuZXh0OigpPT57XG4gICAgICAgICAgICAgICAgbGV0IGRvbmUgPSAoaSA+PSAoV29ybGRTaXplLnggKiBXb3JsZFNpemUueSkpO1xuICAgICAgICAgICAgICAgIGlmKGRvbmUpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2RvbmU6IHRydWV9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB5ID0gTWF0aC5mbG9vcihpL1dvcmxkU2l6ZS54KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHggPSBpIC0gTWF0aC5mbG9vcihpL1dvcmxkU2l6ZS54KSpXb3JsZFNpemUueDtcbiAgICAgICAgICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnBhcnRpY2xlc1t5XVt4XVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFydGljbGVzOkFycmF5PEFycmF5PFBhcnRpY2xlIHwgdW5kZWZpbmVkPj47XG4gICAgXG59XG5cbmV4cG9ydCB2YXIgd29ybGQgPSBuZXcgV29ybGQoKTtcblxuZXhwb3J0IGNsYXNzIFdvcmxkTWFuYWdlciBleHRlbmRzIERyYXdhYmxleyAgXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgfVxuXG4gICAgb25VcGRhdGUoKXsgICAgICBcbiAgICB9XG4gICAgXG4gICAgb25SZW5kZXIoKXtcbiAgICAgICAgc3VwZXIub25SZW5kZXIoKTtcblxuICAgICAgICBcbiAgICAgICAgaWYoIXRoaXMucGF1c2VkKVxuICAgICAgICAgICAgUGh5c2ljcy5zdGVwKHdvcmxkKTtcbiAgICAgICAgICAgIFxuICAgICAgICBSZW5kZXJlci5kcmF3RnJhbWUod29ybGQpO1xuICAgICAgICBkb2N1bWVudC50aXRsZSA9ICcnKygrK3RoaXMuZnJhbWUpO1xuICAgIH0gICAgXG5cblxuICAgIGFkZFBhcnQocGFydDogUGFydGljbGUpeyAgICAgICAgXG4gICAgICAgIHdvcmxkLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSBwYXJ0O1xuICAgIH1cblxuICAgIHBhdXNlZDpib29sZWFuO1xuICAgIGZyYW1lOm51bWJlcjtcbn1cblxuXG5cbi8vVE9ETzogTXVsdGl0aHJlYWRpbmcgaWYgaSBmYW5jeVxuLypcbnVzZSB0aGlzIHRvIHRlc3QgaWYgc3VwcG9ydGVkXG5cbmlmICh0eXBlb2YoV29ya2VyKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgLy9ncmVhdCwgeW91ciBicm93c2VyIHN1cHBvcnRzIHdlYiB3b3JrZXJzXG59IGVsc2Uge1xuICAgLy9ub3Qgc3VwcG9ydGVkXG59XG5cbiovIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCAqIGFzIENFIGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvY29yZVwiO1xuXG5pbXBvcnQge1NjZW5lfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3NjZW5lXCI7XG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XG5cbmltcG9ydCB7d29ybGQsIFdvcmxkTWFuYWdlcn0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xuXG5pbXBvcnQge0tleWJvYXJkSW5wdXQsIE1vdXNlSW5wdXR9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvaW5wdXRcIjtcblxuaW1wb3J0IHsgRmx1aWQsIFBvd2RlciwgU29saWQgfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xuaW1wb3J0IHsgQ3Vyc29yIH0gZnJvbSBcIi4vY3Vyc29yXCI7XG5pbXBvcnQgeyBQaHlzaWNzIH0gZnJvbSBcIi4vcGh5c2ljc1wiO1xuXG4vL2NyZWF0ZSBzY2VuZVxubGV0IGxldmVsID0gbmV3IFNjZW5lKCk7XG5sZXQgd29ybGRfbWFuYWdlciA9IG5ldyBXb3JsZE1hbmFnZXIoKTtcbmxldCBjdXJzb3IgPSBuZXcgQ3Vyc29yKCk7XG5cbndpbmRvdy5vbmxvYWQgPSAoKT0+e1xuICAgIC8vaW5pdCBlbmdpbmVcbiAgICBDRS5pbml0KCk7XG4gICAgLy9iaW5kIHNjZW5lXG4gICAgQ0Uuc2V0QWN0aXZlU2NlbmUobGV2ZWwpO1xuICAgIFxuICAgIGxldmVsLm1lbWJlcnMucHVzaCh3b3JsZF9tYW5hZ2VyKTtcbiAgICB3b3JsZF9tYW5hZ2VyLm9yaWdpbi5zY2FsZSA9IG5ldyBWZWN0b3IyKDIsMik7XG4gICAgXG4gICAgXG4gICAgLy9sZXZlbC5tZW1iZXJzLnB1c2goY3Vyc29yKTtcblxuXG5cbiAgICAvL3dvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgUG93ZGVyKG5ldyBWZWN0b3IyKDgwLDApKSk7ICBcblxuICAgIC8vRGVtbyB3b3JsZFxuICAgIGZvciAobGV0IHggPSA2MDsgeCA8IDE0MDsgeCsrKSB7ICAgICBcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxNTsgeSsrKSB7ICAgICBcbiAgICAgICAgICAgIC8vbWl4IHNvbWUgZmx1aWQgYW5kIHBvd2RlclxuICAgICAgICAgICAgaWYoeCp5ICUgMyA9PSAwKXsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBQb3dkZXIobmV3IFZlY3RvcjIoeCx5KSkpOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgXG4gICAgICAgICAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBGbHVpZChuZXcgVmVjdG9yMih4LHkrMjApKSk7IFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDA7IHgrKykgeyBcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4KzAseCs2MCkpKTsgICAgXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoeCswLHgrNjEpKSk7ICAgICAgXG4gICAgfVxuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDA7IHgrKykgeyBcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsyMDAseCs2MCkpKTsgICAgXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMjAwLHgrNjEpKSk7ICAgICAgXG4gICAgfVxuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCA1MDsgeCsrKSB7IFxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzEwMCx4KzE5MCkpKTsgICAgXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMTAwLHgrMTkxKSkpOyAgICAgIFxuICAgIH1cbiBcbn07XG5cbi8vcnVucyBldmVyeSB0aWNrIFxubGV2ZWwub25VcGRhdGUgPSAoKT0+e1xuICAgIFxuXG4gICAgaWYgKEtleWJvYXJkSW5wdXQuaXNKdXN0UHJlc3NlZChcIlNwYWNlXCIpKSB7XG4gICAgICAgIHdvcmxkX21hbmFnZXIucGF1c2VkID0gIXdvcmxkX21hbmFnZXIucGF1c2VkOyAgICAgICAgXG4gICAgfVxuXG4gICAgaWYgKEtleWJvYXJkSW5wdXQuaXNKdXN0UHJlc3NlZChcImZcIikpIHtcbiAgICAgICAgd29ybGRfbWFuYWdlci5wYXVzZWQgPSB0cnVlO1xuICAgICAgICBQaHlzaWNzLnN0ZXAod29ybGQpO1xuICAgIH0gICBcblx0XG59OyAiXSwic291cmNlUm9vdCI6IiJ9