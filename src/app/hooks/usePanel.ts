

import { useParentMessageId } from "../Features/messages/store/useParentMessageId";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
  };

  const onclose = () => {
    setParentMessageId(null);
  };

  return { parentMessageId, onOpenMessage, onclose };
};
