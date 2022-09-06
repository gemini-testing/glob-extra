import _ from 'lodash';
import Bluebird from 'bluebird';
import baseFs from 'fs';
import path from 'path';

const fs = Bluebird.promisifyAll(baseFs);

const matchesFormats = (filePath: string, formats: Array<string>): boolean => {
    return _.isEmpty(formats) || _.includes(formats, path.extname(filePath));
};

const isFile = async (path: string): Promise<boolean> => {
    const stat = await fs.statAsync(path);

    return stat.isFile();
};

const getFilePaths = async (basePath: string): Promise<Array<string>> => {
    async function readDirFiles(basePath: string): Promise<Array<string>> {
        const paths = await fs.readdirAsync(basePath);
        const subPaths = await Bluebird.map(paths, (p) => getFilePaths(path.join(basePath, p)));

        return _.flatten(subPaths);
    }

    try {
        return await isFile(basePath) ? [basePath] : readDirFiles(basePath);
    } catch (err: unknown) {
        const errMessage = err instanceof Error
            ? err.stack || err.message
            : err;

        throw new Error(`Error while reading path "${basePath}"\n${errMessage}`);
    }
};

export = {
    matchesFormats,
    isFile,
    getFilePaths
};
