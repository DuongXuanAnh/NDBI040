import { onValue, ref, set, push, child, get, query, orderByChild, equalTo, startAt, endAt, on } from 'firebase/database';


import { db } from "../config/firebase";

export const Realtime = () => {

    const createRealTimeDB = () => {

        // V první řadě se definují reference na různé uzly v databázi ("users", "orders", "products" a "orderItems") pomocí funkce "ref()" a připojení k databázovému objektu "db".
        // Write data to the database
        
        const usersRef = ref(db, "users");
        const ordersRef = ref(db, "orders");
        const productsRef = ref(db, "products");
        const orderItemsRef = ref(db, "orderItems");
        
        // Add data to the users node
        // Poté se vytváří objekt "user1", který obsahuje jméno, e-mailovou adresu a adresu uživatele.
        const user1 = {
          name: "John Doe",
          email: "john.doe@example.com",
          address: {
            street: "123 Main St",
            city: "Anytown USA",
            zip: "12345",
          },
        };

        // Dále se pomocí funkce "push()" vytváří nová reference pro uživatele v uzlu "users".
        const user1Ref = push(usersRef);
        // Na závěr se pomocí funkce "set()" zapíše objekt "user1" do nové reference v uzlu "users" v databázi.
        set(user1Ref, user1);
    
        const user2 = {
          name: "Jane Doe",
          email: "jane.doe@example.com",
          address: {
            street: "456 Oak St",
            city: "Anytown USA",
            zip: "54321",
          },
        };
        const user2Ref = push(usersRef);
        set(user2Ref, user2);
    
        // Add data to the orders node
        const order1 = {
          user_id: user1Ref.key,
          total_price: 50.0,
          order_date: "2023-05-05",
        };
        const order1Ref = push(ordersRef);
        set(order1Ref, order1);
    
        const order2 = {
          user_id: user2Ref.key,
          total_price: 75.0,
          order_date: "2023-05-04",
        };
        const order2Ref = push(ordersRef);
        set(order2Ref, order2);
    
        // Add data to the products node
        const product1 = {
          name: "T-shirt",
          description: "Comfortable cotton T-shirt",
          price: 19.99,
        };
        const product1Ref = push(productsRef);
        set(product1Ref, product1);
    
        const product2 = {
          name: "Jeans",
          description: "Classic denim jeans",
          price: 39.99,
        };
        const product2Ref = push(productsRef);
        set(product2Ref, product2);
    
        const product3 = {
          name: "Sneakers",
          description: "Sporty and stylish sneakers",
          price: 69.99,
        };
        const product3Ref = push(productsRef);
        set(product3Ref, product3);
    
        // Add data to the orderItems node
        const orderItem1 = {
          order_id: order1Ref.key,
          product_id: product1Ref.key,
          quantity: 2,
        };
        const orderItem1Ref = push(orderItemsRef);
        set(orderItem1Ref, orderItem1);
    
        const orderItem2 = {
          order_id: order1Ref.key,
          product_id: product2Ref.key,
          quantity: 1,
        };
        const orderItem2Ref = push(orderItemsRef);
        set(orderItem2Ref, orderItem2);
    
        const orderItem3 = {
          order_id: order2Ref.key,
          product_id: product3Ref.key,
          quantity: 3,
        };
        const orderItem3Ref = push(orderItemsRef);
        set(orderItem3Ref, orderItem3);
      };


      // Tento kód slouží k získání seznamu ID uživatelů, kteří mají v adresách uvedeno určité město. 
      // Funkce "getUserIdsByCity()" vrací seznam ID uživatelů, kteří mají město v adrese uvedeno a vrací ho jako Promise.
      const getUserIdsByCity = async (city) => {

        // Nejprve se vytvoří reference na kolekci "users" v Firestore databázi pomocí "ref()"
        const usersRef = ref(db, "users");
        // následně se pomocí funkce "query()" sestaví dotaz na databázi pro všechny uživatele, 
        // kteří mají v adrese uvedeno dané město. To se provádí pomocí metod "orderByChild()" a "equalTo()", 
        // které se používají pro filtrování dat podle konkrétní vlastnosti a její hodnoty.
        const usersQuery = query(usersRef, orderByChild("address/city"), equalTo(city));

        // Poté se používá asynchronní metoda "get()" k získání dat z Firestore databáze podle výše uvedeného dotazu. 
        // Funkce "get()" vrátí výsledky v podobě "snapshot" objektu.
        const snapshot = await get(usersQuery);
      
        const userIds = [];
        snapshot.forEach((childSnapshot) => {
          userIds.push(childSnapshot.key);
        });
        // Nakonec se vrací pole "userIds" obsahující seznam ID uživatelů, kteří mají dané město v adrese.
        return userIds;
      };
      
      const readRealTimeDB = async () => {
        // Tento kód získává seznam ID uživatelů, kteří žijí v městě "Anytown USA", 
        // a následně na základě tohoto seznamu získává všechny objednávky, které byly vytvořeny uživateli z tohoto seznamu.


        // Nejprve se volá funkce "getUserIdsByCity()", která vrací seznam ID uživatelů, kteří žijí v městě "Anytown USA".
          const userIds = await getUserIdsByCity("Anytown USA");

        // Poté se vytvoří reference na kolekci "orders" v Firestore databázi pomocí "ref()"
          const ordersRef = ref(db, "orders");

        // Následně se pomocí funkce "query()" sestaví dotaz na databázi pro všechny objednávky, 
        // které byly vytvořeny uživateli z tohoto seznamu ID. 
        // To se provádí pomocí metod "orderByChild()", "startAt()" a "endAt()". 
        // Metoda "startAt()" se používá k určení, od kterého ID uživatele začít, a metoda "endAt()" k určení, kde skončit.
          const ordersQuery = query(ordersRef, orderByChild("user_id"), startAt(userIds[0]), endAt(userIds[userIds.length - 1]));
          
        // Poté se používá asynchronní metoda "get()" k získání dat z Firestore databáze podle výše uvedeného dotazu. 
        // Funkce "get()" vrátí výsledky v podobě "ordersSnapshot" objektu.
          const ordersSnapshot = await get(ordersQuery);


          // Pro každou objednávku v "ordersSnapshot" se používá metoda "forEach()" k projití všech objednávek a ověření,
          //  zda objednávka patří uživateli, který žije v "Anytown USA".
          ordersSnapshot.forEach(async (orderSnapshot) => {
              const orderData = orderSnapshot.val();

              // Pokud ano, tak se pomocí reference "userRef" získává informace o uživateli z databáze,
              // a to pomocí asynchronní metody "get()". Poté se získá jméno uživatele z "userSnapshot".
              if (userIds.includes(orderData.user_id)) {
                  const userRef = ref(db, `users/${orderData.user_id}`);
                  const userSnapshot = await get(userRef);
                  const userName = userSnapshot.val().name;
                  const orderDate = new Date(orderData.order_date);

                  console.log(orderSnapshot.key, "=>", "Total Price:", orderData.total_price, "Order Date:", orderDate, "User Name:", userName);
              }
          });
      };

    return (
        <div>
            <button onClick={ () => createRealTimeDB() }>Create realtime DB</button>
            <button onClick={ () => readRealTimeDB() }>Read realtime DB</button>
        </div>
    )
}

