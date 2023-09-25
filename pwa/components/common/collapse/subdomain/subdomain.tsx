import { InputBase } from 'components/common/input';
import React, { useRef, useState } from 'react';
import { BaseButton, OutlinedButton } from 'components/common/button';
import { usePushToast } from 'context';
import { Blur } from 'components/common/block';
import Link from 'next/link';
import {
  ConfigurationAPI,
  Configuration as ConfigurationModel,
  Domain,
} from 'model';
import { Configuration } from 'actions';

export type subdomainProps = ConfigurationModel & {
  iteration: number;
  domain: string;
  domainIteration: number;
  setDomains: React.Dispatch<
    React.SetStateAction<readonly Domain<ConfigurationModel>[]>
  >;
  setIteration: React.Dispatch<React.SetStateAction<number>>;
};
export const Subdomain: React.FC<subdomainProps> = ({
  iteration: configurationIteration,
  domain,
  domainIteration,
  id,
  zone,
  ip,
  setDomains,
  setIteration,
}) => {
  const pushToast = usePushToast();
  const [validationPopup, setValidationPopup] = useState(false);
  const [updated, setUpdated] = useState(false);
  const formRef = useRef(null);

  return (
    <form
      className="flex gap-x-8 justify-between items-center w-full flex-wrap md:flex-nowrap gap-y-4"
      onSubmit={ev => ev.preventDefault()}
      ref={formRef}
    >
      <InputBase
        label="zone"
        name="zone"
        className="w-full"
        defaultValue={zone}
        onChange={() => setUpdated(true)}
      />
      <InputBase
        label="DNS or IP to proxy to"
        name="ip"
        className="w-full"
        defaultValue={ip}
        onChange={() => setUpdated(true)}
      />
      <div className="flex gap-x-4 items-center mt-auto">
        {id && (
          <Link href="/configurations/[id]" as={`configurations/${id}`}>
            <OutlinedButton
              text="Edit configuration"
              className="flex-nowrap whitespace-nowrap"
            />
          </Link>
        )}
        <OutlinedButton
          variant="danger"
          icon="trash"
          onClick={() => {
            if (!id) {
              setIteration(iteration => iteration - 1);
              return;
            }

            setValidationPopup(true);
          }}
        />
        {validationPopup && (
          <Blur className="absolute w-full left-0 top-0 h-full flex flex-col items-center justify-center gap-y-20">
            <h1 className="text-2xl font-bold">
              Do you really want to delete the zone {zone} ?
            </h1>
            <div className="flex gap-x-80">
              <OutlinedButton
                text="cancel"
                variant="danger"
                onClick={() => setValidationPopup(false)}
              />
              <BaseButton
                text="Delete"
                variant="danger"
                onClick={() => {
                  new Configuration().delete(id ?? '').then(() => {
                    pushToast({
                      text: `Your zone ${zone} has been deleted!`,
                      variant: 'success',
                    });
                    setDomains(prevDomains => {
                      const currentDomain = prevDomains[domainIteration];
                      currentDomain.configurations = [
                        ...currentDomain.configurations.slice(
                          0,
                          configurationIteration,
                        ),
                        ...currentDomain.configurations.slice(
                          configurationIteration + 1,
                        ),
                      ] as ReadonlyArray<ConfigurationModel>;

                      setIteration(iteration => iteration - 1);
                      return [
                        ...prevDomains.slice(0, domainIteration),
                        currentDomain,
                        ...(prevDomains.slice(domainIteration + 1) ?? []),
                      ];
                    });
                  });
                }}
              />
            </div>
          </Blur>
        )}
        {updated && (
          <OutlinedButton
            icon="save"
            onClick={() => {
              if (!formRef.current) {
                pushToast({
                  variant: 'warning',
                  text: 'Cannot retrieve the current values',
                });
                return;
              }

              const configurationApi = new Configuration();
              const fd = new FormData(formRef.current);
              const data = { domain };
              let apiRequest;
              if (!id) {
                apiRequest = configurationApi
                  .create({
                    ...data,
                    configuration: '{}',
                    ...Object.fromEntries(fd),
                  } as ConfigurationAPI)
                  .then(res => {
                    pushToast({
                      text: `Your zone ${zone} has been created!`,
                      variant: 'success',
                    });
                    return res;
                  });
              } else {
                apiRequest = configurationApi
                  .update(id, {
                    ...data,
                    ...Object.fromEntries(fd),
                  } as ConfigurationModel)
                  .then(res => {
                    pushToast({
                      text: `Your changes on the zone ${zone} has been saved!`,
                      variant: 'success',
                    });
                    return res;
                  });
              }

              apiRequest.then(configuration => {
                setDomains(prevDomains => {
                  const currentDomain = prevDomains[domainIteration];
                  currentDomain.configurations = [
                    ...currentDomain.configurations.slice(
                      0,
                      configurationIteration,
                    ),
                    configuration,
                    ...(configurationIteration + 1 >
                    prevDomains[domainIteration].configurations.length
                      ? currentDomain.configurations.slice(
                          configurationIteration + 1,
                        )
                      : []),
                  ] as ReadonlyArray<ConfigurationModel>;
                  return [
                    ...prevDomains.slice(0, domainIteration),
                    currentDomain,
                    ...(prevDomains.slice(domainIteration + 1) ?? []),
                  ];
                });
              });
            }}
          />
        )}
      </div>
    </form>
  );
};
