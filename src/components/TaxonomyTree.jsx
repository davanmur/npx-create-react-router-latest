import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useTreeLayout } from "../hooks/useTreeLayout";
import { useCanvasRenderer } from "../hooks/useCanvasRenderer";
import { allNodes } from "../data/taxonomy";
import { DetailPanel } from "./DetailPanel";
import { AddPlantBar } from "./AddPlantBar";
import styles from "./TaxonomyTree.module.css";

export function TaxonomyTree() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [transform, setTransform] = useState({ tx: 0, ty: 60, scale: 1 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [, forceUpdate] = useState(0);

  const { treeData, layout, collapsed, toggleCollapse, collapseAll, expandAll, addNode } =
    useTreeLayout();

  const { nodes, edges } = useMemo(() => layout(), [layout]);

  // Annotate nodes with their collapsed state for the renderer
  const annotatedNodes = useMemo(
    () => nodes.map((n) => ({ ...n, _collapsed: collapsed.has(n.id) })),
    [nodes, collapsed]
  );

  const highlightIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set();
    const q = searchQuery.toLowerCase();
    return new Set(
      allNodes(treeData)
        .filter((n) => n.name.toLowerCase().includes(q) || n.rank.toLowerCase().includes(q))
        .map((n) => n.id)
    );
  }, [searchQuery, treeData]);

  const { getNodeAt, isOnToggle } = useCanvasRenderer({
    canvasRef,
    nodes: annotatedNodes,
    edges,
    transform,
    selectedId: selectedNode?.id ?? null,
    highlightIds,
  });

  // Resize canvas to fill container
  useEffect(() => {
    function resize() {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      forceUpdate((v) => v + 1);
    }
    resize();
    const ro = new ResizeObserver(resize);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Pointer / drag handling
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });

  const handlePointerDown = useCallback(
    (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const node = getNodeAt(mx, my);

      if (node) {
        if (node.children?.length && isOnToggle(mx, my, node)) {
          toggleCollapse(node.id);
        } else {
          setSelectedNode(node);
        }
        return;
      }
      dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
      wrapRef.current.style.cursor = "grabbing";
    },
    [getNodeAt, isOnToggle, toggleCollapse]
  );

  useEffect(() => {
    function onMove(e) {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      setTransform((t) => ({ ...t, tx: t.tx + dx, ty: t.ty + dy }));
    }
    function onUp() {
      dragRef.current.active = false;
      if (wrapRef.current) wrapRef.current.style.cursor = "grab";
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.1 : 0.91;
    setTransform((t) => {
      const newScale = Math.max(0.3, Math.min(3, t.scale * factor));
      return {
        tx: mx - (mx - t.tx) * (newScale / t.scale),
        ty: my - (my - t.ty) * (newScale / t.scale),
        scale: newScale,
      };
    });
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrap.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  function resetView() {
    const W = wrapRef.current?.clientWidth ?? 800;
    setTransform({ tx: W / 2 - 65, ty: 60, scale: 1 });
    setSearchQuery("");
    setSelectedNode(null);
  }

  function centerOn(node) {
    const W = wrapRef.current?.clientWidth ?? 800;
    const H = wrapRef.current?.clientHeight ?? 600;
    setTransform((t) => ({
      ...t,
      tx: W / 2 - (node.x + node.w / 2) * t.scale,
      ty: H / 2 - (node.y + node.h / 2) * t.scale,
    }));
  }

  function handleSelectChild(child) {
    setSelectedNode(child);
    const found = nodes.find((n) => n.id === child.id);
    if (found) centerOn(found);
  }

  function handleAddNode(parentId, newNode) {
    addNode(parentId, newNode);
    // Wait for next layout cycle then center on the new node
    setTimeout(() => {
      const { nodes: newNodes } = layout();
      const found = newNodes.find((n) => n.id === newNode.id);
      if (found) {
        centerOn(found);
        setSelectedNode(newNode);
      }
    }, 50);
  }

  return (
    <div className={styles.app}>
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="text"
          placeholder="Search plants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className={styles.tbtn} onClick={resetView}>Reset view</button>
        <button className={styles.tbtn} onClick={collapseAll}>Collapse all</button>
        <button className={styles.tbtn} onClick={expandAll}>Expand all</button>
      </div>

      <div className={styles.canvasWrap} ref={wrapRef} onMouseDown={handlePointerDown}>
        <canvas ref={canvasRef} />
        <DetailPanel
          node={selectedNode}
          nodes={nodes}
          onClose={() => setSelectedNode(null)}
          onSelectChild={handleSelectChild}
        />
      </div>

      <AddPlantBar onAdd={handleAddNode} />
    </div>
  );
}
