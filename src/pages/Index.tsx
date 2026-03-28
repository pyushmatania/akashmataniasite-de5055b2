import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const moodboardSrc = useMemo(() => `/moodboard.html?v=${Date.now()}`, []);

  return (
    <motion.div
      className="w-full h-screen relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-[#FAF8F5] z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.p
              style={{ fontFamily: "system-ui", color: "#8A8A8A", fontSize: 14 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              Loading moodboard…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      <iframe
        src={moodboardSrc}
        title="Akash's Moodboard"
        className="w-full h-screen border-0"
        style={{ overflow: "hidden", opacity: loaded ? 1 : 0, transition: "opacity 0.4s" }}
        onLoad={() => setLoaded(true)}
        allow="autoplay"
      />
    </motion.div>
  );
};

export default Index;
