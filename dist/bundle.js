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
    Powder.prototype.step = function () {
        this.gridPos = new base_types_1.Vector2(Math.round(this.position.x), Math.round(this.position.y));
        if (world_manager_1.world.particles[(this.position.y + 1)][this.position.x]) {
            if (!world_manager_1.world.particles[(this.position.y + 1)][this.position.x + 1]) {
                this.position.y += 1;
                this.position.x += 1;
            }
            else if (!world_manager_1.world.particles[(this.position.y + 1)][this.position.x - 1]) {
                this.position.y += 1;
                this.position.x += -1;
            }
        }
        else {
            this.position.y += 1;
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
exports.WorldSize = new base_types_1.Vector2(100, 100);
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
var WorldManager = /** @class */ (function (_super) {
    __extends(WorldManager, _super);
    function WorldManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorldManager.prototype.onUpdate = function () {
    };
    WorldManager.prototype.onRender = function () {
        this.physicsStep();
        _super.prototype.onRender.call(this);
        for (var y = 0; y < exports.WorldSize.y; y++) {
            for (var x = 0; x < exports.WorldSize.x; x++) {
                var part = exports.world.particles[y][x];
                if (!part || !exports.ctx)
                    continue;
                exports.ctx.fillStyle = part.color;
                exports.ctx.fillRect(x, y, 1, 1); //draw rectangle :P
            }
        }
    };
    WorldManager.prototype.physicsStep = function () {
        exports.ctx = this.ctx;
        if (!exports.world.particles)
            return;
        //run particle physics
        for (var y = 0; y < exports.WorldSize.y; y++) {
            for (var x = 0; x < exports.WorldSize.x; x++) {
                var part = exports.world.particles[y][x];
                part === null || part === void 0 ? void 0 : part.step();
            }
        }
        //synchronize world position with matrix position
        var bufferWorld = exports.world;
        for (var y = 0; y < exports.WorldSize.y; y++) {
            for (var x = 0; x < exports.WorldSize.x; x++) {
                var part = exports.world.particles[y][x];
                if (!part)
                    continue;
                if (part.position.x == x && part.position.y == y)
                    continue;
                bufferWorld.particles[y][x] = undefined;
                bufferWorld.particles[Math.round(part.position.y)][Math.round(part.position.x)] = part;
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
    for (var index = 0; index < 32; index++) {
        if (index % 2 == 0)
            continue;
        world_manager.addPart(new particle_1.Powder(new base_types_1.Vector2(5, index)));
    }
    for (var index = 0; index < 11; index++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(index, 49)));
    }
};
//runs every tick 
level.onUpdate = function () {
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BhcnRpY2xlLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS93b3JsZF9tYW5hZ2VyLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL2dhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0VBQ0U7QUFDRixJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUM7QUFNM0Isd0NBQWM7QUFMbEI7RUFDRTtBQUNGLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUlYLGtCQUFHOzs7Ozs7Ozs7Ozs7OztBQ1RQOzs7RUFHRTtBQUNGO0lBQ0ksaUJBQVksQ0FBUyxFQUFDLENBQVM7UUFDM0IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFHTCxjQUFDO0FBQUQsQ0FBQztBQVBZLDBCQUFPO0FBU3BCOztHQUVHO0FBQ0g7SUFDSSxtQkFBWSxHQUFhLEVBQUUs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QUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDckMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQUFLLENBQUMsSUFBSSxvQkFBTyxDQUFDLEtBQUssRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDM0Q7QUFFTCxDQUFDLENBQUM7QUFFRixrQkFBa0I7QUFDbEIsS0FBSyxDQUFDLFFBQVEsR0FBRztBQUdqQixDQUFDLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqUXVlcnJ5IHNlbGVjdG9yIGZvciB0aGUgY2FudmFzIGVsZW1lbnRcclxuKi9cclxuY29uc3QgY2FudmFzU2VsZWN0b3IgPSBcIiNnYW1lXCI7XHJcbi8qKlRhcmdldCBmcmFtZXMgcGVyIHNlY29uZFxyXG4qL1xyXG5jb25zdCBmcHMgPSA2MDtcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBjYW52YXNTZWxlY3RvciwgICAgXHJcbiAgICBmcHNcclxufSIsIi8qKlxyXG4gKiAyRCBWZWN0b3JcclxuICogU3RvcmVzIFggYW5kIFlcclxuKi9cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjIgIHtcclxuICAgIGNvbnN0cnVjdG9yKFggOm51bWJlcixZIDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMueCA9IFg7XHJcbiAgICAgICAgdGhpcy55ID0gWTtcclxuICAgIH1cclxuICAgIHg6bnVtYmVyO1xyXG4gICAgeTpudW1iZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTdG9yZXMgcG9zaXRpb24gcm90YXRpb24gKGRlZ3JlZXMpIGFuZCBzY2FsZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3M/IDpWZWN0b3IyLCByb3Q/IDpudW1iZXIsIHNjYWxlPyA6VmVjdG9yMil7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiAgID0gcG9zID8gcG9zICAgICA6IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiAgID0gcm90ID8gcm90ICAgICA6IDA7XHJcbiAgICAgICAgdGhpcy5zY2FsZSAgICAgID0gc2NhbGUgPyBzY2FsZSA6IG5ldyBWZWN0b3IyKDEsMSk7XHJcbiAgICB9XHJcbiAgICBwb3NpdGlvbjogVmVjdG9yMjtcclxuICAgIHJvdGF0aW9uOiBudW1iZXI7XHJcbiAgICBzY2FsZTogVmVjdG9yMjtcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBSZW5kZXJpbmcgZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuaW1wb3J0ICogYXMgQ29uZmlnIGZyb20gXCIuLy4uL2VuZ2luZUNvbmZpZ1wiO1xyXG5pbXBvcnQge1NjZW5lfSBmcm9tIFwiLi9zY2VuZVwiO1xyXG5pbXBvcnQge0tleWJvYXJkSW5wdXR9IGZyb20gXCIuLy4uL2VuZ2luZS9pbnB1dFwiO1xyXG5cclxuXHJcbmV4cG9ydCB2YXIgYWN0aXZlU2NlbmUgOiBTY2VuZSB8IHVuZGVmaW5lZFxyXG5cclxuLyoqXHJcbiAqIFNldCB0aGUgc2NlbmUgeW91IHdhbnQgdG8gYmUgY3VycmVudGx5IGRpc3BsYXllZCBhbmQgdXBkYXRlZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEFjdGl2ZVNjZW5lKHNjZW5lIDpTY2VuZSl7XHJcbiAgICBhY3RpdmVTY2VuZSA9IHNjZW5lO1xyXG59XHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIHRoZSBlbmdpbmVcclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBSZW5kZXJpbmcuaW5pdCgpO1xyXG4gICAgS2V5Ym9hcmRJbnB1dC5pbml0KCk7XHJcblxyXG4gICAgc2V0SW50ZXJ2YWwodXBkYXRlLDEwMDAvQ29uZmlnLmZwcyk7XHJcbn1cclxuLyoqXHJcbiAqIERvbid0IHVzZSBleHRlcm5hbHkuXHJcbiAqIENhbGxzIG9uVXBkYXRlIGFuZCBvblJlbmRlciBtZXRob2RzXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGUoKXtcclxuICAgIGlmKGFjdGl2ZVNjZW5lPy5vblVwZGF0ZSlcclxuICAgICAgICBhY3RpdmVTY2VuZS5vblVwZGF0ZSgpO1xyXG4gICAgYWN0aXZlU2NlbmU/LnVwZGF0ZSgpO1xyXG5cclxuICAgIFJlbmRlcmluZy5yZW5kZXIoKTtcclxufSIsIi8qKlxyXG4gKiBNb3N0IG9mIGtleXMgcHJlc2VudCBvbiB0aGUga2V5Ym9hcmQgYXMgYSBzdHJpbmcgdW5pb24uIFBsZWFzZSByZXBvcnQgYW55IG1pc3Npbmcga2V5cy5cclxuICovXHJcbnR5cGUgS2V5ID0gXCJUYWJcIiB8IFwiQWx0XCIgfCBcIkFsdEdyYXBoXCIgfCBcIkJhY2tzcGFjZVwiIHwgXCJDb250cm9sXCIgfFwiU2hpZnRcIiB8IFwiU3BhY2VcIiB8IFwiQ29udGV4dE1lbnVcIiB8IFwiRW50ZXJcIiB8IFwiTnVtTG9ja1wiIHwgXCJIb21lXCIgfCBcIlBhZ2VVcFwiIHwgXCJQYWdlRG93blwiIHwgXCJJbnNlcnRcIiB8IFwiRGVsZXRlXCIgfCBcIkFycm93VXBcIiB8IFwiQXJyb3dEb3duXCIgfCBcIkFycm93UmlnaHRcIiB8IFwiQXJyb3dMZWZ0XCIgfFwiIVwiIHwgXCJcXFwiXCJ8IFwiI1wiIHwgXCIkXCIgfCBcIiVcIiB8IFwiJlwiIHwgXCInXCIgfCBcIihcIiB8IFwiKVwiIHwgXCIqXCIgfCBcIitcIiB8IFwiLFwiIHwgXCItXCIgfCBcIi5cIiB8IFwiL1wiIHwgXCIwXCIgfCBcIjFcIiB8IFwiMlwiIHwgXCIzXCIgfCBcIjRcIiB8IFwiNVwiIHwgXCI2XCIgfCBcIjdcIiB8IFwiOFwiIHwgXCI5XCIgfCBcIjpcIiB8IFwiO1wiIHwgXCI8XCIgfCBcIj1cIiB8IFwiPlwiIHwgXCI/XCIgfCBcIkBcIiB8IFwiQVwiIHwgXCJCXCIgfCBcIkNcIiB8IFwiRFwiIHwgXCJFXCIgfCBcIkZcIiB8IFwiR1wiIHwgXCJIXCIgfCBcIklcIiB8IFwiSlwiIHwgXCJLXCIgfCBcIkxcIiB8IFwiTVwiIHwgXCJOXCIgfCBcIk9cIiB8IFwiUFwiIHwgXCJRXCIgfCBcIlJcIiB8IFwiU1wiIHwgXCJUXCIgfCBcIlVcIiB8IFwiVlwiIHwgXCJXXCIgfCBcIlhcIiB8IFwiWVwiIHwgXCJaXCIgfCBcIltcIiB8IFwiXFxcXFwiIHwgXCJdXCIgfCBcIl5cIiB8IFwiX1wiIHwgXCJgXCIgfCBcImFcIiB8IFwiYlwiIHwgXCJjXCIgfCBcImRcIiB8IFwiZVwiIHwgXCJmXCIgfCBcImdcIiB8IFwiaFwiIHwgXCJpXCIgfCBcImpcIiB8IFwia1wiIHwgXCJsXCIgfCBcIm1cIiB8IFwiblwiIHwgXCJvXCIgfCBcInBcIiB8IFwicVwiIHwgXCJyXCIgfCBcInNcIiB8IFwidFwiIHwgXCJ1XCIgfCBcInZcIiB8IFwid1wiIHwgXCJ4XCIgfCBcInlcIiB8IFwielwiIHwgXCJ7XCIgfCBcInxcIiB8IFwifVwiIHwgXCJ+XCIgO1xyXG5cclxuZXhwb3J0IGNsYXNzIEtleWJvYXJkSW5wdXR7XHJcbiAgICAvKipcclxuICAgICAqIEFkZCBldmVudCBsaXN0ZW5lcnMgZm9yIGtleSBwcmVzc2VzLlxyXG4gICAgICogQWxscmVhZHkgY2FsbGVkIGJ5IHRoZSBpbml0IGZ1bmN0aW9uIGZyb20gY29yZS50c1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzID0gbmV3IE1hcDxLZXksYm9vbGVhbj4oKTtcclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLChlKT0+eyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcy5zZXQoS2V5Ym9hcmRJbnB1dC5zdHJpbmdUb0tleShlLmtleSksdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsKGUpPT57LVxyXG4gICAgICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcy5zZXQoS2V5Ym9hcmRJbnB1dC5zdHJpbmdUb0tleShlLmtleSksZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBmb3IgcHJlc3NlZCBrZXlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGlzUHJlc3NlZChrZXk6IEtleSl7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5rZXlTdGF0ZXMuZ2V0KGtleSlcclxuICAgICAgICByZXR1cm4gc3RhdGUgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMga2V5U3RhdGVzOiBNYXA8S2V5LGJvb2xlYW4+O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHN0cmluZ1RvS2V5KGtleSA6c3RyaW5nKXsgICAgICAgIFxyXG4gICAgICAgIGxldCB2YWwgPSBrZXkucmVwbGFjZShcIkRlYWRcIixcIn5cIik7XHJcbiAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoXCIgXCIsXCJTcGFjZVwiKTtcclxuICAgICAgICBsZXQga2V5dHlwZSA9IHZhbCAgYXMgS2V5O1xyXG4gICAgICAgIHJldHVybiBrZXl0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtWZWN0b3IyLFRyYW5zZm9ybX0gZnJvbSBcIi4vYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQge2N0eH0gZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBCYXNlIGZvciBjaGlsZHJlbiBwb2x5bW9ycGhpc21cclxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIHdoZW4gY3JlYXRpbmcgYSBjb21wb25lbnQgLyBjaGlsZC5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0MkQge1xyXG4gICAgLy9IYXBwZW5zIGV2ZXJ5IHRpY2tcclxuICAgIG9uVXBkYXRlKCkgOnZvaWQ7IFxyXG4gICAgLy9DYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgIG9uUmVuZGVyKCkgOnZvaWQ7IFxyXG4gICAgYWZ0ZXJSZW5kZXIoKSA6dm9pZDsgXHJcblxyXG4gICAgb3JpZ2luOiBUcmFuc2Zvcm07ICAgIFxyXG4gICAgY2hpbGRyZW46IEFycmF5PE9iamVjdDJEPjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEJhc2UgZm9yIGNoaWxkcmVuIHRoYXQgd2FudCB0byByZW5kZXIgc29tZXRoaW5nLlxyXG4gKiBFeHRlbmQgdGhpcyBjbGFzcyBmb3IgY3R4IGFjY2VzcyBhbmQgb3JpZ2luIHRyYW5zZm9ybSBoYW5kZWxpbmcuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRHJhd2FibGUgaW1wbGVtZW50cyBPYmplY3QyRCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMub3JpZ2luID0gbmV3IFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLmN0eCA9IGN0eDtcclxuICAgICAgICB0aGlzLnVzZV9sb2NhbF9jb29yZGluYXRlcyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub3JpZ2luX2luX2NlbnRlciA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqL1xyXG4gICAgb25VcGRhdGUoKXtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqIENhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgICovXHJcbiAgICBvblJlbmRlcigpeyAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuY3R4ID0gY3R4O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtKHRoaXMub3JpZ2luLnNjYWxlLngvMiksLSh0aGlzLm9yaWdpbi5zY2FsZS55LzIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMub3JpZ2luLnBvc2l0aW9uLngsdGhpcy5vcmlnaW4ucG9zaXRpb24ueSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMub3JpZ2luLnNjYWxlLngvMix0aGlzLm9yaWdpbi5zY2FsZS55LzIpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgICAgIHRoaXMuY3R4LnJvdGF0ZSh0aGlzLm9yaWdpbi5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtKHRoaXMub3JpZ2luLnNjYWxlLngvMiksLSh0aGlzLm9yaWdpbi5zY2FsZS55LzIpKTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIHRoaXMuY3R4LnNjYWxlKHRoaXMub3JpZ2luLnNjYWxlLngsdGhpcy5vcmlnaW4uc2NhbGUueSk7ICAgICAgXHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XHJcbiAgICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgICovXHJcbiAgICBhZnRlclJlbmRlcigpeyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRHJhd2FibGUgJiYgIWNoaWxkLnVzZV9sb2NhbF9jb29yZGluYXRlcylcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnNjYWxlKDEvdGhpcy5vcmlnaW4uc2NhbGUueCwxL3RoaXMub3JpZ2luLnNjYWxlLnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNoaWxkLm9uUmVuZGVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIG9yaWdpbjogVHJhbnNmb3JtOyAgICBcclxuICAgIGNoaWxkcmVuOiBBcnJheTxPYmplY3QyRD47XHJcbiAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIHVzZV9sb2NhbF9jb29yZGluYXRlczogYm9vbGVhbjtcclxuICAgIG9yaWdpbl9pbl9jZW50ZXI6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgQ29uZmlnIGZyb20gXCIuLy4uL2VuZ2luZUNvbmZpZ1wiO1xyXG5pbXBvcnQge2FjdGl2ZVNjZW5lfSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgdmFyIGN0eCA6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG52YXIgY2FudmFzIDpIVE1MQ2FudmFzRWxlbWVudDtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIHRoZSBjYW52YXMgY29udGV4dC5cclxuICogQWxscmVhZHkgY2FsbGVkIGJ5IHRoZSBpbml0IGZ1bmN0aW9uIGZyb20gY29yZS50c1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKXtcclxuICAgIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoQ29uZmlnLmNhbnZhc1NlbGVjdG9yKSEgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlcyB2aWV3cG9ydCBzaXplLFxyXG4gKiBjYWxscyBhbGwgdGhlIG9uUmVuZGVyIG1ldGhvZHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoKXsgIFxyXG4gICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgICAgIFxyXG4gICAgYWN0aXZlU2NlbmU/LnJlbmRlcigpO1xyXG59IiwiaW1wb3J0IHtEcmF3YWJsZSwgT2JqZWN0MkR9IGZyb20gXCIuL29iamVjdDJEXCJcclxuaW1wb3J0IHtjdHh9IGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcblxyXG4vKipcclxuICogUm9vdCBmb3IgYWxsIHRoZSBlbGVtZW50cyBpbnNpZGUgeW91ciBsZXZlbC5cclxuICogT2JqZWN0cyBub3QgYSBtZW1iZXIgb2YgdGhlIGFjdGl2ZSBzY2VuZSB3b250IGJlIGNhbGxlZCB2aWEgb25VcGRhdGUgYW5kIG9uUmVuZGVyLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNjZW5le1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLm1lbWJlcnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKXtcclxuICAgICAgICB0aGlzLm1lbWJlcnMuZm9yRWFjaChjaGlsZD0+e1xyXG4gICAgICAgICAgICBjaGlsZC5vblVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vblVwZGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5vblVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKGNoaWxkPT57XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGNoaWxkLm9uUmVuZGVyKCk7XHJcbiAgICAgICAgICAgIGNoaWxkLmFmdGVyUmVuZGVyKCk7XHJcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9ICAgXHJcblxyXG4gICAgb25VcGRhdGU6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkO1xyXG4gICAgbWVtYmVyczogQXJyYXk8T2JqZWN0MkQ+O1xyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyB3b3JsZCB9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGFydGljbGV7XHJcbiAgICBzdGVwKCkgOnZvaWQ7IC8vUGh5c2ljcyBzdGVwXHJcbiAgICBcclxuICAgIHdlaWdodDogbnVtYmVyO1xyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7IFxyXG4gICAgdmVsb2NpdHk6IFZlY3RvcjI7ICAgIFxyXG4gICAgY29sb3I6IHN0cmluZztcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTb2xpZCBpbXBsZW1lbnRzIFBhcnRpY2xle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgdGhpcy53ZWlnaHQgPSAxO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gXCJncmF5XCI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpe1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgfVxyXG5cclxuICAgIHdlaWdodDogbnVtYmVyO1xyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7IFxyXG4gICAgdmVsb2NpdHk6IFZlY3RvcjI7ICBcclxuICAgIGNvbG9yOnN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvd2RlciBpbXBsZW1lbnRzIFBhcnRpY2xle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgdGhpcy53ZWlnaHQgPSAxO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB0aGlzLmdyaWRQb3MgPSBuZXcgVmVjdG9yMihNYXRoLnJvdW5kKHRoaXMucG9zaXRpb24ueCksTWF0aC5yb3VuZCh0aGlzLnBvc2l0aW9uLnkpKTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gXCJ5ZWxsb3dcIjtcclxuICAgIH1cclxuICAgIHN0ZXAoKXtcclxuICAgICAgICB0aGlzLmdyaWRQb3MgPSBuZXcgVmVjdG9yMihNYXRoLnJvdW5kKHRoaXMucG9zaXRpb24ueCksTWF0aC5yb3VuZCh0aGlzLnBvc2l0aW9uLnkpKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIHdvcmxkLnBhcnRpY2xlc1sodGhpcy5wb3NpdGlvbi55KzEpXVt0aGlzLnBvc2l0aW9uLnhdICkge1xyXG4gICAgICAgICAgICBpZiAoIXdvcmxkLnBhcnRpY2xlc1sodGhpcy5wb3NpdGlvbi55KzEpXVt0aGlzLnBvc2l0aW9uLngrMV0gKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gMTsgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoISB3b3JsZC5wYXJ0aWNsZXNbKHRoaXMucG9zaXRpb24ueSsxKV1bdGhpcy5wb3NpdGlvbi54LTFdIClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdlaWdodDogbnVtYmVyO1xyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7IFxyXG4gICAgZ3JpZFBvczogVmVjdG9yMjsgXHJcbiAgICB2ZWxvY2l0eTogVmVjdG9yMjsgIFxyXG4gICAgY29sb3I6c3RyaW5nO1xyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQge0RyYXdhYmxlfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL29iamVjdDJEXCI7XHJcbmltcG9ydCB7UGFydGljbGV9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgV29ybGRTaXplID0gbmV3IFZlY3RvcjIoMTAwLDEwMCk7XHJcblxyXG5leHBvcnQgdmFyIGN0eDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGR7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3IEFycmF5KFdvcmxkU2l6ZS55KTtcclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGluZGV4KyspIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXNbaW5kZXhdID0gbmV3IEFycmF5KFdvcmxkU2l6ZS54KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcGFydGljbGVzOkFycmF5PEFycmF5PFBhcnRpY2xlIHwgdW5kZWZpbmVkPj47XHJcblxyXG59XHJcblxyXG5leHBvcnQgdmFyIHdvcmxkID0gbmV3IFdvcmxkKCk7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZE1hbmFnZXIgZXh0ZW5kcyBEcmF3YWJsZXsgIFxyXG4gICAgb25VcGRhdGUoKXsgICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvblJlbmRlcigpe1xyXG4gICAgICAgIHRoaXMucGh5c2ljc1N0ZXAoKTtcclxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IFdvcmxkU2l6ZS55OyB5KyspIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBXb3JsZFNpemUueDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFydCA9IHdvcmxkLnBhcnRpY2xlc1t5XVt4XVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghcGFydCB8fCAhY3R4KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBwYXJ0LmNvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHgseSwxLDEpOyAvL2RyYXcgcmVjdGFuZ2xlIDpQXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIHBoeXNpY3NTdGVwKCl7XHJcbiAgICAgICAgY3R4ID0gdGhpcy5jdHg7XHJcblxyXG4gICAgICAgIGlmKCF3b3JsZC5wYXJ0aWNsZXMpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgLy9ydW4gcGFydGljbGUgcGh5c2ljc1xyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgV29ybGRTaXplLnk7IHkrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFdvcmxkU2l6ZS54OyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gd29ybGQucGFydGljbGVzW3ldW3hdXHJcbiAgICAgICAgICAgICAgICBwYXJ0Py5zdGVwKCk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICAvL3N5bmNocm9uaXplIHdvcmxkIHBvc2l0aW9uIHdpdGggbWF0cml4IHBvc2l0aW9uXHJcbiAgICAgICAgbGV0IGJ1ZmZlcldvcmxkID0gd29ybGQ7XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBXb3JsZFNpemUueTsgeSsrKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgV29ybGRTaXplLng7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcnQgPSB3b3JsZC5wYXJ0aWNsZXNbeV1beF1cclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghcGFydClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAocGFydC5wb3NpdGlvbi54ID09IHggJiYgcGFydC5wb3NpdGlvbi55ID09IHkpIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGJ1ZmZlcldvcmxkLnBhcnRpY2xlc1t5XVt4XSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGJ1ZmZlcldvcmxkLnBhcnRpY2xlc1tNYXRoLnJvdW5kKHBhcnQucG9zaXRpb24ueSldW01hdGgucm91bmQocGFydC5wb3NpdGlvbi54KV0gPSBwYXJ0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdvcmxkID0gYnVmZmVyV29ybGQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFydChwYXJ0OiBQYXJ0aWNsZSl7ICAgICAgICBcclxuICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdID0gcGFydDtcclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCAqIGFzIENFIGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvY29yZVwiO1xyXG5cclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zY2VuZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcblxyXG5pbXBvcnQge3dvcmxkLCBXb3JsZE1hbmFnZXIsY3R4fSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5pbXBvcnQge0tleWJvYXJkSW5wdXR9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvaW5wdXRcIjtcclxuaW1wb3J0IHsgUG93ZGVyLCBTb2xpZCB9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcblxyXG4vL2NyZWF0ZSBzY2VuZVxyXG5sZXQgbGV2ZWwgPSBuZXcgU2NlbmUoKTtcclxubGV0IHdvcmxkX21hbmFnZXIgPSBuZXcgV29ybGRNYW5hZ2VyKCk7XHJcbndpbmRvdy5vbmxvYWQgPSAoKT0+e1xyXG4gICAgLy9pbml0IGVuZ2luZVxyXG4gICAgQ0UuaW5pdCgpO1xyXG4gICAgLy9iaW5kIHNjZW5lXHJcbiAgICBDRS5zZXRBY3RpdmVTY2VuZShsZXZlbCk7XHJcbiAgICBcclxuICAgIGxldmVsLm1lbWJlcnMucHVzaCh3b3JsZF9tYW5hZ2VyKTtcclxuICAgIHdvcmxkX21hbmFnZXIub3JpZ2luLnNjYWxlID0gbmV3IFZlY3RvcjIoMTAsMTApO1xyXG5cclxuXHJcblxyXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDMyOyBpbmRleCsrKSB7XHJcbiAgICAgICAgaWYgKGluZGV4ICUgMiA9PSAwKVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBQb3dkZXIobmV3IFZlY3RvcjIoNSxpbmRleCkpKTsgIFxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCAxMTsgaW5kZXgrKykge1xyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoaW5kZXgsNDkpKSk7ICAgICAgICBcclxuICAgIH1cclxuIFxyXG59O1xyXG5cclxuLy9ydW5zIGV2ZXJ5IHRpY2sgXHJcbmxldmVsLm9uVXBkYXRlID0gKCk9PntcclxuXHJcblx0XHJcbn07ICJdLCJzb3VyY2VSb290IjoiIn0=