import { Card } from '../../shared';

export const getCardAssetLocation = (card: Card) => `/assets/cards/${card.color}/${card.number}.png`;