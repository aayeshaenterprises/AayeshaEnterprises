import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOU4g8d2OBAQ4IVhMoQF7NRbz1iZ9svsI",
  projectId: "aayeshaenterprises-5341b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkTokens() {
  const querySnapshot = await getDocs(collection(db, "devices"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

checkTokens();
