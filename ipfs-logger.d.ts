import { GapiIpfsConfig } from './ipfs-config';
export declare class GapiIpfsLogger {
    private config;
    constructor(config: GapiIpfsConfig);
    log(message: any): void;
    err(message: any): void;
}
