import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
import { Card, GameStateManager, GameStateWaiting, GameStatePlaying, GameStateEnded } from '@eleven/shared';
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.get('/', (req, res) => {
    res.send('Eleven server is running!');
});


const games: { [key: string]: GameStateManager } = {};

function getLastValue(set: Set<string>): string {
    let value;
    for (value of set);
    return value;
}

io.on('connection', (socket) => {
    console.log('a user connected');

    const getRoom = (): string => {
        // Get room of current player
        return getLastValue(socket.rooms);
    }
    const getGame = (): GameStateManager | undefined => {
        const room = getRoom();
        if (room in games) {
            return games[room];
        }
        return undefined;
    }
    const broadcastGameState = () => {
        const game = getGame();
        console.log('broadcasting game state', game?.gameState.stateName);
        io.emit('game_state_changed', game?.gameState.stateName);
        const state = game?.gameState;
        if (state instanceof GameStateEnded) {
            io.emit('winner', state.winner);
        }
    }

    const broadcastCollectionChanged = () => {
        const game = getGame();
        const state = game?.gameState;
        if (state instanceof GameStatePlaying) {
            io.emit('collection_changed', state.collection);
        }
    }

    const broadcastCurrentPlayer = () => {
        const game = getGame();
        const state = game?.gameState;
        if (state instanceof GameStatePlaying) {
            io.emit('current_player_changed', state.currentPlayer);
        }
    }

    const sendOthersPlayersHandCount = () => {
        const game = getGame();
        const state = game?.gameState;
        if (state instanceof GameStatePlaying) {
            const players = game?.players;
            players.forEach(socketId => {
                const current = io.sockets.sockets.get(socketId);
                const result = state.hands.filter(hand => hand.player !== socketId);
                // Key is the player's socket id, value is the number of cards in their hand
                const playersHand: { [key: string]: number } = {};
                result.forEach(hand => {
                    playersHand[hand.player] = hand.cards.length;
                });
                current.emit('players_hand_count_changed', playersHand);
            });
        }
    }

    const sendCurrentHand = () => {
        const game = getGame();
        const state = game?.gameState;
        if (state instanceof GameStatePlaying) {
            const hand = state.getHand(socket.id);
            if (hand) {
                socket.emit('hand_changed', hand.cards);
            }
        }
    }
    const handleCurrentCardPlayed = (card?: Card, hidden?: boolean) => {
        if (hidden) {
            socket.broadcast.emit('current_card_played', undefined);
            socket.emit('current_card_played', card);
        } else {
            io.emit('current_card_played', card);
        }
    }
    const inRoom = (): boolean => {
        return socket.rooms.size > 1;
    }
    const leaveRooms = () => {
        socket.rooms.forEach(room => {
            if (room !== socket.id) {
                broadcastPlayersUpdated(room);
                socket.leave(room);
            }
        });
    }
    const broadcastPlayersUpdated = async (room: string) => {
        const sockets = io.sockets.adapter.rooms.get(room);
        io.to(room).emit('players_updated', Array.from(sockets.values()));
    }

    socket.on('join_room', (roomId: string) => {
        if (inRoom()) {
            leaveRooms();
        }
        if (roomId.length == 5 && roomId in games) {
            socket.join(roomId);
            socket.emit('room_joined', roomId);
            games[roomId].join(socket.id);
            broadcastGameState();
            broadcastPlayersUpdated(roomId);
        }
    });
    socket.on('create_room', () => {
        if (inRoom()) {
            leaveRooms();
        }
        // Create a random room id made of 5 random characters (A-Z, 0-9)
        const roomId = Math.random().toString(36).substring(2, 7);
        if (roomId in games) {
            return;
        }
        games[roomId] = new GameStateManager();
        games[roomId].join(socket.id);
        console.log('creating room', roomId);
        socket.join(roomId);
        socket.emit('room_joined', roomId);
        broadcastPlayersUpdated(roomId);
    });
    socket.on('leave_room', () => {
        if (inRoom()) {
            leaveRooms();
        }
        socket.emit('room_joined', undefined);
    });



    socket.on('start_game', () => {
        const game = getGame();
        const state = game?.gameState;
        console.log('start game?', state);
        if (!(state instanceof GameStatePlaying) && game?.players.length > 1) {
            console.log('start game');
            game?.play();
            broadcastGameState();
            const sockets = game?.players;
            const playingState = game?.gameState;
            if (playingState instanceof GameStatePlaying) {
                sockets.forEach(socketId => {
                    console.log(socketId);
                    const socket = io.sockets.sockets.get(socketId);
                    if (socket) {
                        socket.emit('hand_changed', playingState.getHand(socketId)?.cards);
                    }
                    const result = playingState.hands.filter(hand => hand.player !== socketId);
                    // Key is the player's socket id, value is the number of cards in their hand
                    const playersHand: { [key: string]: number } = {};
                    result.forEach(hand => {
                        playersHand[hand.player] = hand.cards.length;
                    });
                    socket.emit('players_hand_count_changed', playersHand);
                });
                broadcastCollectionChanged();
                broadcastCurrentPlayer();
            }
        }
    });
    socket.on('take_card', () => {
        const game = getGame();
        const state = game?.gameState;
        if (state instanceof GameStatePlaying) {
            if (state.currentPlayer === socket.id && !state.hasPlayed) {
                const card = state.takeCardFromDeck();
                handleCurrentCardPlayed(card, true);
                sendCurrentHand();
                sendOthersPlayersHandCount();
                broadcastCurrentPlayer();
                if (state.deck.length === 0) {
                    io.emit('deck_empty');
                }
            }
        }
    });
    socket.on('end_turn', () => {
        const game = getGame();
        const state = game?.gameState;
        if (state instanceof GameStatePlaying) {
            if (state.currentPlayer === socket.id) {
                state.endTurn();
                broadcastCurrentPlayer();
            }
        }
    });
    socket.on('can_play', (data) => {
        const game = getGame();
        const state = game?.gameState;
        if (state instanceof GameStatePlaying) {
            if (state.currentPlayer === socket.id) {
                console.log('can play?', data, state.canPlay(data));
                socket.emit('can_play', state.canPlay(data));
            }
        }
    });
    socket.on('play_card', (cardIndex: number) => {
        const game = getGame();
        const state = game?.gameState;
        if (state instanceof GameStatePlaying) {
            if (state.currentPlayer === socket.id) {
                const hand = state.getHand();
                if (hand) {
                    const card = hand.cards[cardIndex];
                    console.log('play card', hand.cards, cardIndex, card);
                    if (card) {
                        state.playCard(card);
                        broadcastCollectionChanged();
                        handleCurrentCardPlayed(card, false);
                        sendOthersPlayersHandCount();
                        sendCurrentHand();
                        broadcastGameState();
                    }
                }
            }
        }
    })
    socket.on('remove_last_card', () => {
        const game = getGame();
        const state = game?.gameState;
        if (state instanceof GameStatePlaying) {
            if (state.currentPlayer === socket.id) {
                console.log('remove last card');
                const hand = state.getHand();
                if (hand) {
                    hand.cards.pop();
                    state.hasPlayed = true;
                    state.testWin();
                    sendCurrentHand();
                    broadcastGameState();
                }
            }
        }
    })

    socket.on('disconnect', () => {
        const game = getGame();
        console.log('user disconnected');
        game?.leave(socket.id);
        broadcastGameState();
    });

});
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
