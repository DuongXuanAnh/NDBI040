# Fire Store   
    rules_version = '2';
    service cloud.firestore {
        match /databases/{database}/documents {
            match /{document=**} {
                allow read, write: if true;
            }
        }
    }

Tento kód reprezentuje sadu pravidel přístupu pro Firebase Cloud Firestore, což je dokumentová databáze poskytovaná společností Google jako součást služby Firebase. Pravidla přístupu definují, kdo a jak může číst nebo zapisovat do dokumentů v databázi.

Konkrétně tento kód nastavuje pravidla, která umožňují čtení a zápis do jakéhokoli dokumentu v databázi pro všechny uživatele, kteří mají přístup k databázi.

První řádek "rules_version = '2';" určuje verzi syntaxe pravidel, která se používá. V tomto případě je použita verze 2.

Druhý řádek "service cloud.firestore {" určuje, že se tato sada pravidel týká Firebase Cloud Firestore.

Třetí řádek "match /databases/{database}/documents {" definuje kořenovou cestu pro všechny dokumenty v databázi. Zde se používá tzv. wildcard "{database}", který umožňuje připojení libovolného názvu databáze.

Čtvrtý řádek "match /{document=} {" definuje, že toto pravidlo platí pro jakýkoli dokument v databázi. Opět se zde používá wildcard "{document=}", který umožňuje připojení libovolné cesty k dokumentu.

Poslední řádek "allow read, write: if true;" definuje, že uživatelé mají povoleno číst a zapisovat do dokumentu, pokud platí podmínka "true". To znamená, že každý uživatel má neomezený přístup k databázi a může číst a zapisovat data do jakéhokoli dokumentu v ní. Toto pravidlo je velmi nebezpečné a v reálných aplikacích by bylo třeba přidat omezení na základě identity uživatele, role nebo jiných faktorů, aby byla zajištěna bezpečnost dat.

# Realtime
    {
    "rules": {
        "users": {
        ".read": "true",
        ".write": "true"
        },
        "orders": {
        ".indexOn": ["total_price"],
        ".read": "true",
        ".write": "true"
        },
        ".read": "true",
        ".write": "true"
    }
    }
Tento kód představuje sadu pravidel přístupu pro Realtime Database v Firebase. Pravidla určují, kdo a jak může přistupovat k různým částem databáze a jaké operace mohou provádět.

První úroveň pravidel definuje, že každý uživatel má přístup ke kořenovému adresáři "users" a může číst a zapisovat data v této složce. Tento přístup je definován pomocí klíče ".read" a ".write", které jsou nastaveny na "true".

Druhá úroveň pravidel je určena pro složku "orders". V této složce jsou definovány další dvě pravidla. První pravidlo ".indexOn" určuje, že pro položky v této složce se má vytvořit index na hodnotu "total_price". To umožní efektivnější dotazování na data v této složce. Druhé pravidlo ".read" a ".write" definuje, že uživatelé mohou číst a zapisovat data v této složce, stejně jako v kořenové složce.

Třetí úroveň pravidel na kořenové úrovni definuje, že každý uživatel má obecný přístup ke kořenové složce celé databáze a může číst a zapisovat data v této složce.

Celkově řečeno, tato sada pravidel umožňuje každému uživateli plný přístup k databázi Realtime Database Firebase, což může být nebezpečné, pokud databáze obsahuje citlivá data. V reálné aplikaci by pravidla musela být přizpůsobena konkrétním potřebám aplikace a vztahům mezi uživateli a daty v databázi.






