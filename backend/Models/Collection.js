const mongoose = require("mongoose");

const collectionShcema = new mongoose.Schema({
    public_id : {
        type : String,
        required : true
    },
    secure_url : {
        type : String,
        required : true
    },
    width : {
        type : Number,
        required : true,
    },
    height : {
        type : Number,
        required : true
    }
})

const userSchema = new mongoose.Schema({
    _id : {
      type : String,
      required : true
    },
    collection : {
        type : [collectionShcema] ,
        default : []
    }
})

const Collection = mongoose.models.Collection || mongoose.model("Collection" , userSchema);

module.exports = Collection