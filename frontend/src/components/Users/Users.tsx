import { observer } from "mobx-react-lite";
import "./Users.styles.css";
import { chatState } from "../../state/chat-state";
import dayjs from "dayjs";
import { dateFormat } from "../../consts";

export const Users: React.FC = observer(() => {
  return (
    <div className="user-list">
      <div className="users-wrapper">
        {chatState.users.map((user) => {
          return (
            <div
              className={
                "user-container" +
                (user.name === chatState.currentUserName ? " active" : "")
              }
              key={user.name}
            >
              <div className="user-name">{user.name}</div>
              <div className="user-connected-time">{dayjs(user.connectedAt).format(dateFormat)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
