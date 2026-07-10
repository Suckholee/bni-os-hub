import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// 1. Initialize secondary Firebase app for creating users without logging out current admin
const firebaseConfig = {
  apiKey: "AIzaSyDPiWCYU7j3mSdR5GtMRrjEg-lQX_s-sxk",
  authDomain: "bniexcellent-18e66.firebaseapp.com",
  projectId: "bniexcellent-18e66",
  storageBucket: "bniexcellent-18e66.firebasestorage.app",
  messagingSenderId: "943260586723",
  appId: "1:943260586723:web:9ec535710b7cde89042bd6",
  measurementId: "G-VFEPYMZW9V"
};

let secondaryAuth;
if (!getApps().length) {
  // Fallback (shouldn't happen here)
} else {
  let secondaryApp;
  try {
    secondaryApp = getApp("AdminSecondaryApp");
  } catch (e) {
    secondaryApp = initializeApp(firebaseConfig, "AdminSecondaryApp");
  }
  secondaryAuth = getAuth(secondaryApp);
}


export default function AdminPortal() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', null
  const [message, setMessage] = useState('');
  const [parsedData, setParsedData] = useState(null);

  const handleParse = async () => {
    if (!inputText.trim()) {
      setStatus('error');
      setMessage('BNI Connect 프로필 텍스트를 입력해주세요.');
      return;
    }

    setLoading(true);
    setStatus(null);
    setParsedData(null);

    try {
      const data = parseBNIProfile(inputText);
      
      if (!data.name || data.name === 'Unknown') {
        throw new Error('이름을 파싱하지 못했습니다. 프로필 텍스트가 맞는지 확인해주세요.');
      }

      // Geocoding
      const coords = await getCoordinates(data.address);
      data.lat = coords.lat;
      data.lng = coords.lng;

      setParsedData(data);
      setMessage(`${data.name} 님의 데이터를 파싱했습니다. 'DB에 등록하기' 버튼을 눌러주세요.`);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || '데이터 파싱 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!parsedData) return;
    setLoading(true);
    setStatus(null);

    try {
      // 1. Create Auth Account using secondary auth
      let uid = parsedData.id;
      try {
        const dummyEmail = `${parsedData.id}@bni-os.local`;
        const cred = await createUserWithEmailAndPassword(secondaryAuth, dummyEmail, "000000");
        uid = cred.user.uid;
        
        // 2. Write to users collection
        await setDoc(doc(db, 'users', uid), {
          isFirstLogin: true,
          name: parsedData.name
        });
      } catch (authErr) {
        console.warn("Auth might already exist:", authErr.message);
        // We will just use the generated ID if auth fails due to already exists
      }

      // 3. Write to members collection (using main db)
      await setDoc(doc(db, 'members', uid), {
        ...parsedData,
        id: uid
      });

      setStatus('success');
      setMessage(`${parsedData.name} 대표님의 정보가 성공적으로 등록되었습니다!`);
      setInputText('');
      setParsedData(null);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('DB 등록 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: '#ffbd2e', p: 8, borderRadius: '8px', display: 'flex', padding: '8px' }}>
          <Upload size={24} color="white" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', color: 'white' }}>관리자 전용 멤버 일괄 등록</h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            BNI Connect의 프로필 페이지 내용을 복사하여 아래에 붙여넣기 하세요.
          </p>
        </div>
      </div>

      <div style={{ 
        background: 'rgba(0,0,0,0.2)', 
        borderRadius: '12px', 
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="여기에 텍스트를 붙여넣으세요...&#10;예)&#10;프로필&#10;Mr. 강범석 Kang, Beom-Seok&#10;BNI Member for: 4 월..."
          style={{
            width: '100%',
            height: '200px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: 'white',
            padding: '16px',
            fontSize: '14px',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            marginBottom: '16px'
          }}
        />

        {status && (
          <div style={{ 
            padding: '12px 16px', 
            borderRadius: '8px', 
            background: status === 'error' ? 'rgba(255, 71, 87, 0.2)' : 'rgba(46, 213, 115, 0.2)',
            border: `1px solid ${status === 'error' ? '#ff4757' : '#2ed573'}`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            {status === 'error' ? <AlertCircle size={20} color="#ff4757" /> : <CheckCircle size={20} color="#2ed573" />}
            {message}
          </div>
        )}

        {parsedData && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            fontSize: '14px',
            color: 'white'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#ffbd2e' }}>파싱 결과 미리보기</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>이름</div><div>{parsedData.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>연락처</div><div>{parsedData.phone}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>이메일</div><div>{parsedData.email}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>회사명</div><div>{parsedData.company}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>카테고리</div><div>{parsedData.category}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>주소</div><div>{parsedData.address}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>좌표</div><div>{parsedData.lat}, {parsedData.lng}</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {!parsedData ? (
            <button
              onClick={handleParse}
              disabled={loading}
              className="glass-button"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 189, 46, 0.2)', border: '1px solid rgba(255, 189, 46, 0.5)', color: '#ffbd2e' }}
            >
              {loading ? <Loader size={18} className="spin" /> : null}
              데이터 자동 분석
            </button>
          ) : (
            <>
              <button
                onClick={() => setParsedData(null)}
                className="glass-button"
                disabled={loading}
              >
                다시 입력하기
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="glass-button"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(46, 213, 115, 0.2)', border: '1px solid rgba(46, 213, 115, 0.5)', color: '#2ed573' }}
              >
                {loading ? <Loader size={18} className="spin" /> : <Upload size={18} />}
                DB에 등록하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= Utils =================

function parseBNIProfile(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  let name = 'Unknown';
  let phone = '';
  let email = '';
  let address = '';
  let company = '';
  let category = '';
  
  const profileIndex = lines.indexOf('프로필');
  if (profileIndex !== -1 && lines.length > profileIndex + 1) {
    let nameLine = lines[profileIndex + 1];
    nameLine = nameLine.replace(/Mr\.\s*|Mrs\.\s*|Ms\.\s*/ig, '');
    const koMatch = nameLine.match(/[가-힣]+/);
    if (koMatch) name = koMatch[0];
  }

  const phoneMatch = text.match(/010-\d{3,4}-\d{4}/);
  if (phoneMatch) phone = phoneMatch[0];

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) email = emailMatch[0];

  const addrMatch = text.match(/(서울|서울시|경기|경기도|인천|부산|대구|광주|대전|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주)[^\n]+/);
  if (addrMatch) address = addrMatch[0];

  const profIndex = lines.indexOf('Professional Details');
  if (profIndex !== -1 && lines.length > profIndex + 1) {
    category = lines[profIndex + 1];
    const trainingIndex = lines.indexOf('트레이닝 기록');
    if (trainingIndex !== -1) {
      let comp = lines[trainingIndex - 1];
      if ((comp && comp.match(/^[0-9-]+$/)) || (comp && comp.startsWith('http'))) {
        comp = lines[trainingIndex - 2] || comp;
      }
      company = comp;
    }
  }

  const id = name === 'Unknown' ? `member-${Date.now()}` : name.replace(/\s+/g, '-').toLowerCase() + '-' + Math.floor(Math.random() * 1000);
  const colors = ['#ff4757', '#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#3742fa', '#5f27cd', '#9c88ff'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Determine tag from category prefix
  let tag = '기타';
  if (category.includes('유통')) tag = '유통';
  else if (category.includes('음식') || category.includes('요식')) tag = '음식/음료';
  else if (category.includes('인테리어') || category.includes('건축')) tag = '건축/인테리어';
  else if (category.includes('건강') || category.includes('의료')) tag = '건강/의료';
  else if (category.includes('교육') || category.includes('코칭')) tag = '교육/코칭';
  else if (category.includes('부동산')) tag = '부동산';

  return { name, phone, email, address, category, company, id, tag, color };
}

async function getCoordinates(address) {
  try {
    if (!address) return { lat: 37.4979, lng: 127.0276 };
    // OpenStreetMap doesn't like very detailed korean addresses (e.g., 402호).
    // Let's truncate at the first comma or numbers if it gets too long, or just try full first.
    // We will just try full, Nominatim is quite good.
    const query = encodeURIComponent(address);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    
    // Fallback parsing (try removing anything after a comma)
    if (address.includes(',')) {
      const fallbackQuery = encodeURIComponent(address.split(',')[0]);
      const res2 = await fetch(`https://nominatim.openstreetmap.org/search?q=${fallbackQuery}&format=json&limit=1`);
      const data2 = await res2.json();
      if (data2 && data2.length > 0) {
        return { lat: parseFloat(data2[0].lat), lng: parseFloat(data2[0].lon) };
      }
    }
  } catch(e) {
    console.error("Geocoding failed:", e);
  }
  // Fallback to Gangnam Station area if not found
  return { lat: 37.4979, lng: 127.0276 };
}
