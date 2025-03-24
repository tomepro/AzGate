import { Bars } from "react-loader-spinner";

const LoaderSpinner = ({ visible }) => {
  if (!visible) return null; // Don't render if not visible

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100vw", 
      height: "100vh", 
      background: "rgba(0, 0, 0, 0.38)", // Semi-transparent background
      zIndex: 900 // Ensures it's on top
    }}>
      <Bars height="80" width="80" color="white" ariaLabel="bars-loading" />
    </div>
  );
};

export default LoaderSpinner;
