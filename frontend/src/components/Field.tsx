import { forwardRef, type InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { error, id, label, ...props },
  ref,
) {
  const fieldId = id ?? props.name;

  return (
    <label className="field" htmlFor={fieldId}>
      <span className="field__label">{label}</span>
      <input
        {...props}
        className="field__input"
        id={fieldId}
        ref={ref}
      />
      {error ? (
        <span className="field__error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
});
