import React, { useState } from 'react';
import Desktop from './components/Desktop';
import Dock from './components/Dock';
import WindowModal from './components/WindowModal';
import LoginScreen from './components/LoginScreen';
import OnboardingScreen from './components/OnboardingScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

const apps = [
  { id: 'bni-excellent', name: 'BNI 엑설런트 대시보드', icon: 'Award', color: '#2ed573' },
  { id: 'calendar', name: '챕터 캘린더', icon: 'Calendar', color: '#ff6b81' },
  { id: 'one-to-one', name: '원투원 드라이브', icon: 'FolderSync', color: '#7bed9f' },
  { id: 'directory', name: '멤버 디렉토리', icon: 'Users', color: '#3742fa' },
  { id: 'feed', name: '챕터 피드', icon: 'MessageSquare', color: '#ffa502' },
  { id: 'vcp', name: 'VCP 트래커', icon: 'TrendingUp', color: '#ff4757' },
  { id: 'blog', name: '블로그 포스팅', icon: 'PenTool', color: '#ff7f50' },
  { id: 'bni-briefing', name: 'BNI 브리핑', icon: 'Briefcase', color: '#1e90ff' },
  { id: 'bni-magazine', name: 'BNI 매거진', icon: 'BookOpen', color: '#eccc68' },
  { id: 'bni-sunshine', name: 'BNI 선샤인', icon: 'Sun', color: '#f1c40f' },
  { id: 'business-map', name: '비즈니스 맵', icon: 'MapPin', color: '#10ac84' },
  { id: 'settings', name: '설정', icon: 'Settings', color: '#747d8c' }
];

function AppContent() {
  const [activeWindow, setActiveWindow] = useState(null);
  const { currentUser, needsOnboarding, logout } = useAuth();

  const handleOpenApp = (app) => {
    setActiveWindow(app);
    window.history.pushState({ modalOpen: true, appId: app.id }, '');
  };

  const handleCloseWindow = () => {
    setActiveWindow(null);
    // If the modal was closed via button, we don't necessarily need to pop history, 
    // but to be clean, if the current state is our modal state, we could go back.
    // For simplicity, we just clear the state.
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  };

  React.useEffect(() => {
    const handlePopState = (event) => {
      // User pressed the back button
      if (activeWindow) {
        // We had a window open, but the back button was pressed.
        // We should close the window.
        setActiveWindow(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeWindow]);

  if (!currentUser) {
    return <LoginScreen />;
  }

  if (needsOnboarding) {
    return <OnboardingScreen />;
  }

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100dvh', 
        backgroundImage: 'url(/wallpaper.jpg)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Menu Bar */}
      <div 
        className="glass top-menu-bar" 
        style={{ 
          height: '32px', 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 16px',
          fontSize: '14px',
          fontWeight: 500,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          zIndex: 1000,
          position: 'relative',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <div style={{ marginRight: '24px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>BNI 엑설런트 챕터</div>
        <div 
          style={{ marginRight: '16px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          onClick={() => handleOpenApp(apps.find(a => a.id === 'directory'))}
        >내 프로필</div>
        <div 
          style={{ marginRight: '16px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          onClick={() => handleOpenApp(apps.find(a => a.id === 'settings'))}
        >시스템 설정</div>
        <div 
          style={{ marginRight: '16px', cursor: 'pointer', color: '#ff4757', whiteSpace: 'nowrap' }}
          onClick={logout}
        >로그아웃</div>
        <div style={{ flex: 1 }}></div>
        <div style={{ whiteSpace: 'nowrap' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>

      {/* Main Desktop Area */}
      {!activeWindow && <Desktop apps={apps} onOpenApp={handleOpenApp} />}

      {/* Dock (Taskbar) */}
      <Dock apps={apps} onOpenApp={handleOpenApp} activeWindow={activeWindow} />

      {/* Active Window Modal */}
      {activeWindow && (
        <WindowModal app={activeWindow} onClose={handleCloseWindow} />
      )}
    </div>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
