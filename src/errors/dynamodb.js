const InputError = require('./documents.js').InputError;

class DynamoDbError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    } 
}

class MissingTableError extends DynamoDbError {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
         Error.captureStackTrace(this, this.constructor);
    }
}

class ItemNotFoundError extends InputError {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
         Error.captureStackTrace(this, this.constructor);
    }
}

class ItemExistsError extends InputError {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
         Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {DynamoDbError, MissingTableError, ItemExistsError, ItemNotFoundError}