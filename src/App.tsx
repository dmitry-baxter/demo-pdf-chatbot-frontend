import ChatBotForm from './components/chat-bot-form';
import Header from './components/header';

function App() {
  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <ChatBotForm />
    </div>
  );
}

export default App;
