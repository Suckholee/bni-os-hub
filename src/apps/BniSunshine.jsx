import React from 'react';

export default function BniSunshine() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#ffb8b8' }}>BNI 선샤인 ☀️</h2>
      
      <div className="responsive-flex-row" style={{ flex: 1 }}>
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>이달의 멤버 생일 & 기념일</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🎉 홍길동 대표님 (디자인)</span>
              <span style={{ color: '#eccc68' }}>7월 12일</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>💼 김철수 대표님 (노무) - 가입 1주년</span>
              <span style={{ color: '#eccc68' }}>7월 15일</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🎉 이영희 대표님 (세무)</span>
              <span style={{ color: '#eccc68' }}>7월 28일</span>
            </li>
          </ul>
        </div>

        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>선샤인 메시지 발송</h3>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
            기념일을 맞이한 멤버들에게 따뜻한 축하 메시지를 일괄 발송합니다.
          </p>
          <textarea 
            defaultValue="대표님! 특별한 날을 진심으로 축하드립니다. 오늘 하루도 엑설런트 챕터와 함께 눈부신 선샤인 데이 되세요! ☀️"
            style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', marginBottom: '16px', resize: 'none' }} 
          />
          <button style={{ width: '100%', padding: '12px', background: '#eccc68', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            축하 메시지 발송하기
          </button>
        </div>
      </div>
    </div>
  );
}
