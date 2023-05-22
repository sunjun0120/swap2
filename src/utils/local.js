export default {

    load (key) {
        let value = localStorage.getItem(key)
        if (value === null) return value
        try {
            value = JSON.parse(value)
        } catch (e) {
            value = null
        }
        return value
    },

    put (key, value) {
        value = JSON.stringify(value)
        localStorage.setItem(key, value)
    },

    remove (key = undefined) {
        if (typeof key === 'undefined') {
            localStorage.clear()
        } else {
            localStorage.removeItem(key)
        }
    },

    clear () {
        this.remove()
    }
}
