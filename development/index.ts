import { GapiModule, GapiModuleWithServices } from "@gapi/core";
import { GapiIpfsConfig } from './gapi-ipfs-config';
import { GapiIpfsLogger } from './gapi-ipfs-logger';
import { IPFS, IPFS_NODE_READY, Options } from "./gapi-ipfs-injection";
import { Subject } from "rxjs";
import { GapiIpfsNodeInfoService } from "./gapi-ipfs-node-info";
import Ipfs = require('ipfs');

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

                        const node: IPFS = new Ipfs(config);
                        node.on('ready', async () => {
                            logger.log('Ipfs node state: Online');
                            nodeReady.next(true);
                            const nodeInfo = (await node.id());
                            nodeInfoService.setInfo(nodeInfo);
                            logger.log(`Ipfs node info: ${nodeInfo}`);
                        });
                        node.on('error', () => {
                            logger.err('Ipfs node error!');
                            throw new Error('Ipfs node state: Offline')
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