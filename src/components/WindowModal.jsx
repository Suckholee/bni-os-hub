import React from 'react';
import { X, Maximize2, Minus } from 'lucide-react';
import BlogApp from '../apps/BlogApp';
import BniExcellent from '../apps/BniExcellent';
import BniSunshine from '../apps/BniSunshine';
import BniBriefing from '../apps/BniBriefing';
import BniMagazine from '../apps/BniMagazine';
import SettingsApp from '../apps/SettingsApp';
import GenericApp from '../apps/GenericApp';
import CalendarApp from '../apps/CalendarApp';
import OneToOneDrive from '../apps/OneToOneDrive';
import MemberDirectory from '../apps/MemberDirectory';
import ChapterFeed from '../apps/ChapterFeed';
import VcpTracker from '../apps/VcpTracker';
import BusinessMap from '../apps/BusinessMap';

export default function WindowModal({ app, onClose }) {
  return (
    <div 
      style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '70%',
        height: '75%',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 50,
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
          />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '14px', fontWeight: 500, opacity: 0.8 }}>
          {app.name}
        </div>
        <div style={{ width: '44px' }}></div> {/* Spacer for center alignment */}
      </div>

      {/* Window Content */}
      <div className="mobile-padding" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
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
        {!['blog', 'bni-excellent', 'bni-sunshine', 'bni-briefing', 'bni-magazine', 'settings', 'calendar', 'one-to-one', 'directory', 'feed', 'vcp', 'business-map'].includes(app.id) && <GenericApp app={app} />}
      </div>
    </div>
  );
}
