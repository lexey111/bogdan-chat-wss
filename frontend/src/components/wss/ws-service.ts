import { AppService, ChatState } from "../../state";

const server = import.meta.env.VITE_SERVER;
const wss_port = import.meta.env.VITE_WSS_PORT;

const wssEndpoint = `http://${server}:${wss_port}`;

export class WssService {
    private socket: WebSocket | undefined;
    private interval: ReturnType<typeof setInterval> = 0

    constructor(private service: AppService, private state: ChatState) {
        //
    }

    updateChat = () => {
        clearTimeout(this.interval)
        this.interval = setInterval(() => {
            this.state.chatKey += 1
        }, 1000 * 60);
    }

    start = () => {
        this.socket = new WebSocket(wssEndpoint);
        console.log('Run WSS on', wssEndpoint);

        this.socket.addEventListener('open', () => {
            console.log('Connected to WebSocket server at', wssEndpoint);
            this.updateChat()
    });

        // Event listener for incoming messages
        this.socket.addEventListener('message', (event) => {
            if (event.data === '[Users]') {
                this.service.getUsers()
            }

            if (event.data === '[Messages]') {
                this.service.getMessages()
                this.updateChat()
            }
        });
    }

    stop = () => {
        clearTimeout(this.interval)

        if (!this.socket) {
            return
        }

        this.socket.close()
    }

}