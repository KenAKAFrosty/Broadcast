function broadcast(message) {
    console.log("Broadcasting", message)
    window.postMessage(message)
}

function subscribe(message, handler) {
    window.addEventListener('message', (messageEvent) => {
        if (messageEvent.source !== window || messageEvent.data !== message) return;
        handler(messageEvent);
    })
}

function unsubscribe(message, handler) {
    window.removeEventListener('message', handler)
}

function broadcastAllChanges(obj, message) {
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