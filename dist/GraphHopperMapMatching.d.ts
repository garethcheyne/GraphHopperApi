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
export declare class GraphHopperMapMatching {
    private defaults;
    private key;
    private host;
    private endpoint;
    private timeout;
    private ghUtil;
    constructor(args: GraphHopperMapMatchingArgs, requestDefaults?: Record<string, any>);
    getParametersAsQueryString(args: GraphHopperMapMatchingArgs): string;
    doRequest(content: any, reqArgs?: Partial<GraphHopperMapMatchingArgs>): Promise<any>;
}
