"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMask = exports.expandPaths = void 0;
const path_1 = __importDefault(require("path"));
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = __importDefault(require("lodash"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const minimatch_1 = require("minimatch");
const normalize_path_1 = __importDefault(require("normalize-path"));
const defaults_1 = __importDefault(require("./defaults"));
const utils = __importStar(require("./utils"));
const getFilesByMask = (pattern, options) => (0, fast_glob_1.default)(pattern, options);
const expandPath = (basePath, options) => __awaiter(void 0, void 0, void 0, function* () {
    basePath = options.root ? path_1.default.resolve(options.root, basePath) : basePath;
    const isFile = yield utils.isFile(basePath);
    const paths = isFile ? [basePath] : yield utils.getFilePaths(basePath);
    return paths.filter((path) => utils.matchesFormats(path, options.formats));
});
const processPaths = (paths, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const array = yield bluebird_1.default.map(paths, cb);
    return (0, lodash_1.default)(array).flatten().uniq().value();
});
const expandPaths = (paths, _expandOpts, _globOpts) => __awaiter(void 0, void 0, void 0, function* () {
    const expandOpts = (0, defaults_1.default)('expandOpts', _expandOpts);
    const globOpts = (0, lodash_1.default)((0, defaults_1.default)('globOpts', _globOpts)).omitBy(lodash_1.default.isUndefined).value();
    // fast-glob requires only forward-slashes (https://github.com/mrmlnc/fast-glob#pattern-syntax)
    if (globOpts.ignore) {
        globOpts.ignore = globOpts.ignore.map(p => (0, normalize_path_1.default)(p));
    }
    const normalizedPaths = [].concat(paths).map(p => (0, normalize_path_1.default)(p));
    const matchedPaths = yield processPaths(normalizedPaths, (path) => getFilesByMask(path, globOpts));
    return processPaths(matchedPaths, (path) => expandPath(path, expandOpts));
});
exports.expandPaths = expandPaths;
const isMask = (pattern) => {
    if (!pattern) {
        return false;
    }
    const { set } = new minimatch_1.Minimatch(pattern);
    if (set.length > 1) {
        return true;
    }
    return set[0].some((v) => typeof v !== 'string');
};
exports.isMask = isMask;
