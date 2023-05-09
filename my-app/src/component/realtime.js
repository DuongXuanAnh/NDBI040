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


      // -------------------------------------------------------------------------------------------------

      // Funkce fetchData načte data z databáze Firebase a převede je na pole objektů, 
      // kde každý objekt reprezentuje jeden záznam v databázi. 
      // Každý objekt obsahuje id a hodnoty vlastností získané z Firebase pomocí childSnapshot.val().

      
      // childSnapshot v kódu odkazuje na jedno dítě datového uzlu v Realtime Database. 
      // Při použití metody snapshot.forEach() v kódu, funkce iteruje přes všechny potomky 
      // daného uzlu a v každém kroku cyklu se childSnapshot odkazuje na aktuální potomka.
      // childSnapshot je typicky používán pro získání dat potomka z Realtime Database pomocí metody childSnapshot.val(),
      //  která vrací hodnoty potomka jako objekt.
      
      const fetchData = async (nodeRef) => {
        const snapshot = await get(nodeRef);
        const data = [];
        snapshot.forEach((childSnapshot) => {
          data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        return data;
      };


      // Funkce calculateRevenuePerUser spočítá celkové příjmy za každého uživatele v databázi
      // na základě dat získaných pomocí fetchData. Iteruje přes všechny uživatele a pro každého z nich
      // projde všechny objednávky a záznamy v objednávkách a spočítá celkové příjmy pro každého uživatele. 
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

      // Funkce readRealTimeDB získá referenci na datové uzly v Realtime Database, 
      // načte data pomocí fetchData a vypočítá celkové příjmy za každého uživatele pomocí calculateRevenuePerUser. 
      // Výsledky jsou vypsány na konzoli pomocí console.log().
      const readRealTimeDB = async () => {
        const usersRef = ref(db, "users");
        const ordersRef = ref(db, "orders");
        const orderItemsRef = ref(db, "orderItems");

        const usersData = await fetchData(usersRef);
        const ordersData = await fetchData(ordersRef);
        const orderItemsData = await fetchData(orderItemsRef);

        const revenuePerUser = calculateRevenuePerUser(usersData, ordersData, orderItemsData);
        console.log("Revenue per user:", revenuePerUser);
      };

    return (
        <div>
            <button onClick={ () => createRealTimeDB() }>Create realtime DB</button>
            <button onClick={ () => readRealTimeDB() }>Read realtime DB</button>
        </div>
    )
}

