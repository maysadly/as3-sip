const { connectDB } = require("./db/connect");
const { ObjectId } = require("mongodb");

async function main() {
  const db = await connectDB();

  // 1. CREATE (Insert a sample product)
  const newProduct = {
    name: "Portable Charger",
    description: "Power bank with USB-C and USB-A ports",
    price: 29.99,
    categories: ["Electronics", "Accessories"],
    stock: 150
  };
  const createResult = await db.collection("products").insertOne(newProduct);
  console.log("Created product with _id:", createResult.insertedId);

  // 2. READ (Find products priced above $500)
  const expensiveProducts = await db
    .collection("products")
    .find({ price: { $gte: 500 } })
    .toArray();
  console.log(
    `Found ${expensiveProducts.length} products with price >= 500`
  );

  // 3. UPDATE (Update stock of newly inserted product)
  await db.collection("products").updateOne(
    { _id: createResult.insertedId },
    { $set: { stock: 100 } }
  );
  console.log("Updated stock for _id:", createResult.insertedId);

  // 4. DELETE (Delete the product we just created)
  await db.collection("products").deleteOne({ _id: createResult.insertedId });
  console.log("Deleted the new product with _id:", createResult.insertedId);

  process.exit(0);
}

main();