// Drifting nodes reconnect as they move; new line crossings exchange theme colors.
document.querySelectorAll('.network-canvas').forEach(circuit => {
  const circuitContext = circuit.getContext('2d');
  if (!circuitContext) return;
  const leftward = circuit.dataset.flow === 'left';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const theme = getComputedStyle(document.documentElement);
  const colors = ['cyan', 'violet', 'green', 'amber', 'pink'].map(name => theme.getPropertyValue('--' + name).trim());
  let seed = 27;
  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const nodes = Array.from({ length: Number(circuit.dataset.nodes) || 25 }, (_, id) => {
    const angle = random() * Math.PI * 2;
    const speed = 12 + random() * 12;
    return { id, x: .06 + random() * .88, y: .06 + random() * .88,
      vx: leftward ? -speed : Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      color: id % colors.length, pulse: 0 };
  });
  let previousCrossings = new Set();
  let circuitWidth = 0;
  let circuitHeight = 0;
  let frameId = 0;
  let lastFrame = 0;
  let onScreen = true;

  function intersection(a, b, c, d) {
    const rx = b.x - a.x, ry = b.y - a.y;
    const sx = d.x - c.x, sy = d.y - c.y;
    const denominator = rx * sy - ry * sx;
    if (Math.abs(denominator) < .000001) return null;
    const t = ((c.x - a.x) * sy - (c.y - a.y) * sx) / denominator;
    const u = ((c.x - a.x) * ry - (c.y - a.y) * rx) / denominator;
    return t > 0 && t < 1 && u > 0 && u < 1 ? { x: a.x + t * rx, y: a.y + t * ry } : null;
  }

  function drawCircuit(delta = 0) {
    if (!circuitWidth || !circuitHeight) return;
    nodes.forEach(node => {
      node.x += node.vx * delta / circuitWidth;
      node.y += node.vy * delta / circuitHeight;
      if (leftward) {
        if (node.x < -.02) { node.x = 1.02; node.y = .06 + random() * .88; }
      } else if (node.x < .035 || node.x > .965) { node.vx *= -1; node.x = Math.max(.035, Math.min(.965, node.x)); }
      if (node.y < .035 || node.y > .965) { node.vy *= -1; node.y = Math.max(.035, Math.min(.965, node.y)); }
      node.pulse = Math.max(0, node.pulse - delta);
    });
    const points = nodes.map(node => ({ x: node.x * circuitWidth, y: node.y * circuitHeight }));
    const reach = Math.min(240, Math.max(110, circuitWidth * .24));
    const edges = [];
    nodes.forEach((node, a) => {
      const nearest = nodes.map((other, b) => ({ b, distance: Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y) }))
        .filter(item => item.b !== a && item.distance < reach).sort((a, b) => a.distance - b.distance).slice(0, 3);
      nearest.forEach(({ b, distance }) => {
        const key = Math.min(a, b) + ':' + Math.max(a, b);
        if (!edges.some(edge => edge.key === key)) edges.push({ a, b, key, distance });
      });
    });
    const crossings = new Set();
    const touched = new Set();
    for (let i = 0; i < edges.length; i++) {
      for (let j = i + 1; j < edges.length; j++) {
        const a = edges[i], b = edges[j];
        if (a.a === b.a || a.a === b.b || a.b === b.a || a.b === b.b) continue;
        if (!intersection(points[a.a], points[a.b], points[b.a], points[b.b])) continue;
        const key = [a.key, b.key].sort().join('|');
        crossings.add(key);
        if (delta > 0 && !previousCrossings.has(key)) [a.a, a.b, b.a, b.b].forEach(id => touched.add(id));
      }
    }
    touched.forEach(id => { nodes[id].color = (nodes[id].color + 1) % colors.length; nodes[id].pulse = .7; });
    previousCrossings = crossings;
    circuitContext.clearRect(0, 0, circuitWidth, circuitHeight);
    edges.forEach(({ a, b, distance }) => {
      circuitContext.strokeStyle = colors[nodes[a].color];
      circuitContext.globalAlpha = .12 + (1 - distance / reach) * .24;
      circuitContext.lineWidth = 1;
      circuitContext.beginPath();
      circuitContext.moveTo(points[a].x, points[a].y);
      circuitContext.lineTo(points[b].x, points[b].y);
      circuitContext.stroke();
    });
    nodes.forEach((node, index) => {
      circuitContext.fillStyle = colors[node.color];
      circuitContext.globalAlpha = node.pulse ? .95 : .7;
      circuitContext.beginPath();
      circuitContext.arc(points[index].x, points[index].y, node.pulse ? 2.8 : 2, 0, Math.PI * 2);
      circuitContext.fill();
    });
    circuitContext.globalAlpha = 1;
  }

  function animateCircuit(time) {
    if (time - lastFrame >= 33) {
      drawCircuit(lastFrame ? Math.min((time - lastFrame) / 1000, .05) : 0);
      lastFrame = time;
    }
    frameId = requestAnimationFrame(animateCircuit);
  }

  function updateCircuitMotion() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    lastFrame = 0;
    if (motionPreference.matches) drawCircuit(0);
    else if (onScreen && !document.hidden) frameId = requestAnimationFrame(animateCircuit);
  }

  function resizeCircuit() {
    const bounds = circuit.getBoundingClientRect();
    circuitWidth = bounds.width;
    circuitHeight = bounds.height;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    circuit.width = Math.round(circuitWidth * scale);
    circuit.height = Math.round(circuitHeight * scale);
    circuitContext.setTransform(scale, 0, 0, scale, 0, 0);
    drawCircuit(0);
  }

  new ResizeObserver(resizeCircuit).observe(circuit.parentElement);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      onScreen = entries[0].isIntersecting;
      updateCircuitMotion();
    }).observe(circuit);
  }
  motionPreference.addEventListener('change', updateCircuitMotion);
  document.addEventListener('visibilitychange', updateCircuitMotion);
  resizeCircuit();
  updateCircuitMotion();
});
