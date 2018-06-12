import { Service } from "@gapi/core";
import { Id } from "./gapi-ipfs-injection";

@Service()
export class GapiIpfsNodeInfoService {
    info: Id;

    setInfo(info: Id) {
        this.info = info;
    }

    getInfo(info: Id) {
        this.info = info;
    }
}