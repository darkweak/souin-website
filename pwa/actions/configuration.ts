import { Configuration as ConfigurationModel, ConfigurationAPI } from 'model';
import { APIPlatform } from './abstract';
import { ConfigurationSerializer, SerializerInterface } from 'serializers';

export class Configuration extends APIPlatform<ConfigurationModel, ConfigurationAPI> {
  endpoint = '/configurations';
  protected serializer: SerializerInterface<ConfigurationModel> = new ConfigurationSerializer();
}
