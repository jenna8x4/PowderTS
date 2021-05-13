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
var fps = 30;
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Powder = exports.Solid = void 0;
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var Solid = /** @class */ (function () {
    function Solid(position) {
        this.weight = 1;
        this.position = position;
        this.velocity = new base_types_1.Vector2(0, 0);
        this.color = "gray";
    }
    Solid.prototype.step = function () {
        this.velocity = new base_types_1.Vector2(0, 0);
    };
    return Solid;
}());
exports.Solid = Solid;
var Powder = /** @class */ (function () {
    function Powder(position) {
        this.weight = 1;
        this.position = position;
        this.gridPos = new base_types_1.Vector2(Math.round(this.position.x), Math.round(this.position.y));
        this.velocity = new base_types_1.Vector2(0, 0);
        this.color = "yellow";
    }
    Powder.prototype.tryMove = function (relativePos) {
        if (this.position.y + relativePos.y >= world_manager_1.WorldSize.y || this.position.x + relativePos.x >= world_manager_1.WorldSize.x)
            return false;
        if (!world_manager_1.world.particles[this.position.y + relativePos.y][this.position.x + relativePos.x]) {
            this.position.x += relativePos.x;
            this.position.y += relativePos.y;
            return true;
        }
        return false;
    };
    Powder.prototype.step = function () {
        this.gridPos = new base_types_1.Vector2(Math.round(this.position.x), Math.round(this.position.y));
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
}());
exports.Powder = Powder;


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
exports.WorldSize = new base_types_1.Vector2(500, 500);
var World = /** @class */ (function () {
    function World() {
        this.particles = new Array(exports.WorldSize.y);
        for (var index = 0; index < this.particles.length; index++) {
            this.particles[index] = new Array(exports.WorldSize.x);
        }
    }
    return World;
}());
exports.World = World;
exports.world = new World();
//TODO: Multithreading lol
/*
use this to test if supported

if (typeof(Worker) !== "undefined") {
   //great, your browser supports web workers
} else {
   //not supported
}

*/
var WorldManager = /** @class */ (function (_super) {
    __extends(WorldManager, _super);
    function WorldManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorldManager.prototype.onUpdate = function () {
    };
    WorldManager.prototype.onRender = function () {
        _super.prototype.onRender.call(this);
        exports.ctx = this.ctx;
        for (var y = 0; y < exports.WorldSize.y; y++) {
            for (var x = 0; x < exports.WorldSize.x; x++) {
                var part = exports.world.particles[y][x];
                if (!part)
                    continue;
                exports.ctx.fillStyle = part.color;
                exports.ctx.fillRect(x, y, 1, 1); //draw rectangle :P
            }
        }
        this.physicsStep();
    };
    WorldManager.prototype.physicsStep = function () {
        //run particle physics
        for (var y = 0; y < exports.WorldSize.y; y++) {
            for (var x = 0; x < exports.WorldSize.x; x++) {
                var part = exports.world.particles[y][x];
                part === null || part === void 0 ? void 0 : part.step();
            }
        }
        //synchronize world position with matrix position
        this.matrixSync();
    };
    WorldManager.prototype.matrixSync = function () {
        var bufferWorld = exports.world;
        for (var y = 0; y < exports.WorldSize.y; y++) {
            for (var x = 0; x < exports.WorldSize.x; x++) {
                var part = exports.world.particles[y][x];
                if (!part)
                    continue;
                if (part.position.x == x && part.position.y == y)
                    continue;
                bufferWorld.particles[y][x] = undefined;
                if (Math.round(part.position.y) < exports.WorldSize.y && Math.round(part.position.x) < exports.WorldSize.x) {
                    bufferWorld.particles[Math.round(part.position.y)][Math.round(part.position.x)] = part;
                }
            }
        }
        exports.world = bufferWorld;
    };
    WorldManager.prototype.addPart = function (part) {
        exports.world.particles[part.position.y][part.position.x] = part;
    };
    return WorldManager;
}(object2D_1.Drawable));
exports.WorldManager = WorldManager;


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
    for (var x = 0; x < 200; x++) {
        for (var y = 0; y < 200; y++) {
            world_manager.addPart(new particle_1.Powder(new base_types_1.Vector2(x, y)));
        }
    }
};
//runs every tick 
level.onUpdate = function () {
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BhcnRpY2xlLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS93b3JsZF9tYW5hZ2VyLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL2dhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0VBQ0U7QUFDRixJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUM7QUFNM0Isd0NBQWM7QUFMbEI7RUFDRTtBQUNGLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUlULGtCQUFHOzs7Ozs7Ozs7Ozs7OztBQ1RQOzs7RUFHRTtBQUNGO0lBQ0ksaUJBQVksQ0FBUyxFQUFDLENBQVM7UUFDM0IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFHTCxjQUFDO0FBQUQsQ0FBQztBQVBZLDBCQUFPO0FBU3BCOztHQUVHO0FBQ0g7SUFDSSxtQkFBWSxHQUFhLEVBQUUs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LDhFQUEyQztBQUUzQyxjQUFjO0FBQ2QsSUFBSSxLQUFLLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztBQUN4QixJQUFJLGFBQWEsR0FBRyxJQUFJLDRCQUFZLEVBQUUsQ0FBQztBQUN2QyxNQUFNLENBQUMsTUFBTSxHQUFHO0lBQ1osYUFBYTtJQUNiLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNWLFlBQVk7SUFDWixFQUFFLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXpCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2xDLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksb0JBQU8sQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7SUFJaEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzFCLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxpQkFBTSxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZEO0tBQ0o7QUFHTCxDQUFDLENBQUM7QUFFRixrQkFBa0I7QUFDbEIsS0FBSyxDQUFDLFFBQVEsR0FBRztBQUdqQixDQUFDLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqUXVlcnJ5IHNlbGVjdG9yIGZvciB0aGUgY2FudmFzIGVsZW1lbnRcclxuKi9cclxuY29uc3QgY2FudmFzU2VsZWN0b3IgPSBcIiNnYW1lXCI7XHJcbi8qKlRhcmdldCBmcmFtZXMgcGVyIHNlY29uZFxyXG4qL1xyXG52YXIgZnBzID0gMzA7XHJcblxyXG5leHBvcnQge1xyXG4gICAgY2FudmFzU2VsZWN0b3IsICAgIFxyXG4gICAgZnBzXHJcbn0iLCIvKipcclxuICogMkQgVmVjdG9yXHJcbiAqIFN0b3JlcyBYIGFuZCBZXHJcbiovXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IyICB7XHJcbiAgICBjb25zdHJ1Y3RvcihYIDpudW1iZXIsWSA6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnggPSBYO1xyXG4gICAgICAgIHRoaXMueSA9IFk7XHJcbiAgICB9XHJcbiAgICB4Om51bWJlcjtcclxuICAgIHk6bnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogU3RvcmVzIHBvc2l0aW9uIHJvdGF0aW9uIChkZWdyZWVzKSBhbmQgc2NhbGVcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xyXG4gICAgY29uc3RydWN0b3IocG9zPyA6VmVjdG9yMiwgcm90PyA6bnVtYmVyLCBzY2FsZT8gOlZlY3RvcjIpe1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gICA9IHBvcyA/IHBvcyAgICAgOiBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gICA9IHJvdCA/IHJvdCAgICAgOiAwO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgICAgICA9IHNjYWxlID8gc2NhbGUgOiBuZXcgVmVjdG9yMigxLDEpO1xyXG4gICAgfVxyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7XHJcbiAgICByb3RhdGlvbjogbnVtYmVyO1xyXG4gICAgc2NhbGU6IFZlY3RvcjI7XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVuZGVyaW5nIGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcbmltcG9ydCAqIGFzIENvbmZpZyBmcm9tIFwiLi8uLi9lbmdpbmVDb25maWdcIjtcclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4vc2NlbmVcIjtcclxuaW1wb3J0IHtLZXlib2FyZElucHV0fSBmcm9tIFwiLi8uLi9lbmdpbmUvaW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgdmFyIGFjdGl2ZVNjZW5lIDogU2NlbmUgfCB1bmRlZmluZWRcclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHNjZW5lIHlvdSB3YW50IHRvIGJlIGN1cnJlbnRseSBkaXNwbGF5ZWQgYW5kIHVwZGF0ZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3RpdmVTY2VuZShzY2VuZSA6U2NlbmUpe1xyXG4gICAgYWN0aXZlU2NlbmUgPSBzY2VuZTtcclxufVxyXG4vKipcclxuICogSW5pdGlhbGl6ZSB0aGUgZW5naW5lXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgUmVuZGVyaW5nLmluaXQoKTtcclxuICAgIEtleWJvYXJkSW5wdXQuaW5pdCgpO1xyXG5cclxuICAgIHNldEludGVydmFsKHVwZGF0ZSwxMDAwL0NvbmZpZy5mcHMpO1xyXG59XHJcbi8qKlxyXG4gKiBEb24ndCB1c2UgZXh0ZXJuYWx5LlxyXG4gKiBDYWxscyBvblVwZGF0ZSBhbmQgb25SZW5kZXIgbWV0aG9kc1xyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlKCl7XHJcbiAgICBpZihhY3RpdmVTY2VuZT8ub25VcGRhdGUpXHJcbiAgICAgICAgYWN0aXZlU2NlbmUub25VcGRhdGUoKTtcclxuICAgIGFjdGl2ZVNjZW5lPy51cGRhdGUoKTtcclxuXHJcbiAgICBSZW5kZXJpbmcucmVuZGVyKCk7XHJcbn0iLCIvKipcclxuICogTW9zdCBvZiBrZXlzIHByZXNlbnQgb24gdGhlIGtleWJvYXJkIGFzIGEgc3RyaW5nIHVuaW9uLiBQbGVhc2UgcmVwb3J0IGFueSBtaXNzaW5nIGtleXMuXHJcbiAqL1xyXG50eXBlIEtleSA9IFwiVGFiXCIgfCBcIkFsdFwiIHwgXCJBbHRHcmFwaFwiIHwgXCJCYWNrc3BhY2VcIiB8IFwiQ29udHJvbFwiIHxcIlNoaWZ0XCIgfCBcIlNwYWNlXCIgfCBcIkNvbnRleHRNZW51XCIgfCBcIkVudGVyXCIgfCBcIk51bUxvY2tcIiB8IFwiSG9tZVwiIHwgXCJQYWdlVXBcIiB8IFwiUGFnZURvd25cIiB8IFwiSW5zZXJ0XCIgfCBcIkRlbGV0ZVwiIHwgXCJBcnJvd1VwXCIgfCBcIkFycm93RG93blwiIHwgXCJBcnJvd1JpZ2h0XCIgfCBcIkFycm93TGVmdFwiIHxcIiFcIiB8IFwiXFxcIlwifCBcIiNcIiB8IFwiJFwiIHwgXCIlXCIgfCBcIiZcIiB8IFwiJ1wiIHwgXCIoXCIgfCBcIilcIiB8IFwiKlwiIHwgXCIrXCIgfCBcIixcIiB8IFwiLVwiIHwgXCIuXCIgfCBcIi9cIiB8IFwiMFwiIHwgXCIxXCIgfCBcIjJcIiB8IFwiM1wiIHwgXCI0XCIgfCBcIjVcIiB8IFwiNlwiIHwgXCI3XCIgfCBcIjhcIiB8IFwiOVwiIHwgXCI6XCIgfCBcIjtcIiB8IFwiPFwiIHwgXCI9XCIgfCBcIj5cIiB8IFwiP1wiIHwgXCJAXCIgfCBcIkFcIiB8IFwiQlwiIHwgXCJDXCIgfCBcIkRcIiB8IFwiRVwiIHwgXCJGXCIgfCBcIkdcIiB8IFwiSFwiIHwgXCJJXCIgfCBcIkpcIiB8IFwiS1wiIHwgXCJMXCIgfCBcIk1cIiB8IFwiTlwiIHwgXCJPXCIgfCBcIlBcIiB8IFwiUVwiIHwgXCJSXCIgfCBcIlNcIiB8IFwiVFwiIHwgXCJVXCIgfCBcIlZcIiB8IFwiV1wiIHwgXCJYXCIgfCBcIllcIiB8IFwiWlwiIHwgXCJbXCIgfCBcIlxcXFxcIiB8IFwiXVwiIHwgXCJeXCIgfCBcIl9cIiB8IFwiYFwiIHwgXCJhXCIgfCBcImJcIiB8IFwiY1wiIHwgXCJkXCIgfCBcImVcIiB8IFwiZlwiIHwgXCJnXCIgfCBcImhcIiB8IFwiaVwiIHwgXCJqXCIgfCBcImtcIiB8IFwibFwiIHwgXCJtXCIgfCBcIm5cIiB8IFwib1wiIHwgXCJwXCIgfCBcInFcIiB8IFwiclwiIHwgXCJzXCIgfCBcInRcIiB8IFwidVwiIHwgXCJ2XCIgfCBcIndcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInpcIiB8IFwie1wiIHwgXCJ8XCIgfCBcIn1cIiB8IFwiflwiIDtcclxuXHJcbmV4cG9ydCBjbGFzcyBLZXlib2FyZElucHV0e1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJzIGZvciBrZXkgcHJlc3Nlcy5cclxuICAgICAqIEFsbHJlYWR5IGNhbGxlZCBieSB0aGUgaW5pdCBmdW5jdGlvbiBmcm9tIGNvcmUudHNcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcyA9IG5ldyBNYXA8S2V5LGJvb2xlYW4+KCk7XHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwoZSk9PnsgICAgICAgICAgICBcclxuICAgICAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMuc2V0KEtleWJvYXJkSW5wdXQuc3RyaW5nVG9LZXkoZS5rZXkpLHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLChlKT0+ey1cclxuICAgICAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMuc2V0KEtleWJvYXJkSW5wdXQuc3RyaW5nVG9LZXkoZS5rZXkpLGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgZm9yIHByZXNzZWQga2V5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpc1ByZXNzZWQoa2V5OiBLZXkpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMua2V5U3RhdGVzLmdldChrZXkpXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGtleVN0YXRlczogTWFwPEtleSxib29sZWFuPjtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzdHJpbmdUb0tleShrZXkgOnN0cmluZyl7ICAgICAgICBcclxuICAgICAgICBsZXQgdmFsID0ga2V5LnJlcGxhY2UoXCJEZWFkXCIsXCJ+XCIpO1xyXG4gICAgICAgIHZhbCA9IHZhbC5yZXBsYWNlKFwiIFwiLFwiU3BhY2VcIik7XHJcbiAgICAgICAgbGV0IGtleXR5cGUgPSB2YWwgIGFzIEtleTtcclxuICAgICAgICByZXR1cm4ga2V5dHlwZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7VmVjdG9yMixUcmFuc2Zvcm19IGZyb20gXCIuL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtjdHh9IGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcblxyXG4vKipcclxuICogQmFzZSBmb3IgY2hpbGRyZW4gcG9seW1vcnBoaXNtXHJcbiAqIEltcGxlbWVudCB0aGlzIGludGVyZmFjZSB3aGVuIGNyZWF0aW5nIGEgY29tcG9uZW50IC8gY2hpbGQuXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdDJEIHtcclxuICAgIC8vSGFwcGVucyBldmVyeSB0aWNrXHJcbiAgICBvblVwZGF0ZSgpIDp2b2lkOyBcclxuICAgIC8vQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXHJcbiAgICBvblJlbmRlcigpIDp2b2lkOyBcclxuICAgIGFmdGVyUmVuZGVyKCkgOnZvaWQ7IFxyXG5cclxuICAgIG9yaWdpbjogVHJhbnNmb3JtOyAgICBcclxuICAgIGNoaWxkcmVuOiBBcnJheTxPYmplY3QyRD47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCYXNlIGZvciBjaGlsZHJlbiB0aGF0IHdhbnQgdG8gcmVuZGVyIHNvbWV0aGluZy5cclxuICogRXh0ZW5kIHRoaXMgY2xhc3MgZm9yIGN0eCBhY2Nlc3MgYW5kIG9yaWdpbiB0cmFuc2Zvcm0gaGFuZGVsaW5nLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERyYXdhYmxlIGltcGxlbWVudHMgT2JqZWN0MkQge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLm9yaWdpbiA9IG5ldyBUcmFuc2Zvcm0oKTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy5jdHggPSBjdHg7XHJcbiAgICAgICAgdGhpcy51c2VfbG9jYWxfY29vcmRpbmF0ZXMgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9yaWdpbl9pbl9jZW50ZXIgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XHJcbiAgICAgKi9cclxuICAgIG9uVXBkYXRlKCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XHJcbiAgICAgKiBDYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgICAqL1xyXG4gICAgb25SZW5kZXIoKXsgICAgICAgICBcclxuICAgICAgICB0aGlzLmN0eCA9IGN0eDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLSh0aGlzLm9yaWdpbi5zY2FsZS54LzIpLC0odGhpcy5vcmlnaW4uc2NhbGUueS8yKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSh0aGlzLm9yaWdpbi5wb3NpdGlvbi54LHRoaXMub3JpZ2luLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSh0aGlzLm9yaWdpbi5zY2FsZS54LzIsdGhpcy5vcmlnaW4uc2NhbGUueS8yKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICAgICB0aGlzLmN0eC5yb3RhdGUodGhpcy5vcmlnaW4ucm90YXRpb24gKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLSh0aGlzLm9yaWdpbi5zY2FsZS54LzIpLC0odGhpcy5vcmlnaW4uc2NhbGUueS8yKSk7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICB0aGlzLmN0eC5zY2FsZSh0aGlzLm9yaWdpbi5zY2FsZS54LHRoaXMub3JpZ2luLnNjYWxlLnkpOyAgICAgIFxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICogQ2FsbGVkIGFmdGVyIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgICAqL1xyXG4gICAgYWZ0ZXJSZW5kZXIoKXsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIERyYXdhYmxlICYmICFjaGlsZC51c2VfbG9jYWxfY29vcmRpbmF0ZXMpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zY2FsZSgxL3RoaXMub3JpZ2luLnNjYWxlLngsMS90aGlzLm9yaWdpbi5zY2FsZS55KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjaGlsZC5vblJlbmRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvcmlnaW46IFRyYW5zZm9ybTsgICAgXHJcbiAgICBjaGlsZHJlbjogQXJyYXk8T2JqZWN0MkQ+O1xyXG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICB1c2VfbG9jYWxfY29vcmRpbmF0ZXM6IGJvb2xlYW47XHJcbiAgICBvcmlnaW5faW5fY2VudGVyOiBib29sZWFuO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIENvbmZpZyBmcm9tIFwiLi8uLi9lbmdpbmVDb25maWdcIjtcclxuaW1wb3J0IHthY3RpdmVTY2VuZX0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IHZhciBjdHggOkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxudmFyIGNhbnZhcyA6SFRNTENhbnZhc0VsZW1lbnQ7XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyB0aGUgY2FudmFzIGNvbnRleHQuXHJcbiAqIEFsbHJlYWR5IGNhbGxlZCBieSB0aGUgaW5pdCBmdW5jdGlvbiBmcm9tIGNvcmUudHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCl7XHJcbiAgICBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKENvbmZpZy5jYW52YXNTZWxlY3RvcikhIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZXMgdmlld3BvcnQgc2l6ZSxcclxuICogY2FsbHMgYWxsIHRoZSBvblJlbmRlciBtZXRob2RzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKCl7ICBcclxuICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgICBcclxuICAgIGFjdGl2ZVNjZW5lPy5yZW5kZXIoKTtcclxufSIsImltcG9ydCB7RHJhd2FibGUsIE9iamVjdDJEfSBmcm9tIFwiLi9vYmplY3QyRFwiXHJcbmltcG9ydCB7Y3R4fSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5cclxuLyoqXHJcbiAqIFJvb3QgZm9yIGFsbCB0aGUgZWxlbWVudHMgaW5zaWRlIHlvdXIgbGV2ZWwuXHJcbiAqIE9iamVjdHMgbm90IGEgbWVtYmVyIG9mIHRoZSBhY3RpdmUgc2NlbmUgd29udCBiZSBjYWxsZWQgdmlhIG9uVXBkYXRlIGFuZCBvblJlbmRlci5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTY2VuZXtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5tZW1iZXJzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCl7XHJcbiAgICAgICAgdGhpcy5tZW1iZXJzLmZvckVhY2goY2hpbGQ9PntcclxuICAgICAgICAgICAgY2hpbGQub25VcGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub25VcGRhdGUpXHJcbiAgICAgICAgICAgIHRoaXMub25VcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICB0aGlzLm1lbWJlcnMuZm9yRWFjaChjaGlsZD0+e1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjaGlsZC5vblJlbmRlcigpO1xyXG4gICAgICAgICAgICBjaGlsZC5hZnRlclJlbmRlcigpO1xyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSAgIFxyXG5cclxuICAgIG9uVXBkYXRlOiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcclxuICAgIG1lbWJlcnM6IEFycmF5PE9iamVjdDJEPjtcclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHsgd29ybGQsV29ybGRTaXplIH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQYXJ0aWNsZXtcclxuICAgIHN0ZXAoKSA6dm9pZDsgLy9QaHlzaWNzIHN0ZXBcclxuICAgIFxyXG4gICAgd2VpZ2h0OiBudW1iZXI7XHJcbiAgICBwb3NpdGlvbjogVmVjdG9yMjsgXHJcbiAgICB2ZWxvY2l0eTogVmVjdG9yMjsgICAgXHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNvbGlkIGltcGxlbWVudHMgUGFydGljbGV7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICB0aGlzLndlaWdodCA9IDE7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcImdyYXlcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICB9XHJcblxyXG4gICAgd2VpZ2h0OiBudW1iZXI7XHJcbiAgICBwb3NpdGlvbjogVmVjdG9yMjsgXHJcbiAgICB2ZWxvY2l0eTogVmVjdG9yMjsgIFxyXG4gICAgY29sb3I6c3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUG93ZGVyIGltcGxlbWVudHMgUGFydGljbGV7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICB0aGlzLndlaWdodCA9IDE7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMuZ3JpZFBvcyA9IG5ldyBWZWN0b3IyKE1hdGgucm91bmQodGhpcy5wb3NpdGlvbi54KSxNYXRoLnJvdW5kKHRoaXMucG9zaXRpb24ueSkpO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcInllbGxvd1wiO1xyXG4gICAgfVxyXG4gICAgdHJ5TW92ZShyZWxhdGl2ZVBvczogVmVjdG9yMikgOmJvb2xlYW57XHJcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55ID49IFdvcmxkU2l6ZS55IHx8IHRoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54ID49IFdvcmxkU2l6ZS54KSBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICAgXHJcblxyXG4gICAgICAgIGlmICghIHdvcmxkLnBhcnRpY2xlc1t0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueV1bdGhpcy5wb3NpdGlvbi54K3JlbGF0aXZlUG9zLnhdICkgeyAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHJlbGF0aXZlUG9zLng7IFxyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gcmVsYXRpdmVQb3MueTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICAgICAgdGhpcy5ncmlkUG9zID0gbmV3IFZlY3RvcjIoTWF0aC5yb3VuZCh0aGlzLnBvc2l0aW9uLngpLE1hdGgucm91bmQodGhpcy5wb3NpdGlvbi55KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMCwxKSkpIHsgXHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB3ZWlnaHQ6IG51bWJlcjtcclxuICAgIHBvc2l0aW9uOiBWZWN0b3IyOyBcclxuICAgIGdyaWRQb3M6IFZlY3RvcjI7IFxyXG4gICAgdmVsb2NpdHk6IFZlY3RvcjI7ICBcclxuICAgIGNvbG9yOnN0cmluZztcclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtEcmF3YWJsZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9vYmplY3QyRFwiO1xyXG5pbXBvcnQge1BhcnRpY2xlfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdvcmxkU2l6ZSA9IG5ldyBWZWN0b3IyKDUwMCw1MDApO1xyXG5cclxuZXhwb3J0IHZhciBjdHg6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxke1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ldyBBcnJheShXb3JsZFNpemUueSk7XHJcblxyXG5cclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpbmRleCsrKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2luZGV4XSA9IG5ldyBBcnJheShXb3JsZFNpemUueCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBhcnRpY2xlczpBcnJheTxBcnJheTxQYXJ0aWNsZSB8IHVuZGVmaW5lZD4+O1xyXG5cclxufVxyXG5cclxuZXhwb3J0IHZhciB3b3JsZCA9IG5ldyBXb3JsZCgpO1xyXG5cclxuLy9UT0RPOiBNdWx0aXRocmVhZGluZyBsb2xcclxuLypcclxudXNlIHRoaXMgdG8gdGVzdCBpZiBzdXBwb3J0ZWRcclxuXHJcbmlmICh0eXBlb2YoV29ya2VyKSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAvL2dyZWF0LCB5b3VyIGJyb3dzZXIgc3VwcG9ydHMgd2ViIHdvcmtlcnNcclxufSBlbHNlIHtcclxuICAgLy9ub3Qgc3VwcG9ydGVkXHJcbn1cclxuXHJcbiovXHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRNYW5hZ2VyIGV4dGVuZHMgRHJhd2FibGV7ICBcclxuICAgIG9uVXBkYXRlKCl7ICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uUmVuZGVyKCl7XHJcbiAgICAgICAgc3VwZXIub25SZW5kZXIoKTtcclxuXHJcbiAgICAgICAgY3R4ID0gdGhpcy5jdHg7XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBXb3JsZFNpemUueTsgeSsrKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgV29ybGRTaXplLng7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcnQgPSB3b3JsZC5wYXJ0aWNsZXNbeV1beF1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXBhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHBhcnQuY29sb3I7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeCx5LDEsMSk7IC8vZHJhdyByZWN0YW5nbGUgOlBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBoeXNpY3NTdGVwKCk7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIHBoeXNpY3NTdGVwKCl7ICAgICAgICAgICAgXHJcbiAgICAgICAgLy9ydW4gcGFydGljbGUgcGh5c2ljc1xyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgV29ybGRTaXplLnk7IHkrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFdvcmxkU2l6ZS54OyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gd29ybGQucGFydGljbGVzW3ldW3hdXHJcbiAgICAgICAgICAgICAgICBwYXJ0Py5zdGVwKCk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICAvL3N5bmNocm9uaXplIHdvcmxkIHBvc2l0aW9uIHdpdGggbWF0cml4IHBvc2l0aW9uXHJcbiAgICAgICAgdGhpcy5tYXRyaXhTeW5jKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbWF0cml4U3luYygpe1xyXG4gICAgICAgIGxldCBidWZmZXJXb3JsZCA9IHdvcmxkO1xyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgV29ybGRTaXplLnk7IHkrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFdvcmxkU2l6ZS54OyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gd29ybGQucGFydGljbGVzW3ldW3hdXHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXBhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnQucG9zaXRpb24ueCA9PSB4ICYmIHBhcnQucG9zaXRpb24ueSA9PSB5KSBcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBidWZmZXJXb3JsZC5wYXJ0aWNsZXNbeV1beF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5yb3VuZChwYXJ0LnBvc2l0aW9uLnkpIDwgV29ybGRTaXplLnkgJiYgTWF0aC5yb3VuZChwYXJ0LnBvc2l0aW9uLngpIDwgV29ybGRTaXplLngpIHsgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyV29ybGQucGFydGljbGVzW01hdGgucm91bmQocGFydC5wb3NpdGlvbi55KV1bTWF0aC5yb3VuZChwYXJ0LnBvc2l0aW9uLngpXSA9IHBhcnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd29ybGQgPSBidWZmZXJXb3JsZDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQYXJ0KHBhcnQ6IFBhcnRpY2xlKXsgICAgICAgIFxyXG4gICAgICAgIHdvcmxkLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSBwYXJ0O1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCAqIGFzIENFIGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvY29yZVwiO1xyXG5cclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zY2VuZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcblxyXG5pbXBvcnQge3dvcmxkLCBXb3JsZE1hbmFnZXIsY3R4fSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5pbXBvcnQge0tleWJvYXJkSW5wdXR9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvaW5wdXRcIjtcclxuXHJcbmltcG9ydCB7IFBvd2RlciwgU29saWQgfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5cclxuLy9jcmVhdGUgc2NlbmVcclxubGV0IGxldmVsID0gbmV3IFNjZW5lKCk7XHJcbmxldCB3b3JsZF9tYW5hZ2VyID0gbmV3IFdvcmxkTWFuYWdlcigpO1xyXG53aW5kb3cub25sb2FkID0gKCk9PntcclxuICAgIC8vaW5pdCBlbmdpbmVcclxuICAgIENFLmluaXQoKTtcclxuICAgIC8vYmluZCBzY2VuZVxyXG4gICAgQ0Uuc2V0QWN0aXZlU2NlbmUobGV2ZWwpO1xyXG4gICAgXHJcbiAgICBsZXZlbC5tZW1iZXJzLnB1c2god29ybGRfbWFuYWdlcik7XHJcbiAgICB3b3JsZF9tYW5hZ2VyLm9yaWdpbi5zY2FsZSA9IG5ldyBWZWN0b3IyKDEwLDEwKTtcclxuXHJcblxyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMjAwOyB4KyspIHsgICAgIFxyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMjAwOyB5KyspIHsgICAgIFxyXG4gICAgICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFBvd2RlcihuZXcgVmVjdG9yMih4LHkpKSk7ICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gXHJcbn07XHJcblxyXG4vL3J1bnMgZXZlcnkgdGljayBcclxubGV2ZWwub25VcGRhdGUgPSAoKT0+e1xyXG5cclxuXHRcclxufTsgIl0sInNvdXJjZVJvb3QiOiIifQ==