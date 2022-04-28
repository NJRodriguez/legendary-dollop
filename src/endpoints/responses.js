const dynamodbErrors = require('../errors/dynamodb.js');
const inputErrors = require('../errors/documents.js');

function BadRequest(type, message) {
    return {statusCode:400, errorType:type, message};
}

function InternalServerError(type, message) {
    return {statusCode:500, errorType: type, message};
}

function ErrorResponse(error) {
    if (error instanceof dynamodbErrors.DynamoDbError) {
        return InternalServerError(error.name, error.message);
      } else if (error instanceof inputErrors.InputError) {
        return BadRequest(error.name, error.message);
      } else return {statusCode:500, message: error.message};
}

function OkResponse(result) {
    return {statusCode:200, result};
}

function CreatedResponse() {
    return {statusCode:201};
}

module.exports = {ErrorResponse, OkResponse, CreatedResponse};