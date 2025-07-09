import axios from 'axios';
import { Util as GraphHopperUtil } from './Util';
export class GraphHopperRouting {
    constructor(args, requestDefaults) {
        this.defaults = {
            profile: 'car',
            debug: false,
            locale: 'en',
            points_encoded: true,
            instructions: true,
            elevation: true,
            optimize: 'false'
        };
        if (requestDefaults) {
            Object.keys(requestDefaults).forEach(key => {
                this.defaults[key] = requestDefaults[key];
            });
        }
        this.key = args.key;
        this.host = args.host ? args.host : 'https://graphhopper.com/api/1';
        this.endpoint = args.endpoint ? args.endpoint : '/route';
        this.timeout = args.timeout ? args.timeout : 10000;
        this.turn_sign_map = args.turn_sign_map ? args.turn_sign_map : {
            '-6': 'leave roundabout',
            '-3': 'turn sharp left',
            '-2': 'turn left',
            '-1': 'turn slight left',
            0: 'continue',
            1: 'turn slight right',
            2: 'turn right',
            3: 'turn sharp right',
            4: 'finish',
            5: 'reached via point',
            6: 'enter roundabout'
        };
        this.ghUtil = new GraphHopperUtil();
    }
    async doRequest(reqArgs) {
        Object.keys(this.defaults).forEach(key => {
            if (!reqArgs[key])
                reqArgs[key] = this.defaults[key];
        });
        const url = `${this.host}${this.endpoint}?key=${this.key}`;
        try {
            const res = await axios.post(url, reqArgs, {
                timeout: this.timeout,
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.status !== 200) {
                throw this.ghUtil.extractError(res, url);
            }
            // Type assertion for res.data
            const data = res.data;
            if (data.paths) {
                for (let i = 0; i < data.paths.length; i++) {
                    let path = data.paths[i];
                    if (path.points_encoded) {
                        let tmpArray = this.ghUtil.decodePath(path.points, Boolean(reqArgs.elevation));
                        path.points = {
                            type: 'LineString',
                            coordinates: tmpArray
                        };
                        let tmpSnappedArray = this.ghUtil.decodePath(path.snapped_waypoints, Boolean(reqArgs.elevation));
                        path.snapped_waypoints = {
                            type: 'LineString',
                            coordinates: tmpSnappedArray
                        };
                    }
                    if (path.instructions) {
                        for (let j = 0; j < path.instructions.length; j++) {
                            let interval = path.instructions[j].interval;
                            path.instructions[j].points = path.points.coordinates.slice(interval[0], interval[1] + 1);
                        }
                    }
                }
            }
            return data;
        }
        catch (err) {
            throw this.ghUtil.extractError(err.response, url);
        }
    }
    async info() {
        const url = `${this.host}/info?key=${this.key}`;
        try {
            const res = await axios.get(url, { timeout: this.timeout, headers: { 'Content-Type': 'application/json' } });
            if (res.status !== 200) {
                throw this.ghUtil.extractError(res, url);
            }
            return res.data;
        }
        catch (err) {
            throw this.ghUtil.extractError(err.response, url);
        }
    }
    async i18n(args) {
        const locale = args && args.locale ? args.locale : this.defaults.locale;
        const url = `${this.host}/i18n/${locale}?key=${this.key}`;
        try {
            const res = await axios.get(url, { timeout: this.timeout, headers: { 'Content-Type': 'application/json' } });
            if (res.status !== 200) {
                throw this.ghUtil.extractError(res, url);
            }
            return res.data;
        }
        catch (err) {
            throw this.ghUtil.extractError(err.response, url);
        }
    }
    getTurnText(sign) {
        return this.turn_sign_map[sign];
    }
}
