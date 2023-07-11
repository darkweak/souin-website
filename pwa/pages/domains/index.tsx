import React, { useState } from 'react';
import { NextPage, NextPageContext } from 'next';
import { Domain } from 'actions';
import { Configuration, CreatableAPIResource, DomainAPI, Domain as DomainModel } from 'model';
import { Collapse } from 'components/common/collapse';
import { usePushToast, useRedirectIfNotLogged } from 'context';
import { OutlinedButton } from 'components/common/button';
import { Iterator } from 'components/common/input';
import { Subdomain, subdomainProps } from 'components/common/collapse/subdomain/subdomain';
import { Form } from 'components/common/form/forms';
import { Title } from 'components/common/text';
import Head from 'components/layout/head';

type DomainsPageProps = {
  domains: ReadonlyArray<DomainModel<Configuration>>;
  total: number;
};

type AddDomainContext = 'waiting' | 'add';

type AddDomainProps = {
  setDomains: React.Dispatch<React.SetStateAction<ReadonlyArray<DomainModel<Configuration>>>>;
};
const AddDomain: React.FC<AddDomainProps> = ({ setDomains }) => {
  useRedirectIfNotLogged();
  const pushToast = usePushToast();
  const [context, setContext] = useState<AddDomainContext>('waiting');

  if (context === 'add') {
    return (
      <Collapse
        title={
          <>
            <OutlinedButton
              text="cancel"
              variant="danger"
              onClick={() => {
                setContext('waiting');
              }}
            />
            <Form
              className="flex-row"
              inputs={[
                {
                  placeholder: 'domain.com',
                  name: 'dns',
                },
              ]}
              buttonProps={{
                text: 'add domain',
                variant: 'success',
                className: 'ml-4',
              }}
              handleSubmit={(values: CreatableAPIResource) => {
                return new Domain()
                  .create(values as DomainAPI)
                  .then((domain) => {
                    setDomains((prevDomains) => [...prevDomains, domain] as ReadonlyArray<DomainModel<Configuration>>);
                    pushToast({
                      text: `The domain ${(values as DomainAPI).dns} has been registered.`,
                      variant: 'success',
                    });
                    setContext('waiting');
                  })
                  .catch((err) => {
                    pushToast({ text: 'Impossible to create the domain. Try again later', variant: 'warning' });
                    throw err;
                  });
              }}
            />
            <span />
          </>
        }
      ></Collapse>
    );
  }

  return (
    <OutlinedButton
      text="Add new domain"
      className="w-fit"
      onClick={() => {
        setContext('add');
      }}
    />
  );
};

const Domains: NextPage<DomainsPageProps> = (props) => {
  useRedirectIfNotLogged();

  const pushToast = usePushToast();
  const [domains, setDomains] = useState<ReadonlyArray<DomainModel<Configuration>>>(props?.domains ?? []);

  return (
    <>
      <Head title="Your domains" />
      <Title title="Your domains" />
      <div className="grid gap-y-8 pt-8">
        {domains.map((domain, idx) => (
          <Collapse
            title={
              <>
                <span
                  className={`my-auto indicator-item indicator-middle left-full badge ${
                    domain.valid ? 'badge-success' : 'badge-warning'
                  }`}
                >
                  {domain.valid ? 'active' : 'waiting'}
                </span>
                <span className="font-bold text-accent-content">{domain.dns}</span>
                <span className="font-bold text-neutral-content hidden md:block">
                  {domain.configurations.length} configuration{domain.configurations.length > 1 ? 's' : ''}
                </span>
              </>
            }
            key={`${domain['@id']}-${idx}`}
          >
            <Iterator
              className="py-8 gap-y-8 grid"
              name="subdomains"
              values={domain.configurations.map((c) => c as Record<string, string>)}
              onDelete={() => {
                new Domain().delete(domain.id ?? '').then(() => {
                  pushToast({
                    text: `Your domain ${domain.dns} and all its subdomains has been deleted`,
                    variant: 'success',
                  });
                });
                setDomains((prevDomains) => [...prevDomains.slice(0, idx), ...prevDomains.slice(idx + 1)]);
              }}
              Template={({ iteration, setIteration, ...rest }) => {
                return (
                  <Subdomain
                    {...(rest.values[iteration ?? 0] as unknown as subdomainProps)}
                    setIteration={
                      setIteration ??
                      (() => {
                        return;
                      })
                    }
                    domain={domain['@id']}
                    domainIteration={idx}
                    iteration={iteration ?? 0}
                    setDomains={setDomains}
                  />
                );
              }}
            />
          </Collapse>
        ))}
        <AddDomain setDomains={setDomains} />
      </div>
    </>
  );
};

Domains.getInitialProps = (ctx: NextPageContext & { req: { cookies: Record<string, string> } }) => {
  return new Domain()
    .getMany({
      ...(ctx?.req?.cookies ? { config: { headers: { Authorization: `Bearer ${ctx.req.cookies.token}` } } } : {}),
      depth: 1,
    })
    .then(({ items, total }) => ({ domains: items as ReadonlyArray<DomainModel<Configuration>>, total }))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      return { domains: [] as ReadonlyArray<DomainModel<Configuration>>, total: 0 };
    });
};

export default Domains;
