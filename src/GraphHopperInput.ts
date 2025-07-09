export interface GraphHopperInputObject {
    lat: number;
    lng: number;
}

export class GraphHopperInput {
    lat?: number;
    lng?: number;
    input?: string;

    constructor(input?: string | GraphHopperInputObject, input2?: number) {
        this.set(input, input2);
    }

    round(val: number, precision: number = 1e6): number {
        return Math.round(val * precision) / precision;
    }

    setCoord(lat: number, lng: number): void {
        this.lat = this.round(lat);
        this.lng = this.round(lng);
        this.input = this.toString();
    }

    static isObject(value: any): value is GraphHopperInputObject {
        return Object.prototype.toString.call(value).toLowerCase() === "[object object]";
    }

    static isString(value: any): value is string {
        return Object.prototype.toString.call(value).toLowerCase() === "[object string]";
    }

    set(strOrObject?: string | GraphHopperInputObject, input2?: number): void {
        if (input2 !== undefined && typeof strOrObject === 'number') {
            this.setCoord(strOrObject, input2);
            return;
        }
        this.input = strOrObject as string;
        if (GraphHopperInput.isObject(strOrObject)) {
            this.setCoord(strOrObject.lat, strOrObject.lng);
        } else if (GraphHopperInput.isString(strOrObject)) {
            const index = strOrObject.indexOf(",");
            if (index >= 0) {
                this.lat = this.round(parseFloat(strOrObject.substr(0, index)));
                this.lng = this.round(parseFloat(strOrObject.substr(index + 1)));
            }
        }
    }

    toString(): string | undefined {
        if (this.lat !== undefined && this.lng !== undefined)
            return `${this.lat},${this.lng}`;
        return undefined;
    }
}
