const mongoose = require('mongoose')
const Review = require('./review')

const Schema = mongoose.Schema;
const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new Schema({//add properties to campgrounds schema
  title : String,
  images : [ImageSchema],
   price : Number,
  description : String,
  location : String,
  //store the author id that created the campground
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
},
  //it act as referencde  to review model and  we wil have one to many relation with review Model
  reviews: [
    {
      type : Schema.Types.ObjectId,
      ref : "Review"
    }
  ]
});

campgroundSchema.post('findOneAndDelete',async function(doc){//delete the reviews if anytime we delete the entire campground
  if(doc){
    await Review.deleteMany({
      _id : { 
        $in : doc.reviews
           }
    })
  }

})

module.exports = mongoose.model("Campgrounds",campgroundSchema);