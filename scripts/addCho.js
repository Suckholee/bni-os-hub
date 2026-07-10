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

const m = {
  id: "cho-young-bin",
  name: "조영빈",
  category: "경영컨설팅 (Business Consultant)",
  company: "어니스톤 (HONESTONE)",
  tag: "컨설팅",
  color: "#3742fa",
  phone: "010-9630-9429",
  email: "ceo@honestone.kr",
  address: "서울 강서구 공항대로 227 마곡센트럴타워1 402호",
  lat: 37.558359,
  lng: 126.832961
};

async function run() {
  try {
    const cred = await createUserWithEmailAndPassword(auth, `ceo@honestone.kr`, "000000");
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
  process.exit(0);
}
run();
