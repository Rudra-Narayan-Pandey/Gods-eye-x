"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import IntelligencePanel from "@/components/IntelligencePanel";

// Dynamically import react-force-graph-3d to avoid SSR window issues
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

export default function GraphPage() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  // Need a ref for the graph instance to control camera
  const fgRef = useRef<any>();

  useEffect(() => {
    // Fetch live graph data from API
    fetch("http://localhost:8000/api/graph")
      .then(res => res.json())
      .then(data => {
        setGraphData({
          nodes: data.nodes || [],
          links: data.links || []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load graph:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Responsive canvas
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
  }, [containerRef.current]);

  // Orbit camera slowly
  useEffect(() => {
    if (!loading && fgRef.current) {
      let angle = 0;
      const interval = setInterval(() => {
        if (fgRef.current) {
          fgRef.current.cameraPosition({
            x: 500 * Math.sin(angle),
            z: 500 * Math.cos(angle)
          });
          angle += Math.PI / 800;
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [loading, fgRef]);

  // Create text sprites for labels using Three.js Sprite
  const generateSprite = useCallback((label: string, color: string) => {
    // This runs purely on client side, so we avoid importing THREE globally at top level
    const THREE = require("three");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return new THREE.Sprite();

    const fontSize = 16;
    context.font = `${fontSize}px Arial`;
    const textWidth = context.measureText(label).width;
    
    canvas.width = Math.max(textWidth + 20, 64);
    canvas.height = 64;

    // Reset font after resizing canvas
    context.font = `bold ${fontSize}px Arial`;
    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = color;
    context.fillText(label, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(canvas.width / 4, canvas.height / 4, 1);
    
    return sprite;
  }, []);

  return (
    <div className="page-content min-h-screen flex flex-col bg-[#020205]">
      <header className="flex-between glass p-4 m-4 rounded-lg z-50 absolute top-0 left-0 right-0">
        <Link href="/" className="font-display text-2xl gradient-text font-bold">
          GOD'S EYE X
        </Link>
        <nav className="flex gap-md">
          <Link href="/search" className="hover:text-accent transition-colors">Search</Link>
          <Link href="/graph" className="text-accent">Graph</Link>
        </nav>
      </header>

      <main className="flex-1 relative w-full h-screen overflow-hidden" ref={containerRef}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-accent">
            <p className="animate-pulse tracking-widest uppercase">Initializing 3D Knowledge Graph Engine...</p>
          </div>
        ) : (
          <div className="absolute inset-0">
            <ForceGraph3D
              ref={fgRef}
              width={dimensions.width}
              height={dimensions.height}
              graphData={graphData}
              nodeRelSize={6}
              nodeResolution={16}
              nodeColor={(node: any) => node.group === 1 ? "#00ff00" : node.group === 2 ? "#ff003c" : "#03a062"}
              nodeOpacity={0.9}
              linkColor={() => "rgba(0, 255, 0, 0.3)"}
              linkResolution={6}
              backgroundColor="#000000"
              enableNodeDrag={false}
              onNodeClick={(node: any) => {
                setSelectedNode(node);
                if (fgRef.current) {
                  // Aim at node from outside it
                  const distance = 100;
                  const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
                  fgRef.current.cameraPosition(
                    { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                    node,
                    2000
                  );
                }
              }}
              nodeThreeObject={(node: any) => {
                const color = node.group === 1 ? "#00ff00" : node.group === 2 ? "#ff003c" : "#03a062";
                const sprite = generateSprite(node.name, color);
                // Shift text down a bit
                sprite.position.y = -8;
                
                // We must return a Group containing the default sphere and the sprite
                const THREE = require("three");
                const group = new THREE.Group();
                const sphere = new THREE.Mesh(
                  new THREE.SphereGeometry(6, 16, 16),
                  new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })
                );
                group.add(sphere);
                group.add(sprite);
                return group;
              }}
            />
          </div>
        )}
        
        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/80 z-30"></div>

        <div className="absolute top-24 right-4 w-[450px] max-w-[calc(100vw-2rem)] z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <IntelligencePanel selectedNode={selectedNode} />
          </div>
        </div>
      </main>
    </div>
  );
}
