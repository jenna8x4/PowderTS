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
exports.MouseInput = exports.KeyboardInput = exports.KeyState = void 0;
var base_types_1 = __webpack_require__(/*! ./base_types */ "./src/engine/base_types.ts");
var renderer_1 = __webpack_require__(/*! ./renderer */ "./src/engine/renderer.ts");
var KeyState;
(function (KeyState) {
    KeyState[KeyState["PRESSED"] = 0] = "PRESSED";
    KeyState[KeyState["HOLD"] = 1] = "HOLD";
    KeyState[KeyState["RELEASE"] = 2] = "RELEASE";
})(KeyState = exports.KeyState || (exports.KeyState = {}));
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
        this.use_local_coordinates = false;
        this.origin_in_center = false;
    }
    /**
     * Do not call externaly
     */
    Drawable.prototype.onUpdate = function () {
        this.children.forEach(function (child) {
            child.onUpdate();
        });
    };
    /**
     * Do not call externaly
     * Called before the object is rendered
     */
    Drawable.prototype.onRender = function () {
        if (this.origin_in_center) {
            renderer_1.ctx.translate(-(this.origin.scale.x / 2), -(this.origin.scale.y / 2));
        }
        renderer_1.ctx.translate(this.origin.position.x, this.origin.position.y);
        if (this.origin_in_center) {
            renderer_1.ctx.translate(this.origin.scale.x / 2, this.origin.scale.y / 2);
        }
        renderer_1.ctx.rotate(this.origin.rotation * Math.PI / 180);
        if (this.origin_in_center) {
            renderer_1.ctx.translate(-(this.origin.scale.x / 2), -(this.origin.scale.y / 2));
        }
        renderer_1.ctx.scale(this.origin.scale.x, this.origin.scale.y);
    };
    /**
     * Do not call externaly
     * Called after the object is rendered
     */
    Drawable.prototype.afterRender = function () {
        var _this = this;
        this.children.forEach(function (child) {
            renderer_1.ctx.save();
            if (child instanceof Drawable && !child.use_local_coordinates)
                renderer_1.ctx.scale(1 / _this.origin.scale.x, 1 / _this.origin.scale.y);
            child.onRender();
            renderer_1.ctx.restore();
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
var renderer_1 = __webpack_require__(/*! ./renderer */ "./src/engine/renderer.ts");
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
        renderer_1.ctx.beginPath();
        renderer_1.ctx.moveTo(this.verticies[0].x, this.verticies[0].y);
        for (var i = 1; i < this.verticies.length; i++) {
            var vertex = this.verticies[i];
            renderer_1.ctx.lineTo(vertex.x, vertex.y);
        }
        renderer_1.ctx.closePath();
        renderer_1.ctx.save();
        renderer_1.ctx.resetTransform();
        renderer_1.ctx.fillStyle = this.color;
        renderer_1.ctx.fill();
        renderer_1.ctx.lineWidth = this.outline.thickness;
        renderer_1.ctx.strokeStyle = this.outline.color;
        renderer_1.ctx.stroke();
        renderer_1.ctx.restore();
    };
    return Shape;
}(object2D_1.Drawable));
exports.Shape = Shape;


/***/ }),

/***/ "../game/ToolBar.ts":
/*!**************************!*\
  !*** ../game/ToolBar.ts ***!
  \**************************/
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
exports.ToolBar = void 0;
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var shape_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/shape */ "./src/engine/shape.ts");
var cursorTool_1 = __webpack_require__(/*! ./cursorTool */ "../game/cursorTool.ts");
var input_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/input */ "./src/engine/input.ts");
var renderer_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/renderer */ "./src/engine/renderer.ts");
var game_1 = __webpack_require__(/*! ./game */ "../game/game.ts");
var ToolBar = /** @class */ (function (_super) {
    __extends(ToolBar, _super);
    function ToolBar() {
        var _this = this;
        var shape = [
            new base_types_1.Vector2(0, 0),
            new base_types_1.Vector2(1, 0),
            new base_types_1.Vector2(1, 1),
            new base_types_1.Vector2(0, 1)
        ];
        _this = _super.call(this, shape, "#0000", new shape_1.Outline(1, "white")) || this;
        _this.origin.position = new base_types_1.Vector2(0, 600);
        _this.origin.scale = new base_types_1.Vector2(800, 30);
        cursorTool_1.Tool.Tools.forEach(function (v, k) {
            _this.addButton(k);
        });
        return _this;
    }
    ToolBar.prototype.addButton = function (toolName) {
        var button = new ToolButton(toolName);
        button.origin.position.y = 15;
        button.origin.position.x = 800 - (this.children.length * 60) - 30;
        this.children.push(button);
    };
    ToolBar.prototype.updateOutline = function () {
        //TODO: change button outline based on selection
    };
    return ToolBar;
}(shape_1.Shape));
exports.ToolBar = ToolBar;
var ToolButton = /** @class */ (function (_super) {
    __extends(ToolButton, _super);
    function ToolButton(toolName) {
        var _this = this;
        var shape = [
            new base_types_1.Vector2(0, 0),
            new base_types_1.Vector2(1, 0),
            new base_types_1.Vector2(1, 1),
            new base_types_1.Vector2(0, 1)
        ];
        var tool = cursorTool_1.Tool.Tools.get(toolName);
        if (!tool) {
            throw "Tool " + toolName + " not found";
        }
        _this = _super.call(this, shape, tool.color, new shape_1.Outline(1, "white")) || this;
        _this.origin.scale = new base_types_1.Vector2(50, 20);
        _this.tool = tool;
        _this.name = toolName;
        _this.origin_in_center = true;
        _this.ctxPos = new base_types_1.Vector2(0, 0);
        return _this;
    }
    ToolButton.prototype.onUpdate = function () {
        var mouse = input_1.MouseInput.currentPosition;
        var pressed;
        if (input_1.MouseInput.isPressed("LMB")) {
            pressed = "LMB";
        }
        else if (input_1.MouseInput.isPressed("RMB")) {
            pressed = "RMB";
        }
        else if (input_1.MouseInput.isPressed("ScrollButton")) {
            pressed = "ScrollButton";
        }
        else
            return;
        if (mouse.x > this.ctxPos.x
            &&
                mouse.y > this.ctxPos.y
            &&
                mouse.x < this.ctxPos.x + 50
            &&
                mouse.y < this.ctxPos.y + 20) {
            game_1.cursor.tools.set(pressed, this.tool);
            game_1.toolbar.updateOutline();
        }
    };
    ToolButton.prototype.onRender = function () {
        _super.prototype.onRender.call(this);
        this.ctxPos = new base_types_1.Vector2(renderer_1.ctx.getTransform().e, renderer_1.ctx.getTransform().f);
        renderer_1.ctx.save();
        renderer_1.ctx.resetTransform();
        renderer_1.ctx.font = "bold 16px Arial";
        renderer_1.ctx.fillStyle = "white";
        renderer_1.ctx.strokeStyle = "black";
        renderer_1.ctx.lineWidth = 0.9;
        var width = 50 - renderer_1.ctx.measureText(this.name).width;
        renderer_1.ctx.fillText(this.name, this.ctxPos.x + width / 2, this.ctxPos.y + 16);
        renderer_1.ctx.strokeText(this.name, this.ctxPos.x + width / 2, this.ctxPos.y + 16);
        renderer_1.ctx.restore();
    };
    ToolButton.prototype.changeOutline = function (color) {
        this.outline.color = color;
    };
    return ToolButton;
}(shape_1.Shape));


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
var cursorTool_1 = __webpack_require__(/*! ./cursorTool */ "../game/cursorTool.ts");
var Cursor = /** @class */ (function (_super) {
    __extends(Cursor, _super);
    function Cursor() {
        var _this = this;
        var defaultShape = [
            new base_types_1.Vector2(2, 0),
            new base_types_1.Vector2(2, 2),
            new base_types_1.Vector2(0, 2),
            new base_types_1.Vector2(0, 0)
        ];
        _this = _super.call(this, defaultShape, "#0000", new shape_1.Outline(1, '#FFF9')) || this;
        _this.origin_in_center = true;
        _this.radius = 1;
        _this.tools = new Map([
            ["LMB", cursorTool_1.Tool.Tools.get("SAND")],
            ["RMB", cursorTool_1.Tool.Tools.get("ERAS")],
            ["ScrollButton", cursorTool_1.Tool.Tools.get("PICK")]
        ]);
        return _this;
    }
    Cursor.prototype.changeRadius = function (radius) {
        radius = Math.round(radius);
        this.verticies = [
            new base_types_1.Vector2(radius * 2, 0),
            new base_types_1.Vector2(radius * 2, radius * 2),
            new base_types_1.Vector2(0, radius * 2),
            new base_types_1.Vector2(0, 0)
        ];
    };
    Cursor.prototype.onUpdate = function () {
        var _this = this;
        this.radius -= input_1.MouseInput.getWheelOffset().y / 100;
        if (this.radius < 1) {
            this.radius = 1;
        }
        this.changeRadius(this.radius);
        this.tools.forEach(function (tool, button) {
            if (input_1.MouseInput.isPressed(button)) {
                if (!tool)
                    return;
                tool.draw(_this);
                return;
            }
        });
    };
    Cursor.prototype.onRender = function () {
        if (input_1.MouseInput.currentPosition) {
            this.origin.position.x = Math.round(input_1.MouseInput.currentPosition.x / 2) * 2;
            this.origin.position.y = Math.round(input_1.MouseInput.currentPosition.y / 2) * 2;
            this.origin.position.x -= this.radius;
            this.origin.position.y -= this.radius;
        }
        //console.log(this.ctx == ctx);
        _super.prototype.onRender.call(this);
    };
    return Cursor;
}(shape_1.Shape));
exports.Cursor = Cursor;


/***/ }),

/***/ "../game/cursorTool.ts":
/*!*****************************!*\
  !*** ../game/cursorTool.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tool = void 0;
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var input_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/input */ "./src/engine/input.ts");
var game_1 = __webpack_require__(/*! ./game */ "../game/game.ts");
var particle_1 = __webpack_require__(/*! ./particle */ "../game/particle.ts");
var util_1 = __webpack_require__(/*! ./util */ "../game/util.ts");
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var Tool = /** @class */ (function () {
    function Tool(placePart, color) {
        this.callback = placePart;
        this.color = color;
    }
    Tool.prototype.draw = function (cursor) {
        var pos = cursor.origin.position;
        pos.x = Math.floor(pos.x / 2);
        pos.y = Math.floor(pos.y / 2);
        //mouse in world
        if (!util_1.Utility.inBounds(new base_types_1.Vector2(input_1.MouseInput.currentPosition.x / 2, input_1.MouseInput.currentPosition.y / 2)))
            return;
        for (var y = pos.y; y < (pos.y + (cursor.radius)); y++) {
            for (var x = pos.x; x < (pos.x + (cursor.radius)); x++) {
                if (!util_1.Utility.inBounds(new base_types_1.Vector2(x, y)))
                    continue;
                this.callback(new base_types_1.Vector2(x, y));
            }
        }
    };
    Tool.Tools = new Map([
        ["SAND", new Tool(function (pos) {
                if (!world_manager_1.world.particles[pos.y][pos.x])
                    world_manager_1.world.particles[pos.y][pos.x] = new particle_1.Powder(pos);
            }, "yellow")
        ],
        ["WATR", new Tool(function (pos) {
                if (!world_manager_1.world.particles[pos.y][pos.x])
                    world_manager_1.world.particles[pos.y][pos.x] = new particle_1.Fluid(pos);
            }, "aqua")
        ],
        ["WALL", new Tool(function (pos) {
                if (!world_manager_1.world.particles[pos.y][pos.x])
                    world_manager_1.world.particles[pos.y][pos.x] = new particle_1.Solid(pos);
            }, "gray")
        ],
        ["ERAS", new Tool(function (pos) {
                if (world_manager_1.world.particles[pos.y][pos.x])
                    delete world_manager_1.world.particles[pos.y][pos.x];
            }, "red")
        ],
        ["PICK", new Tool(function (pos) {
                var part = world_manager_1.world.particles[pos.y][pos.x];
                if (part) {
                    var picked = Tool.Tools.get(part.partName);
                    if (picked) {
                        game_1.cursor.tools.set("LMB", picked);
                        game_1.toolbar.updateOutline();
                        return;
                    }
                }
            }, "lime")
        ],
    ]);
    return Tool;
}());
exports.Tool = Tool;


/***/ }),

/***/ "../game/game.ts":
/*!***********************!*\
  !*** ../game/game.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toolbar = exports.cursor = void 0;
var CE = __webpack_require__(/*! ../Canvas-Engine/src/engine/core */ "./src/engine/core.ts");
var scene_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/scene */ "./src/engine/scene.ts");
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var input_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/input */ "./src/engine/input.ts");
var particle_1 = __webpack_require__(/*! ./particle */ "../game/particle.ts");
var cursor_1 = __webpack_require__(/*! ./cursor */ "../game/cursor.ts");
var physics_1 = __webpack_require__(/*! ./physics */ "../game/physics.ts");
var ToolBar_1 = __webpack_require__(/*! ./ToolBar */ "../game/ToolBar.ts");
//create scene
var level = new scene_1.Scene();
var world_manager = new world_manager_1.WorldManager();
exports.cursor = new cursor_1.Cursor();
exports.toolbar = new ToolBar_1.ToolBar();
window.onload = function () {
    //init engine
    CE.init();
    //bind scene
    CE.setActiveScene(level);
    level.members.push(world_manager);
    world_manager.origin.scale = new base_types_1.Vector2(2, 2);
    level.members.push(exports.cursor);
    level.members.push(exports.toolbar);
    exports.toolbar.updateOutline();
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
var util_1 = __webpack_require__(/*! ./util */ "../game/util.ts");
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var Particle = /** @class */ (function () {
    function Particle(position) {
        this.partName = "NONE";
        this.position = position;
        this.color = { r: 255, g: 255, b: 255 };
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
        if (!util_1.Utility.inBounds(new base_types_1.Vector2(this.position.x + relativePos.x, this.position.y + relativePos.y)))
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
        _this.partName = "WALL";
        _this.color = { r: 120, g: 120, b: 120 };
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
        _this.partName = "SAND";
        _this.color = { r: 255, g: 255, b: 0 };
        ;
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
        _this.partName = "WATR";
        _this.color = { r: 10, g: 170, b: 255 };
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
var particle_1 = __webpack_require__(/*! ./particle */ "../game/particle.ts");
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
                if (!part || !(part instanceof particle_1.Moveable) || moved.includes(part))
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
        return sim_state;
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
var renderer_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/renderer */ "./src/engine/renderer.ts");
var util_1 = __webpack_require__(/*! ./util */ "../game/util.ts");
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
var BasicRenderer = /** @class */ (function () {
    function BasicRenderer() {
    }
    BasicRenderer.prototype.drawFrame = function (sim_state) {
        var e_1, _a;
        try {
            for (var sim_state_1 = __values(sim_state), sim_state_1_1 = sim_state_1.next(); !sim_state_1_1.done; sim_state_1_1 = sim_state_1.next()) {
                var part = sim_state_1_1.value;
                if (!part)
                    continue;
                renderer_1.ctx.fillStyle = util_1.Utility.rgbToHex(part.color);
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
    return BasicRenderer;
}());
var PixelRenderer = /** @class */ (function () {
    function PixelRenderer() {
        this.scale = new base_types_1.Vector2(2, 2);
        this.canvasData = undefined;
        //ctx.imageSmoothingEnabled = false;
    }
    PixelRenderer.prototype.drawFrame = function (sim_state) {
        this.canvasData = renderer_1.ctx.getImageData(0, 0, world_manager_1.WorldSize.x * this.scale.x, world_manager_1.WorldSize.y * this.scale.y);
        for (var x = 0; x < world_manager_1.WorldSize.x * this.scale.x; x++) {
            for (var y = 0; y < world_manager_1.WorldSize.y * this.scale.y; y++) {
                var part = world_manager_1.world.particles[Math.floor(y / this.scale.y)][Math.floor(x / this.scale.x)];
                if (!part)
                    continue;
                var index = (x + y * world_manager_1.WorldSize.x * this.scale.x) * 4;
                this.canvasData.data[index + 0] = part.color.r;
                this.canvasData.data[index + 1] = part.color.g;
                this.canvasData.data[index + 2] = part.color.b;
                this.canvasData.data[index + 3] = 255;
            }
        }
        renderer_1.ctx.putImageData(this.canvasData, 0, 0);
    };
    return PixelRenderer;
}());
exports.Renderer = new PixelRenderer();


/***/ }),

/***/ "../game/util.ts":
/*!***********************!*\
  !*** ../game/util.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utility = void 0;
var world_manager_1 = __webpack_require__(/*! ./world_manager */ "../game/world_manager.ts");
var Utility = /** @class */ (function () {
    function Utility() {
    }
    Utility.inBounds = function (position) {
        if (position.y >= world_manager_1.WorldSize.y || position.x >= world_manager_1.WorldSize.x ||
            position.y < 0 || position.x < 0)
            return false;
        return true;
    };
    Utility.vectorInterpolate = function (from, to, progress) {
    };
    Utility.rgbToHex = function (color) {
        var r = color.r;
        var g = color.g;
        var b = color.b;
        var rhex = r.toString(16);
        rhex = (rhex.length == 1 ? "0" + rhex : rhex);
        var ghex = g.toString(16);
        ghex = (ghex.length == 1 ? "0" + ghex : ghex);
        var bhex = b.toString(16);
        bhex = (bhex.length == 1 ? "0" + bhex : bhex);
        return "#" + rhex + ghex + bhex;
    };
    return Utility;
}());
exports.Utility = Utility;


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
var renderer_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/renderer */ "./src/engine/renderer.ts");
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
        switch (this.itteratorDirection) {
            case 1:
                return this.particles[y][exports.WorldSize.x - x - 1];
            case 2:
                return this.particles[exports.WorldSize.y - y - 1][x];
            case 3:
                return this.particles[exports.WorldSize.y - y - 1][exports.WorldSize.x - x - 1];
            default:
                return this.particles[y][x];
        }
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
        renderer_1.ctx.strokeStyle = '#777';
        renderer_1.ctx.strokeRect(0, 0, 400, 300);
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("../game/game.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2hhcGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL1Rvb2xCYXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL2N1cnNvci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvY3Vyc29yVG9vbC50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvZ2FtZS50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvcGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BoeXNpY3MudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3JlbmRlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvdXRpbC50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvd29ybGRfbWFuYWdlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvd2VicGFj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ekIsaUNBQWlDO0FBQ2pDOzs7Ozs7Ozs7RUFTRTs7Ozs7OztVQ3hHRjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVQ3JCQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipRdWVycnkgc2VsZWN0b3IgZm9yIHRoZSBjYW52YXMgZWxlbWVudFxyXG4qL1xyXG5jb25zdCBjYW52YXNTZWxlY3RvciA9IFwiI2dhbWVcIjtcclxuY29uc3QgcmVzaXplVmlld3BvcnQgPSBmYWxzZTtcclxuLyoqVGFyZ2V0IGZyYW1lcyBwZXIgc2Vjb25kXHJcbiovXHJcbmNvbnN0IGZwcyA9IDYwO1xyXG5cclxuZXhwb3J0IHtcclxuICAgIGNhbnZhc1NlbGVjdG9yLCAgICBcclxuICAgIGZwcyxcclxuICAgIHJlc2l6ZVZpZXdwb3J0XHJcbn0iLCIvKipcclxuICogMkQgVmVjdG9yXHJcbiAqIFN0b3JlcyBYIGFuZCBZXHJcbiovXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IyICB7XHJcbiAgICBjb25zdHJ1Y3RvcihYIDpudW1iZXIsWSA6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnggPSBYO1xyXG4gICAgICAgIHRoaXMueSA9IFk7XHJcbiAgICB9XHJcblxyXG4gICAgbGVuZ2h0KCl7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChcclxuICAgICAgICAgICAgTWF0aC5wb3codGhpcy54LDIpICsgTWF0aC5wb3codGhpcy55LDIpXHJcbiAgICAgICAgICAgIClcclxuICAgIH1cclxuICAgIFxyXG4gICAgbm9ybWFsaXplZCgpe1xyXG4gICAgICAgIGxldCBuZXdWZWN0b3IgPSBuZXcgVmVjdG9yMih0aGlzLngsdGhpcy55KTtcclxuICAgICAgICBsZXQgbGVuZ2h0ID0gbmV3VmVjdG9yLmxlbmdodCgpXHJcbiAgICAgICAgbmV3VmVjdG9yLnggLz0gbGVuZ2h0O1xyXG4gICAgICAgIG5ld1ZlY3Rvci55IC89IGxlbmdodDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1ZlY3RvcjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgeDpudW1iZXI7XHJcbiAgICB5Om51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFN0b3JlcyBwb3NpdGlvbiByb3RhdGlvbiAoZGVncmVlcykgYW5kIHNjYWxlXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKHBvcz8gOlZlY3RvcjIsIHJvdD8gOm51bWJlciwgc2NhbGU/IDpWZWN0b3IyKXtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uICAgPSBwb3MgPyBwb3MgICAgIDogbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uICAgPSByb3QgPyByb3QgICAgIDogMDtcclxuICAgICAgICB0aGlzLnNjYWxlICAgICAgPSBzY2FsZSA/IHNjYWxlIDogbmV3IFZlY3RvcjIoMSwxKTtcclxuICAgIH1cclxuICAgIHBvc2l0aW9uOiBWZWN0b3IyO1xyXG4gICAgcm90YXRpb246IG51bWJlcjtcclxuICAgIHNjYWxlOiBWZWN0b3IyO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIFJlbmRlcmluZyBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5pbXBvcnQgKiBhcyBDb25maWcgZnJvbSBcIi4vLi4vZW5naW5lQ29uZmlnXCI7XHJcbmltcG9ydCB7U2NlbmV9IGZyb20gXCIuL3NjZW5lXCI7XHJcbmltcG9ydCB7S2V5Ym9hcmRJbnB1dCwgTW91c2VJbnB1dH0gZnJvbSBcIi4vLi4vZW5naW5lL2lucHV0XCI7XHJcblxyXG5cclxuZXhwb3J0IHZhciBhY3RpdmVTY2VuZSA6IFNjZW5lIHwgdW5kZWZpbmVkXHJcblxyXG4vKipcclxuICogU2V0IHRoZSBzY2VuZSB5b3Ugd2FudCB0byBiZSBjdXJyZW50bHkgZGlzcGxheWVkIGFuZCB1cGRhdGVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0QWN0aXZlU2NlbmUoc2NlbmUgOlNjZW5lKXtcclxuICAgIGFjdGl2ZVNjZW5lID0gc2NlbmU7XHJcbn1cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgdGhlIGVuZ2luZVxyXG4qL1xyXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIFJlbmRlcmluZy5pbml0KCk7XHJcbiAgICBLZXlib2FyZElucHV0LmluaXQoKTtcclxuICAgIE1vdXNlSW5wdXQuaW5pdCgpO1xyXG5cclxuICAgIHNldEludGVydmFsKHVwZGF0ZSwxMDAwL0NvbmZpZy5mcHMpO1xyXG59XHJcbi8qKlxyXG4gKiBEb24ndCB1c2UgZXh0ZXJuYWx5LlxyXG4gKiBDYWxscyBvblVwZGF0ZSBhbmQgb25SZW5kZXIgbWV0aG9kc1xyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlKCl7XHJcbiAgICBpZihhY3RpdmVTY2VuZT8ub25VcGRhdGUpXHJcbiAgICAgICAgYWN0aXZlU2NlbmUub25VcGRhdGUoKTtcclxuICAgIGFjdGl2ZVNjZW5lPy51cGRhdGUoKTtcclxuXHJcbiAgICBSZW5kZXJpbmcucmVuZGVyKCk7XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4vYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyBjYW52YXMgfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5cclxuLyoqXHJcbiAqIE1vc3Qgb2Yga2V5cyBwcmVzZW50IG9uIHRoZSBrZXlib2FyZCBhcyBhIHN0cmluZyB1bmlvbi4gUGxlYXNlIHJlcG9ydCBhbnkgbWlzc2luZyBrZXlzLlxyXG4gKi9cclxuZXhwb3J0IHR5cGUgS2V5ID0gXCJUYWJcIiB8IFwiQWx0XCIgfCBcIkFsdEdyYXBoXCIgfCBcIkJhY2tzcGFjZVwiIHwgXCJDb250cm9sXCIgfFwiU2hpZnRcIiB8IFwiU3BhY2VcIiB8IFwiQ29udGV4dE1lbnVcIiB8IFwiRW50ZXJcIiB8IFwiTnVtTG9ja1wiIHwgXCJIb21lXCIgfCBcIlBhZ2VVcFwiIHwgXCJQYWdlRG93blwiIHwgXCJJbnNlcnRcIiB8IFwiRGVsZXRlXCIgfCBcIkFycm93VXBcIiB8IFwiQXJyb3dEb3duXCIgfCBcIkFycm93UmlnaHRcIiB8IFwiQXJyb3dMZWZ0XCIgfFwiIVwiIHwgXCJcXFwiXCJ8IFwiI1wiIHwgXCIkXCIgfCBcIiVcIiB8IFwiJlwiIHwgXCInXCIgfCBcIihcIiB8IFwiKVwiIHwgXCIqXCIgfCBcIitcIiB8IFwiLFwiIHwgXCItXCIgfCBcIi5cIiB8IFwiL1wiIHwgXCIwXCIgfCBcIjFcIiB8IFwiMlwiIHwgXCIzXCIgfCBcIjRcIiB8IFwiNVwiIHwgXCI2XCIgfCBcIjdcIiB8IFwiOFwiIHwgXCI5XCIgfCBcIjpcIiB8IFwiO1wiIHwgXCI8XCIgfCBcIj1cIiB8IFwiPlwiIHwgXCI/XCIgfCBcIkBcIiB8IFwiQVwiIHwgXCJCXCIgfCBcIkNcIiB8IFwiRFwiIHwgXCJFXCIgfCBcIkZcIiB8IFwiR1wiIHwgXCJIXCIgfCBcIklcIiB8IFwiSlwiIHwgXCJLXCIgfCBcIkxcIiB8IFwiTVwiIHwgXCJOXCIgfCBcIk9cIiB8IFwiUFwiIHwgXCJRXCIgfCBcIlJcIiB8IFwiU1wiIHwgXCJUXCIgfCBcIlVcIiB8IFwiVlwiIHwgXCJXXCIgfCBcIlhcIiB8IFwiWVwiIHwgXCJaXCIgfCBcIltcIiB8IFwiXFxcXFwiIHwgXCJdXCIgfCBcIl5cIiB8IFwiX1wiIHwgXCJgXCIgfCBcImFcIiB8IFwiYlwiIHwgXCJjXCIgfCBcImRcIiB8IFwiZVwiIHwgXCJmXCIgfCBcImdcIiB8IFwiaFwiIHwgXCJpXCIgfCBcImpcIiB8IFwia1wiIHwgXCJsXCIgfCBcIm1cIiB8IFwiblwiIHwgXCJvXCIgfCBcInBcIiB8IFwicVwiIHwgXCJyXCIgfCBcInNcIiB8IFwidFwiIHwgXCJ1XCIgfCBcInZcIiB8IFwid1wiIHwgXCJ4XCIgfCBcInlcIiB8IFwielwiIHwgXCJ7XCIgfCBcInxcIiB8IFwifVwiIHwgXCJ+XCIgO1xyXG5cclxuZXhwb3J0IHR5cGUgTW91c2VCdXR0b24gPSBcIkxNQlwiIHwgXCJTY3JvbGxCdXR0b25cIiB8IFwiUk1CXCI7IFxyXG5cclxuZXhwb3J0IGVudW0gS2V5U3RhdGV7XHJcbiAgICBQUkVTU0VELFxyXG4gICAgSE9MRCxcclxuICAgIFJFTEVBU0UsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBLZXlib2FyZElucHV0e1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJzIGZvciBrZXkgcHJlc3Nlcy5cclxuICAgICAqIEFsbHJlYWR5IGNhbGxlZCBieSB0aGUgaW5pdCBmdW5jdGlvbiBmcm9tIGNvcmUudHNcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcyA9IG5ldyBNYXA8S2V5LEtleVN0YXRlPigpO1xyXG5cclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLChlKT0+eyAgIFxyXG4gICAgICAgICAgICBpZihLZXlib2FyZElucHV0LnByZXZlbnREZWZhdWx0KSAgICBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzLnNldChLZXlib2FyZElucHV0LnN0cmluZ1RvS2V5KGUua2V5KSxLZXlTdGF0ZS5QUkVTU0VEKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsKGUpPT57ICAgIFxyXG4gICAgICAgICAgICBpZihLZXlib2FyZElucHV0LnByZXZlbnREZWZhdWx0KSAgICBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgXHJcblxyXG4gICAgICAgICAgICBLZXlib2FyZElucHV0LmtleVN0YXRlcy5zZXQoS2V5Ym9hcmRJbnB1dC5zdHJpbmdUb0tleShlLmtleSksS2V5U3RhdGUuUkVMRUFTRSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGZvciBwcmVzc2VkIGtleVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaXNQcmVzc2VkKGtleTogS2V5KXtcclxuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmtleVN0YXRlcy5nZXQoa2V5KTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlTdGF0ZXMuc2V0KGtleSxLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAhKHN0YXRlID09PSB1bmRlZmluZWQgfHwgc3RhdGUgPT0gS2V5U3RhdGUuUkVMRUFTRSlcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNKdXN0UHJlc3NlZChrZXk6IEtleSl7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5rZXlTdGF0ZXMuZ2V0KGtleSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlTdGF0ZXMuc2V0KGtleSxLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEO1xyXG4gICAgICAgIC8vcmV0dXJuIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwcmV2ZW50RGVmYXVsdCA9IHRydWU7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMga2V5U3RhdGVzOiBNYXA8S2V5LEtleVN0YXRlPjtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzdHJpbmdUb0tleShrZXkgOnN0cmluZyl7ICAgICAgICBcclxuICAgICAgICBsZXQgdmFsID0ga2V5LnJlcGxhY2UoXCJEZWFkXCIsXCJ+XCIpO1xyXG4gICAgICAgIHZhbCA9IHZhbC5yZXBsYWNlKFwiIFwiLFwiU3BhY2VcIik7XHJcbiAgICAgICAgbGV0IGtleXR5cGUgPSB2YWwgIGFzIEtleTtcclxuICAgICAgICByZXR1cm4ga2V5dHlwZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1vdXNlSW5wdXR7XHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzID0gbmV3IE1hcDxNb3VzZUJ1dHRvbixLZXlTdGF0ZT4oKTtcclxuICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UgPSB7eDowLHk6MCx6OjB9O1xyXG5cclxuICAgICAgICBjYW52YXMub25tb3VzZW1vdmUgPSBlID0+IHsgICBcclxuICAgICAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKGUueCwgZS55KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY2FudmFzLm9ud2hlZWwgPSBlID0+IHsgICAgXHJcbiAgICAgICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlLnggKz0gZS5kZWx0YVg7XHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZS55ICs9IGUuZGVsdGFZO1xyXG4gICAgICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UueiArPSBlLmRlbHRhWjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KSAgICBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChNb3VzZUlucHV0Lm51bWJlclRvQnV0dG9uKGUuYnV0dG9uKSxLZXlTdGF0ZS5QUkVTU0VEKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FudmFzLm9ubW91c2V1cCA9IGUgPT4ge1xyXG4gICAgICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KSAgICBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChNb3VzZUlucHV0Lm51bWJlclRvQnV0dG9uKGUuYnV0dG9uKSxLZXlTdGF0ZS5SRUxFQVNFKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9wcmV2ZW50IGNvbnRleHQgbWVudVxyXG4gICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYW52YXMub25jb250ZXh0bWVudSA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRXaGVlbE9mZnNldCgpe1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2U7XHJcbiAgICAgICAgbGV0IG91dCA9IHt4Om9mZnNldC54LCB5Om9mZnNldC55LCB6Om9mZnNldC56fTtcclxuXHJcbiAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlID0ge3g6MCx5OjAsejowfTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzdGF0aWMgaXNQcmVzc2VkKGJ1dHRvbjogTW91c2VCdXR0b24pe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLmdldChidXR0b24pO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRCkge1xyXG4gICAgICAgICAgICBNb3VzZUlucHV0LmJ1dHRvblN0YXRlcy5zZXQoYnV0dG9uLEtleVN0YXRlLkhPTEQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICEoc3RhdGUgPT09IHVuZGVmaW5lZCB8fCBzdGF0ZSA9PSBLZXlTdGF0ZS5SRUxFQVNFKVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc0p1c3RQcmVzc2VkKGJ1dHRvbjogTW91c2VCdXR0b24pe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLmdldChidXR0b24pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChidXR0b24sS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRDtcclxuICAgICAgICAvL3JldHVybiBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBudW1iZXJUb0J1dHRvbihudW1iZXIgOiBudW1iZXIgKSA6IE1vdXNlQnV0dG9ue1xyXG4gICAgICAgIHN3aXRjaCAobnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIkxNQlwiO1xyXG4gICAgICAgICAgICBjYXNlIDE6ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiU2Nyb2xsQnV0dG9uXCI7XHJcbiAgICAgICAgICAgIGNhc2UgMjogICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJSTUJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBcIkxNQlwiOyAvL3RoYXRzIG5vdCBnb25uYSBoYXBwZW5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcHJldmVudERlZmF1bHQgPSB0cnVlO1xyXG4gICAgc3RhdGljIGN1cnJlbnRQb3NpdGlvbjogVmVjdG9yMjtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBidXR0b25TdGF0ZXM6IE1hcDxNb3VzZUJ1dHRvbixLZXlTdGF0ZT47XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtb3VzZVdoZWVsQ2hhbmdlIDoge3g6bnVtYmVyLCB5Om51bWJlciwgejpudW1iZXJ9O1xyXG59IiwiaW1wb3J0IHtWZWN0b3IyLFRyYW5zZm9ybX0gZnJvbSBcIi4vYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQge2N0eH0gZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBCYXNlIGZvciBjaGlsZHJlbiBwb2x5bW9ycGhpc21cclxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIHdoZW4gY3JlYXRpbmcgYSBjb21wb25lbnQgLyBjaGlsZC5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0MkQge1xyXG4gICAgLy9IYXBwZW5zIGV2ZXJ5IHRpY2tcclxuICAgIG9uVXBkYXRlKCkgOnZvaWQ7IFxyXG4gICAgLy9DYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgIG9uUmVuZGVyKCkgOnZvaWQ7IFxyXG4gICAgYWZ0ZXJSZW5kZXIoKSA6dm9pZDsgXHJcblxyXG4gICAgb3JpZ2luOiBUcmFuc2Zvcm07ICAgIFxyXG4gICAgY2hpbGRyZW46IEFycmF5PE9iamVjdDJEPjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEJhc2UgZm9yIGNoaWxkcmVuIHRoYXQgd2FudCB0byByZW5kZXIgc29tZXRoaW5nLlxyXG4gKiBFeHRlbmQgdGhpcyBjbGFzcyBmb3IgY3R4IGFjY2VzcyBhbmQgb3JpZ2luIHRyYW5zZm9ybSBoYW5kZWxpbmcuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRHJhd2FibGUgaW1wbGVtZW50cyBPYmplY3QyRCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMub3JpZ2luID0gbmV3IFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLnVzZV9sb2NhbF9jb29yZGluYXRlcyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub3JpZ2luX2luX2NlbnRlciA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqL1xyXG4gICAgb25VcGRhdGUoKXtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjaGlsZC5vblVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqIENhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgICovXHJcbiAgICBvblJlbmRlcigpeyAgICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSgtKHRoaXMub3JpZ2luLnNjYWxlLngvMiksLSh0aGlzLm9yaWdpbi5zY2FsZS55LzIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLm9yaWdpbi5wb3NpdGlvbi54LHRoaXMub3JpZ2luLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XHJcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUodGhpcy5vcmlnaW4uc2NhbGUueC8yLHRoaXMub3JpZ2luLnNjYWxlLnkvMik7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgICAgY3R4LnJvdGF0ZSh0aGlzLm9yaWdpbi5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5faW5fY2VudGVyKSB7XHJcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoLSh0aGlzLm9yaWdpbi5zY2FsZS54LzIpLC0odGhpcy5vcmlnaW4uc2NhbGUueS8yKSk7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBjdHguc2NhbGUodGhpcy5vcmlnaW4uc2NhbGUueCx0aGlzLm9yaWdpbi5zY2FsZS55KTsgICAgICBcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqIENhbGxlZCBhZnRlciB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXHJcbiAgICAgKi9cclxuICAgIGFmdGVyUmVuZGVyKCl7ICAgICAgICBcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIERyYXdhYmxlICYmICFjaGlsZC51c2VfbG9jYWxfY29vcmRpbmF0ZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnNjYWxlKDEvdGhpcy5vcmlnaW4uc2NhbGUueCwxL3RoaXMub3JpZ2luLnNjYWxlLnkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjaGlsZC5vblJlbmRlcigpO1xyXG5cclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb3JpZ2luOiBUcmFuc2Zvcm07ICAgIFxyXG4gICAgY2hpbGRyZW46IEFycmF5PE9iamVjdDJEPjtcclxuICAgIHVzZV9sb2NhbF9jb29yZGluYXRlczogYm9vbGVhbjtcclxuICAgIG9yaWdpbl9pbl9jZW50ZXI6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgQ29uZmlnIGZyb20gXCIuLy4uL2VuZ2luZUNvbmZpZ1wiO1xyXG5pbXBvcnQge2FjdGl2ZVNjZW5lfSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgdmFyIGN0eCA6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5leHBvcnQgdmFyIGNhbnZhcyA6SFRNTENhbnZhc0VsZW1lbnQ7XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyB0aGUgY2FudmFzIGNvbnRleHQuXHJcbiAqIEFsbHJlYWR5IGNhbGxlZCBieSB0aGUgaW5pdCBmdW5jdGlvbiBmcm9tIGNvcmUudHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCl7XHJcbiAgICBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKENvbmZpZy5jYW52YXNTZWxlY3RvcikhIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZXMgdmlld3BvcnQgc2l6ZSxcclxuICogY2FsbHMgYWxsIHRoZSBvblJlbmRlciBtZXRob2RzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKCl7ICBcclxuICAgIGlmKENvbmZpZy5yZXNpemVWaWV3cG9ydCl7XHJcbiAgICAgICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblxyXG4gICAgXHJcbiAgICBhY3RpdmVTY2VuZT8ucmVuZGVyKCk7XHJcbn0iLCJpbXBvcnQge0RyYXdhYmxlLCBPYmplY3QyRH0gZnJvbSBcIi4vb2JqZWN0MkRcIlxyXG5pbXBvcnQge2N0eCxjYW52YXN9IGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcblxyXG4vKipcclxuICogUm9vdCBmb3IgYWxsIHRoZSBlbGVtZW50cyBpbnNpZGUgeW91ciBsZXZlbC5cclxuICogT2JqZWN0cyBub3QgYSBtZW1iZXIgb2YgdGhlIGFjdGl2ZSBzY2VuZSB3b250IGJlIGNhbGxlZCB2aWEgb25VcGRhdGUgYW5kIG9uUmVuZGVyLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNjZW5le1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLm1lbWJlcnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKXtcclxuICAgICAgICB0aGlzLm1lbWJlcnMuZm9yRWFjaChjaGlsZD0+e1xyXG4gICAgICAgICAgICBjaGlsZC5vblVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vblVwZGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5vblVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKGNoaWxkPT57XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGNoaWxkLm9uUmVuZGVyKCk7XHJcbiAgICAgICAgICAgIGNoaWxkLmFmdGVyUmVuZGVyKCk7XHJcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9ICAgXHJcblxyXG4gICAgb25VcGRhdGU6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkO1xyXG4gICAgbWVtYmVyczogQXJyYXk8T2JqZWN0MkQ+O1xyXG59IiwiaW1wb3J0IHtEcmF3YWJsZX0gZnJvbSBcIi4vb2JqZWN0MkRcIjtcclxuaW1wb3J0IHtWZWN0b3IyLFRyYW5zZm9ybX0gZnJvbSBcIi4vYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyBjdHggfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5cclxuLyoqXHJcbiAqIERlZmluZXMgYSBzaGVwZSdzIG91dGxpbmVcclxuICovXHJcbmV4cG9ydCBjbGFzcyBPdXRsaW5lIHtcclxuICAgIGNvbnN0cnVjdG9yKHdpZHRoOiBudW1iZXIsY29sb3I6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMudGhpY2tuZXNzID0gd2lkdGg7XHJcbiAgICB9XHJcbiAgICB0aGlja25lc3M6IG51bWJlcjtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTb2xpZCBjb2xvciBkcmF3YWJsZSBlbGVtZW50XHJcbiAqIFVzZSBmb3IgY3VzdG9tIHBvbHlnb24gc2hhcGVzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNoYXBlIGV4dGVuZHMgRHJhd2FibGUge1xyXG4gICAgY29uc3RydWN0b3IodmVydGljaWVzOiBWZWN0b3IyW10sIGNvbG9yPzogc3RyaW5nLG91dGxpbmU/OiBPdXRsaW5lKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRpY2llcyA9IHZlcnRpY2llcztcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID8gY29sb3IgOiBcIndoaXRlXCI7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lID0gb3V0bGluZSA/IG91dGxpbmUgOiBuZXcgT3V0bGluZSgwLCcjMDAwMCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG8gbm90IGNhbGwgZXh0ZXJuYWx5XHJcbiAgICAgKiBDYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgICAqL1xyXG4gICAgb25SZW5kZXIoKXtcclxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xyXG4gICAgICAgXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8odGhpcy52ZXJ0aWNpZXNbMF0ueCx0aGlzLnZlcnRpY2llc1swXS55KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMudmVydGljaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMudmVydGljaWVzW2ldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh2ZXJ0ZXgueCx2ZXJ0ZXgueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHgucmVzZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICBcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLm91dGxpbmUudGhpY2tuZXNzO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMub3V0bGluZS5jb2xvcjtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7ICAgICAgICBcclxuXHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgdmVydGljaWVzOiBWZWN0b3IyW107XHJcbiAgICBvdXRsaW5lOiBPdXRsaW5lO1xyXG4gICAgY29sb3I6IHN0cmluZztcclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHsgRHJhd2FibGUgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL29iamVjdDJEXCI7XHJcbmltcG9ydCB7IE91dGxpbmUsIFNoYXBlIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zaGFwZVwiO1xyXG5pbXBvcnQgeyBUb29sIH0gZnJvbSBcIi4vY3Vyc29yVG9vbFwiO1xyXG5pbXBvcnQgeyBVdGlsaXR5IH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5pbXBvcnQge3dvcmxkLCBXb3JsZE1hbmFnZXJ9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgRmx1aWQsIFBvd2RlciwgU29saWQgfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5pbXBvcnQgeyBLZXlib2FyZElucHV0LCBNb3VzZUJ1dHRvbiwgTW91c2VJbnB1dCB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvaW5wdXRcIjtcclxuaW1wb3J0IHsgY3R4IH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9yZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBjdXJzb3IsdG9vbGJhciB9IGZyb20gXCIuL2dhbWVcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFRvb2xCYXIgZXh0ZW5kcyBTaGFwZXtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgbGV0IHNoYXBlID0gW1xyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigwLDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigxLDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigxLDEpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigwLDEpXHJcbiAgICAgICAgXVxyXG5cclxuICAgICAgICBzdXBlcihzaGFwZSxcIiMwMDAwXCIsbmV3IE91dGxpbmUoMSxcIndoaXRlXCIpKTtcclxuXHJcbiAgICAgICAgdGhpcy5vcmlnaW4ucG9zaXRpb24gPSBuZXcgVmVjdG9yMigwLDYwMCk7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4uc2NhbGUgPSBuZXcgVmVjdG9yMig4MDAsMzApO1xyXG5cclxuXHJcbiAgICAgICAgVG9vbC5Ub29scy5mb3JFYWNoKCh2LGspPT57XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQnV0dG9uKGspO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhZGRCdXR0b24odG9vbE5hbWU6c3RyaW5nKXtcclxuICAgICAgICBsZXQgYnV0dG9uID0gbmV3IFRvb2xCdXR0b24odG9vbE5hbWUpXHJcblxyXG4gICAgICAgIGJ1dHRvbi5vcmlnaW4ucG9zaXRpb24ueSA9IDE1O1xyXG4gICAgICAgIGJ1dHRvbi5vcmlnaW4ucG9zaXRpb24ueCA9IDgwMCAtICh0aGlzLmNoaWxkcmVuLmxlbmd0aCAqIDYwKSAtIDMwO1xyXG5cclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goYnV0dG9uKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVPdXRsaW5lKCl7XHJcbiAgICAgICAgLy9UT0RPOiBjaGFuZ2UgYnV0dG9uIG91dGxpbmUgYmFzZWQgb24gc2VsZWN0aW9uXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBUb29sQnV0dG9uIGV4dGVuZHMgU2hhcGV7XHJcbiAgICBjb25zdHJ1Y3Rvcih0b29sTmFtZTogc3RyaW5nKXtcclxuXHJcbiAgICAgICAgbGV0IHNoYXBlID0gW1xyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigwLDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigxLDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigxLDEpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigwLDEpXHJcbiAgICAgICAgXVxyXG5cclxuICAgICAgICBsZXQgdG9vbCA9IFRvb2wuVG9vbHMuZ2V0KHRvb2xOYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKCF0b29sKSB7XHJcbiAgICAgICAgICAgIHRocm93IGBUb29sICR7dG9vbE5hbWV9IG5vdCBmb3VuZGA7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgc3VwZXIoc2hhcGUsdG9vbC5jb2xvcixuZXcgT3V0bGluZSgxLFwid2hpdGVcIikpO1xyXG5cclxuICAgICAgICB0aGlzLm9yaWdpbi5zY2FsZSA9IG5ldyBWZWN0b3IyKDUwLDIwKTtcclxuICAgICAgICB0aGlzLnRvb2wgPSB0b29sO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IHRvb2xOYW1lO1xyXG4gICAgICAgIHRoaXMub3JpZ2luX2luX2NlbnRlciA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jdHhQb3MgPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVXBkYXRlKCl7XHJcbiAgICAgICAgbGV0IG1vdXNlID0gTW91c2VJbnB1dC5jdXJyZW50UG9zaXRpb247XHJcblxyXG4gICAgICAgIGxldCBwcmVzc2VkIDpNb3VzZUJ1dHRvbjtcclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGlmKE1vdXNlSW5wdXQuaXNQcmVzc2VkKFwiTE1CXCIpICl7XHJcbiAgICAgICAgICAgIHByZXNzZWQgPSBcIkxNQlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKE1vdXNlSW5wdXQuaXNQcmVzc2VkKFwiUk1CXCIpICl7XHJcbiAgICAgICAgICAgIHByZXNzZWQgPSBcIlJNQlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKE1vdXNlSW5wdXQuaXNQcmVzc2VkKFwiU2Nyb2xsQnV0dG9uXCIpICl7XHJcbiAgICAgICAgICAgIHByZXNzZWQgPSBcIlNjcm9sbEJ1dHRvblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBcclxuXHJcblxyXG5cclxuICAgICAgICBpZihtb3VzZS54ID4gdGhpcy5jdHhQb3MueCBcclxuICAgICAgICAgICAgJiZcclxuICAgICAgICAgICBtb3VzZS55ID4gdGhpcy5jdHhQb3MueSAgXHJcbiAgICAgICAgICAgJiZcclxuICAgICAgICAgICBtb3VzZS54IDwgdGhpcy5jdHhQb3MueCArIDUwIFxyXG4gICAgICAgICAgICAmJlxyXG4gICAgICAgICAgIG1vdXNlLnkgPCB0aGlzLmN0eFBvcy55ICsgMjAgKVxyXG4gICAgICAgIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgY3Vyc29yLnRvb2xzLnNldChwcmVzc2VkLHRoaXMudG9vbCk7ICAgXHJcbiAgICAgICAgICAgIHRvb2xiYXIudXBkYXRlT3V0bGluZSgpOyBcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG9uUmVuZGVyKCl7XHJcbiAgICAgICAgc3VwZXIub25SZW5kZXIoKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuY3R4UG9zID0gbmV3IFZlY3RvcjIoXHJcbiAgICAgICAgICAgIGN0eC5nZXRUcmFuc2Zvcm0oKS5lLFxyXG4gICAgICAgICAgICBjdHguZ2V0VHJhbnNmb3JtKCkuZlxyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnJlc2V0VHJhbnNmb3JtKCk7XHJcblxyXG4gICAgICAgICAgICBjdHguZm9udCA9IFwiYm9sZCAxNnB4IEFyaWFsXCI7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDAuOTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCB3aWR0aCA9IDUwIC1jdHgubWVhc3VyZVRleHQodGhpcy5uYW1lKS53aWR0aDtcclxuXHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCggICB0aGlzLm5hbWUsdGhpcy5jdHhQb3MueCArIHdpZHRoLzIsICB0aGlzLmN0eFBvcy55KzE2KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVRleHQoIHRoaXMubmFtZSx0aGlzLmN0eFBvcy54ICsgd2lkdGgvMiwgIHRoaXMuY3R4UG9zLnkrMTYpO1xyXG5cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZU91dGxpbmUoY29sb3I6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLm91dGxpbmUuY29sb3IgPSBjb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBjdHhQb3M6VmVjdG9yMjtcclxuICAgIHRvb2wgOiBUb29sO1xyXG4gICAgbmFtZSA6c3RyaW5nO1xyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQge1NoYXBlLE91dGxpbmV9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvc2hhcGVcIjtcclxuaW1wb3J0IHtNb3VzZUJ1dHRvbiwgTW91c2VJbnB1dH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9pbnB1dFwiO1xyXG5pbXBvcnQgeyBjdHggfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3JlbmRlcmVyXCI7XHJcbmltcG9ydCB7IHdvcmxkIH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBGbHVpZCwgUG93ZGVyLCBTb2xpZCB9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcbmltcG9ydCB7IFV0aWxpdHkgfSBmcm9tIFwiLi91dGlsXCI7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tIFwiLi9jdXJzb3JUb29sXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ3Vyc29yIGV4dGVuZHMgU2hhcGV7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIGxldCBkZWZhdWx0U2hhcGUgPSBbXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDIsMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDIsMiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMClcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBzdXBlcihkZWZhdWx0U2hhcGUsXCIjMDAwMFwiLG5ldyBPdXRsaW5lKDEsJyNGRkY5JykpO1xyXG5cclxuICAgICAgICB0aGlzLm9yaWdpbl9pbl9jZW50ZXIgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gMTtcclxuXHJcbiAgICAgICAgdGhpcy50b29scyA9IG5ldyBNYXA8TW91c2VCdXR0b24sVG9vbCB8IHVuZGVmaW5lZD4oW1xyXG4gICAgICAgICAgICBbXCJMTUJcIiwgICAgICAgICBUb29sLlRvb2xzLmdldChcIlNBTkRcIildLFxyXG4gICAgICAgICAgICBbXCJSTUJcIiwgICAgICAgICBUb29sLlRvb2xzLmdldChcIkVSQVNcIildLFxyXG4gICAgICAgICAgICBbXCJTY3JvbGxCdXR0b25cIixUb29sLlRvb2xzLmdldChcIlBJQ0tcIildXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVJhZGl1cyhyYWRpdXMgOiBudW1iZXIpe1xyXG4gICAgICAgIHJhZGl1cyA9IE1hdGgucm91bmQocmFkaXVzKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnZlcnRpY2llcyA9IFtcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIocmFkaXVzKjIsMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKHJhZGl1cyoyLHJhZGl1cyoyKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMCxyYWRpdXMqMiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMClcclxuICAgICAgICBdICAgICAgICBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgb25VcGRhdGUoKXtcclxuICAgICAgICB0aGlzLnJhZGl1cyAtPSBNb3VzZUlucHV0LmdldFdoZWVsT2Zmc2V0KCkueSAvIDEwMDtcclxuICAgICAgICBpZiAodGhpcy5yYWRpdXMgPCAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFkaXVzID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlUmFkaXVzKHRoaXMucmFkaXVzKTtcclxuXHJcbiAgICAgICAgdGhpcy50b29scy5mb3JFYWNoKCh0b29sLGJ1dHRvbik9PntcclxuICAgICAgICAgICAgaWYgKE1vdXNlSW5wdXQuaXNQcmVzc2VkKGJ1dHRvbikpIHtcclxuICAgICAgICAgICAgICAgIGlmKCF0b29sKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB0b29sLmRyYXcodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvblJlbmRlcigpeyAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGlmKE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4ucG9zaXRpb24ueCA9IE1hdGgucm91bmQoIE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uLnggLzIpICoyO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbi55ID0gTWF0aC5yb3VuZChNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbi55IC8yKSAqIDI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbi54IC09IHRoaXMucmFkaXVzO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbi55IC09IHRoaXMucmFkaXVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmN0eCA9PSBjdHgpO1xyXG5cclxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJhZGl1czpudW1iZXI7XHJcbiAgICB0b29sczpNYXA8TW91c2VCdXR0b24sVG9vbCB8IHVuZGVmaW5lZD47XHJcblxyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyBNb3VzZUlucHV0IH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9pbnB1dFwiO1xyXG5pbXBvcnQgeyBDdXJzb3IgfSBmcm9tIFwiLi9jdXJzb3JcIjtcclxuaW1wb3J0IHsgY3Vyc29yLCB0b29sYmFyIH0gZnJvbSBcIi4vZ2FtZVwiO1xyXG5pbXBvcnQgeyBGbHVpZCwgUG93ZGVyLCBTb2xpZCB9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcbmltcG9ydCB7IFV0aWxpdHkgfSBmcm9tIFwiLi91dGlsXCI7XHJcbmltcG9ydCB7IHdvcmxkIH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRvb2x7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZVBhcnQgOiAocG9zOiBWZWN0b3IyKSA9PiB2b2lkLCBjb2xvcjpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBwbGFjZVBhcnQ7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3Vyc29yOkN1cnNvcil7XHJcbiAgICAgICAgbGV0IHBvcyA9IGN1cnNvci5vcmlnaW4ucG9zaXRpb247XHJcblxyXG4gICAgICAgIHBvcy54ID0gTWF0aC5mbG9vcihwb3MueCAvIDIpO1xyXG4gICAgICAgIHBvcy55ID0gTWF0aC5mbG9vcihwb3MueSAvIDIpO1xyXG5cclxuICAgICAgICAvL21vdXNlIGluIHdvcmxkXHJcbiAgICAgICAgaWYoIVV0aWxpdHkuaW5Cb3VuZHMoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uLngvMixNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbi55LzIpKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IHkgPSBwb3MueTsgeSA8IChwb3MueSArIChjdXJzb3IucmFkaXVzKSk7IHkrKykgeyAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBwb3MueDsgeCA8IChwb3MueCArIChjdXJzb3IucmFkaXVzKSk7IHgrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCFVdGlsaXR5LmluQm91bmRzKG5ldyBWZWN0b3IyKHgseSkpKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFjayhuZXcgVmVjdG9yMih4LHkpKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNhbGxiYWNrIDogKHBvczogVmVjdG9yMikgPT4gdm9pZDtcclxuICAgIGNvbG9yOnN0cmluZzsgICAgXHJcblxyXG4gICAgc3RhdGljIFRvb2xzIDogTWFwPHN0cmluZyxUb29sPiA9IG5ldyBNYXA8c3RyaW5nLFRvb2w+KFtcclxuICAgICAgICBbXCJTQU5EXCIsXHJcblxyXG4gICAgICAgICAgICBuZXcgVG9vbChwb3M9PntcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXdvcmxkLnBhcnRpY2xlc1twb3MueV1bcG9zLnhdKVxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBhcnRpY2xlc1twb3MueV1bcG9zLnhdID0gbmV3IFBvd2Rlcihwb3MpO1xyXG5cclxuICAgICAgICAgICAgfSxcInllbGxvd1wiKSAgICAgICAgICAgIFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgW1wiV0FUUlwiLFxyXG5cclxuICAgICAgICAgICAgbmV3IFRvb2wocG9zPT57XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF3b3JsZC5wYXJ0aWNsZXNbcG9zLnldW3Bvcy54XSlcclxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbcG9zLnldW3Bvcy54XSA9IG5ldyBGbHVpZChwb3MpO1xyXG5cclxuICAgICAgICAgICAgfSxcImFxdWFcIikgICAgICAgICAgICBcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcIldBTExcIixcclxuXHJcbiAgICAgICAgICAgIG5ldyBUb29sKHBvcz0+e1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghd29ybGQucGFydGljbGVzW3Bvcy55XVtwb3MueF0pXHJcbiAgICAgICAgICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3Bvcy55XVtwb3MueF0gPSBuZXcgU29saWQocG9zKTtcclxuXHJcbiAgICAgICAgICAgIH0sXCJncmF5XCIpICAgICAgICAgICAgXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXCJFUkFTXCIsXHJcblxyXG4gICAgICAgICAgICBuZXcgVG9vbChwb3M9PntcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAod29ybGQucGFydGljbGVzW3Bvcy55XVtwb3MueF0pXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHdvcmxkLnBhcnRpY2xlc1twb3MueV1bcG9zLnhdO1xyXG5cclxuICAgICAgICAgICAgfSxcInJlZFwiKSAgICAgICAgICAgIFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgW1wiUElDS1wiLFxyXG4gICAgICAgICAgICBuZXcgVG9vbChwb3M9PntcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcGFydCA9IHdvcmxkLnBhcnRpY2xlc1twb3MueV1bcG9zLnhdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHBhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwaWNrZWQgPSBUb29sLlRvb2xzLmdldChwYXJ0LnBhcnROYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYocGlja2VkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yLnRvb2xzLnNldChcIkxNQlwiLHBpY2tlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xiYXIudXBkYXRlT3V0bGluZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICB9LFwibGltZVwiKSAgICAgICAgICAgIFxyXG4gICAgICAgIF0sXHJcbiAgICBdKTtcclxufSIsImltcG9ydCAqIGFzIENFIGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvY29yZVwiO1xyXG5cclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zY2VuZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcblxyXG5pbXBvcnQge3dvcmxkLCBXb3JsZE1hbmFnZXJ9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuXHJcbmltcG9ydCB7S2V5Ym9hcmRJbnB1dCwgTW91c2VJbnB1dH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9pbnB1dFwiO1xyXG5cclxuaW1wb3J0IHsgRmx1aWQsIFBvd2RlciwgU29saWQgfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5pbXBvcnQgeyBDdXJzb3IgfSBmcm9tIFwiLi9jdXJzb3JcIjtcclxuaW1wb3J0IHsgUGh5c2ljcyB9IGZyb20gXCIuL3BoeXNpY3NcIjtcclxuaW1wb3J0IHsgVG9vbEJhciB9IGZyb20gXCIuL1Rvb2xCYXJcIjtcclxuaW1wb3J0IHsgVG9vbCB9IGZyb20gXCIuL2N1cnNvclRvb2xcIjtcclxuaW1wb3J0IHsgVXRpbGl0eSB9IGZyb20gXCIuL3V0aWxcIjtcclxuXHJcbi8vY3JlYXRlIHNjZW5lXHJcbmxldCBsZXZlbCA9IG5ldyBTY2VuZSgpO1xyXG5sZXQgd29ybGRfbWFuYWdlciA9IG5ldyBXb3JsZE1hbmFnZXIoKTtcclxuZXhwb3J0IGxldCBjdXJzb3IgPSBuZXcgQ3Vyc29yKCk7XHJcbmV4cG9ydCBsZXQgdG9vbGJhciA9IG5ldyBUb29sQmFyKCk7XHJcblxyXG53aW5kb3cub25sb2FkID0gKCk9PntcclxuICAgIC8vaW5pdCBlbmdpbmVcclxuICAgIENFLmluaXQoKTtcclxuICAgIC8vYmluZCBzY2VuZVxyXG4gICAgQ0Uuc2V0QWN0aXZlU2NlbmUobGV2ZWwpO1xyXG4gICAgXHJcbiAgICBsZXZlbC5tZW1iZXJzLnB1c2god29ybGRfbWFuYWdlcik7XHJcbiAgICB3b3JsZF9tYW5hZ2VyLm9yaWdpbi5zY2FsZSA9IG5ldyBWZWN0b3IyKDIsMik7XHJcbiAgICAgICAgXHJcbiAgICBsZXZlbC5tZW1iZXJzLnB1c2goY3Vyc29yKTtcclxuICAgIGxldmVsLm1lbWJlcnMucHVzaCh0b29sYmFyKTtcclxuICAgIHRvb2xiYXIudXBkYXRlT3V0bGluZSgpO1xyXG5cclxuXHJcbiAgXHJcblxyXG5cclxuICAgIC8vd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBQb3dkZXIobmV3IFZlY3RvcjIoODAsMCkpKTsgIFxyXG5cclxuICAgIC8vRGVtbyB3b3JsZFxyXG4gICAgZm9yIChsZXQgeCA9IDYwOyB4IDwgMTQwOyB4KyspIHsgICAgIFxyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTU7IHkrKykgeyAgICAgXHJcbiAgICAgICAgICAgIC8vbWl4IHNvbWUgZmx1aWQgYW5kIHBvd2RlclxyXG4gICAgICAgICAgICBpZih4KnkgJSAzID09IDApeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgUG93ZGVyKG5ldyBWZWN0b3IyKHgseSkpKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgRmx1aWQobmV3IFZlY3RvcjIoeCx5KzIwKSkpOyBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDA7IHgrKykgeyBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKHgrMCx4KzYwKSkpOyAgICBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKHgrMCx4KzYxKSkpOyAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTAwOyB4KyspIHsgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsyMDAseCs2MCkpKTsgICAgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsyMDAseCs2MSkpKTsgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDUwOyB4KyspIHsgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMigteCsxMDAseCsxOTApKSk7ICAgIFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMTAwLHgrMTkxKSkpOyAgICAgIFxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vcnVucyBldmVyeSB0aWNrIFxyXG5sZXZlbC5vblVwZGF0ZSA9ICgpPT57XHJcbiAgICBcclxuXHJcbiAgICBpZiAoS2V5Ym9hcmRJbnB1dC5pc0p1c3RQcmVzc2VkKFwiU3BhY2VcIikpIHtcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLnBhdXNlZCA9ICF3b3JsZF9tYW5hZ2VyLnBhdXNlZDsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChLZXlib2FyZElucHV0LmlzSnVzdFByZXNzZWQoXCJmXCIpKSB7XHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgIFBoeXNpY3Muc3RlcCh3b3JsZCk7XHJcbiAgICB9ICBcclxuXHJcbn07ICIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHsgVXRpbGl0eSB9IGZyb20gXCIuL3V0aWxcIjtcclxuaW1wb3J0IHsgd29ybGQsV29ybGRTaXplIH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJ0aWNsZXtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB0aGlzLmNvbG9yID0ge3I6MjU1LGc6MjU1LGI6MjU1fTtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0ZXAoKXtcclxuICAgIH07XHJcbiAgIFxyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7IFxyXG4gICAgY29sb3I6IHtyOm51bWJlcixnOm51bWJlcixiOm51bWJlcn07XHJcbiAgICBwYXJ0TmFtZSA9IFwiTk9ORVwiO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW92ZWFibGUgZXh0ZW5kcyBQYXJ0aWNsZXsgICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICBzdXBlcihwb3NpdGlvbilcclxuXHJcbiAgICAgICAgdGhpcy53ZWlnaHQgPSAxO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeU1vdmUocmVsYXRpdmVQb3M6IFZlY3RvcjIpIDpib29sZWFue1xyXG4gICAgICAgIGlmICghVXRpbGl0eS5pbkJvdW5kcyhuZXcgVmVjdG9yMih0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueCx0aGlzLnBvc2l0aW9uLnkrcmVsYXRpdmVQb3MueSkpKSBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAgICAgXHJcblxyXG4gICAgICAgIGxldCB0YXJnZXQgPSB3b3JsZC5wYXJ0aWNsZXNbdGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnldW3RoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54XTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldCAhPSB1bmRlZmluZWQpIHsgXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyeVN3YXAocmVsYXRpdmVQb3MpOztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHJlbGF0aXZlUG9zLng7IFxyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gcmVsYXRpdmVQb3MueTsgXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cnlTd2FwKHJlbGF0aXZlUG9zOiBWZWN0b3IyKSA6Ym9vbGVhbnsgICAgICAgIFxyXG4gICAgICAgIGxldCB0YXJnZXQgPSB3b3JsZC5wYXJ0aWNsZXNbdGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnldW3RoaXMucG9zaXRpb24ueCtyZWxhdGl2ZVBvcy54XTtcclxuXHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTW92ZWFibGUgJiYgdGFyZ2V0LndlaWdodCA8IHRoaXMud2VpZ2h0KVxyXG4gICAgICAgIHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vU3dhcCEgICAgICAgICAgICBcclxuICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueV1bdGhpcy5wb3NpdGlvbi54XSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3RhcmdldC5wb3NpdGlvbi55XVt0YXJnZXQucG9zaXRpb24ueF0gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3UG9zID0gbmV3IFZlY3RvcjIodGFyZ2V0LnBvc2l0aW9uLngsdGFyZ2V0LnBvc2l0aW9uLnkpO1xyXG5cclxuICAgICAgICAgICAgdGFyZ2V0LnBvc2l0aW9uLnggPSB0aGlzLnBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgIHRhcmdldC5wb3NpdGlvbi55ID0gdGhpcy5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1BvcztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdvcmxkLnBhcnRpY2xlc1t0aGlzLnBvc2l0aW9uLnldW3RoaXMucG9zaXRpb24ueF0gPSB0aGlzO1xyXG4gICAgICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbdGFyZ2V0LnBvc2l0aW9uLnldW3RhcmdldC5wb3NpdGlvbi54XSA9IHRhcmdldDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdmVsb2NpdHk6IFZlY3RvcjI7ICAgIFxyXG4gICAgd2VpZ2h0OiBudW1iZXI7XHJcblxyXG59XHJcblxyXG4vLzQgQmFzZSBwYXJ0aWNsZSB0eXBlcyBTb2xpZCBQb3dkZXIgRmx1aWQgR2FzXHJcblxyXG5leHBvcnQgY2xhc3MgU29saWQgZXh0ZW5kcyBQYXJ0aWNsZXtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xyXG4gICAgICAgIHN1cGVyKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0ge3I6MTIwLGc6MTIwLGI6MTIwfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICB9XHJcblxyXG4gICAgcGFydE5hbWUgPSBcIldBTExcIjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvd2RlciBleHRlbmRzIE1vdmVhYmxle1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgc3VwZXIocG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSB7cjoyNTUsZzoyNTUsYjowfTs7XHJcbiAgICAgICAgdGhpcy53ZWlnaHQgPSAyO1xyXG4gICAgfVxyXG5cclxuICAgIHN0ZXAoKXtcclxuICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigwLDEpKSkgeyBcclxuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9ICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigxLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwYXJ0TmFtZSA9IFwiU0FORFwiO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRmx1aWQgZXh0ZW5kcyBNb3ZlYWJsZXtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xyXG4gICAgICAgIHN1cGVyKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0ge3I6MTAsZzoxNzAsYjoyNTV9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0ZXAoKXtcclxuICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigwLDEpKSkgeyBcclxuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVNpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVTaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlU2lkZSgpe1xyXG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwwKSkpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMCkpKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwwKSkpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwwKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHBhcnROYW1lID0gXCJXQVRSXCI7XHJcbn0iLCJpbXBvcnQge1dvcmxkLFdvcmxkU2l6ZX0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7TW92ZWFibGUsIFBhcnRpY2xlfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5cclxuaW50ZXJmYWNlIFBoeXNpY3N7XHJcblxyXG4gICAgc3RlcChzaW1fc3RhdGU6IFdvcmxkKTpXb3JsZDtcclxuXHJcbn1cclxuXHJcbmNsYXNzIEJhc2ljUGh5c2ljcyBpbXBsZW1lbnRzIFBoeXNpY3N7XHJcblxyXG4gICAgc3RlcChzaW1fc3RhdGU6IFdvcmxkKXtcclxuICAgICAgICBsZXQgbW92ZWQgOkFycmF5PFBhcnRpY2xlPiA9IFtdO1xyXG5cclxuICAgICAgICAvL3NpbV9zdGF0ZS5pdHRlcmF0b3JEaXJlY3Rpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKjMpO1xyXG5cclxuICAgICAgICAvL1RoaXMgbGluZSBmaXhlcyBldmVyeXRoaW5nXHJcbiAgICAgICAgc2ltX3N0YXRlLml0dGVyYXRvckRpcmVjdGlvbisrXHJcbiAgICAgICAgaWYgKHNpbV9zdGF0ZS5pdHRlcmF0b3JEaXJlY3Rpb24gPiAzKSB7XHJcbiAgICAgICAgICAgIHNpbV9zdGF0ZS5pdHRlcmF0b3JEaXJlY3Rpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHNpbV9zdGF0ZSl7XHJcbiAgICAgICAgICAgIGlmKCFwYXJ0IHx8ICEocGFydCBpbnN0YW5jZW9mIE1vdmVhYmxlKSB8fCBtb3ZlZC5pbmNsdWRlcyhwYXJ0KSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgIHBhcnQuc3RlcCgpOyAgICAgXHJcbiAgICAgICAgICAgIG1vdmVkLnB1c2gocGFydCk7XHJcblxyXG4gICAgICAgICAgICBzaW1fc3RhdGUucGFydGljbGVzW3BhcnQucG9zaXRpb24ueV1bcGFydC5wb3NpdGlvbi54XSA9IHBhcnQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNpbV9zdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFBoeXNpY3MgPSBuZXcgQmFzaWNQaHlzaWNzKCk7IiwiaW1wb3J0IHtXb3JsZCxXb3JsZFNpemUsd29ybGR9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuaW1wb3J0IHtjYW52YXMsY3R4fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3JlbmRlcmVyXCJcclxuaW1wb3J0IHsgVXRpbGl0eSB9IGZyb20gXCIuL3V0aWxcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5cclxuaW50ZXJmYWNlIFJlbmRlcmVye1xyXG5cclxuICAgIGRyYXdGcmFtZShzaW1fc3RhdGU6IFdvcmxkKSA6IHZvaWQ7XHJcblxyXG59XHJcblxyXG5cclxuY2xhc3MgQmFzaWNSZW5kZXJlciBpbXBsZW1lbnRzIFJlbmRlcmVye1xyXG5cclxuICAgIGRyYXdGcmFtZShzaW1fc3RhdGU6IFdvcmxkKXtcclxuXHJcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHNpbV9zdGF0ZSl7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBhcnQpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuIFxyXG5cclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFV0aWxpdHkucmdiVG9IZXgocGFydC5jb2xvcik7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdChwYXJ0LnBvc2l0aW9uLngscGFydC5wb3NpdGlvbi55LDEsMSk7IC8vZHJhdyByZWN0YW5nbGUgOlAgICAgICAgICAgIFxyXG5cclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNsYXNzIFBpeGVsUmVuZGVyZXIgaW1wbGVtZW50cyBSZW5kZXJlcntcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzRGF0YSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAvL2N0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3RnJhbWUoc2ltX3N0YXRlOiBXb3JsZCl7XHJcbiAgICAgICAgdGhpcy5jYW52YXNEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBXb3JsZFNpemUueCp0aGlzLnNjYWxlLngsIFdvcmxkU2l6ZS55KnRoaXMuc2NhbGUueSk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgV29ybGRTaXplLngqdGhpcy5zY2FsZS54OyB4KyspIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBXb3JsZFNpemUueSp0aGlzLnNjYWxlLnk7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcnQgPSB3b3JsZC5wYXJ0aWNsZXNbTWF0aC5mbG9vcih5L3RoaXMuc2NhbGUueSldW01hdGguZmxvb3IoeC90aGlzLnNjYWxlLngpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXBhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gKHggKyB5ICogV29ybGRTaXplLngqdGhpcy5zY2FsZS54KSAqIDQgO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzRGF0YS5kYXRhW2luZGV4ICsgMF0gPSBwYXJ0LmNvbG9yLnI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhc0RhdGEuZGF0YVtpbmRleCArIDFdID0gcGFydC5jb2xvci5nO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXNEYXRhLmRhdGFbaW5kZXggKyAyXSA9IHBhcnQuY29sb3IuYjtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzRGF0YS5kYXRhW2luZGV4ICsgM10gPSAyNTU7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICAgXHJcbiAgICAgICAgY3R4LnB1dEltYWdlRGF0YSh0aGlzLmNhbnZhc0RhdGEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbnZhc0RhdGE6SW1hZ2VEYXRhIHwgdW5kZWZpbmVkO1xyXG4gICAgc2NhbGUgPSBuZXcgVmVjdG9yMigyLDIpO1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFJlbmRlcmVyID0gbmV3IFBpeGVsUmVuZGVyZXIoKTsiLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7IFdvcmxkU2l6ZSB9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVdGlsaXR5e1xyXG5cclxuICAgIHN0YXRpYyBpbkJvdW5kcyhwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICBpZiAocG9zaXRpb24ueSA+PSBXb3JsZFNpemUueSB8fCBwb3NpdGlvbi54ID49IFdvcmxkU2l6ZS54IHx8XHJcbiAgICAgICAgICAgIHBvc2l0aW9uLnkgPCAwIHx8IHBvc2l0aW9uLnggPCAwICkgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHZlY3RvckludGVycG9sYXRlKGZyb206VmVjdG9yMiwgdG86VmVjdG9yMiwgcHJvZ3Jlc3M6bnVtYmVyKXtcclxuICAgICAgICBcclxuICAgICAgICBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJnYlRvSGV4KGNvbG9yIDp7cjpudW1iZXIsZzpudW1iZXIsYjpudW1iZXJ9KTpzdHJpbmcge1xyXG4gICAgICAgIGxldCByID0gY29sb3IucjtcclxuICAgICAgICBsZXQgZyA9IGNvbG9yLmc7XHJcbiAgICAgICAgbGV0IGIgPSBjb2xvci5iO1xyXG5cclxuICAgICAgICBsZXQgcmhleCA9IHIudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIHJoZXggPSAoIHJoZXgubGVuZ3RoID09IDEgPyBcIjBcIiArIHJoZXggOiByaGV4KTtcclxuXHJcbiAgICAgICAgbGV0IGdoZXggPSBnLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICBnaGV4ID0gKCBnaGV4Lmxlbmd0aCA9PSAxID8gXCIwXCIgKyBnaGV4IDogZ2hleCk7XHJcblxyXG4gICAgICAgIGxldCBiaGV4ID0gYi50b1N0cmluZygxNik7XHJcbiAgICAgICAgYmhleCA9ICggYmhleC5sZW5ndGggPT0gMSA/IFwiMFwiICsgYmhleCA6IGJoZXgpO1xyXG5cclxuICAgICAgICByZXR1cm4gYCMke3JoZXh9JHtnaGV4fSR7YmhleH1gO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtEcmF3YWJsZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9vYmplY3QyRFwiO1xyXG5pbXBvcnQge2N0eH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9yZW5kZXJlclwiO1xyXG5pbXBvcnQge1BhcnRpY2xlfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5pbXBvcnQge1JlbmRlcmVyfSBmcm9tIFwiLi9yZW5kZXJcIjtcclxuaW1wb3J0IHtQaHlzaWNzfSBmcm9tIFwiLi9waHlzaWNzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgV29ybGRTaXplID0gbmV3IFZlY3RvcjIoNDAwLDMwMCk7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGR7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuaXR0ZXJhdG9yRGlyZWN0aW9uID0gMjtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgQXJyYXkoV29ybGRTaXplLnkpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpbmRleCsrKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2luZGV4XSA9IG5ldyBBcnJheShXb3JsZFNpemUueCkuZmlsbCh1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL0l0dGVyYXRvclxyXG4gICAgcHJpdmF0ZSBnZXRJdHRlclZhbChpIDogbnVtYmVyKTpQYXJ0aWNsZSB8IHVuZGVmaW5lZHsgXHJcbiAgICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKGkvV29ybGRTaXplLngpO1xyXG4gICAgICAgIGxldCB4ID0gaSAtIE1hdGguZmxvb3IoaS9Xb3JsZFNpemUueCkqV29ybGRTaXplLng7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5pdHRlcmF0b3JEaXJlY3Rpb24pIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFydGljbGVzW3ldW1dvcmxkU2l6ZS54IC0geCAtMV07ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZXNbV29ybGRTaXplLnkgLSB5IC0gMV1beF07ICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnRpY2xlc1tXb3JsZFNpemUueSAtIHkgLTFdW1dvcmxkU2l6ZS54IC0geCAtMV07ICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZXNbeV1beF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIFtTeW1ib2wuaXRlcmF0b3JdID0gKCkgPT4geyAgICAgIFxyXG4gICAgICAgIGxldCBpID0gMDtcclxuXHJcbiAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICBuZXh0OigpPT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm57XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZTogKGkgPj0gKFdvcmxkU2l6ZS54ICogV29ybGRTaXplLnkgLSAxKSksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuZ2V0SXR0ZXJWYWwoaSsrKSAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBhcnRpY2xlczpBcnJheTxBcnJheTxQYXJ0aWNsZSB8IHVuZGVmaW5lZD4+O1xyXG5cclxuICAgIGl0dGVyYXRvckRpcmVjdGlvbiA6bnVtYmVyOyAvLzAtMyB0bCB0ciBibCBiclxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgd29ybGQgPSBuZXcgV29ybGQoKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZE1hbmFnZXIgZXh0ZW5kcyBEcmF3YWJsZXsgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgb25VcGRhdGUoKXsgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25SZW5kZXIoKXtcclxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZighdGhpcy5wYXVzZWQpXHJcbiAgICAgICAgICAgIFBoeXNpY3Muc3RlcCh3b3JsZCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIFJlbmRlcmVyLmRyYXdGcmFtZSh3b3JsZCk7XHJcblxyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjNzc3JztcclxuICAgICAgICBjdHguc3Ryb2tlUmVjdCgwLDAsNDAwLDMwMCk7XHJcbiAgICB9ICAgIFxyXG5cclxuXHJcbiAgICBhZGRQYXJ0KHBhcnQ6IFBhcnRpY2xlKXsgICAgICAgIFxyXG4gICAgICAgIHdvcmxkLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSBwYXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlZDpib29sZWFuO1xyXG59XHJcblxyXG5cclxuXHJcbi8vVE9ETzogTXVsdGl0aHJlYWRpbmcgaWYgaSBmYW5jeVxyXG4vKlxyXG51c2UgdGhpcyB0byB0ZXN0IGlmIHN1cHBvcnRlZFxyXG5cclxuaWYgKHR5cGVvZihXb3JrZXIpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgIC8vZ3JlYXQsIHlvdXIgYnJvd3NlciBzdXBwb3J0cyB3ZWIgd29ya2Vyc1xyXG59IGVsc2Uge1xyXG4gICAvL25vdCBzdXBwb3J0ZWRcclxufVxyXG5cclxuKi8iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4uL2dhbWUvZ2FtZS50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=