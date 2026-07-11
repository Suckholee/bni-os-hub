import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minus } from 'lucide-react';
import BlogApp from '../apps/BlogApp';
import BniExcellent from '../apps/BniExcellent';
import BniSunshine from '../apps/BniSunshine';
import BniBriefing from '../apps/BniBriefing';
import BniMagazine from '../apps/BniMagazine';
import SettingsApp from '../apps/SettingsApp';
import AdminPortal from '../apps/AdminPortal';
import GenericApp from '../apps/GenericApp';
import CalendarApp from '../apps/CalendarApp';
import OneToOneDrive from '../apps/OneToOneDrive';
import MemberDirectory from '../apps/MemberDirectory';
import ChapterFeed from '../apps/ChapterFeed';
import VcpTracker from '../apps/VcpTracker';
import BusinessMap from '../apps/BusinessMap';

export default function WindowModal({ app, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      style={{
        position: 'absolute',
        top: isFullscreen ? '32px' : '10%',
        left: isFullscreen ? 0 : '15%',
        width: isFullscreen ? '100%' : '70%',
        height: isFullscreen ? 'calc(100% - 32px)' : '75%',
        borderRadius: isFullscreen ? 0 : '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 50,
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        animation: 'popIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
      className="glass-window"
    >
      <style>
        {`
          @keyframes popIn {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
      
      {/* Window Header */}
      <div 
        style={{
          height: '40px',
          background: 'var(--window-header)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <div 
            onClick={onClose}
            style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56', cursor: 'pointer' }} 
            title="닫기"
          />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
          <div 
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f', cursor: 'pointer' }} 
            title="전체화면"
          />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '14px', fontWeight: 500, opacity: 0.8 }}>
          {app.name}
        </div>
        <div style={{ width: '44px' }}></div> {/* Spacer for center alignment */}
      </div>

      {/* Window Content */}
      <div className={(isFullscreen && app.id === 'business-map') ? '' : 'mobile-padding'} style={{ flex: 1, padding: (isFullscreen && app.id === 'business-map') ? 0 : '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {app.id === 'blog' && <BlogApp />}
        {app.id === 'bni-excellent' && <BniExcellent />}
        {app.id === 'bni-sunshine' && <BniSunshine />}
        {app.id === 'bni-briefing' && <BniBriefing />}
        {app.id === 'bni-magazine' && <BniMagazine />}
        {app.id === 'settings' && <SettingsApp />}
        {app.id === 'calendar' && <CalendarApp />}
        {app.id === 'one-to-one' && <OneToOneDrive />}
        {app.id === 'directory' && <MemberDirectory />}
        {app.id === 'feed' && <ChapterFeed />}
        {app.id === 'vcp' && <VcpTracker />}
        {app.id === 'business-map' && <BusinessMap />}
        {app.id === 'admin-portal' && <AdminPortal />}
        {!['blog', 'bni-excellent', 'bni-sunshine', 'bni-briefing', 'bni-magazine', 'settings', 'calendar', 'one-to-one', 'directory', 'feed', 'vcp', 'business-map', 'admin-portal'].includes(app.id) && <GenericApp app={app} />}
      </div>
    </div>
  );
}
