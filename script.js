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


  // Get the current year
  const currentYear = new Date().getFullYear();
  document.getElementById("year").textContent = currentYear;

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("#navigation a");
  const sections = document.querySelectorAll("section");

  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Hide all sections
      sections.forEach(sec => sec.classList.remove("active"));

      // Show the target section
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
});

});
