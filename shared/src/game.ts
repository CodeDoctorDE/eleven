import { Card, CardCollection, CardColor, getAllCards } from './card';

export type StateNames = 'waiting' | 'playing' | 'end';
export abstract class GameState {
    constructor(public manager: GameStateManager) { }

    abstract get stateName(): StateNames;
}
export class PlayerHand {
    constructor(public player: string, public cards: Card[]) { }
}
export class GameStateManager {
    gameState: GameState;
    public players: string[] = [];

    constructor() {
        this.gameState = new GameStateWaiting(this);
    }

    public join(player: string): boolean {
        if (this.gameState instanceof GameStateWaiting) {
            this.gameState.join(player);
            return true;
        }
        return false;
    }
    public play() {
        if (!(this.gameState instanceof GameStatePlaying)) {
            this.gameState = new GameStatePlaying(this);
        }
    }

    public leave(player: string) {
        const index = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
        if (this.gameState instanceof GameStatePlaying) {
            this.gameState.onLeave(player);
        }
    }

}
const colors = ['red', 'yellow', 'green', 'blue'];
export class GameStatePlaying extends GameState {
    get stateName(): StateNames {
        return 'playing';
    }
    deck: Card[];
    hands: PlayerHand[];
    currentPlayer: string;
    hasPlayed: boolean = false;
    collection: CardCollection = new CardCollection([], [], [], []);

    constructor(manager: GameStateManager) {
        super(manager);
        this.init();
    }

    onLeave(player: string) {
        if (this.currentPlayer === player) {
            this.endTurn(true);
        }
        if (this.manager.players.length === 1) {
            this.win(null);
        }
    }

    private init() {
        const availableCards = getAllCards();
        // Shuffle the deck
        var j, x, i;
        for (i = availableCards.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = availableCards[i];
            availableCards[i] = availableCards[j];
            availableCards[j] = x;
        }
        // Deal the deck
        this.deck = availableCards;
        this.hands = [];
        for (const player of this.manager.players) {
            this.hands.push(new PlayerHand(player, this.deck.splice(0, 5)));
            this.sortHand(player);
        }
        // If red 11 is in the deck, remove it and add it to the collection
        const red11 = this.deck.find(c => c.number === 11 && c.color === 'red');
        if (red11) {
            this.collection.getCollection('red').push(11);
            this.deck.splice(this.deck.indexOf(red11), 1);
        }
        var firstPlayer: string | null;
        // Find the player with the red 11
        firstPlayer = this.hands.find(h => h.cards.find(c => c.number === 11 && c.color === 'red'))?.player;
        // If no player has the red 11, find the player with the yellow 11
        firstPlayer ??= this.hands.find(h => h.cards.find(c => c.number === 11 && c.color === 'yellow'))?.player;
        // If no player has the yellow 11, find the player with the green 11
        firstPlayer ??= this.hands.find(h => h.cards.find(c => c.number === 11 && c.color === 'green'))?.player;
        // If no player has the green 11, find the player with the blue 11
        firstPlayer ??= this.hands.find(h => h.cards.find(c => c.number === 11 && c.color === 'blue'))?.player;
        // If no player has the blue 11, select a random player
        firstPlayer ??= this.manager.players[Math.floor(Math.random() * this.manager.players.length)];
        this.currentPlayer = firstPlayer;

    }
    public sortHand(player?: string) {
        const hand = this.getHand(player);
        if (hand) {
            hand.cards.sort((a, b) => {
                if (a.color === b.color) {
                    return a.number - b.number;
                }
                return colors.indexOf(a.color) - colors.indexOf(b.color);
            });
        }
    }
    public getHand(player?: string): PlayerHand | undefined {
        if (player) {
            return this.hands.find(h => h.player === player);
        }
        return this.hands.find(h => h.player === this.currentPlayer);
    }
    public hasCard(card: Card): boolean {
        const hand = this.getHand();
        if (hand) {
            return hand.cards.find(c => c.number === card.number && c.color === card.color) !== undefined;
        }
        return false;
    }
    private addCard(card: Card) {
        const hand = this.getHand();
        if (hand) {
            hand.cards.push(card);
        }
    }
    private removeCard(card: Card) {
        const hand = this.getHand();
        if (hand) {
            const index = hand.cards.indexOf(card);
            if (index > -1) {
                hand.cards.splice(index, 1);
                return true;
            }
            this.testWin();
        }
        return false;
    }
    public testWin() {
        if (this.getHand()?.cards?.length === 0) {
            this.win(this.currentPlayer);
        }
        if (this.manager.players.length === 1) {
            this.win(this.manager.players[1]);
        }
        if (this.manager.players.length === 0) {
            this.win(null);
        }
    }
    public getCards() {
        const hand = this.getHand();
        if (hand) {
            return hand.cards;
        }
        return [];
    }
    public canPlay(card: Card): boolean {
        const collection = this.collection.getCollection(card.color);
        const before = card.number - 1;
        const after = card.number + 1;
        const canBefore = collection.indexOf(before) > -1;
        const canAfter = collection.indexOf(after) > -1;
        const isEleven = card.number === 11;
        return canBefore || canAfter || isEleven;
    }
    public playCard(card: Card) {
        if (this.hasCard(card)) {
            const collection = this.collection.getCollection(card.color);
            if (this.canPlay(card)) {
                collection.push(card.number);
                collection.sort((a, b) => a - b);
                this.hasPlayed = true;
                this.removeCard(card);
                this.testWin();
                return true;
            }
        }
        return false;
    }
    public endTurn(force?: boolean) {
        if (this.hasPlayed || (this.deck.length === 0) || force) {
            this.hasPlayed = false;
            this.currentPlayer = this.manager.players[(this.manager.players.indexOf(this.currentPlayer) + 1) % this.manager.players.length];
            return true;
        }
        return false;
    }
    public takeCardFromDeck() : Card | undefined {
        if (!this.hasPlayed) {
            const card = this.deck.pop();
            if (card) {
                this.addCard(card);
                this.sortHand();
                this.hasPlayed = true;
            }
            this.endTurn();
            return card;
        }
        return null;
    }
    private win(winner: string | null) {
        this.manager.gameState = new GameStateEnded(winner, this.manager);
    }
}
export class GameStateEnded extends GameState {
    get stateName(): StateNames {
        return 'end';
    }
    constructor(public winner: string, manager: GameStateManager) {
        super(manager);
    }
}
export class GameStateWaiting extends GameState {
    get stateName(): StateNames {
        return 'waiting';
    }

    public join(player: string) {
        if (this.manager.gameState instanceof GameStateWaiting) {
            this.manager.players.push(player);
        }
    }
}