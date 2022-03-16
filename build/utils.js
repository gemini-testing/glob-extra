"use strict";
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
exports.getFilePaths = exports.isFile = exports.matchesFormats = void 0;
const lodash_1 = __importDefault(require("lodash"));
const bluebird_1 = __importDefault(require("bluebird"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fs = bluebird_1.default.promisifyAll(fs_1.default);
const matchesFormats = (filePath, formats) => {
    return lodash_1.default.isEmpty(formats) || lodash_1.default.includes(formats, path_1.default.extname(filePath));
};
exports.matchesFormats = matchesFormats;
const isFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const stat = yield fs.statAsync(path);
    return stat.isFile();
});
exports.isFile = isFile;
const getFilePaths = (basePath) => __awaiter(void 0, void 0, void 0, function* () {
    function readDirFiles(basePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const paths = yield fs.readdirAsync(basePath);
            const subPaths = yield bluebird_1.default.map(paths, (p) => (0, exports.getFilePaths)(path_1.default.join(basePath, p)));
            return lodash_1.default.flatten(subPaths);
        });
    }
    try {
        return (yield (0, exports.isFile)(basePath)) ? [basePath] : readDirFiles(basePath);
    }
    catch (err) {
        const errMessage = err instanceof Error
            ? err.stack || err.message
            : err;
        throw new Error(`Error while reading path "${basePath}"\n${errMessage}`);
    }
});
exports.getFilePaths = getFilePaths;
