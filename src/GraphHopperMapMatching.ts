import axios from 'axios';
import { Util } from './Util';

export interface GraphHopperMapMatchingArgs {
    key: string;
    host?: string;
    endpoint?: string;
    timeout?: number;
    profile?: string;
    gps_accuracy?: number;
    debug?: boolean;
    max_visited_nodes?: number;
    locale?: string;
    points_encoded?: boolean;
    instructions?: boolean;
    elevation?: boolean;
    data_type?: string;
}

export class GraphHopperMapMatching {
    private defaults: Record<string, any>;
    private key: string;
    private host: string;
    private endpoint: string;
    private timeout: number;
    private ghUtil: Util;

    constructor(args: GraphHopperMapMatchingArgs, requestDefaults?: Record<string, any>) {
        this.defaults = {
            profile: 'car',
            gps_accuracy: 20,
            debug: false,
            max_visited_nodes: 3000,
            locale: 'en',
            points_encoded: true,
            instructions: true,
            elevation: true,
            data_type: 'json'
        };
        if (requestDefaults) {
            Object.keys(requestDefaults).forEach(key => {
                this.defaults[key] = requestDefaults[key];
            });
        }
        this.key = args.key;
        this.host = args.host ? args.host : 'https://graphhopper.com/api/1';
        this.endpoint = args.endpoint ? args.endpoint : '/match';
        this.timeout = args.timeout ? args.timeout : 100000;
        this.ghUtil = new Util();
    }

    getParametersAsQueryString(args: GraphHopperMapMatchingArgs): string {
        let qString = `locale=${args.locale}`;
        qString += `&vehicle=${args.profile}`;
        qString += `&gps_accuracy=${args.gps_accuracy}`;
        qString += `&max_visited_nodes=${args.max_visited_nodes}`;
        qString += `&type=${args.data_type}`;
        qString += `&instructions=${args.instructions}`;
        qString += `&points_encoded=${args.points_encoded}`;
        qString += `&elevation=${args.elevation}`;
        if (args.debug)
            qString += '&debug=true';
        return qString;
    }

    async doRequest(content: any, reqArgs?: Partial<GraphHopperMapMatchingArgs>): Promise<any> {
        if (!reqArgs) reqArgs = {};
        Object.keys(this.defaults).forEach(key => {
            if (!(reqArgs as any)[key]) (reqArgs as any)[key] = this.defaults[key];
        });
        const url = `${this.host}${this.endpoint}?${this.getParametersAsQueryString(reqArgs as GraphHopperMapMatchingArgs)}&key=${this.key}`;
        try {
            const res = await axios.post(url, content, {
                timeout: this.timeout,
                headers: { 'Content-Type': 'application/xml' }
            });
            if (res.status !== 200) {
                throw this.ghUtil.extractError(res, url);
            }
            // Type assertion for res.data
            const data = res.data as { paths?: any[] };
            if (data.paths) {
                for (let i = 0; i < data.paths.length; i++) {
                    let path = data.paths[i];
                    if (path.points_encoded) {
                        let tmpArray = this.ghUtil.decodePath(path.points, Boolean(reqArgs.elevation));
                        path.points = {
                            type: 'LineString',
                            coordinates: tmpArray
                        };
                        delete path.snapped_waypoints;
                    }
                }
            }
            return data;
        } catch (err: any) {
            throw this.ghUtil.extractError(err.response, url);
        }
    }
}
