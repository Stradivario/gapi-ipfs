import { ModuleWithServices } from "@rxdi/core";
import { GapiIpfsConfig } from './ipfs-config';
export declare class IpfsModule {
    static forRoot(config?: GapiIpfsConfig): ModuleWithServices;
}
export * from './ipfs-config';
export * from './ipfs-logger';
export * from './ipfs-injection';
