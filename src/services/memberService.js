import { collection, getDocs, onSnapshot, query, addDoc, updateDoc, doc, serverTimestamp, where, getDoc } from 'firebase/firestore';
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

// --- 1-to-1 Requests ---

export const createOneToOneRequest = async (requestData) => {
  try {
    const docRef = await addDoc(collection(db, '1to1_requests'), {
      ...requestData,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating 1to1 request:", error);
    throw error;
  }
};

export const subscribeToOneToOneRequests = (userName, callback) => {
  // Subscribe to all requests where the user is either sender or receiver
  // We do two queries because Firestore 'OR' queries on different fields can be tricky,
  // but let's just fetch all and filter in frontend for simplicity since data size is small.
  // Or better, if we have userName, we can just get all and filter locally for now.
  const q = query(collection(db, '1to1_requests'));
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).filter(req => req.senderName === userName || req.receiverName === userName);
    // Sort by createdAt descending
    requests.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });
    callback(requests);
  }, (error) => {
    console.error("Error fetching 1to1 requests:", error);
  });
};

export const updateOneToOneStatus = async (requestId, status, requestData = null) => {
  try {
    const requestRef = doc(db, '1to1_requests', requestId);
    await updateDoc(requestRef, {
      status,
      updatedAt: serverTimestamp()
    });

    if (status === 'accepted' && requestData) {
      // Create a meeting marker in 'meetings' collection so it shows on the map
      await addDoc(collection(db, 'meetings'), {
        title: `원투원: ${requestData.senderName} & ${requestData.receiverName}`,
        type: '1to1',
        date: requestData.proposedDate,
        time: requestData.proposedTime,
        location: requestData.locationType === '온라인 (Zoom 등)' ? '온라인 미팅' : requestData.locationType,
        lat: requestData.receiverLat || 37.5112, // fallback
        lng: requestData.receiverLng || 127.0458, // fallback
        participants: [requestData.senderName, requestData.receiverName],
        status: 'upcoming'
      });
    }
  } catch (error) {
    console.error("Error updating 1to1 status:", error);
    throw error;
  }
};
