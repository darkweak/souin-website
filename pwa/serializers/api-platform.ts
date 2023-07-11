import { APISingleResult } from 'model';
import { SerializerInterface } from './interface';
import { RequestInterface } from 'actions/abstract';

export class APIPlatformSerializer<T extends APISingleResult> implements SerializerInterface<T> {
  serialize(o: APISingleResult<T>, rq?: RequestInterface): Promise<T> {
    o.id = o['@id'].split('/')?.[2];
    return Promise.resolve(o);
  }
  serializeMany(o: ReadonlyArray<T>, rq?: RequestInterface): Promise<ReadonlyArray<T>> {
    return Promise.all(o.map((item) => this.serialize(item, rq)));
  }
}
