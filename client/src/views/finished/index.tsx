import { Button } from '@mantine/core'
import React, { useContext } from 'react'
import gameContext from '../../context'

type Props = {}

export default function FinishedPage({ }: Props) {
  const context = useContext(gameContext)
  return (<>
    <div>Congratulations {context.winner}! {context.winner === context.currentPlayer && <>You won!</>}</div>
    <Button onClick={() => context.startGame()}>Play again</Button>
  </>)
}