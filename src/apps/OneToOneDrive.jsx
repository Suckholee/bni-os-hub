import React from 'react';
import { Folder, FileText, Search, Download } from 'lucide-react';

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
      
      <div className="responsive-flex-row" style={{ flex: 1 }}>
        {/* Folders */}
        <div style={{ width: '250px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px' }}>
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
