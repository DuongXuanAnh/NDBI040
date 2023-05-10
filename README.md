# 2. query
## Firestore
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
## Firestore

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