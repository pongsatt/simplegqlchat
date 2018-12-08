import * as React from 'react';
import { useChat } from '../gql/chat-hooks';

const InputMessage = ({onSend}: {onSend: (text: string) => void}) => {
    const [text, setText] = React.useState('');

    return (
        <>
            <input value={text} onChange={e => setText(e.target.value)}/>
            <button onClick={() => {
                onSend(text);
                setText('');
            }}>Send</button>
        </>
    );
}

export type IMessage = {sender: string, text: string};

const MessageList = ({messages, currentSender}: {messages: IMessage[], currentSender: string}) => {
    return (
        <ul>
            {messages.map((m, i) => m.sender === currentSender?
                <div key={i} style={{textAlign: 'right'}}>{m.text} : <b>me</b></div>:
                <div key={i}><b>{m.sender}</b> : {m.text}</div>
                )}
        </ul>
    );
}

const currentSender = 'sender' + Math.floor(Math.random() * 10);

export default () => {
    const [messages, setMessages] = React.useState<IMessage[]>([]);

    const sendMessage = useChat(currentSender, 'test', (msg: IMessage) => {
        addMessage(msg);
    });

    const addMessage = (msg: IMessage) => {
        setMessages(prevMessages => [...prevMessages, msg]);
    }

    return (
        <div style={{width: 200}}>
            <InputMessage onSend={text => (sendMessage(text))}/>
            <MessageList currentSender={currentSender} messages={messages}/>
        </div>
    );
}