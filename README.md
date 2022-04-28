## Setup

### Dependencies

This app was built with Node.js 15, but it should work with most modern versions of Node.js. If
you run into any hiccups start by making sure you're on Node 15. We encourage the use of a tool
like [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage multiple versions and
make sure you're running the correct one.

To install dependencies:

```
npm install
```

This app requires AWS infrastructure be created beforehand. There is a CloudFormation templated located at "src/scripts/cloudformation.yaml". This template will create two tables used to persist data on the cloud. Additionally, a .env file is required to be added for the AWS-SDK to function correctly. The .env file is of the following format:

```
AWS_ACCESS_KEY_ID =
AWS_SECRET_ACCESS_KEY =
AWS_DEFAULT_REGION =
```

Please create the .env file on the root directory and configure with the necessary values.

To start the development server:

```
npm run start
```

To run the test script:

```
npm run send
```


