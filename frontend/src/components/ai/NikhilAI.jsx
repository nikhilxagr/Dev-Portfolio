import { useLocation } from 'react-router-dom';
import useNikhilAI from '@/hooks/useNikhilAI';
import AIFloatingButton from './AIFloatingButton';
import AIChatPanel from './AIChatPanel';

const NikhilAI = () => {
  const location = useLocation();

  // Hide AI assistant on admin pages or dedicated /ai page
  if (location.pathname.startsWith('/admin') || location.pathname === '/ai') {
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
    isDeepThink,
    setIsDeepThink,
    closePanel,
    togglePanel,
    sendMessage,
    stopStreaming,
    clearHistory,
    regenerateLastMessage,
    setInputValue,
    handleKeyDown,
    messagesEndRef,
    inputRef,
    hasMessages,
    imageQuota,
    selectedImageModel,
    setSelectedImageModel,
    availableImageModels,
    sessions,
    activeSessionId,
    isSessionsLoading,
    selectSession,
    deleteSession,
    renameSession,
    clearAllSessions,
    createNewChat,
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
        isDeepThink={isDeepThink}
        onToggleDeepThink={() => setIsDeepThink((prev) => !prev)}
        onClose={closePanel}
        onClear={clearHistory}
        onStop={stopStreaming}
        onRegenerate={regenerateLastMessage}
        onSend={sendMessage}
        onInputChange={setInputValue}
        onKeyDown={handleKeyDown}
        onSuggestedSelect={(question) => {
          sendMessage(question);
        }}
        messagesEndRef={messagesEndRef}
        inputRef={inputRef}
        imageQuota={imageQuota}
        selectedImageModel={selectedImageModel}
        onSelectImageModel={setSelectedImageModel}
        availableImageModels={availableImageModels}
        sessions={sessions}
        activeSessionId={activeSessionId}
        isSessionsLoading={isSessionsLoading}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        onRenameSession={renameSession}
        onClearAllSessions={clearAllSessions}
        onNewChat={createNewChat}
      />
    </>
  );
};

export default NikhilAI;
