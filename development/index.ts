import { GapiModule, GapiModuleWithServices } from "@gapi/core";
import { GapiIpfsConfig } from './gapi-ipfs-config';
import { GapiIpfsLogger } from './gapi-ipfs-logger';
import { IPFS, IPFS_NODE_READY, Options } from "./gapi-ipfs-injection";
import { Subject } from "rxjs";
import { GapiIpfsNodeInfoService } from "./gapi-ipfs-node-info";
const Ipfs = require('ipfs');

@GapiModule({
    services: [GapiIpfsConfig]
})
export class GapiIpfsModule {
    static forRoot(config?: GapiIpfsConfig): GapiModuleWithServices {
        return {
            gapiModule: GapiIpfsModule,
            services: [
                { provide: IPFS_NODE_READY, useValue: new Subject() },
                { provide: GapiIpfsConfig, useValue: config || {} },
                {
                    provide: IPFS,
                    deps: [GapiIpfsLogger, GapiIpfsConfig, IPFS_NODE_READY, GapiIpfsNodeInfoService],
                    useFactory: (
                        logger: GapiIpfsLogger,
                        config: GapiIpfsConfig,
                        nodeReady: Subject<boolean>,
                        nodeInfoService: GapiIpfsNodeInfoService
                    ) => {
                        const ipfs: IPFS = new Ipfs(config);
                        ipfs.on('ready', async () => {
                            const nodeInfo = (await ipfs.id());
                            nodeInfoService.setInfo(nodeInfo);
                            logger.log('Ipfs node state: Online');
                            logger.log(`Ipfs node info: ${JSON.stringify(nodeInfo)}`);
                            nodeReady.next(true);
                        });
                        ipfs.on('error', () => {
                            logger.err('Ipfs node error!\nIpfs node state: Offline');
                        });
                        return ipfs;
                    }
                },
            ]
        };
    }
}

export * from './gapi-ipfs-config';
export * from './gapi-ipfs-logger';
export * from './gapi-ipfs-injection';