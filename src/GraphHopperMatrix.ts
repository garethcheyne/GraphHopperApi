import axios from 'axios';
import { Util } from './Util';

export interface GraphHopperMatrixArgs {
    key: string;
    host?: string;
    endpoint?: string;
    timeout?: number;
    profile?: string;
    debug?: boolean;
    out_arrays?: string[];
    from_points?: number[][];
    to_points?: number[][];
    points?: number[][];
}

export class GraphHopperMatrix {
    private defaults: Record<string, any>;
    private key: string;
    private host: string;
    private endpoint: string;
    private timeout: number;
    private ghUtil: Util;

    constructor(args: GraphHopperMatrixArgs, requestDefaults?: Record<string, any>) {
        this.defaults = {
            profile: 'car',
            debug: false,
            out_arrays: ['times']
        };
        if (requestDefaults) {
            Object.keys(requestDefaults).forEach(key => {
                this.defaults[key] = requestDefaults[key];
            });
        }
        this.key = args.key;
        this.host = args.host ? args.host : 'https://graphhopper.com/api/1';
        this.endpoint = args.endpoint ? args.endpoint : '/matrix';
        this.timeout = args.timeout ? args.timeout : 30000;
        this.ghUtil = new Util();
    }

    async doRequest(reqArgs: Partial<GraphHopperMatrixArgs>): Promise<any> {
        Object.keys(this.defaults).forEach(key => {
            if (!(reqArgs as any)[key]) (reqArgs as any)[key] = this.defaults[key];
        });
        if (!reqArgs.from_points && !reqArgs.to_points) {
            reqArgs.from_points = reqArgs.points;
            reqArgs.to_points = reqArgs.points;
            delete (reqArgs as any)["points"];
        }
        const url = `${this.host}${this.endpoint}?key=${this.key}`;
        try {
            const res = await axios.post(url, reqArgs, {
                timeout: this.timeout,
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.status !== 200) {
                throw this.ghUtil.extractError(res, url);
            }
            return res.data;
        } catch (err: any) {
            throw this.ghUtil.extractError(err.response, url);
        }
    }

    toHtmlTable(request: any, doubleArray: any[][]): string {
        const to_points = request.to_points, from_points = request.from_points;
        let htmlOut = "<table border='1' cellpadding='10'>";
        htmlOut += "<tr>";
        htmlOut += "<td>&#8595; from \\ to &#8594;</td>";
        for (let idxTo in to_points) {
            htmlOut += `<td><b>${to_points[idxTo][1]},${to_points[idxTo][0]}</b></td>`;
        }
        htmlOut += "</tr>";
        for (let idxFrom in doubleArray) {
            htmlOut += "<tr>";
            htmlOut += `<td><b>${from_points[idxFrom][1]},${from_points[idxFrom][0]}</b></td>`;
            let res = doubleArray[idxFrom];
            for (let idxTo in res) {
                let mapsURL = `https://graphhopper.com/maps?point=${encodeURIComponent(from_points[idxFrom][1] + "," + from_points[idxFrom][0])}&point=${encodeURIComponent(to_points[idxTo][1] + "," + to_points[idxTo][0])}&profile=${request.profile}`;
                htmlOut += `<td> <a href='${mapsURL}'>${res[idxTo]}</a> </td>`;
            }
            htmlOut += "</tr>\n";
        }
        htmlOut += "</table>";
        return htmlOut;
    }
}
