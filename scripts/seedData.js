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
    id: 'kwak-sung-jin',
    name: '곽성진',
    category: '와인 (Wine Merchant)',
    company: '주식회사 오늘연구소',
    tag: '음식/음료',
    color: '#9c88ff',
    phone: '010-8589-4908',
    email: 'sungjin@oneulwine.co.kr',
    address: '서울 강남구 신사동 616-6, 1층',
    lat: 37.525,
    lng: 127.034
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
