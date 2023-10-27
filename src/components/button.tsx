import classNames from 'classnames';
import { ComponentPropsWithoutRef, useEffect, useState } from 'react';

import CircleProgress from './circle-progress';

function Button({ children, className, loading, ...rest }: ComponentPropsWithoutRef<'button'> & { loading?: boolean }) {
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShowLoadingSpinner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    /*@ts-ignore */
    <button
      type="button"
      {...rest}
      className={classNames(
        className,
        'inline-flex items-center rounded-md bg-white/10 px-3.5 py-2.5 text-sm 2xl:text-base font-semibold text-white shadow-sm hover:bg-white/20',
        {
          'pointer-events-none opacity-60': rest.disabled || loading,
        }
      )}
    >
      {showLoadingSpinner && <CircleProgress />}
      {children}
    </button>
  );
}

export default Button;
