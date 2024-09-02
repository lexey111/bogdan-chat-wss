import { observer } from "mobx-react-lite";
import { useCallback, useRef } from "react";
import { appService, chatState } from "../../state";
import { IoSend } from "react-icons/io5";

import "./NewMessage.styles.css";

export const NewMessage: React.FC = observer(() => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    const text = inputRef.current?.value;
    if (!text) {
      return;
    }

    appService.sendMessage(text);

    if (inputRef.current) {
        inputRef.current.value = ''
    }
  }, []);

  const handleKeydown = useCallback((e: unknown) => {
    if ((e as KeyboardEvent).code !== 'Enter') {
        return
    }

    handleSend();
  }, [handleSend])

  return (
    <div className="message-container">
      <div className="message-field">
        <input type="text" placeholder="Type message..." onKeyDown={handleKeydown} ref={inputRef} />
        <button onClick={handleSend} disabled={chatState.busy}>
        <IoSend />
        </button>
      </div>
    </div>
  );
});
