const inquirer = require("inquirer");
const mySQL = require("mysql");
const Table = require("cli-table");

var connection = mySQL.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "testtest",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  queryAllProducts();
  takeOrders();
});

function queryAllProducts() {
  console.log("Welcome to Bamazon! Please see our available items below:\n");
  console.log("-----------------------------------\n");
  // instantiate table
  const table = new Table({
    head: ["Prod ID", "Product", "Price ($)"],
    colWidths: [10, 20, 15]
  });
  connection.query("SELECT * FROM tblProducts", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      // push rows to table
      table.push([res[i].intId, res[i].strProduct, res[i].curPrice.toFixed(2)]);
    }
    console.log(table.toString() + "\n");
  });
}

function takeOrders() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter the product ID for your desired product.\n",
        name: "productChoice"
      },
      {
        type: "input",
        message: "How many of this item would you like to purchase?\n",
        name: "quantity"
      }
    ])
    .then(initialResponse => {
      //TODO Database hits are expensive, find a better way to store initial query res
      connection.query(
        "SELECT intQuantity, curPrice FROM tblProducts WHERE intID = ?",
        [initialResponse.productChoice],
        function(err, res) {
          if (err) throw err;
          if (initialResponse.quantity > res[0].intQuantity) {
            console.log(
              `Sorry, we only have ${
                res[0].intQuantity
              } products matching that ID in our warehouse. Please try your purchase again.`
            );
          } else {
            let totalPrice = (res[0].curPrice * initialResponse.quantity).toFixed(2);
            console.log(
              `Your purchase was completed successfully! Your account will be debited $${totalPrice}`
            );
            let newQuantity = res[0].intQuantity - initialResponse.quantity;
            connection.query(
              "UPDATE tblProducts SET intQuantity = ? WHERE intID = ?",
              [newQuantity, initialResponse.productChoice],
              function(err, res) {
                if (err) throw err;
              }
            );
          }
          inquirer
            .prompt([
              {
                type: "confirm",
                message: "Would you like to continue shopping?",
                name: "continue"
              }
            ])
            .then(logoutCheck => {
              if (logoutCheck.continue) {
                queryAllProducts();
                takeOrders();
              } else {
                connection.end();
                console.log("Logged out. Please come again!");
              }
            });
        }
      );
    });
}
