const tableName = "organization_table";

class Organization {
    constructor({id ,code}) {
        this.id = id
        this.code = code
        this.validate();
    }

    validate(){
        // Validate id and code
        return;
    }

}

module.exports = { Model: Organization, tableName };