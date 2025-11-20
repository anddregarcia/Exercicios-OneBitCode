"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drawer = Drawer;
exports.DrawerPortal = DrawerPortal;
exports.DrawerOverlay = DrawerOverlay;
exports.DrawerTrigger = DrawerTrigger;
exports.DrawerClose = DrawerClose;
exports.DrawerContent = DrawerContent;
exports.DrawerHeader = DrawerHeader;
exports.DrawerFooter = DrawerFooter;
exports.DrawerTitle = DrawerTitle;
exports.DrawerDescription = DrawerDescription;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const vaul_1_1_2_1 = require("vaul@1.1.2");
const utils_1 = require("./utils");
function Drawer({ ...props }) {
    return (0, jsx_runtime_1.jsx)(vaul_1_1_2_1.Drawer.Root, { "data-slot": "drawer", ...props });
}
function DrawerTrigger({ ...props }) {
    return (0, jsx_runtime_1.jsx)(vaul_1_1_2_1.Drawer.Trigger, { "data-slot": "drawer-trigger", ...props });
}
function DrawerPortal({ ...props }) {
    return (0, jsx_runtime_1.jsx)(vaul_1_1_2_1.Drawer.Portal, { "data-slot": "drawer-portal", ...props });
}
function DrawerClose({ ...props }) {
    return (0, jsx_runtime_1.jsx)(vaul_1_1_2_1.Drawer.Close, { "data-slot": "drawer-close", ...props });
}
function DrawerOverlay({ className, ...props }) {
    return ((0, jsx_runtime_1.jsx)(vaul_1_1_2_1.Drawer.Overlay, { "data-slot": "drawer-overlay", className: (0, utils_1.cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className), ...props }));
}
function DrawerContent({ className, children, ...props }) {
    return ((0, jsx_runtime_1.jsxs)(DrawerPortal, { "data-slot": "drawer-portal", children: [(0, jsx_runtime_1.jsx)(DrawerOverlay, {}), (0, jsx_runtime_1.jsxs)(vaul_1_1_2_1.Drawer.Content, { "data-slot": "drawer-content", className: (0, utils_1.cn)("group/drawer-content bg-background fixed z-50 flex h-auto flex-col", "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b", "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t", "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm", "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm", className), ...props, children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }), children] })] }));
}
function DrawerHeader({ className, ...props }) {
    return ((0, jsx_runtime_1.jsx)("div", { "data-slot": "drawer-header", className: (0, utils_1.cn)("flex flex-col gap-1.5 p-4", className), ...props }));
}
function DrawerFooter({ className, ...props }) {
    return ((0, jsx_runtime_1.jsx)("div", { "data-slot": "drawer-footer", className: (0, utils_1.cn)("mt-auto flex flex-col gap-2 p-4", className), ...props }));
}
function DrawerTitle({ className, ...props }) {
    return ((0, jsx_runtime_1.jsx)(vaul_1_1_2_1.Drawer.Title, { "data-slot": "drawer-title", className: (0, utils_1.cn)("text-foreground font-semibold", className), ...props }));
}
function DrawerDescription({ className, ...props }) {
    return ((0, jsx_runtime_1.jsx)(vaul_1_1_2_1.Drawer.Description, { "data-slot": "drawer-description", className: (0, utils_1.cn)("text-muted-foreground text-sm", className), ...props }));
}
//# sourceMappingURL=drawer.js.map