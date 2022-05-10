import React, { useContext } from 'react'
import gameContext from '../../context'
import { Card as GameCard } from '@eleven/shared';
import { Button, Card, createStyles, Group } from '@mantine/core';
import { getColor } from '../../asset';
import CardsView from '../../components/cards';

const useStyles = createStyles((theme) => ({
    button: {
        borderRadius: 0,

        '&:not(:first-of-type)': {
            borderLeftWidth: 0,
        },

        '&:first-of-type': {
            borderTopLeftRadius: theme.radius.sm,
            borderBottomLeftRadius: theme.radius.sm,
        },

        '&:last-of-type': {
            borderTopRightRadius: theme.radius.sm,
            borderBottomRightRadius: theme.radius.sm,
        },
    },
}));
type Props = {}
export default function HandView({ }: Props) {
    const { classes } = useStyles();
    const context = useContext(gameContext)
    const hand = context.hand;
    const play = async (card: GameCard) => {
        console.log('play', card);
        const index = hand?.indexOf(card);
        if (await context.canPlay(card) && index)
            context.playCard(index);
        else
            console.log("cannnot play this card");
    }
    return (
        <Card>
            <p>Your hand</p>
            <CardsView selected={context.currentCardPlayed} cards={hand ?? []} onClick={play} />
            <Group mt={16} grow spacing={0}>
                <Button className={classes.button} color="cyan" onClick={() => context.takeCard()}>Take card {context.deckEmpty}</Button>
                <Button className={classes.button} color="grape" onClick={() => context.endTurn()}>End turn</Button>
            </Group>
            {/* <Button onClick={() => context.removeLastCard()}>Remove last card (CHEAT)</Button> */}
        </Card>
    )
}