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
export declare class GraphHopperIsochrone {
    private defaults;
    private key;
    private host;
    private endpoint;
    private timeout;
    private ghUtil;
    constructor(args: GraphHopperIsochroneArgs, requestDefaults?: Record<string, any>);
    getParametersAsQueryString(args: GraphHopperIsochroneArgs): string;
    doRequest(reqArgs: Partial<GraphHopperIsochroneArgs>): Promise<any>;
}
