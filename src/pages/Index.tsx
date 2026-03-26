import { useState } from "react";

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full h-screen relative">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F5]">
          <p style={{ fontFamily: "system-ui", color: "#8A8A8A", fontSize: 14 }}>
            Loading moodboard…
          </p>
        </div>
      )}
      <iframe
        src="/moodboard.html"
        title="Akash's Moodboard"
        className="w-full h-screen border-0"
        style={{ overflow: "hidden", display: loaded ? "block" : "hidden" }}
        onLoad={() => setLoaded(true)}
        allow="autoplay"
      />
    </div>
  );
};

export default Index;
