const DynamoDbModel = require('./model/DynamodbModel')

module.exports = {
    Model : (table, schema) => {
        return new DynamoDbModel(table, schema)
    }
}