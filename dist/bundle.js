/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/engineConfig.ts":
/*!*****************************!*\
  !*** ./src/engineConfig.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fps = exports.canvasSelector = void 0;
/**Querry selector for the canvas element
*/
var canvasSelector = "#game";
exports.canvasSelector = canvasSelector;
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
            KeyboardInput.keyStates.set(KeyboardInput.stringToKey(e.key), true);
        });
        addEventListener("keyup", function (e) {
            -KeyboardInput.keyStates.set(KeyboardInput.stringToKey(e.key), false);
        });
    };
    /**
     * Check for pressed key
     */
    KeyboardInput.isPressed = function (key) {
        var state = this.keyStates.get(key);
        return state === undefined ? false : state;
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
exports.WorldSize = new base_types_1.Vector2(500, 500);
var World = /** @class */ (function () {
    function World() {
        var _this = this;
        this[Symbol.iterator] = function () {
            var i = 0;
            return {
                next: function () {
                    return {
                        done: (i >= exports.WorldSize.x * exports.WorldSize.y),
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
        var x = Math.floor(i / exports.WorldSize.x);
        var y = i - Math.floor(i / exports.WorldSize.x) * exports.WorldSize.x;
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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorldManager.prototype.onUpdate = function () {
    };
    WorldManager.prototype.onRender = function () {
        _super.prototype.onRender.call(this);
        //do physics
        physics_1.Physics.step(exports.world);
        //render everything
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
var particle_1 = __webpack_require__(/*! ./particle */ "../game/particle.ts");
//create scene
var level = new scene_1.Scene();
var world_manager = new world_manager_1.WorldManager();
window.onload = function () {
    //init engine
    CE.init();
    //bind scene
    CE.setActiveScene(level);
    level.members.push(world_manager);
    world_manager.origin.scale = new base_types_1.Vector2(10, 10);
    //world_manager.addPart(new Powder(new Vector2(80,0)));  
    for (var x = 180; x < 200; x++) {
        for (var y = 0; y < 200; y++) {
            world_manager.addPart(new particle_1.Powder(new base_types_1.Vector2(x, y)));
        }
    }
    for (var x = 0; x < 100; x++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(x + 90, x + 200)));
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(x + 90, x + 201)));
    }
    for (var x = 0; x < 100; x++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 290, x + 200)));
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 290, x + 201)));
    }
};
//runs every tick 
level.onUpdate = function () {
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BhcnRpY2xlLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9waHlzaWNzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS9yZW5kZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3dvcmxkX21hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7RUFDRTtBQUNGLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQztBQU0zQix3Q0FBYztBQUxsQjtFQUNFO0FBQ0YsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBSVgsa0JBQUc7Ozs7Ozs7Ozs7Ozs7O0FDVFA7OztFQUdFO0FBQ0Y7SUFDSSxpQkFBWSxDQUFTLEVBQUMsQ0FBUztRQUMzQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcs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cnkgc2VsZWN0b3IgZm9yIHRoZSBjYW52YXMgZWxlbWVudFxyXG4qL1xyXG5jb25zdCBjYW52YXNTZWxlY3RvciA9IFwiI2dhbWVcIjtcclxuLyoqVGFyZ2V0IGZyYW1lcyBwZXIgc2Vjb25kXHJcbiovXHJcbmNvbnN0IGZwcyA9IDYwO1xyXG5cclxuZXhwb3J0IHtcclxuICAgIGNhbnZhc1NlbGVjdG9yLCAgICBcclxuICAgIGZwc1xyXG59IiwiLyoqXHJcbiAqIDJEIFZlY3RvclxyXG4gKiBTdG9yZXMgWCBhbmQgWVxyXG4qL1xyXG5leHBvcnQgY2xhc3MgVmVjdG9yMiAge1xyXG4gICAgY29uc3RydWN0b3IoWCA6bnVtYmVyLFkgOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy54ID0gWDtcclxuICAgICAgICB0aGlzLnkgPSBZO1xyXG4gICAgfVxyXG5cclxuICAgIGxlbmdodCgpe1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoXHJcbiAgICAgICAgICAgIE1hdGgucG93KHRoaXMueCwyKSArIE1hdGgucG93KHRoaXMueSwyKVxyXG4gICAgICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgbm9ybWFsaXplZCgpe1xyXG4gICAgICAgIGxldCBuZXdWZWN0b3IgPSBuZXcgVmVjdG9yMih0aGlzLngsdGhpcy55KTtcclxuICAgICAgICBsZXQgbGVuZ2h0ID0gbmV3VmVjdG9yLmxlbmdodCgpXHJcbiAgICAgICAgbmV3VmVjdG9yLnggLz0gbGVuZ2h0O1xyXG4gICAgICAgIG5ld1ZlY3Rvci55IC89IGxlbmdodDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1ZlY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICB4Om51bWJlcjtcclxuICAgIHk6bnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogU3RvcmVzIHBvc2l0aW9uIHJvdGF0aW9uIChkZWdyZWVzKSBhbmQgc2NhbGVcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xyXG4gICAgY29uc3RydWN0b3IocG9zPyA6VmVjdG9yMiwgcm90PyA6bnVtYmVyLCBzY2FsZT8gOlZlY3RvcjIpe1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gICA9IHBvcyA/IHBvcyAgICAgOiBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gICA9IHJvdCA/IHJvdCAgICAgOiAwO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgICAgICA9IHNjYWxlID8gc2NhbGUgOiBuZXcgVmVjdG9yMigxLDEpO1xyXG4gICAgfVxyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7XHJcbiAgICByb3RhdGlvbjogbnVtYmVyO1xyXG4gICAgc2NhbGU6IFZlY3RvcjI7XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVuZGVyaW5nIGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcbmltcG9ydCAqIGFzIENvbmZpZyBmcm9tIFwiLi8uLi9lbmdpbmVDb25maWdcIjtcclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4vc2NlbmVcIjtcclxuaW1wb3J0IHtLZXlib2FyZElucHV0fSBmcm9tIFwiLi8uLi9lbmdpbmUvaW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgdmFyIGFjdGl2ZVNjZW5lIDogU2NlbmUgfCB1bmRlZmluZWRcclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHNjZW5lIHlvdSB3YW50IHRvIGJlIGN1cnJlbnRseSBkaXNwbGF5ZWQgYW5kIHVwZGF0ZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3RpdmVTY2VuZShzY2VuZSA6U2NlbmUpe1xyXG4gICAgYWN0aXZlU2NlbmUgPSBzY2VuZTtcclxufVxyXG4vKipcclxuICogSW5pdGlhbGl6ZSB0aGUgZW5naW5lXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgUmVuZGVyaW5nLmluaXQoKTtcclxuICAgIEtleWJvYXJkSW5wdXQuaW5pdCgpO1xyXG5cclxuICAgIHNldEludGVydmFsKHVwZGF0ZSwxMDAwL0NvbmZpZy5mcHMpO1xyXG59XHJcbi8qKlxyXG4gKiBEb24ndCB1c2UgZXh0ZXJuYWx5LlxyXG4gKiBDYWxscyBvblVwZGF0ZSBhbmQgb25SZW5kZXIgbWV0aG9kc1xyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlKCl7XHJcbiAgICBpZihhY3RpdmVTY2VuZT8ub25VcGRhdGUpXHJcbiAgICAgICAgYWN0aXZlU2NlbmUub25VcGRhdGUoKTtcclxuICAgIGFjdGl2ZVNjZW5lPy51cGRhdGUoKTtcclxuXHJcbiAgICBSZW5kZXJpbmcucmVuZGVyKCk7XHJcbn0iLCIvKipcclxuICogTW9zdCBvZiBrZXlzIHByZXNlbnQgb24gdGhlIGtleWJvYXJkIGFzIGEgc3RyaW5nIHVuaW9uLiBQbGVhc2UgcmVwb3J0IGFueSBtaXNzaW5nIGtleXMuXHJcbiAqL1xyXG50eXBlIEtleSA9IFwiVGFiXCIgfCBcIkFsdFwiIHwgXCJBbHRHcmFwaFwiIHwgXCJCYWNrc3BhY2VcIiB8IFwiQ29udHJvbFwiIHxcIlNoaWZ0XCIgfCBcIlNwYWNlXCIgfCBcIkNvbnRleHRNZW51XCIgfCBcIkVudGVyXCIgfCBcIk51bUxvY2tcIiB8IFwiSG9tZVwiIHwgXCJQYWdlVXBcIiB8IFwiUGFnZURvd25cIiB8IFwiSW5zZXJ0XCIgfCBcIkRlbGV0ZVwiIHwgXCJBcnJvd1VwXCIgfCBcIkFycm93RG93blwiIHwgXCJBcnJvd1JpZ2h0XCIgfCBcIkFycm93TGVmdFwiIHxcIiFcIiB8IFwiXFxcIlwifCBcIiNcIiB8IFwiJFwiIHwgXCIlXCIgfCBcIiZcIiB8IFwiJ1wiIHwgXCIoXCIgfCBcIilcIiB8IFwiKlwiIHwgXCIrXCIgfCBcIixcIiB8IFwiLVwiIHwgXCIuXCIgfCBcIi9cIiB8IFwiMFwiIHwgXCIxXCIgfCBcIjJcIiB8IFwiM1wiIHwgXCI0XCIgfCBcIjVcIiB8IFwiNlwiIHwgXCI3XCIgfCBcIjhcIiB8IFwiOVwiIHwgXCI6XCIgfCBcIjtcIiB8IFwiPFwiIHwgXCI9XCIgfCBcIj5cIiB8IFwiP1wiIHwgXCJAXCIgfCBcIkFcIiB8IFwiQlwiIHwgXCJDXCIgfCBcIkRcIiB8IFwiRVwiIHwgXCJGXCIgfCBcIkdcIiB8IFwiSFwiIHwgXCJJXCIgfCBcIkpcIiB8IFwiS1wiIHwgXCJMXCIgfCBcIk1cIiB8IFwiTlwiIHwgXCJPXCIgfCBcIlBcIiB8IFwiUVwiIHwgXCJSXCIgfCBcIlNcIiB8IFwiVFwiIHwgXCJVXCIgfCBcIlZcIiB8IFwiV1wiIHwgXCJYXCIgfCBcIllcIiB8IFwiWlwiIHwgXCJbXCIgfCBcIlxcXFxcIiB8IFwiXVwiIHwgXCJeXCIgfCBcIl9cIiB8IFwiYFwiIHwgXCJhXCIgfCBcImJcIiB8IFwiY1wiIHwgXCJkXCIgfCBcImVcIiB8IFwiZlwiIHwgXCJnXCIgfCBcImhcIiB8IFwiaVwiIHwgXCJqXCIgfCBcImtcIiB8IFwibFwiIHwgXCJtXCIgfCBcIm5cIiB8IFwib1wiIHwgXCJwXCIgfCBcInFcIiB8IFwiclwiIHwgXCJzXCIgfCBcInRcIiB8IFwidVwiIHwgXCJ2XCIgfCBcIndcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInpcIiB8IFwie1wiIHwgXCJ8XCIgfCBcIn1cIiB8IFwiflwiIDtcclxuXHJcbmV4cG9ydCBjbGFzcyBLZXlib2FyZElucHV0e1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJzIGZvciBrZXkgcHJlc3Nlcy5cclxuICAgICAqIEFsbHJlYWR5IGNhbGxlZCBieSB0aGUgaW5pdCBmdW5jdGlvbiBmcm9tIGNvcmUudHNcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcyA9IG5ldyBNYXA8S2V5LGJvb2xlYW4+KCk7XHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwoZSk9PnsgICAgICAgICAgICBcclxuICAgICAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMuc2V0KEtleWJvYXJkSW5wdXQuc3RyaW5nVG9LZXkoZS5rZXkpLHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLChlKT0+ey1cclxuICAgICAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMuc2V0KEtleWJvYXJkSW5wdXQuc3RyaW5nVG9LZXkoZS5rZXkpLGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgZm9yIHByZXNzZWQga2V5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpc1ByZXNzZWQoa2V5OiBLZXkpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMua2V5U3RhdGVzLmdldChrZXkpXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGtleVN0YXRlczogTWFwPEtleSxib29sZWFuPjtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzdHJpbmdUb0tleShrZXkgOnN0cmluZyl7ICAgICAgICBcclxuICAgICAgICBsZXQgdmFsID0ga2V5LnJlcGxhY2UoXCJEZWFkXCIsXCJ+XCIpO1xyXG4gICAgICAgIHZhbCA9IHZhbC5yZXBsYWNlKFwiIFwiLFwiU3BhY2VcIik7XHJcbiAgICAgICAgbGV0IGtleXR5cGUgPSB2YWwgIGFzIEtleTtcclxuICAgICAgICByZXR1cm4ga2V5dHlwZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7VmVjdG9yMixUcmFuc2Zvcm19IGZyb20gXCIuL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtjdHh9IGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcblxyXG4vKipcclxuICogQmFzZSBmb3IgY2hpbGRyZW4gcG9seW1vcnBoaXNtXHJcbiAqIEltcGxlbWVudCB0aGlzIGludGVyZmFjZSB3aGVuIGNyZWF0aW5nIGEgY29tcG9uZW50IC8gY2hpbGQuXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdDJEIHtcclxuICAgIC8vSGFwcGVucyBldmVyeSB0aWNrXHJcbiAgICBvblVwZGF0ZSgpIDp2b2lkOyBcclxuICAgIC8vQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXHJcbiAgICBvblJlbmRlcigpIDp2b2lkOyBcclxuICAgIGFmdGVyUmVuZGVyKCkgOnZvaWQ7IFxyXG5cclxuICAgIG9yaWdpbjogVHJhbnNmb3JtOyAgICBcclxuICAgIGNoaWxkcmVuOiBBcnJheTxPYmplY3QyRD47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCYXNlIGZvciBjaGlsZHJlbiB0aGF0IHdhbnQgdG8gcmVuZGVyIHNvbWV0aGluZy5cclxuICogRXh0ZW5kIHRoaXMgY2xhc3MgZm9yIGN0eCBhY2Nlc3MgYW5kIG9yaWdpbiB0cmFuc2Zvcm0gaGFuZGVsaW5nLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERyYXdhYmxlIGltcGxlbWVudHMgT2JqZWN0MkQge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLm9yaWdpbiA9IG5ldyBUcmFuc2Zvcm0oKTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy5jdHggPSBjdHg7XHJcbiAgICAgICAgdGhpcy51c2VfbG9jYWxfY29vcmRpbmF0ZXMgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9yaWdpbl9pbl9jZW50ZXIgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XHJcbiAgICAgKi9cclxuICAgIG9uVXBkYXRlKCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XHJcbiAgICAgKiBDYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgICAqL1xyXG4gICAgb25SZW5kZXIoKXsgICAgICAgICBcclxuICAgICAgICB0aGlzLmN0eCA9IGN0eDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLSh0aGlzLm9yaWdpbi5zY2FsZS54LzIpLC0odGhpcy5vcmlnaW4uc2NhbGUueS8yKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSh0aGlzLm9yaWdpbi5wb3NpdGlvbi54LHRoaXMub3JpZ2luLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSh0aGlzLm9yaWdpbi5zY2FsZS54LzIsdGhpcy5vcmlnaW4uc2NhbGUueS8yKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICAgICB0aGlzLmN0eC5yb3RhdGUodGhpcy5vcmlnaW4ucm90YXRpb24gKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLSh0aGlzLm9yaWdpbi5zY2FsZS54LzIpLC0odGhpcy5vcmlnaW4uc2NhbGUueS8yKSk7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICB0aGlzLmN0eC5zY2FsZSh0aGlzLm9yaWdpbi5zY2FsZS54LHRoaXMub3JpZ2luLnNjYWxlLnkpOyAgICAgIFxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICogQ2FsbGVkIGFmdGVyIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgICAqL1xyXG4gICAgYWZ0ZXJSZW5kZXIoKXsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIERyYXdhYmxlICYmICFjaGlsZC51c2VfbG9jYWxfY29vcmRpbmF0ZXMpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zY2FsZSgxL3RoaXMub3JpZ2luLnNjYWxlLngsMS90aGlzLm9yaWdpbi5zY2FsZS55KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjaGlsZC5vblJlbmRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvcmlnaW46IFRyYW5zZm9ybTsgICAgXHJcbiAgICBjaGlsZHJlbjogQXJyYXk8T2JqZWN0MkQ+O1xyXG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICB1c2VfbG9jYWxfY29vcmRpbmF0ZXM6IGJvb2xlYW47XHJcbiAgICBvcmlnaW5faW5fY2VudGVyOiBib29sZWFuO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIENvbmZpZyBmcm9tIFwiLi8uLi9lbmdpbmVDb25maWdcIjtcclxuaW1wb3J0IHthY3RpdmVTY2VuZX0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IHZhciBjdHggOkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxudmFyIGNhbnZhcyA6SFRNTENhbnZhc0VsZW1lbnQ7XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyB0aGUgY2FudmFzIGNvbnRleHQuXHJcbiAqIEFsbHJlYWR5IGNhbGxlZCBieSB0aGUgaW5pdCBmdW5jdGlvbiBmcm9tIGNvcmUudHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCl7XHJcbiAgICBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKENvbmZpZy5jYW52YXNTZWxlY3RvcikhIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZXMgdmlld3BvcnQgc2l6ZSxcclxuICogY2FsbHMgYWxsIHRoZSBvblJlbmRlciBtZXRob2RzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKCl7ICBcclxuICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgICBcclxuICAgIGFjdGl2ZVNjZW5lPy5yZW5kZXIoKTtcclxufSIsImltcG9ydCB7RHJhd2FibGUsIE9iamVjdDJEfSBmcm9tIFwiLi9vYmplY3QyRFwiXHJcbmltcG9ydCB7Y3R4fSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5cclxuLyoqXHJcbiAqIFJvb3QgZm9yIGFsbCB0aGUgZWxlbWVudHMgaW5zaWRlIHlvdXIgbGV2ZWwuXHJcbiAqIE9iamVjdHMgbm90IGEgbWVtYmVyIG9mIHRoZSBhY3RpdmUgc2NlbmUgd29udCBiZSBjYWxsZWQgdmlhIG9uVXBkYXRlIGFuZCBvblJlbmRlci5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTY2VuZXtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5tZW1iZXJzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCl7XHJcbiAgICAgICAgdGhpcy5tZW1iZXJzLmZvckVhY2goY2hpbGQ9PntcclxuICAgICAgICAgICAgY2hpbGQub25VcGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub25VcGRhdGUpXHJcbiAgICAgICAgICAgIHRoaXMub25VcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICB0aGlzLm1lbWJlcnMuZm9yRWFjaChjaGlsZD0+e1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjaGlsZC5vblJlbmRlcigpO1xyXG4gICAgICAgICAgICBjaGlsZC5hZnRlclJlbmRlcigpO1xyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSAgIFxyXG5cclxuICAgIG9uVXBkYXRlOiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcclxuICAgIG1lbWJlcnM6IEFycmF5PE9iamVjdDJEPjtcclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHsgd29ybGQsV29ybGRTaXplIH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhcnRpY2xle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgdGhpcy53ZWlnaHQgPSAxO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGVwKCkge1xyXG4gICAgICAgIC8vXHJcbiAgICB9O1xyXG5cclxuICAgIHRyeU1vdmUocmVsYXRpdmVQb3M6IFZlY3RvcjIpIDpib29sZWFue1xyXG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueSA+PSBXb3JsZFNpemUueSB8fCB0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueCA+PSBXb3JsZFNpemUueCB8fFxyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueSA8IDAgfHwgdGhpcy5wb3NpdGlvbi54K3JlbGF0aXZlUG9zLnggPCAwICkgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXQgIT0gdW5kZWZpbmVkKSB7IFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCArPSByZWxhdGl2ZVBvcy54OyBcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHJlbGF0aXZlUG9zLnk7IFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgd2VpZ2h0OiBudW1iZXI7XHJcbiAgICBwb3NpdGlvbjogVmVjdG9yMjsgXHJcbiAgICB2ZWxvY2l0eTogVmVjdG9yMjsgICAgXHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG59XHJcblxyXG4vLzQgQmFzZSBwYXJ0aWNsZSB0eXBlcyBTb2xpZCBQb3dkZXIgRmx1aWQgR2FzXHJcblxyXG5leHBvcnQgY2xhc3MgU29saWQgZXh0ZW5kcyBQYXJ0aWNsZXtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xyXG4gICAgICAgIHN1cGVyKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gXCJncmF5XCI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpe1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUG93ZGVyIGV4dGVuZHMgUGFydGljbGV7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICBzdXBlcihwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IFwieWVsbG93XCI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpe1xyXG4gICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDAsMSkpKSB7IFxyXG4gICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHtXb3JsZCxXb3JsZFNpemUsY3R4fSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtQYXJ0aWNsZX0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuXHJcbmludGVyZmFjZSBQaHlzaWNze1xyXG5cclxuICAgIHN0ZXAoc2ltX3N0YXRlOiBXb3JsZCk6V29ybGQ7XHJcblxyXG59XHJcblxyXG5jbGFzcyBCYXNpY1BoeXNpY3MgaW1wbGVtZW50cyBQaHlzaWNze1xyXG5cclxuICAgIHN0ZXAoc2ltX3N0YXRlOiBXb3JsZCl7XHJcblxyXG4gICAgICAgIGZvcihsZXQgcGFydCBvZiBzaW1fc3RhdGUpe1xyXG4gICAgICAgICAgICBwYXJ0Py5zdGVwKCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3N5bmNocm9uaXplIHdvcmxkIHBvc2l0aW9uIHdpdGggbWF0cml4IHBvc2l0aW9uXHJcbiAgICAgICAgdGhpcy5tYXRyaXhTeW5jKHNpbV9zdGF0ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzaW1fc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgbWF0cml4U3luYyhzaW1fc3RhdGUgOiBXb3JsZCl7XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBXb3JsZFNpemUueTsgeSsrKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgV29ybGRTaXplLng7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcnQgPSBzaW1fc3RhdGUucGFydGljbGVzW3ldW3hdXHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXBhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghKHBhcnQucG9zaXRpb24ueCA9PSB4ICYmIHBhcnQucG9zaXRpb24ueSA9PSB5KSkgXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChwYXJ0LnBvc2l0aW9uLnkpIDwgV29ybGRTaXplLnkgJiYgKHBhcnQucG9zaXRpb24ueCkgPCBXb3JsZFNpemUueCkgeyAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydC5wb3NpdGlvbiA9IG5ldyBWZWN0b3IyKHgseSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0LnN0ZXAoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1t5XVt4XSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbV9zdGF0ZS5wYXJ0aWNsZXNbKHBhcnQucG9zaXRpb24ueSldWyhwYXJ0LnBvc2l0aW9uLngpXSA9IHBhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgUGh5c2ljcyA9IG5ldyBCYXNpY1BoeXNpY3MoKTsiLCJpbXBvcnQge1dvcmxkLFdvcmxkU2l6ZSxjdHgsd29ybGR9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuXHJcbmludGVyZmFjZSBSZW5kZXJlcntcclxuXHJcbiAgICBkcmF3RnJhbWUoc2ltX3N0YXRlOiBXb3JsZCkgOiB2b2lkO1xyXG5cclxufVxyXG5cclxuY2xhc3MgQ2FudmFzUmVuZGVyZXIgaW1wbGVtZW50cyBSZW5kZXJlcntcclxuXHJcbiAgICBkcmF3RnJhbWUoc2ltX3N0YXRlOiBXb3JsZCl7XHJcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHNpbV9zdGF0ZSl7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBhcnQpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuIFxyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gcGFydC5jb2xvcjtcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHBhcnQucG9zaXRpb24ueCxwYXJ0LnBvc2l0aW9uLnksMSwxKTsgLy9kcmF3IHJlY3RhbmdsZSA6UFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBSZW5kZXJlciA9IG5ldyBDYW52YXNSZW5kZXJlcigpOyIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtEcmF3YWJsZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9vYmplY3QyRFwiO1xyXG5pbXBvcnQge1BhcnRpY2xlfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5pbXBvcnQge1JlbmRlcmVyfSBmcm9tIFwiLi9yZW5kZXJcIjtcclxuaW1wb3J0IHtQaHlzaWNzfSBmcm9tIFwiLi9waHlzaWNzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgV29ybGRTaXplID0gbmV3IFZlY3RvcjIoNTAwLDUwMCk7XHJcblxyXG5leHBvcnQgdmFyIGN0eDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGR7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3IEFycmF5KFdvcmxkU2l6ZS55KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucGFydGljbGVzLmxlbmd0aDsgaW5kZXgrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlc1tpbmRleF0gPSBuZXcgQXJyYXkoV29ybGRTaXplLngpLmZpbGwodW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9JdHRlcmF0b3JcclxuICAgIHByaXZhdGUgZ2V0SXR0ZXJWYWwoaSA6IG51bWJlcil7IFxyXG4gICAgICAgIGxldCB4ID0gTWF0aC5mbG9vcihpL1dvcmxkU2l6ZS54KTtcclxuICAgICAgICBsZXQgeSA9IGkgLSBNYXRoLmZsb29yKGkvV29ybGRTaXplLngpKldvcmxkU2l6ZS54O1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gdGhpcy5wYXJ0aWNsZXNbeV1beF07XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIFtTeW1ib2wuaXRlcmF0b3JdID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICByZXR1cm57XHJcbiAgICAgICAgICAgIG5leHQ6KCk9PntcclxuICAgICAgICAgICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgICAgICAgICBkb25lOiAoaSA+PSBXb3JsZFNpemUueCAqIFdvcmxkU2l6ZS55KSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5nZXRJdHRlclZhbChpKyspICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcGFydGljbGVzOkFycmF5PEFycmF5PFBhcnRpY2xlIHwgdW5kZWZpbmVkPj47XHJcblxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgd29ybGQgPSBuZXcgV29ybGQoKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZE1hbmFnZXIgZXh0ZW5kcyBEcmF3YWJsZXsgIFxyXG4gICAgb25VcGRhdGUoKXsgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25SZW5kZXIoKXtcclxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xyXG5cclxuICAgICAgICAvL2RvIHBoeXNpY3NcclxuICAgICAgICBQaHlzaWNzLnN0ZXAod29ybGQpO1xyXG5cclxuICAgICAgICAvL3JlbmRlciBldmVyeXRoaW5nXHJcbiAgICAgICAgY3R4ID0gdGhpcy5jdHg7XHJcbiAgICAgICAgUmVuZGVyZXIuZHJhd0ZyYW1lKHdvcmxkKTtcclxuICAgIH0gICAgXHJcblxyXG5cclxuICAgIGFkZFBhcnQocGFydDogUGFydGljbGUpeyAgICAgICAgXHJcbiAgICAgICAgd29ybGQucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHBhcnQ7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuXHJcbi8vVE9ETzogTXVsdGl0aHJlYWRpbmcgaWYgaSBmYW5jeVxyXG4vKlxyXG51c2UgdGhpcyB0byB0ZXN0IGlmIHN1cHBvcnRlZFxyXG5cclxuaWYgKHR5cGVvZihXb3JrZXIpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgIC8vZ3JlYXQsIHlvdXIgYnJvd3NlciBzdXBwb3J0cyB3ZWIgd29ya2Vyc1xyXG59IGVsc2Uge1xyXG4gICAvL25vdCBzdXBwb3J0ZWRcclxufVxyXG5cclxuKi8iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCAqIGFzIENFIGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvY29yZVwiO1xyXG5cclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zY2VuZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcblxyXG5pbXBvcnQge3dvcmxkLCBXb3JsZE1hbmFnZXIsY3R4fSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5pbXBvcnQge0tleWJvYXJkSW5wdXR9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvaW5wdXRcIjtcclxuXHJcbmltcG9ydCB7IFBvd2RlciwgU29saWQgfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5cclxuLy9jcmVhdGUgc2NlbmVcclxubGV0IGxldmVsID0gbmV3IFNjZW5lKCk7XHJcbmxldCB3b3JsZF9tYW5hZ2VyID0gbmV3IFdvcmxkTWFuYWdlcigpO1xyXG53aW5kb3cub25sb2FkID0gKCk9PntcclxuICAgIC8vaW5pdCBlbmdpbmVcclxuICAgIENFLmluaXQoKTtcclxuICAgIC8vYmluZCBzY2VuZVxyXG4gICAgQ0Uuc2V0QWN0aXZlU2NlbmUobGV2ZWwpO1xyXG4gICAgXHJcbiAgICBsZXZlbC5tZW1iZXJzLnB1c2god29ybGRfbWFuYWdlcik7XHJcbiAgICB3b3JsZF9tYW5hZ2VyLm9yaWdpbi5zY2FsZSA9IG5ldyBWZWN0b3IyKDEwLDEwKTtcclxuXHJcblxyXG4gICAgLy93b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFBvd2RlcihuZXcgVmVjdG9yMig4MCwwKSkpOyAgXHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDE4MDsgeCA8IDIwMDsgeCsrKSB7ICAgICBcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDIwMDsgeSsrKSB7ICAgICBcclxuICAgICAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBQb3dkZXIobmV3IFZlY3RvcjIoeCx5KSkpOyAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTAwOyB4KyspIHsgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4KzkwLHgrMjAwKSkpOyAgICBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKHgrOTAseCsyMDEpKSk7ICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDA7IHgrKykgeyBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzI5MCx4KzIwMCkpKTsgICAgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsyOTAseCsyMDEpKSk7ICAgICAgXHJcbiAgICB9XHJcblxyXG4gXHJcbn07XHJcblxyXG4vL3J1bnMgZXZlcnkgdGljayBcclxubGV2ZWwub25VcGRhdGUgPSAoKT0+e1xyXG5cclxuXHRcclxufTsgIl0sInNvdXJjZVJvb3QiOiIifQ==