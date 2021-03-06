import { Group, SimpleGrid, Stack } from '@mantine/core'
import React from 'react'
import CollectionView from './collection'
import HandView from './hand'
import PlayersView from './players'

type Props = {}

export default function PlayingPage({ }: Props) {
  return (
    <div>
      <SimpleGrid cols={2} breakpoints={[{cols: 1, maxWidth: "sm"}]}>
        <Stack style={{minWidth: 300}}>
          <PlayersView />
          <CollectionView />
        </Stack>
        <div style={{minWidth: 300}}>
          <HandView />
        </div>
      </SimpleGrid>

    </div>
  )
}