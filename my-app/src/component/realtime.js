import { onValue, ref, set, push, child, get, query, orderByChild, equalTo, startAt, endAt, on, update } from 'firebase/database';


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

        // Add data to the users node
        const user3 = {
          name: "Alice Smith",
          email: "alice.smith@example.com",
          address: {
            street: "789 Elm St",
            city: "Anytown USA",
            zip: "98765",
          },
        };
        const user3Ref = push(usersRef);
        set(user3Ref, user3);

        const user4 = {
          name: "Bob Johnson",
          email: "bob.johnson@example.com",
          address: {
            street: "321 Pine St",
            city: "Anytown USA",
            zip: "67890",
          },
        };
        const user4Ref = push(usersRef);
        set(user4Ref, user4);

        // Add data to the orders node
        const order3 = {
          user_id: user3Ref.key,
          total_price: 30.0,
          order_date: "2023-05-02",
        };
        const order3Ref = push(ordersRef);
        set(order3Ref, order3);

        const order4 = {
          user_id: user4Ref.key,
          total_price: 100.0,
          order_date: "2023-05-01",
        };
        const order4Ref = push(ordersRef);
        set(order4Ref, order4);

        // Add data to the products node
        const product4 = {
          name: "Dress",
          description: "Elegant dress for special occasions",
          price: 79.99,
        };
        const product4Ref = push(productsRef);
        set(product4Ref, product4);

        const product5 = {
          name: "Suit",
          description: "Professional suit for men",
          price: 129.99,
        };
        const product5Ref = push(productsRef);
        set(product5Ref, product5);

        const product6 = {
          name: "Running shoes",
          description: "Lightweight and comfortable running shoes",
          price: 49.99,
        };
        const product6Ref = push(productsRef);
        set(product6Ref, product6);

        // Add data to the orderItems node
        const orderItem4 = {
          order_id: order3Ref.key,
          product_id: product4Ref.key,
          quantity: 1,
        };
        const orderItem4Ref = push(orderItemsRef);
        set(orderItem4Ref, orderItem4);

        const orderItem5 = {
          order_id: order3Ref.key,
          product_id: product6Ref.key,
          quantity: 2,
        };
        const orderItem5Ref = push(orderItemsRef);
        set(orderItem5Ref, orderItem5);

        const orderItem6 = {
          order_id: order4Ref.key,
          product_id: product5Ref.key,
          quantity: 1,
        };
        const orderItem6Ref = push(orderItemsRef);
        set(orderItem6Ref, orderItem6);
      };


      // -------------------------------------------------------------------------------------------------

      const readRealTimeDB = async () => {
        // Vytvoření reference na uzel "orders" v databázi
        const ordersRef = ref(db, "orders");
        // Vytvoření dotazu, který získá všechny dětské uzly uzlu "orders"
        const ordersQuery = query(ordersRef, orderByChild("total_price"));
        // Získání snapshotu výsledků dotazu pomocí funkce "get()"
        const ordersSnapshot = await get(ordersQuery);
      
        // Iterace přes každý dětský uzel uzlu "orders"
        for (const orderId in ordersSnapshot.val()) {
          // Extrahování dat objednávky ze snapshotu
          const order = ordersSnapshot.val()[orderId];
          // Extrahování ID uživatele z dat objednávky
          const userId = order.user_id;
          // Vytvoření reference na odpovídající uzel uživatele v databázi
          const userRef = ref(db, "users/" + userId);
          // Získání snapshotu uzlu uživatele pomocí funkce "get()"
          const userSnapshot = await get(userRef);
          // Extrahování jména uživatele ze snapshotu
          const userName = userSnapshot.val().name;
          // Vypsání dat objednávky a jména uživatele do konzole pomocí funkce "console.log()"
          console.log(
            orderId,
            "=>",
            "Celková cena:",
            order.total_price,
            "Datum objednávky:",
            order.order_date,
            "Jméno uživatele:",
            userName
          );
        }
      };


    const updateRealTimeDB = () => {

      const userId = "-NV4q8t-UBU7agyfa_mj";
      const userRef = ref(db, `users/${userId}`);
      update(userRef, { name: "David Duong" });

    }

    return (
        <div>
            <button onClick={ () => createRealTimeDB() }>Create realtime DB</button>
            <button onClick={ () => readRealTimeDB() }>Read realtime DB</button>
            <button onClick={ () => updateRealTimeDB() }>Update realtime DB</button>
            
        </div>
    )
}

