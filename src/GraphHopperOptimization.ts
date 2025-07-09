import axios from 'axios';
import { Util } from './Util';

export interface GraphHopperOptimizationArgs {
    key: string;
    host?: string;
    endpoint?: string;
    timeout?: number;
    waitInMillis?: number;
    postTimeout?: number;
}

export class GraphHopperOptimization {
    private key: string;
    private host: string;
    private endpoint: string;
    private timeout: number;
    private waitInMillis: number;
    private postTimeout: number;
    private ghUtil: Util;

    constructor(args: GraphHopperOptimizationArgs) {
        this.key = args.key;
        this.host = args.host ? args.host : 'https://graphhopper.com/api/1';
        this.endpoint = args.endpoint ? args.endpoint : '/vrp';
        this.timeout = args.timeout ? args.timeout : 10000;
        this.waitInMillis = args.waitInMillis ? args.waitInMillis : 1000;
        this.postTimeout = args.postTimeout ? args.postTimeout : 10000;
        this.ghUtil = new Util();
    }

    async doVRPRequest(points: number[][], vehicles: number): Promise<any> {
        const firstPoint = points[0];
        const servicesArray = [];
        for (let pointIndex = 1; pointIndex < points.length; pointIndex++) {
            const point = points[pointIndex];
            const obj = {
                id: `_${pointIndex}`,
                type: 'pickup',
                name: `maintenance ${pointIndex}`,
                address: {
                    location_id: `_location_${pointIndex}`,
                    lon: point[0],
                    lat: point[1]
                }
            };
            servicesArray.push(obj);
        }
        const list = [];
        for (let i = 0; i < vehicles; i++) {
            list.push({
                vehicle_id: `_vehicle_${i}`,
                start_address: {
                    location_id: '_start_location',
                    lon: firstPoint[0],
                    lat: firstPoint[1]
                },
                type_id: '_vtype_1'
            });
        }
        const jsonInput = {
            algorithm: { problem_type: 'min-max' },
            vehicles: list,
            vehicle_types: [{ type_id: '_vtype_1', profile: 'car' }],
            services: servicesArray
        };
        return this.doRequest(jsonInput);
    }

    async doRawRequest(jsonInput: any): Promise<any> {
        const postURL = `${this.host}${this.endpoint}/optimize?key=${this.key}`;
        try {
            const res = await axios.post(postURL, jsonInput, {
                timeout: this.postTimeout,
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.status !== 200) {
                throw this.ghUtil.extractError(res, postURL);
            }
            const data = res.data as { job_id?: string };
            const solutionUrl = `${this.host}${this.endpoint}/solution/${data.job_id}?key=${this.key}`;
            return await this.pollSolution(solutionUrl);
        } catch (err: any) {
            throw this.ghUtil.extractError(err.response, postURL);
        }
    }

    private async pollSolution(solutionUrl: string): Promise<any> {
        while (true) {
            await new Promise(resolve => setTimeout(resolve, this.waitInMillis));
            try {
                const res = await axios.get(solutionUrl, { timeout: this.timeout });
                if (res.status !== 200 || res.data === undefined) {
                    throw this.ghUtil.extractError(res, solutionUrl);
                }
                const data = res.data as { status?: string; message?: string } | null;
                if (data && (data.status === 'finished' || data.message)) {
                    return data;
                }
            } catch (err: any) {
                throw this.ghUtil.extractError(err.response, solutionUrl);
            }
        }
    }

    async doRequest(jsonInput: any): Promise<any> {
        // For brevity, this is a direct pass-through to doRawRequest
        return this.doRawRequest(jsonInput);
    }
}
