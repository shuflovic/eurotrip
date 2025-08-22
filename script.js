document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('#navigation a');
    const sections = document.querySelectorAll('#content section');
    const backButton = document.getElementById('backButton');
    const nav = document.getElementById('navigation');

    // Show section and scroll into view with offset for nav
    function showSection(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        const target = document.getElementById(sectionId);
        if (!target) return;

        target.classList.add('active');

        // Calculate scroll position, offset by nav height
        const navHeight = nav ? nav.offsetHeight : 0;
        const topPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;

        window.scrollTo({ top: topPos, behavior: 'smooth' });
    }

    // Handle nav clicks
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (sectionId) showSection(sectionId);
        });
    });

    // Handle Back to Home button
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('home');
        });
    }

    // Optional: highlight active menu item
    function highlightActive(sectionId) {
        links.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active-link');
            }
        });
    }

    // Enhance showSection to highlight menu
    const originalShowSection = showSection;
    showSection = function(sectionId) {
        originalShowSection(sectionId);
        highlightActive(sectionId);
    };

    // Show home by default
    showSection('home');

    // Footer year
    const currentYear = new Date().getFullYear();
    const yearElem = document.getElementById("year");
    if (yearElem) yearElem.textContent = currentYear;
});
