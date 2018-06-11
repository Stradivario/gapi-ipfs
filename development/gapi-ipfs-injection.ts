import { InjectionToken } from "@gapi/core";
import { IPFS } from './namespace';

export const IPFS_NODE = new InjectionToken<IPFS>('gapi-ipfs-node-injection');
export const IPFS_READY = new InjectionToken<IPFS>('gapi-ipfs-ready-injection');