
**Task**: Create a customer service agent specializing in helping customers with refunds.

## Required business steps
1.  Verify identity with `Verify_Customer(email)`
2.  Fetch the invoice with `Find_Order(order_id)` 
3.  Issue the refund after verification with `Issue_Return(order_id)`
4.  Reply to the customer with `Send_Reply(text)` 


## The "tools" to build for the agent

Create these platform Apex actions like `Verify_Customer` or `Issue_Return` as invocable actions. 

| Invocable Actions                | What we'll do here                  |
| -------------------------------- | ----------------------------------- |
| `Verify_Customer(email)`         | method to verify any email ending in "salesforce.com" as valid  |
| `Find_Order(order_id)`           | return a mock order for order_id with synthetic data    |
| `Issue_Return(order_id)`         | mock return a JSON set of mock data as confirmation |
| `Send_Reply(text)`               | create a helpful reply with return data  |

## Mock data

```text
Customers:
   amy@salesforce.com -> cust_100
   sam@salesforce.com -> cust_200

Order Invoices:
   INV-1007 -> cust_100, paid, $129.00, refundable_until 2026-06-01
   INV-0991 -> cust_200, paid, $49.00, refundable_until 2026-04-01
```

