import React from 'react';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

export default function CalendarApp() {
  const events = [
    { id: 1, title: '제 124회 조찬 모임', date: '2026.07.14', time: '06:30 AM', location: '더블트리 바이 힐튼 판교', type: 'official' },
    { id: 2, title: '임원진 회의', date: '2026.07.16', time: '19:00 PM', location: '온라인 (Zoom)', type: 'official' },
    { id: 3, title: '제조/유통 파워팀 골프 네트워킹', date: '2026.07.20', time: '14:00 PM', location: '남부CC', type: 'networking' }
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', color: '#ff6b81' }}>챕터 캘린더 📅</h2>
        <button style={{ padding: '8px 16px', background: '#ff6b81', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          새 일정 등록
        </button>
      </div>
      
      <div className="responsive-flex-row" style={{ flex: 1 }}>
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>월간 달력 (7월)</h3>
          <div style={{ width: '100%', height: 'calc(100% - 40px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(5, 1fr)' }}>
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} style={{ borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                {i - 2 > 0 && i - 2 <= 31 ? i - 2 : ''}
                {i - 2 === 14 && <div style={{ background: '#ff6b81', width: '6px', height: '6px', borderRadius: '50%', marginTop: '4px' }}></div>}
                {i - 2 === 16 && <div style={{ background: '#ff6b81', width: '6px', height: '6px', borderRadius: '50%', marginTop: '4px' }}></div>}
                {i - 2 === 20 && <div style={{ background: '#3742fa', width: '6px', height: '6px', borderRadius: '50%', marginTop: '4px' }}></div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '16px' }}>다가오는 일정</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map(event => (
              <div key={event.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{event.title}</span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', background: event.type === 'official' ? 'rgba(255,107,129,0.2)' : 'rgba(55,66,250,0.2)', color: event.type === 'official' ? '#ff6b81' : '#3742fa', borderRadius: '4px' }}>
                    {event.type === 'official' ? '공식 일정' : '네트워킹'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarIcon size={12} /> {event.date}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} /> {event.time}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} /> {event.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
