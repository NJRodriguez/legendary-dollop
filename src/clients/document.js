const db = require('../wrappers/dynamodb.js')
const glob = require('glob')
let documents = {};
const path = require('path');
const errors = require('../errors/documents.js')

// Load every document!
const filelist = glob.sync( './src/documents/*.js' );

// Dynamically require every document and add to documents object
filelist.forEach( function( file ) {
    let slicedPath = `../${file.slice(6)}`;
    let filename = path.basename(file, '.js').toUpperCase();
    documents = {...documents, [filename]: require(slicedPath)};
});

class Document {
    constructor(document) {
        this.validate(document);
        this._document = new documents[document.type.toUpperCase()].Model(document);
        this._db = new db({tableName: documents[document.type.toUpperCase()].tableName})
    }

    validate(document) {
        if (!document.type) { throw new errors.TypeError("Missing document type!") };
        if (!documents[document.type.toUpperCase()]) {
            const TYPES = [];
            Object.values(documents).forEach(doc => TYPES.push(doc.TYPE));
            throw new errors.InvalidTypeError(`The type (${document.type}) should be one of ${TYPES}.`) 
        };
    }

    async create() {
        // Validate document and create
        this._document.validate();
        await this._db.create(this._document);
    }
}

async function GetDocument(id, type) {
    let temp_db = new db({tableName: documents[type.toUpperCase()].tableName})
    return await temp_db.get("id", id.toLowerCase());
}

async function GetDocumentsWithScan(type, filterExpression, expressionAttributeNames, expressionAttributeValues, projectionExpression) {
    let temp_db = new db({tableName: documents[type.toUpperCase()].tableName})
    return await temp_db.scan(filterExpression, expressionAttributeNames, expressionAttributeValues, projectionExpression);
}

module.exports = {Document, GetDocument, GetDocumentsWithScan}