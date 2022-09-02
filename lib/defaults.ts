import _ from 'lodash';

import type {GlobOpts, ExpandOpts} from './types';

const defaultOpts = {
    expandOpts: {
        root: null,
        formats: []
    },
    globOpts: {
        onlyFiles: false
    }
};

function defaults(name: 'globOpts', options?: Partial<GlobOpts>): GlobOpts;
function defaults(name: 'expandOpts', options?: Partial<ExpandOpts>): ExpandOpts;
function defaults(name: keyof typeof defaultOpts, options?: Partial<ExpandOpts | GlobOpts>): ExpandOpts | GlobOpts {
    return _.defaults(options, defaultOpts[name]);
}

export = defaults;
