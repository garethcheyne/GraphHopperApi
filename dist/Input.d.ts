export interface GraphHopperInputObject {
    lat: number;
    lng: number;
}
export declare class GraphHopperInput {
    lat?: number;
    lng?: number;
    input?: string;
    constructor(input?: string | GraphHopperInputObject, input2?: number);
    round(val: number, precision?: number): number;
    setCoord(lat: number, lng: number): void;
    static isObject(value: any): value is GraphHopperInputObject;
    static isString(value: any): value is string;
    set(strOrObject?: string | GraphHopperInputObject, input2?: number): void;
    toString(): string | undefined;
}
