import { DocumentTextIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import { DropzoneOptions, FileWithPath, useDropzone } from 'react-dropzone';
import { Trans, useTranslation } from 'react-i18next';

interface Props {
  acceptedFiles?: File[];
  dropzoneOptions?: DropzoneOptions;
  onClearAllUploadedFiles(): void;
  error?: string;
}

function DndFileInput({ acceptedFiles, error, ...props }: Props) {
  const { t } = useTranslation();
  const { getRootProps, getInputProps } = useDropzone(props.dropzoneOptions);

  return (
    <div className="w-full h-full flex flex-col">
      <div
        {...getRootProps({
          className:
            'dropzone h-full w-full grow flex flex-col rounded-lg border border-dashed border-white/25 px-6 py-10',
        })}
      >
        <div className="flex-1 grid place-items-center">
          <div className="text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
            <Trans t={t} i18nKey="upload-file-label">
              <div className="mt-4 flex text-sm leading-6 text-gray-400">
                <span className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500">
                  <span className="2xl:text-base">Upload a file</span>
                  <input {...getInputProps()} className="sr-only" />
                </span>
                <p className="pl-1 2xl:text-base">or drag and drop</p>
              </div>
              <p className="text-xs 2xl:text-sm leading-5 text-gray-400">PDF up to 10MB</p>
            </Trans>
          </div>
        </div>

        {!!acceptedFiles?.length && (
          <div className="space-y-2 border-t border-light-gray border-dashed pt-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-white 2xl:text-base font-medium text-sm capitalize">
                {t('common.accepted-file', 'accepted files', { count: acceptedFiles.length })}
              </span>
              <button
                type="button"
                className="rounded bg-white/10 px-2 py-1 text-xs 2xl:text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                onClick={(evt) => {
                  evt.stopPropagation();
                  props.onClearAllUploadedFiles();
                }}
              >
                {t('common.clear', 'clear')}
              </button>
            </div>
            <ul role="list" className="divide-y divide-white/5">
              {acceptedFiles.map((file: FileWithPath) => (
                <li key={file.path} className="relative flex items-center space-x-4 bg-gray-900 px-4 py-3">
                  <div className="min-w-0 flex-auto">
                    <div className="flex items-center gap-x-3">
                      <h2 className="min-w-0 text-sm 2xl:text-base font-semibold leading-6 text-white">
                        <span className="flex gap-x-2">
                          <span className="truncate">{file.name}</span>
                        </span>
                      </h2>
                    </div>
                    <div className="mt-4 flex items-center gap-x-2.5 text-xs 2xl:text-sm leading-5 text-gray-400">
                      <p className="truncate">{t('common.updated-at', 'updated-at')}</p>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <p className="whitespace-nowrap">{moment(file.lastModified).format('MMMM Do YYYY, h:mm:ss a')}</p>
                    </div>
                  </div>
                  <div className="text-indigo-400 bg-indigo-400/10 ring-indigo-400/30 rounded-full flex-none py-1 px-2 text-xs 2xl:text-sm font-medium ring-1 ring-inset">
                    {file.type}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default DndFileInput;
