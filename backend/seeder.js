const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Products = require('./models/Products');
const Users = require('./models/Users');
const products = require('./data/product');
const Cart = require('./models/Cart');


dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seed = async ()=>{
    try {
        await Products.deleteMany();
        await Users.deleteMany();
        await Cart.deleteMany();
        const createUser = await Users.create({
            username: 'Anmol Arora',
            email: 'anmolarora00012@gmail.com',
            password: '123456',
            role: 'admin'
        })
        // Assign the default user id to each product
        const userId = createUser._id;
        const sampleProducts = products.map(product =>{
            return { ...product, user: userId}
        })
        //Insert products in DB
        await Products.insertMany(sampleProducts);
        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error in sedding data', error)
        process.exit(1);
    }
}

seed();