import React from 'react';
import * as Icons from 'lucide-react';

export default function Dock({ apps, onOpenApp, activeWindow }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '12px',
      padding: '12px 20px',
      borderRadius: '24px',
      zIndex: 100
    }} className="glass-dock dock-container">
      {apps.map((app) => {
        const IconComponent = Icons[app.icon] || Icons.Box;
        const isActive = activeWindow?.id === app.id;
        return (
          <div 
            key={app.id}
            className="transition-all"
            style={{ 
              position: 'relative',
              width: '48px', 
              height: '48px', 
              minWidth: '48px',
              flexShrink: 0,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%), ${app.color}`,
              boxShadow: isActive ? '0 -4px 16px rgba(255,255,255,0.4)' : 'none',
              transform: isActive ? 'translateY(-4px)' : 'none'
            }}
            onClick={() => onOpenApp(app)}
            onMouseEnter={(e) => {
              if(!isActive) e.currentTarget.style.transform = 'translateY(-8px) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              if(!isActive) e.currentTarget.style.transform = 'none';
            }}
          >
            <IconComponent color="#fff" size={24} />
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#fff'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
