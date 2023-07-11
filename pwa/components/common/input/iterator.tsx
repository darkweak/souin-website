import React, { useMemo, useState } from 'react';
import { InputGuesserProps } from './guesser';
import { Group } from './group';
import { InputHTMLAttributes } from 'react';
import { OutlinedButton } from '../button';

export type IteratorValue = Record<string, string | ReadonlyArray<string> | boolean | undefined>;
export type IteratorProps = {
  className?: string;
  iteration?: number;
  label?: string;
  name: string;
  onDelete?: () => void;
  // TODO: remove the any keyword here.
  // eslint-disable-next-line
  inputsTemplate?: ReadonlyArray<InputGuesserProps & { onChange?: (value: any) => void }>;
  setIteration?: React.Dispatch<React.SetStateAction<number>>;
  Template?: React.FC<IteratorProps>;
  values: ReadonlyArray<IteratorValue>;
};

export const Iterator: React.FC<IteratorProps> = ({
  className = 'gap-4',
  inputsTemplate,
  label,
  name,
  onDelete,
  Template,
  values,
}) => {
  const [iteration, setIteration] = useState(values.length);
  const memoizedIterations = useMemo(() => [...new Array(iteration)], [iteration]);

  return (
    <div className="form-control w-full gap-4">
      {label && <label className="text-xl font-bold">{label}</label>}
      <div className={className}>
        {memoizedIterations.map((_, idx) => {
          if (Template) {
            return (
              <Template
                key={idx}
                iteration={idx}
                className={className}
                inputsTemplate={inputsTemplate}
                setIteration={setIteration}
                label={label}
                name={name}
                Template={Template}
                values={values}
              />
            );
          }
          return (
            <div key={idx} className="flex py-2">
              <Group
                className={className}
                inputs={(inputsTemplate ?? []).map(
                  (template) =>
                    ({
                      ...template,
                      defaultValue: values[idx]?.[(template as InputHTMLAttributes<HTMLInputElement>).name ?? ''],
                      defaultChecked: values[idx]?.[(template as InputHTMLAttributes<HTMLInputElement>).name ?? ''],
                      ...(template.type === 'select'
                        ? {
                            handleChange: (props: never) =>
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              (template as any).handleChange(
                                {
                                  target: { iteration: idx, iterationKey: values[idx]?.key ?? idx },
                                },
                                props
                              ),
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ...((template as any).isMultiple
                              ? {
                                  selectedOptions:
                                    (
                                      (values[idx]?.[
                                        (template as InputHTMLAttributes<HTMLInputElement>).name ?? ''
                                      ] as ReadonlyArray<string>) ?? []
                                    ).map((v) => ({ name: v, value: v })) ?? [],
                                }
                              : {
                                  selectedOption:
                                    values[idx]?.[(template as InputHTMLAttributes<HTMLInputElement>).name ?? ''],
                                }),
                          }
                        : {
                            onChange: ({ target }) => {
                              template.onChange?.({
                                target: { ...target, iteration: idx, iterationKey: values[idx]?.key ?? idx },
                              });
                            },
                          }),
                    } as InputGuesserProps)
                )}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 flex-wrap md:flex-nowrap">
        <OutlinedButton
          text={`Add new item in ${name}`}
          onClick={(ev) => {
            ev.preventDefault();
            setIteration(iteration + 1);
          }}
        />
        {onDelete && (
          <OutlinedButton
            variant="danger"
            text={`Delete all ${name}`}
            onClick={(ev) => {
              ev.preventDefault();
              onDelete();
            }}
          />
        )}
      </div>
    </div>
  );
};
