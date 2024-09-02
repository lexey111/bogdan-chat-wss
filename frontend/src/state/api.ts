import { Message, User } from "../types";

const server = import.meta.env.VITE_SERVER;
const port = import.meta.env.VITE_PORT;

const loginEndpoint = `http://${server}:${port}/login`;
const logoutEndpoint = `http://${server}:${port}/logout`;

const usersEndpoint = `http://${server}:${port}/users`;

const sendMessageEndpoint = `http://${server}:${port}/message`;
const getMessagesEndpoint = `http://${server}:${port}/message`;

export const api = {
    tryLoginToServer: async (name: string): Promise<{ name: string, connectedAt: string } | { error: string }> => {
        let result: { error: string } | User

        console.log('login', name);

        try {
            const response = await fetch(loginEndpoint, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            })

            const data: any = await response.json()

            console.log('Server response', data);

            if (data.error) {
                result = {
                    error: data.error
                }
            } else {
                if (data.name && data.connectedAt) {
                    result = {
                        name: data.name,
                        connectedAt: data.connectedAt
                    }
                } else {
                    result = {
                        error: 'Invalid response format'
                    }
                }
            }
        } catch (e) {
            console.error(e);
            result = {
                error: 'Connection refused'
            }
        }
        return result
    },

    tryLogout: async (name: string): Promise<void> => {
        console.log('logout', name);

        try {
            await fetch(logoutEndpoint, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            })

        } catch (e) {
            console.error(e);
        }
    },

    getUsers: async (): Promise<User[] | null> => {
        let result

        try {
            const response = await fetch(usersEndpoint, {
                method: "GET",
            })

            const data = await response.json()

            if (!data || !data.users) {
                throw new Error('Invalid data!')
            }

            result = data.users
        } catch (e) {
            console.error(e);
            result = null
        }
        return result
    },

    sendMessage: async (name: string, message: string): Promise<boolean> => {
        let result = true

        try {
            const response: any = await fetch(sendMessageEndpoint, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, message })
            })

            if (response.error) {
                console.log('Error:', response.error);
                result = false
            }
        } catch (e) {
            console.error(e);
            result = false
        }
        return result
    },

    getMessages: async (): Promise<Message[] | null> => {
        let result

        try {
            const response = await fetch(getMessagesEndpoint, {
                method: "GET",
            })

            const data = await response.json()

            if (!data || !data.messages) {
                throw new Error('Invalid data!')
            }

            result = data.messages
        } catch (e) {
            console.error(e);
            result = null
        }
        return result
    }
}