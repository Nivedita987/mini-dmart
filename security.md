# Security Considerations

## Authentication
- **JWT:** Secure user sessions are handled via JSON Web Tokens stored in `localStorage`.
- **Bcrypt:** User passwords are never stored in plain text; they are hashed using a salt factor of 10 before saving to MongoDB.

## Authorization
- **Middleware:** A custom `protect` middleware verifies the JWT for all private routes.
- **Role-Based Access:** The `authorizeRoles` middleware ensures that only authorized users (e.g., ADMIN) can access sensitive endpoints like User Management or Inventory Control.

## Data Integrity
- **Input Validation:** Backend validation ensures no negative prices or stock quantities.
- **Ownership Check:** Customers can only view or cancel orders associated with their unique User ID.
