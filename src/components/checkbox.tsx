import { ComponentPropsWithoutRef, ReactNode, useId } from 'react';

interface Props extends ComponentPropsWithoutRef<'input'> {
  label: string;
  description?: ReactNode;
  error?: string;
}
function Checkbox({ label, description, error, ...rest }: Props) {
  const id = useId();
  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          {...rest}
          id={id}
          type="checkbox"
          aria-describedby={description ? `${id}-description` : undefined}
          className="h-4 w-4 rounded border-gray-300 bg-dark-gray text-primary focus:ring-1 focus:ring-primary focus:ring-offset-dark-gray"
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label htmlFor={id} className="font-medium text-white 2xl:text-base">
          {label}
        </label>
        {description && (
          <p id={`${id}-description`} className="text-white/25">
            {description}
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export default Checkbox;
