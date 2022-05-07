import { Group } from '@mantine/core'
import React from 'react'
import CollectionView from './collection'
import HandView from './hand'
import PlayersView from './players'

type Props = {}

export default function PlayingPage({ }: Props) {
  return (
    <div>
      <Group grow noWrap={false}>
        <div style={{minWidth: 300}}>
          <PlayersView />
          <CollectionView />
        </div>
        <div style={{minWidth: 300}}>
          <HandView />
        </div>
      </Group>

    </div>
  )
}