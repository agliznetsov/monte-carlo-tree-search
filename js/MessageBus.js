class MessageBus {
    static get() {
        if (!this.instance) {
            this.instance = new MessageBus();
        }
        return this.instance;
    }

    constructor() {
        this.consumers = {};
    }

    publish(event, data) {
        let arr = this.consumers[event];
        if (arr) {
            arr.forEach(it => it(data));
        }
    }

    subscribe(event, consumer) {
        let arr = this.consumers[event];
        if (!arr) {
            arr = [];
            this.consumers[event] = arr;
        }
        arr.push(consumer);
    }
}

