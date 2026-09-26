'use client';

import React, { useEffect, useRef } from 'react';
import { useNexus } from '@/lib/store/nexusContext';
import { THEMES } from '@/lib/constants/themes';

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
  const { currentTheme, particlesEnabled } = useNexus();

  useEffect(() => {
    if (!particlesEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const themeConfig = THEMES[currentTheme] || THEMES.obsidian;
    const { primary, secondary, bg } = themeConfig.particleColors;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let isTabVisible = !document.hidden;

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

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

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

    // Adaptive node count based on screen size (faster on mobile)
    const isMobile = width < 768;
    const nodeCount = isMobile ? 18 : Math.min(42, Math.max(20, Math.floor((width * height) / 36000)));

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
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 1.1,
        color: Math.random() > 0.4 ? primary : secondary,
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

    const tokenCount = isMobile ? 4 : 7;
    for (let i = 0; i < tokenCount; i++) {
      floatingTokens.push({
        text: tokens[i % tokens.length],
        x: Math.random() * width,
        y: Math.random() * height,
        vy: -(Math.random() * 0.2 + 0.1),
        alpha: Math.random() * 0.22 + 0.08
      });
    }

    let animationFrameId: number;
    let timeTotal = 0;

    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      timeTotal += 0.015;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      const px = (mouse.x - width / 2) / (width / 2);
      const py = (mouse.y - height / 2) / (height / 2);

      ctx.clearRect(0, 0, width, height);

      // Deep theme-specific space base
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Subtle dynamic dual radial gradient auras
      const grad1 = ctx.createRadialGradient(
        width * 0.25 - px * 20,
        height * 0.3 - py * 20,
        0,
        width * 0.25 - px * 20,
        height * 0.3 - py * 20,
        450
      );
      grad1.addColorStop(0, `${primary} 0.14)`);
      grad1.addColorStop(1, `${bg}00`);
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
      grad2.addColorStop(0, `${secondary} 0.12)`);
      grad2.addColorStop(1, `${bg}00`);
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(width * 0.75 - px * 30, height * 0.65 - py * 30, 500, 0, Math.PI * 2);
      ctx.fill();

      // Flowing trajectory sine curves
      ctx.beginPath();
      const waveBase = height * 0.68 - py * 15;
      ctx.moveTo(0, waveBase);
      for (let x = 0; x <= width; x += 25) {
        const y =
          waveBase +
          Math.sin(x * 0.0028 + timeTotal * 0.9) * 20 +
          Math.cos(x * 0.0015 - timeTotal * 0.5) * 12;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `${primary} 0.10)`;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Neural nodes and connecting vector lines
      const connectionDist = isMobile ? 90 : 120;
      const mouseDistThreshold = 140;

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

        const renderX = node.x - px * 18;
        const renderY = node.y - py * 18;

        // Mouse connection line
        const dxm = mouse.x - renderX;
        const dym = mouse.y - renderY;
        const distMouse = Math.sqrt(dxm * dxm + dym * dym);
        if (distMouse < mouseDistThreshold) {
          const alpha = (1 - distMouse / mouseDistThreshold) * 0.5;
          ctx.strokeStyle = `${primary} ${alpha})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(renderX, renderY);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Neighbors connection
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const otherX = other.x - px * 18;
          const otherY = other.y - py * 18;
          const dx = otherX - renderX;
          const dy = otherY - renderY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.22;
            ctx.strokeStyle = `${node.color} ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(renderX, renderY);
            ctx.lineTo(otherX, otherY);
            ctx.stroke();
          }
        }

        // Draw node
        node.pulse += 0.035;
        const pulseSize = node.radius + Math.sin(node.pulse) * 0.4;
        ctx.fillStyle = `${node.color} 0.75)`;
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
        ctx.fillText(token.text, token.x - px * 25, token.y - py * 25);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [interactive, currentTheme, particlesEnabled]);

  if (!particlesEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity }}
    />
  );
}
