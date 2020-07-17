const dynamojs = require('../core/dynamodb')
const DynamoSchema = require('../core/utils/schema')
const { v4: uuidv4 } = require('uuid');
const Image = require('../core/model/FieldsType/Image')
const postSchema = new DynamoSchema(
    {

        post_id: {
            type: String,
            required: [true],
            main: true,
            default: () => uuidv4()
        },
        cover: {
            type: String,
            keepValue: false,
            customType: Image,
            beforeSave: (arg) => Image.save("uploads/"+arg),
            required: [true, 'Please provide a cover image for your post'],
        },
        name: {
            type: String,
            required: [true, 'Please fill the name']
        },
        details: {
            type: Object,
            required: [false],

        },
        description: {
            type: String,
            required: [true, 'Please fill the description'],
            minLength: 6,

        },
        active: {
            type: Boolean,
            default: () => true,
            required: [true]
    }
    }

)

const PostModel = dynamojs.Model('posts', postSchema)

module.exports = PostModel;