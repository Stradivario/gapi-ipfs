import { Module, ModuleWithServices, ExitHandlerService } from "@rxdi/core";
import { GapiIpfsConfig } from './ipfs-config';
import { GapiIpfsLogger } from './ipfs-logger';
import { IPFS, IPFS_NODE_READY, Options } from "./ipfs-injection";
import { Observable, Subject } from "rxjs";
import { GapiIpfsNodeInfoService } from "./ipfs-node-info";
import Ipfs = require('ipfs');

@Module({
    services: [GapiIpfsConfig]
})
export class IpfsModule {
    static forRoot(config?: GapiIpfsConfig): ModuleWithServices {
        return {
            module: IpfsModule,
            services: [
                { provide: IPFS_NODE_READY, useValue: new Subject() },
                { provide: GapiIpfsConfig, useValue: config || {} },
                {
                    provide: IPFS,
                    deps: [GapiIpfsLogger, GapiIpfsConfig, IPFS_NODE_READY, GapiIpfsNodeInfoService, ExitHandlerService],
                    lazy: true,
                    useFactory: (
                        logger: GapiIpfsLogger,
                        config: GapiIpfsConfig,
                        nodeReady: Subject<boolean>,
                        nodeInfoService: GapiIpfsNodeInfoService,
                        exitHandlerService: ExitHandlerService
                    ) => {
                        return Observable.create(o => {
                            const node: IPFS = new Ipfs(config);
                            exitHandlerService.errorHandler.subscribe(e => {
                                node.stop(() => {
                                    console.log('Ipfs node stopped');
                                });
                            });
                            node.on('ready', async () => {
                                logger.log('Ipfs node state: Online');
                                nodeReady.next(true);
                                o.next(node);
                                const nodeInfo = (await node.id());
                                nodeInfoService.setInfo(nodeInfo);
                                logger.log(`Ipfs node info: ${nodeInfo}`);
                            });
                            node.on('error', (e) => {
                                logger.err(`
                                Ipfs node error!
                                ${JSON.stringify(e)}
                                `);
                                node.stop(() => {
                                    throw new Error('Ipfs node state: Offline')
                                });
                            });
                        });
                    }
                },
            ]
        };
    }
}

export * from './ipfs-config';
export * from './ipfs-logger';
export * from './ipfs-injection';