var faker = require('faker');

var database = { products: [] };

for (var i = 1; i<= 300; i++) {
  database.products.push({
    id: i,
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(),
    price: faker.commerce.price(),
    imageUrl: "https://source.unsplash.com/1600x900/?product",
    quantity: faker.random.number()
  });
}

/*
{
    "account_number": "0531846270",
    "balances": {
      "available": "2198.46",
      "ledger": "2198.46"
    },
    "currency_code": "USD",
    "enrollment_id": "test_enr_-zeH23Ov",
    "id": "test_acc_e17G7mMS",
    "institution": {
      "id": "wells_fargo",
      "name": "Wells Fargo"
    },
    "links": {
      "self": "https://api.teller.io/accounts/test_acc_e17G7mMS",
      "transactions": "https://api.teller.io/accounts/test_acc_e17G7mMS/transactions"
    },
    "name": "Teller API Sandbox Checking",
    "routing_numbers": {
      "ach": "397851565"
    }
  }

  {
  "account_id": "test_acc_e17G7mMS",
  "amount": "-26.2",
  "date": "2020-02-14",
  "description": "Kroger",
  "id": "test_txn_agvq9-pG",
  "links": {
    "account": "https://api.teller.io/accounts/test_acc_e17G7mMS",
    "self": "https://api.teller.io/accounts/test_acc_e17G7mMS/transactions/test_txn_agvq9-pG"
  },
  "running_balance": "2198.46",
  "type": "card_payment"
}
  */

console.log(JSON.stringify(database));
