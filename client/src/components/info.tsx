import { Accordion, ActionIcon, Anchor, Text } from '@mantine/core'
import { useModals } from '@mantine/modals'
import React from 'react'

type Props = {}

export default function InfoButton({ }: Props) {
  const modals = useModals()
  const open = () => {
    modals.openModal({
      title: 'Info',
      children:
        <Accordion initialItem={0}>
          <Accordion.Item label="General">
            Linwood Eleven is a card game where you play against your friends.
          </Accordion.Item>

          <Accordion.Item label="How to play">
            Everyone starts with 5 cards.
            Every color starts with the 11.
            The player with the red 11 starts the game.
            If nobody has the red 11, the player with a yellow, green or blue 11 starts the game.
            If nobody has an eleven, a random player starts the game.
            The game is played in turns.
            Each turn, the player can either:
            <ul>
              <li>
                <Text>Play a card</Text>
              </li>
              <li>
                <Text>Take a card from the deck</Text>
              </li>
            </ul>
            You are not restrict how much cards you can play.
            Click on "End turn" to end your turn.
            The first player to reach 0 cards wins.
          </Accordion.Item>

          <Accordion.Item label="Source">
            This project is open source and you can find it on <Anchor href="https://github.com/CodeDoctorDE/eleven">github</Anchor>
          </Accordion.Item>
        </Accordion>
    })
  }
  return (
    <>
      <ActionIcon onClick={open} color="blue" size="lg" radius="md">
        <span className="material-symbols-rounded">info</span>
      </ActionIcon>
    </>
  )
}