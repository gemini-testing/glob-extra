import path from 'path';
import Bluebird from 'bluebird';
import _ from 'lodash';
import fg from 'fast-glob';
import { Minimatch } from 'minimatch';
import normalize from 'normalize-path';

import defaults from './defaults';
import * as utils from './utils';

import type { GlobOpts, ExpandOpts } from './types';
export type { GlobOpts, ExpandOpts };

const getFilesByMask = (pattern: string | Array<string>, options: GlobOpts): Promise<Array<string>> => fg(pattern, options);

const expandPath = async (basePath: string, options: ExpandOpts): Promise<Array<string>> => {
    basePath = options.root ? path.resolve(options.root, basePath) : basePath;

    const isFile = await utils.isFile(basePath);
    const paths = isFile ? [basePath] : await utils.getFilePaths(basePath);

    return paths.filter((path) => utils.matchesFormats(path, options.formats));
};

const processPaths = async (paths: Array<string>, cb: (path: string) => Promise<Array<string>>): Promise<Array<string>> => {
    const array = await Bluebird.map(paths, cb);

    return _(array).flatten().uniq().value();
};

export const expandPaths = async (
    paths: string | Array<string>,
    _expandOpts: Partial<ExpandOpts>,
    _globOpts: Partial<GlobOpts>
): Promise<Array<string>> => {
    const expandOpts = defaults('expandOpts', _expandOpts);
    const globOpts = _(defaults('globOpts', _globOpts)).omitBy(_.isUndefined).value();

    // fast-glob requires only forward-slashes (https://github.com/mrmlnc/fast-glob#pattern-syntax)
    if (globOpts.ignore) {
        globOpts.ignore = globOpts.ignore.map(p => normalize(p));
    }

    const normalizedPaths = ([] as Array<string>).concat(paths).map(p => normalize(p));
    const matchedPaths = await processPaths(normalizedPaths, (path) => getFilesByMask(path, globOpts));

    return processPaths(matchedPaths, (path) => expandPath(path, expandOpts));
};

export const isMask = (pattern?: string): boolean => {
    if (!pattern) {
        return false;
    }

    const {set} = new Minimatch(pattern);

    if (set.length > 1) {
        return true;
    }

    return set[0].some((v) => typeof v !== 'string');
};
