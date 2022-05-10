import React, { useContext } from 'react'
import gameContext from '../../context';
import { Card as ElevenCard, CardNumber } from '@eleven/shared';
import CardsView from '../../components/cards';

type Props = {}

export default function CollectionView({ }: Props) {
  const context = useContext(gameContext);
  return <>
    <CardsView selected={context.currentCardPlayed} cards={context.collection?.redCollection.map((number) => ({ color: 'red', number }) as ElevenCard) ?? []} />
    <CardsView selected={context.currentCardPlayed} cards={context.collection?.yellowCollection.map((number) => ({ color: 'yellow', number }) as ElevenCard) ?? []} />
    <CardsView selected={context.currentCardPlayed} cards={context.collection?.greenCollection.map((number) => ({ color: 'green', number }) as ElevenCard) ?? []} />
    <CardsView selected={context.currentCardPlayed} cards={context.collection?.blueCollection.map((number) => ({ color: 'blue', number }) as ElevenCard) ?? []} />
  </>
}
