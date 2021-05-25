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
var util_1 = __webpack_require__(/*! ./util */ "../game/util.ts");
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
        _this.wasPressed = false;
        _this.lastPos = new base_types_1.Vector2(0, 0);
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
        var placed = false;
        this.tools.forEach(function (tool, button) {
            if (input_1.MouseInput.isPressed(button)) {
                if (!tool)
                    return;
                _this.draw(tool);
                return;
            }
        });
    };
    Cursor.prototype.draw = function (tool) {
        var myPos = new base_types_1.Vector2(this.origin.position.x, this.origin.position.y);
        var distance = new base_types_1.Vector2(myPos.x - this.lastPos.x, myPos.y - this.lastPos.y);
        var step = 1 / distance.lenght();
        console.log(step);
        for (var index = 0; index < 1; index += step) {
            var target = util_1.Utility.vectorInterpolate(this.lastPos, myPos, index);
            tool.draw(target, this.radius);
        }
    };
    Cursor.prototype.onRender = function () {
        if (input_1.MouseInput.currentPosition) {
            this.lastPos = new base_types_1.Vector2(this.origin.position.x, this.origin.position.y);
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
    Tool.prototype.draw = function (position, radius) {
        var pos = position;
        pos.x = Math.floor(pos.x / 2);
        pos.y = Math.floor(pos.y / 2);
        //mouse in world
        if (!util_1.Utility.inBounds(new base_types_1.Vector2(input_1.MouseInput.currentPosition.x / 2, input_1.MouseInput.currentPosition.y / 2)))
            return;
        for (var y = pos.y; y < (pos.y + (radius)); y++) {
            for (var x = pos.x; x < (pos.x + (radius)); x++) {
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
var base_types_1 = __webpack_require__(/*! ../Canvas-Engine/src/engine/base_types */ "./src/engine/base_types.ts");
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
        var out = new base_types_1.Vector2(to.x - from.x, to.y - from.y);
        out.x *= progress;
        out.y *= progress;
        out.x += from.x;
        out.y += from.y;
        return out;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZUNvbmZpZy50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4vc3JjL2VuZ2luZS9iYXNlX3R5cGVzLnRzIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvLi9zcmMvZW5naW5lL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvaW5wdXQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvb2JqZWN0MkQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2NlbmUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uL3NyYy9lbmdpbmUvc2hhcGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL1Rvb2xCYXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL2N1cnNvci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvY3Vyc29yVG9vbC50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvZ2FtZS50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvcGFydGljbGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3BoeXNpY3MudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWVuZ2luZS8uLi9nYW1lL3JlbmRlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvdXRpbC50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lLy4uL2dhbWUvd29ybGRfbWFuYWdlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy1lbmdpbmUvd2VicGFj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QU0sQ0FBQztRQUN6QixjQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFHRCw4QkFBTyxHQUFQLFVBQVEsSUFBYztRQUNsQixhQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDN0QsQ0FBQztJQUdMLG1CQUFDO0FBQUQsQ0FBQyxDQTVCaUMsbUJBQVEsR0E0QnpDO0FBNUJZLG9DQUFZO0FBZ0N6QixpQ0FBaUM7QUFDakM7Ozs7Ozs7OztFQVNFOzs7Ozs7O1VDeEdGO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VDckJBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlF1ZXJyeSBzZWxlY3RvciBmb3IgdGhlIGNhbnZhcyBlbGVtZW50XHJcbiovXHJcbmNvbnN0IGNhbnZhc1NlbGVjdG9yID0gXCIjZ2FtZVwiO1xyXG5jb25zdCByZXNpemVWaWV3cG9ydCA9IGZhbHNlO1xyXG4vKipUYXJnZXQgZnJhbWVzIHBlciBzZWNvbmRcclxuKi9cclxuY29uc3QgZnBzID0gNjA7XHJcblxyXG5leHBvcnQge1xyXG4gICAgY2FudmFzU2VsZWN0b3IsICAgIFxyXG4gICAgZnBzLFxyXG4gICAgcmVzaXplVmlld3BvcnRcclxufSIsIi8qKlxyXG4gKiAyRCBWZWN0b3JcclxuICogU3RvcmVzIFggYW5kIFlcclxuKi9cclxuZXhwb3J0IGNsYXNzIFZlY3RvcjIgIHtcclxuICAgIGNvbnN0cnVjdG9yKFggOm51bWJlcixZIDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMueCA9IFg7XHJcbiAgICAgICAgdGhpcy55ID0gWTtcclxuICAgIH1cclxuXHJcbiAgICBsZW5naHQoKXtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICBNYXRoLnBvdyh0aGlzLngsMikgKyBNYXRoLnBvdyh0aGlzLnksMilcclxuICAgICAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBub3JtYWxpemVkKCl7XHJcbiAgICAgICAgbGV0IG5ld1ZlY3RvciA9IG5ldyBWZWN0b3IyKHRoaXMueCx0aGlzLnkpO1xyXG4gICAgICAgIGxldCBsZW5naHQgPSBuZXdWZWN0b3IubGVuZ2h0KClcclxuICAgICAgICBuZXdWZWN0b3IueCAvPSBsZW5naHQ7XHJcbiAgICAgICAgbmV3VmVjdG9yLnkgLz0gbGVuZ2h0O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3VmVjdG9yO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB4Om51bWJlcjtcclxuICAgIHk6bnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogU3RvcmVzIHBvc2l0aW9uIHJvdGF0aW9uIChkZWdyZWVzKSBhbmQgc2NhbGVcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xyXG4gICAgY29uc3RydWN0b3IocG9zPyA6VmVjdG9yMiwgcm90PyA6bnVtYmVyLCBzY2FsZT8gOlZlY3RvcjIpe1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gICA9IHBvcyA/IHBvcyAgICAgOiBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gICA9IHJvdCA/IHJvdCAgICAgOiAwO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgICAgICA9IHNjYWxlID8gc2NhbGUgOiBuZXcgVmVjdG9yMigxLDEpO1xyXG4gICAgfVxyXG4gICAgcG9zaXRpb246IFZlY3RvcjI7XHJcbiAgICByb3RhdGlvbjogbnVtYmVyO1xyXG4gICAgc2NhbGU6IFZlY3RvcjI7XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgUmVuZGVyaW5nIGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcbmltcG9ydCAqIGFzIENvbmZpZyBmcm9tIFwiLi8uLi9lbmdpbmVDb25maWdcIjtcclxuaW1wb3J0IHtTY2VuZX0gZnJvbSBcIi4vc2NlbmVcIjtcclxuaW1wb3J0IHtLZXlib2FyZElucHV0LCBNb3VzZUlucHV0fSBmcm9tIFwiLi8uLi9lbmdpbmUvaW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgdmFyIGFjdGl2ZVNjZW5lIDogU2NlbmUgfCB1bmRlZmluZWRcclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHNjZW5lIHlvdSB3YW50IHRvIGJlIGN1cnJlbnRseSBkaXNwbGF5ZWQgYW5kIHVwZGF0ZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3RpdmVTY2VuZShzY2VuZSA6U2NlbmUpe1xyXG4gICAgYWN0aXZlU2NlbmUgPSBzY2VuZTtcclxufVxyXG4vKipcclxuICogSW5pdGlhbGl6ZSB0aGUgZW5naW5lXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgUmVuZGVyaW5nLmluaXQoKTtcclxuICAgIEtleWJvYXJkSW5wdXQuaW5pdCgpO1xyXG4gICAgTW91c2VJbnB1dC5pbml0KCk7XHJcblxyXG4gICAgc2V0SW50ZXJ2YWwodXBkYXRlLDEwMDAvQ29uZmlnLmZwcyk7XHJcbn1cclxuLyoqXHJcbiAqIERvbid0IHVzZSBleHRlcm5hbHkuXHJcbiAqIENhbGxzIG9uVXBkYXRlIGFuZCBvblJlbmRlciBtZXRob2RzXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGUoKXtcclxuICAgIGlmKGFjdGl2ZVNjZW5lPy5vblVwZGF0ZSlcclxuICAgICAgICBhY3RpdmVTY2VuZS5vblVwZGF0ZSgpO1xyXG4gICAgYWN0aXZlU2NlbmU/LnVwZGF0ZSgpO1xyXG5cclxuICAgIFJlbmRlcmluZy5yZW5kZXIoKTtcclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7IGNhbnZhcyB9IGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcblxyXG4vKipcclxuICogTW9zdCBvZiBrZXlzIHByZXNlbnQgb24gdGhlIGtleWJvYXJkIGFzIGEgc3RyaW5nIHVuaW9uLiBQbGVhc2UgcmVwb3J0IGFueSBtaXNzaW5nIGtleXMuXHJcbiAqL1xyXG5leHBvcnQgdHlwZSBLZXkgPSBcIlRhYlwiIHwgXCJBbHRcIiB8IFwiQWx0R3JhcGhcIiB8IFwiQmFja3NwYWNlXCIgfCBcIkNvbnRyb2xcIiB8XCJTaGlmdFwiIHwgXCJTcGFjZVwiIHwgXCJDb250ZXh0TWVudVwiIHwgXCJFbnRlclwiIHwgXCJOdW1Mb2NrXCIgfCBcIkhvbWVcIiB8IFwiUGFnZVVwXCIgfCBcIlBhZ2VEb3duXCIgfCBcIkluc2VydFwiIHwgXCJEZWxldGVcIiB8IFwiQXJyb3dVcFwiIHwgXCJBcnJvd0Rvd25cIiB8IFwiQXJyb3dSaWdodFwiIHwgXCJBcnJvd0xlZnRcIiB8XCIhXCIgfCBcIlxcXCJcInwgXCIjXCIgfCBcIiRcIiB8IFwiJVwiIHwgXCImXCIgfCBcIidcIiB8IFwiKFwiIHwgXCIpXCIgfCBcIipcIiB8IFwiK1wiIHwgXCIsXCIgfCBcIi1cIiB8IFwiLlwiIHwgXCIvXCIgfCBcIjBcIiB8IFwiMVwiIHwgXCIyXCIgfCBcIjNcIiB8IFwiNFwiIHwgXCI1XCIgfCBcIjZcIiB8IFwiN1wiIHwgXCI4XCIgfCBcIjlcIiB8IFwiOlwiIHwgXCI7XCIgfCBcIjxcIiB8IFwiPVwiIHwgXCI+XCIgfCBcIj9cIiB8IFwiQFwiIHwgXCJBXCIgfCBcIkJcIiB8IFwiQ1wiIHwgXCJEXCIgfCBcIkVcIiB8IFwiRlwiIHwgXCJHXCIgfCBcIkhcIiB8IFwiSVwiIHwgXCJKXCIgfCBcIktcIiB8IFwiTFwiIHwgXCJNXCIgfCBcIk5cIiB8IFwiT1wiIHwgXCJQXCIgfCBcIlFcIiB8IFwiUlwiIHwgXCJTXCIgfCBcIlRcIiB8IFwiVVwiIHwgXCJWXCIgfCBcIldcIiB8IFwiWFwiIHwgXCJZXCIgfCBcIlpcIiB8IFwiW1wiIHwgXCJcXFxcXCIgfCBcIl1cIiB8IFwiXlwiIHwgXCJfXCIgfCBcImBcIiB8IFwiYVwiIHwgXCJiXCIgfCBcImNcIiB8IFwiZFwiIHwgXCJlXCIgfCBcImZcIiB8IFwiZ1wiIHwgXCJoXCIgfCBcImlcIiB8IFwialwiIHwgXCJrXCIgfCBcImxcIiB8IFwibVwiIHwgXCJuXCIgfCBcIm9cIiB8IFwicFwiIHwgXCJxXCIgfCBcInJcIiB8IFwic1wiIHwgXCJ0XCIgfCBcInVcIiB8IFwidlwiIHwgXCJ3XCIgfCBcInhcIiB8IFwieVwiIHwgXCJ6XCIgfCBcIntcIiB8IFwifFwiIHwgXCJ9XCIgfCBcIn5cIiA7XHJcblxyXG5leHBvcnQgdHlwZSBNb3VzZUJ1dHRvbiA9IFwiTE1CXCIgfCBcIlNjcm9sbEJ1dHRvblwiIHwgXCJSTUJcIjsgXHJcblxyXG5leHBvcnQgZW51bSBLZXlTdGF0ZXtcclxuICAgIFBSRVNTRUQsXHJcbiAgICBIT0xELFxyXG4gICAgUkVMRUFTRSxcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEtleWJvYXJkSW5wdXR7XHJcbiAgICAvKipcclxuICAgICAqIEFkZCBldmVudCBsaXN0ZW5lcnMgZm9yIGtleSBwcmVzc2VzLlxyXG4gICAgICogQWxscmVhZHkgY2FsbGVkIGJ5IHRoZSBpbml0IGZ1bmN0aW9uIGZyb20gY29yZS50c1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzID0gbmV3IE1hcDxLZXksS2V5U3RhdGU+KCk7XHJcblxyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsKGUpPT57ICAgXHJcbiAgICAgICAgICAgIGlmKEtleWJvYXJkSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgS2V5Ym9hcmRJbnB1dC5rZXlTdGF0ZXMuc2V0KEtleWJvYXJkSW5wdXQuc3RyaW5nVG9LZXkoZS5rZXkpLEtleVN0YXRlLlBSRVNTRUQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwoZSk9PnsgICAgXHJcbiAgICAgICAgICAgIGlmKEtleWJvYXJkSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyBcclxuXHJcbiAgICAgICAgICAgIEtleWJvYXJkSW5wdXQua2V5U3RhdGVzLnNldChLZXlib2FyZElucHV0LnN0cmluZ1RvS2V5KGUua2V5KSxLZXlTdGF0ZS5SRUxFQVNFKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgZm9yIHByZXNzZWQga2V5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpc1ByZXNzZWQoa2V5OiBLZXkpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMua2V5U3RhdGVzLmdldChrZXkpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRCkge1xyXG4gICAgICAgICAgICB0aGlzLmtleVN0YXRlcy5zZXQoa2V5LEtleVN0YXRlLkhPTEQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICEoc3RhdGUgPT09IHVuZGVmaW5lZCB8fCBzdGF0ZSA9PSBLZXlTdGF0ZS5SRUxFQVNFKVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc0p1c3RQcmVzc2VkKGtleTogS2V5KXtcclxuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmtleVN0YXRlcy5nZXQoa2V5KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoc3RhdGUgPT0gS2V5U3RhdGUuUFJFU1NFRCkge1xyXG4gICAgICAgICAgICB0aGlzLmtleVN0YXRlcy5zZXQoa2V5LEtleVN0YXRlLkhPTEQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQ7XHJcbiAgICAgICAgLy9yZXR1cm4gXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBrZXlTdGF0ZXM6IE1hcDxLZXksS2V5U3RhdGU+O1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHN0cmluZ1RvS2V5KGtleSA6c3RyaW5nKXsgICAgICAgIFxyXG4gICAgICAgIGxldCB2YWwgPSBrZXkucmVwbGFjZShcIkRlYWRcIixcIn5cIik7XHJcbiAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoXCIgXCIsXCJTcGFjZVwiKTtcclxuICAgICAgICBsZXQga2V5dHlwZSA9IHZhbCAgYXMgS2V5O1xyXG4gICAgICAgIHJldHVybiBrZXl0eXBlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW91c2VJbnB1dHtcclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMgPSBuZXcgTWFwPE1vdXNlQnV0dG9uLEtleVN0YXRlPigpO1xyXG4gICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZSA9IHt4OjAseTowLHo6MH07XHJcblxyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlbW92ZSA9IGUgPT4geyAgIFxyXG4gICAgICAgICAgICBpZihNb3VzZUlucHV0LnByZXZlbnREZWZhdWx0KSAgICBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uID0gbmV3IFZlY3RvcjIoZS54LCBlLnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjYW52YXMub253aGVlbCA9IGUgPT4geyAgICBcclxuICAgICAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdCkgICAgXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UueCArPSBlLmRlbHRhWDtcclxuICAgICAgICAgICAgTW91c2VJbnB1dC5tb3VzZVdoZWVsQ2hhbmdlLnkgKz0gZS5kZWx0YVk7XHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZS56ICs9IGUuZGVsdGFaO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuc2V0KE1vdXNlSW5wdXQubnVtYmVyVG9CdXR0b24oZS5idXR0b24pLEtleVN0YXRlLlBSRVNTRUQpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYW52YXMub25tb3VzZXVwID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmKE1vdXNlSW5wdXQucHJldmVudERlZmF1bHQpICAgIFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuc2V0KE1vdXNlSW5wdXQubnVtYmVyVG9CdXR0b24oZS5idXR0b24pLEtleVN0YXRlLlJFTEVBU0UpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3ByZXZlbnQgY29udGV4dCBtZW51XHJcbiAgICAgICAgaWYoTW91c2VJbnB1dC5wcmV2ZW50RGVmYXVsdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhbnZhcy5vbmNvbnRleHRtZW51ID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFdoZWVsT2Zmc2V0KCl7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IE1vdXNlSW5wdXQubW91c2VXaGVlbENoYW5nZTtcclxuICAgICAgICBsZXQgb3V0ID0ge3g6b2Zmc2V0LngsIHk6b2Zmc2V0LnksIHo6b2Zmc2V0Lnp9O1xyXG5cclxuICAgICAgICBNb3VzZUlucHV0Lm1vdXNlV2hlZWxDaGFuZ2UgPSB7eDowLHk6MCx6OjB9O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHN0YXRpYyBpc1ByZXNzZWQoYnV0dG9uOiBNb3VzZUJ1dHRvbil7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuZ2V0KGJ1dHRvbik7XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEKSB7XHJcbiAgICAgICAgICAgIE1vdXNlSW5wdXQuYnV0dG9uU3RhdGVzLnNldChidXR0b24sS2V5U3RhdGUuSE9MRCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gIShzdGF0ZSA9PT0gdW5kZWZpbmVkIHx8IHN0YXRlID09IEtleVN0YXRlLlJFTEVBU0UpXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGlzSnVzdFByZXNzZWQoYnV0dG9uOiBNb3VzZUJ1dHRvbil7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuZ2V0KGJ1dHRvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHN0YXRlID09IEtleVN0YXRlLlBSRVNTRUQpIHtcclxuICAgICAgICAgICAgTW91c2VJbnB1dC5idXR0b25TdGF0ZXMuc2V0KGJ1dHRvbixLZXlTdGF0ZS5IT0xEKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZSA9PSBLZXlTdGF0ZS5QUkVTU0VEO1xyXG4gICAgICAgIC8vcmV0dXJuIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIG51bWJlclRvQnV0dG9uKG51bWJlciA6IG51bWJlciApIDogTW91c2VCdXR0b257XHJcbiAgICAgICAgc3dpdGNoIChudW1iZXIpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTE1CXCI7XHJcbiAgICAgICAgICAgIGNhc2UgMTogICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJTY3JvbGxCdXR0b25cIjtcclxuICAgICAgICAgICAgY2FzZSAyOiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlJNQlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFwiTE1CXCI7IC8vdGhhdHMgbm90IGdvbm5hIGhhcHBlblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwcmV2ZW50RGVmYXVsdCA9IHRydWU7XHJcbiAgICBzdGF0aWMgY3VycmVudFBvc2l0aW9uOiBWZWN0b3IyO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGJ1dHRvblN0YXRlczogTWFwPE1vdXNlQnV0dG9uLEtleVN0YXRlPjtcclxuICAgIHByaXZhdGUgc3RhdGljIG1vdXNlV2hlZWxDaGFuZ2UgOiB7eDpudW1iZXIsIHk6bnVtYmVyLCB6Om51bWJlcn07XHJcbn0iLCJpbXBvcnQge1ZlY3RvcjIsVHJhbnNmb3JtfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7Y3R4fSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5cclxuLyoqXHJcbiAqIEJhc2UgZm9yIGNoaWxkcmVuIHBvbHltb3JwaGlzbVxyXG4gKiBJbXBsZW1lbnQgdGhpcyBpbnRlcmZhY2Ugd2hlbiBjcmVhdGluZyBhIGNvbXBvbmVudCAvIGNoaWxkLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBPYmplY3QyRCB7XHJcbiAgICAvL0hhcHBlbnMgZXZlcnkgdGlja1xyXG4gICAgb25VcGRhdGUoKSA6dm9pZDsgXHJcbiAgICAvL0NhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgb25SZW5kZXIoKSA6dm9pZDsgXHJcbiAgICBhZnRlclJlbmRlcigpIDp2b2lkOyBcclxuXHJcbiAgICBvcmlnaW46IFRyYW5zZm9ybTsgICAgXHJcbiAgICBjaGlsZHJlbjogQXJyYXk8T2JqZWN0MkQ+O1xyXG59XHJcblxyXG4vKipcclxuICogQmFzZSBmb3IgY2hpbGRyZW4gdGhhdCB3YW50IHRvIHJlbmRlciBzb21ldGhpbmcuXHJcbiAqIEV4dGVuZCB0aGlzIGNsYXNzIGZvciBjdHggYWNjZXNzIGFuZCBvcmlnaW4gdHJhbnNmb3JtIGhhbmRlbGluZy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBEcmF3YWJsZSBpbXBsZW1lbnRzIE9iamVjdDJEIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSBuZXcgVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMudXNlX2xvY2FsX2Nvb3JkaW5hdGVzID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5faW5fY2VudGVyID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICovXHJcbiAgICBvblVwZGF0ZSgpe1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNoaWxkLm9uVXBkYXRlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICogQ2FsbGVkIGJlZm9yZSB0aGUgb2JqZWN0IGlzIHJlbmRlcmVkXHJcbiAgICAgKi9cclxuICAgIG9uUmVuZGVyKCl7ICAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luX2luX2NlbnRlcikge1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKC0odGhpcy5vcmlnaW4uc2NhbGUueC8yKSwtKHRoaXMub3JpZ2luLnNjYWxlLnkvMikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHgudHJhbnNsYXRlKHRoaXMub3JpZ2luLnBvc2l0aW9uLngsdGhpcy5vcmlnaW4ucG9zaXRpb24ueSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLm9yaWdpbi5zY2FsZS54LzIsdGhpcy5vcmlnaW4uc2NhbGUueS8yKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICAgICBjdHgucm90YXRlKHRoaXMub3JpZ2luLnJvdGF0aW9uICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbl9pbl9jZW50ZXIpIHtcclxuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSgtKHRoaXMub3JpZ2luLnNjYWxlLngvMiksLSh0aGlzLm9yaWdpbi5zY2FsZS55LzIpKTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIGN0eC5zY2FsZSh0aGlzLm9yaWdpbi5zY2FsZS54LHRoaXMub3JpZ2luLnNjYWxlLnkpOyAgICAgIFxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERvIG5vdCBjYWxsIGV4dGVybmFseVxyXG4gICAgICogQ2FsbGVkIGFmdGVyIHRoZSBvYmplY3QgaXMgcmVuZGVyZWRcclxuICAgICAqL1xyXG4gICAgYWZ0ZXJSZW5kZXIoKXsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRHJhd2FibGUgJiYgIWNoaWxkLnVzZV9sb2NhbF9jb29yZGluYXRlcylcclxuICAgICAgICAgICAgICAgICAgICBjdHguc2NhbGUoMS90aGlzLm9yaWdpbi5zY2FsZS54LDEvdGhpcy5vcmlnaW4uc2NhbGUueSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNoaWxkLm9uUmVuZGVyKCk7XHJcblxyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvcmlnaW46IFRyYW5zZm9ybTsgICAgXHJcbiAgICBjaGlsZHJlbjogQXJyYXk8T2JqZWN0MkQ+O1xyXG4gICAgdXNlX2xvY2FsX2Nvb3JkaW5hdGVzOiBib29sZWFuO1xyXG4gICAgb3JpZ2luX2luX2NlbnRlcjogYm9vbGVhbjtcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBDb25maWcgZnJvbSBcIi4vLi4vZW5naW5lQ29uZmlnXCI7XHJcbmltcG9ydCB7YWN0aXZlU2NlbmV9IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCB2YXIgY3R4IDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbmV4cG9ydCB2YXIgY2FudmFzIDpIVE1MQ2FudmFzRWxlbWVudDtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIHRoZSBjYW52YXMgY29udGV4dC5cclxuICogQWxscmVhZHkgY2FsbGVkIGJ5IHRoZSBpbml0IGZ1bmN0aW9uIGZyb20gY29yZS50c1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKXtcclxuICAgIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoQ29uZmlnLmNhbnZhc1NlbGVjdG9yKSEgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlcyB2aWV3cG9ydCBzaXplLFxyXG4gKiBjYWxscyBhbGwgdGhlIG9uUmVuZGVyIG1ldGhvZHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoKXsgIFxyXG4gICAgaWYoQ29uZmlnLnJlc2l6ZVZpZXdwb3J0KXtcclxuICAgICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICBcclxuICAgIGFjdGl2ZVNjZW5lPy5yZW5kZXIoKTtcclxufSIsImltcG9ydCB7RHJhd2FibGUsIE9iamVjdDJEfSBmcm9tIFwiLi9vYmplY3QyRFwiXHJcbmltcG9ydCB7Y3R4LGNhbnZhc30gZnJvbSBcIi4vcmVuZGVyZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBSb290IGZvciBhbGwgdGhlIGVsZW1lbnRzIGluc2lkZSB5b3VyIGxldmVsLlxyXG4gKiBPYmplY3RzIG5vdCBhIG1lbWJlciBvZiB0aGUgYWN0aXZlIHNjZW5lIHdvbnQgYmUgY2FsbGVkIHZpYSBvblVwZGF0ZSBhbmQgb25SZW5kZXIuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2NlbmV7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpe1xyXG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKGNoaWxkPT57XHJcbiAgICAgICAgICAgIGNoaWxkLm9uVXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uVXBkYXRlKVxyXG4gICAgICAgICAgICB0aGlzLm9uVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tZW1iZXJzLmZvckVhY2goY2hpbGQ9PntcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY2hpbGQub25SZW5kZXIoKTtcclxuICAgICAgICAgICAgY2hpbGQuYWZ0ZXJSZW5kZXIoKTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gICBcclxuXHJcbiAgICBvblVwZGF0ZTogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XHJcbiAgICBtZW1iZXJzOiBBcnJheTxPYmplY3QyRD47XHJcbn0iLCJpbXBvcnQge0RyYXdhYmxlfSBmcm9tIFwiLi9vYmplY3QyRFwiO1xyXG5pbXBvcnQge1ZlY3RvcjIsVHJhbnNmb3JtfSBmcm9tIFwiLi9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7IGN0eCB9IGZyb20gXCIuL3JlbmRlcmVyXCI7XHJcblxyXG4vKipcclxuICogRGVmaW5lcyBhIHNoZXBlJ3Mgb3V0bGluZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE91dGxpbmUge1xyXG4gICAgY29uc3RydWN0b3Iod2lkdGg6IG51bWJlcixjb2xvcjogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy50aGlja25lc3MgPSB3aWR0aDtcclxuICAgIH1cclxuICAgIHRoaWNrbmVzczogbnVtYmVyO1xyXG4gICAgY29sb3I6IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIFNvbGlkIGNvbG9yIGRyYXdhYmxlIGVsZW1lbnRcclxuICogVXNlIGZvciBjdXN0b20gcG9seWdvbiBzaGFwZXMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2hhcGUgZXh0ZW5kcyBEcmF3YWJsZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih2ZXJ0aWNpZXM6IFZlY3RvcjJbXSwgY29sb3I/OiBzdHJpbmcsb3V0bGluZT86IE91dGxpbmUpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGljaWVzID0gdmVydGljaWVzO1xyXG5cclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPyBjb2xvciA6IFwid2hpdGVcIjtcclxuICAgICAgICB0aGlzLm91dGxpbmUgPSBvdXRsaW5lID8gb3V0bGluZSA6IG5ldyBPdXRsaW5lKDAsJyMwMDAwJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEbyBub3QgY2FsbCBleHRlcm5hbHlcclxuICAgICAqIENhbGxlZCBiZWZvcmUgdGhlIG9iamVjdCBpcyByZW5kZXJlZFxyXG4gICAgICovXHJcbiAgICBvblJlbmRlcigpe1xyXG4gICAgICAgIHN1cGVyLm9uUmVuZGVyKCk7XHJcbiAgICAgICBcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyh0aGlzLnZlcnRpY2llc1swXS54LHRoaXMudmVydGljaWVzWzBdLnkpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy52ZXJ0aWNpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gdGhpcy52ZXJ0aWNpZXNbaV07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdHgubGluZVRvKHZlcnRleC54LHZlcnRleC55KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5yZXNldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMub3V0bGluZS50aGlja25lc3M7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5vdXRsaW5lLmNvbG9yO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTsgICAgICAgIFxyXG5cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICB2ZXJ0aWNpZXM6IFZlY3RvcjJbXTtcclxuICAgIG91dGxpbmU6IE91dGxpbmU7XHJcbiAgICBjb2xvcjogc3RyaW5nO1xyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyBEcmF3YWJsZSB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvb2JqZWN0MkRcIjtcclxuaW1wb3J0IHsgT3V0bGluZSwgU2hhcGUgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3NoYXBlXCI7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tIFwiLi9jdXJzb3JUb29sXCI7XHJcbmltcG9ydCB7IFV0aWxpdHkgfSBmcm9tIFwiLi91dGlsXCI7XHJcbmltcG9ydCB7d29ybGQsIFdvcmxkTWFuYWdlcn0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBGbHVpZCwgUG93ZGVyLCBTb2xpZCB9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcbmltcG9ydCB7IEtleWJvYXJkSW5wdXQsIE1vdXNlQnV0dG9uLCBNb3VzZUlucHV0IH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9pbnB1dFwiO1xyXG5pbXBvcnQgeyBjdHggfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL3JlbmRlcmVyXCI7XHJcbmltcG9ydCB7IGN1cnNvcix0b29sYmFyIH0gZnJvbSBcIi4vZ2FtZVwiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVG9vbEJhciBleHRlbmRzIFNoYXBle1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBsZXQgc2hhcGUgPSBbXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDEsMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDEsMSksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMSlcclxuICAgICAgICBdXHJcblxyXG4gICAgICAgIHN1cGVyKHNoYXBlLFwiIzAwMDBcIixuZXcgT3V0bGluZSgxLFwid2hpdGVcIikpO1xyXG5cclxuICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbiA9IG5ldyBWZWN0b3IyKDAsNjAwKTtcclxuICAgICAgICB0aGlzLm9yaWdpbi5zY2FsZSA9IG5ldyBWZWN0b3IyKDgwMCwzMCk7XHJcblxyXG5cclxuICAgICAgICBUb29sLlRvb2xzLmZvckVhY2goKHYsayk9PntcclxuICAgICAgICAgICAgdGhpcy5hZGRCdXR0b24oayk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZEJ1dHRvbih0b29sTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIGxldCBidXR0b24gPSBuZXcgVG9vbEJ1dHRvbih0b29sTmFtZSlcclxuXHJcbiAgICAgICAgYnV0dG9uLm9yaWdpbi5wb3NpdGlvbi55ID0gMTU7XHJcbiAgICAgICAgYnV0dG9uLm9yaWdpbi5wb3NpdGlvbi54ID0gODAwIC0gKHRoaXMuY2hpbGRyZW4ubGVuZ3RoICogNjApIC0gMzA7XHJcblxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChidXR0b24pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZU91dGxpbmUoKXtcclxuICAgICAgICAvL1RPRE86IGNoYW5nZSBidXR0b24gb3V0bGluZSBiYXNlZCBvbiBzZWxlY3Rpb25cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIFRvb2xCdXR0b24gZXh0ZW5kcyBTaGFwZXtcclxuICAgIGNvbnN0cnVjdG9yKHRvb2xOYW1lOiBzdHJpbmcpe1xyXG5cclxuICAgICAgICBsZXQgc2hhcGUgPSBbXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDEsMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDEsMSksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAsMSlcclxuICAgICAgICBdXHJcblxyXG4gICAgICAgIGxldCB0b29sID0gVG9vbC5Ub29scy5nZXQodG9vbE5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIXRvb2wpIHtcclxuICAgICAgICAgICAgdGhyb3cgYFRvb2wgJHt0b29sTmFtZX0gbm90IGZvdW5kYDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBzdXBlcihzaGFwZSx0b29sLmNvbG9yLG5ldyBPdXRsaW5lKDEsXCJ3aGl0ZVwiKSk7XHJcblxyXG4gICAgICAgIHRoaXMub3JpZ2luLnNjYWxlID0gbmV3IFZlY3RvcjIoNTAsMjApO1xyXG4gICAgICAgIHRoaXMudG9vbCA9IHRvb2w7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gdG9vbE5hbWU7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5faW5fY2VudGVyID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmN0eFBvcyA9IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25VcGRhdGUoKXtcclxuICAgICAgICBsZXQgbW91c2UgPSBNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbjtcclxuXHJcbiAgICAgICAgbGV0IHByZXNzZWQgOk1vdXNlQnV0dG9uO1xyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYoTW91c2VJbnB1dC5pc1ByZXNzZWQoXCJMTUJcIikgKXtcclxuICAgICAgICAgICAgcHJlc3NlZCA9IFwiTE1CXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoTW91c2VJbnB1dC5pc1ByZXNzZWQoXCJSTUJcIikgKXtcclxuICAgICAgICAgICAgcHJlc3NlZCA9IFwiUk1CXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoTW91c2VJbnB1dC5pc1ByZXNzZWQoXCJTY3JvbGxCdXR0b25cIikgKXtcclxuICAgICAgICAgICAgcHJlc3NlZCA9IFwiU2Nyb2xsQnV0dG9uXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIFxyXG5cclxuXHJcblxyXG4gICAgICAgIGlmKG1vdXNlLnggPiB0aGlzLmN0eFBvcy54IFxyXG4gICAgICAgICAgICAmJlxyXG4gICAgICAgICAgIG1vdXNlLnkgPiB0aGlzLmN0eFBvcy55ICBcclxuICAgICAgICAgICAmJlxyXG4gICAgICAgICAgIG1vdXNlLnggPCB0aGlzLmN0eFBvcy54ICsgNTAgXHJcbiAgICAgICAgICAgICYmXHJcbiAgICAgICAgICAgbW91c2UueSA8IHRoaXMuY3R4UG9zLnkgKyAyMCApXHJcbiAgICAgICAgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdXJzb3IudG9vbHMuc2V0KHByZXNzZWQsdGhpcy50b29sKTsgICBcclxuICAgICAgICAgICAgdG9vbGJhci51cGRhdGVPdXRsaW5lKCk7IFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgb25SZW5kZXIoKXtcclxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jdHhQb3MgPSBuZXcgVmVjdG9yMihcclxuICAgICAgICAgICAgY3R4LmdldFRyYW5zZm9ybSgpLmUsXHJcbiAgICAgICAgICAgIGN0eC5nZXRUcmFuc2Zvcm0oKS5mXHJcbiAgICAgICAgKVxyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHgucmVzZXRUcmFuc2Zvcm0oKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gXCJib2xkIDE2cHggQXJpYWxcIjtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gMC45O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHdpZHRoID0gNTAgLWN0eC5tZWFzdXJlVGV4dCh0aGlzLm5hbWUpLndpZHRoO1xyXG5cclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCAgIHRoaXMubmFtZSx0aGlzLmN0eFBvcy54ICsgd2lkdGgvMiwgIHRoaXMuY3R4UG9zLnkrMTYpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlVGV4dCggdGhpcy5uYW1lLHRoaXMuY3R4UG9zLnggKyB3aWR0aC8yLCAgdGhpcy5jdHhQb3MueSsxNik7XHJcblxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlT3V0bGluZShjb2xvcjpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5jb2xvciA9IGNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eFBvczpWZWN0b3IyO1xyXG4gICAgdG9vbCA6IFRvb2w7XHJcbiAgICBuYW1lIDpzdHJpbmc7XHJcbn0iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7U2hhcGUsT3V0bGluZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9zaGFwZVwiO1xyXG5pbXBvcnQge01vdXNlQnV0dG9uLCBNb3VzZUlucHV0fSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2lucHV0XCI7XHJcbmltcG9ydCB7IGN0eCB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvcmVuZGVyZXJcIjtcclxuaW1wb3J0IHsgd29ybGQgfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEZsdWlkLCBQb3dkZXIsIFNvbGlkIH0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuaW1wb3J0IHsgVXRpbGl0eSB9IGZyb20gXCIuL3V0aWxcIjtcclxuaW1wb3J0IHsgVG9vbCB9IGZyb20gXCIuL2N1cnNvclRvb2xcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDdXJzb3IgZXh0ZW5kcyBTaGFwZXtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgbGV0IGRlZmF1bHRTaGFwZSA9IFtcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMiwwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMiwyKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMCwyKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoMCwwKVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHN1cGVyKGRlZmF1bHRTaGFwZSxcIiMwMDAwXCIsbmV3IE91dGxpbmUoMSwnI0ZGRjknKSk7XHJcblxyXG4gICAgICAgIHRoaXMub3JpZ2luX2luX2NlbnRlciA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSAxO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2xzID0gbmV3IE1hcDxNb3VzZUJ1dHRvbixUb29sIHwgdW5kZWZpbmVkPihbXHJcbiAgICAgICAgICAgIFtcIkxNQlwiLCAgICAgICAgIFRvb2wuVG9vbHMuZ2V0KFwiU0FORFwiKV0sXHJcbiAgICAgICAgICAgIFtcIlJNQlwiLCAgICAgICAgIFRvb2wuVG9vbHMuZ2V0KFwiRVJBU1wiKV0sXHJcbiAgICAgICAgICAgIFtcIlNjcm9sbEJ1dHRvblwiLFRvb2wuVG9vbHMuZ2V0KFwiUElDS1wiKV1cclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgdGhpcy53YXNQcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5sYXN0UG9zID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VSYWRpdXMocmFkaXVzIDogbnVtYmVyKXtcclxuICAgICAgICByYWRpdXMgPSBNYXRoLnJvdW5kKHJhZGl1cyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy52ZXJ0aWNpZXMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKHJhZGl1cyoyLDApLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMihyYWRpdXMqMixyYWRpdXMqMiksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKDAscmFkaXVzKjIpLFxyXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigwLDApXHJcbiAgICAgICAgXSAgICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIG9uVXBkYXRlKCl7XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgLT0gTW91c2VJbnB1dC5nZXRXaGVlbE9mZnNldCgpLnkgLyAxMDA7XHJcbiAgICAgICAgaWYgKHRoaXMucmFkaXVzIDwgMSkge1xyXG4gICAgICAgICAgICB0aGlzLnJhZGl1cyA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZVJhZGl1cyh0aGlzLnJhZGl1cyk7XHJcblxyXG4gICAgICAgIGxldCBwbGFjZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy50b29scy5mb3JFYWNoKCh0b29sLGJ1dHRvbik9PntcclxuICAgICAgICAgICAgaWYgKE1vdXNlSW5wdXQuaXNQcmVzc2VkKGJ1dHRvbikpIHtcclxuICAgICAgICAgICAgICAgIGlmKCF0b29sKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXcodG9vbCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcodG9vbCA6VG9vbCl7XHJcbiAgICAgICAgbGV0IG15UG9zID0gbmV3IFZlY3RvcjIodGhpcy5vcmlnaW4ucG9zaXRpb24ueCx0aGlzLm9yaWdpbi5wb3NpdGlvbi55KTtcclxuXHJcblxyXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IG5ldyBWZWN0b3IyKFxyXG4gICAgICAgICAgICBteVBvcy54IC0gdGhpcy5sYXN0UG9zLngsXHJcbiAgICAgICAgICAgIG15UG9zLnkgLSB0aGlzLmxhc3RQb3MueVxyXG4gICAgICAgIClcclxuICAgICAgICBsZXQgc3RlcCA9IDEgLyBkaXN0YW5jZS5sZW5naHQoKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coc3RlcCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCAxOyBpbmRleCs9c3RlcCkge1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gVXRpbGl0eS52ZWN0b3JJbnRlcnBvbGF0ZSh0aGlzLmxhc3RQb3MsbXlQb3MsaW5kZXgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRvb2wuZHJhdyh0YXJnZXQsdGhpcy5yYWRpdXMpO1xyXG4gICAgICAgIH0gICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIG9uUmVuZGVyKCl7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgaWYoTW91c2VJbnB1dC5jdXJyZW50UG9zaXRpb24pXHJcbiAgICAgICAgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmxhc3RQb3MgPSBuZXcgVmVjdG9yMiggdGhpcy5vcmlnaW4ucG9zaXRpb24ueCx0aGlzLm9yaWdpbi5wb3NpdGlvbi55KTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4ucG9zaXRpb24ueCA9IE1hdGgucm91bmQoIE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uLnggLzIpICoyO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbi55ID0gTWF0aC5yb3VuZChNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbi55IC8yKSAqIDI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbi54IC09IHRoaXMucmFkaXVzO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbi5wb3NpdGlvbi55IC09IHRoaXMucmFkaXVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmN0eCA9PSBjdHgpO1xyXG5cclxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJhZGl1czpudW1iZXI7XHJcbiAgICB0b29sczpNYXA8TW91c2VCdXR0b24sVG9vbCB8IHVuZGVmaW5lZD47XHJcblxyXG4gICAgd2FzUHJlc3NlZDpib29sZWFuO1xyXG4gICAgbGFzdFBvczpWZWN0b3IyO1xyXG59IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyBNb3VzZUlucHV0IH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9pbnB1dFwiO1xyXG5pbXBvcnQgeyBDdXJzb3IgfSBmcm9tIFwiLi9jdXJzb3JcIjtcclxuaW1wb3J0IHsgY3Vyc29yLCB0b29sYmFyIH0gZnJvbSBcIi4vZ2FtZVwiO1xyXG5pbXBvcnQgeyBGbHVpZCwgUG93ZGVyLCBTb2xpZCB9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcbmltcG9ydCB7IFV0aWxpdHkgfSBmcm9tIFwiLi91dGlsXCI7XHJcbmltcG9ydCB7IHdvcmxkIH0gZnJvbSBcIi4vd29ybGRfbWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRvb2x7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZVBhcnQgOiAocG9zOiBWZWN0b3IyKSA9PiB2b2lkLCBjb2xvcjpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBwbGFjZVBhcnQ7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcocG9zaXRpb246VmVjdG9yMixyYWRpdXM6bnVtYmVyKXtcclxuICAgICAgICBsZXQgcG9zID0gcG9zaXRpb247XHJcblxyXG4gICAgICAgIHBvcy54ID0gTWF0aC5mbG9vcihwb3MueCAvIDIpO1xyXG4gICAgICAgIHBvcy55ID0gTWF0aC5mbG9vcihwb3MueSAvIDIpO1xyXG5cclxuICAgICAgICAvL21vdXNlIGluIHdvcmxkXHJcbiAgICAgICAgaWYoIVV0aWxpdHkuaW5Cb3VuZHMoXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKE1vdXNlSW5wdXQuY3VycmVudFBvc2l0aW9uLngvMixNb3VzZUlucHV0LmN1cnJlbnRQb3NpdGlvbi55LzIpKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IHkgPSBwb3MueTsgeSA8IChwb3MueSArIChyYWRpdXMpKTsgeSsrKSB7ICBcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHBvcy54OyB4IDwgKHBvcy54ICsgKHJhZGl1cykpOyB4KyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZighVXRpbGl0eS5pbkJvdW5kcyhuZXcgVmVjdG9yMih4LHkpKSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sobmV3IFZlY3RvcjIoeCx5KSk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjYWxsYmFjayA6IChwb3M6IFZlY3RvcjIpID0+IHZvaWQ7XHJcbiAgICBjb2xvcjpzdHJpbmc7ICAgIFxyXG5cclxuICAgIHN0YXRpYyBUb29scyA6IE1hcDxzdHJpbmcsVG9vbD4gPSBuZXcgTWFwPHN0cmluZyxUb29sPihbXHJcbiAgICAgICAgW1wiU0FORFwiLFxyXG5cclxuICAgICAgICAgICAgbmV3IFRvb2wocG9zPT57XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF3b3JsZC5wYXJ0aWNsZXNbcG9zLnldW3Bvcy54XSlcclxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbcG9zLnldW3Bvcy54XSA9IG5ldyBQb3dkZXIocG9zKTtcclxuXHJcbiAgICAgICAgICAgIH0sXCJ5ZWxsb3dcIikgICAgICAgICAgICBcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcIldBVFJcIixcclxuXHJcbiAgICAgICAgICAgIG5ldyBUb29sKHBvcz0+e1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghd29ybGQucGFydGljbGVzW3Bvcy55XVtwb3MueF0pXHJcbiAgICAgICAgICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3Bvcy55XVtwb3MueF0gPSBuZXcgRmx1aWQocG9zKTtcclxuXHJcbiAgICAgICAgICAgIH0sXCJhcXVhXCIpICAgICAgICAgICAgXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXCJXQUxMXCIsXHJcblxyXG4gICAgICAgICAgICBuZXcgVG9vbChwb3M9PntcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXdvcmxkLnBhcnRpY2xlc1twb3MueV1bcG9zLnhdKVxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBhcnRpY2xlc1twb3MueV1bcG9zLnhdID0gbmV3IFNvbGlkKHBvcyk7XHJcblxyXG4gICAgICAgICAgICB9LFwiZ3JheVwiKSAgICAgICAgICAgIFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgW1wiRVJBU1wiLFxyXG5cclxuICAgICAgICAgICAgbmV3IFRvb2wocG9zPT57XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHdvcmxkLnBhcnRpY2xlc1twb3MueV1bcG9zLnhdKVxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB3b3JsZC5wYXJ0aWNsZXNbcG9zLnldW3Bvcy54XTtcclxuXHJcbiAgICAgICAgICAgIH0sXCJyZWRcIikgICAgICAgICAgICBcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcIlBJQ0tcIixcclxuICAgICAgICAgICAgbmV3IFRvb2wocG9zPT57XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHBhcnQgPSB3b3JsZC5wYXJ0aWNsZXNbcG9zLnldW3Bvcy54XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihwYXJ0KXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGlja2VkID0gVG9vbC5Ub29scy5nZXQocGFydC5wYXJ0TmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHBpY2tlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvci50b29scy5zZXQoXCJMTUJcIixwaWNrZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sYmFyLnVwZGF0ZU91dGxpbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgfSxcImxpbWVcIikgICAgICAgICAgICBcclxuICAgICAgICBdLFxyXG4gICAgXSk7XHJcbn0iLCJpbXBvcnQgKiBhcyBDRSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2NvcmVcIjtcclxuXHJcbmltcG9ydCB7U2NlbmV9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvc2NlbmVcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5cclxuaW1wb3J0IHt3b3JsZCwgV29ybGRNYW5hZ2VyfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5pbXBvcnQge0tleWJvYXJkSW5wdXQsIE1vdXNlSW5wdXR9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvaW5wdXRcIjtcclxuXHJcbmltcG9ydCB7IEZsdWlkLCBQb3dkZXIsIFNvbGlkIH0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuaW1wb3J0IHsgQ3Vyc29yIH0gZnJvbSBcIi4vY3Vyc29yXCI7XHJcbmltcG9ydCB7IFBoeXNpY3MgfSBmcm9tIFwiLi9waHlzaWNzXCI7XHJcbmltcG9ydCB7IFRvb2xCYXIgfSBmcm9tIFwiLi9Ub29sQmFyXCI7XHJcbmltcG9ydCB7IFRvb2wgfSBmcm9tIFwiLi9jdXJzb3JUb29sXCI7XHJcbmltcG9ydCB7IFV0aWxpdHkgfSBmcm9tIFwiLi91dGlsXCI7XHJcblxyXG4vL2NyZWF0ZSBzY2VuZVxyXG5sZXQgbGV2ZWwgPSBuZXcgU2NlbmUoKTtcclxubGV0IHdvcmxkX21hbmFnZXIgPSBuZXcgV29ybGRNYW5hZ2VyKCk7XHJcbmV4cG9ydCBsZXQgY3Vyc29yID0gbmV3IEN1cnNvcigpO1xyXG5leHBvcnQgbGV0IHRvb2xiYXIgPSBuZXcgVG9vbEJhcigpO1xyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpPT57XHJcbiAgICAvL2luaXQgZW5naW5lXHJcbiAgICBDRS5pbml0KCk7XHJcbiAgICAvL2JpbmQgc2NlbmVcclxuICAgIENFLnNldEFjdGl2ZVNjZW5lKGxldmVsKTtcclxuICAgIFxyXG4gICAgbGV2ZWwubWVtYmVycy5wdXNoKHdvcmxkX21hbmFnZXIpO1xyXG4gICAgd29ybGRfbWFuYWdlci5vcmlnaW4uc2NhbGUgPSBuZXcgVmVjdG9yMigyLDIpO1xyXG4gICAgICAgIFxyXG4gICAgbGV2ZWwubWVtYmVycy5wdXNoKGN1cnNvcik7XHJcbiAgICBsZXZlbC5tZW1iZXJzLnB1c2godG9vbGJhcik7XHJcbiAgICB0b29sYmFyLnVwZGF0ZU91dGxpbmUoKTtcclxuXHJcblxyXG4gIFxyXG5cclxuXHJcbiAgICAvL3dvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgUG93ZGVyKG5ldyBWZWN0b3IyKDgwLDApKSk7ICBcclxuXHJcbiAgICAvL0RlbW8gd29ybGRcclxuICAgIGZvciAobGV0IHggPSA2MDsgeCA8IDE0MDsgeCsrKSB7ICAgICBcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDE1OyB5KyspIHsgICAgIFxyXG4gICAgICAgICAgICAvL21peCBzb21lIGZsdWlkIGFuZCBwb3dkZXJcclxuICAgICAgICAgICAgaWYoeCp5ICUgMyA9PSAwKXsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFBvd2RlcihuZXcgVmVjdG9yMih4LHkpKSk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IEZsdWlkKG5ldyBWZWN0b3IyKHgseSsyMCkpKTsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTAwOyB4KyspIHsgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4KzAseCs2MCkpKTsgICAgXHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5hZGRQYXJ0KG5ldyBTb2xpZChuZXcgVmVjdG9yMih4KzAseCs2MSkpKTsgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwMDsgeCsrKSB7IFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMjAwLHgrNjApKSk7ICAgIFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMjAwLHgrNjEpKSk7ICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCA1MDsgeCsrKSB7IFxyXG4gICAgICAgIHdvcmxkX21hbmFnZXIuYWRkUGFydChuZXcgU29saWQobmV3IFZlY3RvcjIoLXgrMTAwLHgrMTkwKSkpOyAgICBcclxuICAgICAgICB3b3JsZF9tYW5hZ2VyLmFkZFBhcnQobmV3IFNvbGlkKG5ldyBWZWN0b3IyKC14KzEwMCx4KzE5MSkpKTsgICAgICBcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL3J1bnMgZXZlcnkgdGljayBcclxubGV2ZWwub25VcGRhdGUgPSAoKT0+e1xyXG4gICAgXHJcblxyXG4gICAgaWYgKEtleWJvYXJkSW5wdXQuaXNKdXN0UHJlc3NlZChcIlNwYWNlXCIpKSB7XHJcbiAgICAgICAgd29ybGRfbWFuYWdlci5wYXVzZWQgPSAhd29ybGRfbWFuYWdlci5wYXVzZWQ7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoS2V5Ym9hcmRJbnB1dC5pc0p1c3RQcmVzc2VkKFwiZlwiKSkge1xyXG4gICAgICAgIHdvcmxkX21hbmFnZXIucGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICBQaHlzaWNzLnN0ZXAod29ybGQpO1xyXG4gICAgfSAgXHJcblxyXG59OyAiLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9iYXNlX3R5cGVzXCI7XHJcbmltcG9ydCB7IFV0aWxpdHkgfSBmcm9tIFwiLi91dGlsXCI7XHJcbmltcG9ydCB7IHdvcmxkLFdvcmxkU2l6ZSB9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUGFydGljbGV7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IHtyOjI1NSxnOjI1NSxiOjI1NX07XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGVwKCl7XHJcbiAgICB9O1xyXG4gICBcclxuICAgIHBvc2l0aW9uOiBWZWN0b3IyOyBcclxuICAgIGNvbG9yOiB7cjpudW1iZXIsZzpudW1iZXIsYjpudW1iZXJ9O1xyXG4gICAgcGFydE5hbWUgPSBcIk5PTkVcIjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUGFydGljbGV7ICAgIFxyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgc3VwZXIocG9zaXRpb24pXHJcblxyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gMTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlNb3ZlKHJlbGF0aXZlUG9zOiBWZWN0b3IyKSA6Ym9vbGVhbntcclxuICAgICAgICBpZiAoIVV0aWxpdHkuaW5Cb3VuZHMobmV3IFZlY3RvcjIodGhpcy5wb3NpdGlvbi54K3JlbGF0aXZlUG9zLngsdGhpcy5wb3NpdGlvbi55K3JlbGF0aXZlUG9zLnkpKSkgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXQgIT0gdW5kZWZpbmVkKSB7IFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cnlTd2FwKHJlbGF0aXZlUG9zKTs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCArPSByZWxhdGl2ZVBvcy54OyBcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHJlbGF0aXZlUG9zLnk7IFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5U3dhcChyZWxhdGl2ZVBvczogVmVjdG9yMikgOmJvb2xlYW57ICAgICAgICBcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gd29ybGQucGFydGljbGVzW3RoaXMucG9zaXRpb24ueStyZWxhdGl2ZVBvcy55XVt0aGlzLnBvc2l0aW9uLngrcmVsYXRpdmVQb3MueF07XHJcblxyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIE1vdmVhYmxlICYmIHRhcmdldC53ZWlnaHQgPCB0aGlzLndlaWdodClcclxuICAgICAgICB7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL1N3YXAhICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdvcmxkLnBhcnRpY2xlc1t0aGlzLnBvc2l0aW9uLnldW3RoaXMucG9zaXRpb24ueF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHdvcmxkLnBhcnRpY2xlc1t0YXJnZXQucG9zaXRpb24ueV1bdGFyZ2V0LnBvc2l0aW9uLnhdID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1BvcyA9IG5ldyBWZWN0b3IyKHRhcmdldC5wb3NpdGlvbi54LHRhcmdldC5wb3NpdGlvbi55KTtcclxuXHJcbiAgICAgICAgICAgIHRhcmdldC5wb3NpdGlvbi54ID0gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgICAgICAgICB0YXJnZXQucG9zaXRpb24ueSA9IHRoaXMucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3M7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3b3JsZC5wYXJ0aWNsZXNbdGhpcy5wb3NpdGlvbi55XVt0aGlzLnBvc2l0aW9uLnhdID0gdGhpcztcclxuICAgICAgICAgICAgd29ybGQucGFydGljbGVzW3RhcmdldC5wb3NpdGlvbi55XVt0YXJnZXQucG9zaXRpb24ueF0gPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHZlbG9jaXR5OiBWZWN0b3IyOyAgICBcclxuICAgIHdlaWdodDogbnVtYmVyO1xyXG5cclxufVxyXG5cclxuLy80IEJhc2UgcGFydGljbGUgdHlwZXMgU29saWQgUG93ZGVyIEZsdWlkIEdhc1xyXG5cclxuZXhwb3J0IGNsYXNzIFNvbGlkIGV4dGVuZHMgUGFydGljbGV7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICBzdXBlcihwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IHtyOjEyMCxnOjEyMCxiOjEyMH07XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCgpe1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnROYW1lID0gXCJXQUxMXCI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3dkZXIgZXh0ZW5kcyBNb3ZlYWJsZXtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOlZlY3RvcjIpe1xyXG4gICAgICAgIHN1cGVyKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0ge3I6MjU1LGc6MjU1LGI6MH07O1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gMjtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMCwxKSkpIHsgXHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDEpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcGFydE5hbWUgPSBcIlNBTkRcIjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZsdWlkIGV4dGVuZHMgTW92ZWFibGV7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjpWZWN0b3IyKXtcclxuICAgICAgICBzdXBlcihwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IHtyOjEwLGc6MTcwLGI6MjU1fTtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoMCwxKSkpIHsgXHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVTaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHJ5TW92ZShuZXcgVmVjdG9yMigtMSwxKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMSkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlU2lkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVNpZGUoKXtcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMCkpKXtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKC0xLDApKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRyeU1vdmUobmV3IFZlY3RvcjIoLTEsMCkpKXtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50cnlNb3ZlKG5ldyBWZWN0b3IyKDEsMCkpKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwYXJ0TmFtZSA9IFwiV0FUUlwiO1xyXG59IiwiaW1wb3J0IHtXb3JsZCxXb3JsZFNpemV9IGZyb20gXCIuL3dvcmxkX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQge01vdmVhYmxlLCBQYXJ0aWNsZX0gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuXHJcbmludGVyZmFjZSBQaHlzaWNze1xyXG5cclxuICAgIHN0ZXAoc2ltX3N0YXRlOiBXb3JsZCk6V29ybGQ7XHJcblxyXG59XHJcblxyXG5jbGFzcyBCYXNpY1BoeXNpY3MgaW1wbGVtZW50cyBQaHlzaWNze1xyXG5cclxuICAgIHN0ZXAoc2ltX3N0YXRlOiBXb3JsZCl7XHJcbiAgICAgICAgbGV0IG1vdmVkIDpBcnJheTxQYXJ0aWNsZT4gPSBbXTtcclxuXHJcbiAgICAgICAgLy9zaW1fc3RhdGUuaXR0ZXJhdG9yRGlyZWN0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICozKTtcclxuXHJcbiAgICAgICAgLy9UaGlzIGxpbmUgZml4ZXMgZXZlcnl0aGluZ1xyXG4gICAgICAgIHNpbV9zdGF0ZS5pdHRlcmF0b3JEaXJlY3Rpb24rK1xyXG4gICAgICAgIGlmIChzaW1fc3RhdGUuaXR0ZXJhdG9yRGlyZWN0aW9uID4gMykge1xyXG4gICAgICAgICAgICBzaW1fc3RhdGUuaXR0ZXJhdG9yRGlyZWN0aW9uID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcihsZXQgcGFydCBvZiBzaW1fc3RhdGUpe1xyXG4gICAgICAgICAgICBpZighcGFydCB8fCAhKHBhcnQgaW5zdGFuY2VvZiBNb3ZlYWJsZSkgfHwgbW92ZWQuaW5jbHVkZXMocGFydCkpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICBwYXJ0LnN0ZXAoKTsgICAgIFxyXG4gICAgICAgICAgICBtb3ZlZC5wdXNoKHBhcnQpO1xyXG5cclxuICAgICAgICAgICAgc2ltX3N0YXRlLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSBwYXJ0O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzaW1fc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBQaHlzaWNzID0gbmV3IEJhc2ljUGh5c2ljcygpOyIsImltcG9ydCB7V29ybGQsV29ybGRTaXplLHdvcmxkfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7Y2FudmFzLGN0eH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9yZW5kZXJlclwiXHJcbmltcG9ydCB7IFV0aWxpdHkgfSBmcm9tIFwiLi91dGlsXCI7XHJcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuXHJcbmludGVyZmFjZSBSZW5kZXJlcntcclxuXHJcbiAgICBkcmF3RnJhbWUoc2ltX3N0YXRlOiBXb3JsZCkgOiB2b2lkO1xyXG5cclxufVxyXG5cclxuXHJcbmNsYXNzIEJhc2ljUmVuZGVyZXIgaW1wbGVtZW50cyBSZW5kZXJlcntcclxuXHJcbiAgICBkcmF3RnJhbWUoc2ltX3N0YXRlOiBXb3JsZCl7XHJcblxyXG4gICAgICAgIGZvcihsZXQgcGFydCBvZiBzaW1fc3RhdGUpe1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwYXJ0KVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiBcclxuXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBVdGlsaXR5LnJnYlRvSGV4KHBhcnQuY29sb3IpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QocGFydC5wb3NpdGlvbi54LHBhcnQucG9zaXRpb24ueSwxLDEpOyAvL2RyYXcgcmVjdGFuZ2xlIDpQICAgICAgICAgICBcclxuXHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5jbGFzcyBQaXhlbFJlbmRlcmVyIGltcGxlbWVudHMgUmVuZGVyZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhc0RhdGEgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgLy9jdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0ZyYW1lKHNpbV9zdGF0ZTogV29ybGQpe1xyXG4gICAgICAgIHRoaXMuY2FudmFzRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgV29ybGRTaXplLngqdGhpcy5zY2FsZS54LCBXb3JsZFNpemUueSp0aGlzLnNjYWxlLnkpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFdvcmxkU2l6ZS54KnRoaXMuc2NhbGUueDsgeCsrKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgV29ybGRTaXplLnkqdGhpcy5zY2FsZS55OyB5KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gd29ybGQucGFydGljbGVzW01hdGguZmxvb3IoeS90aGlzLnNjYWxlLnkpXVtNYXRoLmZsb29yKHgvdGhpcy5zY2FsZS54KV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICh4ICsgeSAqIFdvcmxkU2l6ZS54KnRoaXMuc2NhbGUueCkgKiA0IDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhc0RhdGEuZGF0YVtpbmRleCArIDBdID0gcGFydC5jb2xvci5yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXNEYXRhLmRhdGFbaW5kZXggKyAxXSA9IHBhcnQuY29sb3IuZztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzRGF0YS5kYXRhW2luZGV4ICsgMl0gPSBwYXJ0LmNvbG9yLmI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhc0RhdGEuZGF0YVtpbmRleCArIDNdID0gMjU1O1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgIFxyXG4gICAgICAgIGN0eC5wdXRJbWFnZURhdGEodGhpcy5jYW52YXNEYXRhLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBjYW52YXNEYXRhOkltYWdlRGF0YSB8IHVuZGVmaW5lZDtcclxuICAgIHNjYWxlID0gbmV3IFZlY3RvcjIoMiwyKTtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBSZW5kZXJlciA9IG5ldyBQaXhlbFJlbmRlcmVyKCk7IiwiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi9DYW52YXMtRW5naW5lL3NyYy9lbmdpbmUvYmFzZV90eXBlc1wiO1xyXG5pbXBvcnQgeyBXb3JsZFNpemUgfSBmcm9tIFwiLi93b3JsZF9tYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXRpbGl0eXtcclxuXHJcbiAgICBzdGF0aWMgaW5Cb3VuZHMocG9zaXRpb246VmVjdG9yMil7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uLnkgPj0gV29ybGRTaXplLnkgfHwgcG9zaXRpb24ueCA+PSBXb3JsZFNpemUueCB8fFxyXG4gICAgICAgICAgICBwb3NpdGlvbi55IDwgMCB8fCBwb3NpdGlvbi54IDwgMCApIFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB2ZWN0b3JJbnRlcnBvbGF0ZShmcm9tOlZlY3RvcjIsIHRvOlZlY3RvcjIsIHByb2dyZXNzOm51bWJlcil7XHJcbiAgICAgICAgbGV0IG91dCA9IG5ldyBWZWN0b3IyXHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgICB0by54IC0gZnJvbS54LFxyXG4gICAgICAgICAgICB0by55IC0gZnJvbS55XHJcbiAgICAgICAgKTtcclxuICAgICAgICBcclxuICAgICAgICBvdXQueCAqPSBwcm9ncmVzcztcclxuICAgICAgICBvdXQueSAqPSBwcm9ncmVzcztcclxuICAgICAgICBcclxuICAgICAgICBvdXQueCArPSBmcm9tLng7XHJcbiAgICAgICAgb3V0LnkgKz0gZnJvbS55O1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0OyAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJnYlRvSGV4KGNvbG9yIDp7cjpudW1iZXIsZzpudW1iZXIsYjpudW1iZXJ9KTpzdHJpbmcge1xyXG4gICAgICAgIGxldCByID0gY29sb3IucjtcclxuICAgICAgICBsZXQgZyA9IGNvbG9yLmc7XHJcbiAgICAgICAgbGV0IGIgPSBjb2xvci5iO1xyXG5cclxuICAgICAgICBsZXQgcmhleCA9IHIudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIHJoZXggPSAoIHJoZXgubGVuZ3RoID09IDEgPyBcIjBcIiArIHJoZXggOiByaGV4KTtcclxuXHJcbiAgICAgICAgbGV0IGdoZXggPSBnLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICBnaGV4ID0gKCBnaGV4Lmxlbmd0aCA9PSAxID8gXCIwXCIgKyBnaGV4IDogZ2hleCk7XHJcblxyXG4gICAgICAgIGxldCBiaGV4ID0gYi50b1N0cmluZygxNik7XHJcbiAgICAgICAgYmhleCA9ICggYmhleC5sZW5ndGggPT0gMSA/IFwiMFwiICsgYmhleCA6IGJoZXgpO1xyXG5cclxuICAgICAgICByZXR1cm4gYCMke3JoZXh9JHtnaGV4fSR7YmhleH1gO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vQ2FudmFzLUVuZ2luZS9zcmMvZW5naW5lL2Jhc2VfdHlwZXNcIjtcclxuaW1wb3J0IHtEcmF3YWJsZX0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9vYmplY3QyRFwiO1xyXG5pbXBvcnQge2N0eH0gZnJvbSBcIi4uL0NhbnZhcy1FbmdpbmUvc3JjL2VuZ2luZS9yZW5kZXJlclwiO1xyXG5pbXBvcnQge1BhcnRpY2xlfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5pbXBvcnQge1JlbmRlcmVyfSBmcm9tIFwiLi9yZW5kZXJcIjtcclxuaW1wb3J0IHtQaHlzaWNzfSBmcm9tIFwiLi9waHlzaWNzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgV29ybGRTaXplID0gbmV3IFZlY3RvcjIoNDAwLDMwMCk7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGR7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuaXR0ZXJhdG9yRGlyZWN0aW9uID0gMjtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgQXJyYXkoV29ybGRTaXplLnkpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpbmRleCsrKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2luZGV4XSA9IG5ldyBBcnJheShXb3JsZFNpemUueCkuZmlsbCh1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL0l0dGVyYXRvclxyXG4gICAgcHJpdmF0ZSBnZXRJdHRlclZhbChpIDogbnVtYmVyKTpQYXJ0aWNsZSB8IHVuZGVmaW5lZHsgXHJcbiAgICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKGkvV29ybGRTaXplLngpO1xyXG4gICAgICAgIGxldCB4ID0gaSAtIE1hdGguZmxvb3IoaS9Xb3JsZFNpemUueCkqV29ybGRTaXplLng7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5pdHRlcmF0b3JEaXJlY3Rpb24pIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFydGljbGVzW3ldW1dvcmxkU2l6ZS54IC0geCAtMV07ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZXNbV29ybGRTaXplLnkgLSB5IC0gMV1beF07ICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnRpY2xlc1tXb3JsZFNpemUueSAtIHkgLTFdW1dvcmxkU2l6ZS54IC0geCAtMV07ICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZXNbeV1beF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIFtTeW1ib2wuaXRlcmF0b3JdID0gKCkgPT4geyAgICAgIFxyXG4gICAgICAgIGxldCBpID0gMDtcclxuXHJcbiAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICBuZXh0OigpPT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm57XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZTogKGkgPj0gKFdvcmxkU2l6ZS54ICogV29ybGRTaXplLnkgLSAxKSksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuZ2V0SXR0ZXJWYWwoaSsrKSAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBhcnRpY2xlczpBcnJheTxBcnJheTxQYXJ0aWNsZSB8IHVuZGVmaW5lZD4+O1xyXG5cclxuICAgIGl0dGVyYXRvckRpcmVjdGlvbiA6bnVtYmVyOyAvLzAtMyB0bCB0ciBibCBiclxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgd29ybGQgPSBuZXcgV29ybGQoKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZE1hbmFnZXIgZXh0ZW5kcyBEcmF3YWJsZXsgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgb25VcGRhdGUoKXsgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25SZW5kZXIoKXtcclxuICAgICAgICBzdXBlci5vblJlbmRlcigpO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZighdGhpcy5wYXVzZWQpXHJcbiAgICAgICAgICAgIFBoeXNpY3Muc3RlcCh3b3JsZCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIFJlbmRlcmVyLmRyYXdGcmFtZSh3b3JsZCk7XHJcblxyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjNzc3JztcclxuICAgICAgICBjdHguc3Ryb2tlUmVjdCgwLDAsNDAwLDMwMCk7XHJcbiAgICB9ICAgIFxyXG5cclxuXHJcbiAgICBhZGRQYXJ0KHBhcnQ6IFBhcnRpY2xlKXsgICAgICAgIFxyXG4gICAgICAgIHdvcmxkLnBhcnRpY2xlc1twYXJ0LnBvc2l0aW9uLnldW3BhcnQucG9zaXRpb24ueF0gPSBwYXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlZDpib29sZWFuO1xyXG59XHJcblxyXG5cclxuXHJcbi8vVE9ETzogTXVsdGl0aHJlYWRpbmcgaWYgaSBmYW5jeVxyXG4vKlxyXG51c2UgdGhpcyB0byB0ZXN0IGlmIHN1cHBvcnRlZFxyXG5cclxuaWYgKHR5cGVvZihXb3JrZXIpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgIC8vZ3JlYXQsIHlvdXIgYnJvd3NlciBzdXBwb3J0cyB3ZWIgd29ya2Vyc1xyXG59IGVsc2Uge1xyXG4gICAvL25vdCBzdXBwb3J0ZWRcclxufVxyXG5cclxuKi8iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4uL2dhbWUvZ2FtZS50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=