const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "157.245.59.56",
  user: "u6405327",
  password: "6405327",
  database: "u6405327_DIT322",
  port: 3366,
});

var app = express();
app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.json({
    status: "ok",
    message: "Hellow World",
  });
});

// app.get("/orders", function (req, res) {
//   connection.query(
//     `SELECT O.orderid, C.firstname AS customer, P.name AS Product_Name, O.quantity
//       FROM a1_order
//       LEFT JOIN a1_customer C ON O.ID_Customer = C.ID_Customer
//       LEFT JOIN a1_bags P ON O.ID_Product = P.ID_Product; `,
//     function (err, results) {
//       res.json(results);
//     }
//   );
// });

app.get("/top_products", function (req, res) {
  connection.query(
    "SELECT a1_bag.* , sum(quantity) as quantity_sum FROM a1_bag,a1_order WHERE a1_order.bag_id = a1_bag.bag_id GROUP BY a1_order.bag_id ORDER BY quantity_sum desc;",
    function (err, results) {
      console.log(results); //แสดงผลที่ console
      res.json(results); //ตอบกลับ request
    }
  );
});

app.get("/top_customers", function (req, res) {
  connection.query(
    "SELECT a1_customer.*, sum(quantity*bag_price) as bag_price_sum FROM a1_customer,a1_order,a1_bag WHERE a1_order.c_id = a1_customer.c_id AND a1_order.bag_id = a1_bag.bag_id GROUP BY a1_order.c_id ORDER BY bag_price_sum DESC;",
    function (err, results) {
      console.log(results); //แสดงผลที่ console
      res.json(results); //ตอบกลับ request
    }
  );
});

app.post("/orders", function (req, res) {
  const values = req.body;
  console.log(values);
  connection.query(
    "INSERT INTO a1_order (order_id, c_id, bag_id , quantity) VALUES ?",
    [values],
    function (err, results) {
      console.log(err);
      console.log(results); //แสดงผลที่ console
      res.json(results); //ตอบกลับ request
    }
  );
});

app.listen(5000, () => {
  console.log("Server is started.");
});