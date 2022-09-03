import { BroadcastMessage } from "./messages";

/**
 * Broadcasts a message that can be subscribed to by any component in any hierarchy. 
 * This is most suitable for events. 
 * 
 * Avoid attempting to pass too much information through the message system; that is usually a sign that you need
 * either a proper state management solution, or a redesign of your component hierarchy and structure
 */
export function broadcast(message: BroadcastMessage) {
    if (typeof window === "undefined") {
        console.warn(`Broadcast was attempted with a message of ${message}, but no window object is available. Are you broadcasting during server-side rendering?`);
        return;
    }

    window.postMessage(message)
}

export function subscribe(message: BroadcastMessage, handler: (event: MessageEvent<any>) => any) {
    if (typeof window === "undefined") {
        console.warn(`Attempted to subscribe to the message ${message} but window is not available. Are you subscribing during server-side rendering?`)
        return;
    }

    window.addEventListener('message', (messageEvent) => {
        if (messageEvent.source !== window || messageEvent.data !== message) return;
        handler(messageEvent);
    })
}

export function unsubscribe(message: BroadcastMessage, handler: (event: MessageEvent<any>) => any) {
    if (typeof window === "undefined") {
        console.warn(`Unsubscribe was attempted for message '${message}', but no window object is available. Are you unsubscribing during server-side rendering?`);
        return;
    }

    window.removeEventListener('message', handler)
}

export function broadcastAllChanges(obj: any, message: BroadcastMessage) {
    for (const key in obj) {

        obj["_" + key] = obj[key];
        Object.defineProperty(obj, key, {
            set(value) {
                const staleValue = obj["_" + key]
                obj["_" + key] = value;
                if (staleValue !== value) broadcast(message)
            },
            get() {
                return obj["_" + key]
            }
        })
        if (typeof obj[key] === "object") broadcastAllChanges(obj[key], message)
    }
}