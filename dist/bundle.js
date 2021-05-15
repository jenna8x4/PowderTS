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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyboardInput = void 0;
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
            KeyboardInput.keyStates.set(KeyboardInput.stringToKey(e.key), KeyState.PRESSED);
        });
        addEventListener("keyup", function (e) {
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
    return KeyboardInput;
}());
exports.KeyboardInput = KeyboardInput;


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
exports.render = exports.init = exports.ctx = void 0;
var Config = __webpack_require__(/*! ./../engineConfig */ "./src/engineConfig.ts");
var core_1 = __webpack_require__(/*! ./core */ "./src/engine/core.ts");
var canvas;
/**
 * Creates the canvas context.
 * Allready called by the init function from core.ts
 */
function init() {
    canvas = document.querySelector(Config.canvasSelector);
    exports.ctx = canvas.getContext('2d');
}
exports.init = init;
/**
 * Updates viewport size,
 * calls all the onRender methods
 */
function render() {
    if (Config.resizeViewport) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    exports.ctx.clearRect(0, 0, canvas.width, canvas.height);
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
exports.Powder = exports.Solid = exports.Particle = void 0;
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var Particle = /** @class */ (function () {
    function Particle(position) {
        this.weight = 1;
        this.position = position;
        this.velocity = new base_types_1.Vector2(0, 0);
        this.color = "white";
    }
    Particle.prototype.step = function () {
        return true;
    };
    ;
    Particle.prototype.tryMove = function (relativePos) {
        if (this.position.y + relativePos.y >= world_manager_1.WorldSize.y || this.position.x + relativePos.x >= world_manager_1.WorldSize.x ||
            this.position.y + relativePos.y < 0 || this.position.x + relativePos.x < 0)
            return false;
        var target = world_manager_1.world.particles[this.position.y + relativePos.y][this.position.x + relativePos.x];
        if (target != undefined) {
            return false;
        }
        else {
            this.position.x += relativePos.x;
            this.position.y += relativePos.y;
            return true;
        }
    };
    return Particle;
}());
exports.Particle = Particle;
//4 Base particle types Solid Powder Fluid Gas
var Solid = /** @class */ (function (_super) {
    __extends(Solid, _super);
    function Solid(position) {
        var _this = _super.call(this, position) || this;
        _this.color = "gray";
        return _this;
    }
    Solid.prototype.step = function () {
        this.velocity = new base_types_1.Vector2(0, 0);
        return true;
    };
    return Solid;
}(Particle));
exports.Solid = Solid;
var Powder = /** @class */ (function (_super) {
    __extends(Powder, _super);
    function Powder(position) {
        var _this = _super.call(this, position) || this;
        _this.color = "yellow";
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
}(Particle));
exports.Powder = Powder;


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
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var CanvasRenderer = /** @class */ (function () {
    function CanvasRenderer() {
    }
    CanvasRenderer.prototype.drawFrame = function (sim_state) {
        var e_1, _a;
        world_manager_1.ctx.strokeStyle = '#777';
        world_manager_1.ctx.strokeRect(0, 0, 400, 300);
        try {
            for (var sim_state_1 = __values(sim_state), sim_state_1_1 = sim_state_1.next(); !sim_state_1_1.done; sim_state_1_1 = sim_state_1.next()) {
                var part = sim_state_1_1.value;
                if (!part)
                    continue;
                world_manager_1.ctx.fillStyle = part.color;
                world_manager_1.ctx.fillRect(part.position.x, part.position.y, 1, 1); //draw rectangle :P
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
exports.WorldManager = exports.world = exports.World = exports.ctx = exports.WorldSize = void 0;
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
        exports.ctx = this.ctx;
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
var physics_1 = __webpack_require__(/*! ./physics */ "../game/physics.ts");
//create scene
var level = new scene_1.Scene();
var world_manager = new world_manager_1.WorldManager();
window.onload = function () {
    //init engine
    CE.init();
    //bind scene
    CE.setActiveScene(level);
    level.members.push(world_manager);
    world_manager.origin.scale = new base_types_1.Vector2(2, 2);
    //world_manager.addPart(new Powder(new Vector2(80,0)));  
    for (var x = 60; x < 140; x++) {
        for (var y = 0; y < 15; y++) {
            world_manager.addPart(new particle_1.Powder(new base_types_1.Vector2(x, y)));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BhcnRpY2xlLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9waHlzaWNzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9yZW5kZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3dvcmxkX21hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7RUFDRTtBQUNGLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQztBQU8zQix3Q0FBYztBQU5sQixJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFRekIsd0NBQWM7QUFQbEI7RUFDRTtBQUNGLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUlYLGtCQUFHOzs7Ozs7Ozs7Ozs7OztBQ1ZQOzs7RUFHRTtBQUNGO0lBQ0ksaUJBQVksQ0FBUyxFQUFDLENBQVM7UUFDM0IsSUFBSSxDQUFDLENB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RyxFQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQUFLLENBQUMsSUFBSSxvQkFBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9EO0FBRUwsQ0FBQyxDQUFDO0FBRUYsa0JBQWtCO0FBQ2xCLEtBQUssQ0FBQyxRQUFRLEdBQUc7SUFDYixJQUFJLHFCQUFhLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3RDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0tBQ2hEO0lBRUQsSUFBSSxxQkFBYSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNsQyxhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUM1QixpQkFBTyxDQUFDLElBQUksQ0FBQyxxQkFBSyxDQUFDLENBQUM7S0FDdkI7QUFFTCxDQUFDLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqUXVlcnJ5IHNlbGVjdG9yIGZvciB0aGUgY2FudmFzIGVsZW1lbnRcclxuKi9cclxuY29uc3QgY2FudmFzU2VsZWN0b3IgPSBcIiNnYW1lXCI7XHJcbmNvbnN0IHJlc2l6ZVZpZXdwb3J0ID0gZmFsc2U7XHJcbi8qKlRhcmdldCBmcmFtZXMgcGVyIHNlY29uZFxyXG4qL1xyXG5jb25zdCBmcHMgPSA2MDtcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBjYW52YXNTZWxlY3RvciwgICAgXHJcbiAgICBmcHMsXHJcbiAgICByZXNpemVWaWV3cG9ydFxyXG59IiwiLyoqXHJcbiAqIDJEIFZlY3RvclxyXG4gKiBTdG9yZXMgWCBhbmQgWVxyXG4qL1xyXG5leHBvcnQgY2xhc3MgVmVjdG9yMiAge1xyXG4gICAgY29uc3RydWN0b3IoWCA6bnVtYmVyLFkgOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy54ID0gWDtcclxuICAgICAgICB0aGlzLnkgPSBZO1xyXG4gICAgfVxyXG5cclxuICAgIGxlbmdodCgpe1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoXHJcbiAgICAgICAgICAgIE1hdGgucG93KHRoaXMueCwyKSArIE1hdGgucG93KHRoaXMueSwyKVxyXG4gICAgICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgbm9ybWFsaXplZCgpe1xyXG4gICAgICAgIGxldCBuZXdWZWN0b3IgPSBuZXcgVmVjdG9yMih0aGlzLngsdGhpcy55KTtcclxuICAgICAgICBsZXQgbGVuZ2h0ID0gbmV3VmVjdG9yLmxlbmdodCgpXHJcbiAgICAgICAgbmV3VmVjdG9yLnggLz0gbGVuZ2h0O1xyXG4gICAgICAgIG5ld1ZlY3Rvci55IC89IGxlbmdodDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1ZlY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICB4Om51bWJlcjtcclxuICAgIHk6bnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogU3RvcmVzIHBvc2l0aW9uIHJvdGF0aW9uIChkZWdyZWVzKSBhbmQgc2NhbGVcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xyXG4gICAgY29uc3RydWN0b3IocG9zPyA6VmVjdG9yMiwgcm90PyA6bnVtYmVyLCBzY2FsZT8gOlZlY3RvcjIpe1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gICA9IHBvcyA/IHBvcyAgICAgOiBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gICA9IHJvdCA/IHJvdCAgICAgOiAwO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgICAgICA9IHNjYWxlID8gc2NhbGUgOiBuZXcgVmVjdG9yMigxLDEpO1xyXG4gICAgfVxyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7XHJcbiAgICByb3RhdGlvbjogbnVtYmVyO1xyXG4gICAgc2NhbGU6IFZlY3RvcjI7XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVuZGVyaW5nIGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcbmltcG9ydCAqIGFzIENvbmZpZyBmcm9tIFwiLi8uLi9lbmdpbmVDb25maWdcIjtcclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4vc2NlbmVcIjtcclxuaW1wb3J0IHtLZXlib2FyZElucHV0fSBmcm9tIFwiLi8uLi9lbmdpbmUvaW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgdmFyIGFjdGl2ZVNjZW5lIDogU2NlbmUgfCB1bmRlZmluZWRcclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHNjZW5lIHlvdSB3YW50IHRvIGJlIGN1cnJlbnRseSBkaXNwbGF5ZWQgYW5kIHVwZGF0ZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3RpdmVTY2VuZShzY2VuZSA6U2NlbmUpe1xyXG4gICAgYWN0aXZlU2NlbmUgPSBzY2VuZTtcclxufVxyXG4vKipcclxuICogSW5pdGlhbGl6ZSB0aGUgZW5naW5lXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgUmVuZGVyaW5nLmluaXQoKTtcclxuICAgIEtleWJvYXJkSW5wdXQuaW5pdCgpO1xyXG5cclxuICAgIHNldEludGVydmFsKHVwZGF0ZSwxMDAwL0NvbmZpZy5mcHMpO1xyXG59XHJcbi8qKlxyXG4gKiBEb24ndCB1c2UgZXh0ZXJuYWx5LlxyXG4gKiBDYWxscyBvblVwZGF0ZSBhbmQgb25SZW5kZXIgbWV0aG9kc1xyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlKCl7XHJcbiAgICBpZihhY3RpdmVTY2VuZT8ub25VcGRhdGUpXHJcbiAgICAgICAgYWN0aXZlU2NlbmUub25VcGRhdGUoKTtcclxuICAgIGFjdGl2ZVNjZW5lPy51cGRhdGUoKTtcclxuXHJcbiAgICBSZW5kZXJpbmcucmVuZGVyKCk7XHJcbn0iLCIvKipcclxuICogTW9zdCBvZiBrZXlzIHByZXNlbnQgb24gdGhlIGtleWJvYXJkIGFzIGEgc3RyaW5nIHVuaW9uLiBQbGVhc2UgcmVwb3J0IGFueSBtaXNzaW5nIGtleXMuXHJcbiAqL1xyXG50eXBlIEtleSA9IFwiVGFiXCIgfCBcIkFsdFwiIHwgXCJBbHRHcmFwaFwiIHwgXCJCYWNrc3BhY2VcIiB8IFwiQ29udHJvbFwiIHxcIlNoaWZ0XCIgfCBcIlNwYWNlXCIgfCBcIkNvbnRleHRNZW51XCIgfCBcIkVudGVyXCIgfCBcIk51bUxvY2tcIiB8IFwiSG9tZVwiIHwgXCJQYWdlVXBcIiB8IFwiUGFnZURvd25cIiB8IFwiSW5zZXJ0XCIgfCBcIkRlbGV0ZVwiIHwgXCJBcnJvd1VwXCIgfCBcIkFycm93RG93blwiIHwgXCJBcnJvd1JpZ2h0XCIgfCBcIkFycm93TGVmdFwiIHxcIiFcIiB8IFwiXFxcIlwifCBcIiNcIiB8IFwiJFwiIHwgXCIlXCIgfCBcIiZcIiB8IFwiJ1wiIHwgXCIoXCIgfCBcIilcIiB8IFwiKlwiIHwgXCIrXCIgfCBcIixcIiB8IFwiLVwiIHwgXCIuXCIgfCBcIi9cIiB8IFwiMFwiIHwgXCIxXCIgfCBcIjJcIiB8IFwiM1wiIHwgXCI0XCIgfCBcIjVcIiB8IFwiNlwiIHwgXCI3XCIgfCBcIjhcIiB8IFwiOVwiIHwgXCI6XCIgfCBcIjtcIiB8IFwiPFwiIHwgXCI9XCIgfCBcIj5cIiB8IFwiP1wiIHwgXCJAXCIgfCBcIkFcIiB8IFwiQlwiIHwgXCJDXCIgfCBcIkRcIiB8IFwiRVwiIHwgXCJGXCIgfCBcIkdcIiB8IFwiSFwiIHwgXCJJXCIgfCBcIkpcIiB8IFwiS1wiIHwgXCJMXCIgfCBcIk1cIiB8IFwiTlwiIHwgXCJPXCIgfCBcIlBcIiB8IFwiUVwiIHwgXCJSXCIgfCBcIlNcIiB8IFwiVFwiIHwgXCJVXCIgfCBcIlZcIiB8IFwiV1wiIHwgXCJYXCIgfCBcIllcIiB8IFwiWlwiIHwgXCJbXCIgfCBcIlxcXFxcIiB8IFwiXVwiIHwgXCJeXCIgfCBcIl9cIiB8IFwiYFwiIHwgXCJhXCIgfCBcImJcIiB8IFwiY1wiIHwgXCJkXCIgfCBcImVcIiB8IFwiZlwiIHwgXCJnXCIgfCBcImhcIiB8IFwiaVwiIHwgXCJqXCIgfCBcImtcIiB8IFwibFwiIHwgXCJtXCIgfCBcIm5cIiB8IFwib1wiIHwgXCJwXCIgfCBcInFcIiB8IFwiclwiIHwgXCJzXCIgfCBcInRcIiB8IFwidVwiIHwgXCJ2XCIgfCBcIndcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInpcIiB8IFwie1wiIHwgXCJ8XCIgfCBcIn1cIiB8IFwiflwiIDtcclxuXHJcbmVudW0gS2V5U3RhdGV7XHJcbiAgICBQUkVTU0VELFxyXG4gICAgSE9MRCxcclxuICAgIFJFTEVBU0UsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBLZXlib2FyZElucHV0e1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJzIGZvciBrZXkgcHJlc3Nlcy5cclxuICAgICAqIEFsbHJlYWR5IGNhbGxlZCBieSB0aGUgaW5pdCBmdW5jdGlvbiBmcm9tIGNvcmUudHNcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcyA9IG5ldyBNYXA8S2V5LEtleVN0YXRlPigpO1xyXG5cclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLChlKT0+eyAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcy5zZXQoS2V5Ym9hcmRJbnB1dC5zdHJpbmdUb0tleShlLmtleSksS2V5U3RhdGUuUFJFU1NFRCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLChlKT0+e1xyXG4gICAgICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcy5zZXQoS2V5Ym9hcmRJbnB1dC5zdHJpbmdUb0tleShlLmtleSksS2V5U3RhdGUuUkVMRUFTRSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGZvciBwcmVzc2VkIGtleVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaXNQcmVzc2VkKGtleTogS2V5KXtcclxuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmtleVN0YXRlcy5nZXQoa2V5KTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlTdGF0ZXMuc2V0KGtleSxLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAhKHN0YXRlID09PSB1bmRlZmluZWQgfHwgc3RhdGUgPT0gS2V5U3RhdGUuUkVMRUFTRSlcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNKdXN0UHJlc3NlZChrZXk6IEtleSl7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5rZXlTdGF0ZXMuZ2V0KGtleSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlTdGF0ZXMuc2V0KGtleSxLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEO1xyXG4gICAgICAgIC8vcmV0dXJuIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGtleVN0YXRlczogTWFwPEtleSxLZXlTdGF0ZT47XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc3RyaW5nVG9LZXkoa2V5IDpzdHJpbmcpeyAgICAgICAgXHJcbiAgICAgICAgbGV0IHZhbCA9IGtleS5yZXBsYWNlKFwiRGVhZFwiLFwiflwiKTtcclxuICAgICAgICB2YWwgPSB2YWwucmVwbGFjZShcIiBcIixcIlNwYWNlXCIpO1xyXG4gICAgICAgIGxldCBrZXl0eXBlID0gdmFsICBhcyBLZXk7XHJcbiAgICAgICAgcmV0dXJuIGtleXR5cGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge1ZlY3RvcjIsVHJhbnNmb3JtfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7Y3R4fSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5cclxuLyoqXHJcbiAqIEJhc2UgZm9yIGNoaWxkcmVuIHBvbHltb3JwaGlzbVxyXG4gKiBJbXBsZW1lbnQgdGhpcyBpbnRlcmZhY2Ugd2hlbiBjcmVhdGluZyBhIGNvbXBvbmVudCAvIGNoaWxkLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBPYmplY3QyRCB7XHJcbiAgICAvL0hhcHBlbnMgZXZlcnkgdGlja1xyXG4gICAgb25VcGRhdGUoKSA6dm9pZDsgXHJcbiAgICAvL0NhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgb25SZW5kZXIoKSA6dm9pZDsgXHJcbiAgICBhZnRlclJlbmRlcigpIDp2b2lkOyBcclxuXHJcbiAgICBvcmlnaW46IFRyYW5zZm9ybTsgICAgXHJcbiAgICBjaGlsZHJlbjogQXJyYXk8T2JqZWN0MkQ+O1xyXG59XHJcblxyXG4vKipcclxuICogQmFzZSBmb3IgY2hpbGRyZW4gdGhhdCB3YW50IHRvIHJlbmRlciBzb21ldGhpbmcuXHJcbiAqIEV4dGVuZCB0aGlzIGNsYXNzIGZvciBjdHggYWNjZXNzIGFuZCBvcmlnaW4gdHJhbnNmb3JtIGhhbmRlbGluZy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBEcmF3YWJsZSBpbXBsZW1lbnRzIE9iamVjdDJEIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSBuZXcgVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMuY3R4ID0gY3R4O1xyXG4gICAgICAgIHRoaXMudXNlX2xvY2FsX2Nvb3JkaW5hdGVzID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5faW5fY2VudGVyID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICovXHJcbiAgICBvblVwZGF0ZSgpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICogQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXHJcbiAgICAgKi9cclxuICAgIG9uUmVuZGVyKCl7ICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jdHggPSBjdHg7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKC0odGhpcy5vcmlnaW4uc2NhbGUueC8yKSwtKHRoaXMub3JpZ2luLnNjYWxlLnkvMikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUodGhpcy5vcmlnaW4ucG9zaXRpb24ueCx0aGlzLm9yaWdpbi5wb3NpdGlvbi55KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUodGhpcy5vcmlnaW4uc2NhbGUueC8yLHRoaXMub3JpZ2luLnNjYWxlLnkvMik7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMub3JpZ2luLnJvdGF0aW9uICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKC0odGhpcy5vcmlnaW4uc2NhbGUueC8yKSwtKHRoaXMub3JpZ2luLnNjYWxlLnkvMikpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgdGhpcy5jdHguc2NhbGUodGhpcy5vcmlnaW4uc2NhbGUueCx0aGlzLm9yaWdpbi5zY2FsZS55KTsgICAgICBcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqIENhbGxlZCBhZnRlciB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXHJcbiAgICAgKi9cclxuICAgIGFmdGVyUmVuZGVyKCl7ICAgICAgICBcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBEcmF3YWJsZSAmJiAhY2hpbGQudXNlX2xvY2FsX2Nvb3JkaW5hdGVzKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc2NhbGUoMS90aGlzLm9yaWdpbi5zY2FsZS54LDEvdGhpcy5vcmlnaW4uc2NhbGUueSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY2hpbGQub25SZW5kZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb3JpZ2luOiBUcmFuc2Zvcm07ICAgIFxyXG4gICAgY2hpbGRyZW46IEFycmF5PE9iamVjdDJEPjtcclxuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgdXNlX2xvY2FsX2Nvb3JkaW5hdGVzOiBib29sZWFuO1xyXG4gICAgb3JpZ2luX2luX2NlbnRlcjogYm9vbGVhbjtcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBDb25maWcgZnJvbSBcIi4vLi4vZW5naW5lQ29uZmlnXCI7XHJcbmltcG9ydCB7YWN0aXZlU2NlbmV9IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCB2YXIgY3R4IDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbnZhciBjYW52YXMgOkhUTUxDYW52YXNFbGVtZW50O1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgdGhlIGNhbnZhcyBjb250ZXh0LlxyXG4gKiBBbGxyZWFkeSBjYWxsZWQgYnkgdGhlIGluaXQgZnVuY3Rpb24gZnJvbSBjb3JlLnRzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpe1xyXG4gICAgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihDb25maWcuY2FudmFzU2VsZWN0b3IpISBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGVzIHZpZXdwb3J0IHNpemUsXHJcbiAqIGNhbGxzIGFsbCB0aGUgb25SZW5kZXIgbWV0aG9kc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcigpeyAgXHJcbiAgICBpZihDb25maWcucmVzaXplVmlld3BvcnQpe1xyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICB9XHJcbiAgICBjdHguY2xlYXJSZWN0KDAsMCxjYW52YXMud2lkdGgsY2FudmFzLmhlaWdodCk7XHJcbiAgICBhY3RpdmVTY2VuZT8ucmVuZGVyKCk7XHJcbn0iLCJpbXBvcnQge0RyYXdhYmxlLCBPYmplY3QyRH0gZnJvbSBcIi4vb2JqZWN0MkRcIlxyXG5pbXBvcnQge2N0eH0gZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBSb290IGZvciBhbGwgdGhlIGVsZW1lbnRzIGluc2lkZSB5b3VyIGxldmVsLlxyXG4gKiBPYmplY3RzIG5vdCBhIG1lbWJlciBvZiB0aGUgYWN0aXZlIHNjZW5lIHdvbnQgYmUgY2FsbGVkIHZpYSBvblVwZGF0ZSBhbmQgb25SZW5kZXIuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2NlbmV7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKGNoaWxkPT57XHJcbiAgICAgICAgICAgIGNoaWxkLm9uVXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uVXBkYXRlKVxyXG4gICAgICAgICAgICB0aGlzLm9uVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgdGhpcy5tZW1iZXJzLmZvckVhY2goY2hpbGQ9PntcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY2hpbGQub25SZW5kZXIoKTtcclxuICAgICAgICAgICAgY2hpbGQuYWZ0ZXJSZW5kZXIoKTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gICBcclxuXHJcbiAgICBvblVwZGF0ZTogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XHJcbiAgICBtZW1iZXJzOiBBcnJheTxPYmplY3QyRD47XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7IHdvcmxkLFdvcmxkU2l6ZSB9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJ0aWNsZXtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gMTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IFwid2hpdGVcIjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RlcCgpIDpib29sZWFue1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICB0cnlNb3ZlKHJlbGF0aXZlUG9zOiBWZWN0b3IyKSA6Ym9vbGVhbntcclxuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnkgPj0gV29ybGRTaXplLnkgfHwgdGhpcy5wb3NpdGlvbi54K3JlbGF0aXZlUG9zLnggPj0gV29ybGRTaXplLnggfHxcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnkgPCAwIHx8IHRoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54IDwgMCApIFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldCA9IHdvcmxkLnBhcnRpY2xlc1t0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueV1bdGhpcy5wb3NpdGlvbi54K3JlbGF0aXZlUG9zLnhdO1xyXG5cclxuICAgICAgICBpZiAodGFyZ2V0ICE9IHVuZGVmaW5lZCkgeyBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gcmVsYXRpdmVQb3MueDsgXHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSArPSByZWxhdGl2ZVBvcy55OyBcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdlaWdodDogbnVtYmVyO1xyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7IFxyXG4gICAgdmVsb2NpdHk6IFZlY3RvcjI7ICAgIFxyXG4gICAgY29sb3I6IHN0cmluZztcclxufVxyXG5cclxuLy80IEJhc2UgcGFydGljbGUgdHlwZXMgU29saWQgUG93ZGVyIEZsdWlkIEdhc1xyXG5cclxuZXhwb3J0IGNsYXNzIFNvbGlkIGV4dGVuZHMgUGFydGljbGV7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICBzdXBlcihwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IFwiZ3JheVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHN0ZXAoKXtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvd2RlciBleHRlbmRzIFBhcnRpY2xle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgc3VwZXIocG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcInllbGxvd1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHN0ZXAoKXtcclxuICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigwLDEpKSkgeyBcclxuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9ICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7V29ybGQsV29ybGRTaXplLGN0eH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7UGFydGljbGV9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcblxyXG5pbnRlcmZhY2UgUGh5c2ljc3tcclxuXHJcbiAgICBzdGVwKHNpbV9zdGF0ZTogV29ybGQpOldvcmxkO1xyXG5cclxufVxyXG5cclxuY2xhc3MgQmFzaWNQaHlzaWNzIGltcGxlbWVudHMgUGh5c2ljc3tcclxuXHJcbiAgICBzdGVwKHNpbV9zdGF0ZTogV29ybGQpe1xyXG4gICAgICAgIGxldCBtb3ZlZCA6QXJyYXk8UGFydGljbGU+ID0gW107XHJcblxyXG5cclxuICAgICAgICAvL3NpbV9zdGF0ZS5pdHRlcmF0b3JEaXJlY3Rpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKjMpO1xyXG5cclxuICAgICAgICAvL1RoaXMgbGluZSBmaXhlcyBldmVyeXRoaW5nXHJcbiAgICAgICAgc2ltX3N0YXRlLml0dGVyYXRvckRpcmVjdGlvbisrXHJcbiAgICAgICAgaWYgKHNpbV9zdGF0ZS5pdHRlcmF0b3JEaXJlY3Rpb24gPiAzKSB7XHJcbiAgICAgICAgICAgIHNpbV9zdGF0ZS5pdHRlcmF0b3JEaXJlY3Rpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHNpbV9zdGF0ZSl7XHJcbiAgICAgICAgICAgIGlmKCFwYXJ0IHx8IG1vdmVkLmluY2x1ZGVzKHBhcnQpKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNpbV9zdGF0ZS5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgcGFydC5zdGVwKCk7ICAgICBcclxuICAgICAgICAgICAgbW92ZWQucHVzaChwYXJ0KTtcclxuXHJcbiAgICAgICAgICAgIHNpbV9zdGF0ZS5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdID0gcGFydDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3N5bmNocm9uaXplIHdvcmxkIHBvc2l0aW9uIHdpdGggbWF0cml4IHBvc2l0aW9uXHJcbiAgICAgICAgLy90aGlzLm1hdHJpeFN5bmMoc2ltX3N0YXRlKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcmV0dXJuIHNpbV9zdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hdHJpeFN5bmMoc2ltX3N0YXRlIDogV29ybGQpe1xyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgV29ybGRTaXplLnk7IHkrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFdvcmxkU2l6ZS54OyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gc2ltX3N0YXRlLnBhcnRpY2xlc1t5XVt4XVxyXG4gICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICgocGFydC5wb3NpdGlvbi55KSA8IFdvcmxkU2l6ZS55ICYmIChwYXJ0LnBvc2l0aW9uLngpIDwgV29ybGRTaXplLngpIHsgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFydC5wb3NpdGlvbiA9IG5ldyBWZWN0b3IyKHgseSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbV9zdGF0ZS5wYXJ0aWNsZXNbeV1beF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbV9zdGF0ZS5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdID0gcGFydDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBQaHlzaWNzID0gbmV3IEJhc2ljUGh5c2ljcygpOyIsImltcG9ydCB7V29ybGQsV29ybGRTaXplLGN0eCx3b3JsZH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5cclxuaW50ZXJmYWNlIFJlbmRlcmVye1xyXG5cclxuICAgIGRyYXdGcmFtZShzaW1fc3RhdGU6IFdvcmxkKSA6IHZvaWQ7XHJcblxyXG59XHJcblxyXG5jbGFzcyBDYW52YXNSZW5kZXJlciBpbXBsZW1lbnRzIFJlbmRlcmVye1xyXG5cclxuICAgIGRyYXdGcmFtZShzaW1fc3RhdGU6IFdvcmxkKXtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzc3Nyc7XHJcbiAgICAgICAgY3R4LnN0cm9rZVJlY3QoMCwwLDQwMCwzMDApO1xyXG5cclxuICAgICAgICBmb3IobGV0IHBhcnQgb2Ygc2ltX3N0YXRlKXtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGFydClcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gXHJcblxyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gcGFydC5jb2xvcjtcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHBhcnQucG9zaXRpb24ueCxwYXJ0LnBvc2l0aW9uLnksMSwxKTsgLy9kcmF3IHJlY3RhbmdsZSA6UFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgUmVuZGVyZXIgPSBuZXcgQ2FudmFzUmVuZGVyZXIoKTsiLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7RHJhd2FibGV9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvb2JqZWN0MkRcIjtcclxuaW1wb3J0IHtQYXJ0aWNsZX0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuaW1wb3J0IHtSZW5kZXJlcn0gZnJvbSBcIi4vcmVuZGVyXCI7XHJcbmltcG9ydCB7UGh5c2ljc30gZnJvbSBcIi4vcGh5c2ljc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdvcmxkU2l6ZSA9IG5ldyBWZWN0b3IyKDQwMCwzMDApO1xyXG5leHBvcnQgdmFyIGN0eDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGR7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuaXR0ZXJhdG9yRGlyZWN0aW9uID0gMjtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgQXJyYXkoV29ybGRTaXplLnkpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpbmRleCsrKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2luZGV4XSA9IG5ldyBBcnJheShXb3JsZFNpemUueCkuZmlsbCh1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL0l0dGVyYXRvclxyXG4gICAgcHJpdmF0ZSBnZXRJdHRlclZhbChpIDogbnVtYmVyKXsgXHJcbiAgICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKGkvV29ybGRTaXplLngpO1xyXG4gICAgICAgIGxldCB4ID0gaSAtIE1hdGguZmxvb3IoaS9Xb3JsZFNpemUueCkqV29ybGRTaXplLng7XHJcblxyXG4gICAgICAgIGxldCBvdXQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3dpdGNoICh0aGlzLml0dGVyYXRvckRpcmVjdGlvbikgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBvdXQgPSB0aGlzLnBhcnRpY2xlc1t5XVtXb3JsZFNpemUueCAtIHggLTFdOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdGhpcy5wYXJ0aWNsZXNbV29ybGRTaXplLnkgLSB5IC0gMV1beF07ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBvdXQgPSB0aGlzLnBhcnRpY2xlc1tXb3JsZFNpemUueSAtIHkgLTFdW1dvcmxkU2l6ZS54IC0geCAtMV07ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgb3V0ID0gdGhpcy5wYXJ0aWNsZXNbeV1beF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICBbU3ltYm9sLml0ZXJhdG9yXSA9ICgpID0+IHsgICAgICBcclxuICAgICAgICBsZXQgaSA9IDA7XHJcblxyXG4gICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgbmV4dDooKT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmU6IChpID49IChXb3JsZFNpemUueCAqIFdvcmxkU2l6ZS55IC0gMSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmdldEl0dGVyVmFsKGkrKykgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwYXJ0aWNsZXM6QXJyYXk8QXJyYXk8UGFydGljbGUgfCB1bmRlZmluZWQ+PjtcclxuXHJcbiAgICBpdHRlcmF0b3JEaXJlY3Rpb24gOm51bWJlcjsgLy8wLTMgdGwgdHIgYmwgYnJcclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQgdmFyIHdvcmxkID0gbmV3IFdvcmxkKCk7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRNYW5hZ2VyIGV4dGVuZHMgRHJhd2FibGV7ICBcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVXBkYXRlKCl7ICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uUmVuZGVyKCl7XHJcbiAgICAgICAgc3VwZXIub25SZW5kZXIoKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIXRoaXMucGF1c2VkKVxyXG4gICAgICAgICAgICBQaHlzaWNzLnN0ZXAod29ybGQpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgY3R4ID0gdGhpcy5jdHg7XHJcbiAgICAgICAgUmVuZGVyZXIuZHJhd0ZyYW1lKHdvcmxkKTtcclxuICAgIH0gICAgXHJcblxyXG5cclxuICAgIGFkZFBhcnQocGFydDogUGFydGljbGUpeyAgICAgICAgXHJcbiAgICAgICAgd29ybGQucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHBhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2VkOmJvb2xlYW47XHJcbn1cclxuXHJcblxyXG5cclxuLy9UT0RPOiBNdWx0aXRocmVhZGluZyBpZiBpIGZhbmN5XHJcbi8qXHJcbnVzZSB0aGlzIHRvIHRlc3QgaWYgc3VwcG9ydGVkXHJcblxyXG5pZiAodHlwZW9mKFdvcmtlcikgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgLy9ncmVhdCwgeW91ciBicm93c2VyIHN1cHBvcnRzIHdlYiB3b3JrZXJzXHJcbn0gZWxzZSB7XHJcbiAgIC8vbm90IHN1cHBvcnRlZFxyXG59XHJcblxyXG4qLyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0ICogYXMgQ0UgZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9jb3JlXCI7XHJcblxyXG5pbXBvcnQge1NjZW5lfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3NjZW5lXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuXHJcbmltcG9ydCB7d29ybGQsIFdvcmxkTWFuYWdlcixjdHh9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuXHJcbmltcG9ydCB7S2V5Ym9hcmRJbnB1dH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9pbnB1dFwiO1xyXG5cclxuaW1wb3J0IHsgUG93ZGVyLCBTb2xpZCB9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gXCJ3ZWJwYWNrXCI7XHJcbmltcG9ydCB7IFBoeXNpY3MgfSBmcm9tIFwiLi9waHlzaWNzXCI7XHJcblxyXG4vL2NyZWF0ZSBzY2VuZVxyXG5sZXQgbGV2ZWwgPSBuZXcgU2NlbmUoKTtcclxubGV0IHdvcmxkX21hbmFnZXIgPSBuZXcgV29ybGRNYW5hZ2VyKCk7XHJcbndpbmRvdy5vbmxvYWQgPSAoKT0+e1xyXG4gICAgLy9pbml0IGVuZ2luZVxyXG4gICAgQ0UuaW5pdCgpO1xyXG4gICAgLy9iaW5kIHNjZW5lXHJcbiAgICBDRS5zZXRBY3RpdmVTY2VuZShsZXZlbCk7XHJcbiAgICBcclxuICAgIGxldmVsLm1lbWJlcnMucHVzaCh3b3JsZF9tYW5hZ2VyKTtcclxuICAgIHdvcmxkX21hbmFnZXIub3JpZ2luLnNjYWxlID0gbmV3IFZlY3RvcjIoMiwyKTtcclxuXHJcblxyXG4gICAgLy93b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFBvd2RlcihuZXcgVmVjdG9yMig4MCwwKSkpOyAgXHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDYwOyB4IDwgMTQwOyB4KyspIHsgICAgIFxyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTU7IHkrKykgeyAgICAgXHJcbiAgICAgICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgUG93ZGVyKG5ldyBWZWN0b3IyKHgseSkpKTsgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwMDsgeCsrKSB7IFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoeCswLHgrNjApKSk7ICAgIFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoeCswLHgrNjEpKSk7ICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDA7IHgrKykgeyBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzIwMCx4KzYwKSkpOyAgICBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzIwMCx4KzYxKSkpOyAgICAgIFxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDUwOyB4KyspIHsgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsxMDAseCsxOTApKSk7ICAgIFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMTAwLHgrMTkxKSkpOyAgICAgIFxyXG4gICAgfVxyXG4gXHJcbn07XHJcblxyXG4vL3J1bnMgZXZlcnkgdGljayBcclxubGV2ZWwub25VcGRhdGUgPSAoKT0+e1xyXG4gICAgaWYgKEtleWJvYXJkSW5wdXQuaXNKdXN0UHJlc3NlZChcIlNwYWNlXCIpKSB7XHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5wYXVzZWQgPSAhd29ybGRfbWFuYWdlci5wYXVzZWQ7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoS2V5Ym9hcmRJbnB1dC5pc0p1c3RQcmVzc2VkKFwiZlwiKSkge1xyXG4gICAgICAgIHdvcmxkX21hbmFnZXIucGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICBQaHlzaWNzLnN0ZXAod29ybGQpO1xyXG4gICAgfVxyXG5cdFxyXG59OyAiXSwic291cmNlUm9vdCI6IiJ9