
## Installation

1 . Go the Backend directory.
```bash
  cd path-to-backend
```

2 . Install dependencies
```bash
  npm i
```
3 .This project utilizes environment variables for configuration. You can customize the behavior of the system by creating the `.env` file in the current directory. Here are the available configuration options:

  ```bash
PORT=3000
SALT_ROUNDS=10
JWT_SECRET_KEY='thisisasecretkey'
API_VERSION=v1
DB_NAME='employee_leave_management_system'
DB_USERNAME: The username for connecting to the database.
DB_PASSWORD: The password for connecting to the database.
TOTP_STEP: The time step for TOTP (Time-based One-Time Password) generation. eg 120
TOTP_SECRET: The secret key for TOTP generation.
EMAIL_USER: The email address used for sending emails.
EMAIL_PASSWORD: The password for the email account.
EMAIL_PORT: The port number for the email server eg. 587
EMAIL_HOST: The hostname of the email server.
DEFAULT_MFA_OPTION: The default multi-factor authentication option eg. 'emailOtp'
TWILIO_ACCOUNT_SID: The Twilio account SID for sending SMS.
TWILIO_AUTH_TOKEN: The Twilio authentication token for sending SMS.

  ```

## Sample .env file

```bash
PORT=3000
SALT_ROUNDS=10
JWT_SECRET_KEY='thisisasecretkey'
API_VERSION=v1
DB_NAME='employee_leave_management_system'
DB_USERNAME='postgres'
DB_PASSWORD='postgres'
TOTP_STEP=120
TOTP_SECRET='KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD'
EMAIL_USER='mara7sfgs2@etfsgshereal.email'
EMAIL_PASSWORD='Tbssf23SG2FHsdfgyggGYBCee@z'
EMAIL_PORT=587
EMAIL_HOST='smtpadf.etherfasdgeal.emfresail'
DEFAULT_MFA_OPTION='emailOtp'
TWILLIO_ACCOUNT_SID = ACba63dagerg3297475ca2657f56c8df5b18927fasdggr@4fc46
TWILIO_AUTH_TOKEN = ff352fasef@90e2adsfa32f47f66f8ab1179edgsfa43dfe4ebfd1
```

4 . Run the project using the following command:
```bash
  npm run dev
```
      
