import type { GlobOpts, ExpandOpts } from './types';
export type { GlobOpts, ExpandOpts };
export declare const expandPaths: (paths: string | Array<string>, _expandOpts: Partial<ExpandOpts>, _globOpts: Partial<GlobOpts>) => Promise<Array<string>>;
export declare const isMask: (pattern?: string | undefined) => boolean;
