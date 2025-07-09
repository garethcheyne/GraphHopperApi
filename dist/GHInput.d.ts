export interface GHInputObject {
    lat: number;
    lng: number;
}
export declare class GHInput {
    lat?: number;
    lng?: number;
    input?: string;
    constructor(input?: string | GHInputObject, input2?: number);
    round(val: number, precision?: number): number;
    setCoord(lat: number, lng: number): void;
    static isObject(value: any): value is GHInputObject;
    static isString(value: any): value is string;
    set(strOrObject?: string | GHInputObject, input2?: number): void;
    toString(): string | undefined;
}
