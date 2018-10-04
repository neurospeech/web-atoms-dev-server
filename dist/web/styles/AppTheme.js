var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "web-atoms-core/dist/web/styles/AtomTheme"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AtomTheme_1 = require("web-atoms-core/dist/web/styles/AtomTheme");
    var AppTheme = /** @class */ (function (_super) {
        __extends(AppTheme, _super);
        function AppTheme() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AppTheme;
    }(AtomTheme_1.AtomTheme));
    exports.default = AppTheme;
});
//# sourceMappingURL=AppTheme.js.map