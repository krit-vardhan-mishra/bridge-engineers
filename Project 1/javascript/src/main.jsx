import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import ReactDOM from 'react-dom/client';
import SignupPage from './frontend/pages/SignupPage';
import LoginPage from './frontend/pages/LoginPage';
import LandingPage from './frontend/pages/LandingPage';
import { HomePage } from './frontend/pages/HomePage';
import MyPosts from './frontend/pages/MyPosts';
import NotFound from './frontend/pages/NotFound';
import DeletedBlogs from './frontend/pages/DeletedBlogs';
import AccountSetting from './frontend/pages/AccountSetting';
import CreatePost from './frontend/components/CreatePost';
import EditPost from './frontend/components/EditPost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/your-posts" element={<MyPosts />} />
        <Route path="/deleted" element={<DeletedBlogs />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-post" element={<EditPost />} />
        <Route path="/account-setting" element={<AccountSetting />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);