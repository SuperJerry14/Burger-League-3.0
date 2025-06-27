import React, { useEffect, useRef } from 'react';

const ParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      char: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 20 + 10;
        this.opacity = Math.random() * 0.3 + 0.1;
        
        // Random food emojis for background ambiance
        const foodEmojis = ['🍔', '🍟', '🥤', '🌭', '🍕', '🥪', '🧀', '🥓'];
        this.char = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(this.char, this.x, this.y);
        ctx.restore();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="position-fixed top-0 start-0"
      style={{
        zIndex: -1,
        pointerEvents: 'none',
        width: '100%',
        height: '100%'
      }}
    />
  );
};

export default ParticleSystem;
