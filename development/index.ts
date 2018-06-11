import { GapiModule, GapiModuleWithServices } from "@gapi/core";
import { GapiIpfsConfig } from './gapi-ipfs-config';
import { IPFS, Options } from './namespace';
import { GapiIpfsLogger } from './gapi-ipfs-logger';
import { IPFS_NODE, IPFS_READY } from "./gapi-ipfs-injection";
import { Subject } from "rxjs";

const Ipfs = require('ipfs');

@GapiModule({
    services: [GapiIpfsConfig]
})
export class GapiIpfsModule {
    static forRoot(config?: GapiIpfsConfig): GapiModuleWithServices {
        return {
            gapiModule: GapiIpfsModule,
            services: [
                { provide: IPFS_READY, useValue: new Subject() },
                { provide: GapiIpfsConfig, useValue: config || {} },
                {
                    provide: IPFS_NODE,
                    deps: [GapiIpfsLogger, GapiIpfsConfig, IPFS_READY],
                    useFactory: (
                        logger: GapiIpfsLogger,
                        config: GapiIpfsConfig,
                        nodeReady: Subject<boolean>
                    ) => {
                        const node: IPFS = new Ipfs(config);
                        node.on('ready', () => {
                            logger.log('Ipfs node state: Online');
                            nodeReady.next(true);
                        });
                        node.on('error', () => {
                            logger.err('Ipfs node error!');
                            logger.err('Ipfs node state: Offline');
                        });
                        return node;
                    }
                },
            ]
        };
    }
}

export * from './gapi-ipfs-config';
export * from './gapi-ipfs-logger';
export * from './gapi-ipfs-injection';