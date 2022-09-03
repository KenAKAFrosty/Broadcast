export type BroadcastMessage =
    | "Header button click"


type BroadcastMessages = {
    [Message in BroadcastMessage]: BroadcastMessage
}

const broadcastMessages: BroadcastMessages = {
    "Header button click": "Header button click",
}

export default broadcastMessages