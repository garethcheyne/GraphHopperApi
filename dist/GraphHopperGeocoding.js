import axios from 'axios';
import { Util } from './Util';
export class GraphHopperGeocoding {
    constructor(args, requestDefaults) {
        this.defaults = {
            debug: false,
            locale: 'en',
        };
        if (requestDefaults) {
            Object.keys(requestDefaults).forEach(key => {
                this.defaults[key] = requestDefaults[key];
            });
        }
        this.key = args.key;
        this.host = args.host ? args.host : 'https://graphhopper.com/api/1';
        this.endpoint = args.endpoint ? args.endpoint : '/geocode';
        this.timeout = args.timeout ? args.timeout : 10000;
        this.ghUtil = new Util();
    }
    getParametersAsQueryString(args) {
        let qString = `locale=${args.locale}`;
        if (args.query) {
            qString += `&q=${encodeURIComponent(args.query)}`;
            if (args.location_bias)
                qString += `&point=${encodeURIComponent(args.location_bias.toString())}`;
            else if (args.point)
                qString += `&point=${encodeURIComponent(args.point.toString())}`;
        }
        else {
            qString += '&reverse=true';
            if (args.point)
                qString += `&point=${encodeURIComponent(args.point.toString())}`;
        }
        if (args.debug)
            qString += '&debug=true';
        if (args.limit)
            qString += `&limit=${args.limit}`;
        return qString;
    }
    async doRequest(reqArgs) {
        if (!reqArgs)
            reqArgs = {};
        Object.keys(this.defaults).forEach(key => {
            if (!reqArgs[key])
                reqArgs[key] = this.defaults[key];
        });
        const url = `${this.host}${this.endpoint}?${this.getParametersAsQueryString(reqArgs)}&key=${this.key}`;
        try {
            const res = await axios.get(url, { timeout: this.timeout });
            if (res.status !== 200) {
                throw this.ghUtil.extractError ? this.ghUtil.extractError(res, url) : res.statusText;
            }
            return res.data;
        }
        catch (err) {
            throw this.ghUtil.extractError ? this.ghUtil.extractError(err.response, url) : err;
        }
    }
}
