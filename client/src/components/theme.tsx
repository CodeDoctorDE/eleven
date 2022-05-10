import { Accordion, ActionIcon, Anchor, Text, useMantineColorScheme } from '@mantine/core'
import { useModals } from '@mantine/modals'
import React from 'react'

type Props = {}

export default function ThemeButton({ }: Props) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    return (
        <>
            <ActionIcon onClick={() => toggleColorScheme()} color={dark ? 'yellow' : 'blue'} size="lg" radius="md">
                <span className="material-symbols-rounded">{dark ? 'dark_mode' : 'light_mode'}</span>
            </ActionIcon>
        </>
    )
}