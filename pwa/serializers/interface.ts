import { RequestInterface } from 'actions/abstract';

type SerializerItem = object;

export interface SerializerInterface<T> {
  serialize(o: SerializerItem, rq?: RequestInterface): Promise<T>;
  serializeMany(o: ReadonlyArray<T>, rq?: RequestInterface): Promise<ReadonlyArray<T>>;
}
