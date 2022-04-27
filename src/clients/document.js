const db = require("../wrappers/dynamodb.js")
const glob = require('glob')
let documents = {};
const path = require("path");

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
        this._document = new documents[document.type].Model(document);
        this._db = new db({tableName: documents[document.type].tableName})
    }

    validate(document) {
        if (!document.type) {
            throw new Error("Missing document type!");
        }
    }

    async create() {
        // Validate document and create
        this._document.validate();
        await this._db.create(this._document);
    }

    async update() {
        // Validate and update document
        this._document.validate();
        await this._db.update(this._document);
    }

    async delete() {
        // Delete document by id
    }
}

async function GetDocument(id, type) {
    let temp_db = new db({tableName: documents[type.toUpperCase()].tableName})
    return await temp_db.get("id", id.toLowerCase());
}

module.exports = {Document, GetDocument}