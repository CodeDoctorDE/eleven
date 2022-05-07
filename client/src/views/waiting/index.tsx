import React, { useContext } from 'react'
import { Button } from '@mantine/core';
import gameContext from '../../context';

type Props = {}

export default function WaitingPage({ }: Props) {
    const gameService = useContext(gameContext);
    const play = () => {
        gameService.startGame();
    };
    return (
        <div>
            <p>Waiting</p>
            <p></p>
            <Button onClick={play}>Play</Button>
        </div>
    )
}