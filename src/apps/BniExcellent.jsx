import React from 'react';

export default function BniExcellent() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>BNI 엑설런트 챕터 대시보드</h2>
      
      <div className="responsive-grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: '전체 멤버', value: '45명', color: '#2ed573' },
          { label: '이번 주 리퍼럴', value: '128건', color: '#1e90ff' },
          { label: '누적 감사장 (TYFCB)', value: '₩125,000,000', color: '#ffa502' },
          { label: '방문객 수', value: '5명', color: '#ff4757' }
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>주간 활동 현황</h3>
        <div style={{ width: '100%', height: 'calc(100% - 40px)', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
          차트 영역 (준비 중)
        </div>
      </div>
    </div>
  );
}
