import axios from 'axios';
import { Util } from './Util';
export class GraphHopperIsochrone {
    constructor(args, requestDefaults) {
        this.defaults = {
            time_limit: 600,
            distance_limit: 0,
            buckets: 3,
            profile: 'car',
            debug: false,
            reverse_flow: false
        };
        if (requestDefaults) {
            Object.keys(requestDefaults).forEach(key => {
                this.defaults[key] = requestDefaults[key];
            });
        }
        this.key = args.key;
        this.host = args.host ? args.host : 'https://graphhopper.com/api/1';
        this.endpoint = args.endpoint ? args.endpoint : '/isochrone';
        this.timeout = args.timeout ? args.timeout : 30000;
        this.ghUtil = new Util();
    }
    getParametersAsQueryString(args) {
        let qString = `point=${args.point}`;
        qString += `&time_limit=${args.time_limit}`;
        qString += `&distance_limit=${args.distance_limit}`;
        qString += `&buckets=${args.buckets}`;
        qString += `&profile=${args.profile}`;
        qString += `&reverse_flow=${args.reverse_flow}`;
        if (args.debug)
            qString += '&debug=true';
        return qString;
    }
    async doRequest(reqArgs) {
        Object.keys(this.defaults).forEach(key => {
            if (!reqArgs[key])
                reqArgs[key] = this.defaults[key];
        });
        const url = `${this.host}${this.endpoint}?${this.getParametersAsQueryString(reqArgs)}&key=${this.key}`;
        try {
            const res = await axios.get(url, { timeout: this.timeout });
            if (res.status !== 200) {
                throw this.ghUtil.extractError(res, url);
            }
            return res.data;
        }
        catch (err) {
            throw this.ghUtil.extractError(err.response, url);
        }
    }
}
