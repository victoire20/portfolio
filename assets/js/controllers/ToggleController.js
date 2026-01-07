/**
 * Controller générique pour gérer un état booléen (open / close).
 */
export default class ToggleController {
    /** @type {boolean} */
    #isOpen = false

    /** @type {Array<(isOpen: boolean) => void>} */
    #listeners = []

    /**
     * Ouvre l'état
     */
    open() {
        if (this.#isOpen) return
        this.#isOpen = true
        this.#notify()
    }

    /**
     * Ferme l'état
     */
    close() {
        if (!this.#isOpen) return
        this.#isOpen = false
        this.#notify()
    }

    /**
     * Inverse l'état (open ↔ close)
     */
    toggle() {
        this.#isOpen ? this.close() : this.open()
    }

    /**
     * Retourne l'état courant
     * @returns {boolean}
     */
    isOpen() {
        return this.#isOpen
    }

    /**
     * Abonne une fonction à chaque changement d'état
     * @param {(isOpen: boolean) => void} listener
     */
    subscribe(listener) {
        this.#listeners.push(listener)
    }

    /**
     * Notifie tous les abonnés
     * @private
     */
    #notify() {
        this.#listeners.forEach(fn => fn(this.#isOpen))
    }
}
