

import { db_firestore } from "../config/firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";

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
    };


    const getUserIdsByCity = async (city) => {
        const usersRef = collection(db_firestore, "users");
        const usersQuery = query(usersRef, where("address.city", "==", city));
        const usersSnapshot = await getDocs(usersQuery);
        return usersSnapshot.docs.map((doc) => doc.id);
      }

    const readFireStoreDB = async () => {
        // return all orders placed by users who live in the city "Anytown USA"
        // Retrieves a reference to the "orders" collection in Firestore.
        // Creates a query that filters the orders collection based on the following conditions:
        // The "user_id" field of each order document must be in an array of user IDs returned by the getUserIdsByCity() function.
        // Executes the query using getDocs(), which retrieves a QuerySnapshot containing all the order documents that meet the query criteria.
        // Loops through each order document in the snapshot, and logs the order ID, total price, order date, and user name to the console.
        const ordersRef = collection(db_firestore, "orders");
        const ordersQuery = query(
        ordersRef,
        where("user_id", "in", [
            // Get user IDs of users who live in "Anytown USA"
            ...(await getUserIdsByCity("Anytown USA")),
        ])
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        for (const orderDoc of ordersSnapshot.docs) {
        // Get the user's name for this order
        const userId = orderDoc.data().user_id;
        const userRef = doc(db_firestore, "users", userId);
        const userDoc = await getDoc(userRef);
        const userName = userDoc.data().name;

        // Print the order ID, total price, order date, and user name to the console
        console.log(orderDoc.id, "=>", "Total Price:", orderDoc.data().total_price, "Order Date:", orderDoc.data().order_date.toDate(), "User Name:", userName);
        }
    };



    return (
        <div>
            <button onClick={ () => createFirestoreDB() }>Create firestore DB</button>
            <button onClick={ () => readFireStoreDB() }>Read firestore DB</button>
        </div>
    )
}