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
  managerAction();
});

function managerAction() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View products for sale",
          "View low inventory",
          "Add to inventory",
          "Log Out"
        ],
        name: "managerAction"
      }
    ])
    .then(managerAction => {
      if (managerAction.managerAction === "View products for sale") {
        viewItems();
      } else if (managerAction.managerAction === "View low inventory") {
        viewLowInventory();
        //managerAction();
      } else if (managerAction.managerAction === "Add to inventory") {
        addToInventory();
        //managerAction();
      } else if (managerAction.managerAction === "Log Out") {
        connection.end();
        console.log("Logged out.");
      }
    });
}

function viewItems() {
  // instantiate table
  const table = new Table({
    head: ["Prod ID", "Product", "Price ($)", "Quantity"],
    colWidths: [10, 20, 15, 10]
  });
  connection.query("SELECT * FROM tblProducts", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      // push rows to table
      table.push([
        res[i].intId,
        res[i].strProduct,
        res[i].curPrice.toFixed(2),
        res[i].intQuantity
      ]);
    }
    console.log("\n" + table.toString());
  });
  managerAction();
}

function viewLowInventory() {
  const table = new Table({
    head: ["Prod ID", "Product", "Price ($)", "Quantity"],
    colWidths: [10, 20, 15, 10]
  });
  connection.query(
    "SELECT * FROM tblProducts where intQuantity <= 50",
    function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        // push rows to table
        table.push([
          res[i].intId,
          res[i].strProduct,
          res[i].curPrice.toFixed(2),
          res[i].intQuantity
        ]);
      }
      console.log(table.toString());
      managerAction();
    }
  );
}

function addToInventory() {
  inquirer
    .prompt([
      {
        type: "list",
        message:
          "Would you like to add a new item or adjust the stock of an existing item?",
        choices: ["New item", "Additional stock for existing item"],
        name: "addStockChoice"
      }
    ])
    .then(addStockChoice => {
      if (addStockChoice.addStockChoice === "New item") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "What item would you like to add?",
              name: "newItemType"
            },
            {
              type: "input",
              message: "What department should we use to categorize this item?",
              name: "newItemCategory"
            },
            {
              type: "input",
              message: "What will you charge for each of these items?",
              name: "newItemPrice"
            },
            {
              type: "input",
              message: "How many of these items would you like to add?",
              name: "newItemQuantity"
            }
          ])
          .then(newStockChoices => {
            connection.query(
              "INSERT INTO tblProducts (strProduct, strDepartment, curPrice, intQuantity) VALUES(?, ?, ?, ?)",
              [
                newStockChoices.newItemType,
                newStockChoices.newItemCategory,
                newStockChoices.newItemPrice,
                newStockChoices.newItemPrice
              ],
              function(err, res) {
                if (err) throw err;
                console.log("Item added!");
              }
            );
            managerAction();
          });
      } else {
        let stockedItems = [];
        connection.query("SELECT strProduct FROM tblProducts", function(err, res) {
            for(i = 0; i < res.length; i++) {
                stockedItems.push(res[i].strProduct);
            }
          if (err) throw err;
          console.log("stocked items: " + stockedItems);
          inquirer
            .prompt([
              {
                type: "list",
                message: "Which item's stock would you like to adjust?",
                choices: stockedItems,
                name: "adjustChoice"
              },
              {
                type: "input",
                messagee: "How many of this item do we have?",
                name: "adjustAmount"
              }
            ])
            .then(stockAdjust => {
              connection.query(
                "UPDATE tblProducts SET intQuantity = ? WHERE strProduct = ?",
                [stockAdjust.adjustAmount, stockAdjust.adjustChoice],
                function(err, res) {
                  if (err) throw err;
                  console.log(
                    `${stockAdjust.adjustChoice} quantity updated to ${
                      stockAdjust.adjustAmount
                    }.`
                  );
                  managerAction();
                }
              );
            });
        });
      }
    });
}
