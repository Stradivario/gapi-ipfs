"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const ipfs_config_1 = require("./ipfs-config");
const ipfs_logger_1 = require("./ipfs-logger");
const ipfs_injection_1 = require("./ipfs-injection");
const rxjs_1 = require("rxjs");
const ipfs_node_info_1 = require("./ipfs-node-info");
const Ipfs = require("ipfs");
let IpfsModule = IpfsModule_1 = class IpfsModule {
    static forRoot(config) {
        return {
            module: IpfsModule_1,
            services: [
                { provide: ipfs_injection_1.IPFS_NODE_READY, useValue: new rxjs_1.Subject() },
                { provide: ipfs_config_1.GapiIpfsConfig, useValue: config || {} },
                {
                    provide: ipfs_injection_1.IPFS,
                    deps: [ipfs_logger_1.GapiIpfsLogger, ipfs_config_1.GapiIpfsConfig, ipfs_injection_1.IPFS_NODE_READY, ipfs_node_info_1.GapiIpfsNodeInfoService, core_1.ExitHandlerService],
                    lazy: true,
                    useFactory: (logger, config, nodeReady, nodeInfoService, exitHandlerService) => {
                        return rxjs_1.Observable.create(o => {
                            const node = new Ipfs(config);
                            exitHandlerService.errorHandler.subscribe(e => {
                                node.stop(() => {
                                    console.log('Ipfs node stopped');
                                });
                            });
                            node.on('ready', () => __awaiter(this, void 0, void 0, function* () {
                                logger.log('Ipfs node state: Online');
                                nodeReady.next(true);
                                o.next(node);
                                const nodeInfo = (yield node.id());
                                nodeInfoService.setInfo(nodeInfo);
                                logger.log(`Ipfs node info: ${nodeInfo}`);
                            }));
                            node.on('error', () => {
                                logger.err('Ipfs node error!');
                                node.stop(() => {
                                    throw new Error('Ipfs node state: Offline');
                                });
                            });
                        });
                    }
                },
            ]
        };
    }
};
IpfsModule = IpfsModule_1 = __decorate([
    core_1.Module({
        services: [ipfs_config_1.GapiIpfsConfig]
    })
], IpfsModule);
exports.IpfsModule = IpfsModule;
__export(require("./ipfs-config"));
__export(require("./ipfs-logger"));
__export(require("./ipfs-injection"));
var IpfsModule_1;
