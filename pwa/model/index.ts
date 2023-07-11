export type APIClasses = User | Configuration | Domain;

export type APIListResult<T> = {
  'hydra:member': ReadonlyArray<T>;
  'hydra:totalItems': number;
};
export type APISingleResult<T = object> = {
  '@id': string;
  id?: string;
} & T;

export type User = APISingleResult<{
  email: string;
  lastname: string;
  firstname: string;
  company?: string;
  password?: string;
  domains: ReadonlyArray<Domain | string>;
}>;

export type UserPasswordUpdate = APISingleResult<{
  current_password: string;
  new_password: string;
  new_password2: string;
}>;
export type UserLogin = Pick<User, 'email' | 'password'>;
export type APIToken = { token: string };

export type Configuration = APISingleResult<{
  zone: string;
  configuration: string;
  ip: string;
  domain: Domain | string;
}>;

export type Domain<T = Configuration | string> = APISingleResult<{
  dns: string;
  valid: boolean;
  owner: User | APISingleResult;
  configurations: ReadonlyArray<T>;
}>;

export type APIList<T> = {
  items: ReadonlyArray<T>;
  total: number;
};

export type GenericAPIObject<T> = Omit<T, keyof APISingleResult>;
export type UserAPI = GenericAPIObject<User>;
export type ConfigurationAPI = GenericAPIObject<Configuration>;
export type DomainAPI = GenericAPIObject<Domain>;
export type CreatableAPIResource = UserAPI | ConfigurationAPI | DomainAPI | UserPasswordUpdate;
