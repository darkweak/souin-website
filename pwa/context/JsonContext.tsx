import { Configuration } from 'actions';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { JsonSchema, Key } from 'types/configuration';

export const defaultJson: JsonSchema = {
  allowed_http_cache: ['GET', 'HEAD'],
  api: {
    basepath: '/souin-api',
    prometheus: {
      enabled: true,
      basepath: '/prometheus',
    },
    souin: {
      basepath: '/souin',
    },
  },
  cache_keys: {
    '.*.css': {
      disable_body: true,
      disable_host: true,
      disable_method: true,
      disable_query: true,
      headers: ['Authorization', 'Content-Type'],
      hide: true,
    },
  },
  cache_name: 'Souin',
  default_cache_control: 'public, s-maxage=86400',
  distributed: true,
  max_cachable_body_bytes: 0,
  mode: 'strict',
  regex: { exclude: 'url_regex_to_exclude.+' },
  stale: '1d',
  timeout: {
    backend: '10s',
    cache: '10ms',
  },
  ttl: '120s',
};

type jsonContextType = {
  json?: JsonSchema;
  dispatch: React.Dispatch<JsonFormAction>;
};

const initialState: JsonSchema = {};

const JsonContext = createContext<jsonContextType>({
  json: undefined,
  dispatch: () => undefined,
});

type JsonFormAction = {
  type: 'update';
  payload: JsonSchema;
};

const reducer = (
  state: JsonSchema = initialState,
  { type, payload }: JsonFormAction,
) => {
  switch (type) {
    case 'update':
      if (!payload) {
        return undefined;
      }

      if (payload.cache_keys) {
        payload.cache_keys = Object.entries(payload.cache_keys).reduce(
          (acc, [currentPrevKey, current]) => {
            acc[currentPrevKey] = current;
            if (current.key) {
              delete acc[currentPrevKey as string];
              acc[current.key ?? ''] = { ...current };
            }
            return acc;
          },
          {} as Record<string, Key & { key?: string }>,
        );
      }
      return {
        ...state,
        ...payload,
      };
  }
  return state;
};

type JsonContextProps = {
  json?: JsonSchema;
  configurationId: string;
};

export const JsonProvider: React.FC<
  React.PropsWithChildren<JsonContextProps>
> = ({ configurationId, json = defaultJson, children }) => {
  const [jsonState, dispatch] = useReducer(reducer, json);
  useEffect(() => {
    new Configuration().update(configurationId, {
      configuration: JSON.stringify(jsonState),
    });
  }, [configurationId, jsonState]);

  return (
    <JsonContext.Provider value={{ json: jsonState, dispatch }}>
      {children}
    </JsonContext.Provider>
  );
};

export const useDispatchConfiguration = () => {
  const { dispatch } = useContext(JsonContext);
  return dispatch;
};

export const useConfiguration = () => {
  const { json } = useContext(JsonContext);
  return json;
};
