import { Box, Group, ScrollArea } from '@mantine/core';
import React from 'react'
import { Card, isEqualCard } from '@eleven/shared';
import GameCard from './card';

type Props = {
    cards: Card[],
    selected?: Card,
    onClick?: (card: Card) => void
}

export default function CardsView({ cards, selected, onClick }: Props) {
    console.log(selected);
    return (<ScrollArea style={{ width: "100%" }}>
        <Group noWrap={true} spacing={1} style={{ overflowX: 'auto' }}>
            {cards.map((card) => {
                return <GameCard key={`${card.color}-${card.number}`} selected={selected ? isEqualCard(card, selected) : false} card={card} onClick={() => onClick?.(card)} />;
            })}
        </Group>
    </ScrollArea>
    )
}