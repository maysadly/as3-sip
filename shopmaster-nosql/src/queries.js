const { connectDB } = require("./db/connect");

async function aggregateOrders() {
  const db = await connectDB();
  const pipeline = [
    {
      $lookup: {
        from: "products",
        localField: "product_ids",
        foreignField: "_id",
        as: "ordered_products"
      }
    },
    { $unwind: "$ordered_products" },
    {
      $group: {
        _id: "$ordered_products.categories",
        totalSales: { $sum: "$ordered_products.price" },
        count: { $sum: 1 }
      }
    }
  ];

  const results = await db.collection("orders").aggregate(pipeline).toArray();
  console.log("Order aggregation by categories:", results);
  process.exit(0);
}

aggregateOrders();