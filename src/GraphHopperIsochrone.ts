import axios from 'axios';
import { Util } from './Util';

export interface GraphHopperIsochroneArgs {
    key: string;
    host?: string;
    endpoint?: string;
    timeout?: number;
    time_limit?: number;
    distance_limit?: number;
    buckets?: number;
    profile?: string;
    debug?: boolean;
    reverse_flow?: boolean;
    point: string;
}

export class GraphHopperIsochrone {
    private defaults: Record<string, any>;
    private key: string;
    private host: string;
    private endpoint: string;
    private timeout: number;
    private ghUtil: Util;

    constructor(args: GraphHopperIsochroneArgs, requestDefaults?: Record<string, any>) {
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

    getParametersAsQueryString(args: GraphHopperIsochroneArgs): string {
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

    async doRequest(reqArgs: Partial<GraphHopperIsochroneArgs>): Promise<any> {
        Object.keys(this.defaults).forEach(key => {
            if (!(reqArgs as any)[key]) (reqArgs as any)[key] = this.defaults[key];
        });
        const url = `${this.host}${this.endpoint}?${this.getParametersAsQueryString(reqArgs as GraphHopperIsochroneArgs)}&key=${this.key}`;
        try {
            const res = await axios.get(url, { timeout: this.timeout });
            if (res.status !== 200) {
                throw this.ghUtil.extractError(res, url);
            }
            return res.data;
        } catch (err: any) {
            throw this.ghUtil.extractError(err.response, url);
        }
    }
}
