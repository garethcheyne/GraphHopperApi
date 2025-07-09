export interface GraphHopperOptimizationArgs {
    key: string;
    host?: string;
    endpoint?: string;
    timeout?: number;
    waitInMillis?: number;
    postTimeout?: number;
}
export declare class GraphHopperOptimization {
    private key;
    private host;
    private endpoint;
    private timeout;
    private waitInMillis;
    private postTimeout;
    private ghUtil;
    constructor(args: GraphHopperOptimizationArgs);
    doVRPRequest(points: number[][], vehicles: number): Promise<any>;
    doRawRequest(jsonInput: any): Promise<any>;
    private pollSolution;
    doRequest(jsonInput: any): Promise<any>;
}
