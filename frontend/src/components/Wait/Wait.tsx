import { observer } from "mobx-react-lite";
import "./Wait.styles.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const Wait: React.FC = observer(() => {
  return (
    <div className="main-app-wait">
      <div className="wait-container card">
        <AiOutlineLoading3Quarters />
        Loading...
      </div>
    </div>
  );
});
