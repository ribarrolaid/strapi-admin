import { forwardRef, memo } from 'react';

import {
  JSONInput as JSONInputImpl,
  useComposedRefs,
  Field,
  JSONInputRef,
} from '@strapi/design-system';

import { useFocusInputField } from '../../hooks/useFocusInputField';
import { useField } from '../Form';

import { InputProps } from './types';

const JsonInput = forwardRef<JSONInputRef, InputProps>(
  ({ name, required, label, hint, labelAction, ...props }, ref) => {
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);

    const handleChange = (json: string) => {
      if (required && !json.length) {
        // Default to null when the field is not required and there is no input value
        field.onChange(name, null);
      } else {
        try {
          field.onChange(name, JSON.parse(json));
        } catch (e) {
          /**
           * Save the string value even though it's invalid to keep providing visual feedback.
           * We rely to the validations to prevent invalid data from being saved
           */
          field.onChange(name, json);
        }
      }
    };

    return (
      <Field.Root error={field.error} name={name} hint={hint} required={required}>
        <Field.Label action={labelAction}>{label}</Field.Label>
        <JSONInputImpl
          ref={composedRefs}
          value={
            typeof field.value == 'object' ? JSON.stringify(field.value, null, 2) : field.value
          }
          onChange={handleChange}
          minHeight={`25.2rem`}
          maxHeight={`50.4rem`}
          {...props}
        />
        <Field.Hint />
        <Field.Error />
      </Field.Root>
    );
  }
);

const MemoizedJsonInput = memo(JsonInput);

export { MemoizedJsonInput as JsonInput };
