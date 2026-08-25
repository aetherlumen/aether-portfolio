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

/* =========================================================
   02. SCROLL REVEAL
   ========================================================= */

/*
   Watch elements with the .reveal class.

   When an element enters the viewport, JavaScript adds
   .is-visible, which triggers the CSS animation.
*/

const revealElements = document.querySelectorAll(".reveal");

/*
   >>> EDIT: Reveal sensitivity <<<

   threshold:
   0.15 means roughly 15% of the element needs to be visible
   before the animation starts.

   Increase it if you want elements to animate later.
   Decrease it if you want them to animate sooner.
*/

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");

                /*
                   Stop watching after the first reveal.
                   This prevents elements from re-animating every
                   time you scroll away and back.
                */
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15,
    }
);

/* Start watching every reveal element */
revealElements.forEach((element) => {
    revealObserver.observe(element);
});