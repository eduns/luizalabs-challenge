CREATE TABLE IF NOT EXISTS customers (
  id numeric(10) PRIMARY KEY NOT NULL,
  name varchar(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id numeric(10) PRIMARY KEY NOT NULL,
  date date NOT NULL,
  customer_id numeric(10) NOT NULL,
  CONSTRAINT fk_customer FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
  order_id numeric(10) NOT NULL,
  product_id numeric(10) NOT NULL,
  value numeric(12, 2) NOT NULL
);
