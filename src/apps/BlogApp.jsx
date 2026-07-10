import React from 'react';

export default function BlogApp() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>블로그 포스팅 자동화</h2>
      <div className="responsive-flex-row" style={{ flex: 1 }}>
        <div style={{ flex: 2, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>새 포스팅 작성</h3>
          <input 
            type="text" 
            placeholder="포스팅 주제를 입력하세요..." 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', marginBottom: '16px' }} 
          />
          <textarea 
            placeholder="AI가 생성할 프롬프트 세부사항..." 
            style={{ width: '100%', height: '150px', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', marginBottom: '16px', resize: 'none' }} 
          />
          <button style={{ padding: '12px 24px', background: '#ff4757', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            AI 자동 생성 시작
          </button>
        </div>
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>최근 포스팅 내역</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>[AI] BNI 네트워킹의 중요성</li>
            <li style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>[AI] 효과적인 주간 발표 요령</li>
            <li style={{ padding: '12px' }}>[AI] 멤버십 갱신 안내</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
