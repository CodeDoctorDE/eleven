import React from 'react';
import { Card, CardCollection, GameState, PlayerHand, StateNames } from './../../shared';

export interface IGameContextProps {
    currentPlayer: string | undefined;
    gameState: StateNames | undefined;
    hand: Card[] | undefined;
    deckEmpty: boolean;
    collection: CardCollection | undefined;
    winner: string | undefined;
    // Key is player name, value is player hand count
    playersHandCount: { [key: string]: number };
    currentCardPlayed: Card | undefined;
    canPlay(card: Card): Promise<boolean>;
    playCard(cardIndex: number): void;
    endTurn(): void;
    takeCard(): void;
    startGame(): void;
    me: string | undefined;
    removeLastCard(): void;
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
    canPlay: () => Promise.resolve(false),
    playCard: () => { },
    endTurn: () => { },
    takeCard: () => { },
    startGame: () => { },
    removeLastCard: () => { }
};

export default React.createContext(defaultState);
