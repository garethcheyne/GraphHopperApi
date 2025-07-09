export declare class Util {
    clone<T extends object>(obj: T): T;
    decodePath(encoded: string, is3D: boolean): number[][];
    extractError(res: any, url: string): Error;
    isArray(value: any): boolean;
    isObject(value: any): boolean;
    isString(value: any): boolean;
}
