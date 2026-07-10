import React from 'react';

export default function BniBriefing() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#1e90ff' }}>BNI 주간 브리핑 관리</h2>
      
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3>이번 주 조찬 모임 브리핑 자료</h3>
          <button style={{ padding: '8px 16px', background: '#1e90ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            새 브리핑 생성
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { date: '2026년 7월 2주차', title: '엑설런트 챕터 124회 조찬 모임 브리핑', status: '발간 완료' },
            { date: '2026년 7월 1주차', title: '엑설런트 챕터 123회 조찬 모임 브리핑', status: '발간 완료' },
            { date: '2026년 6월 4주차', title: '방문객스 데이 특별 브리핑', status: '발간 완료' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#1e90ff', marginBottom: '4px' }}>{item.date}</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.title}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', padding: '4px 8px', background: 'rgba(30,144,255,0.2)', color: '#1e90ff', borderRadius: '12px' }}>{item.status}</span>
                <button style={{ padding: '6px 12px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', cursor: 'pointer' }}>
                  미리보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
