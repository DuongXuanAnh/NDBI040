import { onValue, ref, set, push } from 'firebase/database';

import { db } from "../config/firebase";

export const Realtime = () => {

    const createRealTimeDB = () => {
    
        // Write data to the database
        const usersRef = ref(db, "users");
        const ordersRef = ref(db, "orders");
        const productsRef = ref(db, "products");
        const orderItemsRef = ref(db, "orderItems");
    
        // Add data to the users node
        const user1 = {
          name: "John Doe",
          email: "john.doe@example.com",
          address: {
            street: "123 Main St",
            city: "Anytown USA",
            zip: "12345",
          },
        };
        const user1Ref = push(usersRef);
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
      }

    return (
        <div>
            <button onClick={ () => createRealTimeDB() }>Create realtime DB</button>
        </div>
    )
}