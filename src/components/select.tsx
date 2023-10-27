import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { Fragment } from 'react';

export interface Option {
  value: string;
  label: string;
}
interface Props {
  options: Option[];
  value?: Option;
  onChange(value: Option): void;
  label: string;
  placeholder: string;
  error?: string;
}

function Select({ options, value, onChange, label, placeholder, error }: Props) {
  return (
    <Listbox value={value} onChange={onChange} by="value">
      {({ open }) => (
        <div>
          <Listbox.Label className="block text-sm font-medium leading-6 text-white">{label}</Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-sm bg-dark-gray py-1.5 pl-3 pr-10 text-left text-white ring-1 ring-inset ring-white/25 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6">
              <span className="block truncate">{value?.label || placeholder}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="shadow-xl absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-dark-gray rounded-sm py-1 text-base ring-1 ring-white ring-opacity-25 focus:outline-none sm:text-sm">
                {options.map((opt) => (
                  <Listbox.Option
                    key={opt.value}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-primary text-white' : 'text-light-gray',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={opt}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {opt.label}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-primary',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </Listbox>
  );
}

export default Select;
