"use client";
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";

// Canvas with zoom and pan support.
// - Wheel to zoom centered at cursor
// - Middle-mouse (or hold space) + drag to pan
// - Left-mouse to draw; strokes stored in world coordinates so they scale cleanly
// Exposes imperative methods: zoomIn, zoomOut, reset

const Canvas = forwardRef(function Canvas(_, ref) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const translate = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const isDrawing = useRef(false);
  const currentPath = useRef([]);
  const paths = useRef([]); // array of paths, each path is array of points in world coords

  // Utility: convert screen (event.clientX/Y) to canvas-local coordinates
  function screenToCanvas(x, y) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const cx = x - rect.left;
    const cy = y - rect.top;
    // convert to world coordinates (account for translate and scale)
    return {
      x: (cx - translate.current.x) / scale,
      y: (cy - translate.current.y) / scale,
    };
  }

  function resize() {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  // Draw all stored paths using current transform (scale + translate)
  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // clear (use css pixel coordinates)
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Apply world transform: translate then scale
    ctx.save();
    ctx.translate(translate.current.x, translate.current.y);
    ctx.scale(scale, scale);

    // draw each saved path (world coords)
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const p of paths.current) {
      if (!p || p.length === 0) continue;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.moveTo(p[0].x, p[0].y);
      for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
      ctx.stroke();
    }

    // draw current path being drawn
    if (currentPath.current.length) {
      const p = currentPath.current;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.moveTo(p[0].x, p[0].y);
      for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Keep a consistent redraw loop when state changes
  useEffect(() => {
    draw();
  }, [scale]);

  // Resize observer
  useEffect(() => {
    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Wheel zoom handler — zooms centered on cursor
  function handleWheel(e) {
    if (!canvasRef.current) return;
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const zoomIntensity = 0.1; // zoom per wheel step
    const delta = -e.deltaY;
    const factor = Math.exp((delta > 0 ? 1 : -1) * zoomIntensity);

    // world coordinate under cursor before zoom
    const wx = (cx - translate.current.x) / scale;
    const wy = (cy - translate.current.y) / scale;

    const newScale = Math.max(0.1, Math.min(10, scale * factor));

    // adjust translate so the world point under cursor stays under cursor
    translate.current.x = cx - wx * newScale;
    translate.current.y = cy - wy * newScale;
    setScale(newScale);
  }

  // Mouse handlers for draw + pan
  function handlePointerDown(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // If middle mouse button or space pressed -> start panning
    if (e.button === 1 || e.button === 2 || e.shiftKey || e.metaKey) {
      // treat middle/right/shift/meta as pan (customize as needed)
      isPanning.current = true;
      panStart.current = { x: e.clientX - translate.current.x, y: e.clientY - translate.current.y };
      return;
    }

    // left button -> start drawing
    if (e.button === 0) {
      isDrawing.current = true;
      const pt = screenToCanvas(e.clientX, e.clientY);
      currentPath.current = [pt];
      draw();
    }
  }

  function handlePointerMove(e) {
    if (isPanning.current) {
      translate.current.x = e.clientX - panStart.current.x;
      translate.current.y = e.clientY - panStart.current.y;
      draw();
      return;
    }
    if (isDrawing.current) {
      const pt = screenToCanvas(e.clientX, e.clientY);
      currentPath.current.push(pt);
      draw();
    }
  }

  function handlePointerUp(e) {
    if (isPanning.current) {
      isPanning.current = false;
      return;
    }
    if (isDrawing.current) {
      isDrawing.current = false;
      // commit path
      if (currentPath.current.length) {
        paths.current.push(currentPath.current.slice());
        currentPath.current = [];
      }
      draw();
    }
  }

  // Prevent context menu on right click to allow right-button panning if used
  function handleContextMenu(e) {
    e.preventDefault();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("contextmenu", handleContextMenu);
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [scale]);

  // Imperative methods exposed to parent
  useImperativeHandle(ref, () => ({
    zoomIn: (factor = 1.2) => {
      // center zoom on viewport center
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const wx = (cx - translate.current.x) / scale;
      const wy = (cy - translate.current.y) / scale;
      const newScale = Math.min(10, scale * factor);
      translate.current.x = cx - wx * newScale;
      translate.current.y = cy - wy * newScale;
      setScale(newScale);
    },
    zoomOut: (factor = 1.2) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const wx = (cx - translate.current.x) / scale;
      const wy = (cy - translate.current.y) / scale;
      const newScale = Math.max(0.1, scale / factor);
      translate.current.x = cx - wx * newScale;
      translate.current.y = cy - wy * newScale;
      setScale(newScale);
    },
    reset: () => {
      translate.current = { x: 0, y: 0 };
      setScale(1);
    },
  }));

  return (
    <div ref={containerRef} style={{ flex: 1, position: "relative", height: '80vh' }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", touchAction: 'none', background: '#fff' }} />
    </div>
  );
});

export default Canvas;
