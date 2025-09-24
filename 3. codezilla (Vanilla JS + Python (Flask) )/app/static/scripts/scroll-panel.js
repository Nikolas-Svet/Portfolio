/**
 * @class ScrollObserver
 * @classdesc This class observes scroll events, dynamically changes images and titles in a left section,
 * and animates content elements based on scroll direction.
 */
class ScrollObserver {
    /**
     * Creates an instance of ScrollObserver.
     * @param {string} contentItemsSelector - The CSS selector for content items to be observed.
     * @param {string} leftImageId - The ID of the image element in the left block to be updated.
     * @param {string} leftTitleId - The ID of the title element in the left block to be updated.
     * @param {Array<Object>} contentData - An array of objects containing image paths and titles.
     */
    constructor(contentItemsSelector, leftImageId, leftTitleId, contentData) {
        /**
         * @property {number} lastScrollTop - Stores the previous scroll position.
         */
        this.lastScrollTop = 0;

        /**
         * @property {NodeList} contentItems - List of content items to observe.
         */
        this.contentItems = document.querySelectorAll(contentItemsSelector);

        /**
         * @property {HTMLElement} leftImage - The image element that will be updated based on scroll.
         */
        this.leftImage = document.getElementById(leftImageId);

        /**
         * @property {HTMLElement} leftTitle - The title element that will be updated based on scroll.
         */
        this.leftTitle = document.getElementById(leftTitleId);

        /**
         * @property {Array<Object>} contentData - Data array containing image paths and titles for each content item.
         */
        this.contentData = contentData;

        // Initialize scroll observer
        this.init();
    }

    /**
     * Initializes the scroll observer and sets event listeners for load and resize.
     */
    init() {
        this.setItemOffsets(); // Set initial margins for content items
        this.initObserver(); // Initialize IntersectionObserver

        // Recalculate item offsets on page load and window resize
        window.addEventListener('load', this.setItemOffsets.bind(this));
        window.addEventListener('resize', this.setItemOffsets.bind(this));
    }

    /**
     * Updates the image and title in the left block based on the provided index.
     * @param {number} index - The index of the content item to update the left block with.
     */
    updateLeftBlock(index) {
        const data = this.contentData[index];
        this.leftImage.src = data.imgSrc;
        this.leftTitle.textContent = data.title;
    }

    /**
     * Calculates and sets dynamic margins for content items to ensure proper vertical centering.
     */
    setItemOffsets() {
        const windowHeight = window.innerHeight;

        this.contentItems.forEach(item => {
            const itemHeight = item.offsetHeight;
            const margin = (windowHeight - itemHeight) / 2;

            item.style.marginTop = `${margin}px`;
            item.style.marginBottom = `${margin}px`;
        });
    }

    /**
     * Determines the direction of the scroll (up or down).
     * @returns {string} - Returns 'down' if scrolling down, 'up' if scrolling up.
     */
    getScrollDirection() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let direction;

        if (currentScrollTop > this.lastScrollTop) {
            direction = 'down'; // Scrolling down
        } else {
            direction = 'up'; // Scrolling up
        }

        this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Update last scroll position
        return direction;
    }

    /**
     * Initializes IntersectionObserver to observe visibility changes for each content item.
     * Animates the content items based on scroll direction.
     */
    initObserver() {
        const observer = new IntersectionObserver((entries) => {
            const scrollDirection = this.getScrollDirection(); // Get current scroll direction

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = entry.target.getAttribute('data-index');
                    this.updateLeftBlock(index);

                    // Animate content based on scroll direction
                    if (scrollDirection === 'down') {
                        entry.target.style.transform = 'translateY(-100px)'; // Scroll down - slide from below
                    } else {
                        entry.target.style.transform = 'translateY(100px)'; // Scroll up - slide from above
                    }

                    entry.target.classList.add('visible'); // Add class for visibility
                } else {
                    entry.target.classList.remove('visible'); // Remove visibility class
                }
            });
        }, {
            threshold: 0.2 // Items become visible when 20% of their height is visible
        });

        // Observe each content item
        this.contentItems.forEach(item => {
            observer.observe(item);
        });
    }
}

// Content data for the scroll items
const contentData = [
    {
        imgSrc: '/static/images/index/scroll-panel-0.svg',
        title: 'Webentwicklung'
    },
    {
        imgSrc: '/static/images/index/scroll-panel-1.svg',
        title: 'Design Thinking'
    },
    {
        imgSrc: '/static/images/index/scroll-panel-2.svg',
        title: 'Digital Marketing'
    },
    {
        imgSrc: '/static/images/index/scroll-panel-3.svg',
        title: 'Webentwicklung'
    },
    {
        imgSrc: '/static/images/index/scroll-panel-4.svg',
        title: 'Design Thinking'
    },
    {
        imgSrc: '/static/images/index/scroll-panel-5.svg',
        title: 'Digital Marketing'
    },
];

// Initialize the ScrollObserver class to handle scrolling animations and updates
const scrollObserver = new ScrollObserver(
    '.scroll-panel__window__block',  // Selector for content items
    'changeImg',                     // ID of the image element to update
    'changeTitle',                   // ID of the title element to update
    contentData                      // Data for titles and images
);
