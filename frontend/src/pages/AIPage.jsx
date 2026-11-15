import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useNikhilAI from '@/hooks/useNikhilAI';
import AIChatPanel from '@/components/ai/AIChatPanel';

const AIPage = () => {
  const navigate = useNavigate();
  const {
    messages,
    isLoading,
    isStreaming,
    inputValue,
    isDeepThink,
    setIsDeepThink,
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

  useEffect(() => {
    document.title = 'Nikhil AI · Assistant';
  }, []);

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <AIChatPanel
      isOpen={true}
      isStandalone={true}
      messages={messages}
      isLoading={isLoading}
      isStreaming={isStreaming}
      inputValue={inputValue}
      hasMessages={hasMessages}
      isDeepThink={isDeepThink}
      onToggleDeepThink={() => setIsDeepThink((prev) => !prev)}
      onClose={handleClose}
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
  );
};

export default AIPage;
