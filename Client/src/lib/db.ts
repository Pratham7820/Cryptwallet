import { openDB } from "idb";

const DB_NAME = "Cryptwallet"
const DB_VER = 1

export const db = await openDB(DB_NAME, DB_VER, {
    upgrade(db) {
        if (!db.objectStoreNames.contains("seed")) {
            db.createObjectStore("seed",{
                keyPath : 'username'
            })
        }
        if (!db.objectStoreNames.contains("accounts")) {
            db.createObjectStore("accounts",{
                keyPath : 'accountId'
            })
        }
    }
})
