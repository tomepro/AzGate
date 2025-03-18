import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false); // Track if cursor should be a pointer

  useEffect(() => {
    const updateMousePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if the hovered element should have a pointer cursor
      const tag = e.target.tagName.toLowerCase();
      const hasPointer = ["button", "a", "input", "select", "textarea"].includes(tag) || 
                         window.getComputedStyle(e.target).cursor === "pointer";

      setIsPointer(hasPointer); // Update cursor state
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <img
      src={isPointer ? "/cast.webp" : "/gauntlet.webp"} // Swap cursor images
      alt="Custom Cursor"
      className="custom-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: "fixed",
        width: "32px", // Adjust as needed
        height: "32px",
        pointerEvents: "none",
        transform: "translate(0,0)", // Centers the cursor
        zIndex: 9999, // Keeps it above everything
      }}
    />
  );
}

