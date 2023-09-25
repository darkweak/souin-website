import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { BaseButton } from 'components/common/button';
import { Textarea } from 'components/common/input';
import {
  defaultJson,
  useConfiguration,
  useDispatchConfiguration,
} from 'context';

const ReactJson = dynamic(import('react-json-view'), { ssr: false });

const beautify = (o: object): string => {
  return JSON.stringify(o, null, 4);
};

export const JsonEditor: React.FC = () => {
  const dispatchConfiguration = useDispatchConfiguration();
  const [plainMod, setPlainMod] = useState(false);
  const configurationValue = useConfiguration();
  const [value, setValue] = useState(
    configurationValue ? beautify(configurationValue) : undefined,
  );

  useEffect(() => {
    const timer = setTimeout(
      () =>
        dispatchConfiguration({
          type: 'update',
          payload: value ? JSON.parse(value) : undefined,
        }),
      2500,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [value, dispatchConfiguration]);

  return (
    <div className="relative">
      {plainMod ? (
        <Textarea
          placeholder={beautify(defaultJson)}
          rows={12}
          value={value}
          onChange={({ target: { value } }) => {
            setValue(value);
          }}
        />
      ) : (
        <ReactJson src={configurationValue ?? {}} />
      )}
      <div className="absolute z-10 right-4 top-2 gap-y-2 flex flex-col text-neutral">
        <BaseButton
          variant="default"
          onClick={() => setPlainMod(!plainMod)}
          text={`Change to ${plainMod ? 'editor' : 'plain'} mode`}
          className="text-neutral"
        />
        {plainMod && (
          <>
            <BaseButton
              variant="default"
              onClick={() => setValue(beautify(defaultJson))}
              text="Apply default value"
              className="text-neutral"
            />
            <BaseButton
              variant="default"
              onClick={() => setValue(value ? beautify(JSON.parse(value)) : '')}
              className="text-neutral"
              text="Beautify"
            />
          </>
        )}
      </div>
    </div>
  );
};
