import Cookies from 'js-cookie';

interface Storage<T> {
  get(key: string): T;
  set(key: string, value: T): void;
  delete(key: string): void;
}

export class CookieStorage implements Storage<string> {
  get(key: string) {
    return Cookies.get(key) ?? '';
  }

  set(key: string, value: string): void {
    Cookies.set(key, value);
  }

  delete(key: string) {
    Cookies.remove(key);
  }
}

export class LocalStorage implements Storage<string> {
  get(key: string) {
    return localStorage.getItem(key) ?? '';
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  delete(key: string) {
    localStorage.removeItem(key);
  }
}

export class Token {
  key = 'token';
  storage: Storage<string>;

  constructor() {
    this.storage = new CookieStorage();
  }

  get() {
    return this.storage.get(this.key);
  }

  set(value: string) {
    this.storage.set(this.key, value);
  }

  delete() {
    this.storage.delete(this.key);
  }
}
