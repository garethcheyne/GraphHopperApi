export interface GeocodingArgs {
    key: string;
    host?: string;
    endpoint?: string;
    timeout?: number;
    locale?: string;
    query?: string;
    location_bias?: string;
    point?: string;
    debug?: boolean;
    limit?: number;
}
export declare class GraphHopperGeocoding {
    private defaults;
    private key;
    private host;
    private endpoint;
    private timeout;
    private ghUtil;
    constructor(args: GeocodingArgs, requestDefaults?: Record<string, any>);
    getParametersAsQueryString(args: GeocodingArgs): string;
    doRequest(reqArgs?: GeocodingArgs): Promise<any>;
}
