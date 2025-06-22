import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import ReactDOM from 'react-dom/client';
import SignupPage from './frontend/pages/SignupPage';
import LoginPage from './frontend/pages/LoginPage';
import LandingPage from './frontend/pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);