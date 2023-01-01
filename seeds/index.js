const cities  = require('./cities')
const {places,descriptors} = require('./seedHelper')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelpcamp');//connext to the database 

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};
const Campground = require('../models/campground')

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDB = async () =>
{
  await Campground.deleteMany({});
  for(let i =0;i<50;i++){
    const random1000 = Math.floor(Math.random()*1000);
    const priceRandom = Math.floor(Math.random()*40 + 10)
    const  camp = new Campground({
      author: '63a727d8419d3e1cbae94fbd',
      location : `${cities[random1000].city},${cities[random1000].state}`,
      title : `${sample(descriptors)} ${sample(places)} `,
      image : 'https://source.unsplash.com/collection/483251',
     description : "A great place free from any outdoor noises and gives a refreshing feel of the nature",
      price : priceRandom,
      images: [
        {
            url: 'https://res.cloudinary.com/duy3iyaed/image/upload/v1671979385/YelpCamp/koushik-chowdavarapu-JT8IWAaxpQk-unsplash_axmste.jpg',
            filename: 'YelpCamp/koushik-chowdavarapu-JT8IWAaxpQk-unsplash_axmste'
        },
        {
            url: 'https://res.cloudinary.com/duy3iyaed/image/upload/v1671979365/YelpCamp/jared-erondu-LoMs1_wq3tU-unsplash_txas2s.jpg',
            filename: 'YelpCamp/jared-erondu-LoMs1_wq3tU-unsplash_txas2s'
        }
    ]
    })
    await camp.save()
  }
 
}

seedDB().
then(()=>{mongoose.connection.close();
})
  