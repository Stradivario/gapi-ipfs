import { Options } from './ipfs-injection';
import { Service } from '@rxdi/core';

@Service()
export class GapiIpfsConfig extends Options {
    logging?: boolean;
}