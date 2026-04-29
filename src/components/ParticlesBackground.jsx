import { useEffect, useRef } from "react"

class Star {
    constructor(canvas, theme) {
        this.canvas = canvas;
        this.reset(theme);
    }

    reset(theme = 'dark') {
        this.x = Math.random() * this.canvas.width * 1.5 - this.canvas.width * 0.25;
        this.y = Math.random() * this.canvas.height * 1.5 - this.canvas.height * 0.25;
        this.z = Math.random() * 4 + 1; 
        this.size = Math.random() * 1.2 + 0.3; 
        
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.twinklePhase = Math.random() * Math.PI * 2;
        
        this.setThemeColor(theme);
    }

    setThemeColor(theme) {
        let colors = [];
        if (theme === 'light') {
            colors = ["#1e293b", "#334155", "#475569", "#64748b", "#0ea5e9"]; // Dark slate & cyan
        } else if (theme === 'read') {
            colors = ["#292115", "#4a3c28", "#78573a", "#92400e", "#b45309"]; // Dark amber & espresso
        } else if (theme === 'green') {
            colors = ["#eef6f0", "#c6dfcd", "#a4c7af", "#819989", "#10b981"]; // Mint & Sage
        } else {
            // dark mode
            colors = ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#eef69e", "#1cd8d2"]; 
        }
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update(ctx, mouse, time) {
        this.x -= 0.1 / this.z;
        if (this.x < -this.canvas.width * 0.25) {
            this.x = this.canvas.width * 1.25;
            this.y = Math.random() * this.canvas.height * 1.5 - this.canvas.height * 0.25;
        }

        const offsetX = (mouse.x * 0.03) / this.z;
        const offsetY = (mouse.y * 0.03) / this.z;

        const screenX = this.x - offsetX;
        const screenY = this.y - offsetY;

        let opacity = 0.5 + Math.sin(time * this.twinkleSpeed + this.twinklePhase) * 0.5;

        if (screenX > 0 && screenX < this.canvas.width && screenY > 0 && screenY < this.canvas.height) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = opacity;
            ctx.fill();
            
            if (this.size > 1.2) {
                ctx.beginPath();
                ctx.arc(screenX, screenY, this.size * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = opacity * 0.15;
                ctx.fill();
            }
        }
    }
}

export default function ParticlesBackground() {
    const canvasRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (window.innerWidth < 768) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let stars = [];
        const starCount = 350; 
        
        let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

        function createStars() {
            stars = [];
            for (let i = 0; i < starCount; i++) {
                stars.push(new Star(canvas, currentTheme));
            }
        }

        function handleResize() {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createStars();
        }
        handleResize();
        window.addEventListener("resize", handleResize);

        // Listen for theme changes to update star colors
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                    stars.forEach(star => star.setThemeColor(currentTheme));
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });

        const handleMouseMove = (event) => {
            if (!canvas) return;
            mouse.current.x = event.clientX - canvas.width / 2;
            mouse.current.y = event.clientY - canvas.height / 2;
        };

        const handleMouseLeave = () => {
            mouse.current.x = 0;
            mouse.current.y = 0;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseout", handleMouseLeave);

        let animationId;
        let time = 0;
        
        function animate() {
            if (!canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => star.update(ctx, mouse.current, time));

            time += 1;
            animationId = requestAnimationFrame(animate);
        }
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseout", handleMouseLeave);
            observer.disconnect();
        }

    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="hidden md:block absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        ></canvas>
    );
}