import Toolbar from "../../components/toolbar";
import Canvas from "../../components/canvas";
import { useRef } from "react";

export default function Board() {
  const canvasRef = useRef(null);

  return (
    <>
      <Toolbar
        onZoomIn={() => canvasRef.current?.zoomIn()}
        onZoomOut={() => canvasRef.current?.zoomOut()}
        onReset={() => canvasRef.current?.reset()}
      />
      <Canvas ref={canvasRef} />
    </>
  );
}
