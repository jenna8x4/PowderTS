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
        this.velocity = new base_types_1.Vector2(0, 0);
        this.color = "yellow";
    }
    Powder.prototype.tryMove = function (relativePos) {
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
    Powder.prototype.step = function () {
        if (!this.tryMove(new base_types_1.Vector2(0, 1))) {
            if (Math.random() > 0.5) {
                if (!this.tryMove(new base_types_1.Vector2(1, 1))) {
                    if (!this.tryMove(new base_types_1.Vector2(-1, 1))) {
                        //this.color = 'yellow';
                        return;
                    }
                    else
                        ;
                    //this.color = 'blue';
                }
                //else        
                //  this.color = 'lime';
            }
            else {
                if (!this.tryMove(new base_types_1.Vector2(-1, 1))) {
                    if (!this.tryMove(new base_types_1.Vector2(1, 1))) {
                        // this.color = 'yellow';
                        return;
                    }
                    //else        
                    //   this.color = 'lime';
                }
                //else        
                // this.color = 'blue';
            }
        }
        //else        
        //this.color = 'aqua';
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
            this.particles[index] = new Array(exports.WorldSize.x).fill(undefined);
        }
    }
    return World;
}());
exports.World = World;
exports.world = new World();
//TODO: Multithreading if i fancy
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
        //do physics
        this.physicsStep();
        //render everything
        exports.ctx = this.ctx;
        for (var y = 0; y < exports.WorldSize.y; y++) {
            for (var x = 0; x < exports.WorldSize.x; x++) {
                var part = exports.world.particles[y][x];
                if (!part)
                    continue;
                part.step();
                exports.ctx.fillStyle = part.color;
                exports.ctx.fillRect(x, y, 1, 1); //draw rectangle :P
            }
        }
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
        for (var y = 0; y < exports.WorldSize.y; y++) {
            for (var x = 0; x < exports.WorldSize.x; x++) {
                var part = exports.world.particles[y][x];
                if (!part)
                    continue;
                if (!(part.position.x == x && part.position.y == y)) {
                    if ((part.position.y) < exports.WorldSize.y && (part.position.x) < exports.WorldSize.x) {
                        if (exports.world.particles[part.position.y][part.position.x]) {
                            part.position = new base_types_1.Vector2(x, y);
                            part.step();
                        }
                        else {
                            exports.world.particles[y][x] = undefined;
                            exports.world.particles[(part.position.y)][(part.position.x)] = part;
                        }
                    }
                }
            }
        }
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
    //world_manager.addPart(new Powder(new Vector2(80,0)));  
    for (var x = 180; x < 220; x++) {
        for (var y = 0; y < 200; y++) {
            world_manager.addPart(new particle_1.Powder(new base_types_1.Vector2(x, y)));
        }
    }
    for (var x = 0; x < 100; x++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(x + 90, x + 200)));
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(x + 90, x + 201)));
    }
    for (var x = 0; x < 100; x++) {
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 291, x + 200)));
        world_manager.addPart(new particle_1.Solid(new base_types_1.Vector2(-x + 291, x + 201)));
    }
};
//runs every tick 
level.onUpdate = function () {
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BhcnRpY2xlLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi4vZ2FtZS93b3JsZF9tYW5hZ2VyLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL2dhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0VBQ0U7QUFDRixJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUM7QUFNM0Isd0NBQWM7QUFMbEI7RUFDRTtBQUNGLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUlULGtCQUFHOzs7Ozs7Ozs7Ozs7OztBQ1RQOzs7RUFHRTtBQUNGO0lBQ0ksaUJBQVksQ0FBUyxFQUFDLENBQVM7UUFDM0IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFHTCxjQUFDO0FBQUQsQ0FBQztBQVBZLDBCQUFPO0FBU3BCOztHQUVHO0FBQ0g7SUFDSSxtQkFBWSxHQUFhLEVBQUUs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LElBQUksZ0JBQUssQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxHQUFDLEVBQUUsRUFBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxnQkFBSyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLEdBQUMsRUFBRSxFQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0Q7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFCLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxnQkFBSyxDQUFDLElBQUksb0JBQU8sQ0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksZ0JBQUssQ0FBQyxJQUFJLG9CQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUMsR0FBRyxFQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0Q7QUFHTCxDQUFDLENBQUM7QUFFRixrQkFBa0I7QUFDbEIsS0FBSyxDQUFDLFFBQVEsR0FBRztBQUdqQixDQUFDLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqUXVlcnJ5IHNlbGVjdG9yIGZvciB0aGUgY2FudmFzIGVsZW1lbnRcclxuKi9cclxuY29uc3QgY2FudmFzU2VsZWN0b3IgPSBcIiNnYW1lXCI7XHJcbi8qKlRhcmdldCBmcmFtZXMgcGVyIHNlY29uZFxyXG4qL1xyXG52YXIgZnBzID0gMzA7XHJcblxyXG5leHBvcnQge1xyXG4gICAgY2FudmFzU2VsZWN0b3IsICAgIFxyXG4gICAgZnBzXHJcbn0iLCIvKipcclxuICogMkQgVmVjdG9yXHJcbiAqIFN0b3JlcyBYIGFuZCBZXHJcbiovXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IyICB7XHJcbiAgICBjb25zdHJ1Y3RvcihYIDpudW1iZXIsWSA6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnggPSBYO1xyXG4gICAgICAgIHRoaXMueSA9IFk7XHJcbiAgICB9XHJcbiAgICB4Om51bWJlcjtcclxuICAgIHk6bnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogU3RvcmVzIHBvc2l0aW9uIHJvdGF0aW9uIChkZWdyZWVzKSBhbmQgc2NhbGVcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xyXG4gICAgY29uc3RydWN0b3IocG9zPyA6VmVjdG9yMiwgcm90PyA6bnVtYmVyLCBzY2FsZT8gOlZlY3RvcjIpe1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gICA9IHBvcyA/IHBvcyAgICAgOiBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gICA9IHJvdCA/IHJvdCAgICAgOiAwO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgICAgICA9IHNjYWxlID8gc2NhbGUgOiBuZXcgVmVjdG9yMigxLDEpO1xyXG4gICAgfVxyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7XHJcbiAgICByb3RhdGlvbjogbnVtYmVyO1xyXG4gICAgc2NhbGU6IFZlY3RvcjI7XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVuZGVyaW5nIGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcbmltcG9ydCAqIGFzIENvbmZpZyBmcm9tIFwiLi8uLi9lbmdpbmVDb25maWdcIjtcclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4vc2NlbmVcIjtcclxuaW1wb3J0IHtLZXlib2FyZElucHV0fSBmcm9tIFwiLi8uLi9lbmdpbmUvaW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgdmFyIGFjdGl2ZVNjZW5lIDogU2NlbmUgfCB1bmRlZmluZWRcclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHNjZW5lIHlvdSB3YW50IHRvIGJlIGN1cnJlbnRseSBkaXNwbGF5ZWQgYW5kIHVwZGF0ZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3RpdmVTY2VuZShzY2VuZSA6U2NlbmUpe1xyXG4gICAgYWN0aXZlU2NlbmUgPSBzY2VuZTtcclxufVxyXG4vKipcclxuICogSW5pdGlhbGl6ZSB0aGUgZW5naW5lXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgUmVuZGVyaW5nLmluaXQoKTtcclxuICAgIEtleWJvYXJkSW5wdXQuaW5pdCgpO1xyXG5cclxuICAgIHNldEludGVydmFsKHVwZGF0ZSwxMDAwL0NvbmZpZy5mcHMpO1xyXG59XHJcbi8qKlxyXG4gKiBEb24ndCB1c2UgZXh0ZXJuYWx5LlxyXG4gKiBDYWxscyBvblVwZGF0ZSBhbmQgb25SZW5kZXIgbWV0aG9kc1xyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlKCl7XHJcbiAgICBpZihhY3RpdmVTY2VuZT8ub25VcGRhdGUpXHJcbiAgICAgICAgYWN0aXZlU2NlbmUub25VcGRhdGUoKTtcclxuICAgIGFjdGl2ZVNjZW5lPy51cGRhdGUoKTtcclxuXHJcbiAgICBSZW5kZXJpbmcucmVuZGVyKCk7XHJcblxyXG59IiwiLyoqXHJcbiAqIE1vc3Qgb2Yga2V5cyBwcmVzZW50IG9uIHRoZSBrZXlib2FyZCBhcyBhIHN0cmluZyB1bmlvbi4gUGxlYXNlIHJlcG9ydCBhbnkgbWlzc2luZyBrZXlzLlxyXG4gKi9cclxudHlwZSBLZXkgPSBcIlRhYlwiIHwgXCJBbHRcIiB8IFwiQWx0R3JhcGhcIiB8IFwiQmFja3NwYWNlXCIgfCBcIkNvbnRyb2xcIiB8XCJTaGlmdFwiIHwgXCJTcGFjZVwiIHwgXCJDb250ZXh0TWVudVwiIHwgXCJFbnRlclwiIHwgXCJOdW1Mb2NrXCIgfCBcIkhvbWVcIiB8IFwiUGFnZVVwXCIgfCBcIlBhZ2VEb3duXCIgfCBcIkluc2VydFwiIHwgXCJEZWxldGVcIiB8IFwiQXJyb3dVcFwiIHwgXCJBcnJvd0Rvd25cIiB8IFwiQXJyb3dSaWdodFwiIHwgXCJBcnJvd0xlZnRcIiB8XCIhXCIgfCBcIlxcXCJcInwgXCIjXCIgfCBcIiRcIiB8IFwiJVwiIHwgXCImXCIgfCBcIidcIiB8IFwiKFwiIHwgXCIpXCIgfCBcIipcIiB8IFwiK1wiIHwgXCIsXCIgfCBcIi1cIiB8IFwiLlwiIHwgXCIvXCIgfCBcIjBcIiB8IFwiMVwiIHwgXCIyXCIgfCBcIjNcIiB8IFwiNFwiIHwgXCI1XCIgfCBcIjZcIiB8IFwiN1wiIHwgXCI4XCIgfCBcIjlcIiB8IFwiOlwiIHwgXCI7XCIgfCBcIjxcIiB8IFwiPVwiIHwgXCI+XCIgfCBcIj9cIiB8IFwiQFwiIHwgXCJBXCIgfCBcIkJcIiB8IFwiQ1wiIHwgXCJEXCIgfCBcIkVcIiB8IFwiRlwiIHwgXCJHXCIgfCBcIkhcIiB8IFwiSVwiIHwgXCJKXCIgfCBcIktcIiB8IFwiTFwiIHwgXCJNXCIgfCBcIk5cIiB8IFwiT1wiIHwgXCJQXCIgfCBcIlFcIiB8IFwiUlwiIHwgXCJTXCIgfCBcIlRcIiB8IFwiVVwiIHwgXCJWXCIgfCBcIldcIiB8IFwiWFwiIHwgXCJZXCIgfCBcIlpcIiB8IFwiW1wiIHwgXCJcXFxcXCIgfCBcIl1cIiB8IFwiXlwiIHwgXCJfXCIgfCBcImBcIiB8IFwiYVwiIHwgXCJiXCIgfCBcImNcIiB8IFwiZFwiIHwgXCJlXCIgfCBcImZcIiB8IFwiZ1wiIHwgXCJoXCIgfCBcImlcIiB8IFwialwiIHwgXCJrXCIgfCBcImxcIiB8IFwibVwiIHwgXCJuXCIgfCBcIm9cIiB8IFwicFwiIHwgXCJxXCIgfCBcInJcIiB8IFwic1wiIHwgXCJ0XCIgfCBcInVcIiB8IFwidlwiIHwgXCJ3XCIgfCBcInhcIiB8IFwieVwiIHwgXCJ6XCIgfCBcIntcIiB8IFwifFwiIHwgXCJ9XCIgfCBcIn5cIiA7XHJcblxyXG5leHBvcnQgY2xhc3MgS2V5Ym9hcmRJbnB1dHtcclxuICAgIC8qKlxyXG4gICAgICogQWRkIGV2ZW50IGxpc3RlbmVycyBmb3Iga2V5IHByZXNzZXMuXHJcbiAgICAgKiBBbGxyZWFkeSBjYWxsZWQgYnkgdGhlIGluaXQgZnVuY3Rpb24gZnJvbSBjb3JlLnRzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMgPSBuZXcgTWFwPEtleSxib29sZWFuPigpO1xyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsKGUpPT57ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzLnNldChLZXlib2FyZElucHV0LnN0cmluZ1RvS2V5KGUua2V5KSx0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwoZSk9PnstXHJcbiAgICAgICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzLnNldChLZXlib2FyZElucHV0LnN0cmluZ1RvS2V5KGUua2V5KSxmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGZvciBwcmVzc2VkIGtleVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaXNQcmVzc2VkKGtleTogS2V5KXtcclxuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmtleVN0YXRlcy5nZXQoa2V5KVxyXG4gICAgICAgIHJldHVybiBzdGF0ZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBrZXlTdGF0ZXM6IE1hcDxLZXksYm9vbGVhbj47XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc3RyaW5nVG9LZXkoa2V5IDpzdHJpbmcpeyAgICAgICAgXHJcbiAgICAgICAgbGV0IHZhbCA9IGtleS5yZXBsYWNlKFwiRGVhZFwiLFwiflwiKTtcclxuICAgICAgICB2YWwgPSB2YWwucmVwbGFjZShcIiBcIixcIlNwYWNlXCIpO1xyXG4gICAgICAgIGxldCBrZXl0eXBlID0gdmFsICBhcyBLZXk7XHJcbiAgICAgICAgcmV0dXJuIGtleXR5cGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge1ZlY3RvcjIsVHJhbnNmb3JtfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7Y3R4fSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5cclxuLyoqXHJcbiAqIEJhc2UgZm9yIGNoaWxkcmVuIHBvbHltb3JwaGlzbVxyXG4gKiBJbXBsZW1lbnQgdGhpcyBpbnRlcmZhY2Ugd2hlbiBjcmVhdGluZyBhIGNvbXBvbmVudCAvIGNoaWxkLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBPYmplY3QyRCB7XHJcbiAgICAvL0hhcHBlbnMgZXZlcnkgdGlja1xyXG4gICAgb25VcGRhdGUoKSA6dm9pZDsgXHJcbiAgICAvL0NhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgb25SZW5kZXIoKSA6dm9pZDsgXHJcbiAgICBhZnRlclJlbmRlcigpIDp2b2lkOyBcclxuXHJcbiAgICBvcmlnaW46IFRyYW5zZm9ybTsgICAgXHJcbiAgICBjaGlsZHJlbjogQXJyYXk8T2JqZWN0MkQ+O1xyXG59XHJcblxyXG4vKipcclxuICogQmFzZSBmb3IgY2hpbGRyZW4gdGhhdCB3YW50IHRvIHJlbmRlciBzb21ldGhpbmcuXHJcbiAqIEV4dGVuZCB0aGlzIGNsYXNzIGZvciBjdHggYWNjZXNzIGFuZCBvcmlnaW4gdHJhbnNmb3JtIGhhbmRlbGluZy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBEcmF3YWJsZSBpbXBsZW1lbnRzIE9iamVjdDJEIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSBuZXcgVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMuY3R4ID0gY3R4O1xyXG4gICAgICAgIHRoaXMudXNlX2xvY2FsX2Nvb3JkaW5hdGVzID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5faW5fY2VudGVyID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICovXHJcbiAgICBvblVwZGF0ZSgpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICogQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXHJcbiAgICAgKi9cclxuICAgIG9uUmVuZGVyKCl7ICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jdHggPSBjdHg7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKC0odGhpcy5vcmlnaW4uc2NhbGUueC8yKSwtKHRoaXMub3JpZ2luLnNjYWxlLnkvMikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUodGhpcy5vcmlnaW4ucG9zaXRpb24ueCx0aGlzLm9yaWdpbi5wb3NpdGlvbi55KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUodGhpcy5vcmlnaW4uc2NhbGUueC8yLHRoaXMub3JpZ2luLnNjYWxlLnkvMik7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMub3JpZ2luLnJvdGF0aW9uICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKC0odGhpcy5vcmlnaW4uc2NhbGUueC8yKSwtKHRoaXMub3JpZ2luLnNjYWxlLnkvMikpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgdGhpcy5jdHguc2NhbGUodGhpcy5vcmlnaW4uc2NhbGUueCx0aGlzLm9yaWdpbi5zY2FsZS55KTsgICAgICBcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqIENhbGxlZCBhZnRlciB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXHJcbiAgICAgKi9cclxuICAgIGFmdGVyUmVuZGVyKCl7ICAgICAgICBcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBEcmF3YWJsZSAmJiAhY2hpbGQudXNlX2xvY2FsX2Nvb3JkaW5hdGVzKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc2NhbGUoMS90aGlzLm9yaWdpbi5zY2FsZS54LDEvdGhpcy5vcmlnaW4uc2NhbGUueSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY2hpbGQub25SZW5kZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb3JpZ2luOiBUcmFuc2Zvcm07ICAgIFxyXG4gICAgY2hpbGRyZW46IEFycmF5PE9iamVjdDJEPjtcclxuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgdXNlX2xvY2FsX2Nvb3JkaW5hdGVzOiBib29sZWFuO1xyXG4gICAgb3JpZ2luX2luX2NlbnRlcjogYm9vbGVhbjtcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBDb25maWcgZnJvbSBcIi4vLi4vZW5naW5lQ29uZmlnXCI7XHJcbmltcG9ydCB7YWN0aXZlU2NlbmV9IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCB2YXIgY3R4IDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbnZhciBjYW52YXMgOkhUTUxDYW52YXNFbGVtZW50O1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgdGhlIGNhbnZhcyBjb250ZXh0LlxyXG4gKiBBbGxyZWFkeSBjYWxsZWQgYnkgdGhlIGluaXQgZnVuY3Rpb24gZnJvbSBjb3JlLnRzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpe1xyXG4gICAgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihDb25maWcuY2FudmFzU2VsZWN0b3IpISBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGVzIHZpZXdwb3J0IHNpemUsXHJcbiAqIGNhbGxzIGFsbCB0aGUgb25SZW5kZXIgbWV0aG9kc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcigpeyAgXHJcbiAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICAgICAgXHJcbiAgICBhY3RpdmVTY2VuZT8ucmVuZGVyKCk7XHJcbn0iLCJpbXBvcnQge0RyYXdhYmxlLCBPYmplY3QyRH0gZnJvbSBcIi4vb2JqZWN0MkRcIlxyXG5pbXBvcnQge2N0eH0gZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBSb290IGZvciBhbGwgdGhlIGVsZW1lbnRzIGluc2lkZSB5b3VyIGxldmVsLlxyXG4gKiBPYmplY3RzIG5vdCBhIG1lbWJlciBvZiB0aGUgYWN0aXZlIHNjZW5lIHdvbnQgYmUgY2FsbGVkIHZpYSBvblVwZGF0ZSBhbmQgb25SZW5kZXIuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2NlbmV7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKGNoaWxkPT57XHJcbiAgICAgICAgICAgIGNoaWxkLm9uVXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uVXBkYXRlKVxyXG4gICAgICAgICAgICB0aGlzLm9uVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgdGhpcy5tZW1iZXJzLmZvckVhY2goY2hpbGQ9PntcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY2hpbGQub25SZW5kZXIoKTtcclxuICAgICAgICAgICAgY2hpbGQuYWZ0ZXJSZW5kZXIoKTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gICBcclxuXHJcbiAgICBvblVwZGF0ZTogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XHJcbiAgICBtZW1iZXJzOiBBcnJheTxPYmplY3QyRD47XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7IHdvcmxkLFdvcmxkU2l6ZSB9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGFydGljbGV7XHJcbiAgICBzdGVwKCkgOnZvaWQ7IC8vUGh5c2ljcyBzdGVwXHJcbiAgICBcclxuICAgIHdlaWdodDogbnVtYmVyO1xyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7IFxyXG4gICAgdmVsb2NpdHk6IFZlY3RvcjI7ICAgIFxyXG4gICAgY29sb3I6IHN0cmluZztcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTb2xpZCBpbXBsZW1lbnRzIFBhcnRpY2xle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgdGhpcy53ZWlnaHQgPSAxO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gXCJncmF5XCI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpe1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgfVxyXG5cclxuICAgIHdlaWdodDogbnVtYmVyO1xyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7IFxyXG4gICAgdmVsb2NpdHk6IFZlY3RvcjI7ICBcclxuICAgIGNvbG9yOnN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvd2RlciBpbXBsZW1lbnRzIFBhcnRpY2xle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgdGhpcy53ZWlnaHQgPSAxO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gXCJ5ZWxsb3dcIjtcclxuICAgIH1cclxuICAgIHRyeU1vdmUocmVsYXRpdmVQb3M6IFZlY3RvcjIpIDpib29sZWFue1xyXG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueSA+PSBXb3JsZFNpemUueSB8fCB0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueCA+PSBXb3JsZFNpemUueCB8fFxyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueSA8IDAgfHwgdGhpcy5wb3NpdGlvbi54K3JlbGF0aXZlUG9zLnggPCAwICkgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXQgIT0gdW5kZWZpbmVkKSB7IFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCArPSByZWxhdGl2ZVBvcy54OyBcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHJlbGF0aXZlUG9zLnk7IFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpe1xyXG4gICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDAsMSkpKSB7IFxyXG4gICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLmNvbG9yID0gJ3llbGxvdyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5jb2xvciA9ICdibHVlJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vZWxzZSAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIC8vICB0aGlzLmNvbG9yID0gJ2xpbWUnO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuY29sb3IgPSAneWVsbG93JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2Vsc2UgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAvLyAgIHRoaXMuY29sb3IgPSAnbGltZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL2Vsc2UgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgLy8gdGhpcy5jb2xvciA9ICdibHVlJztcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9lbHNlICAgICAgICBcclxuICAgICAgICAgICAgLy90aGlzLmNvbG9yID0gJ2FxdWEnO1xyXG4gICAgfVxyXG5cclxuICAgIHdlaWdodDogbnVtYmVyO1xyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7IFxyXG4gICAgdmVsb2NpdHk6IFZlY3RvcjI7ICBcclxuICAgIGNvbG9yOnN0cmluZztcclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtEcmF3YWJsZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9vYmplY3QyRFwiO1xyXG5pbXBvcnQge1BhcnRpY2xlfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdvcmxkU2l6ZSA9IG5ldyBWZWN0b3IyKDUwMCw1MDApO1xyXG5cclxuZXhwb3J0IHZhciBjdHg6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxke1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ldyBBcnJheShXb3JsZFNpemUueSk7XHJcblxyXG5cclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpbmRleCsrKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2luZGV4XSA9IG5ldyBBcnJheShXb3JsZFNpemUueCkuZmlsbCh1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwYXJ0aWNsZXM6QXJyYXk8QXJyYXk8UGFydGljbGUgfCB1bmRlZmluZWQ+PjtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgd29ybGQgPSBuZXcgV29ybGQoKTtcclxuXHJcbi8vVE9ETzogTXVsdGl0aHJlYWRpbmcgaWYgaSBmYW5jeVxyXG4vKlxyXG51c2UgdGhpcyB0byB0ZXN0IGlmIHN1cHBvcnRlZFxyXG5cclxuaWYgKHR5cGVvZihXb3JrZXIpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgIC8vZ3JlYXQsIHlvdXIgYnJvd3NlciBzdXBwb3J0cyB3ZWIgd29ya2Vyc1xyXG59IGVsc2Uge1xyXG4gICAvL25vdCBzdXBwb3J0ZWRcclxufVxyXG5cclxuKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZE1hbmFnZXIgZXh0ZW5kcyBEcmF3YWJsZXsgIFxyXG4gICAgb25VcGRhdGUoKXsgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25SZW5kZXIoKXtcclxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xyXG5cclxuICAgICAgICAvL2RvIHBoeXNpY3NcclxuICAgICAgICB0aGlzLnBoeXNpY3NTdGVwKCk7XHJcblxyXG4gICAgICAgIC8vcmVuZGVyIGV2ZXJ5dGhpbmdcclxuICAgICAgICBjdHggPSB0aGlzLmN0eDtcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IFdvcmxkU2l6ZS55OyB5KyspIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBXb3JsZFNpemUueDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFydCA9IHdvcmxkLnBhcnRpY2xlc1t5XVt4XVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghcGFydClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYXJ0LnN0ZXAoKTsgXHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gcGFydC5jb2xvcjtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4LHksMSwxKTsgLy9kcmF3IHJlY3RhbmdsZSA6UFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSAgICBcclxuXHJcbiAgICBwaHlzaWNzU3RlcCgpeyAgICAgXHJcbiAgICAgICAgLy9ydW4gcGFydGljbGUgcGh5c2ljc1xyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgV29ybGRTaXplLnk7IHkrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFdvcmxkU2l6ZS54OyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gd29ybGQucGFydGljbGVzW3ldW3hdXHJcbiAgICAgICAgICAgICAgICBwYXJ0Py5zdGVwKCk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3N5bmNocm9uaXplIHdvcmxkIHBvc2l0aW9uIHdpdGggbWF0cml4IHBvc2l0aW9uXHJcbiAgICAgICAgdGhpcy5tYXRyaXhTeW5jKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbWF0cml4U3luYygpe1xyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgV29ybGRTaXplLnk7IHkrKykgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFdvcmxkU2l6ZS54OyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gd29ybGQucGFydGljbGVzW3ldW3hdXHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXBhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghKHBhcnQucG9zaXRpb24ueCA9PSB4ICYmIHBhcnQucG9zaXRpb24ueSA9PSB5KSkgXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChwYXJ0LnBvc2l0aW9uLnkpIDwgV29ybGRTaXplLnkgJiYgKHBhcnQucG9zaXRpb24ueCkgPCBXb3JsZFNpemUueCkgeyAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYod29ybGQucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0LnBvc2l0aW9uID0gbmV3IFZlY3RvcjIoeCx5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnQuc3RlcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbeV1beF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbKHBhcnQucG9zaXRpb24ueSldWyhwYXJ0LnBvc2l0aW9uLngpXSA9IHBhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFydChwYXJ0OiBQYXJ0aWNsZSl7ICAgICAgICBcclxuICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbcGFydC5wb3NpdGlvbi55XVtwYXJ0LnBvc2l0aW9uLnhdID0gcGFydDtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgKiBhcyBDRSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2NvcmVcIjtcclxuXHJcbmltcG9ydCB7U2NlbmV9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvc2NlbmVcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5cclxuaW1wb3J0IHt3b3JsZCwgV29ybGRNYW5hZ2VyLGN0eH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5cclxuaW1wb3J0IHtLZXlib2FyZElucHV0fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2lucHV0XCI7XHJcblxyXG5pbXBvcnQgeyBQb3dkZXIsIFNvbGlkIH0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuXHJcbi8vY3JlYXRlIHNjZW5lXHJcbmxldCBsZXZlbCA9IG5ldyBTY2VuZSgpO1xyXG5sZXQgd29ybGRfbWFuYWdlciA9IG5ldyBXb3JsZE1hbmFnZXIoKTtcclxud2luZG93Lm9ubG9hZCA9ICgpPT57XHJcbiAgICAvL2luaXQgZW5naW5lXHJcbiAgICBDRS5pbml0KCk7XHJcbiAgICAvL2JpbmQgc2NlbmVcclxuICAgIENFLnNldEFjdGl2ZVNjZW5lKGxldmVsKTtcclxuICAgIFxyXG4gICAgbGV2ZWwubWVtYmVycy5wdXNoKHdvcmxkX21hbmFnZXIpO1xyXG4gICAgd29ybGRfbWFuYWdlci5vcmlnaW4uc2NhbGUgPSBuZXcgVmVjdG9yMigxMCwxMCk7XHJcblxyXG5cclxuICAgIC8vd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBQb3dkZXIobmV3IFZlY3RvcjIoODAsMCkpKTsgIFxyXG5cclxuICAgIGZvciAobGV0IHggPSAxODA7IHggPCAyMjA7IHgrKykgeyAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCAyMDA7IHkrKykgeyAgICAgXHJcbiAgICAgICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgUG93ZGVyKG5ldyBWZWN0b3IyKHgseSkpKTsgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwMDsgeCsrKSB7IFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoeCs5MCx4KzIwMCkpKTsgICAgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4KzkwLHgrMjAxKSkpOyAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTAwOyB4KyspIHsgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsyOTEseCsyMDApKSk7ICAgIFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMjkxLHgrMjAxKSkpOyAgICAgIFxyXG4gICAgfVxyXG5cclxuIFxyXG59O1xyXG5cclxuLy9ydW5zIGV2ZXJ5IHRpY2sgXHJcbmxldmVsLm9uVXBkYXRlID0gKCk9PntcclxuXHJcblx0XHJcbn07ICJdLCJzb3VyY2VSb290IjoiIn0=