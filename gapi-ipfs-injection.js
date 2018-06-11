"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@gapi/core");
class Options {
}
exports.Options = Options;
class InitOptions {
}
exports.InitOptions = InitOptions;
class Multiaddr {
}
exports.Multiaddr = Multiaddr;
class Types {
}
exports.Types = Types;
class Version {
}
exports.Version = Version;
class Id {
}
exports.Id = Id;
class IPFSFile {
}
exports.IPFSFile = IPFSFile;
class PeersOptions {
}
exports.PeersOptions = PeersOptions;
class Peer {
}
exports.Peer = Peer;
class ObjectStat {
}
exports.ObjectStat = ObjectStat;
class PutObjectOptions {
}
exports.PutObjectOptions = PutObjectOptions;
class GetObjectOptions {
}
exports.GetObjectOptions = GetObjectOptions;
exports.IPFS = new core_1.InjectionToken('gapi-ipfs-node-injection');
exports.IPFS_NODE_READY = new core_1.InjectionToken('gapi-ipfs-ready-injection');
