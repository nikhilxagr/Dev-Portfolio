import { useLocation } from 'react-router-dom';
import useNikhilAI from '@/hooks/useNikhilAI';
import AIFloatingButton from './AIFloatingButton';
import AIChatPanel from './AIChatPanel';

const NikhilAI = () => {
  const location = useLocation();

  // Hide AI assistant on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return <NikhilAIWidget />;
};

const NikhilAIWidget = () => {
  const {
    isOpen,
    messages,
    isLoading,
    isStreaming,
    inputValue,
    closePanel,
    togglePanel,
    sendMessage,
    clearHistory,
    setInputValue,
    handleKeyDown,
    messagesEndRef,
    inputRef,
    hasMessages,
  } = useNikhilAI();

  return (
    <>
      <AIFloatingButton isOpen={isOpen} onClick={togglePanel} />
      <AIChatPanel
        isOpen={isOpen}
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        inputValue={inputValue}
        hasMessages={hasMessages}
        onClose={closePanel}
        onClear={clearHistory}
        onSend={sendMessage}
        onInputChange={setInputValue}
        onKeyDown={handleKeyDown}
        onSuggestedSelect={(question) => {
          sendMessage(question);
        }}
        messagesEndRef={messagesEndRef}
        inputRef={inputRef}
      />
    </>
  );
};

export default NikhilAI;
