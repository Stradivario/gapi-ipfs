# @Gapi Ipfs InterPlanetary File System Module (Beta)

##### More information about IPFS system can be find here [IPFS-WIKI](https://en.wikipedia.org/wiki/InterPlanetary_File_System)
##### For questions/issues you can write ticket [here](http://gitlab.youvolio.com/gapi/gapi-ipfs/issues)
##### This module is intended to be used with [GAPI](https://github.com/Stradivario/gapi)

@gapi/ipfs hello world ipfs address:

https://ipfs.io/ipfs/QmPhYdx4dB6TwBU1KEbYmyET7HQJoLpyERvRD4kMWv3B3a

## Installation and basic examples:
##### To install this Gapi module, run:

```bash
$ npm install @gapi/ipfs --save
```

## Consuming @gapi/ipfs

Without configuration

##### Import inside AppModule or CoreModule
```typescript

import { GapiModule } from '@gapi/core';
import { GapiIpfsModule } from '@gapi/ipfs';

@GapiModule({
    imports: [
        GapiIpfsModule.forRoot({
            repo: '/home/user/Desktop/ipfs-test',
            init: true,
            start: true,
            logging: true,
            config: {
                Addresses: {
                    API: '/ip4/127.0.0.1/tcp/5001',
                    Announce: [],
                    Gateway: '/ip4/127.0.0.1/tcp/8080',
                    NoAnnounce: [],
                    Swarm: [
                        '/ip4/0.0.0.0/tcp/4001',
                        '/ip6/::/tcp/4001'
                    ]
                },
            }
        }),
    ]
})
export class CoreModule { }

```

Interact with Ipfs

note: keep in mind that this is beta testing contribution is appreciated

```typescript
import { Inject, Service } from '@gapi/core';
import { IPFS_NODE_READY, IPFS } from '@gapi/ipfs';
import { Readable } from 'stream';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Service()
export class IpfsTestService {

    constructor(
        @Inject(IPFS) private ipfs: IPFS,
        @Inject(IPFS_NODE_READY) private ipfsNodeReady: Subject<boolean>
    ) {
        this.ipfsNodeReady
            .switchMap(
                () => Observable.fromPromise(this.ipfsTest())
            )
            .subscribe();

        // Later rxjs 6 will be used as follow (gapi will migrate to rxjs 6)

        // import { fromPromise } from 'rxjs';
        // import { switchMap } from 'rxjs/operators';
        // this.ipfsReady.pipe(
        //     switchMap(() => fromPromise(this.ipfsTest()))
        // ).subscribe();

    }

    async ipfsTest() {
        const content = new Readable();
        content.push('Hello world from @gapi/ipfs module');
        content.push(null);

        const file = await this.ipfs.files.add([
            { path: '/gapi-test-file.txt', content }
        ]);

        const catContentInsideIpfsNode = (await this.ipfs.files.cat(file[0].hash)).toString();
        // Cat content of file
        console.log(catContentInsideIpfsNode);

        // Will print 'Hello world from @gapi/ipfs module'

        // Get file based on hash
        // file[0].hash 'QmPhYdx4dB6TwBU1KEbYmyET7HQJoLpyERvRD4kMWv3B3a'
        const fileInsideIpfsNode = await this.ipfs.files.get(file[0].hash);

        // Print content of file
        console.log(fileInsideIpfsNode[0].content.toString());

        // will print 'Hello world from @gapi/ipfs module'

        return await Promise.resolve();
    }

}

```

TODO: Better documentation...

Enjoy ! :)
