import { Button, Card, Container, createStyles, Divider, Group, TextInput, Title } from '@mantine/core'
import { useContext, useState } from 'react';
import InfoButton from '../../components/info';
import ThemeButton from '../../components/theme';
import gameContext from '../../context';

type Props = {}
const useStyles = createStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
    }
}));
export default function RoomView({ }: Props) {
    const { classes } = useStyles();
    const [room, setRoom] = useState('');
    const context = useContext(gameContext);
    const join = () => {
        context.joinRoom(room);
    }
    const create = () => {
        context.createRoom();
    }
    return (
        <Container className={classes.root} size="xs">
            <Card shadow={"sm"}>
                <Group>
                    <Title style={{ flex: 1 }} align="center">Welcome on Linwood Eleven</Title>
                    <InfoButton />
                    <ThemeButton />
                </Group>
                <TextInput label="Name" mb={"md"} />
                <Group align="flex-end" spacing={"md"}>
                    <TextInput value={room} style={{ flex: 1 }} label="Room" onChange={(event) => setRoom(event.target.value)} />
                    <Button onClick={join}>Join</Button>
                </Group>
                <Divider m={"md"} />
                <Button fullWidth variant='outline' onClick={create}>Create</Button>
            </Card>
        </Container>
    )
}