import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail, Building2, Camera, Loader2, Save, X, Calendar, MapPin, MessageSquare } from 'lucide-react';
import { subscribeToMembers, createOneToOneRequest } from '../services/memberService';
import { useAuth } from '../contexts/AuthContext';

export default function MemberDirectory() {
  const [activeTab, setActiveTab] = useState('list');
  const [isScanning, setIsScanning] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '', category: '', company: '', phone: '', email: '', address: ''
  });

  const [members, setMembers] = useState([]);
  const [requestModal, setRequestModal] = useState({ isOpen: false, member: null, dateOption: 'this_week', date: '이번 주 중', time: '시간 협의', locationType: '내 사무실', message: '' });
  const { currentUser } = useAuth();
  const myName = currentUser?.email?.split('@')[0] || 'Unknown';

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

  const handleRequestSubmit = async () => {
    if (!requestModal.date || !requestModal.time) {
      alert("희망 날짜와 시간을 선택해주세요.");
      return;
    }
    try {
      await createOneToOneRequest({
        senderName: myName,
        receiverName: requestModal.member.name,
        proposedDate: requestModal.date,
        proposedTime: requestModal.time,
        locationType: requestModal.locationType,
        message: requestModal.message,
        receiverLat: requestModal.member.lat || 37.5112,
        receiverLng: requestModal.member.lng || 127.0458,
      });

      if (window.Kakao && window.Kakao.Share) {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `[BNI 타이탄] 원투원 미팅 요청 🤝`,
            description: `${myName} 대표님이 ${requestModal.member.name} 대표님께 원투원 미팅을 요청하셨습니다. 앱에 접속하여 일정을 확인해주세요!`,
            imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
          buttons: [
            {
              title: '요청 확인하기',
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
            },
          ],
        });
      }

      alert("원투원 요청이 전송되었습니다!");
      setRequestModal({ ...requestModal, isOpen: false });
    } catch (e) {
      alert("요청 전송 중 오류가 발생했습니다.");
    }
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
                  <button 
                    onClick={() => setRequestModal({ isOpen: true, member, dateOption: 'this_week', date: '이번 주 중', time: '시간 협의', locationType: '내 사무실', message: '' })}
                    style={{ marginTop: '16px', width: '100%', padding: '8px', background: 'transparent', border: `1px solid ${member.color || '#3742fa'}`, color: member.color || '#3742fa', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
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

      {/* 1-to-1 Request Modal */}
      {requestModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#1e1e2d', width: '400px', borderRadius: '12px', padding: '24px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={() => setRequestModal({ ...requestModal, isOpen: false })} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>원투원 미팅 요청 🤝</h3>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>받는 사람</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{requestModal.member?.name} 대표</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{requestModal.member?.company}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                <Calendar size={16} /> 희망 날짜 및 시간
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {[
                  { id: 'asap', label: '최대한 빨리' },
                  { id: 'this_week', label: '이번 주 중' },
                  { id: 'next_week', label: '다음 주 중' },
                  { id: 'custom', label: '직접 입력' }
                ].map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => {
                      if (opt.id !== 'custom') {
                        setRequestModal({...requestModal, dateOption: opt.id, date: opt.label, time: '시간 협의'});
                      } else {
                        setRequestModal({...requestModal, dateOption: opt.id, date: '', time: ''});
                      }
                    }}
                    style={{ padding: '6px 12px', borderRadius: '16px', fontSize: '13px', cursor: 'pointer', background: requestModal.dateOption === opt.id ? '#3742fa' : 'rgba(255,255,255,0.1)', color: '#fff', border: `1px solid ${requestModal.dateOption === opt.id ? '#3742fa' : 'rgba(255,255,255,0.2)'}` }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
              {requestModal.dateOption === 'custom' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="date" value={requestModal.date} onChange={e => setRequestModal({...requestModal, date: e.target.value})} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                  <input type="time" value={requestModal.time} onChange={e => setRequestModal({...requestModal, time: e.target.value})} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                <MapPin size={16} /> 미팅 장소
              </label>
              <select value={requestModal.locationType} onChange={e => setRequestModal({...requestModal, locationType: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', appearance: 'none', outline: 'none' }}>
                <option value="내 사무실">내 사무실</option>
                <option value="상대 사무실">상대 사무실 (방문)</option>
                <option value="온라인 (Zoom 등)">온라인 (Zoom 등)</option>
                <option value="외부 카페/미팅룸">외부 카페/미팅룸</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                <MessageSquare size={16} /> 메시지 (목적)
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {['가벼운 티타임 ☕️', '비즈니스 협업 논의 🤝', '서로의 비즈니스 알아가기 💡', '식사 함께 해요 🍽️'].map((msg, i) => (
                  <div 
                    key={i}
                    onClick={() => setRequestModal({...requestModal, message: msg})}
                    style={{ padding: '6px 12px', borderRadius: '16px', fontSize: '13px', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    {msg}
                  </div>
                ))}
              </div>
              <textarea 
                value={requestModal.message} 
                onChange={e => setRequestModal({...requestModal, message: e.target.value})} 
                placeholder="간단한 인사말이나 논의할 안건을 적어주세요. (위 버튼을 누르시면 자동 입력됩니다)"
                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', height: '80px', resize: 'none', outline: 'none' }}
              />
            </div>

            <button 
              onClick={handleRequestSubmit}
              style={{ width: '100%', padding: '14px', background: '#3742fa', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              카카오톡으로 요청 보내기 💬
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
