import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import socketService from './services/socket';
import gameService from './services/game';
import GameContext, { IGameContextProps } from './context';
import { Card, CardCollection, PlayerHand, StateNames } from '../../shared';
import WaitingPage from './views/waiting';
import PlayingPage from './views/playing';
import FinishedPage from './views/finished';
import socket from './services/socket';

const endpoint = import.meta.env.API_ENDPOINT ??'eleven-backend.linwood.dev';

function App() {
  const [gameState, setGameState] = useState<StateNames | undefined>();
  const [collection, setCollection] = useState<CardCollection | undefined>();
  const [deckEmpty, setDeckEmpty] = useState(false);
  const [hand, setHand] = useState<Card[] | undefined>();
  const [winner, setWinner] = useState<string | undefined>();
  const [currentPlayer, setCurrentPlayer] = useState<string | undefined>();
  const [playersHandCount, setPlayersHandCount] = useState<{ [key: string]: number }>({});
  const [currentCardPlayed, setCurrentCardPlayed] = useState<Card | undefined>();
  const connect = async () => {
    console.log(`connecting to ${endpoint}`);
    const connected = socketService.connect(endpoint);
    setGameState('waiting');
    setDeckEmpty(false);
    console.log('connected to socket');
    socketService.socket?.on('game_state_changed', (data) => {
      console.log('game state changed', data);
      setGameState(data);
    });
    socketService.socket?.on('collection_changed', (data) => {
      console.log('collection changed', data);
      setCollection(data);
    });
    socketService.socket?.on('deck_empty', () => {
      console.log('deck empty');
      setDeckEmpty(true);
    });
    socketService.socket?.on('hand_changed', (data) => {
      console.log('hand changed', data);
      setHand(data);
    });
    socketService.socket?.on('winner', (data) => {
      console.log('winner', data);
      setWinner(data);
    });
    socketService.socket?.on('current_player_changed', (data) => {
      console.log('current player changed', data);
      setCurrentPlayer(data);
    });
    socketService.socket?.on('players_hand_count_changed', (data) => {
      console.log('players hand count changed', data);
      setPlayersHandCount(data);
    });
    socketService.socket?.on('current_card_played', (data) => {
      console.log('current card played', data);
      setCurrentCardPlayed(data);
    });
    socketService.socket?.on('disconnect', () => {
      console.log('disconnected');
      setGameState(undefined);
    });
    console.log(`connected: ${await connected}`);
  }
  useEffect(() => {
    connect();
  }, []);


  const gameContextValue: IGameContextProps = {
    gameState,
    collection,
    deckEmpty,
    hand,
    winner,
    currentPlayer,
    playersHandCount,
    currentCardPlayed,
    me: socketService?.socket?.id,
    canPlay: async (card: Card) => {
      if (socketService.socket)
        return gameService.canPlay(socketService.socket, card);
      return false;
    },
    playCard: async (cardIndex: number) => {
      if (socketService.socket)
        return gameService.playCard(socketService.socket, cardIndex);
      return false;
    },
    endTurn: async () => {
      if (socketService.socket)
        return gameService.endTurn(socketService.socket);
      return false;
    },
    startGame: async () => {
      if (socketService.socket)
        return gameService.startGame(socketService.socket);
      return false;
    },
    takeCard: async () => {
      if (socketService.socket)
        return gameService.takeCard(socketService.socket);
      return false;
    },
    removeLastCard: async () => {
      if (socketService.socket)
        return gameService.removeLastCard(socketService.socket);
      return false;
    }

  }

  return (
    <GameContext.Provider value={gameContextValue}>
      {gameState === 'waiting' && <WaitingPage />}
      {gameState === 'playing' && <PlayingPage />}
      {gameState === 'end' && <FinishedPage />}
    </GameContext.Provider>
  );
}

export default App;
