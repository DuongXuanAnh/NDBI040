import { db_firestore } from "../config/firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export const FireStore = () => {

    const createFirestoreDB = async () => {
        const user1 = {
            name: "John Doe",
            email: "john.doe@example.com",
            address: {
              street: "123 Main St",
              city: "Anytown USA",
              zip: "12345",
            },
          };
          const user1Ref = await addDoc(collection(db_firestore, "users"), user1);
          
          const user2 = {
            name: "Jane Doe",
            email: "jane.doe@example.com",
            address: {
              street: "456 Oak St",
              city: "Anytown USA",
              zip: "54321",
            },
          };
          const user2Ref = await addDoc(collection(db_firestore, "users"), user2);
          
          // Add data to the orders collection
          const order1 = {
            user_id: user1Ref.id,
            total_price: 50.0,
            order_date: new Date("2023-05-05"),
          };
          const order1Ref = await addDoc(collection(db_firestore, "orders"), order1);
          
          const order2 = {
            user_id: user2Ref.id,
            total_price: 75.0,
            order_date: new Date("2023-05-04"),
          };
          const order2Ref = await addDoc(collection(db_firestore, "orders"), order2);
          
          // Add data to the products collection
          const product1 = {
            name: "T-shirt",
            description: "Comfortable cotton T-shirt",
            price: 19.99,
          };
          const product1Ref = await addDoc(collection(db_firestore, "products"), product1);
          
          const product2 = {
            name: "Jeans",
            description: "Classic denim jeans",
            price: 39.99,
          };
          const product2Ref = await addDoc(collection(db_firestore, "products"), product2);
          
          const product3 = {
            name: "Sneakers",
            description: "Sporty and stylish sneakers",
            price: 69.99,
          };
          const product3Ref = await addDoc(collection(db_firestore, "products"), product3);
          
          // Add data to the orderItems collection
          const orderItem1 = {
            order_id: order1Ref.id,
            product_id: product1Ref.id,
            quantity: 2,
          };
          const orderItem1Ref = await addDoc(collection(db_firestore, "orderItems"), orderItem1);
          
          const orderItem2 = {
            order_id: order1Ref.id,
            product_id: product2Ref.id,
            quantity: 1,
          };
          const orderItem2Ref = await addDoc(collection(db_firestore, "orderItems"), orderItem2);
          
          const orderItem3 = {
            order_id: order2Ref.id,
            product_id: product3Ref.id,
            quantity: 3,
          };
          const orderItem3Ref = await addDoc(collection(db_firestore, "orderItems"), orderItem3);

          const user3 = {
            name: "Alice Smith",
            email: "alice.smith@example.com",
            address: {
                street: "789 Elm St",
                city: "Anytown USA",
                zip: "98765",
            },
        };
        const user3Ref = await addDoc(collection(db_firestore, "users"), user3);
        
        const user4 = {
            name: "Bob Johnson",
            email: "bob.johnson@example.com",
            address: {
                street: "321 Pine St",
                city: "Anytown USA",
                zip: "67890",
            },
        };
        const user4Ref = await addDoc(collection(db_firestore, "users"), user4);
        
        // Add data to the orders collection
        const order3 = {
            user_id: user3Ref.id,
            total_price: 30.0,
            order_date: new Date("2023-05-02"),
        };
        const order3Ref = await addDoc(collection(db_firestore, "orders"), order3);
        
        const order4 = {
            user_id: user4Ref.id,
            total_price: 100.0,
            order_date: new Date("2023-05-01"),
        };
        const order4Ref = await addDoc(collection(db_firestore, "orders"), order4);
        
        // Add data to the products collection
        const product4 = {
            name: "Dress",
            description: "Elegant dress for special occasions",
            price: 79.99,
        };
        const product4Ref = await addDoc(collection(db_firestore, "products"), product4);
        
        const product5 = {
            name: "Suit",
            description: "Professional suit for men",
            price: 129.99,
        };
        const product5Ref = await addDoc(collection(db_firestore, "products"), product5);
        
        const product6 = {
            name: "Running shoes",
            description: "Lightweight and comfortable running shoes",
            price: 49.99,
        };
        const product6Ref = await addDoc(collection(db_firestore, "products"), product6);
        
        // Add data to the orderItems collection
        const orderItem4 = {
            order_id: order3Ref.id,
            product_id: product4Ref.id,
            quantity: 1,
        };
        const orderItem4Ref = await addDoc(collection(db_firestore, "orderItems"), orderItem4);
        
        const orderItem5 = {
            order_id: order3Ref.id,
            product_id: product6Ref.id,
            quantity: 2,
        };
        const orderItem5Ref = await addDoc(collection(db_firestore, "orderItems"), orderItem5);
        
        const orderItem6 = {
            order_id: order4Ref.id,
            product_id: product5Ref.id,
            quantity: 1,
        };
        const orderItem6Ref = await addDoc(collection(db_firestore, "orderItems"), orderItem6);
    };

    const getUserIdsByCity = async (city) => {
        const usersRef = collection(db_firestore, "users");
        const usersQuery = query(usersRef, where("address.city", "==", city));
        const usersSnapshot = await getDocs(usersQuery);
        return usersSnapshot.docs.map((doc) => doc.id);
      }

    const readFireStoreDB = async () => {
        const ordersRef = collection(db_firestore, "orders");
        const ordersQuery = query(
        ordersRef,
        where("user_id", "in", [
            ...(await getUserIdsByCity("Anytown USA")),
        ])
        );

        const ordersSnapshot = await getDocs(ordersQuery);

        for (const orderDoc of ordersSnapshot.docs) {
        const userId = orderDoc.data().user_id;
        const userRef = doc(db_firestore, "users", userId);
        const userDoc = await getDoc(userRef);
        const userName = userDoc.data().name;
        console.log(orderDoc.id, "=>", "Total Price:", orderDoc.data().total_price, "Order Date:", orderDoc.data().order_date.toDate(), "User Name:", userName);
        }
    };


    const updateFirestoreDB = async () => {
        // I want to update name in firestore
        const userId = "78P2o0rFVk9z335MSM6E";
        const newName = "David Duong";
        const userRef = doc(db_firestore, "users", userId);
        await updateDoc(userRef, { name: newName });
    };

    const deleteFirestoreDB = async () => {
      const userId = "gxY02IvwZ4SHZYNaiMHH";
      const userRef = doc(db_firestore, "users", userId);
      await deleteDoc(userRef);
    }


    return (
        <div>
            <button onClick={ () => createFirestoreDB() }>Create firestore DB</button>
            <button onClick={ () => readFireStoreDB() }>Read firestore DB</button>
            <button onClick={ () => updateFirestoreDB() }>Update firestore DB</button>
            <button onClick={ () => deleteFirestoreDB() }>Delete firestore DB</button>
        </div>
    )
}