document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('#navigation a');
    const sections = document.querySelectorAll('#content section');
    const backButton = document.getElementById('backButton');

    function showSection(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Navigation links
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (sectionId) showSection(sectionId);
        });
    });

    // Back to Home button
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('home');
        });
    }

    // Show home by default
    showSection('home');

    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElem = document.getElementById("year");
    if (yearElem) yearElem.textContent = currentYear;
});
