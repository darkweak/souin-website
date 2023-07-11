import { defaultJson, useConfiguration, useDispatchConfiguration } from 'context';
import React, { BaseSyntheticEvent, ChangeEvent, useEffect, useState } from 'react';
import { InputGuesser, InputGuesserProps, Iterable, IteratorValue, option } from '../input';
import { Form } from 'components/common/form/forms';
import { InformationalAlert } from '../popup';

const souinInternalKey = 'souin_internal_key';

const allowedHTTPOptions: ReadonlyArray<option> = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'].map((method) => ({
  name: method,
  value: method,
}));

const recursiveStateAccess = (
  key: string,
  current: Record<string, object>,
  value: object,
  iterationKey?: string
): object => {
  if (key.includes('.')) {
    // eslint-disable-next-line prefer-const
    let [k, ...nkey] = key.split('.');
    if (k === souinInternalKey) {
      k = iterationKey || '';
    }
    return {
      ...(current ?? {}),
      ...{
        [k]: recursiveStateAccess(nkey.join('.'), (current[k] ?? {}) as Record<string, object>, value, iterationKey),
      },
    };
  }

  return { ...(current ?? {}), [key]: value };
};

type iterableChangeEvent = {
  iterationKey?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const URLs: React.FC = ({ inputsTemplate, iteration, values }: any) => {
  const [keyInput, ...restInput] = inputsTemplate;
  const value = values[iteration];
  return (
    <>
      {iteration <= 0 && (
        <InformationalAlert text="This part is a little bit buggy, prefer use the JSON editor instead." />
      )}
      <div className="flex gap-x-4 w-full">
        <InputGuesser {...keyInput} defaultValue={value?.[keyInput.name]} />
        {restInput.map((input: InputGuesserProps, idx: number) => (
          <InputGuesser
            key={`${input.label}-${idx}`}
            {...input}
            onChange={(v: ChangeEvent<(HTMLInputElement | HTMLSelectElement) & iterableChangeEvent>) => {
              v.target.iterationKey = value?.key;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (input as any).onChange({ ...v });
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            defaultValue={value?.[(input as any).name]}
          />
        ))}
      </div>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CacheKeys: React.FC = ({ inputsTemplate, iteration, values }: any) => {
  const [keyInput, headersInput, ...restInput] = inputsTemplate;
  const value = values[iteration];
  return (
    <>
      {iteration <= 0 && (
        <InformationalAlert text="This part is a little bit buggy, prefer use the JSON editor instead." />
      )}
      <div className="flex gap-x-4 w-full">
        <InputGuesser {...keyInput} defaultValue={value?.[keyInput.name]} />
        <InputGuesser
          {...headersInput}
          handleChange={(options: ReadonlyArray<option>) =>
            headersInput.handleChange({ target: { iterationKey: value?.key } }, options)
          }
          selectedOptions={value?.[headersInput.name]?.map((v: string) => ({ name: v, value: v }))}
        />
      </div>
      {restInput.map((input: InputGuesserProps, idx: number) => (
        <InputGuesser
          key={`${input.label}-${idx}`}
          {...input}
          type="switch"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(v: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (v.target as any).iterationKey = value?.key;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (input as any).onChange({ ...v });
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          defaultChecked={value?.[(input as any).name]}
        />
      ))}
    </>
  );
};

export const UserFriendlyEditor: React.FC = () => {
  const configuration = useConfiguration();
  const dispatchConfiguration = useDispatchConfiguration();
  const allowedHTTPSelectedOptions = (configuration?.allowed_http_cache ?? []).map((a) => ({ name: a, value: a }));
  const [form, setForm] = useState(configuration);
  const [allowedHTTP, setAllowedHTTP] = useState<ReadonlyArray<option>>(allowedHTTPSelectedOptions);
  const updateForm = (key: string, value: object, iterationKey?: string) => {
    if (iterationKey?.includes('.')) {
      key = key.replace(iterationKey, souinInternalKey);
    }
    setForm((prevState) => {
      return recursiveStateAccess(key, prevState as Record<string, object>, value, iterationKey);
    });
  };

  useEffect(() => {
    allowedHTTP.length &&
      updateForm(
        'allowed_http_cache',
        allowedHTTP.map((o) => o.value)
      );
  }, [allowedHTTP, setForm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatchConfiguration({ type: 'update', payload: form ?? {} });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatchConfiguration, form]);

  return (
    <Form
      inputs={[
        {
          options: allowedHTTPOptions,
          selectedOptions: allowedHTTPSelectedOptions,
          type: 'select',
          isMultiple: true,
          name: 'allowed_http_cache',
          placeholder: defaultJson.allowed_http_cache?.join(', '),
          label: 'Allowed HTTP',
          handleChange: (options: ReadonlyArray<option>) => {
            setAllowedHTTP(options);
          },
        },
        {
          type: 'group',
          className: '',
          label: 'API',
          inputs: [
            {
              name: 'api.basepath',
              placeholder: defaultJson.api?.basepath,
              optional: true,
              label: 'basepath',
              defaultValue: configuration?.api?.basepath,
              onChange: ({ target: { value } }: BaseSyntheticEvent) => updateForm('api.basepath', value),
            },
            ...['Prometheus', 'Souin'].map((api) => ({
              type: 'group',
              label: api,
              inputs: [
                {
                  type: 'switch',
                  label: 'enable',
                  className: 'm-auto',
                  name: `api.${api.toLowerCase()}.enabled`,
                  defaultChecked: configuration?.api?.[api.toLowerCase() as 'souin' | 'prometheus']?.enabled,
                  onChange: ({ target: { checked } }: BaseSyntheticEvent) =>
                    updateForm(`api.${api.toLowerCase()}.enabled`, checked),
                },
                {
                  name: `api.${api}.basepath`,
                  placeholder: defaultJson.api?.[api.toLowerCase() as 'souin' | 'prometheus']?.basepath,
                  defaultValue: configuration?.api?.[api.toLowerCase() as 'souin' | 'prometheus']?.basepath,
                  optional: true,
                  label: 'basepath',
                  onChange: ({ target: { value } }: BaseSyntheticEvent) => updateForm(`api.${api}.basepath`, value),
                },
              ],
            })),
          ],
        },
        {
          name: 'cache_name',
          placeholder: defaultJson.cache_name,
          defaultValue: configuration?.cache_name,
          optional: true,
          label: 'Cache name',
          onChange: ({ target: { value } }: BaseSyntheticEvent) => updateForm('cache_name', value),
        },
        {
          name: 'default_cache_control',
          placeholder: defaultJson.default_cache_control,
          defaultValue: configuration?.default_cache_control,
          optional: true,
          label: 'Default Cache-Control header',
          onChange: ({ target: { value } }: BaseSyntheticEvent) => updateForm('default_cache_control', value),
        },
        {
          type: 'switch',
          label: 'distributed',
          defaultChecked: configuration?.distributed,
          className: '',
          name: 'distributed',
          onChange: ({ target: { checked } }: BaseSyntheticEvent) => updateForm('distributed', checked),
        },
        {
          type: 'group',
          className: '',
          label: 'Regex',
          inputs: [
            {
              name: 'regex.exclude',
              placeholder: defaultJson.regex?.exclude,
              defaultValue: configuration?.regex?.exclude,
              optional: true,
              label: 'exclude',
              onChange: ({ target: { value } }: BaseSyntheticEvent) => updateForm('regex.exclude', value),
            },
          ],
        },
        {
          name: 'stale',
          placeholder: defaultJson.stale,
          defaultValue: configuration?.stale,
          optional: true,
          label: 'Stale duration',
          onChange: ({ target: { value } }: BaseSyntheticEvent) => updateForm('stale', value),
        },
        {
          type: 'group',
          label: 'Timeout',
          inputs: [
            {
              name: 'timeout.backend',
              placeholder: defaultJson.timeout?.backend,
              defaultValue: configuration?.timeout?.backend,
              optional: true,
              label: 'backend',
              onChange: ({ target: { value } }: BaseSyntheticEvent) => updateForm('timeout.backend', value),
            },
            {
              name: 'timeout.cache',
              placeholder: defaultJson.timeout?.cache,
              defaultValue: configuration?.timeout?.cache,
              optional: true,
              label: 'cache',
              onChange: ({ target: { value } }: BaseSyntheticEvent) => updateForm('timeout.cache', value),
            },
          ],
        },
        {
          name: 'ttl',
          placeholder: defaultJson.ttl,
          defaultValue: configuration?.ttl,
          optional: true,
          label: 'Time-to-live duration',
          onChange: ({ target: { value } }: BaseSyntheticEvent) => updateForm('ttl', value),
        },
        {
          type: 'iterator',
          label: 'URLs',
          name: 'urls',
          className: 'flex flex-wrap gap-x-12 gap-y-4 pb-4',
          inputsTemplate: [
            {
              name: 'key',
              placeholder: '.*\\.css',
              label: 'URL pattern to match',
              onChange: ({ target: { iteration, value } }: BaseSyntheticEvent) =>
                updateForm(`urls.${iteration}.key`, value),
            },
            {
              name: 'ttl',
              placeholder: defaultJson.ttl,
              optional: true,
              label: 'time-to-live duration',
              onChange: ({ target: { iterationKey, value } }: BaseSyntheticEvent) =>
                updateForm(`urls.${iterationKey}.ttl`, value),
            },
            {
              name: 'default_cache_control',
              placeholder: defaultJson.default_cache_control,
              optional: true,
              label: 'default Cache-Control header',
              onChange: ({ target: { iterationKey, value } }: BaseSyntheticEvent) =>
                updateForm(`urls.${iterationKey}.default_cache_control`, value),
            },
          ] as ReadonlyArray<InputGuesserProps>,
          Template: URLs,
          values: Object.entries(configuration?.urls ?? {}).map(
            ([key, values]) =>
              ({
                key,
                ...values,
              } as IteratorValue)
          ),
        } as Iterable,
        {
          type: 'iterator',
          label: 'Cache Keys',
          name: 'cache_keys',
          className: 'flex flex-wrap gap-x-12 gap-y-4 pb-4',
          inputsTemplate: [
            {
              name: 'key',
              placeholder: '.*\\.css',
              className: 'w-full',
              label: 'URL pattern to match',
              onChange: ({ target: { iteration, value } }: BaseSyntheticEvent) =>
                updateForm(`cache_keys.${iteration}.key`, value),
            },
            {
              name: 'headers',
              className: 'w-full relative',
              placeholder: 'Cache-Control, Authorization',
              optional: true,
              isMultiple: true,
              dynamic: true,
              options: [],
              type: 'select',
              label: 'Headers to match',
              handleChange: ({ target: { iterationKey } }: BaseSyntheticEvent, values: ReadonlyArray<option>) =>
                updateForm(
                  `cache_keys.${iterationKey}.headers`,
                  values.map((v) => v.value),
                  iterationKey
                ),
            },
            {
              type: 'switch',
              label: 'Disable body',
              className: '',
              name: 'disable_body',
              onChange: ({ target: { iterationKey, checked } }: BaseSyntheticEvent) =>
                updateForm(`cache_keys.${iterationKey}.disable_body`, checked, iterationKey),
            },
            {
              type: 'switch',
              label: 'Disable host',
              className: '',
              name: 'disable_host',
              onChange: ({ target: { iterationKey, checked } }: BaseSyntheticEvent) =>
                updateForm(`cache_keys.${iterationKey}.disable_host`, checked, iterationKey),
            },
            {
              type: 'switch',
              label: 'Disable method',
              className: '',
              name: 'disable_method',
              onChange: ({ target: { iterationKey, checked } }: BaseSyntheticEvent) =>
                updateForm(`cache_keys.${iterationKey}.disable_method`, checked, iterationKey),
            },
            {
              type: 'switch',
              label: 'Disable query',
              className: '',
              name: 'disable_query',
              onChange: ({ target: { iterationKey, checked } }: BaseSyntheticEvent) =>
                updateForm(`cache_keys.${iterationKey}.disable_query`, checked, iterationKey),
            },
            {
              type: 'switch',
              label: 'Hide key',
              className: '',
              name: 'hide',
              onChange: ({ target: { iterationKey, checked } }: BaseSyntheticEvent) =>
                updateForm(`cache_keys.${iterationKey}.hide`, checked, iterationKey),
            },
          ] as ReadonlyArray<InputGuesserProps>,
          Template: CacheKeys,
          values: Object.entries(configuration?.cache_keys ?? {}).map(
            ([key, values]) =>
              ({
                key,
                ...values,
              } as IteratorValue)
          ),
        } as Iterable,
      ]}
    />
  );
};
