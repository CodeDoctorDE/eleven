import React, { useContext } from 'react'
import { getColor } from '../../asset';
import gameContext from '../../context'

type Props = {}

export default function CollectionView({}: Props) {
  const context = useContext(gameContext);
    return <div>
        <p>Red</p>
        <p style={{color: getColor('red')}}>{context.collection?.redCollection.join(', ')}</p>
        <p>Yellow</p>
        <p style={{color: getColor('yellow')}}>{context.collection?.yellowCollection.join(', ')}</p>
        <p>Green</p>
        <p style={{color: getColor('green')}}>{context.collection?.greenCollection.join(', ')}</p>
        <p>Blue</p>
        <p style={{color: getColor('blue')}}>{context.collection?.blueCollection.join(', ')}</p>
    </div>
}