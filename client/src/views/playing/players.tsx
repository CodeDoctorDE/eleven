import { Card, Table, Text } from '@mantine/core';
import React, { useContext } from 'react'
import gameContext from '../../context'

export default function PlayersView() {
    const context = useContext(gameContext);
    console.log(context.playersHandCount);
    if (!context.playersHandCount) {
        return <div>No players</div>
    }
    const players = Object.keys(context.playersHandCount);
    const rows = players.map(player => {
        const hand = context.playersHandCount[player];
        return <tr key={player}>
            <td><Text color={
                player === context.currentPlayer ? 'cyan' : undefined
            }>{player}</Text></td>
            <td>{hand}</td>
        </tr>
    });
    return (<Card>
        <Text color={
            context.currentPlayer === context.me ? 'cyan' : undefined
        }>You are {context.me}</Text>
        <Table striped>
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Cards</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </Table>
    </Card>)
}