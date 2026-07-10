import React from 'react';
import { TrendingUp, Target, Award, ArrowUpRight } from 'lucide-react';

export default function VcpTracker() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', color: '#ff4757' }}>VCP 리퍼럴 트래커 🚀</h2>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          나의 현재 등급: <span style={{ color: '#2ed573' }}>Green (상위 15%)</span>
        </div>
      </div>
      
      <div className="responsive-flex-row" style={{ flex: 1, overflow: 'hidden' }}>
        {/* Left Col - Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>나의 6개월 누적 성과</h3>
            <div className="responsive-grid-2">
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>준 리퍼럴 (건)</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  42 <ArrowUpRight size={16} color="#2ed573" />
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>받은 리퍼럴 (건)</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  38 <ArrowUpRight size={16} color="#2ed573" />
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', gridColumn: 'span 2' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>발생시킨 매출 (TYFCB)</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff4757' }}>₩ 245,000,000</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>다음 등급(Platinum)까지</h3>
            <div style={{ background: 'rgba(255,255,255,0.1)', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #ff4757, #ffa502)' }}></div>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', textAlign: 'right' }}>목표치 75% 달성 (방문객 1명 추가 초과 시 승급)</div>
          </div>

        </div>

        {/* Right Col - Gamification/Activity */}
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '16px' }}>획득한 뱃지</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {[
              { icon: <Target />, name: '100% 출석왕', color: '#2ed573' },
              { icon: <Award />, name: '슈퍼 커넥터', color: '#1e90ff' },
              { icon: <TrendingUp />, name: '매출 부스터', color: '#ffa502' }
            ].map((badge, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '80px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `linear-gradient(135deg, ${badge.color}88, ${badge.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.cloneElement(badge.icon, { size: 28, color: '#fff' })}
                </div>
                <div style={{ fontSize: '11px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>{badge.name}</div>
              </div>
            ))}
          </div>

          <h3 style={{ marginBottom: '16px', fontSize: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>최근 리퍼럴 활동</h3>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '14px' }}>
              <span style={{ color: '#2ed573' }}>[준 리퍼럴]</span> 홍길동 대표님에게 '기업 세무 기장' 건을 전달했습니다.
            </div>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '14px' }}>
              <span style={{ color: '#ff4757' }}>[TYFCB]</span> 이영희 대표님 덕분에 1,500만원 매출이 발생했습니다! 🎉
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
