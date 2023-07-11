import { APISingleResult, Domain, Configuration as ConfigurationModel } from 'model';
import { APIPlatformSerializer } from './api-platform';
// Need to import from actions/configuration to avoid circular references
import { Configuration } from 'actions/configuration';
import { RequestInterface } from 'actions/abstract';

export class DomainSerializer extends APIPlatformSerializer<Domain> {
  serialize(o: APISingleResult<Domain>, rq?: RequestInterface): Promise<Domain> {
    return super.serialize(o).then((domain) => {
      if ((rq?.depth ?? 0) > 0) {
        return Promise.all(
          (domain.configurations as ReadonlyArray<string>).map((c) => {
            return new Configuration().getOne({
              ...rq,
              depth: (rq?.depth ?? 0) - 1,
              id: `${(c as string).split('/')[2]}`,
            } as unknown as ConfigurationModel);
          })
        ).then((configurations) => {
          domain.configurations = (configurations as ReadonlyArray<ConfigurationModel>) ?? [];

          return domain;
        });
      }

      return domain;
    });
  }
}
