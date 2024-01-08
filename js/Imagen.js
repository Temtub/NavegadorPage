export class Imagen {
    constructor(id, src, avg_color) {
        this._id = id;
        this._src = src;
        this._avg_color = avg_color;
    }

    getId() {
        return this._id;
    }

    setId(newId) {
        this._id = newId;
    }

    getSrc() {
        return this._src;
    }

    setSrc(newSrc) {
        this._src = newSrc;
    }

    getAvg_color() {
        return this._avg_color;
    }

    setAvg_color(newAvgColor) {
        this._avg_color = newAvgColor;
    }

}
