import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = [];

    for (const doc of querySnapshot.docs) {
      const productsSnapshot = await getDocs(collection(db, `categories/${doc.id}/products`));
      const products = productsSnapshot.docs.map((p) => ({ id: p.id, ...p.data() }));

      categories.push({ id: doc.id, name: doc.data().name, products });
    }

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}
