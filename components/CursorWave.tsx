"use client";

import React, { useEffect, useRef } from "react";

/**
 * CursorWave
 * Draws a trailing ribbon that undulates along the mouse path.
 * - Uses a list of recent points.
 * - Each frame, fades canvas slightly and redraws a polyline with a sinusoidal offset along normals.
 * - Looks like a liquid wave following the cursor.
 */
export default function CursorWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<Array<{ x: number; y: number }>>([]);
  const rafRef = useRef<number | null>(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let width = (canvas.width = window.innerWidth * devicePixelRatio);
    let height = (canvas.height = window.innerHeight * devicePixelRatio);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    const onResize = () => {
      width = canvas.width = window.innerWidth * devicePixelRatio;
      height = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    window.addEventListener("resize", onResize);

    const onMove = (e: MouseEvent) => {
      pointsRef.current.push({ x: e.clientX * devicePixelRatio, y: e.clientY * devicePixelRatio });
      if (pointsRef.current.length > 80) pointsRef.current.shift();
    };
    window.addEventListener("mousemove", onMove);

    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      pointsRef.current.push({ x: t.clientX * devicePixelRatio, y: t.clientY * devicePixelRatio });
      if (pointsRef.current.length > 80) pointsRef.current.shift();
    };
    window.addEventListener("touchmove", onTouch);

    // Animation loop
    const loop = () => {
      tRef.current += 0.02;
      // fade previous frame to create trail
      ctx.fillStyle = "rgba(3, 7, 18, 0.06)";
      ctx.fillRect(0, 0, width, height);

      const pts = pointsRef.current;
      if (pts.length > 2) {
        // Draw multiple layered ribbons for glow
        for (let layer = 0; layer < 3; layer++) {
          const thickness = 16 - layer * 4;
          const alpha = 0.35 - layer * 0.1;
          const amp = 10 - layer * 2;

          ctx.beginPath();
          for (let i = 1; i < pts.length - 1; i++) {
            const p0 = pts[i - 1];
            const p1 = pts[i];
            const p2 = pts[i + 1];

            // tangent vector
            const dx = p2.x - p0.x;
            const dy = p2.y - p0.y;
            const len = Math.hypot(dx, dy) || 1;
            // unit normal (perp)
            const nx = -dy / len;
            const ny = dx / len;

            const wave = Math.sin(i * 0.35 + tRef.current * 3.0) * amp * (i / pts.length);
            const x = p1.x + nx * wave;
            const y = p1.y + ny * wave;

            if (i === 1) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.lineWidth = thickness;
          // Cyan-violet glow similar to bolt vibe
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, "rgba(34,211,238, 0.9)");
          grad.addColorStop(1, "rgba(167,139,250, 0.9)");
          ctx.strokeStyle = grad;
          ctx.globalAlpha = alpha;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    // prime with a gentle fade
    ctx.fillStyle = "rgba(3, 7, 18, 1)";
    ctx.fillRect(0, 0, width, height);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas className="cursor-wave" ref={canvasRef} aria-hidden="true" />;
}
