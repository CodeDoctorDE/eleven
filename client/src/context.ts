import React from 'react';
import { Card, CardCollection } from '@eleven/shared';

export interface IGameContextProps {
    currentPlayer: string | undefined;
    gameState: string | undefined;
    hand: Card[] | undefined;
    deckEmpty: boolean;
    collection: CardCollection | undefined;
    winner: string | undefined;
    // Key is player name, value is player hand count
    playersHandCount: { [key: string]: number };
    players: string[];
    currentCardPlayed: Card | undefined;
    room: string | undefined;
    canPlay(card: Card): Promise<boolean>;
    playCard(cardIndex: number): void;
    endTurn(): void;
    takeCard(): void;
    startGame(): void;
    me: string | undefined;
    removeLastCard(): void;
    joinRoom(roomId: string, name: string): void;
    createRoom(name: string): void;
    leaveRoom(): void;
}

const defaultState: IGameContextProps = {
    gameState: 'waiting',
    hand: undefined,
    deckEmpty: false,
    collection: undefined,
    winner: undefined,
    currentPlayer: undefined,
    me: undefined,
    playersHandCount: {},
    currentCardPlayed: undefined,
    room: undefined,
    players: [],
    canPlay: () => Promise.resolve(false),
    playCard: () => { },
    endTurn: () => { },
    takeCard: () => { },
    startGame: () => { },
    removeLastCard: () => { },
    joinRoom: () => { },
    createRoom: () => { },
    leaveRoom: () => { }
};

export default React.createContext(defaultState);
