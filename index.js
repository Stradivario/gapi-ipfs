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
const core_1 = require("@gapi/core");
const gapi_ipfs_config_1 = require("./gapi-ipfs-config");
const gapi_ipfs_logger_1 = require("./gapi-ipfs-logger");
const gapi_ipfs_injection_1 = require("./gapi-ipfs-injection");
const rxjs_1 = require("rxjs");
const gapi_ipfs_node_info_1 = require("./gapi-ipfs-node-info");
let GapiIpfsModule = GapiIpfsModule_1 = class GapiIpfsModule {
    static forRoot(config) {
        return {
            gapiModule: GapiIpfsModule_1,
            services: [
                { provide: gapi_ipfs_injection_1.IPFS_NODE_READY, useValue: new rxjs_1.Subject() },
                { provide: gapi_ipfs_config_1.GapiIpfsConfig, useValue: config || {} },
                {
                    provide: gapi_ipfs_injection_1.IPFS,
                    deps: [gapi_ipfs_logger_1.GapiIpfsLogger, gapi_ipfs_config_1.GapiIpfsConfig, gapi_ipfs_injection_1.IPFS_NODE_READY, gapi_ipfs_node_info_1.GapiIpfsNodeInfoService],
                    useFactory: (logger, config, nodeReady, nodeInfoService) => {
                        const Ipfs = require('ipfs');
                        const node = new Ipfs(config);
                        node.on('ready', () => __awaiter(this, void 0, void 0, function* () {
                            logger.log('Ipfs node state: Online');
                            nodeReady.next(true);
                            const nodeInfo = (yield node.id());
                            nodeInfoService.setInfo(nodeInfo);
                            logger.log(`Ipfs node info: ${nodeInfo}`);
                        }));
                        node.on('error', () => {
                            logger.err('Ipfs node error!');
                            throw new Error('Ipfs node state: Offline');
                        });
                        return node;
                    }
                },
            ]
        };
    }
};
GapiIpfsModule = GapiIpfsModule_1 = __decorate([
    core_1.GapiModule({
        services: [gapi_ipfs_config_1.GapiIpfsConfig]
    })
], GapiIpfsModule);
exports.GapiIpfsModule = GapiIpfsModule;
__export(require("./gapi-ipfs-config"));
__export(require("./gapi-ipfs-logger"));
__export(require("./gapi-ipfs-injection"));
var GapiIpfsModule_1;
