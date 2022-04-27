const AWS = require('aws-sdk');
const errors = require('../errors/dynamodb.js');

AWS.config.update({
	region: process.env.AWS_DEFAULT_REGION,
});

class DatabaseClient {
    constructor({ tableName, region = process.env.AWS_DEFAULT_REGION }) {
        this._tableName = tableName;
        const service = new AWS.DynamoDB({maxRetries: 6})
        this._documentClient = new AWS.DynamoDB.DocumentClient({service, region})
    }

    async get(key, value) {
        try {
            const params = {
                TableName: this._tableName,
                Key: {
                    [key]: value,
                },
            };
    
            const rawDocument = await this._documentClient.get(params).promise();
    
            return rawDocument.Item;
        } catch (e) {
            console.error(e);
            if (e.code == "ResourceNotFoundException") {
                throw new errors.MissingTableError("The DynamoDB table you are trying to access has not been created.");
            }
            throw e;
        }
    }

    async create(document) {
		try {
			validateDocument(document);

			document.id = document.id.toLowerCase();
			const params = {
				TableName: this._tableName,
				Item: document,
				ConditionExpression: '#id <> :id',
				ExpressionAttributeNames: { '#id': 'id' },
				ExpressionAttributeValues: {
					':id': document.id,
				},
			};

			return await this._documentClient.put(params).promise();
		} catch (e) {
            console.error(e);
            if (e.code == "ResourceNotFoundException") {
                throw new errors.MissingTableError("The DynamoDB table you are trying to access has not been created.");
            }
            if (e.code == "ConditionalCheckFailedException") {
                throw new errors.ItemExistsError("The item you are trying to create already exists in the table.");
            }
			throw e;
		}
    }
    
    update(params) {
        try {
            return this._documentClient.update(params).promise();
        } catch (error) {
            console.error(e);
            if (e.code == "ResourceNotFoundException") {
                throw new errors.MissingTableError("The DynamoDB table you are trying to access has not been created.");
            }
			throw e;
        }
    }
    
}

function validateDocument(document) {
	if (!document || !document.id) {
		const e = new Error('The document is not well formed');
		throw e;
	}
}

module.exports = DatabaseClient;