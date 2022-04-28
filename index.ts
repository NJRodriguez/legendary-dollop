require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const documentClient = require('./src/clients/document.js');
const convert = require('./src/wrappers/convertUnits.js');
const responses = require('./src/endpoints/responses.js');

const app = express()
app.use(bodyParser.json());
const port = 3000

app.post('/shipment', async (req: any, res: any) => {
  try {
    const shipment = new documentClient.Document(req.body);
    await shipment.create();
    res.send(responses.CreatedResponse());
  } catch (error) {
    res.send(responses.ErrorResponse(error));
  }
})

app.post('/organization', async (req: any, res: any) => {
  try {
    const organization = new documentClient.Document(req.body);
    await organization.create();
    res.send(responses.CreatedResponse());
  } catch (error) {
    res.send(responses.ErrorResponse(error));
  }
})

app.get('/shipments/:shipmentId', async (req: any, res: any) => {
  try {
    const shipment = await documentClient.GetDocument(req.params.shipmentId, "SHIPMENT");
    res.send(responses.OkResponse(shipment));
  } catch (error) {
    res.send(responses.ErrorResponse(error));
  }
})

app.get('/organizations/:organizationId', async (req: any, res: any) => {
  try {
    const organization = await documentClient.GetDocument(req.params.organizationId, 'ORGANIZATION');
    res.send(responses.OkResponse(organization));
  } catch (error) {
    res.send(responses.ErrorResponse(error));
  }
})

app.get('/shipments/aggregate/:unit', async (req: any, res: any) => { // This should definitely be tidied up later.
  try {
    if (!convert.VALID_UNITS[req.params.unit]) {
      res.send({statusCode:400, message: `The unit type is invalid. Accepted unit types are ${Object.keys(convert.VALID_UNITS)}.`});
    } else {
      const filterExpression = 'attribute_exists(#0.#1)';
      const expressionAttributeNames = {
        '#0' : 'transportPacks',
        '#1' : 'nodes'
      };
      const projectionExpression = "#0.#1";
      const shipments = await documentClient.GetDocumentsWithScan('SHIPMENT', filterExpression, expressionAttributeNames, null, projectionExpression);
      const totalWeights:any = [];
      shipments.forEach((shipment:any) => {
        shipment.transportPacks.nodes.forEach((node:any) => {
          totalWeights.push(node.totalWeight);
        })
      });
      const result = totalWeights.reduce((pv:any, cv:any) => {
        if (cv.unit !== req.params.unit) {
          console.log(pv);
          return convert.convertUnit(parseInt(cv.weight,10), cv.unit, req.params.unit) + pv;
        } else {
          console.log(pv);
          return parseInt(cv.weight,10) + pv;
        }
      }, 0)
      res.send(responses.OkResponse({ result: { value:result, unit: req.params.unit } }));
    }
  } catch (error) {
    res.send(responses.ErrorResponse(error));
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
