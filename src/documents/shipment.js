const tableName = "shipment_table";

class Shipment {
    constructor({referenceId, code, organizations, transportPacks, estimatedTimeArrival}) {
        this.id = referenceId
        this.code = code
        this.organizations = organizations
        this.transportPacks = transportPacks
        this.estimatedTimeArrival = estimatedTimeArrival
        this.validate();
    }

    validate() {
        // Validate referenceid, code, organizations, etc....
        return;
    }
}

module.exports = { Model: Shipment, tableName };