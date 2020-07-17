const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.Query.delete(req.params.id);

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(204).json({
            status: 'success',
            data: doc
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOne = Model => async (req, res, next) => {
    try {


        if(req.files){


            req.files.reduce(function (r, a) {
                let filename = a.key ? a.key : a.filename
                if(!req.body[a.fieldname]){
                    req.body[a.fieldname] = filename
                } else {
                    if(Array.isArray(req.body[a.fieldname])){
                        req.body[a.fieldname].push(filename)
                     } else {
                        req.body[a.fieldname] = [req.body[a.fieldname], filename]
                     }

                }

               

                
                return r;
            }, Object.create(null));
        


        }


        await Model.beforeSave(req.body, 'isValidUpdate')
        const doc = await Model.Query.update(req.params.id, req.body);

        Model.afterSave()

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.createOne = Model => async (req, res, next) => {
    try {
   
        if(req.files){


            req.files.reduce(function (r, a) {
                let filename = a.key ? a.key : a.filename
                if(!req.body[a.fieldname]){
                    req.body[a.fieldname] = filename
                } else {
                    if(Array.isArray(req.body[a.fieldname])){
                        req.body[a.fieldname].push(filename)
                     } else {
                        req.body[a.fieldname] = [req.body[a.fieldname], filename]
                     }

                }

               

                
                return r;
            }, Object.create(null));
        


        }


        await Model.beforeSave(req.body)
        const doc = await Model.Query.create(req.body);

        Model.afterSave()

        res.status(201).json({
            status: 'success',
            data: {
                ...doc
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.Query.get(req.params.id);
        
        if(Object.keys(doc).length !== 0 && Model.relatedObjects){
            for (let relatedObject of Model.relatedObjects){
                
                let obj = relatedObject[Object.keys(relatedObject)[0]]
                doc[obj.table] = await obj.Query.getRelated({[Model.schema.mainKey()] : req.params.id})
            
            }
        }

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getAll = Model => async (req, res, next) => {
    try {
        let data = []
        if(req.query.after){
            data = await new APIFeatures(Model.Query, req.query)
                   .paginateDynamoDb();
        } else {
            data = await Model.Query.all();
        }

        res.status(200).json({
            status: 'success',
            results: data.length,
            data: {
                data: data
            }
        });

    } catch (error) {
        next(error);
    }

};