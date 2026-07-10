import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/config';

export const subscribeToMembers = (callback) => {
  const q = query(collection(db, 'members'));
  return onSnapshot(q, (snapshot) => {
    const membersList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(membersList);
  }, (error) => {
    console.error("Error fetching members:", error);
  });
};

export const subscribeToMeetings = (callback) => {
  const q = query(collection(db, 'meetings'));
  return onSnapshot(q, (snapshot) => {
    const meetingsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(meetingsList);
  }, (error) => {
    console.error("Error fetching meetings:", error);
  });
};
