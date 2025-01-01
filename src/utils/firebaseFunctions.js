import { collection, doc, getDocs, orderBy, query, setDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebase.config"

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


