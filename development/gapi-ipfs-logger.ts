import { Service, Inject } from "@gapi/core";
import { GapiIpfsConfig } from './gapi-ipfs-config';
import { IPFS } from './namespace';

@Service()
export class GapiIpfsLogger {

    constructor(
        private config: GapiIpfsConfig
    ) {}

    log(message) {
        if (this.config.logging) {
            console.log(message);
        }
    }

    err(message) {
        if (this.config.logging) {
            console.error(message);
        }
    }
}