import * as _ from 'lodash';

export default class Set {
    private map = {};
    private keys = [];

    clone() {
        let set = new Set();
        set.map = _.clone(this.map);
        set.keys = _.clone(this.keys);
        return set;
    }

    deserialize(data) {
        this.map = data.map;
        this.keys = data.keys;
    }

    add(key: any) {
        if (this.map[key] === undefined) {
            this.keys.push(key);
            this.map[key] = this.keys.length - 1;
        }
    }

    remove(key: any) {
        let index = this.map[key];
        if (index >= 0) {
            delete this.map[key];
            this.keys.splice(index, 1);
            for (let i = 0; i < this.keys.length; i++) {
                this.map[this.keys[i]] = i;
            }
        }
    }

    getKeys(): any[] {
        return this.keys;
    }
}