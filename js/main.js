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
/* =========================================================
   03. INTERACTIVE LIGHTING
   ========================================================= */

/*
   Tracks the cursor on desktop and updates CSS variables
   controlling the orange ambient glow.

   >>> EDIT: Smoothing strength <<<
   Lower values = smoother/slower movement.
   Higher values = faster/snappier movement.
*/

const root = document.documentElement;

let targetX = window.innerWidth * 0.18;
let targetY = window.innerHeight * 0.22;

let currentX = targetX;
let currentY = targetY;

const glowSmoothing = 0.03;

/*
   Only enable cursor tracking on devices that actually
   support precise pointer input, such as a mouse.
*/
const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)");

if (supportsHover.matches) {

    window.addEventListener("mousemove", (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
    });

    function animateGlow() {
        currentX += (targetX - currentX) * glowSmoothing;
        currentY += (targetY - currentY) * glowSmoothing;

        root.style.setProperty("--glow-x", `${currentX}px`);
        root.style.setProperty("--glow-y", `${currentY}px`);

        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}
/* =========================================================
   04. HERO NETWORK ANIMATION
   ========================================================= */

/*
   Decorative network animation for the hero.

   >>> EASY CUSTOMIZATION POINTS <<<

   networkEffectEnabled:
   Set false to disable the effect entirely.

   nodeCount:
   Controls how many nodes are displayed.

   connectionDistance:
   Controls how close nodes must be before a line appears.

   nodeSpeed:
   Controls movement speed.

   pulseChance:
   Controls how often packet-like pulses appear.
*/

const networkEffectEnabled = true;

const nodeCount = 12;
const connectionDistance = 180;
const nodeSpeed = 0.18;
const pulseChance = 0.003;

const canvas = document.querySelector("#network-canvas");
const hero = document.querySelector(".hero");

if (networkEffectEnabled && canvas && hero) {

    const ctx = canvas.getContext("2d");

    let width;
    let height;

    const nodes = [];
    const pulses = [];

    /*
       Resize the canvas to match the hero section.

       devicePixelRatio keeps the canvas sharp on
       high-density displays.
    */
    function resizeCanvas() {
        const rect = hero.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio || 1;

        width = rect.width;
        height = rect.height;

        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    /*
       Create one network node with a random position
       and movement direction.
    */
    function createNode() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,

            vx: (Math.random() - 0.5) * nodeSpeed,
            vy: (Math.random() - 0.5) * nodeSpeed,

            radius: Math.random() * 1.5 + 1,
        };
    }

    function initializeNodes() {
        nodes.length = 0;

        for (let i = 0; i < nodeCount; i++) {
            nodes.push(createNode());
        }
    }

    /*
       Keep nodes inside the hero area.
    */
    function updateNodes() {
        nodes.forEach((node) => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x <= 0 || node.x >= width) {
                node.vx *= -1;
            }

            if (node.y <= 0 || node.y >= height) {
                node.vy *= -1;
            }
        });
    }

    /*
       Draw individual nodes.
    */
    function drawNodes() {
        nodes.forEach((node) => {
            ctx.beginPath();

            ctx.arc(
                node.x,
                node.y,
                node.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "rgba(255, 138, 61, 0.75)";
            ctx.fill();
        });
    }

    /*
       Draw lines between nearby nodes.
    */
    function drawConnections() {
        for (let i = 0; i < nodes.length; i++) {

            for (let j = i + 1; j < nodes.length; j++) {

                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < connectionDistance) {

                    const opacity =
                        1 - distance / connectionDistance;

                    ctx.beginPath();

                    ctx.moveTo(
                        nodes[i].x,
                        nodes[i].y
                    );

                    ctx.lineTo(
                        nodes[j].x,
                        nodes[j].y
                    );

                    ctx.strokeStyle =
                        `rgba(184, 117, 255, ${opacity * 0.25})`;

                    ctx.lineWidth = 1;
                    ctx.stroke();

                    /*
                       Occasionally create a packet pulse
                       along an active connection.
                    */
                    if (Math.random() < pulseChance) {
                        pulses.push({
                            start: nodes[i],
                            end: nodes[j],
                            progress: 0,
                        });
                    }
                }
            }
        }
    }

    /*
       Animate small packet-style pulses across connections.
    */
    function updateAndDrawPulses() {

        for (let i = pulses.length - 1; i >= 0; i--) {

            const pulse = pulses[i];

            pulse.progress += 0.008;

            if (pulse.progress >= 1) {
                pulses.splice(i, 1);
                continue;
            }

            const x =
                pulse.start.x +
                (pulse.end.x - pulse.start.x) *
                pulse.progress;

            const y =
                pulse.start.y +
                (pulse.end.y - pulse.start.y) *
                pulse.progress;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                2,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "rgba(255, 170, 95, 0.9)";

            ctx.fill();
        }
    }

    /*
       Main animation loop.
    */
    function animateNetwork() {
        ctx.clearRect(0, 0, width, height);

        updateNodes();

        drawConnections();
        drawNodes();
        updateAndDrawPulses();

        requestAnimationFrame(animateNetwork);
    }

    resizeCanvas();
    initializeNodes();
    animateNetwork();

    window.addEventListener("resize", () => {
        resizeCanvas();
        initializeNodes();
    });
}