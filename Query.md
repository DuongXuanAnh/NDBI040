# 1. query
## Realtime

    Nejprve je vytvořena reference na kolekci "users" v databázi pomocí ref(db, "users"). 
    Proměnná usersRef obsahuje tuto referenci.
    Poté je použita metoda onValue(usersRef, (snapshot) => {...}), 
    která naslouchá na změny v hodnotách usersRef. 
    Tato metoda přijímá funkci, která se vykoná při změně hodnot.
    V těle této funkce se nejprve získají data ze snímku pomocí snapshot.val() 
    a uloží se do proměnné usersData. 
    Tato proměnná obsahuje objekt s daty všech uživatelů.
    Dále je vytvořen prázdný pole usersList, 
    které slouží k ukládání informací o uživatelích.
    Následuje cyklus for...of, který iteruje přes všechny položky v objektu usersData. 
    V každé iteraci se získá klíč (ID uživatele) a hodnota (data uživatele) pomocí Object.entries(usersData).
    V každé iteraci se vytvoří nový objekt, 
    který obsahuje klíč id (ID uživatele) a rozbalené hodnoty ...value (data uživatele). 
    Tento objekt se přidá do pole usersList pomocí usersList.push(...)

      const usersRef = ref(db, "users");
        onValue(usersRef, (snapshot) => {
          const usersData = snapshot.val();
          const usersList = [];

          for (const [key, value] of Object.entries(usersData)) {
            usersList.push({ id: key, ...value });
          }
      console.log(usersList);
# 2. query
## Realtime
  const readRealTimeDB = async () => {
        // Vytvoření reference na uzel "orders" v databázi
        const ordersRef = ref(db, "orders");
        // Vytvoření dotazu, který získá všechny dětské uzly uzlu "orders"
        const ordersQuery = query(ordersRef);
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

# 3. query
## Realtime

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