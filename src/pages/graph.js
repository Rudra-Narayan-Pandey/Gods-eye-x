/**
 * GOD'S EYE X — Graph Explorer
 * Force-directed graph visualization with D3.js canvas rendering
 */

import * as d3 from 'd3';
import { debounce } from '../utils/helpers.js';

/* ── colour map by node type ───────────────────────────── */
const TYPE_COLORS = {
  Company:    '#6366f1',
  Technology: '#8b5cf6',
  Country:    '#10b981',
  Event:      '#f59e0b',
  Startup:    '#ec4899',
};

const TYPE_BADGE_CLASS = {
  Company:    'badge badge-indigo',
  Technology: 'badge badge-purple',
  Country:    'badge badge-green',
  Event:      'badge badge-amber',
  Startup:    'badge badge-red',
};

/* ── helper: convert hex to rgba ───────────────────────── */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ══════════════════════════════════════════════════════════
   MAIN RENDER
   ══════════════════════════════════════════════════════════ */
export async function renderGraph(container) {

  /* ── Fetch real data from API ──────────────────────────── */
  let nodes = [];
  let edges = [];
  try {
    const res = await fetch('/api/graph');
    if (res.ok) {
      const data = await res.json();
      nodes = data.nodes || [];
      edges = data.edges || [];
    }
  } catch (err) {
    console.error("Failed to load graph data", err);
  }

  /* ── deep-clone data so we don't mutate the source ────── */
  nodes = nodes.map(n => ({ ...n, properties: { ...n.properties } }));
  edges = edges.map(e => ({ ...e }));

  /* ── state ──────────────────────────────────────────────── */
  const state = {
    activeFilters: new Set(Object.keys(TYPE_COLORS)),
    selectedNode: null,
    hoveredNode: null,
    transform: d3.zoomIdentity,
    simulation: null,
    animId: null,
    destroyed: false,
  };

  /* ── build DOM ──────────────────────────────────────────── */
  container.innerHTML = '';
  const page = document.createElement('div');
  page.className = 'graph-page';

  /* ---------- toolbar ---------- */
  page.innerHTML = `
    <div class="graph-toolbar">
      <div class="graph-toolbar-group">
        <div class="graph-search-wrapper">
          <span class="search-icon">⌕</span>
          <input class="graph-search-input" type="text" placeholder="Search nodes…" spellcheck="false" />
        </div>
        <div class="graph-toolbar-sep"></div>
        ${Object.entries(TYPE_COLORS).map(([type, color]) => `
          <button class="graph-filter-btn active" data-type="${type}" style="--filter-color:${color}">
            <span class="filter-dot" style="background:${color}"></span>
            ${type}
          </button>
        `).join('')}
      </div>
      <div class="graph-toolbar-group">
        <select class="graph-layout-select">
          <option value="force">Force</option>
          <option value="radial">Radial</option>
          <option value="cluster">Cluster</option>
        </select>
        <div class="graph-toolbar-sep"></div>
        <button class="graph-export-btn">⤓ Export PNG</button>
      </div>
    </div>

    <div class="graph-canvas-container">
      <canvas class="graph-canvas"></canvas>

      <!-- Stats badge -->
      <div class="graph-stats">
        <div class="stat-item">Nodes <span class="stat-value" id="gstat-nodes">${nodes.length}</span></div>
        <div class="stat-divider"></div>
        <div class="stat-item">Edges <span class="stat-value" id="gstat-edges">${edges.length}</span></div>
      </div>

      <!-- Legend -->
      <div class="graph-legend">
        ${Object.entries(TYPE_COLORS).map(([t, c]) => `
          <div class="graph-legend-item"><span class="graph-legend-dot" style="background:${c}"></span>${t}</div>
        `).join('')}
      </div>

      <!-- Zoom controls -->
      <div class="graph-controls">
        <button class="graph-control-btn" data-action="zoom-in" title="Zoom In">＋</button>
        <div class="graph-control-divider"></div>
        <button class="graph-control-btn" data-action="zoom-out" title="Zoom Out">−</button>
        <div class="graph-control-divider"></div>
        <button class="graph-control-btn" data-action="zoom-fit" title="Fit to Screen">⊡</button>
      </div>

      <!-- Tooltip -->
      <div class="graph-tooltip" id="graph-tooltip">
        <div class="tooltip-name"></div>
        <div class="tooltip-type"></div>
        <div class="tooltip-detail"></div>
      </div>

      <!-- Node detail panel -->
      <div class="graph-node-panel" id="graph-node-panel">
        <div class="graph-node-panel-header">
          <div>
            <div class="node-name"></div>
            <div class="node-type-badge"></div>
          </div>
          <button class="graph-node-panel-close">✕</button>
        </div>
        <div class="graph-node-panel-body"></div>
      </div>

      <!-- Loading overlay -->
      <div class="graph-loading" id="graph-loading">
        <div class="graph-loading-spinner"></div>
        <div class="graph-loading-text">Mapping intelligence graph…</div>
      </div>
    </div>
  `;

  container.appendChild(page);

  /* ── grab references ─────────────────────────────────── */
  const canvasContainer = page.querySelector('.graph-canvas-container');
  const canvas  = page.querySelector('.graph-canvas');
  const ctx     = canvas.getContext('2d');
  const tooltip = page.querySelector('#graph-tooltip');
  const panel   = page.querySelector('#graph-node-panel');
  const loading = page.querySelector('#graph-loading');

  /* ── high-DPI canvas ─────────────────────────────────── */
  const dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    const rect = canvasContainer.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width  = rect.width  + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: rect.width, h: rect.height };
  }

  let { w: canvasW, h: canvasH } = resizeCanvas();

  /* ── radius scale ─────────────────────────────────────── */
  const rScale = d3.scaleSqrt().domain([4, 20]).range([5, 22]);

  /* ── build simulation ─────────────────────────────────── */
  function buildSimulation(layout) {
    if (state.simulation) state.simulation.stop();

    const sim = d3.forceSimulation(nodes)
      .alphaDecay(0.02)
      .velocityDecay(0.35);

    // link force
    const linkForce = d3.forceLink(edges)
      .id(d => d.id)
      .distance(110)
      .strength(0.4);

    sim.force('link', linkForce);
    sim.force('charge', d3.forceManyBody().strength(-220));
    sim.force('collide', d3.forceCollide(d => rScale(d.size) + 4));

    if (layout === 'force') {
      sim.force('center', d3.forceCenter(canvasW / 2, canvasH / 2));
      sim.force('x', d3.forceX(canvasW / 2).strength(0.04));
      sim.force('y', d3.forceY(canvasH / 2).strength(0.04));
    } else if (layout === 'radial') {
      const typeList = Object.keys(TYPE_COLORS);
      sim.force('center', null);
      sim.force('x', null);
      sim.force('y', null);
      sim.force('r', d3.forceRadial(d => {
        const idx = typeList.indexOf(d.type);
        return 80 + idx * 90;
      }, canvasW / 2, canvasH / 2).strength(0.8));
    } else if (layout === 'cluster') {
      const typeList = Object.keys(TYPE_COLORS);
      const cols = 3;
      sim.force('center', null);
      sim.force('r', null);
      sim.force('x', d3.forceX(d => {
        const idx = typeList.indexOf(d.type);
        const col = idx % cols;
        return (canvasW / (cols + 1)) * (col + 1);
      }).strength(0.6));
      sim.force('y', d3.forceY(d => {
        const idx = typeList.indexOf(d.type);
        const row = Math.floor(idx / cols);
        return (canvasH / 3) * (row + 1);
      }).strength(0.6));
    }

    sim.alpha(1).restart();
    state.simulation = sim;
    return sim;
  }

  const sim = buildSimulation('force');

  /* ── adjacency helpers ──────────────────────────────── */
  function getConnectedNodeIds(nodeId) {
    const ids = new Set();
    edges.forEach(e => {
      const sId = typeof e.source === 'object' ? e.source.id : e.source;
      const tId = typeof e.target === 'object' ? e.target.id : e.target;
      if (sId === nodeId) ids.add(tId);
      if (tId === nodeId) ids.add(sId);
    });
    return ids;
  }

  function getNodeEdges(nodeId) {
    return edges.filter(e => {
      const sId = typeof e.source === 'object' ? e.source.id : e.source;
      const tId = typeof e.target === 'object' ? e.target.id : e.target;
      return sId === nodeId || tId === nodeId;
    });
  }

  /* ── visibility helpers ─────────────────────────────── */
  function nodeVisible(d) {
    return state.activeFilters.has(d.type);
  }

  function edgeVisible(e) {
    const s = typeof e.source === 'object' ? e.source : nodes.find(n => n.id === e.source);
    const t = typeof e.target === 'object' ? e.target : nodes.find(n => n.id === e.target);
    return s && t && nodeVisible(s) && nodeVisible(t);
  }

  /* ── tick / draw ────────────────────────────────────── */
  let tickCount = 0;

  function draw() {
    if (state.destroyed) return;

    const w = canvasW;
    const h = canvasH;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // apply zoom transform
    const t = state.transform;
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    const selectedId = state.selectedNode ? state.selectedNode.id : null;
    const hoveredId  = state.hoveredNode ? state.hoveredNode.id : null;
    const highlightId = hoveredId || selectedId;
    const connectedIds = highlightId ? getConnectedNodeIds(highlightId) : new Set();

    /* ── Draw edges ─────────────────────────────────── */
    edges.forEach(e => {
      if (!edgeVisible(e)) return;
      const sx = e.source.x, sy = e.source.y;
      const tx = e.target.x, ty = e.target.y;
      if (sx == null || tx == null) return;

      const sId = e.source.id;
      const tId = e.target.id;
      const isConnected = highlightId && (sId === highlightId || tId === highlightId);
      const dimmed = highlightId && !isConnected;

      const color = TYPE_COLORS[e.source.type] || '#6366f1';

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);

      if (e.type === 'AFFECTED_BY') {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }

      if (isConnected) {
        const pulse = 0.35 + 0.15 * Math.sin(tickCount * 0.06);
        ctx.strokeStyle = hexToRgba(color, pulse + 0.25);
        ctx.lineWidth = 1.8;
      } else if (dimmed) {
        ctx.strokeStyle = hexToRgba(color, 0.04);
        ctx.lineWidth = 0.5;
      } else {
        ctx.strokeStyle = hexToRgba(color, 0.15);
        ctx.lineWidth = 0.8;
      }

      ctx.stroke();
      ctx.setLineDash([]);
    });

    /* ── Draw nodes ────────────────────────────────── */
    nodes.forEach(d => {
      if (!nodeVisible(d)) return;
      if (d.x == null) return;

      const r = rScale(d.size);
      const color = TYPE_COLORS[d.type] || '#6366f1';
      const isSelected = d.id === selectedId;
      const isHovered  = d.id === hoveredId;
      const isConnected = highlightId && connectedIds.has(d.id);
      const dimmed = highlightId && d.id !== highlightId && !isConnected;

      // Glow for hovered / selected
      if (isHovered || isSelected) {
        ctx.save();
        ctx.shadowBlur = isSelected ? 24 : 18;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r + 2, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, 0.2);
        ctx.fill();
        ctx.restore();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      const alpha = dimmed ? 0.12 : (isConnected ? 0.9 : 0.75);
      ctx.fillStyle = hexToRgba(color, alpha);
      ctx.fill();

      // Bright ring for selected
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, r + 3, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Label for larger nodes
      if (d.size >= 9 && !dimmed) {
        ctx.font = `${d.size >= 14 ? '11' : '10'}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = dimmed
          ? 'rgba(238,238,245,0.15)'
          : (isHovered || isSelected)
            ? 'rgba(238,238,245,1)'
            : 'rgba(238,238,245,0.7)';
        ctx.fillText(d.label, d.x, d.y + r + 4);
      }
    });

    ctx.restore();
    tickCount++;
    state.animId = requestAnimationFrame(draw);
  }

  sim.on('tick', () => {});   // simulation ticks internally
  state.animId = requestAnimationFrame(draw);

  /* ── zoom behaviour ──────────────────────────────── */
  const zoomBehavior = d3.zoom()
    .scaleExtent([0.3, 5])
    .on('zoom', (event) => {
      state.transform = event.transform;
    });

  d3.select(canvas).call(zoomBehavior);

  /* ── hit-testing ─────────────────────────────────── */
  function nodeAtPoint(mx, my) {
    // transform mouse into simulation coords
    const t = state.transform;
    const sx = (mx - t.x) / t.k;
    const sy = (my - t.y) / t.k;

    // iterate back-to-front so topmost wins
    for (let i = nodes.length - 1; i >= 0; i--) {
      const d = nodes[i];
      if (!nodeVisible(d) || d.x == null) continue;
      const r = rScale(d.size) + 4;
      const dx = sx - d.x;
      const dy = sy - d.y;
      if (dx * dx + dy * dy < r * r) return d;
    }
    return null;
  }

  /* ── mouse move — hover + tooltip ─────────────────── */
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const node = nodeAtPoint(mx, my);

    state.hoveredNode = node;
    canvas.style.cursor = node ? 'pointer' : 'grab';

    if (node) {
      tooltip.querySelector('.tooltip-name').textContent = node.label;
      tooltip.querySelector('.tooltip-type').textContent = node.type;
      tooltip.querySelector('.tooltip-type').style.color = TYPE_COLORS[node.type];
      const firstProp = Object.entries(node.properties)[0];
      tooltip.querySelector('.tooltip-detail').textContent = firstProp
        ? `${firstProp[0]}: ${firstProp[1]}`
        : '';
      tooltip.classList.add('visible');
      const tx = Math.min(e.clientX - canvasContainer.getBoundingClientRect().left + 14, canvasW - 260);
      const ty = e.clientY - canvasContainer.getBoundingClientRect().top - 10;
      tooltip.style.left = tx + 'px';
      tooltip.style.top  = ty + 'px';
    } else {
      tooltip.classList.remove('visible');
    }
  });

  canvas.addEventListener('mouseleave', () => {
    state.hoveredNode = null;
    tooltip.classList.remove('visible');
  });

  /* ── click — select node ──────────────────────────── */
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const node = nodeAtPoint(mx, my);

    if (node) {
      selectNode(node);
    } else {
      deselectNode();
    }
  });

  /* ── double-click — zoom to node ─────────────────── */
  canvas.addEventListener('dblclick', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const node = nodeAtPoint(mx, my);

    if (node) {
      zoomToNode(node, 2.2);
    }
  });

  /* ── drag ────────────────────────────────────────── */
  let dragNode = null;
  let dragStarted = false;

  const dragBehavior = d3.drag()
    .container(canvas)
    .subject((event) => {
      const mx = event.x;
      const my = event.y;
      return nodeAtPoint(mx, my);
    })
    .on('start', (event) => {
      if (!event.subject) return;
      dragNode = event.subject;
      dragStarted = true;
      if (!event.active) sim.alphaTarget(0.3).restart();
      dragNode.fx = dragNode.x;
      dragNode.fy = dragNode.y;
    })
    .on('drag', (event) => {
      if (!dragNode) return;
      const t = state.transform;
      dragNode.fx = (event.sourceEvent.offsetX - t.x) / t.k;
      dragNode.fy = (event.sourceEvent.offsetY - t.y) / t.k;
    })
    .on('end', (event) => {
      if (!event.active) sim.alphaTarget(0);
      if (dragNode) {
        dragNode.fx = null;
        dragNode.fy = null;
      }
      dragNode = null;
      dragStarted = false;
    });

  d3.select(canvas).call(dragBehavior);

  /* ── select / deselect ──────────────────────────── */
  function selectNode(node) {
    state.selectedNode = node;
    openPanel(node);
  }

  function deselectNode() {
    state.selectedNode = null;
    panel.classList.remove('visible');
  }

  /* ── panel ──────────────────────────────────────── */
  function openPanel(node) {
    panel.classList.add('visible');
    const color = TYPE_COLORS[node.type];

    panel.querySelector('.node-name').textContent = node.label;
    const badge = panel.querySelector('.node-type-badge');
    badge.textContent = node.type;
    badge.className = 'node-type-badge ' + (TYPE_BADGE_CLASS[node.type] || 'badge badge-cyan');

    // Build body
    const body = panel.querySelector('.graph-node-panel-body');
    body.innerHTML = '';

    // Properties section
    const propsSection = document.createElement('div');
    propsSection.className = 'graph-node-panel-section';
    propsSection.innerHTML = `<div class="section-label">Properties</div>`;

    Object.entries(node.properties).forEach(([key, val]) => {
      const row = document.createElement('div');
      row.className = 'graph-node-property';
      row.innerHTML = `
        <span class="prop-label">${formatPropKey(key)}</span>
        <span class="prop-value">${val}</span>
      `;
      propsSection.appendChild(row);
    });
    body.appendChild(propsSection);

    // Connections section
    const connEdges = getNodeEdges(node.id);
    if (connEdges.length > 0) {
      const connSection = document.createElement('div');
      connSection.className = 'graph-node-panel-section';
      connSection.innerHTML = `<div class="section-label">Connections (${connEdges.length})</div>`;

      connEdges.forEach(e => {
        const sId = typeof e.source === 'object' ? e.source.id : e.source;
        const tId = typeof e.target === 'object' ? e.target.id : e.target;
        const otherNodeId = sId === node.id ? tId : sId;
        const otherNode = nodes.find(n => n.id === otherNodeId);
        if (!otherNode) return;

        const item = document.createElement('div');
        item.className = 'graph-connection-item';
        const relColor = TYPE_COLORS[otherNode.type] || '#6366f1';
        item.innerHTML = `
          <span class="conn-name" style="color:${relColor}">${otherNode.label}</span>
          <span class="conn-type">${e.type.replace(/_/g, ' ')}</span>
        `;
        item.addEventListener('click', () => {
          selectNode(otherNode);
          zoomToNode(otherNode, 1.6);
        });
        connSection.appendChild(item);
      });

      body.appendChild(connSection);
    }
  }

  function formatPropKey(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, s => s.toUpperCase());
  }

  /* Panel close */
  panel.querySelector('.graph-node-panel-close').addEventListener('click', deselectNode);

  /* ── zoom helpers ────────────────────────────────── */
  function zoomToNode(node, scale) {
    const targetX = canvasW / 2 - node.x * scale;
    const targetY = canvasH / 2 - node.y * scale;
    d3.select(canvas)
      .transition()
      .duration(700)
      .call(zoomBehavior.transform, d3.zoomIdentity.translate(targetX, targetY).scale(scale));
  }

  function zoomFit() {
    const visibleNodes = nodes.filter(nodeVisible);
    if (visibleNodes.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    visibleNodes.forEach(d => {
      if (d.x == null) return;
      const r = rScale(d.size);
      minX = Math.min(minX, d.x - r);
      minY = Math.min(minY, d.y - r);
      maxX = Math.max(maxX, d.x + r);
      maxY = Math.max(maxY, d.y + r);
    });

    const bw = maxX - minX;
    const bh = maxY - minY;
    const padding = 60;
    const scale = Math.min((canvasW - padding * 2) / bw, (canvasH - padding * 2) / bh, 2.5);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const tx = canvasW / 2 - cx * scale;
    const ty = canvasH / 2 - cy * scale;

    d3.select(canvas)
      .transition()
      .duration(700)
      .call(zoomBehavior.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }

  /* ── zoom buttons ─────────────────────────────────── */
  page.querySelectorAll('.graph-control-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'zoom-in') {
        d3.select(canvas).transition().duration(300).call(zoomBehavior.scaleBy, 1.4);
      } else if (action === 'zoom-out') {
        d3.select(canvas).transition().duration(300).call(zoomBehavior.scaleBy, 0.7);
      } else if (action === 'zoom-fit') {
        zoomFit();
      }
    });
  });

  /* ── filter buttons ──────────────────────────────── */
  page.querySelectorAll('.graph-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      if (state.activeFilters.has(type)) {
        state.activeFilters.delete(type);
        btn.classList.remove('active');
        btn.classList.add('inactive');
      } else {
        state.activeFilters.add(type);
        btn.classList.add('active');
        btn.classList.remove('inactive');
      }
      updateStats();
    });
  });

  function updateStats() {
    const vn = nodes.filter(nodeVisible).length;
    const ve = edges.filter(edgeVisible).length;
    page.querySelector('#gstat-nodes').textContent = vn;
    page.querySelector('#gstat-edges').textContent = ve;
  }

  /* ── search ──────────────────────────────────────── */
  const searchInput = page.querySelector('.graph-search-input');
  searchInput.addEventListener('input', debounce(() => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) return;
    const match = nodes.find(n => n.label.toLowerCase().includes(q) && nodeVisible(n));
    if (match) {
      selectNode(match);
      zoomToNode(match, 2);
    }
  }, 300));

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchInput.blur();
      deselectNode();
    }
  });

  /* ── layout change ──────────────────────────────── */
  const layoutSelect = page.querySelector('.graph-layout-select');
  layoutSelect.addEventListener('change', () => {
    buildSimulation(layoutSelect.value);
  });

  /* ── export PNG ─────────────────────────────────── */
  page.querySelector('.graph-export-btn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'godseye-graph.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  /* ── resize ─────────────────────────────────────── */
  const handleResize = debounce(() => {
    if (state.destroyed) return;
    ({ w: canvasW, h: canvasH } = resizeCanvas());
    if (sim) {
      const center = sim.force('center');
      if (center) center.x(canvasW / 2).y(canvasH / 2);
      sim.alpha(0.3).restart();
    }
  }, 150);

  window.addEventListener('resize', handleResize);

  /* ── loading fade-out ────────────────────────────── */
  setTimeout(() => {
    loading.classList.add('hidden');
    setTimeout(() => loading.remove(), 600);
  }, 900);

  /* ── cleanup on navigation ──────────────────────── */
  const observer = new MutationObserver(() => {
    if (!document.contains(page)) {
      state.destroyed = true;
      if (state.animId) cancelAnimationFrame(state.animId);
      if (state.simulation) state.simulation.stop();
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
