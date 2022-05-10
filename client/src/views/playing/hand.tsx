import React, { useContext } from 'react'
import gameContext from '../../context'
import { Card } from '@eleven/shared';
import { Button } from '@mantine/core';
import { getColor } from '../../asset';
import CardsView from '../../components/cards';

type Props = {}
export default function HandView({ }: Props) {
    const context = useContext(gameContext)
    const hand = context.hand;
    const play = async (card: Card) => {
        console.log('play', card);
        const index = hand?.indexOf(card);
        if (await context.canPlay(card) && index)
            context.playCard(index);
        else
            console.log("cannnot play this card");
    }
    return (
        <div>
            <p>Your hand</p>
            <CardsView selected={context.currentCardPlayed} cards={hand ?? []} onClick={play} />
            <Button onClick={() => context.takeCard()}>Take card {context.deckEmpty}</Button>
            <Button onClick={() => context.endTurn()}>End turn</Button>
            {/* <Button onClick={() => context.removeLastCard()}>Remove last card (CHEAT)</Button> */}
        </div>
    )
}