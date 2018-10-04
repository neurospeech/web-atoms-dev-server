(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express", "ecstatic", "./ModuleFilesPage", "./RootPage"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var express = require("express");
    var e = require("ecstatic");
    var ModuleFilesPage_1 = require("./ModuleFilesPage");
    var RootPage_1 = require("./RootPage");
    var WebServer = /** @class */ (function () {
        function WebServer() {
            this.express = express();
            this.mountRoutes();
        }
        WebServer.prototype.mountRoutes = function () {
            this.express.use(RootPage_1.RootPage);
            this.express.use(ModuleFilesPage_1.ModuleFilesPage);
            // this.express.use();
            this.express.use(e({
                root: "./",
                baseDir: "_files",
                showdir: true,
                cache: "no-cache"
            }));
            this.express.use(e({
                root: __dirname + "/../../",
                baseDir: "_dev",
                showdir: true,
                cache: "no-cache"
            }));
        };
        return WebServer;
    }());
    exports.default = new WebServer().express;
});
//# sourceMappingURL=WebServer.js.map