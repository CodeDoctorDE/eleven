import { io, Socket } from "socket.io-client";

export class SocketService {
    public socket : Socket | null = null;

    public connect(url : string) {
        if(this.socket) {
            this.disconnect();
        }
        this.socket = io(url);
        return new Promise((rs, rj) => {
            this.socket?.on("connect", () => rs(true));
            this.socket?.on("connect_error", () => rj(false));
        });
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
    public isConnected() : boolean {
        return this.socket !== null;
    }
}

export default new SocketService();