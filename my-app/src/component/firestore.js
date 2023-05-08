

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

    // získání ID uživatelů (users) v Firestore databázi, kteří žijí v určitém městě. 
    const getUserIdsByCity = async (city) => {

      // V první řadě se definuje reference na uzel "users" v Firestore databázi 
      // pomocí funkce "collection()" a připojení k databázovému objektu "db_firestore".
        const usersRef = collection(db_firestore, "users");

      // Poté se vytváří dotaz (query) pro získání uživatelů, kteří žijí v určitém městě ("city"). 
      // Dotaz obsahuje filtr "where()", který vrací uživatele, kde "address.city" odpovídá zadanému městu.
        const usersQuery = query(usersRef, where("address.city", "==", city));

      // Poté se pomocí funkce "getDocs()" získají snapshoty všech uživatelů, kteří odpovídají filtrům v dotazu.
        const usersSnapshot = await getDocs(usersQuery);

      // Výsledkem je pole ID všech uživatelů, kteří splňují požadovaný filtr. 
      // Tento seznam se vytvoří pomocí funkce "map()", která prochází všechny snapshoty a pro každý snapshot vrátí jeho ID pomocí funkce "id".
        return usersSnapshot.docs.map((doc) => doc.id);
      }

    const readFireStoreDB = async () => {
        // získat objednávky (orders) z Firestore databáze, které mají uživatele (user) s určitou adresou (Anytown USA)

        // V první řadě se definuje reference na uzel "orders" v 
        // Firestore databázi pomocí funkce "collection()" a připojení k databázovému objektu "db_firestore".
        const ordersRef = collection(db_firestore, "orders");

        // Poté se vytváří dotaz (query) pro získání objednávek pro uživatele, kteří žijí v určitém městě ("Anytown USA").
        // Dotaz obsahuje filtry a vrací objednávky, kde "user_id" odpovídá ID uživatelů, kteří žijí v daném městě.
        // Filtr vrací objednávky (orders), kde hodnota vlastnosti "user_id" je obsažena v seznamu ID uživatelů (users), 
        // kteří žijí v určitém městě (Anytown USA).
        // Konkrétně funkce "where()" vytváří filtr pro vlastnost "user_id", 
        // který porovnává hodnoty vlastnosti "user_id" v objednávkách s hodnotami v seznamu ID uživatelů, 
        // které jsou vráceny funkcí "getUserIdsByCity()". 
        // Seznam ID uživatelů, kteří žijí v městě "Anytown USA", 
        // je vrácen asynchronně z funkce "getUserIdsByCity()" pomocí klíčového slova "await". 
        // Funkce "getUserIdsByCity()" vrací seznam ID uživatelů, kteří splňují filtr pro adresu s daným městem.
        // Seznam ID uživatelů je obalován do pole pomocí zápisu "[...]", což umožňuje přidávat prvky pole do seznamu ID. 
        // Poté se toto pole předává jako druhý parametr do funkce "in()", která vyhledává hodnoty "user_id" v objednávkách, 
        // které jsou obsaženy v seznamu ID uživatelů.

        // Celkově tedy tento kód slouží k filtrování objednávek v Firestore databázi na základě adresy uživatelů, kteří žijí v určitém městě.
        const ordersQuery = query(
        ordersRef,
        where("user_id", "in", [
            // Get user IDs of users who live in "Anytown USA"
            ...(await getUserIdsByCity("Anytown USA")),
        ])
        );

        // Poté se pomocí funkce "getDocs()" získají snapshoty všech objednávek, které odpovídají filtrům v dotazu.
        const ordersSnapshot = await getDocs(ordersQuery);

        // V cyklu "for" se projdou všechny snapshoty objednávek a pro každou objednávku
        // se získá ID uživatele, který tuto objednávku provedl, pomocí funkce "data()".
        for (const orderDoc of ordersSnapshot.docs) {
        const userId = orderDoc.data().user_id;

        // Poté se získá reference na dokument s uživatelem s tímto ID v uzlu "users" 
        // pomocí funkce "doc()", a následně se získá snapshot tohoto dokumentu pomocí funkce "getDoc()".
        const userRef = doc(db_firestore, "users", userId);
        const userDoc = await getDoc(userRef);
        // V získaném snapshotu se získá jméno uživatele pomocí funkce "data()".
        const userName = userDoc.data().name;

        // Nakonec se vytiskne do konzole ID objednávky, celková cena, datum objednávky
        // a jméno uživatele pro každou objednávku, která splňuje požadovaný filtr.
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