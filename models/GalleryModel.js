const dynamojs = require('../core/dynamodb')
const DynamoSchema = require('../core/utils/schema')
const { v4: uuidv4 } = require('uuid');
const Image = require('../core/model/FieldsType/Image')
const PostModel = require('./PostModel')

const gallerySchema = new DynamoSchema(
    {
        
        id: {
            type: String,
            required: [true],
            main: true,
            default: () => uuidv4()
        },

        post_id: {
            type: String,
            required: [true],
            relatedObject: PostModel
        },

        file_name: {
            type: String,
            keepValue: false,
            customType: Image,
            beforeSave: (arg) => Image.save("uploads/"+arg),
            required: [true, 'file cant be empty'],
        },
       
    }

)

const GalleryModel = dynamojs.Model('gallery', gallerySchema)

module.exports = GalleryModel;