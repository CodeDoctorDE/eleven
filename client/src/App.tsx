import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import 'material-symbols/rounded.css';
import socketService from './services/socket';
import gameService from './services/game';
import GameContext, { IGameContextProps } from './context';
import { Card, CardCollection } from '@eleven/shared';
import WaitingPage from './views/waiting';
import PlayingPage from './views/playing';
import FinishedPage from './views/finished';
import socket from './services/socket';
import RoomPage from './views/room';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

const endpoint = import.meta.env.VITE_API_ENDPOINT ?? 'eleven-backend.linwood.dev';

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  const [gameState, setGameState] = useState<string | undefined>();
  const [collection, setCollection] = useState<CardCollection | undefined>();
  const [deckEmpty, setDeckEmpty] = useState(false);
  const [hand, setHand] = useState<Card[] | undefined>();
  const [me, setMe] = useState<string>();
  const [winner, setWinner] = useState<string | undefined>();
  const [currentPlayer, setCurrentPlayer] = useState<string | undefined>();
  const [players, setPlayers] = useState<string[]>([]);
  const [playersHandCount, setPlayersHandCount] = useState<{ [key: string]: number }>({});
  const [currentCardPlayed, setCurrentCardPlayed] = useState<Card | undefined>();
  const [room, setRoom] = useState<string | undefined>();
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
    socketService.socket?.on('room_joined', (data) => {
      console.log('room joined', data);
      setRoom(data);
    });
    socketService.socket?.on('players_updated', (data) => {
      console.log('players updated', data);
      setPlayers(data);
    })
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
    room,
    players,
    me,
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
    },
    joinRoom: async (room: string, name: string) => {
      if (socketService.socket) {
        setMe(name);
        return gameService.joinRoom(socketService.socket, room, name);
      }
      return false;
    },
    leaveRoom: async () => {
      if (socketService.socket)
        return gameService.leaveRoom(socketService.socket);
      setRoom(undefined);
      return false;
    },
    createRoom: async (name: string) => {
      if (socketService.socket) {
        setMe(name);
        return gameService.createRoom(socketService.socket, name);
      }
      return false;
    }
  }

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <GameContext.Provider value={gameContextValue}>
            {room && <>
              {gameState === 'waiting' && <WaitingPage />}
              {gameState === 'playing' && <PlayingPage />}
              {gameState === 'end' && <FinishedPage />}
            </>}
            {!room && <RoomPage />}
          </GameContext.Provider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
