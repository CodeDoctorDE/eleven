import { Button, Card, Container, createStyles, Divider, Group, Text, TextInput, Title } from '@mantine/core'
import { useContext, useState } from 'react';
import gameContext from '../../context';

type Props = {}
const useStyles = createStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
    },
    content: {
        width: '100%',
    }
}));
export default function RoomView({ }: Props) {
    const { classes } = useStyles();
    const context = useContext(gameContext);
    const start = () => {
        context.startGame();
    }
    return (
        <Container className={classes.root} size="xs">
            <Card shadow={"sm"} className={classes.content}>
                <Title>{context.room}</Title>
                <Text mb={"md"} align="center">Waiting for players...</Text>
                <ul>
                    {context.players.map((player, index) => <li key={player}>{player}</li>)}
                </ul>
                <Divider m={"md"} />
                {context.players.length > 1 && <Button fullWidth onClick={start}>Start</Button>}
            </Card>
        </Container>
    )
}