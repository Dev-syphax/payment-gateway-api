# Payment Gateway API (Node.js + PostgreSQL)
This project is a simple Payment Gateway API built using Node.js and PostgreSQL. It provides endpoints for processing payments, managing transactions, and handling refunds.

## Features
- Clean Controller / Service / Repository architecture
- PostgreSQL with transaction management
- Payment state machine (PENDING, SUCCESS, FAILED, REFUNDED)
- Idempotent payment creation via reference
- Comprehensive error handling

## Architecture Overview
The architecture of the Payment Gateway API is divided into three main layers: Controller, Service, and Repository. Each layer has specific responsibilities to ensure a clean separation of concerns.
```
Controller
│
├── PaymentController (handles HTTP requests)
│   ├── createPayment()
│   ├── getPayment()
│   └── refundPayment()
│
├── TransactionController (handles transaction-related requests)
│   ├── getTransaction()
│   └── listTransactions()
│
└── RefundController (handles refund-related requests)
    └── processRefund()

Service Layer
│
├── PaymentService (orchestrates payment processing)
│   ├── createPayment()
│   ├── processPayment()
│   └── handleRefund()
│
├── TransactionService (manages transaction lifecycle)
│   ├── createTransaction()
│   └── updateTransactionStatus()
│
└── RefundService (handles refund operations)
    └── processRefund()

Repository Layer
│
├── PaymentRepository (interacts with PostgreSQL for payments)
├── TransactionRepository (interacts with PostgreSQL for transactions)
└── RefundRepository (interacts with PostgreSQL for refunds)

Database Schema (See `db/schema.sql` ):

┌────────────────┬───────────────┬────────────────────────┐
| Column         | Type          | Description            |
├────────────────┼───────────────┼────────────────────────┤
| id             | UUID          | Primary Key            |
| amount         | NUMERIC       | Amount of the payment  |
| currency       | VARCHAR(3)    | ISO Currency           |
| status         | VARCHAR(20)   | Payment state          |
| payment_method | VARCHAR(50)   | CARD, WALLET, etc.     |
| provider       | VARCHAR(50)   | MONK, STRIPE, etc.     |
| reference      | VARCHAR(100)  | Indempotency key       |
| created_at     | TIMESTAMP     | Creation timestamp     |
| updated_at     | TIMESTAMP     | Last update            |
└────────────────┴───────────────┴────────────────────────┘
```

## Getting Started 
### 1. Clone the repository
```bash
git clone https://github.com/your-username/payment-gateway-api.git
cd payment-gateway-api
```
### 2. Install dependencies
```bash
npm install
```
### 3. Set up PostgreSQL
Make sure you have PostgreSQL installed and running. Create a database for the project.
```sql
CREATE DATABASE payment_gateway;
```
Run the SQL script in `db/schema.sql` to create the necessary tables.
### 4. Configure environment variables
Create a `.env` file in the root directory and add the following variables:
```bash
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=payment_gateway
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```
### 5. Start the server
```bash
npm run start
```
The server will start on the port specified in the `.env` file (default is 3000).

## API Endpoints
- `POST /api/payments` - Create a new payment
- `GET /api/payments/:id` - Retrieve payment details
- `POST /api/payments/:id/refund` - Process a refund for a payment
- `POST /api/payments/:id` - Confirm payment 
- `GET /api/payments/:id/events` - Get payment events

## Payment State Rules
```
┌───────────────┬─────────────────────┐
|current_state  | allowed transitions |
├───────────────┼─────────────────────┤
|PENDING        | SUCCESS, FAILED,    |
|SUCCESS        | REFUNDED            |
|FAILED         | NONE                |
|REFUNDED       | NONE                |
└───────────────┴─────────────────────┘
```
## Future Improvements
- Real payment provider integrations (e.g., Stripe, PayPal)
- Integration tests
- Docker support
## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Adding new features, fixing bugs are all appreciated.