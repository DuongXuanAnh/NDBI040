

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

    // -------------------------------------------------------------------------------------------------

    // Funkce iteruje přes všechny uživatele a pro každého z nich projde všechny objednávky
    //  a záznamy v objednávkách a spočítá celkové příjmy pro každého uživatele. 
    // Výsledkem je objekt revenuePerUser, který obsahuje jméno, email a celkové příjmy za každého uživatele.
    const calculateRevenuePerUser = (users, orders, orderItems) => {
      const revenuePerUser = {};
    
      for (const user of users) {
        let totalRevenue = 0;
    
        for (const order of orders) {
          if (order.user_id === user.id) {
            for (const orderItem of orderItems) {
              if (orderItem.order_id === order.id) {
                totalRevenue += order.total_price * orderItem.quantity;
              }
            }
          }
        }
    
        revenuePerUser[user.id] = {
          name: user.name,
          email: user.email,
          revenue: totalRevenue,
        };
      }
      return revenuePerUser;
    };



    // Funkce readFirestoreDB získá referenci na kolekce v Firestore, 
    // načte data pomocí getDocs() a uloží je do proměnných usersData, ordersData a orderItemsData. 
    // Poté zavolá funkci calculateRevenuePerUser s těmito daty a uloží výsledky do proměnné revenuePerUser. 
    // Nakonec se výsledky vypíší na konzoli pomocí console.log().

    // Kód používá asynchronní funkce, aby čekal na dokončení operací získávání dat z Firestore. 
    // Používá se také metoda map(), která prochází každý prvek v poli a vrátí pole nových prvků.
    //  V kódu je použita pro transformaci dat na formát, který se používá v calculateRevenuePerUser.
    const readFireStoreDB = async () => {
      const usersSnapshot = await getDocs(collection(db_firestore, "users"));
      const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
      const ordersSnapshot = await getDocs(collection(db_firestore, "orders"));
      const ordersData = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
      const orderItemsSnapshot = await getDocs(collection(db_firestore, "orderItems"));
      const orderItemsData = orderItemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    
      const revenuePerUser = calculateRevenuePerUser(usersData, ordersData, orderItemsData);
      console.log("Revenue per user:", revenuePerUser);
    };


    return (
        <div>
            <button onClick={ () => createFirestoreDB() }>Create firestore DB</button>
            <button onClick={ () => readFireStoreDB() }>Read firestore DB</button>
        </div>
    )
}