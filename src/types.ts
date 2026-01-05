import { CallbackQuery, Message } from "node-telegram-bot-api";

export type PossibleEvent = `${"commands" | "callbacks" | "states" | "updates"}${string}`;
export type RouteEvent = Map<string, Function>;

export interface Command {
    name: string,
    exec: (message: Message) => unknown;
}

export interface Callback {
    name: string,
    exec: (query: CallbackQuery, args: Array<string>) => unknown;
}

export interface State {
    name: string,
    exec: (message: Message, args: Array<string>) => unknown;
}

export interface ErrorState {
    name: string,
    exec: (chatId: number) => unknown;
}

export interface SingleBedMedia {
    media: string, 
    type: "photo" | "video"
}

export enum MessageType {
    Message = "text",
    Photo = "photo",
    Video = "video",
    Document = "document",
    Audio = "audio",
    Voice = "voice",
    Sticker = "sticker",
    VideoNote = "video_note"
}

export interface state {
    action: string,
    type: MessageType
    args?: Array<unknown>
}