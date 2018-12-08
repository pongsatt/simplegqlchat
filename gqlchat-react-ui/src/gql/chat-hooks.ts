import { useEffect } from "react";
import { apolloClient } from "./client";
import gql from 'graphql-tag';
import { IMessage } from "../containers/Chats";

export type onReceive = (message: IMessage) => void;

function subscribeToMessage(channel: string, onReceive: onReceive) {
    return apolloClient.subscribe({
        query: gql`
          subscription Message($channel: String!) {
            message(channel: $channel) {
                sender
                channel
                text
            }
          }`,
        variables: {channel}
    }).subscribe({
        next(response) {
            onReceive(response.data.message);
        }
    });
}

function sendMessage(sender: string, channel: string, text: string) {
    return apolloClient.mutate({
        mutation: gql`
           mutation Send($sender: String!, $channel: String!, $text: String!) {
            sendMessage(sender: $sender, channel: $channel, text: $text) {
                sender
                channel
                text
            }
          }
        `,
        variables: {sender, channel, text}
    });
}

export const useChat = (sender: string, channel: string, onReceive: onReceive) => {
    useEffect(() => {
        const observer = subscribeToMessage(channel, onReceive);

        return () => observer.unsubscribe();
    });

    return (text: string) => sendMessage(sender, channel, text);
}