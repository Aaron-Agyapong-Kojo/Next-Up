import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const testFirebaseConnection = async () => {
  try {
    // Try to write a test document
    const testCollection = collection(db, "test_collection");
    const testDoc = await addDoc(testCollection, {
      message: "Test connection",
      timestamp: new Date().toISOString()
    });
    console.log("✅ Write test successful! Document written with ID:", testDoc.id);

    // Try to read documents
    const querySnapshot = await getDocs(testCollection);
    console.log("✅ Read test successful! Documents in collection:", querySnapshot.size);
    
    return { success: true, message: "Firebase connection test passed!" };
  } catch (error) {
    console.error("❌ Firebase connection test failed:", error);
    return { success: false, message: error.message };
  }
};
