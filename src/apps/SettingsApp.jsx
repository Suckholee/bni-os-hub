import React from 'react';

export default function SettingsApp() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>설정 (Settings)</h2>
      
      <div className="responsive-flex-row" style={{ flex: 1 }}>
        <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['계정 관리', '알림 설정', '개인정보 보호', '디스플레이', '시스템 정보'].map((menu, i) => (
            <div key={i} style={{ padding: '12px 16px', background: i === 3 ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: i === 3 ? 'bold' : 'normal' }}>
              {menu}
            </div>
          ))}
        </div>
        
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '32px' }}>
          <h3 style={{ marginBottom: '24px' }}>디스플레이 설정</h3>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>바탕화면 테마</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '100px', height: '60px', background: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', borderRadius: '8px', border: '2px solid #3b82f6', cursor: 'pointer' }}></div>
              <div style={{ width: '100px', height: '60px', background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}></div>
              <div style={{ width: '100px', height: '60px', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}></div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>글래스모피즘(투명도) 강도</label>
            <input type="range" min="1" max="100" defaultValue="70" style={{ width: '100%', cursor: 'pointer' }} />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
              <span>애니메이션 효과 켜기</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
