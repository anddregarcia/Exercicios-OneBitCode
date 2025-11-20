"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toaster = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const next_themes_0_4_6_1 = require("next-themes@0.4.6");
const sonner_2_0_3_1 = require("sonner@2.0.3");
const Toaster = ({ ...props }) => {
    const { theme = "system" } = (0, next_themes_0_4_6_1.useTheme)();
    return ((0, jsx_runtime_1.jsx)(sonner_2_0_3_1.Toaster, { theme: theme, className: "toaster group", style: {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
        }, ...props }));
};
exports.Toaster = Toaster;
//# sourceMappingURL=sonner.js.map