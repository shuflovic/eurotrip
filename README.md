document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('#navigation a');
    const sections = document.querySelectorAll('#content section');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Show home by default
    showSection('home');
});
