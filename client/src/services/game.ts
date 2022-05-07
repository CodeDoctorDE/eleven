import { Card } from '../../../shared';
import { Socket } from "socket.io-client";

class GameSerivce {
    public startGame(socket: Socket) {
        console.log("emit start game");
        socket.emit("start_game", {});
    }
    public canPlay(socket: Socket, card: Card): Promise<boolean> {
        socket.emit("can_play", card);
        return new Promise((rs, rj) => {
            socket.on("can_play", (data) => {
                console.log(data);
                rs(data);
            });
        });
    }
    public playCard(socket: Socket, cardIndex: number) {
        socket.emit("play_card", cardIndex);
    }
    public endTurn(socket: Socket): void {
        socket.emit("end_turn");
    }
    public takeCard(socket: Socket): void {
        socket.emit("take_card");
    }
    public removeLastCard(socket: Socket): void {
        socket.emit("remove_last_card");
    }
}
export default new GameSerivce();
