# Bamazon Warehouse
This is a simple Node.js CLI application designed to simulate an online store. It simulates the buying and stocking of
widgets, and tracks all changes in a mySQL database.

## Getting Started
You will need a few prerequisites for this to run on your machine. You will need Node.js installed and a running mySQL database. 
Your database will need to be named "bamazon" and it will need to have a table called tblProducts. This table will need the following columns:

   * [intID]

   * [strProduct]

   * [strDepartment]
   
   * [curPrice]
   
   * [intQuantity]

As with any node project, run "npm i" to pick up any node dependencies.

## Running the project
The project can be launched as either a customer or as a site manager. 

1. bamazonCustomer

This will present the user with a table of available items.

![Image of customer table](https://github.com/wesleykruger/bamazon-warehouse-database-manager/blob/master/images/customerTable.png)

They will then be prompted to enter an item ID, and then select how many of that item they would like to purchase.

![Image of post-buy](https://github.com/wesleykruger/bamazon-warehouse-database-manager/blob/master/images/customerBuy.png)

If they choose to continue shopping, the cycle will repeat. If they choose that they no longer wish to shop,
they will be "logged out" and the database connection will be terminated.

2. bamazonManager

This will allow users to view all inventory, view items with low inventory, or add/adjust stock.

Viewing the complete inventory will produce a table of items, similar to the one viewed by customers.

![Image of manager table](https://github.com/wesleykruger/bamazon-warehouse-database-manager/blob/master/images/managerTable.png)

Viewing low inventory items will also produce a table, but it will only contain items with a quantity < 50.

![Image of low inventory](https://github.com/wesleykruger/bamazon-warehouse-database-manager/blob/master/images/managerLowInven.png)

If the user chooses to add to the warehouse inventory, they will be asked if they want to add a new item or to
adjust the quantity of an item already present in the database.

If they choose to add a new item, the application will prompt them for information about the item and will then
commit it to the database.

![Image of adding item](https://github.com/wesleykruger/bamazon-warehouse-database-manager/blob/master/images/managerAddNewItem.png)

![Image of added item](https://github.com/wesleykruger/bamazon-warehouse-database-manager/blob/master/images/managerNewItemAdded.png)

If they choose to adjust an existing item's quantity, the system will prompt them for the new number and will update
that value in the database.

![Image of pre-update](https://github.com/wesleykruger/bamazon-warehouse-database-manager/blob/master/images/managerItemPreUpdate.png)

![Image of update](https://github.com/wesleykruger/bamazon-warehouse-database-manager/blob/master/images/managerItemUpdate.png)

![Image of post-update](hhttps://github.com/wesleykruger/bamazon-warehouse-database-manager/blob/master/images/managerItemPostUpdate.png)


### Project made using:

   * [Inquirer](https://www.npmjs.com/package/inquirer/v/5.0.1)

   * [MySQL](https://www.npmjs.com/package/mysql)

   * [CLI-Table](https://www.npmjs.com/package/cli-table)
   

Created by Wes Kruger
