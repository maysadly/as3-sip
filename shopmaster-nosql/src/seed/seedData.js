const faker = require("faker");
const { connectDB } = require("../db/connect");
const { ObjectId } = require("mongodb");

async function seedProducts(db) {
  const productsCollection = db.collection("products");
  
  await productsCollection.deleteMany({});

  const products = [];
  for (let i = 0; i < 1000; i++) {
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      categories: [faker.commerce.department()],
      stock: faker.datatype.number({ min: 0, max: 500 })
    });
  }

  await productsCollection.insertMany(products);
  console.log("Seeded 1000 products.");
}

async function seedCustomers(db) {
  const customersCollection = db.collection("customers");
  await customersCollection.deleteMany({});

  const customers = [];
  for (let i = 0; i < 20; i++) {
    customers.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        zip: faker.address.zipCode()
      }
    });
  }

  const result = await customersCollection.insertMany(customers);
  console.log("Seeded 20 customers.");
  return result.insertedIds;
}

async function seedOrders(db, customerIds) {
  const ordersCollection = db.collection("orders");
  const productsCollection = db.collection("products");
  await ordersCollection.deleteMany({});

  const productDocs = await productsCollection.find({}).limit(50).toArray();
  const productIds = productDocs.map((p) => p._id);

  const orders = [];
  for (let i = 0; i < 30; i++) {
    const randomCustomerId =
      customerIds[Math.floor(Math.random() * customerIds.length)];

    const randomProducts = [];
    const numProducts = faker.datatype.number({ min: 1, max: 5 });
    let totalPrice = 0;

    for (let j = 0; j < numProducts; j++) {
      const randomProductId =
        productIds[Math.floor(Math.random() * productIds.length)];
      const matchedProduct = productDocs.find((p) => p._id.equals(randomProductId));
      if (matchedProduct) {
        randomProducts.push(randomProductId);
        totalPrice += matchedProduct.price;
      }
    }

    orders.push({
      customer_id: randomCustomerId,
      order_date: faker.date.recent(),
      product_ids: randomProducts,
      total_price: parseFloat(totalPrice.toFixed(2))
    });
  }

  await ordersCollection.insertMany(orders);
  console.log("Seeded 30 orders.");
}

async function seedReviews(db, customerIds) {
  const reviewsCollection = db.collection("reviews");
  const productsCollection = db.collection("products");
  await reviewsCollection.deleteMany({});

  const productDocs = await productsCollection.find({}).limit(50).toArray();
  const productIds = productDocs.map((p) => p._id);

  const reviews = [];
  for (let i = 0; i < 40; i++) {
    const randomCustomerId =
      customerIds[Math.floor(Math.random() * customerIds.length)];
    const randomProductId =
      productIds[Math.floor(Math.random() * productIds.length)];
    const randomRating = faker.datatype.number({ min: 1, max: 5 });

    reviews.push({
      customer_id: randomCustomerId,
      product_id: randomProductId,
      rating: randomRating,
      comment: faker.lorem.sentence(),
      review_date: faker.date.recent()
    });
  }

  await reviewsCollection.insertMany(reviews);
  console.log("Seeded 40 reviews.");
}

async function run() {
  try {
    const db = await connectDB();

    
    await seedProducts(db);

    
    const customerIdsObj = await seedCustomers(db);
    const customerIds = Object.values(customerIdsObj);

    
    await seedOrders(db, customerIds);

    
    await seedReviews(db, customerIds);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error in seed script:", err);
    process.exit(1);
  }
}

run();