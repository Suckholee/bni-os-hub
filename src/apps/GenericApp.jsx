import React from 'react';

export default function GenericApp({ app }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>{app.name}</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', textAlign: 'center', maxWidth: '600px' }}>
        {app.name} 앱의 상세 화면입니다. 실제 데이터 연동 및 세부 UI 구성은 추가 모듈로 연동될 예정입니다.
      </p>
    </div>
  );
}
