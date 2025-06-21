export const salesData = [
  {
    transaction_id: "T001",
    product_id: "P001",
    product_name: "Organic Bananas",
    category: "Fruits",
    quantity_sold: 2,
    price: 1.5,
    transaction_date: "2023-10-01T10:00:00Z",
    location: "New York, NY",
  },
  {
    transaction_id: "T001",
    product_id: "P002",
    product_name: "Whole Milk",
    category: "Dairy",
    quantity_sold: 1,
    price: 3.0,
    transaction_date: "2023-10-01T10:00:00Z",
    location: "New York, NY",
  },
  {
    transaction_id: "T002",
    product_id: "P003",
    product_name: "Craft Beer 6-Pack",
    category: "Beverages",
    quantity_sold: 1,
    price: 12.0,
    transaction_date: "2023-10-01T12:30:00Z",
    location: "Brooklyn, NY",
  },
  {
    transaction_id: "T002",
    product_id: "P004",
    product_name: "Diapers Size 4",
    category: "Baby Care",
    quantity_sold: 1,
    price: 25.0,
    transaction_date: "2023-10-01T12:30:00Z",
    location: "Brooklyn, NY",
  },
  {
    transaction_id: "T003",
    product_id: "P005",
    product_name: "Sourdough Bread",
    category: "Bakery",
    quantity_sold: 1,
    price: 5.5,
    transaction_date: "2023-10-02T09:15:00Z",
    location: "San Francisco, CA",
  },
  {
    transaction_id: "T003",
    product_id: "P006",
    product_name: "Avocado",
    category: "Fruits",
    quantity_sold: 3,
    price: 2.0,
    transaction_date: "2023-10-02T09:15:00Z",
    location: "San Francisco, CA",
  },
  {
    transaction_id: "T004",
    product_id: "P001",
    product_name: "Organic Bananas",
    category: "Fruits",
    quantity_sold: 3,
    price: 1.5,
    transaction_date: "2023-10-02T16:45:00Z",
    location: "Los Angeles, CA",
  },
  {
    transaction_id: "T005",
    product_id: "P002",
    product_name: "Whole Milk",
    category: "Dairy",
    quantity_sold: 2,
    price: 3.0,
    transaction_date: "2023-10-03T08:00:00Z",
    location: "New York, NY",
  },
  {
    transaction_id: "T006",
    product_id: "P003",
    product_name: "Craft Beer 6-Pack",
    category: "Beverages",
    quantity_sold: 2,
    price: 12.0,
    transaction_date: "2023-10-03T18:00:00Z",
    location: "Chicago, IL",
  },
  {
    transaction_id: "T007",
    product_id: "P004",
    product_name: "Diapers Size 4",
    category: "Baby Care",
    quantity_sold: 1,
    price: 25.0,
    transaction_date: "2023-10-04T11:20:00Z",
    location: "Brooklyn, NY",
  },
];

export const storeLayout = {
  entrance: ["Fruits", "Vegetables"],
  aisle1: ["Bakery", "Dairy"],
  aisle2: ["Beverages", "Snacks"],
  rear: ["Baby Care", "Household"],
};

export const caseStudies = `
1. Beer and Diapers: A US supermarket chain discovered that men who bought diapers on Friday nights also tended to buy beer. By placing beer next to the diaper aisle, sales for both products increased significantly.
2. Rotisserie Chicken and Wine: A grocery store placed a selection of red wines near their popular rotisserie chickens, leading to a 30% increase in wine sales from that display.
3. Supermarket Checkout: Placing candy, magazines, and cold sodas at checkout lanes capitalizes on impulse buys while customers are waiting in line.
`;

export const productList = [...new Set(salesData.map(item => item.product_name))];

export const frequentlyPurchasedTogether = [
    ["Organic Bananas", "Whole Milk"],
    ["Craft Beer 6-Pack", "Diapers Size 4"],
    ["Sourdough Bread", "Avocado"]
]
