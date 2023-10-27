import * as process from 'process';
import { useMemo, useState } from 'react';
import { useAsyncCallback } from 'react-async-hook';
import { useTranslation } from 'react-i18next';
import ClipLoader from 'react-spinners/ClipLoader'; // Importing ClipLoader spinner
import { SetOptional } from 'type-fest';

import ChatStep, { UserSession } from '../chat-step';
import SettingsStep, { SettingsStepValues } from '../settings-step';
import UploadStep, { UploadStepValues } from '../upload-step';
import FormStep, { Step, StepStatus } from './form-step';

type Values = Partial<UploadStepValues> & Partial<SettingsStepValues>;

const showSettings = !!process.env.REACT_APP_SHOW_SETTINGS_STEP || false;

function ChatBotForm() {
  const { t, i18n } = useTranslation();

  const steps: SetOptional<Step, 'status'>[] = useMemo(
    () => [
      {
        id: '01',
        name: t('step-upload-pdf.title', 'PDF Hochladen'),
        description: t('step-upload-pdf.description', 'Laden Sie einfach ein PDF mit einigen Seiten Text hoch'),
      },
      {
        id: '02',
        name: t('step-bot-settings.title', 'Bot Einstellungen'),
        description: t('step-bot-settings.description', '(optional) customize your bot'),
      },
      {
        id: '03',
        name: t('step-your-chatbot.title', 'Ihr digitaler Assistent'),
        description: t('step-your-chatbot.description', 'demo version 10 questions only'),
      },
    ],
    [t]
  );

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const [values, setValues] = useState<Values>({});

  const [userSession, setUserSession] = useState<UserSession>();

  const stepsWithStatus = useMemo(
    () =>
      steps.map((step, index) => {
        let status: StepStatus;
        if (index < activeStepIndex) status = StepStatus.COMPLETED;
        else if (index === activeStepIndex) status = StepStatus.CURRENT;
        else status = StepStatus.UPCOMING;

        return { ...step, status };
      }),
    [steps, activeStepIndex]
  );

  const [error, setError] = useState<string | null>(null);

  const handleCreateSession = async (data: Values) => {
    const body = new FormData();
    if (data.lang) body.append('file-lang', data.lang);
    body.append('file', data.file!);
    if (data.prompt) body.append('custom-prompt', data.prompt);
    //add the page language to the form data
    body.append('lang', i18n.language);
    //add query parameters (not from data) to body: code, reference
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) body.append('code', code);
    const reference = urlParams.get('reference');
    if (reference) body.append('reference', reference);

    try {
      const backendUrl = process.env.BACKEND_URL || 'https://ms-teams-bot-nodejs-container.azurewebsites.net'; //'http://localhost:3978'; //
      const response = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        headers: { 'x-api-key': process.env.REACT_APP_X_API_KEY || 'TEST' },
        body,
      });
      setUserSession(await response.json());
      setActiveStepIndex((p) => p + 1);
      setError(null); // Reset error state on successful request
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing your request. Please try again later.'); // Set error state on failure
    }
  };

  const handleUploadStepSubmit = useAsyncCallback(async (value: UploadStepValues) => {
    setValues((p) => ({ ...p, ...value }));
    setActiveStepIndex((p) => p + 1);

    if (!showSettings) await handleCreateSession({ ...values, ...value });
  });

  const handleSettingStepSubmit = useAsyncCallback(async (value: SettingsStepValues) => {
    setValues((p) => ({ ...p, ...value }));
    await handleCreateSession({ ...values, ...value });
  });

  const handleStepChange = (value: Step) => {
    if (handleSettingStepSubmit.loading) return;
    setActiveStepIndex(steps.findIndex((step) => step.id === value.id));
  };

  const retry = () => {
    setError(null); // Reset error state
    handleCreateSession(values); // Retry the request
  };

  const isLoading = handleUploadStepSubmit.loading || handleSettingStepSubmit.loading;

  return (
    <div className="grow mx-auto w-full max-w-screen-2xl px-10 max-md:px-6 py-10">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <ClipLoader color="#FFFFFF" size={150} />
        </div>
      )}
      <div
        className={`bg-dark-gray max-w-3xl 2xl:max-w-4xl h-full flex flex-col gap-y-6 mx-auto rounded-sm ${
          isLoading ? 'opacity-50' : ''
        }`}
      >
        {error && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
            <p>{error}</p>
            <button onClick={retry} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Try Again
            </button>
          </div>
        )}
        <div className="h-full flex flex-col gap-4 px-4 py-6">
          <FormStep {...stepsWithStatus[0]} index={0} onClick={handleStepChange} />
          {steps[activeStepIndex].id === '01' && (
            <UploadStep
              locals={['en', 'de']}
              onSubmit={handleUploadStepSubmit.execute}
              submitting={handleUploadStepSubmit.loading}
            />
          )}
          {showSettings && (
            <>
              <FormStep {...stepsWithStatus[1]} index={1} onClick={handleStepChange} />
              {steps[activeStepIndex].id === '02' && (
                <SettingsStep onSubmit={handleSettingStepSubmit.execute} submitting={handleSettingStepSubmit.loading} />
              )}
            </>
          )}
          <FormStep {...stepsWithStatus[2]} index={!showSettings ? 1 : 2} onClick={handleStepChange} />
          {steps[activeStepIndex].id === '03' && userSession && <ChatStep session={userSession} />}
        </div>
      </div>
    </div>
  );
}

export default ChatBotForm;
