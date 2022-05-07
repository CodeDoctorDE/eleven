import React, { useContext } from 'react'
import gameContext from '../../context'

export default function PlayersView() {
    const context = useContext(gameContext);
    console.log(context.playersHandCount);
    if (!context.playersHandCount) {
        return <div>No players</div>
    }
    const players = Object.keys(context.playersHandCount);
    return (
        <>
            <p>You are {context.me}</p>
            {context.me === context.currentPlayer && <div>It is your turn</div>}
            <p>Current player {context.currentPlayer}</p>
            <ul>{players.map((value) => <li key={value}>{value} ({context.playersHandCount[value]})</li>)}</ul>
        </>
    )
}