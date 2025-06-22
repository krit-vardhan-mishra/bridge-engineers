import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { HomeIcon, UserIcon, SettingsIcon } from 'lucide-react';
import NotifyBanner from '../components/NotifyBanner';

export const HomePage = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    document.title = "Home - Blog Web App";
    setShowBanner(true);
  }, []);

  return (
    <div className="bg-[#1C222A] min-h-screen">
      <Header title="Home" icons={[HomeIcon, UserIcon, SettingsIcon]} />
      
      {showBanner && (
        <NotifyBanner
          message="Welcome back to the Blog Web App!"
          onClose={() => setShowBanner(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
