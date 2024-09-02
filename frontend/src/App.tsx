import { observer } from "mobx-react-lite";
import "./App.css";
import { Chat, CurrentUser, Login, NewMessage, Users, Wait } from "./components";
import { chatState } from "./state/chat-state";

export const App = observer(() => {
  if (!chatState.isLoggedIn) {
    return <Login />;
  }

  if (chatState.users.length === 0) {
    return <Wait/>;
  }

  return (
    <div className="main-app">
      <div className="side-panel card">
        <Users />
      </div>

      <div className="main-panel card">
        <div className="chat-wrapper">
          <CurrentUser />

          <Chat />

          <NewMessage />
        </div>
      </div>
    </div>
  );
});
