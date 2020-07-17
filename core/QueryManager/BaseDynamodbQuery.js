const db = require('../db').Get();
const  { ScanPaginator } =  require('@aws/dynamodb-query-iterator');
const dynamoQueryUtilities = require('../utils/dynamoUtilities')

class QueryManager {
    table = null
    params = {}
    schema = null
    result = null
    db_ = null
    
    constructor(table, schema){
        this.table = table;
        this.schema = schema;
        this.setDb()
    }

    async setDb(){
        this.db_ = await db
    }

    async update(id, kwargs){
        // TODO DYNAMODB UPDATE

        if(!this.schema.isValidUpdate()){
            return this.schema.errors
        }

        let update_expresions = dynamoQueryUtilities.updateExpresion(kwargs)
        this.params = { 
            TableName: this.table,
            Key:{
                [this.schema.mainKey()] :  id
             },
             UpdateExpression:update_expresions['update_expresion_string'],
             ExpressionAttributeValues:{
                 ...update_expresions['attributes_values']
             },
             ExpressionAttributeNames:{
                ...update_expresions['attributes_names']
              },
             ReturnValues:"UPDATED_NEW"
        }

        return await this.db_.update(this.params, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data);
            }
          }).promise();

    }

    async delete(id){
        // TODO DYNAMODB DELETE
        this.params = {
            TableName: this.table,
            Key: {
                [this.schema.mainKey()] : id
            }
          };


          return await this.db_.delete(this.params, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data);
            }
          }).promise();

    }

    async create(kwargs){
        let data = {}
        let table = this.table
        let relatedSchemas = this.schema.relatedSchemas
       
        // if kwargs is empty we already know that there are errors from the beforeSave Validation
        if(Object.keys(kwargs).length == 0){
            return this.schema.errors
        }

        // We use a recursive function so if the kwargs are from the client or from the recursion it validates what should be done
        // if kwargs has sanitizedData property it means this function is trigger by the recursion
        if(Object.keys(kwargs)[0] && !kwargs[Object.keys(kwargs)[0]].hasOwnProperty('sanitizedData')){
        // We check again validation because depending on the function you add to the beforesave schema attribute it could have changed the data
            if(!this.schema.isValid()){
                return this.schema.errors
            }

            data = this.schema.sanitizedData

        } else {
            // we get the table name from the kwargs because in the recursion we recibe the fields nested with the table name
            table = Object.keys(kwargs)[0]

            // we set the related schemas of the current relatedObject in the recursion
            relatedSchemas = kwargs[table].relatedSchemas


           // the first validate run all the validation including the relateds one, to avoid saving data if at least one of the relatedObjects fails to validate
           // so we can set sanitizedData without calling is valid again
            data = kwargs[table].sanitizedData


        }


        this.params = {
            TableName: table,
            Item: data
          };


         await this.db_
             .put(this.params, (err, data)  => {
                if (err) {
                  console.log("Error", err);
                  return err
                } else {
                  console.log("Success", this.params);
                  return kwargs
                }
              }).promise();

              

              for (let schema of relatedSchemas){
                  let key = Object.keys(schema)
                  if(schema && key.length != 0 && Object.keys(schema[key].sanitizedData).length != 0){
                    await this.create(schema)

                  }
              }
        
         
          return kwargs

    }

    async get(id){

        var params = {
            TableName: this.table,
            Key: {
                [this.schema.mainKey()] :  id
            },
          };
                    // Call DynamoDB to read the item from the table

        
        return this.db_.get(params, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data.Item);
              return data.Item
            }
        }).promise()
        
       



    }

    async all(params = {}){

        this.result = []
        this.params = {
            TableName: this.table,
            ReturnConsumedCapacity: 'INDEXES',
            Limit: 10,
            ...params
        }


        const paginator = new ScanPaginator(
            this.db_,
            this.params
        );
         
        
        for await (const page of paginator) {
            // do something with `page`
            return page
        }
         
        // // Inspect the total number of items yielded
        // console.log(paginator.count);
         
        // // Inspect the total number of items scanned by this operation
        // console.log(paginator.scannedCount);
         
        // // Inspect the capacity consumed by this operation 
        // // This will only be available if `ReturnConsumedCapacity` was set on the input
        // console.log(paginator.consumedCapacity);
        
        return this.result
      
    }

    async getRelated(kwargs){
        // this function is trigered when we request the detail of a object and that object has related objects


        let filter_expression = dynamoQueryUtilities.filterExpression(kwargs)
        this.params = {
        TableName : this.table,
        "IndexName": Object.keys(kwargs)[0],
        KeyConditionExpression: filter_expression['condition_expression'],
        ExpressionAttributeNames:{
            ...filter_expression['attributes_names']
        },
        ExpressionAttributeValues: {
            ...filter_expression['attributes_values']
        }

        };




        return await this.db_.query(this.params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log("Query succeeded.");

            }
        }).promise();

 }

    





}


module.exports  = QueryManager;