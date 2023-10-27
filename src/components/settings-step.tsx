import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from './button';
import Select, { Option } from './select';

export interface SettingsStepValues {
  prompt?: string;
}

interface Props {
  submitting?: boolean;
  onSubmit(values: SettingsStepValues): void;
}

const maxLength = Number(process.env.REACT_APP_MAX_CUSTOM_PROMPT_LENGTH || 100);

function SettingsStep({ onSubmit, submitting }: Props) {
  const { t } = useTranslation();
  const PROMPT_TYPE_OPTIONS: Option[] = useMemo(
    () => [
      { value: 'system', label: t('settings-step.prompt-type-select.system-option', 'System') },
      { value: 'custom', label: t('settings-step.prompt-type-select.custom-option', 'Custom') },
    ],
    [t]
  );

  const [promptType, setPromptType] = useState(PROMPT_TYPE_OPTIONS[0]);
  const [prompt, setPrompt] = useState<string>();
  const [promptTypeSelectorError, setPromptTypeSelectorError] = useState<string>();
  const [promptError, setPromptError] = useState<string>();

  const handleSubmit = () => {
    let hasError = false;
    if (!promptType.value) {
      setPromptTypeSelectorError(t('common.required', 'this field is required!'));
      hasError = true;
    }
    if (promptType.value === 'custom' && !prompt) {
      setPromptError(t('common.required', 'this field is required!'));
      hasError = true;
    }

    if (!hasError) onSubmit({ prompt });
  };

  return (
    <div className="grow flex flex-col gap-y-4 px-2 py-6">
      <Select
        options={PROMPT_TYPE_OPTIONS}
        value={promptType}
        onChange={(val) => {
          setPromptTypeSelectorError('');
          if (val.value === 'custom') {
            setPromptError('');
          }
          setPromptType(val);
        }}
        label={t('settings-step.prompt-type-select.label', 'Choose Prompt Type')}
        placeholder={t('common.empty-select-placeholder', 'Select...')}
        error={promptTypeSelectorError}
      />
      {promptType.value === 'custom' && (
        <div className="w-full h-full flex flex-col">
          <div className="relative w-full h-full grow">
            <textarea
              className="resize-none block w-full h-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              placeholder={t('settings-step.custom-prompt-input.placeholder', 'Enter your custom prompt!')}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setPromptError('');
              }}
              maxLength={maxLength}
            />
            <span className="absolute right-2 bottom-2 inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
              {t('settings-step.custom-prompt-input.max-char', `Max chars count: ${maxLength}`, { count: maxLength })}
            </span>
          </div>
          {promptError && <p className="mt-2 text-sm text-red-600">{promptError}</p>}
        </div>
      )}
      <div className="mt-auto pt-4">
        <Button loading={submitting} onClick={handleSubmit}>
          {submitting ? t('common.loading', 'Loading...') : t('common.continue', 'Continue')}
        </Button>
      </div>
    </div>
  );
}

export default SettingsStep;
