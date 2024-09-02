import { useCallback, useState } from "react";

import { appService, chatState } from "../../state";
import "./Login.styles.css";
import { observer } from "mobx-react-lite";
import { IoMdLogIn } from "react-icons/io";

export const Login: React.FC = observer(() => {
  const [userName, setUserName] = useState("");

  const handleLogin = useCallback(() => {
    appService.login(userName.trim());
  }, [userName]);

  const handleKeydown = useCallback(
    (e: unknown) => {
      if ((e as KeyboardEvent).code !== "Enter") {
        return;
      }

      if (!userName.trim()) {
        return;
      }

      appService.login(userName.trim());
    },
    [userName]
  );

  return (
    <div className="main-app-login">
      <div className="login-container card">
        <h1>µChat</h1>
        <input
          type="text"
          id="name"
          value={userName}
          disabled={chatState.busy}
          placeholder="Your name"
          onKeyDown={handleKeydown}
          onChange={(e) => setUserName(e.target.value)}
        />

        {chatState.hasError && (
          <div className="login-error">{chatState.loginError}</div>
        )}

        <div className="button-row">
          <button
            disabled={!userName.trim() || chatState.busy}
            onClick={handleLogin}
          >
            <IoMdLogIn />
            Connect
          </button>
        </div>
      </div>
    </div>
  );
});
