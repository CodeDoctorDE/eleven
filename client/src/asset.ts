import { CardColor } from './../../shared/src/card';
import { Card } from '../../shared';

export const colors : {[key : string]: string} = { 'red': '#a40038', 'yellow': '#df892e', 'green': '#4e7026', 'blue': '#09177e' };
export const getCardAssetLocation = (card: Card) => `/assets/cards/${card.color}/${card.number}.png`;
export const getColorNames = () => Object.keys(colors);
export const getColor = (name: CardColor): string => colors[name];
