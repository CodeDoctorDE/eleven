import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
import { Card, GameStateManager, GameStateWaiting, GameStatePlaying, GameStateEnded } from '../../shared';
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.get('/', (req, res) => {
    res.send('Eleven server is running!');
});

const gameStateManager = new GameStateManager();


io.on('connection', (socket) => {
    console.log('a user connected');
    const broadcastGameState = () => {
        console.log('broadcasting game state', gameStateManager.gameState.stateName);
        io.emit('game_state_changed', gameStateManager.gameState.stateName);
        const state = gameStateManager.gameState;
        if (state instanceof GameStateEnded) {
            io.emit('winner', state.winner);
        }
    }

    const broadcastCollectionChanged = () => {
        const state = gameStateManager.gameState;
        if (state instanceof GameStatePlaying) {
            io.emit('collection_changed', state.collection);
        }
    }

    const broadcastCurrentPlayer = () => {
        const state = gameStateManager.gameState;
        if (state instanceof GameStatePlaying) {
            io.emit('current_player_changed', state.currentPlayer);
        }
    }

    const sendOthersPlayersHandCount = () => {
        const state = gameStateManager.gameState;
        if (state instanceof GameStatePlaying) {
            const players = gameStateManager.players;
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
        const state = gameStateManager.gameState;
        if (state instanceof GameStatePlaying) {
            const hand = state.getHand(socket.id);
            if (hand) {
                socket.emit('hand_changed', hand.cards);
            }
        }
    }
    const handleCurrentCardPlayed = (card?: Card, hidden?: boolean) => {
        if (hidden) {
            socket.emit('current_card_played', card);
            socket.broadcast.emit('current_card_played', undefined);
        } else {
            io.emit('current_card_played', card);
        }
    }
    const state = gameStateManager.gameState;
    console.log(state);
    console.log(state instanceof GameStateWaiting);
    if (state instanceof GameStateWaiting) {
        state.join(socket.id);
        broadcastGameState();
    } else {
        socket.disconnect();
    }

    socket.on('start_game', () => {
        console.log('start game?');
        const state = gameStateManager.gameState;
        if (!(state instanceof GameStatePlaying) && gameStateManager.players.length > 1) {
            console.log('start game');
            gameStateManager.play();
            broadcastGameState();
            const sockets = gameStateManager.players;
            const playingState = gameStateManager.gameState;
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
        const state = gameStateManager.gameState;
        if (state instanceof GameStatePlaying) {
            if (state.currentPlayer === socket.id && !state.hasPlayed) {
                const card = state.takeCardFromDeck();
                sendCurrentHand();
                sendOthersPlayersHandCount();
                broadcastCurrentPlayer();
                handleCurrentCardPlayed(card, true);
                if (state.deck.length === 0) {
                    io.emit('deck_empty');
                }
            }
        }
    });
    socket.on('end_turn', () => {
        const state = gameStateManager.gameState;
        if (state instanceof GameStatePlaying) {
            if (state.currentPlayer === socket.id) {
                state.endTurn();
                broadcastCurrentPlayer();
            }
        }
    });
    socket.on('can_play', (data) => {
        const state = gameStateManager.gameState;
        if (state instanceof GameStatePlaying) {
            if (state.currentPlayer === socket.id) {
                console.log('can play?', data, state.canPlay(data));
                socket.emit('can_play', state.canPlay(data));
            }
        }
    });
    socket.on('play_card', (cardIndex: number) => {
        const state = gameStateManager.gameState;
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
        const state = gameStateManager.gameState;
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
        console.log('user disconnected');
        gameStateManager.leave(socket.id);
        if (gameStateManager.players.length === 0) {
            gameStateManager.gameState = new GameStateWaiting(gameStateManager);
            broadcastGameState();
        }
    });

});
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
