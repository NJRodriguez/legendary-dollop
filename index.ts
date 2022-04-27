require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const documentClient = require('./src/clients/document.js');
const dynamodbErrors = require('./src/errors/dynamodb.js');
const inputErrors = require('./src/errors/documents.js');

const app = express()
app.use(bodyParser.json());
const port = 3000

app.post('/shipment', async (req: any, res: any) => {
  try {
    const shipment = new documentClient.Document(req.body);
    await shipment.create();
    res.send({statusCode:200});
  } catch (error) {
    if (error instanceof dynamodbErrors.DynamoDbError) {
      res.send({statusCode:500, errorType: error.name, message: error.message});
    } else if (error instanceof inputErrors.InputError) {
      res.send({statusCode:400, errorType: error.name, message: error.message});
    } else res.send({statusCode:500, message: error.message});
  }
})

app.post('/organization', async (req: any, res: any) => {
  try {
    const organization = new documentClient.Document(req.body);
    await organization.create();
    res.send({statusCode:200});
  } catch (error) {
    if (error instanceof dynamodbErrors.DynamoDbError) {
      res.send({statusCode:500, errorType: error.name, message: error.message});
    } else if (error instanceof inputErrors.InputError) {
      res.send({statusCode:400, errorType: error.name, message: error.message});
    } else res.send({statusCode:500, message: error.message});
  }
})

app.get('/shipments/:shipmentId', async (req: any, res: any) => {
  try {
    const shipment = await documentClient.GetDocument(req.params.shipmentId, "SHIPMENT");
    res.send({statusCode:200, result: shipment});
  } catch (error) {
    if (error instanceof dynamodbErrors.DynamoDbError) {
      res.send({statusCode:500, errorType: error.name, message: error.message});
    } else if (error instanceof inputErrors.InputError) {
      res.send({statusCode:400, errorType: error.name, message: error.message});
    } else res.send({statusCode:500, message: error.message});
  }
})

app.get('/organizations/:organizationId', async (req: any, res: any) => {
  try {
    const organization = await documentClient.GetDocument(req.params.organizationId, "ORGANIZATION");
    res.send({statusCode:200, result: organization});
  } catch (error) {
    if (error instanceof dynamodbErrors.DynamoDbError) {
      res.send({statusCode:500, errorType: error.name, message: error.message});
    } else if (error instanceof inputErrors.InputError) {
      res.send({statusCode:400, errorType: error.name, message: error.message});
    } else res.send({statusCode:500, message: error.message});
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
