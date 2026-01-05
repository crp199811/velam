const mediaGroupStates = new Map<string, {
    timeoutId?: NodeJS.Timeout,
    medias: string[],
    media_types: Array<"photo" | "video">, 
    caption: string,
    message_id: number
}>();

export default mediaGroupStates;