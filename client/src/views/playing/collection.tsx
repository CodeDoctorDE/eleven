import React, { useContext } from 'react'
import gameContext from '../../context'

type Props = {}

export default function CollectionView({}: Props) {
  const context = useContext(gameContext);
    return <div>
        <p>Red</p>
        {context.collection?.redCollection.join(', ')}
        <p>Yellow</p>
        {context.collection?.yellowCollection.join(', ')}
        <p>Green</p>
        {context.collection?.greenCollection.join(', ')}
        <p>Blue</p>
        {context.collection?.blueCollection.join(', ')}
    </div>
}