import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import MyPosts from '../pages/MyPosts';
import AccountSetting from '../pages/AccountSetting';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />

    {/* Protected */}
    <Route element={<PrivateRoute />}>
      <Route path="/home" element={<HomePage />} />
      <Route path="/your-posts" element={<MyPosts />} />
      <Route path="/account-setting" element={<AccountSetting />} />
      {/* add more protected here */}
    </Route>

    {/* Fallback */}
    <Route path="*" element={<LoginPage />} />
  </Routes>
);

export default AppRoutes;
