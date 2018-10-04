(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var express_1 = require("express");
    var fs_1 = require("fs");
    var args = process.argv;
    // Assign router to the express.Router() instance
    var router = express_1.Router();
    function prepareHtml(req, res, viewPath, autoRefresh) {
        while (viewPath.startsWith("/")) {
            viewPath = viewPath.substr(1);
        }
        var devServer = "/_dev";
        var text = fs_1.readFileSync("./package.json", { encoding: "utf-8", flag: "r" });
        var json = JSON.parse(text);
        var current = json.name;
        viewPath = viewPath.replace("$CURRENT$", current);
        var d = json.dependencies || {};
        var da = [];
        for (var key in d) {
            if (d.hasOwnProperty(key)) {
                var element = key;
                if (element === "reflect-metadata") {
                    da.push("\t\t\t\tUMD.map(\"reflect-metadata\",\"/_files/node_modules/reflect-metadata/Reflect.js\");");
                }
                else {
                    da.push("\t\t\t\tUMD.map(\"" + element + "\",\"/_files/node_modules/" + element + "\");");
                }
            }
        }
        var refresh = autoRefresh ? "<script src=\"" + devServer + "/refresh.js\"></script>" : "";
        return "<!DOCTYPE html>\n\n    <html>\n    <head>\n\n        <meta name=\"viewport\"   content=\"width=device-width\"/>\n        <title>Web Atoms - </title>\n        <script src=\"/_files/node_modules/web-atoms-amd-loader/umd.js\"></script>\n        " + refresh + "\n    </head>\n    <body>\n        <script>\n                " + da.join("\r\n") + "\n                UMD.map(\"" + current + "\",\"/_files/\");\n                UMD.map(\"web-atoms-dev-server\", \"" + devServer + "\");\n                UMD.lang = \"en-US\";\n                UMD.loadView(\"" + viewPath + "\", true);\n        </script>\n    </body>\n    </html>";
    }
    router.get(/^\/uiv\//, function (req, res) {
        var p = req.path.replace("uiv/", "");
        var html = prepareHtml(req, res, p, true);
        res.setHeader("cache-control", "no-cache");
        return res.send(html);
    });
    // The / here corresponds to the route that the WelcomeController
    // is mounted on in the server.ts file.
    // In this case it's /welcome
    router.get("/", function (req, res) {
        var html = prepareHtml(req, res, "web-atoms-dev-server/dist/web/views/AppHost", false);
        res.setHeader("cache-control", "no-cache");
        return res.send(html);
    });
    exports.RootPage = router;
});
//# sourceMappingURL=RootPage.js.map