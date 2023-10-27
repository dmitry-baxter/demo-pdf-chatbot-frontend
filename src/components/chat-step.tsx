import ReactWebChat, { createDirectLine, createStore } from 'botframework-webchat';
import { debounce } from 'debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ClipLoader from 'react-spinners/ClipLoader'; // Importing ClipLoader spinner

export interface UserSession {
  conversationId: string;
  token: string;
  expires_in: number;
}
interface Props {
  session: UserSession;
}

function ChatStep({ session }: Props) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const directLine = useMemo(() => createDirectLine({ token: session?.token }), [session?.token]);
  const [rootHeight, setRootHeight] = useState<number>();
  const [welcomeReceived, setwelcomeReceived] = useState(false); // State to track loading

  useEffect(() => {
    if (ref.current) {
      const handleUpdateChatWindowHeight = () => {
        const rect = ref.current?.getBoundingClientRect();

        if (rect && rect.height > (rootHeight || 0)) {
          setRootHeight(rect.height);

          // delay the scrolling to last in JS processing stack
          const timer = setTimeout(() => {
            ref.current?.scrollIntoView({ inline: 'end', behavior: 'smooth' });
            clearTimeout(timer);
          }, 1);
        }
      };
      handleUpdateChatWindowHeight();

      const debounced = debounce(handleUpdateChatWindowHeight, 100);

      window.addEventListener('resize', debounced);
      return () => {
        window.removeEventListener('resize', handleUpdateChatWindowHeight);
        debounced.flush();
      };
    }
  }, [rootHeight]);

  const handleIncomingActivity = (activity: any) => {
    console.log('Received an activity:', activity);
    if (!welcomeReceived && activity.type === 'message') {
      setwelcomeReceived(true);
    }
  };

  const store = useMemo(
    () =>
      createStore({}, ({ dispatch }: any) => (next: any) => (action: any) => {
        if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
          dispatch({
            type: 'WEB_CHAT/SEND_EVENT',
            payload: {
              name: 'webchat/join',
              value: {
                language: window.navigator.language,
              },
            },
          });
        } else if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
          const activity = action.payload.activity;
          handleIncomingActivity(activity);
        }

        return next(action);
      }),
    []
  );

  return (
    <div className="relative w-full h-full min-h-[460px] max-h-screen overflow-hidden">
      {!welcomeReceived && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <ClipLoader color="#FFFFFF" size={150} />
        </div>
      )}
      <div className="absolute inset-0" ref={ref} />
      {rootHeight !== undefined && (
        <div className="absolute inset-x-0 top-0" style={{ height: rootHeight }}>
          <ReactWebChat
            directLine={directLine}
            styleOptions={{ hideUploadButton: true, backgroundColor: 'rgba(0,0,0,0.25)' }}
            overrideLocalizedStrings={{ TEXT_INPUT_PLACEHOLDER: t('chatbot-input-placeholder', '') }}
            sendTypingIndicator={true}
            userID="user1"
            store={store}
            disabled={!welcomeReceived}
          />
        </div>
      )}
    </div>
  );
}

export default ChatStep;
