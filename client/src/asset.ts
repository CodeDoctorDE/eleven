import { Card, CardColor } from '@eleven/shared';

export const colors : {[key : string]: string} = { 'red': '#a40038', 'yellow': '#df892e', 'green': '#4e7026', 'blue': '#09177e' };
export const getCardAssetLocation = (card: Card) => `/src/assets/cards/${card.color}/${card.number}.svg`;
export const getColorNames = () => Object.keys(colors);
export const getColor = (name: CardColor): string => colors[name];
