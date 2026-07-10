import React from 'react';

export default function BniMagazine() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#ffa502' }}>BNI 매거진 퍼블리셔</h2>
      
      <div className="responsive-flex-row" style={{ gap: '24px', flex: 1 }}>
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,165,2,0.5)', cursor: 'pointer' }}>
          <div style={{ fontSize: '48px', color: '#ffa502', marginBottom: '16px' }}>+</div>
          <h3 style={{ marginBottom: '8px' }}>새 매거진 호 발행하기</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', textAlign: 'center' }}>
            이번 달의 우수 멤버 인터뷰와 <br/> 챕터 소식을 담은 매거진을 기획하세요.
          </p>
        </div>

        <div style={{ flex: 2, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '16px' }}>발행된 매거진 라이브러리</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { vol: 'Vol. 12', month: '2026년 6월호', cover: '엑설런트 챕터 여름 워크샵' },
              { vol: 'Vol. 11', month: '2026년 5월호', cover: '이달의 VCP 히어로' },
              { vol: 'Vol. 10', month: '2026년 4월호', cover: '봄맞이 비즈니스 네트워킹' },
              { vol: 'Vol. 9', month: '2026년 3월호', cover: '신입 멤버 환영호' }
            ].map((mag, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#ffa502', fontWeight: 'bold' }}>{mag.vol}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{mag.month}</span>
                </div>
                <div style={{ fontSize: '14px' }}>{mag.cover}</div>
                <button style={{ marginTop: '8px', padding: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>
                  PDF 다운로드
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
