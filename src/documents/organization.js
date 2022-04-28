const tableName = 'organization_table';
const idRegex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i');
const codeRegex = new RegExp('^[A-Z]{3}');
const errors = require('../errors/documents.js');
const TYPE = "ORGANIZATION";

class Organization {
    constructor({id ,code, type}) {
        this.id = id;
        this.code = code;
        this.type = type;
        this.validate();
    }

    validate(){
        // Validate type, id and code
        if (this.type != TYPE) { throw new errors.InvalidTypeError(`The type (${this.type}) should be ${TYPE}.`)}
        if (!idRegex.test(this.id)) { throw new errors.IdError(`The ID (${this.id}) is an invalid ID.`) };
        if (this.code) {
            if (!codeRegex.test(this.code)) { throw new errors.CodeError(`The code (${this.code}) is an invalid code.`) };
        }
        return;
    }

}

module.exports = { Model: Organization, tableName, TYPE };