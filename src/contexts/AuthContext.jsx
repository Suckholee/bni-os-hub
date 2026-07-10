import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  async function login(name, password) {
    const email = `${name}@bni-os.local`;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if password is '000000' during login session
    if (password === '000000') {
      setNeedsOnboarding(true);
    } else {
      // Check Firestore to be absolutely sure they aren't marked as first login
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().isFirstLogin) {
        setNeedsOnboarding(true);
      } else {
        setNeedsOnboarding(false);
      }
    }
    
    return userCredential;
  }

  function logout() {
    return signOut(auth);
  }

  async function updateUserPassword(newPassword) {
    if (!auth.currentUser) throw new Error("No user logged in");
    
    await updatePassword(auth.currentUser, newPassword);
    
    // Mark as no longer needing onboarding in Firestore
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userDocRef, { isFirstLogin: false }, { merge: true });
    
    setNeedsOnboarding(false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    updateUserPassword,
    needsOnboarding
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
