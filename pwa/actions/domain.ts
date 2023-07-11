import { Domain as DomainModel, DomainAPI } from 'model';
import { APIPlatform } from './abstract';
import { DomainSerializer, SerializerInterface } from 'serializers';

export class Domain extends APIPlatform<DomainModel, DomainAPI> {
  endpoint = '/domains';
  protected serializer: SerializerInterface<DomainModel> = new DomainSerializer();
}
