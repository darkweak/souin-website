import { APIToken, User as UserModel, UserAPI, UserLogin, UserPasswordUpdate } from 'model';
import { APIPlatform } from './abstract';
import { SerializerInterface, UserSerializer } from 'serializers';
import { AxiosResponse } from 'axios';
import { Token } from 'storage';

type UserFromToken = {
  user_id: string;
  roles: ReadonlyArray<string>;
  username: string;
};

const getUserFromToken = (): UserFromToken | undefined => {
  const token = new Token().get();

  if (token) {
    try {
      return JSON.parse(atob(token.split('.')[1] ?? ''));
    } catch {
      return;
    }
  }

  return;
};

export class User extends APIPlatform<UserModel, UserAPI> {
  endpoint = '/users';
  protected serializer: SerializerInterface<UserModel> = new UserSerializer();

  getCurrentUser() {
    return this.getOne({ id: getUserFromToken()?.user_id } as UserModel);
  }
}

export class Auth extends User {
  endpoint = '/auth';

  login(data: UserLogin): Promise<boolean> {
    const tokenInstance = new Token();
    tokenInstance.delete();
    return this.postRequest({ data }).then(({ data: { token } }: AxiosResponse<APIToken>) => {
      tokenInstance.set(token);

      return true;
    });
  }
}

export class PasswordUpdater extends APIPlatform<UserPasswordUpdate, UserPasswordUpdate> {
  endpoint = '/update-password';

  patch(data: UserPasswordUpdate): Promise<boolean> {
    return this.patchRequest({ data }).then(({ status }: AxiosResponse) => status === 204);
  }
}

export class Activation extends User {
  endpoint = '/activation';

  activate(data: { email: string; token: string }) {
    return this.postRequest({ data });
  }
}
