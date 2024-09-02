import { makeAutoObservable, reaction } from "mobx"
import { WssService } from "../components/wss/ws-service"
import { Message, User } from "../types"
import { AppService } from "./app-service"

export class ChatState {
    currentUserName: string = ''
    connectedAt: string = ''

    users: User[] = []

    chat: Message[] = []

    busy: boolean = false

    loginError: string = ''

    chatKey = 0

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn(): boolean {
        return !!this.currentUserName
    }

    get hasError(): boolean {
        return !!this.loginError
    }

    reset = () => {
        this.busy = false
        this.chat = []
        this.connectedAt = ''
        this.currentUserName = ''
        this.users = []
        this.loginError = ''
        this.chatKey = 0
    }
}

export const chatState = new ChatState()
export const appService = new AppService(chatState)

const wssService = new WssService(appService, chatState)

reaction(
    () => chatState.isLoggedIn,
    isLoggedIn => {
        if (isLoggedIn) {
            wssService.start()
            appService.getUsers()
            appService.getMessages()
        } else {
            wssService.stop()
        }
        console.log("Login state:", isLoggedIn)
    }
)
