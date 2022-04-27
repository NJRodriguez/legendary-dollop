require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const documentClient = require("./src/clients/document.js")

const app = express()
app.use(bodyParser.json());
const port = 3000

app.post('/shipment', async (req: any, res: any) => {
  console.log("I posteded!");
  const shipment = new documentClient.Document(req.body);
  await shipment.create();
  res.send({statusCode:200});
})

app.post('/organization', (req: any, res: any) => {
})

app.get('/shipments/:shipmentId', async (req: any, res: any) => {
  const shipment = await documentClient.GetDocument(req.params.shipmentId, "SHIPMENT")
  res.send({statusCode:200, result: shipment})
})

app.get('/organizations/:organizationId', (req: any, res: any) => {
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
