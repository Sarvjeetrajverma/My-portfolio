import{ useEffect, useRef } from "react"

class Particle {
    constructor(canvas, colors) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.shadowBlur = 13;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fill(); //this paint in the canavas 
    }

    update(canvas, ctx, mouse) {
        this.x += this.speedX; // move particle in x direction
        this.y += this.speedY; // move particle in y direction 

        // Mouse interaction
        if (mouse.x != null && mouse.y != null) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (100 - distance) / 100;
                this.x += forceDirectionX * force * 5;
                this.y += forceDirectionY * force * 5;
            }
        }

        if (this.x < 0) this.x = canvas.width; // wrap around from left to right
        if (this.x > canvas.width) this.x = 0; // wrap around from right to left
        if (this.y < 0) this.y = canvas.height; // wrap around from top to bottom
        if (this.y > canvas.height) this.y = 0; // wrap around from bottom to top

        this.draw(ctx);
    }
}

export default function ParticlesBackground(){
const canvasRef = useRef(null);
const mouse = useRef({ x: null, y: null });

useEffect(() => {
    const canvas = canvasRef.current;
    const ctx= canvas.getContext("2d");

    let particles =[];
    const particlecount=80;
    const colors = ["rgba(255, 255, 255, 0.5)", "#1cd8d2", "#00bf8f","#eef69e"];

function createparticles(){ // create all particles and add new particles
    particles=[];
    for(let i=0;i<particlecount;i++){
        particles.push(new Particle(canvas, colors));
    }
}

// create function for particles handle resize for every window 
function handleResize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 
    createparticles(); // create particles on resize
}
handleResize();
window.addEventListener("resize",handleResize); // event listener for resize

const handleMouseMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mouse.current.x = (event.clientX - rect.left) * scaleX;
    mouse.current.y = (event.clientY - rect.top) * scaleY;
};

const handleMouseLeave = () => {
    mouse.current.x = null;
    mouse.current.y = null;
};

window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("mouseout", handleMouseLeave);

let animationId;
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas PREVIOUS FRAME
    particles.forEach((p) => p.update(canvas, ctx, mouse.current)); // update all / NEW particles 
    animationId = requestAnimationFrame(animate); // call animate function again
}
animate();
return () => { // cleanup function
    cancelAnimationFrame(animationId); // cancel animation frame on unmounting
    window.removeEventListener("resize",handleResize);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseout", handleMouseLeave);
}

}, []);

return (
    <canvas
        ref={canvasRef}
        className=" absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    ></canvas>
);

}