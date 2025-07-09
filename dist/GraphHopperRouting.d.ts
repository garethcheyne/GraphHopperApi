export interface GraphHopperRoutingArgs {
    key: string;
    host?: string;
    endpoint?: string;
    timeout?: number;
    profile?: string;
    debug?: boolean;
    locale?: string;
    points_encoded?: boolean;
    instructions?: boolean;
    elevation?: boolean;
    optimize?: string;
    turn_sign_map?: Record<string | number, string>;
}
export declare class GraphHopperRouting {
    private defaults;
    private key;
    private host;
    private endpoint;
    private timeout;
    private turn_sign_map;
    private ghUtil;
    constructor(args: GraphHopperRoutingArgs, requestDefaults?: Record<string, any>);
    doRequest(reqArgs: Partial<GraphHopperRoutingArgs>): Promise<any>;
    info(): Promise<any>;
    i18n(args?: {
        locale?: string;
    }): Promise<any>;
    getTurnText(sign: string | number): string;
}
