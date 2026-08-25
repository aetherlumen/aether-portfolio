/* =========================================================
   01. MOBILE NAVIGATION
   ========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");

/*
   Toggle the mobile navigation open/closed.
*/
function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle("is-open");

    menuToggle.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", isOpen);
}

/*
   Close the menu after a navigation link is selected.
*/
function closeMobileMenu() {
    mobileMenu.classList.remove("is-open");
    menuToggle.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
}

/* Open / close menu when hamburger is clicked */
menuToggle.addEventListener("click", toggleMobileMenu);

/* Close menu after selecting a link */
mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});