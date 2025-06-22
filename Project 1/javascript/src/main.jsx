import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import ReactDOM from 'react-dom/client';
import SignupPage from './frontend/pages/SignupPage';
import LoginPage from './frontend/pages/LoginPage';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { Button } from './frontend/components/ui/button';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from "framer-motion";
import { NotebookPen } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

function Landing() {
  const [showWelcomeCursor, setShowWelcomeCursor] = useState(true);
  const [startActionTyping, setStartActionTyping] = useState(false);
  const [showActionCursor, setShowActionCursor] = useState(true);

  const [welcomeText] = useTypewriter({
    words: ['Welcome to Blog App.'],
    loop: 1,
    typeSpeed: 50,
    delaySpeed: 0,
    onLoopDone: () => {
      setShowWelcomeCursor(false);
      setTimeout(() => {
        setStartActionTyping(true);
      }, 0);
    }
  });

  const [actionText] = useTypewriter({
    words: ['Login or Sign Up to continue.'],
    loop: 1,
    typeSpeed: 70,
    delaySpeed: 0,
    skipAdd: !startActionTyping,
    onLoopDone: () => {
      setShowActionCursor(false);
    }
  });

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-[#1C222A] gap-4'>
      <NotebookPen size={48} color='white' className='mb-4' />
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>
          {welcomeText}
          {showWelcomeCursor && <Cursor cursorStyle='|' />}
        </h1>
        {startActionTyping && (
          <p className='text-xl text-gray-100 mt-0'>
            {actionText}
            {showActionCursor && actionText.length > 0 && <Cursor cursorStyle='|' />}
          </p>
        )}
      </div>
      {actionText.length > 28 && (
        <div className='flex gap-4'>
          {<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" asChild>
              <a href='/login'>Login</a>
            </Button>
          </motion.div>}
          {<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-green-500 hover:bg-green-600 text-white" asChild>
              <a href='/signup'>Sign Up</a>
            </Button>
          </motion.div>}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);