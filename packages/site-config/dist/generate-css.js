"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThemeCSS = generateThemeCSS;
/** Map TypeScript camelCase keys to CSS custom property names */
var cssVarMap = {
    primary: "--primary",
    primaryForeground: "--primary-foreground",
    secondary: "--secondary",
    secondaryForeground: "--secondary-foreground",
    background: "--background",
    foreground: "--foreground",
    muted: "--muted",
    mutedForeground: "--muted-foreground",
    accent: "--accent",
    accentForeground: "--accent-foreground",
    border: "--border",
    input: "--input",
    ring: "--ring",
    card: "--card",
    cardForeground: "--card-foreground",
    popover: "--popover",
    popoverForeground: "--popover-foreground",
    destructive: "--destructive",
    destructiveForeground: "--destructive-foreground",
    accentGradientStart: "--accent-gradient-start",
    accentGradientEnd: "--accent-gradient-end",
};
function paletteToCSS(palette, indent) {
    return Object.entries(cssVarMap)
        .map(function (_a) {
        var key = _a[0], prop = _a[1];
        return "".concat(indent).concat(prop, ": ").concat(palette[key], ";");
    })
        .join("\n");
}
function generateThemeCSS(theme) {
    return "/* Auto-generated theme \u2014 do not edit manually */\n:root {\n  --radius: ".concat(theme.radius, ";\n  --radius-full: ").concat(theme.radiusFull, ";\n  --font-heading: ").concat(theme.fonts.heading, ";\n  --font-body: ").concat(theme.fonts.body, ";\n").concat(paletteToCSS(theme.light, "  "), "\n}\n\n.dark {\n").concat(paletteToCSS(theme.dark, "  "), "\n}\n\n.bg-gradient-accent {\n  background: linear-gradient(to right, var(--accent-gradient-start), var(--accent-gradient-end));\n}\n");
}
