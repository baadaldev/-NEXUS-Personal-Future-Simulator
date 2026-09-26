'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  interactive?: boolean;
  opacity?: number;
  className?: string;
}

export function ParticleCanvas({
  interactive = true,
  opacity = 0.85,
  className = ''
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking for parallax
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      moved: false
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.moved = true;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Trajectory Flow Lines & Grid Nodes
    const nodeCount = Math.min(50, Math.max(25, Math.floor((width * height) / 32000)));
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulse: number;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 1.2,
        color: Math.random() > 0.4 ? 'rgba(6, 182, 212,' : 'rgba(139, 92, 246,',
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Ambient floating future coordinates / data tokens
    const tokens = ['[T+30d]', '[VELOCITY: 2.4h]', '[ON TRACK]', '[CONFIDENCE: 91%]', 'λ(t)', 'Δt', '96%'];
    const floatingTokens: Array<{
      text: string;
      x: number;
      y: number;
      vy: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < 8; i++) {
      floatingTokens.push({
        text: tokens[i % tokens.length],
        x: Math.random() * width,
        y: Math.random() * height,
        vy: -(Math.random() * 0.25 + 0.15),
        alpha: Math.random() * 0.25 + 0.1
      });
    }

    let animationFrameId: number;
    let timeTotal = 0;

    const render = () => {
      timeTotal += 0.015;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      const px = (mouse.x - width / 2) / (width / 2);
      const py = (mouse.y - height / 2) / (height / 2);

      ctx.clearRect(0, 0, width, height);

      // Deep obsidian space base
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, width, height);

      // Subtle cyan & purple radial gradient aura
      const grad1 = ctx.createRadialGradient(
        width * 0.25 - px * 20,
        height * 0.3 - py * 20,
        0,
        width * 0.25 - px * 20,
        height * 0.3 - py * 20,
        450
      );
      grad1.addColorStop(0, 'rgba(6, 182, 212, 0.14)');
      grad1.addColorStop(1, 'rgba(5, 7, 15, 0)');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(width * 0.25 - px * 20, height * 0.3 - py * 20, 450, 0, Math.PI * 2);
      ctx.fill();

      const grad2 = ctx.createRadialGradient(
        width * 0.75 - px * 30,
        height * 0.65 - py * 30,
        0,
        width * 0.75 - px * 30,
        height * 0.65 - py * 30,
        500
      );
      grad2.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
      grad2.addColorStop(1, 'rgba(5, 7, 15, 0)');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(width * 0.75 - px * 30, height * 0.65 - py * 30, 500, 0, Math.PI * 2);
      ctx.fill();

      // Flowing trajectory sine curves
      ctx.beginPath();
      const waveBase = height * 0.68 - py * 15;
      ctx.moveTo(0, waveBase);
      for (let x = 0; x <= width; x += 20) {
        const y =
          waveBase +
          Math.sin(x * 0.0028 + timeTotal * 0.9) * 22 +
          Math.cos(x * 0.0015 - timeTotal * 0.5) * 14;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Neural nodes and connecting vector lines
      const connectionDist = 130;
      const mouseDistThreshold = 160;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0) node.x = width;
          else if (node.x > width) node.x = 0;
          if (node.y < 0) node.y = height;
          else if (node.y > height) node.y = 0;
        }

        const renderX = node.x - px * 22;
        const renderY = node.y - py * 22;

        // Mouse connection line
        const dxm = mouse.x - renderX;
        const dym = mouse.y - renderY;
        const distMouse = Math.sqrt(dxm * dxm + dym * dym);
        if (distMouse < mouseDistThreshold) {
          const alpha = (1 - distMouse / mouseDistThreshold) * 0.6;
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(renderX, renderY);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Neighbors connection
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const otherX = other.x - px * 22;
          const otherY = other.y - py * 22;
          const dx = otherX - renderX;
          const dy = otherY - renderY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.28;
            ctx.strokeStyle = `${node.color} ${alpha})`;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(renderX, renderY);
            ctx.lineTo(otherX, otherY);
            ctx.stroke();
          }
        }

        // Draw node
        node.pulse += 0.04;
        const pulseSize = node.radius + Math.sin(node.pulse) * 0.5;
        ctx.fillStyle = `${node.color} 0.8)`;
        ctx.beginPath();
        ctx.arc(renderX, renderY, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw subtle telemetry tokens
      ctx.font = '10px "Fira Code", monospace';
      for (let k = 0; k < floatingTokens.length; k++) {
        const token = floatingTokens[k];
        if (!prefersReducedMotion) {
          token.y += token.vy;
          if (token.y < -20) {
            token.y = height + 20;
            token.x = Math.random() * width;
          }
        }
        ctx.fillStyle = `rgba(148, 163, 184, ${token.alpha})`;
        ctx.fillText(token.text, token.x - px * 35, token.y - py * 35);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity }}
    />
  );
}
