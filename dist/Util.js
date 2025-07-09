export class Util {
    clone(obj) {
        const newObj = {};
        for (const prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                newObj[prop] = obj[prop];
            }
        }
        return newObj;
    }
    decodePath(encoded, is3D) {
        const len = encoded.length;
        let index = 0;
        const array = [];
        let lat = 0;
        let lng = 0;
        let ele = 0;
        while (index < len) {
            let b;
            let shift = 0;
            let result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += deltaLat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const deltaLon = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += deltaLon;
            if (is3D) {
                shift = 0;
                result = 0;
                do {
                    b = encoded.charCodeAt(index++) - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);
                const deltaEle = ((result & 1) ? ~(result >> 1) : (result >> 1));
                ele += deltaEle;
                array.push([lng * 1e-5, lat * 1e-5, ele / 100]);
            }
            else {
                array.push([lng * 1e-5, lat * 1e-5]);
            }
        }
        return array;
    }
    extractError(res, url) {
        let msg;
        if (res && res.data) {
            msg = res.data;
            if (msg.hints && msg.hints[0] && msg.hints[0].message)
                msg = msg.hints[0].message;
            else if (msg.message)
                msg = msg.message;
        }
        else {
            msg = res;
        }
        return new Error(msg + " - for url " + url);
    }
    isArray(value) {
        const stringValue = Object.prototype.toString.call(value);
        return (stringValue.toLowerCase() === "[object array]");
    }
    isObject(value) {
        const stringValue = Object.prototype.toString.call(value);
        return (stringValue.toLowerCase() === "[object object]");
    }
    isString(value) {
        return (typeof value === 'string');
    }
}
