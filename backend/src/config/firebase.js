import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
	fs.readFileSync("firebase_config.json", "utf8")
);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://prompted-pastures-default-rtdb.firebaseio.com/",
});

export const db = admin.database();
