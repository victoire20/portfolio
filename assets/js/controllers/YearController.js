/**
 * Controller responsable de fournir l'année courante.
 */
export default class YearController {
    /**
     * Retourne l'année actuelle
     * @returns {number}
     */
    getCurrentYear() {
        return new Date().getFullYear()
    }
}
