import { GapiModuleWithServices } from "@gapi/core";
import { GapiIpfsConfig } from './gapi-ipfs-config';
export declare class GapiIpfsModule {
    static forRoot(config?: GapiIpfsConfig): GapiModuleWithServices;
}
export * from './gapi-ipfs-config';
export * from './gapi-ipfs-logger';
export * from './gapi-ipfs-injection';
