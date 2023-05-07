const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter product name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please enter product description"]
    },
    price:{
        type:Number,
        required:[true,"Please enter price"],
        maxLength:[8,"Price can't exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true, "Please enter product category"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter product stock"],
        default:1,
        maxLength:[4, "Stock can't exceed 4 characters"]
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.String,
                ref:"User",
                required:true,
            },
            image:{
                type:String,
                required:false
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:false
            }
        }
    ],
    user:{
        type:mongoose.Schema.Types.String,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
}) 

module.exports = mongoose.model("Product",productSchema);