import { api, isNormalResponse, LoginResult } from "./api";
import { ChatState } from "./chat-state";

export class AppService {
    constructor(private state: ChatState) {
        //
    }

    sendMessage = async (message: string) => {
        console.log('Service: send message');
        this.state.busy = true
        console.log(">> message", message);
        await api.sendMessage(this.state.currentUserName || "", message);

        setTimeout(() => {
            this.state.busy = false
        }, 1000)
    }

    logout = async () => {
        if (!this.state.isLoggedIn) {
            return;
        }

        console.log('Service: logout!')
        this.state.busy = true

        await api.tryLogout(this.state.currentUserName)
        this.state.reset()

        setTimeout(() => {
            this.state.busy = false
        }, 200)
    }

    login = async (userName: string) => {
        this.state.reset()
        this.state.busy = true

        const response: LoginResult = await api.tryLoginToServer(userName);

        if (response && isNormalResponse(response)) {
            this.state.currentUserName = response.name;
            this.state.connectedAt = response.connectedAt;
            this.state.chat = [];
            this.state.users = [];
        } else {
            this.state.loginError = response.error || "Server error. Login attempt rejected.";
        }
        setTimeout(() => {
            this.state.busy = false
        }, 500)
    }

    getMessages = async () => {
        if (!this.state.isLoggedIn) {
            return;
        }
        const messages = await api.getMessages();

        if (!messages) {
            this.state.chat = [];
        } else {
            this.state.chat = [...messages];
        }
    }

    getUsers = async () => {
        if (!this.state.isLoggedIn) {
            return;
        }

        const users = await api.getUsers();

        if (
            !users ||
            users.length === 0 ||
            !users.find((u) => u.name === this.state.currentUserName)
        ) {
            console.log("User not found!");
            console.log("users", users);
            console.log("current user", this.state);

            this.state.users = [];
            this.state.currentUserName = "";
        } else {
            this.state.users = [...users];
        }
    }
}
