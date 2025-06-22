import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import ReactDOM from 'react-dom/client';
import SignupPage from './frontend/pages/SignupPage';
import LoginPage from './frontend/pages/LoginPage';
import LandingPage from './frontend/pages/LandingPage';
import { HomePage } from './frontend/pages/HomePage';
import MyPosts from './frontend/pages/MyPosts';
import NotFound from './frontend/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/your-posts" element={<MyPosts />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);