"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const defaultOpts = {
    expandOpts: {
        root: null,
        formats: []
    },
    globOpts: {
        onlyFiles: false
    }
};
function defaults(name, options) {
    return lodash_1.default.defaults(options, defaultOpts[name]);
}
exports.default = defaults;
