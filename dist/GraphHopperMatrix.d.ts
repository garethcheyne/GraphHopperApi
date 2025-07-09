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
export declare class GraphHopperMatrix {
    private defaults;
    private key;
    private host;
    private endpoint;
    private timeout;
    private ghUtil;
    constructor(args: GraphHopperMatrixArgs, requestDefaults?: Record<string, any>);
    doRequest(reqArgs: Partial<GraphHopperMatrixArgs>): Promise<any>;
    toHtmlTable(request: any, doubleArray: any[][]): string;
}
