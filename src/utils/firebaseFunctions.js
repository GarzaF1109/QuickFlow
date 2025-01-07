import { getFirestore, collection, doc, getDocs, orderBy, query, setDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase.config"
import { getApp } from "firebase/app";

// Saving new Item
export const saveItem = async (data) => {
    await setDoc(doc(firestore, 'foodItems', `${Date.now()}`), data, {merge: true}
    );
};

export const getAllFoodItems = async () => {
    const items = await getDocs(
        query(collection(firestore, "foodItems"), orderBy("id", "desc"))
    );
    return items.docs.map((doc) => doc.data());
};

export const deleteItem = async (id) => {
    try {
        await deleteDoc(doc(firestore, 'foodItems', id));
        console.log(`Document with id ${id} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};

export const editItem = async (id, updatedData) => {
    try {
        await setDoc(doc(firestore, 'foodItems', id), updatedData, { merge: true });
        console.log(`Document with id ${id} updated successfully.`);
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};

export const saveBill = async (cartItems, userId) => {
    try {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
        
        // Reference to the bills collection for the current date
        const dateRef = doc(firestore, "bills", formattedDate);

        // Get or initialize the bill number
        const dateSnapshot = await getDoc(dateRef);
        let billNumber = 1;

        if (dateSnapshot.exists()) {
            // Increment bill count if already exists
            const data = dateSnapshot.data();
            billNumber = (data.lastBillNumber || 0) + 1;
        }

        // Update the last bill number
        await setDoc(dateRef, { lastBillNumber: billNumber }, { merge: true });

        // Reference for the specific bill
        const billRef = doc(collection(dateRef, `${billNumber}`));
        
        // Save the bill data
        const billData = {
            items: cartItems,
            userId: userId || "guest",
            timestamp: serverTimestamp(),
        };

        await setDoc(billRef, billData);

        console.log(`Bill ${billNumber} for date ${formattedDate} created successfully.`);
        return { billNumber, formattedDate };
    } catch (error) {
        console.error("Error saving bill: ", error);
    }
};

const db = getFirestore();

export const getTodaysBills = async (date) => {
    try {
        const currentDate = new Date();
const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
        const billsRef = collection(db, 'bills', formattedDate, '2'); // Aquí colocas la fecha y otros identificadores
        const billsSnapshot = await getDocs(billsRef);
        if (billsSnapshot.empty) {
            console.log("No bills found for today.");
        } else {
            billsSnapshot.forEach(docSnap => {
                console.log("Bill data:", docSnap.data());
            });
        }
    } catch (error) {
        console.error("Error fetching today's bills: ", error);
    }
};


// export const saveBillItems = async (items) => {
//     try {
//         const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
//         const collectionName = `bills${currentDate}`;
        
//         for (const item of items) {
//             await setDoc(doc(collection(firestore, collectionName), `${Date.now()}`), item, { merge: true });
//         }
        
//         console.log("Items successfully added to the collection:", collectionName);
//     } catch (error) {
//         console.error("Error saving bill items: ", error);
//     }
// };

