/**
 * @class ProjectsAnimation
 * @classdesc This class manages the dynamic running line animation for project blocks
 * and updates the animation styles on window resize events.
 */
class ProjectsAnimation {
    /**
     * Creates an instance of ProjectsAnimation.
     * @param {string} projectsContainerId - The ID of the projects container element.
     * @param {string} blockSelector - The CSS selector for the individual project blocks.
     */
    constructor(projectsContainerId, blockSelector) {
        /**
         * @property {HTMLElement} projectsContainer - The container element for the project blocks.
         */
        this.projectsContainer = document.getElementById(projectsContainerId);

        /**
         * @property {NodeList} projectsArray - The list of project blocks.
         */
        this.projectsArray = this.projectsContainer.querySelectorAll(blockSelector);

        // Initialize the animation styles
        this.runLineAnim();

        // Add event listener for window resize with debounce
        window.addEventListener('resize', this.debounce(this.runLineAnim.bind(this), 200));
    }

    /**
     * Runs the dynamic running line animation by calculating the height of project blocks
     * and injecting the appropriate CSS styles.
     */
    runLineAnim() {
        const projectsHeight = [...this.projectsArray].map(project => project.clientHeight);

        const styles = `
            .projects__running-line-horizontal {top: ${projectsHeight[0] + projectsHeight[1]}px;}
            @keyframes running-up-down {
                50% {
                  top: ${projectsHeight[0] + projectsHeight[1] - 64}px;
                  opacity: 1;
                }
                51% {
                  opacity: 0;
                }
                100% {
                  top: ${projectsHeight[0] + projectsHeight[1] - 64}px;
                  opacity: 0;
                }
            }
            @keyframes running-left {
                0% {
                  opacity: 1;
                  width: 20px;
                }
                35% {
                  width: 64px;
                }
                50% {
                  left: 50%;
                  opacity: 1;
                  width: 0;
                }
                100% {
                  left: 50%;
                  opacity: 1;
                  width: 0;
                }
            }
            @keyframes running-right {
                0% {
                  opacity: 1;
                  width: 20px;
                }
                35% {
                  width: 64px;
                }
                50% {
                  right: 50%;
                  opacity: 1;
                  width: 0;
                }
                100% {
                  right: 50%;
                  opacity: 1;
                  width: 0;
                }
            }
        `;

        // Inject dynamic styles into the page
        let styleSheet = document.getElementById('dynamic-styles');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'dynamic-styles';
            document.head.appendChild(styleSheet);
        }

        styleSheet.innerHTML = styles;
    }

    /**
     * Debounces a function, delaying its execution until after a specified wait time.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The number of milliseconds to delay.
     * @returns {Function} The debounced function.
     */
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// Initialize the ProjectsAnimation class
const projectsAnimation = new ProjectsAnimation('projects', '.projects__block');
