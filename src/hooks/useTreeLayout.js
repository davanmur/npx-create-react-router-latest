import { useState, useCallback } from "react";
import { TAXONOMY, allNodes, findById } from "../data/taxonomy";

const NODE_W = 130;
const NODE_H = 36;
const H_GAP = 20;
const V_GAP = 52;

function subtreeWidth(node, collapsed) {
  if (collapsed.has(node.id) || !node.children?.length) return NODE_W;
  const total = node.children.reduce(
    (sum, c) => sum + subtreeWidth(c, collapsed) + H_GAP, 0
  ) - H_GAP;
  return Math.max(NODE_W, total);
}

function buildLayout(node, x, y, collapsed, nodes = [], edges = []) {
  const cx = x + subtreeWidth(node, collapsed) / 2 - NODE_W / 2;
  nodes.push({ ...node, x: cx, y, w: NODE_W, h: NODE_H });
  if (!collapsed.has(node.id) && node.children?.length) {
    let childX = x;
    for (const child of node.children) {
      edges.push({ from: node.id, to: child.id });
      buildLayout(child, childX, y + NODE_H + V_GAP, collapsed, nodes, edges);
      childX += subtreeWidth(child, collapsed) + H_GAP;
    }
  }
  return { nodes, edges };
}

export function useTreeLayout() {
  const [treeData, setTreeData] = useState(TAXONOMY);
  const [collapsed, setCollapsed] = useState(new Set());

  const layout = useCallback(() => {
    return buildLayout(treeData, 0, 0, collapsed);
  }, [treeData, collapsed]);

  const toggleCollapse = useCallback((id) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    const ids = allNodes(treeData)
      .filter((n) => n.children?.length)
      .map((n) => n.id);
    setCollapsed(new Set(ids));
  }, [treeData]);

  const expandAll = useCallback(() => {
    setCollapsed(new Set());
  }, []);

  const addNode = useCallback((parentId, newNode) => {
    setTreeData((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const parent = findById(parentId, clone);
      if (parent) parent.children.push(newNode);
      return clone;
    });
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.delete(parentId);
      return next;
    });
  }, []);

  return { treeData, layout, collapsed, toggleCollapse, collapseAll, expandAll, addNode };
}
