import process from 'process';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from './button';
import DndFileInput from './chat-bot-form/dnd-file-input';
import Checkbox from './checkbox';
import Select, { Option } from './select';

export interface UploadStepValues {
  file?: File;
  lang?: string;
}

interface Props {
  locals: string[];
  submitting?: boolean;
  onSubmit(values: UploadStepValues): void;
}
const hideLangSelector =
  typeof process.env.REACT_APP_HIDE_LANG_SELECTOR === 'number'
    ? Boolean(process.env.REACT_APP_HIDE_LANG_SELECTOR)
    : true;

function UploadStep({ locals, onSubmit, submitting }: Props) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File>();
  const [fileLang, setFileLang] = useState<Option>();
  const [accepted, setAccepted] = useState(false);
  const [langSelectorError, setLangSelectorError] = useState<string>();
  const [fileUploadError, setFileUploadError] = useState<string>();
  const [acceptedCheckError, setAcceptedCheckError] = useState<string>();

  const langOptions = useMemo(
    () =>
      locals.map((local) => ({ value: local, label: new Intl.DisplayNames(locals, { type: 'language' }).of(local)! })),
    [locals]
  );

  const handleDropAccepted = (files: File[]) => {
    setFile(files[0]);
    setFileUploadError('');
  };

  const handleSubmit = () => {
    let hasError = false;
    if (!hideLangSelector && !fileLang) {
      setLangSelectorError(t('common.required', 'this field is required!'));
      hasError = true;
    }
    if (!file) {
      setFileUploadError(t('common.required', 'this field is required!'));
      hasError = true;
    }
    if (!accepted) {
      setAcceptedCheckError(t('common.required', 'this field is required!'));
      hasError = true;
    }

    if (!hasError) onSubmit({ lang: fileLang?.value, file });
  };

  return (
    <div className="grow flex flex-col gap-y-4 px-2 py-6">
      {!hideLangSelector && (
        <Select
          options={langOptions}
          value={fileLang}
          onChange={(val) => {
            setFileLang(val);
            setLangSelectorError('');
          }}
          label={t('upload-step.lang-select.label', 'Choose Language')}
          placeholder={t('upload-step.lang-select.placeholder', 'Automatic Language Detection in Full Version')}
          error={langSelectorError}
        />
      )}
      <DndFileInput
        acceptedFiles={file ? [file] : undefined}
        onClearAllUploadedFiles={() => {
          setFile(undefined);
          setFileUploadError('');
        }}
        dropzoneOptions={{
          maxFiles: 1,
          onDropAccepted: handleDropAccepted,
          accept: {
            'application/pdf': [],
          },
        }}
        error={fileUploadError}
      />
      <Checkbox
        label={t(
          'upload-step.agreement-checkbox-label',
          'Hiermit bestätige ich, dass das Dokument keine personenbezogenen Daten beinhaltet. \n'
        )}
        checked={accepted}
        onChange={(evt) => {
          setAccepted(evt.target.checked);
          setAcceptedCheckError('');
        }}
        error={acceptedCheckError}
      />
      <div className="mt-auto pt-4">
        <Button onClick={handleSubmit} loading={submitting}>
          {t('common.continue', 'Continue')}
        </Button>
      </div>
    </div>
  );
}

export default UploadStep;
