/**
 * ====================================
 * CORE UTILITIES & EVENT HANDLERS
 * ====================================
 */

// 1. Function to toggle the mobile hamburger menu state
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    
    if (menu && icon) {
        menu.classList.toggle("open");
        icon.classList.toggle("open");
    }
}

// 2. FUNCTION TO SCROLL TO THE NEXT SECTION
function scrollToNextSection() {
    // Scrolls down 85% of the viewport height to move to the next section cleanly.
    const scrollDistance = window.innerHeight * 0.85; 
    
    window.scrollBy({
        top: scrollDistance,
        behavior: 'smooth' 
    });
}

/**
 * ====================================
 * AESTHETIC: CANVAS PARTICLE FIELD ANIMATION (Molecules with Bonds Effect)
 * ====================================
 */
function initializeParticleField() {
    const container = document.getElementById('particles-js');
    if (!container) {
        // console.error("Particle container #particles-js not found.");
        return; 
    }

    try {
        // Create and append the Canvas element
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas'; 
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Use a function to set dimensions to ensure they are current
        const setCanvasSize = () => {
            width = canvas.width = container.clientWidth;
            height = canvas.height = container.clientHeight;
        };

        let width;
        let height;
        let particles = [];

        // TWEAKABLE PARAMETERS (UPDATED FOR SUBTLETY AND CHAOTIC SPACE SPEED)
        const numParticles = 60;         // Decreased quantity
        const connectionDistance = 150;   
        // Removed fixed particleSpeed, now calculated inside the Particle class
        const particleRadius = 1.5;       // Decreased size
        const particleColor = 'rgba(0, 255, 255, 0.8)'; 

        // --- Resize Handler ---
        window.addEventListener('resize', () => {
            setCanvasSize();
            particles = []; 
            initParticles();
        });

        // --- Particle Class (Your 'Molecules') ---
        class Particle {
            constructor(x, y) {
                this.x = x || Math.random() * width;
                this.y = y || Math.random() * height;
                this.radius = Math.random() * particleRadius + 1; 
                
                // Wide random speed variation for chaotic space movement (0.1 to 0.8)
                const speedMultiplier = (Math.random() * 0.7) + 0.1; 
                
                this.velocity = {
                    x: (Math.random() - 0.5) * speedMultiplier, 
                    y: (Math.random() - 0.5) * speedMultiplier
                };
                this.color = particleColor; 
            }

            update() {
                this.x += this.velocity.x;
                this.y += this.velocity.y;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.velocity.x *= -1;
                if (this.y < 0 || this.y > height) this.velocity.y *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color; 
                ctx.shadowBlur = 8; 
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow
            }
        }

        // --- Particle Initialization & Connection (Your 'Bonds') ---
        function initParticles() {
            setCanvasSize(); // Ensure size is set before creating particles
            particles = []; // Clear existing particles
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }
        
        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < connectionDistance) {
                        const opacityValue = 1 - (distance / connectionDistance);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${opacityValue * 0.5})`; 
                        
                        // Dynamic line width (thicker for closer, stronger 'bonds')
                        ctx.lineWidth = 0.5 + (opacityValue * 0.5); // Ranges from 0.5 to 1.0
                        
                        ctx.shadowColor = 'rgba(0, 255, 255, 0.7)'; 
                        ctx.shadowBlur = 5; 
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                        ctx.shadowBlur = 0; 
                    }
                }
            }
        }

        // --- Main Animation Loop ---
        function animate() {
            requestAnimationFrame(animate);
            
            // Clear the canvas frame by frame.
            ctx.clearRect(0, 0, width, height); 

            connectParticles();
            particles.forEach(p => {
                p.update();
                p.draw();
            });
        }

        initParticles(); // Initial setup
        animate();

    } catch (e) {
        // console.error("Error initializing particle field:", e);
    }
}


/**
 * ====================================
 * INITIALIZATION
 * ====================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Start the particle field in the background
    initializeParticleField();

    // 2. Setup the Scroll Arrow Click Handler
    const arrowIcon = document.querySelector('.icon.arrow');
    
    if (arrowIcon) {
        arrowIcon.addEventListener('click', scrollToNextSection);
    }
});