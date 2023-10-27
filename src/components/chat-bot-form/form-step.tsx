import { CheckIcon } from '@heroicons/react/24/solid';
import classnames from 'classnames';
import { useMemo } from 'react';

export enum StepStatus {
  CURRENT,
  UPCOMING,
  COMPLETED,
}
export interface Step {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
}

interface StepProps extends Step {
  index: number;
  onClick(step: Step): void;
}

function FormStep({ id, name, description, status, index, onClick }: StepProps) {
  const Content = useMemo(
    () => (
      <>
        <span
          className={classnames(
            'flex 2xl:w-12 2xl:h-12 h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
            {
              'bg-indigo-600 group-hover:bg-indigo-800': status === StepStatus.COMPLETED,
              'border-2 border-gray-300 group-hover:border-gray-400': status === StepStatus.UPCOMING,
              'border-2 border-indigo-600': status === StepStatus.CURRENT,
            }
          )}
        >
          {status === StepStatus.COMPLETED ? (
            <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
          ) : (
            <span
              className={classnames('2xl:text-lg', {
                'text-gray-500 group-hover:text-gray-900': status === StepStatus.UPCOMING,
                'text-indigo-600': status === StepStatus.CURRENT,
              })}
            >
              {index + 1}
            </span>
          )}
        </span>

        <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
          <span
            className={classnames('text-sm 2xl:text-base font-medium', {
              'text-gray-900': status === StepStatus.COMPLETED,
              'text-gray-500 group-hover:text-gray-900': status === StepStatus.UPCOMING,
              'text-indigo-600': status === StepStatus.CURRENT,
            })}
          >
            {name}
          </span>
          <span className="text-sm 2xl:text-base font-medium text-gray-500">{description}</span>
        </span>
      </>
    ),
    [description, index, name, status]
  );

  return (
    <div
      onClick={() => onClick({ id, name, status, description })}
      className={classnames(
        'flex items-center bg-white rounded-sm',
        status !== StepStatus.COMPLETED ? 'pointer-events-none' : 'cursor-pointer',
        {
          'group w-full': status === StepStatus.COMPLETED || status === StepStatus.UPCOMING,
          'px-6 py-4 text-sm font-medium': status === StepStatus.CURRENT,
        }
      )}
      aria-current={status === StepStatus.CURRENT ? 'step' : undefined}
    >
      {status === StepStatus.CURRENT ? (
        Content
      ) : (
        <span className="flex items-center px-6 py-4 text-sm font-medium">{Content}</span>
      )}
    </div>
  );
}

export default FormStep;
