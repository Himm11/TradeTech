//port on which our express server will be running
const port = 4000;

//Importing modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
//path module to get access to backend directories in express app
const path = require("path");
const cors = require("cors");


//IP ADRESS : 0.0.0.0/0 (Network Access)

//Whatever request we will get on browser, it will automatically be passed through json
//The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads 
app.use(express.json());

//Using this our express app will connect to 4000 port
app.use(cors());

// Database Connection With MongoDB
mongoose.connect("mongodb+srv://h602735:yoongi@cluster0.zduvbwo.mongodb.net/e-commerce");

//Image Storage Engine 
//multer is a node.js middleware for handling multipart/form-data , which is primarily used for uploading files
const st= multer.diskStorage({
    destination: './upload/images',
    //Generating file name
    filename: (req, file, cb) => {
      console.log(file);
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage: st})


//Whatever image we stores, will be stored in images folder
//Static endpoint where we can see the image
app.use('/images', express.static('upload/images'));

//To upload anything, we will use this endpoint
//'product' is field name
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:4000/images/${req.file.filename}`
    })
})


// Schema for creating Product
//Name of schema: Product
const Product = mongoose.model("Product", {
    //object to define product model
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number
    },
    date: {
      type: Date,
      default: Date.now,
    },
    avilable: {
      type: Boolean,
      default: true,
    },
  });
  
  
//Saving product to database
app.post("/addproduct", async (req, res) => {
    //Get all the products in one array(i.e., products)
    let products = await Product.find({});
    //to automatically generate id in the database
    let id;
    if (products.length>0) {
      //last product
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id+1;
    }
    else
    { //No prior product
      id = 1; }
    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      price: req.body.price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    //Generate response for frontend
    res.json({success:true,name:req.body.name})
  });


//Displaying all products
app.get("/allproducts", async (req, res) => {
	let products = await Product.find({});
  console.log("All Products");
  //For the frontend
    res.send(products);
});

//Remove product from database
app.post("/removeproduct", async (req, res) => {
    const product = await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({success:true,name:req.body.name})
  });


  // Schema for creating user model
//For new customer/users
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});


//Creating an endpoint for registering the user in data base & sending token
app.post('/signup', async (req, res) => {
  console.log("Sign Up");
        let success = false;
        //to check if user already exists or not
        let check = await Users.findOne({ email: req.body.email });
        if (check) {  //User account already created
            return res.status(400).json({ success: false, errors: "existing user found with this email" });
        }
        let cart = {};   //empty object
          for (let i = 0; i < 300; i++) {
          cart[i] = 0;
        }
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });
        await user.save();

        // JWT ( JSON Web Token) authentication
        //Creating token using user object
        //method used to authenticate users in web applications or APIs. 
        //It's a compact and self-contained way for securely transmitting information between parties as a JSON object
        //
        const data = {
          //creating a key
            user: {
                id: user.id
            }
        }
        
        //Creating token for For encrypting
        const token = jwt.sign(data, 'secret_ecom');
        success = true; 
        res.json({ success, token })
    })

//Create an endpoint for user login and giving auth-token
app.post('/login', async (req, res) => {
  console.log("Login");
    let success = false;
    //Users is model
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
      //Checking password
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
      console.log(user.id);

      //creating token
			const token = jwt.sign(data, 'secret_ecom');
			res.json({ success:true, token });
        }
        //if password is incorrect
        else {
            return res.status(400).json({success: false, errors: "Wrong password"})
        }
    }
    //email if not found
    else {
        return res.status(400).json({success: false, errors: " E-mail id not found"})
    }
})

//Showing recently added(latest 4)
app.get("/newcollection", async (req, res) => {
  //all products from mongodb
	let products = await Product.find({});
  // first removes the first product from the array (using slice(1)), then selects the last four products (using slice(-4)).
  //let newcollection = products.slice(1).slice(-4);
  let newcollection = products.slice(-4);

  console.log("Recently added");
  res.send(newcollection);
});

// MiddleWare to fetch user from database
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  //verify authtoken using jwt
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    //decode the token
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};


//endpoint for adding a product in cart
app.post('/addtocart',fetchuser,  async (req, res) => {
	
  //to update this info in cartData attribute of user model
  let userData = await Users.findOne({_id:req.user.id});
  //increate carData attribute by one
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Added in cartData")

  })


//Create an endpoint for saving the product in cart
app.post('/removefromcart', fetchuser, async (req, res) => {
	console.log("Removing from Cart", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    {
      userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Removed from cart");
  })

//Create an endpoint for saving the product in cart even when logged
app.post('/getcart', fetchuser, async (req, res) => {
  console.log("Get Cart");
  let userData = await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);

  })

app.listen(port, (error) => {
    if (!error) console.log("Server Running on port " + port);
    else console.log("Error : ", error);
  });
  