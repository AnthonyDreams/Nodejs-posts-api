const AWS = require('./aws');


var DbConnection = function () {

    var db = null;
    var instance = 0;

    async function DbConnect() {
        try {
            let _db = await new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

            return _db
        } catch (e) {
            return e;
        }
    }

   async function Get() {
        try {
            instance++;    
            console.log(`DbConnection called ${instance} times`);

            if (db != null) {
                console.log(`db connection is already alive`);
                return db;
            } else {
                console.log(`getting new db connection`);
                db = await DbConnect();
                return db; 
            }
        } catch (e) {
            return e;
        }
    }

    return {
        Get: Get
    }
}


module.exports = DbConnection();
