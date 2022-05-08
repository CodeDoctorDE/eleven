import React, { useContext } from 'react'
import { getColor } from '../../asset';
import gameContext from '../../context';
import { Card, CardColor } from '../../../../shared';

type Props = {}

export default function CollectionView({ }: Props) {
  const context = useContext(gameContext);
  return <div>
    <SingleCollection color="red" cards={context.collection?.redCollection} />
    <SingleCollection color="yellow" cards={context.collection?.yellowCollection} />
    <SingleCollection color="green" cards={context.collection?.greenCollection} />
    <SingleCollection color="blue" cards={context.collection?.blueCollection} />
  </div>
}

function SingleCollection({ color, cards }: { color: CardColor, cards: number[] | undefined }) {
  const context = useContext(gameContext);
  // Color name first letter to uppercase
  const colorName = color[0].toUpperCase() + color.slice(1);
  return (
    <div style={{ color: getColor(color) }}>
      {colorName}
      <p>
        {cards && cards?.length != 0 && cards?.map<React.ReactNode>((card, index) =>
          <span style={{ fontWeight: context.currentCardPlayed?.color === color && context.currentCardPlayed.number === card ? 'bold' : 'normal' }} key={`${card}`}>{card}</span>)
          .reduce((prev, curr) => [prev, ', ', curr])}
      </p>
    </div>
  )
}