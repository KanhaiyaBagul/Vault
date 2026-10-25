import React, { useState } from "react";
import { CheckCircleIcon, ShieldIcon } from "../icons";

interface MerkleProofVisualizerProps {
  docName: string;
  docRef: string;
  queryToken?: string;
  verified?: boolean;
}

interface TreeNode {
  id: string;
  label: string;
  type: "root" | "intermediate" | "sibling" | "leaf" | "token";
  hash: string;
  x: number;
  y: number;
}

export const MerkleProofVisualizer: React.FC<MerkleProofVisualizerProps> = ({
  docName,
  docRef,
  queryToken = "trapdoor_w",
  verified = true,
}) => {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null);

  // Deterministically derive pseudo-hashes from docRef / docName for visualization
  const getSubHash = (seed: string, offset: number) => {
    const chars = "0123456789abcdef";
    let res = "";
    for (let i = 0; i < 64; i++) {
      const code = (seed.charCodeAt((i + offset) % seed.length) + i * 13) % 16;
      res += chars[code];
    }
    return res;
  };

  const rootHash = getSubHash(docRef + "root", 0);
  const sibling2Hash = getSubHash(docRef + "sib2", 3);
  const interHash = getSubHash(docRef + "inter", 5);
  const sibling1Hash = getSubHash(docRef + "sib1", 7);
  const leafHash = getSubHash(docRef + "leaf", 9);
  const tokenHash = getSubHash(queryToken + "token", 11);

  const nodes: TreeNode[] = [
    {
      id: "root",
      label: "Merkle Root Accumulator",
      type: "root",
      hash: rootHash,
      x: 320,
      y: 42,
    },
    {
      id: "node_inter",
      label: "Node H(Leaf, S1)",
      type: "intermediate",
      hash: interHash,
      x: 180,
      y: 125,
    },
    {
      id: "node_sib2",
      label: "Sibling Hash 2",
      type: "sibling",
      hash: sibling2Hash,
      x: 460,
      y: 125,
    },
    {
      id: "node_leaf",
      label: `Leaf: ${docName.slice(0, 16)}`,
      type: "leaf",
      hash: leafHash,
      x: 100,
      y: 210,
    },
    {
      id: "node_sib1",
      label: "Sibling Hash 1",
      type: "sibling",
      hash: sibling1Hash,
      x: 260,
      y: 210,
    },
    {
      id: "node_token",
      label: `Trapdoor: ${queryToken || "Active Query"}`,
      type: "token",
      hash: tokenHash,
      x: 100,
      y: 285,
    },
  ];

  const activeNode = hoveredNode || selectedNode || nodes[0];

  return (
    <div className="merkle-visualizer-container">
      <div className="merkle-visualizer-header">
        <div className="merkle-header-left">
          <ShieldIcon size={16} color="var(--accent-gold)" />
          <span className="merkle-title">Cryptographic Inclusion Path (Merkle Proof)</span>
        </div>
        <div className="merkle-header-right">
          <span className="merkle-status-badge">
            <CheckCircleIcon size={12} color="var(--status-verified)" />
            <span>Accumulator Proof Verified</span>
          </span>
        </div>
      </div>

      <div className="merkle-canvas-wrapper">
        <svg
          viewBox="0 0 640 330"
          className="merkle-svg-canvas"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow Filter for Active Verification Path */}
            <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="greenGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="verifiedPathGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-red)" />
              <stop offset="60%" stopColor="var(--status-verified)" />
              <stop offset="100%" stopColor="var(--accent-gold)" />
            </linearGradient>
          </defs>

          {/* Connection Lines */}
          <g className="merkle-tree-edges">
            {/* Root to Intermediate and Sibling 2 */}
            <path
              d="M 320 54 L 180 125"
              className="tree-edge-verified"
              stroke="var(--status-verified)"
              strokeWidth="2.5"
              strokeDasharray={verified ? "none" : "4 4"}
            />
            <path
              d="M 320 54 L 460 125"
              className="tree-edge-secondary"
              stroke="var(--border-subtle)"
              strokeWidth="1.75"
            />

            {/* Intermediate to Leaf and Sibling 1 */}
            <path
              d="M 180 125 L 100 210"
              className="tree-edge-verified"
              stroke="var(--status-verified)"
              strokeWidth="2.5"
            />
            <path
              d="M 180 125 L 260 210"
              className="tree-edge-secondary"
              stroke="var(--border-subtle)"
              strokeWidth="1.75"
            />

            {/* Leaf to Query Trapdoor */}
            <path
              d="M 100 210 L 100 285"
              className="tree-edge-token"
              stroke="var(--accent-red)"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </g>

          {/* Sibling 2 Sub-branches (Decorative for full tree context) */}
          <g className="merkle-tree-ambient" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="2 3">
            <line x1="460" y1="125" x2="400" y2="200" />
            <line x1="460" y1="125" x2="520" y2="200" />
            <circle cx="400" cy="200" r="5" fill="var(--bg-subtle)" />
            <circle cx="520" cy="200" r="5" fill="var(--bg-subtle)" />
          </g>

          {/* Interactive Nodes */}
          {nodes.map((node) => {
            const isRoot = node.type === "root";
            const isLeaf = node.type === "leaf";
            const isToken = node.type === "token";
            const isSibling = node.type === "sibling";
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode?.id === node.id;

            let fillColor = "var(--surface-card)";
            let strokeColor = "var(--border-subtle)";
            let strokeWidth = 1.5;
            let filter: string | undefined = undefined;

            if (isRoot) {
              fillColor = "#FDF9EF";
              strokeColor = "var(--accent-gold)";
              strokeWidth = 2.5;
              filter = "url(#goldGlow)";
            } else if (isLeaf) {
              fillColor = "#FEF2F2";
              strokeColor = "var(--accent-red)";
              strokeWidth = 2;
            } else if (isToken) {
              fillColor = "#FAF5FF";
              strokeColor = "var(--ink-secondary)";
              strokeWidth = 1.5;
            } else if (isSibling) {
              fillColor = "var(--bg-subtle)";
              strokeColor = "var(--border-card)";
            } else {
              fillColor = "#F0FDF4";
              strokeColor = "var(--status-verified)";
              strokeWidth = 2;
            }

            if (isSelected || isHovered) {
              strokeWidth = 3;
            }

            return (
              <g
                key={node.id}
                className={`merkle-node-group type-${node.type} ${isSelected ? "selected" : ""}`}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: "pointer" }}
              >
                {/* Node Pill Shape */}
                <rect
                  x="-75"
                  y="-16"
                  width="150"
                  height="32"
                  rx="16"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  filter={filter}
                  className="merkle-node-rect"
                />

                {/* Node Type Indicator Dot */}
                <circle
                  cx="-56"
                  cy="0"
                  r="4"
                  fill={
                    isRoot
                      ? "var(--accent-gold)"
                      : isLeaf
                      ? "var(--accent-red)"
                      : isSibling
                      ? "var(--ink-muted)"
                      : "var(--status-verified)"
                  }
                />

                {/* Node Label */}
                <text
                  x="-44"
                  y="4"
                  fontSize="10"
                  fontWeight="600"
                  fill="var(--ink-primary)"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {node.label.length > 20 ? node.label.slice(0, 18) + ".." : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Cryptographic Digest Inspector */}
      {activeNode && (
        <div className="merkle-node-inspector">
          <div className="inspector-top-row">
            <span className="inspector-badge type-indicator">
              {activeNode.type === "root" && <span className="gold-dot" />}
              {activeNode.label}
            </span>
            <span className="inspector-hint">Click or hover any node to inspect digest</span>
          </div>
          <div className="inspector-hash-box">
            <span className="hash-prefix">SHA-256:</span>
            <code className="merkle-hash-code">{activeNode.hash}</code>
          </div>
        </div>
      )}
    </div>
  );
};
