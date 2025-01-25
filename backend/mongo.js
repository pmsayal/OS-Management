import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://pmsayal20:rsAqR9Hyf8zfY6UK@ordermanagment.om80u.mongodb.net/order_management?retryWrites=true&w=majority";

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db("MyDB");
        const collection = database.collection("users");
        const records = [
            { name: "John", post: "Manager" },
            { name: "Jane", post: "Developer" },
            { name: "Alice", post: "Designer" },
            { name: "Bob", post: "Analyst" },
            { name: "Eve", post: "Tester" }
        ];
        await collection.insertMany(records);
        console.log("Records successfully inserted!");
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
