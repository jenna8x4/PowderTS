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
        _this.color = "yellow";
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
        _this.color = "aqua";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2hhcGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL2N1cnNvci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvcGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BoeXNpY3MudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3JlbmRlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvd29ybGRfbWFuYWdlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtFQUNFO0FBQ0YsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDO0FBTzNCLHdDQUFjO0FBTmxCLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQztBQVF4Qix3Q0FBYztBQVBsQjtFQUNFO0FBQ0YsSUFBTSxHQUFHLEdBQUcsRUFB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QUFPLENBQUMsRUFBRTtRQUN0QyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztLQUNoRDtJQUVELElBQUkscUJBQWEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbEMsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDNUIsaUJBQU8sQ0FBQyxJQUFJLENBQUMscUJBQUssQ0FBQyxDQUFDO0tBQ3ZCO0FBRUwsQ0FBQyxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlF1ZXJyeSBzZWxlY3RvciBmb3IgdGhlIGNhbnZhcyBlbGVtZW50XG4qL1xuY29uc3QgY2FudmFzU2VsZWN0b3IgPSBcIiNnYW1lXCI7XG5jb25zdCByZXNpemVWaWV3cG9ydCA9IHRydWU7XG4vKipUYXJnZXQgZnJhbWVzIHBlciBzZWNvbmRcbiovXG5jb25zdCBmcHMgPSA2MDtcblxuZXhwb3J0IHtcbiAgICBjYW52YXNTZWxlY3RvciwgICAgXG4gICAgZnBzLFxuICAgIHJlc2l6ZVZpZXdwb3J0XG59IiwiLyoqXG4gKiAyRCBWZWN0b3JcbiAqIFN0b3JlcyBYIGFuZCBZXG4qL1xuZXhwb3J0IGNsYXNzIFZlY3RvcjIgIHtcbiAgICBjb25zdHJ1Y3RvcihYIDpudW1iZXIsWSA6bnVtYmVyKXtcbiAgICAgICAgdGhpcy54ID0gWDtcbiAgICAgICAgdGhpcy55ID0gWTtcbiAgICB9XG5cbiAgICBsZW5naHQoKXtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChcbiAgICAgICAgICAgIE1hdGgucG93KHRoaXMueCwyKSArIE1hdGgucG93KHRoaXMueSwyKVxuICAgICAgICAgICAgKVxuICAgIH1cblxuICAgIG5vcm1hbGl6ZWQoKXtcbiAgICAgICAgbGV0IG5ld1ZlY3RvciA9IG5ldyBWZWN0b3IyKHRoaXMueCx0aGlzLnkpO1xuICAgICAgICBsZXQgbGVuZ2h0ID0gbmV3VmVjdG9yLmxlbmdodCgpXG4gICAgICAgIG5ld1ZlY3Rvci54IC89IGxlbmdodDtcbiAgICAgICAgbmV3VmVjdG9yLnkgLz0gbGVuZ2h0O1xuXG4gICAgICAgIHJldHVybiBuZXdWZWN0b3I7XG4gICAgfVxuXG4gICAgeDpudW1iZXI7XG4gICAgeTpudW1iZXI7XG59XG5cbi8qKlxuICogU3RvcmVzIHBvc2l0aW9uIHJvdGF0aW9uIChkZWdyZWVzKSBhbmQgc2NhbGVcbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XG4gICAgY29uc3RydWN0b3IocG9zPyA6VmVjdG9yMiwgcm90PyA6bnVtYmVyLCBzY2FsZT8gOlZlY3RvcjIpe1xuICAgICAgICB0aGlzLnBvc2l0aW9uICAgPSBwb3MgPyBwb3MgICAgIDogbmV3IFZlY3RvcjIoMCwwKTtcbiAgICAgICAgdGhpcy5yb3RhdGlvbiAgID0gcm90ID8gcm90ICAgICA6IDA7XG4gICAgICAgIHRoaXMuc2NhbGUgICAgICA9IHNjYWxlID8gc2NhbGUgOiBuZXcgVmVjdG9yMigxLDEpO1xuICAgIH1cbiAgICBwb3NpdGlvbjogVmVjdG9yMjtcbiAgICByb3RhdGlvbjogbnVtYmVyO1xuICAgIHNjYWxlOiBWZWN0b3IyO1xufVxuIiwiaW1wb3J0ICogYXMgUmVuZGVyaW5nIGZyb20gXCIuL3JlbmRlcmVyXCI7XG5pbXBvcnQgKiBhcyBDb25maWcgZnJvbSBcIi4vLi4vZW5naW5lQ29uZmlnXCI7XG5pbXBvcnQge1NjZW5lfSBmcm9tIFwiLi9zY2VuZVwiO1xuaW1wb3J0IHtLZXlib2FyZElucHV0LCBNb3VzZUlucHV0fSBmcm9tIFwiLi8uLi9lbmdpbmUvaW5wdXRcIjtcblxuXG5leHBvcnQgdmFyIGFjdGl2ZVNjZW5lIDogU2NlbmUgfCB1bmRlZmluZWRcblxuLyoqXG4gKiBTZXQgdGhlIHNjZW5lIHlvdSB3YW50IHRvIGJlIGN1cnJlbnRseSBkaXNwbGF5ZWQgYW5kIHVwZGF0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEFjdGl2ZVNjZW5lKHNjZW5lIDpTY2VuZSl7XG4gICAgYWN0aXZlU2NlbmUgPSBzY2VuZTtcbn1cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgZW5naW5lXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgUmVuZGVyaW5nLmluaXQoKTtcbiAgICBLZXlib2FyZElucHV0LmluaXQoKTtcbiAgICBNb3VzZUlucHV0LmluaXQoKTtcblxuICAgIHNldEludGVydmFsKHVwZGF0ZSwxMDAwL0NvbmZpZy5mcHMpO1xufVxuLyoqXG4gKiBEb24ndCB1c2UgZXh0ZXJuYWx5LlxuICogQ2FsbHMgb25VcGRhdGUgYW5kIG9uUmVuZGVyIG1ldGhvZHNcbiAqL1xuZnVuY3Rpb24gdXBkYXRlKCl7XG4gICAgaWYoYWN0aXZlU2NlbmU/Lm9uVXBkYXRlKVxuICAgICAgICBhY3RpdmVTY2VuZS5vblVwZGF0ZSgpO1xuICAgIGFjdGl2ZVNjZW5lPy51cGRhdGUoKTtcblxuICAgIFJlbmRlcmluZy5yZW5kZXIoKTtcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vYmFzZV90eXBlc1wiO1xuaW1wb3J0IHsgY2FudmFzIH0gZnJvbSBcIi4vcmVuZGVyZXJcIjtcblxuLyoqXG4gKiBNb3N0IG9mIGtleXMgcHJlc2VudCBvbiB0aGUga2V5Ym9hcmQgYXMgYSBzdHJpbmcgdW5pb24uIFBsZWFzZSByZXBvcnQgYW55IG1pc3Npbmcga2V5cy5cbiAqL1xudHlwZSBLZXkgPSBcIlRhYlwiIHwgXCJBbHRcIiB8IFwiQWx0R3JhcGhcIiB8IFwiQmFja3NwYWNlXCIgfCBcIkNvbnRyb2xcIiB8XCJTaGlmdFwiIHwgXCJTcGFjZVwiIHwgXCJDb250ZXh0TWVudVwiIHwgXCJFbnRlclwiIHwgXCJOdW1Mb2NrXCIgfCBcIkhvbWVcIiB8IFwiUGFnZVVwXCIgfCBcIlBhZ2VEb3duXCIgfCBcIkluc2VydFwiIHwgXCJEZWxldGVcIiB8IFwiQXJyb3dVcFwiIHwgXCJBcnJvd0Rvd25cIiB8IFwiQXJyb3dSaWdodFwiIHwgXCJBcnJvd0xlZnRcIiB8XCIhXCIgfCBcIlxcXCJcInwgXCIjXCIgfCBcIiRcIiB8IFwiJVwiIHwgXCImXCIgfCBcIidcIiB8IFwiKFwiIHwgXCIpXCIgfCBcIipcIiB8IFwiK1wiIHwgXCIsXCIgfCBcIi1cIiB8IFwiLlwiIHwgXCIvXCIgfCBcIjBcIiB8IFwiMVwiIHwgXCIyXCIgfCBcIjNcIiB8IFwiNFwiIHwgXCI1XCIgfCBcIjZcIiB8IFwiN1wiIHwgXCI4XCIgfCBcIjlcIiB8IFwiOlwiIHwgXCI7XCIgfCBcIjxcIiB8IFwiPVwiIHwgXCI+XCIgfCBcIj9cIiB8IFwiQFwiIHwgXCJBXCIgfCBcIkJcIiB8IFwiQ1wiIHwgXCJEXCIgfCBcIkVcIiB8IFwiRlwiIHwgXCJHXCIgfCBcIkhcIiB8IFwiSVwiIHwgXCJKXCIgfCBcIktcIiB8IFwiTFwiIHwgXCJNXCIgfCBcIk5cIiB8IFwiT1wiIHwgXCJQXCIgfCBcIlFcIiB8IFwiUlwiIHwgXCJTXCIgfCBcIlRcIiB8IFwiVVwiIHwgXCJWXCIgfCBcIldcIiB8IFwiWFwiIHwgXCJZXCIgfCBcIlpcIiB8IFwiW1wiIHwgXCJcXFxcXCIgfCBcIl1cIiB8IFwiXlwiIHwgXCJfXCIgfCBcImBcIiB8IFwiYVwiIHwgXCJiXCIgfCBcImNcIiB8IFwiZFwiIHwgXCJlXCIgfCBcImZcIiB8IFwiZ1wiIHwgXCJoXCIgfCBcImlcIiB8IFwialwiIHwgXCJrXCIgfCBcImxcIiB8IFwibVwiIHwgXCJuXCIgfCBcIm9cIiB8IFwicFwiIHwgXCJxXCIgfCBcInJcIiB8IFwic1wiIHwgXCJ0XCIgfCBcInVcIiB8IFwidlwiIHwgXCJ3XCIgfCBcInhcIiB8IFwieVwiIHwgXCJ6XCIgfCBcIntcIiB8IFwifFwiIHwgXCJ9XCIgfCBcIn5cIiA7XG5cbnR5cGUgTW91c2VCdXR0b24gPSBcIkxNQlwiIHwgXCJTY3JvbGxCdXR0b25cIiB8IFwiUk1CXCI7IFxuXG5lbnVtIEtleVN0YXRle1xuICAgIFBSRVNTRUQsXG4gICAgSE9MRCxcbiAgICBSRUxFQVNFLFxufVxuXG5leHBvcnQgY2xhc3MgS2V5Ym9hcmRJbnB1dHtcbiAgICAvKipcbiAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJzIGZvciBrZXkgcHJlc3Nlcy5cbiAgICAgKiBBbGxyZWFkeSBjYWxsZWQgYnkgdGhlIGluaXQgZnVuY3Rpb24gZnJvbSBjb3JlLnRzXG4gICAgICovXG4gICAgc3RhdGljIGluaXQoKXtcbiAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMgPSBuZXcgTWFwPEtleSxLZXlTdGF0ZT4oKTtcblxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLChlKT0+eyAgIFxuICAgICAgICAgICAgaWYoS2V5Ym9hcmRJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcy5zZXQoS2V5Ym9hcmRJbnB1dC5zdHJpbmdUb0tleShlLmtleSksS2V5U3RhdGUuUFJFU1NFRCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLChlKT0+eyAgICBcbiAgICAgICAgICAgIGlmKEtleWJvYXJkSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgXG5cbiAgICAgICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzLnNldChLZXlib2FyZElucHV0LnN0cmluZ1RvS2V5KGUua2V5KSxLZXlTdGF0ZS5SRUxFQVNFKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgXG4gICAgLyoqXG4gICAgICogQ2hlY2sgZm9yIHByZXNzZWQga2V5XG4gICAgICovXG4gICAgc3RhdGljIGlzUHJlc3NlZChrZXk6IEtleSl7XG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMua2V5U3RhdGVzLmdldChrZXkpO1xuXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XG4gICAgICAgICAgICB0aGlzLmtleVN0YXRlcy5zZXQoa2V5LEtleVN0YXRlLkhPTEQpOyAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEoc3RhdGUgPT09IHVuZGVmaW5lZCB8fCBzdGF0ZSA9PSBLZXlTdGF0ZS5SRUxFQVNFKVxuICAgIH1cblxuICAgIHN0YXRpYyBpc0p1c3RQcmVzc2VkKGtleTogS2V5KXtcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5rZXlTdGF0ZXMuZ2V0KGtleSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRCkge1xuICAgICAgICAgICAgdGhpcy5rZXlTdGF0ZXMuc2V0KGtleSxLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEO1xuICAgICAgICAvL3JldHVybiBcbiAgICB9XG5cbiAgICBzdGF0aWMgcHJldmVudERlZmF1bHQgPSB0cnVlO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMga2V5U3RhdGVzOiBNYXA8S2V5LEtleVN0YXRlPjtcblxuICAgIHByaXZhdGUgc3RhdGljIHN0cmluZ1RvS2V5KGtleSA6c3RyaW5nKXsgICAgICAgIFxuICAgICAgICBsZXQgdmFsID0ga2V5LnJlcGxhY2UoXCJEZWFkXCIsXCJ+XCIpO1xuICAgICAgICB2YWwgPSB2YWwucmVwbGFjZShcIiBcIixcIlNwYWNlXCIpO1xuICAgICAgICBsZXQga2V5dHlwZSA9IHZhbCAgYXMgS2V5O1xuICAgICAgICByZXR1cm4ga2V5dHlwZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNb3VzZUlucHV0e1xuICAgIHN0YXRpYyBpbml0KCl7XG4gICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzID0gbmV3IE1hcDxNb3VzZUJ1dHRvbixLZXlTdGF0ZT4oKTtcbiAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlID0ge3g6MCx5OjAsejowfTtcblxuICAgICAgICBjYW52YXMub25tb3VzZW1vdmUgPSBlID0+IHsgICBcbiAgICAgICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgTW91c2VJbnB1dC5jdXJyZW50UG9zaXRpb24gPSBuZXcgVmVjdG9yMihlLngsIGUueSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcblxuICAgICAgICBjYW52YXMub253aGVlbCA9IGUgPT4geyAgICBcbiAgICAgICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlLnggKz0gZS5kZWx0YVg7XG4gICAgICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UueSArPSBlLmRlbHRhWTtcbiAgICAgICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZS56ICs9IGUuZGVsdGFaO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gZSA9PiB7XG4gICAgICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KSAgICBcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChNb3VzZUlucHV0Lm51bWJlclRvQnV0dG9uKGUuYnV0dG9uKSxLZXlTdGF0ZS5QUkVTU0VEKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbnZhcy5vbm1vdXNldXAgPSBlID0+IHtcbiAgICAgICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuc2V0KE1vdXNlSW5wdXQubnVtYmVyVG9CdXR0b24oZS5idXR0b24pLEtleVN0YXRlLlJFTEVBU0UpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgLy9wcmV2ZW50IGNvbnRleHQgbWVudVxuICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KVxuICAgICAgICB7XG4gICAgICAgICAgICBjYW52YXMub25jb250ZXh0bWVudSA9IGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRXaGVlbE9mZnNldCgpe1xuICAgICAgICBsZXQgb2Zmc2V0ID0gTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlO1xuICAgICAgICBsZXQgb3V0ID0ge3g6b2Zmc2V0LngsIHk6b2Zmc2V0LnksIHo6b2Zmc2V0Lnp9O1xuXG4gICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZSA9IHt4OjAseTowLHo6MH07XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG5cbiAgICBzdGF0aWMgaXNQcmVzc2VkKGJ1dHRvbjogTW91c2VCdXR0b24pe1xuICAgICAgICBsZXQgc3RhdGUgPSBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5nZXQoYnV0dG9uKTtcblxuICAgICAgICBpZiAoc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRCkge1xuICAgICAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuc2V0KGJ1dHRvbixLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhKHN0YXRlID09PSB1bmRlZmluZWQgfHwgc3RhdGUgPT0gS2V5U3RhdGUuUkVMRUFTRSlcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNKdXN0UHJlc3NlZChidXR0b246IE1vdXNlQnV0dG9uKXtcbiAgICAgICAgbGV0IHN0YXRlID0gTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuZ2V0KGJ1dHRvbik7XG4gICAgICAgIFxuICAgICAgICBpZiAoc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRCkge1xuICAgICAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuc2V0KGJ1dHRvbixLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEO1xuICAgICAgICAvL3JldHVybiBcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBudW1iZXJUb0J1dHRvbihudW1iZXIgOiBudW1iZXIgKSA6IE1vdXNlQnV0dG9ue1xuICAgICAgICBzd2l0Y2ggKG51bWJlcikge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkxNQlwiO1xuICAgICAgICAgICAgY2FzZSAxOiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJTY3JvbGxCdXR0b25cIjtcbiAgICAgICAgICAgIGNhc2UgMjogICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiUk1CXCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gXCJMTUJcIjsgLy90aGF0cyBub3QgZ29ubmEgaGFwcGVuXG4gICAgfVxuXG4gICAgc3RhdGljIHByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICBzdGF0aWMgY3VycmVudFBvc2l0aW9uOiBWZWN0b3IyO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnV0dG9uU3RhdGVzOiBNYXA8TW91c2VCdXR0b24sS2V5U3RhdGU+O1xuICAgIHByaXZhdGUgc3RhdGljIG1vdXNlV2hlZWxDaGFuZ2UgOiB7eDpudW1iZXIsIHk6bnVtYmVyLCB6Om51bWJlcn07XG59IiwiaW1wb3J0IHtWZWN0b3IyLFRyYW5zZm9ybX0gZnJvbSBcIi4vYmFzZV90eXBlc1wiO1xuaW1wb3J0IHtjdHh9IGZyb20gXCIuL3JlbmRlcmVyXCI7XG5cbi8qKlxuICogQmFzZSBmb3IgY2hpbGRyZW4gcG9seW1vcnBoaXNtXG4gKiBJbXBsZW1lbnQgdGhpcyBpbnRlcmZhY2Ugd2hlbiBjcmVhdGluZyBhIGNvbXBvbmVudCAvIGNoaWxkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdDJEIHtcbiAgICAvL0hhcHBlbnMgZXZlcnkgdGlja1xuICAgIG9uVXBkYXRlKCkgOnZvaWQ7IFxuICAgIC8vQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXG4gICAgb25SZW5kZXIoKSA6dm9pZDsgXG4gICAgYWZ0ZXJSZW5kZXIoKSA6dm9pZDsgXG5cbiAgICBvcmlnaW46IFRyYW5zZm9ybTsgICAgXG4gICAgY2hpbGRyZW46IEFycmF5PE9iamVjdDJEPjtcbn1cblxuLyoqXG4gKiBCYXNlIGZvciBjaGlsZHJlbiB0aGF0IHdhbnQgdG8gcmVuZGVyIHNvbWV0aGluZy5cbiAqIEV4dGVuZCB0aGlzIGNsYXNzIGZvciBjdHggYWNjZXNzIGFuZCBvcmlnaW4gdHJhbnNmb3JtIGhhbmRlbGluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIERyYXdhYmxlIGltcGxlbWVudHMgT2JqZWN0MkQge1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMub3JpZ2luID0gbmV3IFRyYW5zZm9ybSgpO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgICAgICB0aGlzLnVzZV9sb2NhbF9jb29yZGluYXRlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9yaWdpbl9pbl9jZW50ZXIgPSBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XG4gICAgICovXG4gICAgb25VcGRhdGUoKXtcbiAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxuICAgICAqIENhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxuICAgICAqL1xuICAgIG9uUmVuZGVyKCl7ICAgICAgICAgXG4gICAgICAgIHRoaXMuY3R4ID0gY3R4O1xuXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtKHRoaXMub3JpZ2luLnNjYWxlLngvMiksLSh0aGlzLm9yaWdpbi5zY2FsZS55LzIpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUodGhpcy5vcmlnaW4ucG9zaXRpb24ueCx0aGlzLm9yaWdpbi5wb3NpdGlvbi55KTtcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUodGhpcy5vcmlnaW4uc2NhbGUueC8yLHRoaXMub3JpZ2luLnNjYWxlLnkvMik7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICAgICB0aGlzLmN0eC5yb3RhdGUodGhpcy5vcmlnaW4ucm90YXRpb24gKiBNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLSh0aGlzLm9yaWdpbi5zY2FsZS54LzIpLC0odGhpcy5vcmlnaW4uc2NhbGUueS8yKSk7XG4gICAgICAgIH0gICAgXG4gICAgICAgIHRoaXMuY3R4LnNjYWxlKHRoaXMub3JpZ2luLnNjYWxlLngsdGhpcy5vcmlnaW4uc2NhbGUueSk7ICAgICAgXG5cbiAgICAgICAgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XG4gICAgICogQ2FsbGVkIGFmdGVyIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcbiAgICAgKi9cbiAgICBhZnRlclJlbmRlcigpeyAgICAgICAgXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBEcmF3YWJsZSAmJiAhY2hpbGQudXNlX2xvY2FsX2Nvb3JkaW5hdGVzKVxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnNjYWxlKDEvdGhpcy5vcmlnaW4uc2NhbGUueCwxL3RoaXMub3JpZ2luLnNjYWxlLnkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjaGlsZC5vblJlbmRlcigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIG9yaWdpbjogVHJhbnNmb3JtOyAgICBcbiAgICBjaGlsZHJlbjogQXJyYXk8T2JqZWN0MkQ+O1xuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIHVzZV9sb2NhbF9jb29yZGluYXRlczogYm9vbGVhbjtcbiAgICBvcmlnaW5faW5fY2VudGVyOiBib29sZWFuO1xufVxuIiwiaW1wb3J0ICogYXMgQ29uZmlnIGZyb20gXCIuLy4uL2VuZ2luZUNvbmZpZ1wiO1xuaW1wb3J0IHthY3RpdmVTY2VuZX0gZnJvbSBcIi4vY29yZVwiO1xuXG5leHBvcnQgdmFyIGN0eCA6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuZXhwb3J0IHZhciBjYW52YXMgOkhUTUxDYW52YXNFbGVtZW50O1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIGNhbnZhcyBjb250ZXh0LlxuICogQWxscmVhZHkgY2FsbGVkIGJ5IHRoZSBpbml0IGZ1bmN0aW9uIGZyb20gY29yZS50c1xuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpe1xuICAgIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoQ29uZmlnLmNhbnZhc1NlbGVjdG9yKSEgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xuXG59XG5cbi8qKlxuICogVXBkYXRlcyB2aWV3cG9ydCBzaXplLFxuICogY2FsbHMgYWxsIHRoZSBvblJlbmRlciBtZXRob2RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoKXsgIFxuICAgIGlmKENvbmZpZy5yZXNpemVWaWV3cG9ydCl7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH1cblxuICAgIGN0eC5jbGVhclJlY3QoMCwwLGNhbnZhcy53aWR0aCxjYW52YXMuaGVpZ2h0KTtcbiAgICBhY3RpdmVTY2VuZT8ucmVuZGVyKCk7XG59IiwiaW1wb3J0IHtEcmF3YWJsZSwgT2JqZWN0MkR9IGZyb20gXCIuL29iamVjdDJEXCJcbmltcG9ydCB7Y3R4LGNhbnZhc30gZnJvbSBcIi4vcmVuZGVyZXJcIjtcblxuLyoqXG4gKiBSb290IGZvciBhbGwgdGhlIGVsZW1lbnRzIGluc2lkZSB5b3VyIGxldmVsLlxuICogT2JqZWN0cyBub3QgYSBtZW1iZXIgb2YgdGhlIGFjdGl2ZSBzY2VuZSB3b250IGJlIGNhbGxlZCB2aWEgb25VcGRhdGUgYW5kIG9uUmVuZGVyLlxuICovXG5leHBvcnQgY2xhc3MgU2NlbmV7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5tZW1iZXJzID0gW107XG4gICAgfVxuXG4gICAgdXBkYXRlKCl7XG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKGNoaWxkPT57XG4gICAgICAgICAgICBjaGlsZC5vblVwZGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5vblVwZGF0ZSlcbiAgICAgICAgICAgIHRoaXMub25VcGRhdGUoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKGNoaWxkPT57XG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgY2hpbGQub25SZW5kZXIoKTtcbiAgICAgICAgICAgIGNoaWxkLmFmdGVyUmVuZGVyKCk7XG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICB9KTtcbiAgICB9ICAgXG5cbiAgICBvblVwZGF0ZTogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XG4gICAgbWVtYmVyczogQXJyYXk8T2JqZWN0MkQ+O1xufSIsImltcG9ydCB7RHJhd2FibGV9IGZyb20gXCIuL29iamVjdDJEXCI7XG5pbXBvcnQge1ZlY3RvcjIsVHJhbnNmb3JtfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XG5cbi8qKlxuICogRGVmaW5lcyBhIHNoZXBlJ3Mgb3V0bGluZVxuICovXG5leHBvcnQgY2xhc3MgT3V0bGluZSB7XG4gICAgY29uc3RydWN0b3Iod2lkdGg6IG51bWJlcixjb2xvcjogc3RyaW5nKXtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnRoaWNrbmVzcyA9IHdpZHRoO1xuICAgIH1cbiAgICB0aGlja25lc3M6IG51bWJlcjtcbiAgICBjb2xvcjogc3RyaW5nO1xufVxuXG4vKipcbiAqIFNvbGlkIGNvbG9yIGRyYXdhYmxlIGVsZW1lbnRcbiAqIFVzZSBmb3IgY3VzdG9tIHBvbHlnb24gc2hhcGVzLlxuICovXG5leHBvcnQgY2xhc3MgU2hhcGUgZXh0ZW5kcyBEcmF3YWJsZSB7XG4gICAgY29uc3RydWN0b3IodmVydGljaWVzOiBWZWN0b3IyW10sIGNvbG9yPzogc3RyaW5nLG91dGxpbmU/OiBPdXRsaW5lKXtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLnZlcnRpY2llcyA9IHZlcnRpY2llcztcblxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPyBjb2xvciA6IFwid2hpdGVcIjtcbiAgICAgICAgdGhpcy5vdXRsaW5lID0gb3V0bGluZSA/IG91dGxpbmUgOiBuZXcgT3V0bGluZSgwLCcjMDAwMCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxuICAgICAqIENhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxuICAgICAqL1xuICAgIG9uUmVuZGVyKCl7XG4gICAgICAgIHN1cGVyLm9uUmVuZGVyKCk7XG4gICAgICAgXG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLnZlcnRpY2llc1swXS54LHRoaXMudmVydGljaWVzWzBdLnkpO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnZlcnRpY2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gdGhpcy52ZXJ0aWNpZXNbaV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyh2ZXJ0ZXgueCx2ZXJ0ZXgueSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG5cbiAgICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICAgICB0aGlzLmN0eC5yZXNldFRyYW5zZm9ybSgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gdGhpcy5vdXRsaW5lLnRoaWNrbmVzcztcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLm91dGxpbmUuY29sb3I7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpOyAgICAgICAgXG5cbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuXG4gICAgICAgIFxuICAgIH1cblxuICAgIHZlcnRpY2llczogVmVjdG9yMltdO1xuICAgIG91dGxpbmU6IE91dGxpbmU7XG4gICAgY29sb3I6IHN0cmluZztcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XG5pbXBvcnQge1NoYXBlLE91dGxpbmV9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvc2hhcGVcIjtcbmltcG9ydCB7TW91c2VJbnB1dH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9pbnB1dFwiO1xuaW1wb3J0IHsgY3R4IH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9yZW5kZXJlclwiO1xuXG5leHBvcnQgY2xhc3MgQ3Vyc29yIGV4dGVuZHMgU2hhcGV7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgbGV0IGRlZmF1bHRTaGFwZSA9IFtcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDEwLDApLFxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMTAsMTApLFxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMCwxMCksXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigwLDApXG4gICAgICAgIF0gICAgICAgIFxuXG4gICAgICAgIHN1cGVyKGRlZmF1bHRTaGFwZSxcIiMwMDAwXCIsbmV3IE91dGxpbmUoMSwnd2hpdGUnKSk7XG5cbiAgICAgICAgdGhpcy5vcmlnaW5faW5fY2VudGVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wcmV2aW91c1Bvc2l0aW9uID0gbmV3IFZlY3RvcjIoMCwwKTtcbiAgICB9XG5cbiAgICBjaGFuZ2VSYWRpdXMocmFkaXVzIDogbnVtYmVyKXtcbiAgICAgICAgcmFkaXVzID0gTWF0aC5yb3VuZChyYWRpdXMpO1xuXG4gICAgfVxuXG4gICAgb25SZW5kZXIoKXsgICAgICAgICAgICAgICBcbiAgICAgICAgaWYoTW91c2VJbnB1dC5jdXJyZW50UG9zaXRpb24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IHRoaXMub3JpZ2luLnBvc2l0aW9uO1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4ucG9zaXRpb24gPSBNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsMCwxMCwxMCk7XG5cbiAgICAgICAgc3VwZXIub25SZW5kZXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByZXZpb3VzUG9zaXRpb246VmVjdG9yMjtcblxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcbmltcG9ydCB7IHdvcmxkLFdvcmxkU2l6ZSB9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIFBhcnRpY2xle1xuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yMigwLDApO1xuICAgICAgICB0aGlzLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgIH1cbiAgICBcbiAgICBkZWNpZGUoKXtcbiAgICB9XG4gICAgXG4gICAgc3RlcCgpe1xuICAgICAgICBpZih0aGlzLnZlbG9jaXR5ICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBjb25zdCBuZXdYID0gdGhpcy5wb3NpdGlvbi54ICsgdGhpcy52ZWxvY2l0eS54O1xuICAgICAgICAgICAgaWYoMCA8PSBuZXdYICYmIG5ld1ggPCBXb3JsZFNpemUueCl7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gbmV3WDtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdZID0gdGhpcy5wb3NpdGlvbi55ICsgdGhpcy52ZWxvY2l0eS55O1xuICAgICAgICAgICAgaWYoMCA8PSBuZXdZICYmIG5ld1kgPCBXb3JsZFNpemUueSl7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gbmV3WTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICBcbiAgICBwb3NpdGlvbjogVmVjdG9yMjsgXG4gICAgdmVsb2NpdHk6IFZlY3RvcjI7XG4gICAgY29sb3I6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUGFydGljbGV7ICAgIFxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xuICAgICAgICBzdXBlcihwb3NpdGlvbilcblxuICAgICAgICB0aGlzLndlaWdodCA9IDE7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yMigwLDApO1xuICAgIH1cblxuICAgIHRyeU1vdmUocmVsYXRpdmVQb3M6IFZlY3RvcjIpIDpib29sZWFue1xuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnkgPj0gV29ybGRTaXplLnkgfHwgdGhpcy5wb3NpdGlvbi54K3JlbGF0aXZlUG9zLnggPj0gV29ybGRTaXplLnggfHxcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55IDwgMCB8fCB0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueCA8IDAgKSBcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgIFxuXG4gICAgICAgIGxldCB0YXJnZXQgPSB3b3JsZC5wYXJ0aWNsZXNbdGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnldW3RoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54XTtcblxuICAgICAgICBpZiAodGFyZ2V0ICE9IHVuZGVmaW5lZCkgeyBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyeVN3YXAocmVsYXRpdmVQb3MpOztcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueCA9IHJlbGF0aXZlUG9zLng7IFxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS55ID0gcmVsYXRpdmVQb3MueTsgXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRyeVN3YXAocmVsYXRpdmVQb3M6IFZlY3RvcjIpIDpib29sZWFueyAgICAgICAgXG4gICAgICAgIGxldCB0YXJnZXQgPSB3b3JsZC5wYXJ0aWNsZXNbdGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnldW3RoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54XTtcblxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBNb3ZlYWJsZSAmJiB0YXJnZXQud2VpZ2h0IDwgdGhpcy53ZWlnaHQpXG4gICAgICAgIHsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvL1N3YXAhICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSB0YXJnZXQucG9zaXRpb24ueCAtIHRoaXMucG9zaXRpb24ueDtcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueSA9IHRhcmdldC5wb3NpdGlvbi55IC0gdGhpcy5wb3NpdGlvbi55O1xuICAgICAgICAgICAgLy90YXJnZXQudmVsb2NpdHkueCA9IC10aGlzLnZlbG9jaXR5Lng7XG4gICAgICAgICAgICAvL3RhcmdldC52ZWxvY2l0eS55ID0gLXRoaXMudmVsb2NpdHkueTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZlbG9jaXR5OiBWZWN0b3IyOyAgICBcbiAgICB3ZWlnaHQ6IG51bWJlcjtcblxufVxuXG4vLzQgQmFzZSBwYXJ0aWNsZSB0eXBlcyBTb2xpZCBQb3dkZXIgRmx1aWQgR2FzXG5cbmV4cG9ydCBjbGFzcyBTb2xpZCBleHRlbmRzIFBhcnRpY2xle1xuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xuICAgICAgICBzdXBlcihwb3NpdGlvbik7XG4gICAgICAgIHRoaXMuY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb3dkZXIgZXh0ZW5kcyBNb3ZlYWJsZXtcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcbiAgICAgICAgc3VwZXIocG9zaXRpb24pO1xuICAgICAgICB0aGlzLmNvbG9yID0gXCJ5ZWxsb3dcIjtcbiAgICAgICAgdGhpcy53ZWlnaHQgPSAyO1xuICAgIH1cblxuICAgIGRlY2lkZSgpe1xuICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigwLDEpKSkgeyBcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMSkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEZsdWlkIGV4dGVuZHMgTW92ZWFibGV7XG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XG4gICAgICAgIHN1cGVyKHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5jb2xvciA9IFwiYXF1YVwiO1xuICAgIH1cbiAgICBcbiAgICBkZWNpZGUoKXtcbiAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMCwxKSkpIHsgXG4gICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlU2lkZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVTaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBtb3ZlU2lkZSgpe1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwwKSkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDApKSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQge1dvcmxkLFdvcmxkU2l6ZX0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xuaW1wb3J0IHtQYXJ0aWNsZX0gZnJvbSBcIi4vcGFydGljbGVcIjtcblxuaW50ZXJmYWNlIFBoeXNpY3N7XG5cbiAgICBzdGVwKHNpbV9zdGF0ZTogV29ybGQpOldvcmxkO1xuXG59XG5cbmNsYXNzIEJhc2ljUGh5c2ljcyBpbXBsZW1lbnRzIFBoeXNpY3N7XG5cbiAgICBzdGVwKHNpbV9zdGF0ZTogV29ybGQpe1xuXG4gICAgICAgIGZvcihsZXQgcGFydCBvZiBzaW1fc3RhdGUpe1xuICAgICAgICAgICAgaWYoIXBhcnQpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIHBhcnQuZGVjaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFydHMgOkFycmF5PFBhcnRpY2xlPiA9IG5ldyBBcnJheSgpO1xuICAgICAgICBmb3IobGV0IHBhcnQgb2Ygc2ltX3N0YXRlKXtcbiAgICAgICAgICAgIGlmKCFwYXJ0KVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHBhcnQuc3RlcCgpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgcGFydHMucHVzaChwYXJ0KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgbGV0IGNvbmZsaWN0cyA6TWFwPFBhcnRpY2xlLCBTZXQ8UGFydGljbGU+PiA9IG5ldyBNYXAoKTtcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHBhcnRzKXtcblxuICAgICAgICAgICAgY29uc3QgZmlyc3QgPSBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XVxuICAgICAgICAgICAgaWYoZmlyc3QgPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHBhcnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBjb25mbGljdCA9IGNvbmZsaWN0cy5nZXQoZmlyc3QpO1xuICAgICAgICAgICAgICAgIGlmKCFjb25mbGljdCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZsaWN0ID0gbmV3IFNldChbZmlyc3RdKVxuICAgICAgICAgICAgICAgICAgICBjb25mbGljdHMuc2V0KGZpcnN0LCBjb25mbGljdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbmZsaWN0LmFkZChwYXJ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbmZsaWN0cy5zaXplICsgJyBjb25mbGljdHMnKTtcbiAgICAgICAgZm9yKGxldCBbZmlyc3QsIGNvbmZsaWN0XSBvZiBjb25mbGljdHMuZW50cmllcygpKXtcbiAgICAgICAgICAgIGNvbmZsaWN0cy5kZWxldGUoZmlyc3QpO1xuICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1tmaXJzdC5wb3NpdGlvbi55XVtmaXJzdC5wb3NpdGlvbi54XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGZvcihsZXQgcGFydCBvZiBjb25mbGljdCl7XG4gICAgICAgICAgICAgICAgcGFydC5wb3NpdGlvbi54IC09IHBhcnQudmVsb2NpdHkueDtcbiAgICAgICAgICAgICAgICBwYXJ0LnBvc2l0aW9uLnkgLT0gcGFydC52ZWxvY2l0eS55O1xuICAgICAgICAgICAgICAgIHBhcnQudmVsb2NpdHkueCA9IDA7XG4gICAgICAgICAgICAgICAgcGFydC52ZWxvY2l0eS55ID0gMDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0ID0gc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF07XG4gICAgICAgICAgICAgICAgaWYoZmlyc3QgPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSBwYXJ0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb25mbGljdCA9IGNvbmZsaWN0cy5nZXQoZmlyc3QpO1xuICAgICAgICAgICAgICAgICAgICBpZighY29uZmxpY3Qpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmxpY3QgPSBuZXcgU2V0KFtmaXJzdF0pXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25mbGljdHMuc2V0KGZpcnN0LCBjb25mbGljdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uZmxpY3QuYWRkKHBhcnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbmZsaWN0cy5zaXplICsgJyBjb25mbGljdHMnKTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICAvL3N5bmNocm9uaXplIHdvcmxkIHBvc2l0aW9uIHdpdGggbWF0cml4IHBvc2l0aW9uXG4gICAgICAgIC8vdGhpcy5tYXRyaXhTeW5jKHNpbV9zdGF0ZSk7XG4gICAgICAgIFxuXG4gICAgICAgIHJldHVybiBzaW1fc3RhdGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtYXRyaXhTeW5jKHNpbV9zdGF0ZSA6IFdvcmxkKXtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBXb3JsZFNpemUueTsgeSsrKSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFdvcmxkU2l6ZS54OyB4KyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFydCA9IHNpbV9zdGF0ZS5wYXJ0aWNsZXNbeV1beF1cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIGlmICghcGFydClcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICgocGFydC5wb3NpdGlvbi55KSA8IFdvcmxkU2l6ZS55ICYmIChwYXJ0LnBvc2l0aW9uLngpIDwgV29ybGRTaXplLngpIHsgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmKHNpbV9zdGF0ZS5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFydC5wb3NpdGlvbiA9IG5ldyBWZWN0b3IyKHgseSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbV9zdGF0ZS5wYXJ0aWNsZXNbeV1beF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHBhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IFBoeXNpY3MgPSBuZXcgQmFzaWNQaHlzaWNzKCk7IiwiaW1wb3J0IHtXb3JsZCxXb3JsZFNpemUsd29ybGR9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcbmltcG9ydCB7Y2FudmFzLGN0eH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9yZW5kZXJlclwiXG5cbmludGVyZmFjZSBSZW5kZXJlcntcblxuICAgIGRyYXdGcmFtZShzaW1fc3RhdGU6IFdvcmxkKSA6IHZvaWQ7XG5cbn1cblxuY2xhc3MgQ2FudmFzUmVuZGVyZXIgaW1wbGVtZW50cyBSZW5kZXJlcntcblxuICAgIGRyYXdGcmFtZShzaW1fc3RhdGU6IFdvcmxkKXtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyM3NzcnO1xuICAgICAgICBjdHguc3Ryb2tlUmVjdCgwLDAsNDAwLDMwMCk7XG5cbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHNpbV9zdGF0ZSl7XG5cbiAgICAgICAgICAgIGlmICghcGFydClcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiBcblxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHBhcnQuY29sb3I7XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QocGFydC5wb3NpdGlvbi54LHBhcnQucG9zaXRpb24ueSwxLDEpOyAvL2RyYXcgcmVjdGFuZ2xlIDpQXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IFJlbmRlcmVyID0gbmV3IENhbnZhc1JlbmRlcmVyKCk7IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xuaW1wb3J0IHtEcmF3YWJsZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9vYmplY3QyRFwiO1xuaW1wb3J0IHtQYXJ0aWNsZX0gZnJvbSBcIi4vcGFydGljbGVcIjtcbmltcG9ydCB7UmVuZGVyZXJ9IGZyb20gXCIuL3JlbmRlclwiO1xuaW1wb3J0IHtQaHlzaWNzfSBmcm9tIFwiLi9waHlzaWNzXCI7XG5cbmV4cG9ydCBjb25zdCBXb3JsZFNpemUgPSBuZXcgVmVjdG9yMig0MDAsMzAwKTtcblxuZXhwb3J0IGNsYXNzIFdvcmxke1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3IEFycmF5KFdvcmxkU2l6ZS55KTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpbmRleCsrKSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlc1tpbmRleF0gPSBuZXcgQXJyYXkoV29ybGRTaXplLngpLmZpbGwodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFtTeW1ib2wuaXRlcmF0b3JdID0gKCkgPT4geyAgICAgIFxuICAgICAgICBsZXQgaSA9IDA7XG5cbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgbmV4dDooKT0+e1xuICAgICAgICAgICAgICAgIGxldCBkb25lID0gKGkgPj0gKFdvcmxkU2l6ZS54ICogV29ybGRTaXplLnkpKTtcbiAgICAgICAgICAgICAgICBpZihkb25lKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtkb25lOiB0cnVlfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgeSA9IE1hdGguZmxvb3IoaS9Xb3JsZFNpemUueCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB4ID0gaSAtIE1hdGguZmxvb3IoaS9Xb3JsZFNpemUueCkqV29ybGRTaXplLng7XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5wYXJ0aWNsZXNbeV1beF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhcnRpY2xlczpBcnJheTxBcnJheTxQYXJ0aWNsZSB8IHVuZGVmaW5lZD4+O1xuICAgIFxufVxuXG5leHBvcnQgdmFyIHdvcmxkID0gbmV3IFdvcmxkKCk7XG5cbmV4cG9ydCBjbGFzcyBXb3JsZE1hbmFnZXIgZXh0ZW5kcyBEcmF3YWJsZXsgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgIH1cblxuICAgIG9uVXBkYXRlKCl7ICAgICAgXG4gICAgfVxuICAgIFxuICAgIG9uUmVuZGVyKCl7XG4gICAgICAgIHN1cGVyLm9uUmVuZGVyKCk7XG5cbiAgICAgICAgXG4gICAgICAgIGlmKCF0aGlzLnBhdXNlZClcbiAgICAgICAgICAgIFBoeXNpY3Muc3RlcCh3b3JsZCk7XG4gICAgICAgICAgICBcbiAgICAgICAgUmVuZGVyZXIuZHJhd0ZyYW1lKHdvcmxkKTtcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSAnJysoKyt0aGlzLmZyYW1lKTtcbiAgICB9ICAgIFxuXG5cbiAgICBhZGRQYXJ0KHBhcnQ6IFBhcnRpY2xlKXsgICAgICAgIFxuICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdID0gcGFydDtcbiAgICB9XG5cbiAgICBwYXVzZWQ6Ym9vbGVhbjtcbiAgICBmcmFtZTpudW1iZXI7XG59XG5cblxuXG4vL1RPRE86IE11bHRpdGhyZWFkaW5nIGlmIGkgZmFuY3lcbi8qXG51c2UgdGhpcyB0byB0ZXN0IGlmIHN1cHBvcnRlZFxuXG5pZiAodHlwZW9mKFdvcmtlcikgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgIC8vZ3JlYXQsIHlvdXIgYnJvd3NlciBzdXBwb3J0cyB3ZWIgd29ya2Vyc1xufSBlbHNlIHtcbiAgIC8vbm90IHN1cHBvcnRlZFxufVxuXG4qLyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgKiBhcyBDRSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2NvcmVcIjtcblxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zY2VuZVwiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xuXG5pbXBvcnQge3dvcmxkLCBXb3JsZE1hbmFnZXJ9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcblxuaW1wb3J0IHtLZXlib2FyZElucHV0LCBNb3VzZUlucHV0fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2lucHV0XCI7XG5cbmltcG9ydCB7IEZsdWlkLCBQb3dkZXIsIFNvbGlkIH0gZnJvbSBcIi4vcGFydGljbGVcIjtcbmltcG9ydCB7IEN1cnNvciB9IGZyb20gXCIuL2N1cnNvclwiO1xuaW1wb3J0IHsgUGh5c2ljcyB9IGZyb20gXCIuL3BoeXNpY3NcIjtcblxuLy9jcmVhdGUgc2NlbmVcbmxldCBsZXZlbCA9IG5ldyBTY2VuZSgpO1xubGV0IHdvcmxkX21hbmFnZXIgPSBuZXcgV29ybGRNYW5hZ2VyKCk7XG5sZXQgY3Vyc29yID0gbmV3IEN1cnNvcigpO1xuXG53aW5kb3cub25sb2FkID0gKCk9PntcbiAgICAvL2luaXQgZW5naW5lXG4gICAgQ0UuaW5pdCgpO1xuICAgIC8vYmluZCBzY2VuZVxuICAgIENFLnNldEFjdGl2ZVNjZW5lKGxldmVsKTtcbiAgICBcbiAgICBsZXZlbC5tZW1iZXJzLnB1c2god29ybGRfbWFuYWdlcik7XG4gICAgd29ybGRfbWFuYWdlci5vcmlnaW4uc2NhbGUgPSBuZXcgVmVjdG9yMigyLDIpO1xuICAgIFxuICAgIFxuICAgIC8vbGV2ZWwubWVtYmVycy5wdXNoKGN1cnNvcik7XG5cblxuXG4gICAgLy93b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFBvd2RlcihuZXcgVmVjdG9yMig4MCwwKSkpOyAgXG5cbiAgICAvL0RlbW8gd29ybGRcbiAgICBmb3IgKGxldCB4ID0gNjA7IHggPCAxNDA7IHgrKykgeyAgICAgXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgODsgeSsrKSB7ICAgICBcbiAgICAgICAgICAgIC8vbWl4IHNvbWUgZmx1aWQgYW5kIHBvd2RlclxuICAgICAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBQb3dkZXIobmV3IFZlY3RvcjIoeCx5KSkpOyBcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCB4ID0gNjA7IHggPCAxNDA7IHgrKykgeyAgICAgXG4gICAgICAgIGZvciAobGV0IHkgPSAxNTsgeSA8IDIyOyB5KyspIHsgICAgIFxuICAgICAgICAgICAgLy9taXggc29tZSBmbHVpZCBhbmQgcG93ZGVyXG4gICAgICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IEZsdWlkKG5ldyBWZWN0b3IyKHgseSkpKTsgXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwMDsgeCsrKSB7IFxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKHgrMCx4KzYwKSkpOyAgICBcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4KzAseCs2MSkpKTsgICAgICBcbiAgICB9XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwMDsgeCsrKSB7IFxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzIyMCx4KzYwKSkpOyAgICBcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsyMjAseCs2MSkpKTsgICAgICBcbiAgICB9XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDUwOyB4KyspIHsgXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrOTgseCsxOTApKSk7ICAgIFxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14Kzk4LHgrMTkxKSkpOyAgICAgIFxuICAgIH1cblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTA7IHgrKykgeyBcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4Kzk4LDE5MCkpKTsgICAgXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoeCs5OCwxOTEpKSk7ICAgICAgXG4gICAgfVxuIFxufTtcblxuLy9ydW5zIGV2ZXJ5IHRpY2sgXG5sZXZlbC5vblVwZGF0ZSA9ICgpPT57XG4gICAgXG5cbiAgICBpZiAoS2V5Ym9hcmRJbnB1dC5pc0p1c3RQcmVzc2VkKFwiU3BhY2VcIikpIHtcbiAgICAgICAgd29ybGRfbWFuYWdlci5wYXVzZWQgPSAhd29ybGRfbWFuYWdlci5wYXVzZWQ7ICAgICAgICBcbiAgICB9XG5cbiAgICBpZiAoS2V5Ym9hcmRJbnB1dC5pc0p1c3RQcmVzc2VkKFwiZlwiKSkge1xuICAgICAgICB3b3JsZF9tYW5hZ2VyLnBhdXNlZCA9IHRydWU7XG4gICAgICAgIFBoeXNpY3Muc3RlcCh3b3JsZCk7XG4gICAgfSAgIFxuXHRcbn07ICJdLCJzb3VyY2VSb290IjoiIn0=