const validator = require('./validators')
const AppError = require('../../utils/appError');
class DynamoSchema {
    schema = null
    errors = []
    sanitizedData = {}
    relatedSanitizedData = {}
    relatedSchemas = []

    constructor(schema){
        this.schema = schema
    }

    mainKey(){
        let key_ = null
        Object.keys(this.schema).forEach((key)=> {

            if(this.schema[key].main){
                key_ =  key
                return false;
            }
            
        })

        return key_
    }

     sanitizeWithForm(form){
        this.errors = []

        // this is used to add the default value to the mainKey field of the current model if it doesnot exists

        if(!this.sanitizedData[this.mainKey()]){
            this.setToSanitized(this.mainKey(), this.schema[this.mainKey()].default())

        }

        Object.entries(form).forEach(([k, v]) => {
            try{
                this.setToSanitized(k,v)
              

            } catch(e){
                this.errors.push({[k]: 'this field does not exists'})
            }
        });

        return this 
    }

    isRelatedField(key, value){

        // if key is an array it means that was send like e.g post.gallery so we try to convert that array of key in a nested object 

        if(Array.isArray(key)){
            this.relatedSanitizedData = {}
            key.reduce(function(o, s, currentIndex) { return o[s] = key.length == currentIndex +1 ? value : {}; }, this.relatedSanitizedData)
            key = key[0]
        }


        
        if(this.relatedSchemas.find(obj => obj[key])){
            return true
        }

        return false
    }

     setToSanitized(k, v){
        this.relatedSanitizedData = null
        const isPostmanKey = k.split('.').length > 1
        k = isPostmanKey ? k.split('.') : k

        
        if(this.isRelatedField(k, v)){

            let related_schema = this.relatedSchemas.find(schema => schema[isPostmanKey ? k[0]: k])[isPostmanKey ? k[0]: k]
            if(isPostmanKey){
                this.relatedSanitizedData[k[0]][this.mainKey()] = this.sanitizedData[this.mainKey()]
            } else {
                v[this.mainKey()] = this.sanitizedData[this.mainKey()]

            }
            if(!related_schema.sanitizeWithForm(this.relatedSanitizedData? this.relatedSanitizedData[k[0]] : v).isValid()){
                this.errors.push(related_schema.errors)
            } 
            
        

            return;
        }


     
        this.schema[k]['value'] = v;
        this.sanitizedData[k] = v

    }

    getFromSchema(attrs=[]){
        // if you want to get specific attributes from the schemas fields
        let obj = {}
        return Object.keys(this.schema).map(key => {
            obj[key] ={}
            
            for (let attr of attrs){
                obj[key][attr] = this.schema[key][attr]
            }
            return obj
        })

    }

      isValid(){


         Object.keys(this.schema).forEach((key) => {
            let schemaField = this.schema[key];   
            validator.requiredFieldsValidation(schemaField, key, this)
            if(schemaField.value){

            validator.fieldsTypeValidation(schemaField, key,  this)
         }

     });





        return this.errors.length == 0
    }

   

    isValidUpdate(){
        if(this.sanitizedData[this.mainKey()]){
            delete this.sanitizedData[this.mainKey()]
        }

        Object.keys(this.schema).forEach((key) => {
            let schemaField = this.schema[key];
            
            if(schemaField.required && schemaField.required[0]){
               if((schemaField.hasOwnProperty('value') && validator.isEmpty(schemaField.value)) || Object.keys(this.sanitizedData).length == 0) {
                   this.setErrors(key, schemaField.required[1] ? schemaField.required[1] : "This Field is required" )
                }
            }

        });


        return this.errors.length == 0
    }

    setErrors(key, error){
        const index = this.errors.findIndex(err => err[key])
        if(index != -1){
            this.errors[index][key] = error
        } else {
            this.errors.push({[key]: error})
        }
    }
}


module.exports = DynamoSchema;