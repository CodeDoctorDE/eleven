import { createStyles, Image } from '@mantine/core'
import { Card } from '@eleven/shared';
import React from 'react'
import { getCardAssetLocation } from '../asset';

type Props = {
  card: Card,
  selected?: boolean
  onClick?: () => void
}

const useStyles = createStyles((theme) => ({
  card: {
    borderRadius: '5px',
    padding: '2px',
    margin: '1px',
    cursor: 'pointer',
  },
  selected: {
    border: `2px solid ${theme.primaryColor}`,
    padding: 0
  }
}))



export default function GameCard({ card, selected, onClick }: Props) {
  const { classes, cx } = useStyles()
  return (
    <Image className={cx(classes.card,
      selected && classes.selected
    )} src={getCardAssetLocation(card)} height={"8em"} width={"6em"} onClick={onClick} />
  )
}