exports.isEmpty = function (x, key=null)
{



    if(typeof x == "boolean"){
        return x
    } else if (typeof x == "object"){
        if(Array.isArray(x)){
            return x.length == 0
        }
        return Object.keys(x).length == 0
    } 

    return (
        (typeof x == 'undefined')
                    ||
        (x == null)
                    ||
        (x == false)  //same as: !x
                    ||
        (x.length == 0)
                    ||
        (x == "")
                    ||
        (x.replace(/\s/g,"") == "")
                    ||
        (!/[^\s]/.test(x))
                    ||
        (/^\s*$/.test(x))
    );
}


// if(!schemaField.hasOwnProperty('value') && schemaField.hasOwnProperty('default')){
//     self.setToSanitized(key, schemaField.default())
// }
// else if(schemaField.hasOwnProperty('value') && self.isEmpty(schemaField.value) && schemaField.hasOwnProperty('default')){
//     self.setToSanitized(key, schemaField.default())
// }

exports.requiredFieldsValidation = function(schemaField,key,  self){
    if(schemaField.hasOwnProperty('required') && schemaField.required[0]){
        if(this.isEmpty(schemaField.value, key) && schemaField.hasOwnProperty('default')){
            self.setToSanitized(key, schemaField.default())
        }
        else if(this.isEmpty(schemaField.value) && !schemaField.hasOwnProperty('default'))  {
            self.setErrors(key,  schemaField.required[1] ? schemaField.required[1] : "This Field is required")
        }
    }
}


exports.fieldsTypeValidation = function(schemaField,key,  self){
    // console.log(!(schemaField.value.constructor == schemaField.type), key, schemaField.value.constructor, schemaField.value)
    if(!(schemaField.value.constructor == schemaField.type)){
         self.setErrors(key, `This Field is not a ${new schemaField.type().constructor.name} type`)
    }

}



