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
        //
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
                        return;
                    }
                }
            }
            else {
                if (!this.tryMove(new base_types_1.Vector2(-1, 1))) {
                    if (!this.tryMove(new base_types_1.Vector2(1, 1))) {
                        return;
                    }
                }
            }
        }
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
        try {
            for (var sim_state_1 = __values(sim_state), sim_state_1_1 = sim_state_1.next(); !sim_state_1_1.done; sim_state_1_1 = sim_state_1.next()) {
                var part = sim_state_1_1.value;
                part === null || part === void 0 ? void 0 : part.step();
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
        this.matrixSync(sim_state);
        return sim_state;
    };
    BasicPhysics.prototype.matrixSync = function (sim_state) {
        for (var y = 0; y < world_manager_1.WorldSize.y; y++) {
            for (var x = 0; x < world_manager_1.WorldSize.x; x++) {
                var part = sim_state.particles[y][x];
                if (!part)
                    continue;
                if (!(part.position.x == x && part.position.y == y)) {
                    if ((part.position.y) < world_manager_1.WorldSize.y && (part.position.x) < world_manager_1.WorldSize.x) {
                        if (sim_state.particles[part.position.y][part.position.x]) {
                            part.position = new base_types_1.Vector2(x, y);
                            part.step();
                        }
                        else {
                            sim_state.particles[y][x] = undefined;
                            sim_state.particles[(part.position.y)][(part.position.x)] = part;
                        }
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
        this.particles = new Array(exports.WorldSize.y);
        for (var index = 0; index < this.particles.length; index++) {
            this.particles[index] = new Array(exports.WorldSize.x).fill(undefined);
        }
    }
    //Itterator
    World.prototype.getItterVal = function (i) {
        var y = Math.floor(i / exports.WorldSize.x);
        var x = i - Math.floor(i / exports.WorldSize.x) * exports.WorldSize.x;
        var out = this.particles[y][x];
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
        for (var y = 0; y < 50; y++) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BhcnRpY2xlLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9waHlzaWNzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9yZW5kZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3dvcmxkX21hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7RUFDRTtBQUNGLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQztBQU8zQix3Q0FBYztBQU5sQixJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFRekIsd0NBQWM7QUFQbEI7RUFDRTtBQUNGLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUlYLGtCQUFHOzs7Ozs7Ozs7Ozs7OztBQ1ZQOzs7RUFHRTtBQUNGO0lBQ0ksaUJBQVksQ0FBUyxFQUFDLENBQVM7UUFDM0IsSUFBSSxDQUFDLENB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SSxvQkFBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxnQkFBSyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRDtBQUVMLENBQUMsQ0FBQztBQUVGLGtCQUFrQjtBQUNsQixLQUFLLENBQUMsUUFBUSxHQUFHO0lBQ2IsSUFBSSxxQkFBYSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUN0QyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztLQUNoRDtJQUVELElBQUkscUJBQWEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbEMsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDNUIsaUJBQU8sQ0FBQyxJQUFJLENBQUMscUJBQUssQ0FBQyxDQUFDO0tBQ3ZCO0FBRUwsQ0FBQyxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlF1ZXJyeSBzZWxlY3RvciBmb3IgdGhlIGNhbnZhcyBlbGVtZW50XHJcbiovXHJcbmNvbnN0IGNhbnZhc1NlbGVjdG9yID0gXCIjZ2FtZVwiO1xyXG5jb25zdCByZXNpemVWaWV3cG9ydCA9IGZhbHNlO1xyXG4vKipUYXJnZXQgZnJhbWVzIHBlciBzZWNvbmRcclxuKi9cclxuY29uc3QgZnBzID0gNjA7XHJcblxyXG5leHBvcnQge1xyXG4gICAgY2FudmFzU2VsZWN0b3IsICAgIFxyXG4gICAgZnBzLFxyXG4gICAgcmVzaXplVmlld3BvcnRcclxufSIsIi8qKlxyXG4gKiAyRCBWZWN0b3JcclxuICogU3RvcmVzIFggYW5kIFlcclxuKi9cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjIgIHtcclxuICAgIGNvbnN0cnVjdG9yKFggOm51bWJlcixZIDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMueCA9IFg7XHJcbiAgICAgICAgdGhpcy55ID0gWTtcclxuICAgIH1cclxuXHJcbiAgICBsZW5naHQoKXtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICBNYXRoLnBvdyh0aGlzLngsMikgKyBNYXRoLnBvdyh0aGlzLnksMilcclxuICAgICAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIG5vcm1hbGl6ZWQoKXtcclxuICAgICAgICBsZXQgbmV3VmVjdG9yID0gbmV3IFZlY3RvcjIodGhpcy54LHRoaXMueSk7XHJcbiAgICAgICAgbGV0IGxlbmdodCA9IG5ld1ZlY3Rvci5sZW5naHQoKVxyXG4gICAgICAgIG5ld1ZlY3Rvci54IC89IGxlbmdodDtcclxuICAgICAgICBuZXdWZWN0b3IueSAvPSBsZW5naHQ7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdWZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgeDpudW1iZXI7XHJcbiAgICB5Om51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFN0b3JlcyBwb3NpdGlvbiByb3RhdGlvbiAoZGVncmVlcykgYW5kIHNjYWxlXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKHBvcz8gOlZlY3RvcjIsIHJvdD8gOm51bWJlciwgc2NhbGU/IDpWZWN0b3IyKXtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uICAgPSBwb3MgPyBwb3MgICAgIDogbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uICAgPSByb3QgPyByb3QgICAgIDogMDtcclxuICAgICAgICB0aGlzLnNjYWxlICAgICAgPSBzY2FsZSA/IHNjYWxlIDogbmV3IFZlY3RvcjIoMSwxKTtcclxuICAgIH1cclxuICAgIHBvc2l0aW9uOiBWZWN0b3IyO1xyXG4gICAgcm90YXRpb246IG51bWJlcjtcclxuICAgIHNjYWxlOiBWZWN0b3IyO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlbmRlcmluZyBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5pbXBvcnQgKiBhcyBDb25maWcgZnJvbSBcIi4vLi4vZW5naW5lQ29uZmlnXCI7XHJcbmltcG9ydCB7U2NlbmV9IGZyb20gXCIuL3NjZW5lXCI7XHJcbmltcG9ydCB7S2V5Ym9hcmRJbnB1dH0gZnJvbSBcIi4vLi4vZW5naW5lL2lucHV0XCI7XHJcblxyXG5cclxuZXhwb3J0IHZhciBhY3RpdmVTY2VuZSA6IFNjZW5lIHwgdW5kZWZpbmVkXHJcblxyXG4vKipcclxuICogU2V0IHRoZSBzY2VuZSB5b3Ugd2FudCB0byBiZSBjdXJyZW50bHkgZGlzcGxheWVkIGFuZCB1cGRhdGVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0QWN0aXZlU2NlbmUoc2NlbmUgOlNjZW5lKXtcclxuICAgIGFjdGl2ZVNjZW5lID0gc2NlbmU7XHJcbn1cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgdGhlIGVuZ2luZVxyXG4qL1xyXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIFJlbmRlcmluZy5pbml0KCk7XHJcbiAgICBLZXlib2FyZElucHV0LmluaXQoKTtcclxuXHJcbiAgICBzZXRJbnRlcnZhbCh1cGRhdGUsMTAwMC9Db25maWcuZnBzKTtcclxufVxyXG4vKipcclxuICogRG9uJ3QgdXNlIGV4dGVybmFseS5cclxuICogQ2FsbHMgb25VcGRhdGUgYW5kIG9uUmVuZGVyIG1ldGhvZHNcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZSgpe1xyXG4gICAgaWYoYWN0aXZlU2NlbmU/Lm9uVXBkYXRlKVxyXG4gICAgICAgIGFjdGl2ZVNjZW5lLm9uVXBkYXRlKCk7XHJcbiAgICBhY3RpdmVTY2VuZT8udXBkYXRlKCk7XHJcblxyXG4gICAgUmVuZGVyaW5nLnJlbmRlcigpO1xyXG59IiwiLyoqXHJcbiAqIE1vc3Qgb2Yga2V5cyBwcmVzZW50IG9uIHRoZSBrZXlib2FyZCBhcyBhIHN0cmluZyB1bmlvbi4gUGxlYXNlIHJlcG9ydCBhbnkgbWlzc2luZyBrZXlzLlxyXG4gKi9cclxudHlwZSBLZXkgPSBcIlRhYlwiIHwgXCJBbHRcIiB8IFwiQWx0R3JhcGhcIiB8IFwiQmFja3NwYWNlXCIgfCBcIkNvbnRyb2xcIiB8XCJTaGlmdFwiIHwgXCJTcGFjZVwiIHwgXCJDb250ZXh0TWVudVwiIHwgXCJFbnRlclwiIHwgXCJOdW1Mb2NrXCIgfCBcIkhvbWVcIiB8IFwiUGFnZVVwXCIgfCBcIlBhZ2VEb3duXCIgfCBcIkluc2VydFwiIHwgXCJEZWxldGVcIiB8IFwiQXJyb3dVcFwiIHwgXCJBcnJvd0Rvd25cIiB8IFwiQXJyb3dSaWdodFwiIHwgXCJBcnJvd0xlZnRcIiB8XCIhXCIgfCBcIlxcXCJcInwgXCIjXCIgfCBcIiRcIiB8IFwiJVwiIHwgXCImXCIgfCBcIidcIiB8IFwiKFwiIHwgXCIpXCIgfCBcIipcIiB8IFwiK1wiIHwgXCIsXCIgfCBcIi1cIiB8IFwiLlwiIHwgXCIvXCIgfCBcIjBcIiB8IFwiMVwiIHwgXCIyXCIgfCBcIjNcIiB8IFwiNFwiIHwgXCI1XCIgfCBcIjZcIiB8IFwiN1wiIHwgXCI4XCIgfCBcIjlcIiB8IFwiOlwiIHwgXCI7XCIgfCBcIjxcIiB8IFwiPVwiIHwgXCI+XCIgfCBcIj9cIiB8IFwiQFwiIHwgXCJBXCIgfCBcIkJcIiB8IFwiQ1wiIHwgXCJEXCIgfCBcIkVcIiB8IFwiRlwiIHwgXCJHXCIgfCBcIkhcIiB8IFwiSVwiIHwgXCJKXCIgfCBcIktcIiB8IFwiTFwiIHwgXCJNXCIgfCBcIk5cIiB8IFwiT1wiIHwgXCJQXCIgfCBcIlFcIiB8IFwiUlwiIHwgXCJTXCIgfCBcIlRcIiB8IFwiVVwiIHwgXCJWXCIgfCBcIldcIiB8IFwiWFwiIHwgXCJZXCIgfCBcIlpcIiB8IFwiW1wiIHwgXCJcXFxcXCIgfCBcIl1cIiB8IFwiXlwiIHwgXCJfXCIgfCBcImBcIiB8IFwiYVwiIHwgXCJiXCIgfCBcImNcIiB8IFwiZFwiIHwgXCJlXCIgfCBcImZcIiB8IFwiZ1wiIHwgXCJoXCIgfCBcImlcIiB8IFwialwiIHwgXCJrXCIgfCBcImxcIiB8IFwibVwiIHwgXCJuXCIgfCBcIm9cIiB8IFwicFwiIHwgXCJxXCIgfCBcInJcIiB8IFwic1wiIHwgXCJ0XCIgfCBcInVcIiB8IFwidlwiIHwgXCJ3XCIgfCBcInhcIiB8IFwieVwiIHwgXCJ6XCIgfCBcIntcIiB8IFwifFwiIHwgXCJ9XCIgfCBcIn5cIiA7XHJcblxyXG5lbnVtIEtleVN0YXRle1xyXG4gICAgUFJFU1NFRCxcclxuICAgIEhPTEQsXHJcbiAgICBSRUxFQVNFLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgS2V5Ym9hcmRJbnB1dHtcclxuICAgIC8qKlxyXG4gICAgICogQWRkIGV2ZW50IGxpc3RlbmVycyBmb3Iga2V5IHByZXNzZXMuXHJcbiAgICAgKiBBbGxyZWFkeSBjYWxsZWQgYnkgdGhlIGluaXQgZnVuY3Rpb24gZnJvbSBjb3JlLnRzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMgPSBuZXcgTWFwPEtleSxLZXlTdGF0ZT4oKTtcclxuXHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwoZSk9PnsgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMuc2V0KEtleWJvYXJkSW5wdXQuc3RyaW5nVG9LZXkoZS5rZXkpLEtleVN0YXRlLlBSRVNTRUQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwoZSk9PntcclxuICAgICAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMuc2V0KEtleWJvYXJkSW5wdXQuc3RyaW5nVG9LZXkoZS5rZXkpLEtleVN0YXRlLlJFTEVBU0UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBmb3IgcHJlc3NlZCBrZXlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGlzUHJlc3NlZChrZXk6IEtleSl7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5rZXlTdGF0ZXMuZ2V0KGtleSk7XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XHJcbiAgICAgICAgICAgIHRoaXMua2V5U3RhdGVzLnNldChrZXksS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gIShzdGF0ZSA9PT0gdW5kZWZpbmVkIHx8IHN0YXRlID09IEtleVN0YXRlLlJFTEVBU0UpXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGlzSnVzdFByZXNzZWQoa2V5OiBLZXkpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMua2V5U3RhdGVzLmdldChrZXkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XHJcbiAgICAgICAgICAgIHRoaXMua2V5U3RhdGVzLnNldChrZXksS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRDtcclxuICAgICAgICAvL3JldHVybiBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBrZXlTdGF0ZXM6IE1hcDxLZXksS2V5U3RhdGU+O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHN0cmluZ1RvS2V5KGtleSA6c3RyaW5nKXsgICAgICAgIFxyXG4gICAgICAgIGxldCB2YWwgPSBrZXkucmVwbGFjZShcIkRlYWRcIixcIn5cIik7XHJcbiAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoXCIgXCIsXCJTcGFjZVwiKTtcclxuICAgICAgICBsZXQga2V5dHlwZSA9IHZhbCAgYXMgS2V5O1xyXG4gICAgICAgIHJldHVybiBrZXl0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtWZWN0b3IyLFRyYW5zZm9ybX0gZnJvbSBcIi4vYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQge2N0eH0gZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBCYXNlIGZvciBjaGlsZHJlbiBwb2x5bW9ycGhpc21cclxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIHdoZW4gY3JlYXRpbmcgYSBjb21wb25lbnQgLyBjaGlsZC5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0MkQge1xyXG4gICAgLy9IYXBwZW5zIGV2ZXJ5IHRpY2tcclxuICAgIG9uVXBkYXRlKCkgOnZvaWQ7IFxyXG4gICAgLy9DYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgIG9uUmVuZGVyKCkgOnZvaWQ7IFxyXG4gICAgYWZ0ZXJSZW5kZXIoKSA6dm9pZDsgXHJcblxyXG4gICAgb3JpZ2luOiBUcmFuc2Zvcm07ICAgIFxyXG4gICAgY2hpbGRyZW46IEFycmF5PE9iamVjdDJEPjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEJhc2UgZm9yIGNoaWxkcmVuIHRoYXQgd2FudCB0byByZW5kZXIgc29tZXRoaW5nLlxyXG4gKiBFeHRlbmQgdGhpcyBjbGFzcyBmb3IgY3R4IGFjY2VzcyBhbmQgb3JpZ2luIHRyYW5zZm9ybSBoYW5kZWxpbmcuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRHJhd2FibGUgaW1wbGVtZW50cyBPYmplY3QyRCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMub3JpZ2luID0gbmV3IFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLmN0eCA9IGN0eDtcclxuICAgICAgICB0aGlzLnVzZV9sb2NhbF9jb29yZGluYXRlcyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub3JpZ2luX2luX2NlbnRlciA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqL1xyXG4gICAgb25VcGRhdGUoKXtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqIENhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgICovXHJcbiAgICBvblJlbmRlcigpeyAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuY3R4ID0gY3R4O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtKHRoaXMub3JpZ2luLnNjYWxlLngvMiksLSh0aGlzLm9yaWdpbi5zY2FsZS55LzIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMub3JpZ2luLnBvc2l0aW9uLngsdGhpcy5vcmlnaW4ucG9zaXRpb24ueSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMub3JpZ2luLnNjYWxlLngvMix0aGlzLm9yaWdpbi5zY2FsZS55LzIpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgICAgIHRoaXMuY3R4LnJvdGF0ZSh0aGlzLm9yaWdpbi5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtKHRoaXMub3JpZ2luLnNjYWxlLngvMiksLSh0aGlzLm9yaWdpbi5zY2FsZS55LzIpKTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIHRoaXMuY3R4LnNjYWxlKHRoaXMub3JpZ2luLnNjYWxlLngsdGhpcy5vcmlnaW4uc2NhbGUueSk7ICAgICAgXHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XHJcbiAgICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgICovXHJcbiAgICBhZnRlclJlbmRlcigpeyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRHJhd2FibGUgJiYgIWNoaWxkLnVzZV9sb2NhbF9jb29yZGluYXRlcylcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnNjYWxlKDEvdGhpcy5vcmlnaW4uc2NhbGUueCwxL3RoaXMub3JpZ2luLnNjYWxlLnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNoaWxkLm9uUmVuZGVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIG9yaWdpbjogVHJhbnNmb3JtOyAgICBcclxuICAgIGNoaWxkcmVuOiBBcnJheTxPYmplY3QyRD47XHJcbiAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIHVzZV9sb2NhbF9jb29yZGluYXRlczogYm9vbGVhbjtcclxuICAgIG9yaWdpbl9pbl9jZW50ZXI6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgQ29uZmlnIGZyb20gXCIuLy4uL2VuZ2luZUNvbmZpZ1wiO1xyXG5pbXBvcnQge2FjdGl2ZVNjZW5lfSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgdmFyIGN0eCA6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG52YXIgY2FudmFzIDpIVE1MQ2FudmFzRWxlbWVudDtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIHRoZSBjYW52YXMgY29udGV4dC5cclxuICogQWxscmVhZHkgY2FsbGVkIGJ5IHRoZSBpbml0IGZ1bmN0aW9uIGZyb20gY29yZS50c1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKXtcclxuICAgIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoQ29uZmlnLmNhbnZhc1NlbGVjdG9yKSEgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlcyB2aWV3cG9ydCBzaXplLFxyXG4gKiBjYWxscyBhbGwgdGhlIG9uUmVuZGVyIG1ldGhvZHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoKXsgIFxyXG4gICAgaWYoQ29uZmlnLnJlc2l6ZVZpZXdwb3J0KXtcclxuICAgICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgY3R4LmNsZWFyUmVjdCgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgYWN0aXZlU2NlbmU/LnJlbmRlcigpO1xyXG59IiwiaW1wb3J0IHtEcmF3YWJsZSwgT2JqZWN0MkR9IGZyb20gXCIuL29iamVjdDJEXCJcclxuaW1wb3J0IHtjdHh9IGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcblxyXG4vKipcclxuICogUm9vdCBmb3IgYWxsIHRoZSBlbGVtZW50cyBpbnNpZGUgeW91ciBsZXZlbC5cclxuICogT2JqZWN0cyBub3QgYSBtZW1iZXIgb2YgdGhlIGFjdGl2ZSBzY2VuZSB3b250IGJlIGNhbGxlZCB2aWEgb25VcGRhdGUgYW5kIG9uUmVuZGVyLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNjZW5le1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLm1lbWJlcnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKXtcclxuICAgICAgICB0aGlzLm1lbWJlcnMuZm9yRWFjaChjaGlsZD0+e1xyXG4gICAgICAgICAgICBjaGlsZC5vblVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vblVwZGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5vblVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKGNoaWxkPT57XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGNoaWxkLm9uUmVuZGVyKCk7XHJcbiAgICAgICAgICAgIGNoaWxkLmFmdGVyUmVuZGVyKCk7XHJcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9ICAgXHJcblxyXG4gICAgb25VcGRhdGU6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkO1xyXG4gICAgbWVtYmVyczogQXJyYXk8T2JqZWN0MkQ+O1xyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyB3b3JsZCxXb3JsZFNpemUgfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFydGljbGV7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICB0aGlzLndlaWdodCA9IDE7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0ZXAoKSB7XHJcbiAgICAgICAgLy9cclxuICAgIH07XHJcblxyXG4gICAgdHJ5TW92ZShyZWxhdGl2ZVBvczogVmVjdG9yMikgOmJvb2xlYW57XHJcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55ID49IFdvcmxkU2l6ZS55IHx8IHRoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54ID49IFdvcmxkU2l6ZS54IHx8XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55IDwgMCB8fCB0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueCA8IDAgKSBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICAgXHJcblxyXG4gICAgICAgIGxldCB0YXJnZXQgPSB3b3JsZC5wYXJ0aWNsZXNbdGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnldW3RoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54XTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldCAhPSB1bmRlZmluZWQpIHsgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHJlbGF0aXZlUG9zLng7IFxyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gcmVsYXRpdmVQb3MueTsgXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB3ZWlnaHQ6IG51bWJlcjtcclxuICAgIHBvc2l0aW9uOiBWZWN0b3IyOyBcclxuICAgIHZlbG9jaXR5OiBWZWN0b3IyOyAgICBcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vNCBCYXNlIHBhcnRpY2xlIHR5cGVzIFNvbGlkIFBvd2RlciBGbHVpZCBHYXNcclxuXHJcbmV4cG9ydCBjbGFzcyBTb2xpZCBleHRlbmRzIFBhcnRpY2xle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgc3VwZXIocG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcImdyYXlcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3dkZXIgZXh0ZW5kcyBQYXJ0aWNsZXtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xyXG4gICAgICAgIHN1cGVyKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gXCJ5ZWxsb3dcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMCwxKSkpIHsgXHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQge1dvcmxkLFdvcmxkU2l6ZSxjdHh9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQge1BhcnRpY2xlfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5cclxuaW50ZXJmYWNlIFBoeXNpY3N7XHJcblxyXG4gICAgc3RlcChzaW1fc3RhdGU6IFdvcmxkKTpXb3JsZDtcclxuXHJcbn1cclxuXHJcbmNsYXNzIEJhc2ljUGh5c2ljcyBpbXBsZW1lbnRzIFBoeXNpY3N7XHJcblxyXG4gICAgc3RlcChzaW1fc3RhdGU6IFdvcmxkKXtcclxuXHJcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHNpbV9zdGF0ZSl7XHJcbiAgICAgICAgICAgIHBhcnQ/LnN0ZXAoKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vc3luY2hyb25pemUgd29ybGQgcG9zaXRpb24gd2l0aCBtYXRyaXggcG9zaXRpb25cclxuICAgICAgICB0aGlzLm1hdHJpeFN5bmMoc2ltX3N0YXRlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNpbV9zdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hdHJpeFN5bmMoc2ltX3N0YXRlIDogV29ybGQpe1xyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgV29ybGRTaXplLnk7IHkrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFdvcmxkU2l6ZS54OyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gc2ltX3N0YXRlLnBhcnRpY2xlc1t5XVt4XVxyXG4gICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoIShwYXJ0LnBvc2l0aW9uLnggPT0geCAmJiBwYXJ0LnBvc2l0aW9uLnkgPT0geSkpIFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgocGFydC5wb3NpdGlvbi55KSA8IFdvcmxkU2l6ZS55ICYmIChwYXJ0LnBvc2l0aW9uLngpIDwgV29ybGRTaXplLngpIHsgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNpbV9zdGF0ZS5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnQucG9zaXRpb24gPSBuZXcgVmVjdG9yMih4LHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydC5zdGVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbV9zdGF0ZS5wYXJ0aWNsZXNbeV1beF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzWyhwYXJ0LnBvc2l0aW9uLnkpXVsocGFydC5wb3NpdGlvbi54KV0gPSBwYXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFBoeXNpY3MgPSBuZXcgQmFzaWNQaHlzaWNzKCk7IiwiaW1wb3J0IHtXb3JsZCxXb3JsZFNpemUsY3R4LHdvcmxkfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5pbnRlcmZhY2UgUmVuZGVyZXJ7XHJcblxyXG4gICAgZHJhd0ZyYW1lKHNpbV9zdGF0ZTogV29ybGQpIDogdm9pZDtcclxuXHJcbn1cclxuXHJcbmNsYXNzIENhbnZhc1JlbmRlcmVyIGltcGxlbWVudHMgUmVuZGVyZXJ7XHJcblxyXG4gICAgZHJhd0ZyYW1lKHNpbV9zdGF0ZTogV29ybGQpe1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjNzc3JztcclxuICAgICAgICBjdHguc3Ryb2tlUmVjdCgwLDAsNDAwLDMwMCk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgcGFydCBvZiBzaW1fc3RhdGUpe1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwYXJ0KVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiBcclxuXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBwYXJ0LmNvbG9yO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QocGFydC5wb3NpdGlvbi54LHBhcnQucG9zaXRpb24ueSwxLDEpOyAvL2RyYXcgcmVjdGFuZ2xlIDpQXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBSZW5kZXJlciA9IG5ldyBDYW52YXNSZW5kZXJlcigpOyIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtEcmF3YWJsZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9vYmplY3QyRFwiO1xyXG5pbXBvcnQge1BhcnRpY2xlfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5pbXBvcnQge1JlbmRlcmVyfSBmcm9tIFwiLi9yZW5kZXJcIjtcclxuaW1wb3J0IHtQaHlzaWNzfSBmcm9tIFwiLi9waHlzaWNzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgV29ybGRTaXplID0gbmV3IFZlY3RvcjIoNDAwLDMwMCk7XHJcbmV4cG9ydCB2YXIgY3R4OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgQXJyYXkoV29ybGRTaXplLnkpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpbmRleCsrKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2luZGV4XSA9IG5ldyBBcnJheShXb3JsZFNpemUueCkuZmlsbCh1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL0l0dGVyYXRvclxyXG4gICAgcHJpdmF0ZSBnZXRJdHRlclZhbChpIDogbnVtYmVyKXsgXHJcbiAgICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKGkvV29ybGRTaXplLngpO1xyXG4gICAgICAgIGxldCB4ID0gaSAtIE1hdGguZmxvb3IoaS9Xb3JsZFNpemUueCkqV29ybGRTaXplLng7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSB0aGlzLnBhcnRpY2xlc1t5XVt4XTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgW1N5bWJvbC5pdGVyYXRvcl0gPSAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgbmV4dDooKT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmU6IChpID49IChXb3JsZFNpemUueCAqIFdvcmxkU2l6ZS55IC0gMSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmdldEl0dGVyVmFsKGkrKykgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwYXJ0aWNsZXM6QXJyYXk8QXJyYXk8UGFydGljbGUgfCB1bmRlZmluZWQ+PjtcclxuXHJcbiAgICBcclxufVxyXG5cclxuZXhwb3J0IHZhciB3b3JsZCA9IG5ldyBXb3JsZCgpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkTWFuYWdlciBleHRlbmRzIERyYXdhYmxleyAgXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBvblVwZGF0ZSgpeyAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvblJlbmRlcigpe1xyXG4gICAgICAgIHN1cGVyLm9uUmVuZGVyKCk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCF0aGlzLnBhdXNlZClcclxuICAgICAgICAgICAgUGh5c2ljcy5zdGVwKHdvcmxkKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGN0eCA9IHRoaXMuY3R4O1xyXG4gICAgICAgIFJlbmRlcmVyLmRyYXdGcmFtZSh3b3JsZCk7XHJcbiAgICB9ICAgIFxyXG5cclxuXHJcbiAgICBhZGRQYXJ0KHBhcnQ6IFBhcnRpY2xlKXsgICAgICAgIFxyXG4gICAgICAgIHdvcmxkLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSBwYXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlZDpib29sZWFuO1xyXG59XHJcblxyXG5cclxuXHJcbi8vVE9ETzogTXVsdGl0aHJlYWRpbmcgaWYgaSBmYW5jeVxyXG4vKlxyXG51c2UgdGhpcyB0byB0ZXN0IGlmIHN1cHBvcnRlZFxyXG5cclxuaWYgKHR5cGVvZihXb3JrZXIpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgIC8vZ3JlYXQsIHlvdXIgYnJvd3NlciBzdXBwb3J0cyB3ZWIgd29ya2Vyc1xyXG59IGVsc2Uge1xyXG4gICAvL25vdCBzdXBwb3J0ZWRcclxufVxyXG5cclxuKi8iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCAqIGFzIENFIGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvY29yZVwiO1xyXG5cclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zY2VuZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcblxyXG5pbXBvcnQge3dvcmxkLCBXb3JsZE1hbmFnZXIsY3R4fSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5pbXBvcnQge0tleWJvYXJkSW5wdXR9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvaW5wdXRcIjtcclxuXHJcbmltcG9ydCB7IFBvd2RlciwgU29saWQgfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5pbXBvcnQgeyBjb25maWcgfSBmcm9tIFwid2VicGFja1wiO1xyXG5pbXBvcnQgeyBQaHlzaWNzIH0gZnJvbSBcIi4vcGh5c2ljc1wiO1xyXG5cclxuLy9jcmVhdGUgc2NlbmVcclxubGV0IGxldmVsID0gbmV3IFNjZW5lKCk7XHJcbmxldCB3b3JsZF9tYW5hZ2VyID0gbmV3IFdvcmxkTWFuYWdlcigpO1xyXG53aW5kb3cub25sb2FkID0gKCk9PntcclxuICAgIC8vaW5pdCBlbmdpbmVcclxuICAgIENFLmluaXQoKTtcclxuICAgIC8vYmluZCBzY2VuZVxyXG4gICAgQ0Uuc2V0QWN0aXZlU2NlbmUobGV2ZWwpO1xyXG4gICAgXHJcbiAgICBsZXZlbC5tZW1iZXJzLnB1c2god29ybGRfbWFuYWdlcik7XHJcbiAgICB3b3JsZF9tYW5hZ2VyLm9yaWdpbi5zY2FsZSA9IG5ldyBWZWN0b3IyKDIsMik7XHJcblxyXG5cclxuICAgIC8vd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBQb3dkZXIobmV3IFZlY3RvcjIoODAsMCkpKTsgIFxyXG5cclxuICAgIGZvciAobGV0IHggPSA2MDsgeCA8IDE0MDsgeCsrKSB7ICAgICBcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDUwOyB5KyspIHsgICAgIFxyXG4gICAgICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFBvd2RlcihuZXcgVmVjdG9yMih4LHkpKSk7ICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDA7IHgrKykgeyBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKHgrMCx4KzYwKSkpOyAgICBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKHgrMCx4KzYxKSkpOyAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTAwOyB4KyspIHsgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsyMDAseCs2MCkpKTsgICAgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsyMDAseCs2MSkpKTsgICAgICBcclxuICAgIH1cclxuXHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCA1MDsgeCsrKSB7IFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMTAwLHgrMTkwKSkpOyAgICBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzEwMCx4KzE5MSkpKTsgICAgICBcclxuICAgIH1cclxuIFxyXG59O1xyXG5cclxuLy9ydW5zIGV2ZXJ5IHRpY2sgXHJcbmxldmVsLm9uVXBkYXRlID0gKCk9PntcclxuICAgIGlmIChLZXlib2FyZElucHV0LmlzSnVzdFByZXNzZWQoXCJTcGFjZVwiKSkge1xyXG4gICAgICAgIHdvcmxkX21hbmFnZXIucGF1c2VkID0gIXdvcmxkX21hbmFnZXIucGF1c2VkOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKEtleWJvYXJkSW5wdXQuaXNKdXN0UHJlc3NlZChcImZcIikpIHtcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLnBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgUGh5c2ljcy5zdGVwKHdvcmxkKTtcclxuICAgIH1cclxuXHRcclxufTsgIl0sInNvdXJjZVJvb3QiOiIifQ==