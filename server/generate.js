var faker = require('faker');

var database = { 
  customers: [],
  products: [],
  flights: []
};

function fillInCustomers(db, elements) {
  for (var i = 1; i<= elements; i++) {
    db.push({
      id: i+1,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      address: faker.address.streetAddress() + ' ' + faker.address.country(),
      description: faker.lorem.sentences()
    });
  }
}

function fillInProducts(db, elements) {
  for (var i = 1; i<= elements; i++) {
    db.push({
      id: i,
      name: faker.commerce.productName(),
      description: faker.lorem.sentences(),
      price: faker.commerce.price(),
      imageUrl: "https://source.unsplash.com/1600x900/?product",
      quantity: faker.random.number()
    });
  }
}

function fillInFlights(db, elements) {
  for (var i = 1; i<= elements; i++) {
    db.push({
      id: i,
      date: faker.date.future(),
      delayed: faker.random.boolean(),
      from: faker.address.city(),
      to: faker.address.city()
    });
  }
}

fillInCustomers(database.customers, 100);
fillInProducts(database.products, 100);
fillInFlights(database.flights, 100);

console.log(JSON.stringify(database));
