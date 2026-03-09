import React, { useRef, useEffect, memo } from "react";

interface MatrixBackgroundProps {
  colorTier: "green" | "amber" | "red";
}

const KATAKANA =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const DIGITS = "0123456789";
const CHARS = KATAKANA + DIGITS;

const TIER_COLORS: Record<string, string> = {
  green: "0, 255, 70",
  amber: "255, 191, 0",
  red: "255, 50, 50",
};

export const MatrixBackground = memo(({ colorTier }: MatrixBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastFrameTime = 0;
    const TIER_INTERVALS: Record<string, number> = { green: 120, amber: 80, red: 40 };
    const FRAME_INTERVAL = TIER_INTERVALS[colorTier] ?? 120;
    const fontSize = 14;
    let columns = 0;
    let drops: number[] = [];

    // Opacity ramp: start at 0.35, reach 0.5 over 2 minutes
    const startTime = Date.now();
    const RAMP_DURATION = 2 * 60 * 1000; // 2 minutes in ms
    const OPACITY_START = 0.35;
    const OPACITY_END = 0.5;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      columns = Math.floor(canvas.width / fontSize);
      // Preserve existing drops, extend or trim
      const newDrops: number[] = new Array<number>(columns).fill(0);
      for (let i = 0; i < Math.min(drops.length, columns); i++) {
        newDrops[i] = drops[i];
      }
      // Stagger initial positions
      for (let i = drops.length; i < columns; i++) {
        newDrops[i] = Math.random() * -50;
      }
      drops = newDrops;
    }

    resize();
    window.addEventListener("resize", resize);

    const rgb = TIER_COLORS[colorTier] ?? TIER_COLORS.green;

    function draw(timestamp: number) {
      if (!ctx || !canvas) return;

      animationId = requestAnimationFrame(draw);

      if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = timestamp;

      // Update canvas opacity based on elapsed time
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / RAMP_DURATION, 1);
      canvas.style.opacity = String(OPACITY_START + (OPACITY_END - OPACITY_START) * t);

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = `rgba(${rgb}, 0.95)`;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (y > 0) {
          ctx.fillText(char, x, y);
        }

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 1;
      }
    }

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [colorTier]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: 0.35,
        pointerEvents: "none",
      }}
    />
  );
});

MatrixBackground.displayName = "MatrixBackground";
