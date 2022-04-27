const tableName = 'shipment_table';
const codeRegex = new RegExp('^[A-Z]{3}');
const errors = require('../errors/documents.js');

class Shipment {
    constructor({referenceId, code, organizations, transportPacks, estimatedTimeArrival}) {
        this.id = referenceId;
        this.organizations = organizations;
        this.transportPacks = transportPacks;
        this.estimatedTimeArrival = estimatedTimeArrival;
        this.validate();
    }

    validate() {
        // Validate referenceid, code, organizations, etc....
        if (!this.id.startsWith("S") || this.id.length != 9) { throw new errors.IdError(`The ID (${this.id} is an invalid ID.)`) };
        this.organizations.forEach(organization => { if (!codeRegex.test(organization)) { throw new errors.CodeError(`The organization code (${organization}) is an invalid code.`)}});
        if (!this.transportPacks.nodes) { throw new errors.MissingNodesError('The "transportPacks" value is missing array "nodes".')};
        if (this.estimatedTimeArrival) {
            if (!((new Date(this.estimatedTimeArrival)).getTime() > 0)) { throw new errors.InvalidTimeError(`The timestamp ${this.estimatedTimeArrival} is an invalid timestamp.`)};
        }
        return;
    }
}

module.exports = { Model: Shipment, tableName };