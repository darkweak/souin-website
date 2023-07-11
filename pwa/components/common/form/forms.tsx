import React, { PropsWithChildren, useState } from 'react';
import { Title } from 'components/common/text';
import { InputGuesser, InputGuesserProps } from 'components/common/input';
import Link from 'next/link';
import { BaseButton, buttonType } from 'components/common/button';
import { FormEventHandler } from 'react';
import { CreatableAPIResource } from 'model';
import SubtitleForm from './subtitle';

type redirectionType = {
  text: string;
  highlightText: string;
  redirectionLink: string;
};

type additionalTypes = {
  authentication?: boolean;
  title?: string;
  subtitle?: string;
  inputs: ReadonlyArray<InputGuesserProps>;
  buttonProps?: buttonType;
  redirectionInformation?: redirectionType;
  handleSubmit?: (values: CreatableAPIResource) => Promise<void>;
};

type formType = additionalTypes & React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
export type FormEventWithValues<T> = FormEventHandler<T> | { target: { values: T } };

export const Form: React.FC<PropsWithChildren<formType>> = ({
  children,
  className,
  title,
  subtitle,
  inputs,
  buttonProps,
  redirectionInformation,
  handleSubmit,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setIsLoading(true);
        const form = event.target as HTMLFormElement;
        const values = Array.from(form.elements).reduce((data: Record<string, string>, element) => {
          if (element instanceof HTMLInputElement && element.name) {
            data[element.name] = element.value;
          }
          return data;
        }, {});

        handleSubmit?.(values as CreatableAPIResource)
          .then((res) => {
            form.reset();
            setIsLoading(false);
            return res;
          })
          .catch((err) => {
            setIsLoading(false);
            // eslint-disable-next-line no-console
            console.log(err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }}
      {...props}
      className={`flex justify-center gap-y-8 ${className ?? 'flex-col'}`}
    >
      {title && <Title title={title} />}
      {subtitle && <SubtitleForm>{subtitle}</SubtitleForm>}
      {inputs ? inputs.map((inputProps, idx) => <InputGuesser key={idx} {...inputProps} />) : ''}
      {children}
      <div className="m-auto grid gap-4">
        {buttonProps && (
          <BaseButton
            {...{
              ...buttonProps,
              ...(isLoading
                ? {
                    icon: undefined,
                    text: undefined,
                  }
                : {}),
            }}
            disabled={isLoading}
            className={`m-auto transition-all transition-duration-300 ${buttonProps.className ?? ''}`}
          >
            {isLoading ? <span className="btn-disabled loading loading-dots loading-lg" /> : undefined}
          </BaseButton>
        )}
        {redirectionInformation ? (
          <Link href={redirectionInformation.redirectionLink} className="hover:underline text-base-content">
            {redirectionInformation.text}{' '}
            <span className="font-bold text-accent-content">{redirectionInformation.highlightText}</span>
          </Link>
        ) : null}
      </div>
    </form>
  );
};
