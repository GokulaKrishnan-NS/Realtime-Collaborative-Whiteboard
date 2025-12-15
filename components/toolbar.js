export default function Toolbar({ onZoomIn, onZoomOut, onReset }) {
  return (
    <div style={{ padding: 10, background: "#eee", display: 'flex', gap: 8 }}>
      <button>Brush</button>
      <button>Eraser</button>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button onClick={onZoomOut} title="Zoom out">−</button>
        <button onClick={onReset} title="Reset zoom">Reset</button>
        <button onClick={onZoomIn} title="Zoom in">+</button>
      </div>
    </div>
  );
}
