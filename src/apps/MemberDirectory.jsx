import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail, Building2, Camera, Loader2, Save } from 'lucide-react';
import { subscribeToMembers } from '../services/memberService';

export default function MemberDirectory() {
  const [activeTab, setActiveTab] = useState('list');
  const [isScanning, setIsScanning] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '', category: '', company: '', phone: '', email: '', address: ''
  });

  const [members, setMembers] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToMembers((data) => {
      setMembers(data);
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1];
        
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { inlineData: { data: base64Data, mimeType: file.type } },
                  { text: 'Analyze this business card. Extract the following information and return ONLY a valid JSON object with these exact keys: "name" (person name), "category" (job title or profession), "company" (company name), "phone" (phone number), "email" (email address), "address" (physical address). If a field is missing, use an empty string.' }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
            }
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const extractedText = data.candidates[0].content.parts[0].text;
        const parsedData = JSON.parse(extractedText);
        
        setProfileData(prev => ({
          ...prev,
          ...parsedData
        }));
        setIsScanning(false);
      };
    } catch (error) {
      console.error("OCR Error:", error);
      alert('명함 인식 중 오류가 발생했습니다.');
      setIsScanning(false);
    }
  };

  const handleSaveProfile = () => {
    if(!profileData.name) {
      alert("이름을 입력해주세요.");
      return;
    }
    // Save to local state (mock DB save)
    setMembers([{...profileData, color: '#10ac84', tag: '신규등록'}, ...members]);
    alert('프로필이 저장되었습니다!');
    setActiveTab('list');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', color: '#3742fa', fontWeight: 'bold' }}>멤버 디렉토리 📇</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setActiveTab('list')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'list' ? '#3742fa' : 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
          >목록 보기</button>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'profile' ? '#3742fa' : 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
          >내 프로필 등록</button>
        </div>
      </div>
      
      {activeTab === 'list' ? (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['전체', '법률/재무', '건축/인테리어', '마케팅/IT', '라이프스타일', '제조/유통', '신규등록'].map((tag, i) => (
              <div key={i} style={{ padding: '6px 16px', background: i === 0 ? '#3742fa' : 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {tag}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {members.map((member, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `linear-gradient(135deg, ${member.color}88, ${member.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                      {member.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{member.name} 대표</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', padding: '2px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'inline-block' }}>{member.category}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building2 size={14} color="rgba(255,255,255,0.5)" /> {member.company}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} color="rgba(255,255,255,0.5)" /> {member.phone}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} color="rgba(255,255,255,0.5)" /> {member.email}</div>
                  </div>
                  <button style={{ marginTop: '16px', width: '100%', padding: '8px', background: 'transparent', border: `1px solid ${member.color}`, color: member.color, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    원투원 요청하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#3742fa', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={40} color="#fff" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>AI 명함 자동 인식 📸</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '24px' }}>
                스마트폰 카메라로 명함을 찍거나 갤러리에서 업로드하면<br/>Google Gemini AI가 정보를 자동으로 입력해줍니다!
              </p>
              
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleImageUpload}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                <button 
                  disabled={isScanning}
                  style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #10ac84, #1dd1a1)', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(29, 209, 161, 0.4)' }}
                >
                  {isScanning ? <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={20} />}
                  {isScanning ? 'AI가 명함을 분석 중입니다...' : '명함 사진 촬영 / 업로드'}
                </button>
              </div>
            </div>

            <style>
              {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
            </style>

            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>기본 정보 (AI 자동입력)</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>이름</label>
                  <input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} type="text" style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>직책/분야</label>
                  <input value={profileData.category} onChange={e => setProfileData({...profileData, category: e.target.value})} type="text" style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>상호명 (회사명)</label>
                <input value={profileData.company} onChange={e => setProfileData({...profileData, company: e.target.value})} type="text" style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>연락처 (휴대폰)</label>
                  <input value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} type="text" style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>이메일</label>
                  <input value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} type="email" style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>사업장 주소</label>
                <input value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} type="text" style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              </div>

              <button 
                onClick={handleSaveProfile}
                style={{ width: '100%', padding: '14px', background: '#3742fa', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Save size={20} />
                프로필 저장 및 공개하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
