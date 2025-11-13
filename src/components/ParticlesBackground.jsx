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

    update(canvas, ctx) {
        this.x += this.speedX; // move particle in x direction
        this.y += this.speedY; // move particle in y direction 

        if (this.x < 0) this.x = canvas.width; // wrap around from left to right
        if (this.x > canvas.width) this.x = 0; // wrap around from right to left
        if (this.y < 0) this.y = canvas.height; // wrap around from top to bottom
        if (this.y > canvas.height) this.y = 0; // wrap around from bottom to top

        this.draw(ctx);
    }
}

export default function ParticlesBackground(){
const canvasRef = useRef(null);

useEffect(() => {
    const canvas = canvasRef.current;
    const ctx= canvas.getContext("2d");

    let particles =[];
    const particlecount=50;
    const colors =["rgba(255,255,255,0.7"];

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

let animationId;
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas PREVIOUS FRAME
    particles.forEach((p) => p.update(canvas, ctx)); // update all / NEW particles 
    animationId = requestAnimationFrame(animate); // call animate function again
}
animate();
return () => { // cleanup function
    cancelAnimationFrame(animationId); // cancel animation frame on unmounting
    window.removeEventListener("resize",handleResize);
}

}, []);

return (
    <canvas
        ref={canvasRef}
        className=" absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    ></canvas>
);

}
