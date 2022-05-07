import React, { useContext } from 'react'
import gameContext from '../../context'
import { Card } from '../../../../shared';
import { Button } from '@mantine/core';

type Props = {}
const colors = {'red': '#a40038', 'yellow': '#df892e', 'green': '#4e7026', 'blue': '#09177e'};
export default function HandView({ }: Props) {
    const context = useContext(gameContext)
    const play = async (index: number, card: Card) => {
        console.log('play', card);
        if (await context.canPlay(card))
            context.playCard(index);
        else
            console.log("cannnot play this card");
    }
    const hand = context.hand;
    return (
        <div>
            <p>Your hand</p>
            <ul>{hand?.map((value, index) => <li style={{color: colors[value.color]}} key={`${value.color}-${value.number}`} onClick={() => play(index, value)}>{value.number}</li>)}</ul>
            <Button onClick={() => context.takeCard()}>Take card {context.deckEmpty}</Button>
            <Button onClick={() => context.endTurn()}>End turn</Button>
            {/* <Button onClick={() => context.removeLastCard()}>Remove last card (CHEAT)</Button> */}
        </div>
    )
}