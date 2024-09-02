import { observer } from "mobx-react-lite";
import "./CurrentUser.styles.css";
import { appService, chatState } from "../../state/chat-state";
import { IoMdLogOut } from "react-icons/io";
import dayjs from "dayjs";
import { dateFormat } from "../../consts";

export const CurrentUser: React.FC = observer(() => {
  if (!chatState.currentUserName) {
    return <div>No user</div>;
  }

  return (
    <div className="current-user-container">
      <div className="current-user-content">
        <div className="current-user-name">{chatState.currentUserName}</div>
        <div className="current-user-connected">{dayjs(chatState.connectedAt).format(dateFormat)}</div>
      </div>

      <div className="current-user-actions">
        <button className={"danger"} onClick={appService.logout}>
          <IoMdLogOut />
          Exit
        </button>
      </div>
    </div>
  );
});
