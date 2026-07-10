import React from 'react';
import * as Icons from 'lucide-react';

export default function Desktop({ apps, onOpenApp }) {
  return (
    <div 
      className="mobile-padding desktop-container"
      style={{ 
        padding: '24px', 
        height: 'calc(100dvh - 120px)',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {apps.map((app) => {
        const IconComponent = Icons[app.icon] || Icons.Box;
        return (
          <div 
            key={app.id} 
            className="transition-transform"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              width: '80px',
              cursor: 'pointer'
            }}
            onClick={() => onOpenApp(app)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div 
              className="glass"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%), ${app.color}`
              }}
            >
              <IconComponent color="#fff" size={32} />
            </div>
            <span style={{ 
              fontSize: '12px', 
              textAlign: 'center', 
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              fontWeight: 500,
              lineHeight: 1.2,
              wordBreak: 'keep-all'
            }}>
              {app.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
