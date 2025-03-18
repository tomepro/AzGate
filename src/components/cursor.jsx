import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <img
      src="/gauntlet.webp" 
      alt="Custom Cursor"
      className="custom-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: "fixed",
        width: "32px", 
        height: "32px",
        pointerEvents: "none",
        transform: "translate(0,0)",
      }}
    />
  );
}
