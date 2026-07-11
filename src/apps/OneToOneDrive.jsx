import React, { useState, useEffect } from 'react';
import { Folder, FileText, Search, Download, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { subscribeToOneToOneRequests, updateOneToOneStatus } from '../services/memberService';
import { useAuth } from '../contexts/AuthContext';

export default function OneToOneDrive() {
  const folders = [
    { name: '01. 법률/재무 파워팀', items: 12 },
    { name: '02. 건축/인테리어 파워팀', items: 8 },
    { name: '03. 마케팅/IT 파워팀', items: 15 },
    { name: '04. 라이프스타일 파워팀', items: 10 }
  ];

  const recentFiles = [
    { name: '홍길동_세무사_원투원양식지.pdf', date: '2026.07.09', size: '1.2MB' },
    { name: '노무사_김철수_GAINS_Profile.pdf', date: '2026.07.08', size: '0.8MB' },
    { name: '인테리어_이영희_포트폴리오.pdf', date: '2026.07.07', size: '4.5MB' }
  ];

  const { currentUser } = useAuth();
  const myName = currentUser?.email?.split('@')[0] || 'Unknown';
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsub = subscribeToOneToOneRequests(myName, (data) => {
      setRequests(data);
    });
    return () => unsub();
  }, [myName]);

  const handleAccept = async (req) => {
    if (window.confirm(`${req.senderName} 대표님의 원투원 요청을 수락하시겠습니까?`)) {
      await updateOneToOneStatus(req.id, 'accepted', req);
      alert("수락되었습니다! 비즈니스 맵에 일정이 추가됩니다.");
    }
  };

  const handleDecline = async (req) => {
    if (window.confirm("요청을 거절하시겠습니까?")) {
      await updateOneToOneStatus(req.id, 'declined');
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', color: '#7bed9f' }}>원투원 양식지 드라이브 📂</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
            <Search size={16} color="rgba(255,255,255,0.5)" />
            <input type="text" placeholder="멤버명 검색..." style={{ background: 'transparent', border: 'none', color: '#fff', padding: '8px', outline: 'none' }} />
          </div>
          <button style={{ padding: '8px 16px', background: '#7bed9f', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            새 양식지 업로드
          </button>
        </div>
      </div>
      
      <div className="responsive-flex-row" style={{ flex: 1, overflow: 'hidden' }}>
        {/* 1to1 Requests Panel */}
        <div style={{ width: '320px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>나의 원투원 요청 현황 🤝</h3>
          
          {requests.length === 0 && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>새로운 요청이 없습니다.</div>}
          
          {requests.map(req => {
            const isReceived = req.receiverName === myName;
            const statusColor = req.status === 'pending' ? '#f1c40f' : req.status === 'accepted' ? '#2ecc71' : '#e74c3c';
            const statusText = req.status === 'pending' ? '대기 중' : req.status === 'accepted' ? '수락됨' : '거절됨';
            
            return (
              <div key={req.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', border: `1px solid ${statusColor}55`, flexShrink: 0 }}>
                <div style={{ fontSize: '12px', color: statusColor, fontWeight: 'bold', marginBottom: '8px' }}>
                  {isReceived ? '📥 받은 요청' : '📤 보낸 요청'} • {statusText}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
                  {isReceived ? `${req.senderName} 대표님` : `${req.receiverName} 대표님께`}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Calendar size={12} /> {req.proposedDate} {req.proposedTime}
                </div>
                {req.message && (
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px', marginTop: '8px' }}>
                    "{req.message}"
                  </div>
                )}
                
                {isReceived && req.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button onClick={() => handleAccept(req)} style={{ flex: 1, padding: '8px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: 'bold' }}>
                      <CheckCircle size={14} /> 수락
                    </button>
                    <button onClick={() => handleDecline(req)} style={{ flex: 1, padding: '8px', background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <XCircle size={14} /> 거절
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Folders */}
        <div style={{ width: '250px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>파워팀 폴더</h3>
          {folders.map((folder, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }}>
              <Folder size={18} color="#7bed9f" />
              <div style={{ flex: 1, fontSize: '14px' }}>{folder.name}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{folder.items}</div>
            </div>
          ))}
        </div>

        {/* Files */}
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>최근 업데이트된 양식지</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {recentFiles.map((file, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <FileText size={48} color="#ff6b81" style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '14px', marginBottom: '4px', wordBreak: 'break-all' }}>{file.name || 'GAINS_Profile.pdf'}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>{file.date} • {file.size}</div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>
                  <Download size={12} /> 다운로드
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
