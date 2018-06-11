"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
let GapiIpfsModule = GapiIpfsModule_1 = class GapiIpfsModule {
    static forRoot(config) {
        return {
            gapiModule: GapiIpfsModule_1,
            services: [
                { provide: gapi_ipfs_injection_1.IPFS_NODE_READY, useValue: new rxjs_1.Subject() },
                { provide: gapi_ipfs_config_1.GapiIpfsConfig, useValue: config || {} },
                {
                    provide: gapi_ipfs_injection_1.IPFS,
                    deps: [gapi_ipfs_logger_1.GapiIpfsLogger, gapi_ipfs_config_1.GapiIpfsConfig, gapi_ipfs_injection_1.IPFS_NODE_READY],
                    useFactory: (logger, config, nodeReady) => {
                        const Ipfs = require('ipfs');
                        const node = new Ipfs(config);
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
