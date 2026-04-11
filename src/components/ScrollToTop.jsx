//src/components/ScrollToTop.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export default function ScrollToTop() {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const longPressTimer = useRef(null);

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    const handleScroll = () => {
      const scrollHeight = rootElement.scrollHeight;
      const clientHeight = rootElement.clientHeight;
      const halfPage = (scrollHeight - clientHeight) / 2;
      
      setShowScrollTop(rootElement.scrollTop > halfPage);
    };

    rootElement.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => rootElement.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    const anchor = document.getElementById('top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      toast.info("Identification CEO...", { autoClose: 1500 });
      navigate('/darkyelydb42');
    }, 10000); 
  };

  const stopLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={handleScrollToTop}
          onMouseDown={startLongPress}
          onMouseUp={stopLongPress}
          onMouseLeave={stopLongPress}
          onTouchStart={startLongPress}
          onTouchEnd={stopLongPress}
          onTouchCancel={stopLongPress}
          onContextMenu={(e) => e.preventDefault()}
          style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
          className="fixed bottom-10 right-10 p-5 bg-yely-gold text-black rounded-full shadow-[0_5px_20px_rgba(212,175,55,0.4)] z-50 group active:scale-90 transition-transform cursor-pointer"
        >
          <ArrowUp className="w-7 h-7 font-black group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}