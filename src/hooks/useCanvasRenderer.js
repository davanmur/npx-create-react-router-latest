import { useEffect, useRef, useCallback } from "react";
import { RANK_COLORS } from "../data/taxonomy";

const isDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

function getTheme() {
  // const dark = isDark();
  const dark = false;
  return {
    bg: dark ? "#1a1a19" : "#ffffff",
    line: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    textPri: dark ? "#e8e6dc" : "#e8e6dc",
    textSec: dark ? "#9c9a92" : "#73726c",
    nodeBg: dark ? "#3a9142" : "#3a9142",
    nodeBorder: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
  };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function useCanvasRenderer({ canvasRef, nodes, edges, transform, selectedId, highlightIds }) {
  const rafRef = useRef(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width: W, height: H } = canvas;
    const { tx, ty, scale } = transform;
    const theme = getTheme();
    const HIGHLIGHT = "#b3deba";

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(tx, ty);
    ctx.scale(scale, scale);

    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

    // Draw edges
    ctx.strokeStyle = theme.line;
    ctx.lineWidth = 1 / scale;
    ctx.beginPath();
    for (const e of edges) {
      const f = nodeMap[e.from], t = nodeMap[e.to];
      if (!f || !t) continue;
      const fx = f.x + f.w / 2, fy = f.y + f.h;
      const tx2 = t.x + t.w / 2, ty2 = t.y;
      const my = (fy + ty2) / 2;
      ctx.moveTo(fx, fy);
      ctx.bezierCurveTo(fx, my, tx2, my, tx2, ty2);
    }
    ctx.stroke();

    // Draw nodes
    for (const n of nodes) {
      const isSelected = n.id === selectedId;
      const isHighlighted = highlightIds.size > 0 && highlightIds.has(n.id);
      const isDimmed = highlightIds.size > 0 && !highlightIds.has(n.id);
      const color = RANK_COLORS[n.rank] || RANK_COLORS.default;
      const hasChildren = n.children?.length > 0;

      ctx.globalAlpha = isDimmed ? 0.25 : 1;
      ctx.fillStyle = theme.nodeBg;
      ctx.strokeStyle = isSelected ? HIGHLIGHT : isHighlighted ? color : theme.nodeBorder;
      ctx.lineWidth = (isSelected || isHighlighted) ? 2 / scale : 0.5 / scale;
      roundRect(ctx, n.x, n.y, n.w, n.h, 6 / scale);
      ctx.fill();
      ctx.stroke();

      // Rank color dot
      // ctx.fillStyle = color;
      // ctx.beginPath();
      // ctx.arc(n.x + 10 / scale, n.y + n.h / 2, 5 / scale, 0, Math.PI * 2);
      // ctx.fill();

      // Label
      ctx.fillStyle = isSelected ? HIGHLIGHT : theme.textPri;
      ctx.font = `${isSelected ? 500 : 400} 14px "DM Sans", system-ui, sans-serif`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      const label = n.name.length > 16 ? n.name.slice(0, 15) + "…" : n.name;
      ctx.fillText(label, n.x + n.w / 2, n.y + n.h / 2);

      // Collapse toggle
      if (hasChildren) {
        ctx.fillStyle = theme.textSec;
        ctx.font = `${10 / scale}px sans-serif`;
        ctx.textAlign = "center";
        ctx.cursor = "pointer";
        const toggleX = n.x + n.w - 8 / scale;
        ctx.fillText(
          n._collapsed ? "+" : "−",
          toggleX,
          n.y + n.h / 2 + 1 / scale
        );
      }

      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }, [canvasRef, nodes, edges, transform, selectedId, highlightIds]);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(render);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [render]);

  const getNodeAt = useCallback((mx, my) => {
    const { tx, ty, scale } = transform;
    const wx = (mx - tx) / scale;
    const wy = (my - ty) / scale;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (wx >= n.x && wx <= n.x + n.w && wy >= n.y && wy <= n.y + n.h) return n;
    }
    return null;
  }, [nodes, transform]);

  const isOnToggle = useCallback((mx, my, node) => {
    const { tx, ty, scale } = transform;
    const wx = (mx - tx) / scale - node.x;
    return wx > node.w - 15 / scale;
  }, [transform]);

  return { getNodeAt, isOnToggle };
}
