import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDPiWCYU7j3mSdR5GtMRrjEg-lQX_s-sxk",
  authDomain: "bniexcellent-18e66.firebaseapp.com",
  projectId: "bniexcellent-18e66",
  storageBucket: "bniexcellent-18e66.firebasestorage.app",
  messagingSenderId: "943260586723",
  appId: "1:943260586723:web:9ec535710b7cde89042bd6",
  measurementId: "G-VFEPYMZW9V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const members = [
  {
    id: 'kim-kyoung-ho',
    name: '김경호',
    category: '종합식자재유통',
    company: '(주)더조은유통',
    tag: '유통',
    color: '#341f97',
    phone: '010-4004-6976',
    email: 'hirudgh@naver.com',
    address: '경기도 고양시 일산서구 구산로 110',
    lat: 37.689,
    lng: 126.714
  },
  {
    id: 'kim-gi-yeol',
    name: '김기열',
    category: '인테리어',
    company: '(주)밀리미터제이케이',
    tag: '건축/인테리어',
    color: '#10ac84',
    phone: '010-6772-5951',
    email: 'mmindesign23@gmail.com',
    address: '서울 마포구 성미산로11길 20 1층',
    lat: 37.562,
    lng: 126.917
  },
  {
    id: 'kim-bo-mi',
    name: '김보미',
    category: '안과 의원',
    company: '강남그랜드안과',
    tag: '건강/의료',
    color: '#0abde3',
    phone: '010-2602-8302',
    email: 'bmcare0823@naver.com',
    address: '서울 서초구 강남대로 363 강남타워',
    lat: 37.495,
    lng: 127.028
  },
  {
    id: 'kim-jae-woo',
    name: '김재우',
    category: '골프 레슨',
    company: '파스텔골프클럽',
    tag: '스포츠/레져',
    color: '#ff9f43',
    phone: '010-5833-6562',
    email: 'jjwoo5833@naver.com',
    address: '서울 서초구 잠원동 66-2',
    lat: 37.514,
    lng: 127.014
  },
  {
    id: 'kim-jee-myeong',
    name: '김지명',
    category: '출장 케이터링',
    company: '이레 테이블',
    tag: '음식/음료',
    color: '#ee5253',
    phone: '010-2806-9220',
    email: 'iretable@naver.com',
    address: '경기도 하남시 감일로88번길 3',
    lat: 37.502,
    lng: 127.168
  },
  {
    id: 'kim-tae-kyu',
    name: '김태규',
    category: '부동산 서비스',
    company: '이화공인중개사사무소',
    tag: '부동산',
    color: '#5f27cd',
    phone: '010-3339-3312',
    email: 'focus2you@naver.com',
    address: '서울 강남구 대치동 902 포스코더샵 상가동 101호',
    lat: 37.502,
    lng: 127.054
  }
];

async function run() {
  for (const m of members) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, `${m.name}@bni-os.local`, "000000");
      await setDoc(doc(db, 'users', cred.user.uid), {
        isFirstLogin: true,
        name: m.name
      });
      console.log(`Auth created for ${m.name}`);
    } catch(e) {
      console.log(`Auth for ${m.name} might exist: ${e.message}`);
    }

    await setDoc(doc(db, 'members', m.id), m);
    console.log(`Firestore doc created for ${m.name}`);
  }
  process.exit(0);
}
run();
