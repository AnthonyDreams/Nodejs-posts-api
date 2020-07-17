const QueryManager = require('../QueryManager/BaseDynamodbQuery')

class DynamoDbModel {
    
     table = '';
     schema = {}
     Query = null
     relatedObjects = []

     constructor(table, schema){
          this.table = table
          this.setSchema(schema)
          this.initRelatedObjects()
          this.setQueryManager()

     }

     setSchema(schema){
          this.schema = schema
     }


     setRelatedObject(related_name, Model){
          this.relatedObjects.push({[related_name]: Model})
          this.schema.relatedSchemas.push({[related_name] : Model.Schema()})
     }

     initRelatedObjects(){
          // This is used to emulate a foreignKey relation
          Object.keys(this.schema.schema).forEach(key => {
               let schemaField = this.schema.schema[key]
               if(schemaField.relatedObject){
                    schemaField.relatedObject.setRelatedObject(this.table, this)
               }
          })
     }

     Schema(){
          return this.schema
     }

     setQueryManager(table){
          this.Query = new QueryManager(this.table, this.schema)
     }

     // this function beforeSave and after Save need to be updated

     async beforeSave(values, action="isValid"){
          let valid = false
          if(this.schema.sanitizeWithForm(values)[action]()){
               valid = true;

               Object.keys(this.schema.schema).forEach(async (key) => {
                    let schemaField = this.schema.schema[key];
                    if(schemaField.hasOwnProperty('beforeSave')){
                         try {
                              if(schemaField.hasOwnProperty('filesName')){
                                   let newValue = schemaField.filesName
                                   values[key] = await schemaField.beforeSave(values[key], newValue)
                              } else {
                                   values[key] = await schemaField.beforeSave(values[key])
                              }

                              
                         } catch (error) {
                              this.schema.errors.push({[key]: error.message})
                         }

                    }
               })

     }

     return valid

     
     }


     afterSave(){
          Object.keys(this.schema.schema).forEach((key) => {
               let schemaField = this.schema.schema[key];
               if(schemaField.hasOwnProperty('afterSave')){
                    if(schemaField.hasOwnProperty('keepValue') && schemaField.hasOwnProperty('value') && !schemaField.keeValue){
                         let newValue = schemaField.default()
                         schemaField.afterSave(schemaField.value, newValue)
                         this.schema.setToSanitized(key, newValue)

                    }    
               }
          })
     
     }

     
//     Query(){
//          return this.queryManager
//     }
     

}

module.exports  =  DynamoDbModel;