/**
 * @class ThemeToggler
 * @classdesc A class to manage theme toggling between 'light' and 'white' modes. It applies the selected theme,
 * saves it to localStorage, and updates the toggle switch state accordingly.
 */
class ThemeToggler {
    /**
     * Creates an instance of ThemeToggler.
     * @param {string} toggleElementClass - The ID of the theme toggler checkbox element.
     * @param {string} defaultTheme - The default theme to apply if no theme is stored.
     */
    constructor(toggleElementClass, defaultTheme = 'light') {

        /**
         * @property {HTMLElement} togglerElement - The checkbox element for toggling the theme.
         */
        this.togglerElements = document.querySelectorAll(toggleElementClass);

        /**
         * @property {string} defaultTheme - The default theme if none is stored.
         */
        this.defaultTheme = defaultTheme;

        // Initialize theme
        this.initTheme();

        // Add event listener to the toggle element if it exists
        this.togglerElements.forEach(togglerElement => {
            if (togglerElement) {
                togglerElement.addEventListener('change', (event) => this.handleToggleChange(event));
            }
        });
    }

    /**
     * Initializes the theme by loading the stored theme or applying the default one.
     * It also sets the initial state of the theme toggle switch.
     */
    initTheme() {
        const storedTheme = this.getStoredTheme();
        const theme = storedTheme || this.defaultTheme;
        console.log(`Current theme: ${theme}`);
        this.applyTheme(theme);
    }

    /**
     * Applies the given theme by setting the body class and updating the toggle switch state.
     * @param {string} theme - The theme to apply ('light' or 'white').
     */
    applyTheme(theme) {
        document.body.className = theme; // Set body class to the theme

        // Update the checkbox state based on the theme
        this.togglerElements.forEach(togglerElement => {
            if (togglerElement) {
                togglerElement.checked = (theme === 'white');
            }
        });
    }

    /**
     * Stores the selected theme in localStorage and applies it.
     * @param {string} theme - The theme to store and apply.
     */
    setStoredTheme(theme) {
        localStorage.setItem('theme', JSON.stringify(theme)); // Store theme in localStorage
        this.applyTheme(theme); // Apply the theme
    }

    /**
     * Retrieves the stored theme from localStorage.
     * @returns {string|null} The stored theme or null if no theme is stored.
     */
    getStoredTheme() {
        return JSON.parse(localStorage.getItem('theme'));
    }

    /**
     * Handles the theme toggle switch change event.
     * @param {Event} event - The change event triggered by the theme toggle switch.
     */
    handleToggleChange(event) {
        const theme = event.target.checked ? 'white' : 'light';
        this.setStoredTheme(theme);
    }
}

// Initialize ThemeToggler with the toggler element ID and default theme
const themeToggler = new ThemeToggler('.togglerTheme', 'light');
