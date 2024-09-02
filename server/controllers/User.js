import bcrypt from "bcrypt";
import { jwtDecode } from "jwt-decode";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import { createError } from "../error.js";
import User from "../models/User.js";
import Food from '../models/Food.js'
import Orders from "../models/Orders.js";
import SplitBills from '../models/SplitBills.js';
import Category from '../models/CategorySchema.js'
dotenv.config();

//user registration

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    //Check for existing user
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1 day",
    });
    return res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

//user login
// done 
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Check for existing user
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return next(createError(409, "User not found."));
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

//! addCart

export const addToCart = async (req, res, next) => {
  try {
    // , quantity 
    const { productId, userId, quantity } = req.body;

    const user = await User.findById(userId);
    const existingCartItemIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );
    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, update the quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Product is not in the cart, add it
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    return res
      .status(200)
      .json({ message: "Product added to cart successfully", user });
  } catch (err) {
    next(err);
  }
};

//!deleteFromCart()
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity, Id } = req.body;
    const user = await User.findById(Id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const productIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );
    if (productIndex !== -1) {
      if (quantity && quantity > 0) {
        user.cart[productIndex].quantity -= quantity;
        if (user.cart[productIndex].quantity <= 0) {
          user.cart.splice(productIndex, 1); // Remove the product from the cart
        }
      } else {
        user.cart.splice(productIndex, 1);
      }

      await user.save();

      return res
        .status(200)
        .json({ message: "Product quantity updated in cart", user });
    } else {
      return next(createError(404, "Product not found in the user's cart"));
    }
  } catch (err) {
    next(err);
  }
};

//!getCart 
export const getAllCartItems = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId).populate({
      path: "cart.product",
      model: "Food",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the cart items from the user document
    const cartItems = user.cart;

    // Return the cart items as a JSON response
    return res.status(200).json(cartItems);
  } catch (err) {
    // Handle any errors that occur
    next(err);
  }
};

//Orders
export const newOrder = async (req, res) => {
  try {
    const { Username, total_amount, address, products, user, status } = req.body
    const neworder = new Orders({
      Username,
      total_amount,
      address,
      products,
      user,
      status
    })
    const usercheck = await User.findById(user)

    const saveorder = await neworder.save()
    
    usercheck.orders.push(saveorder)
    
    usercheck.cart = []
    
    await usercheck.save()
    
    res.status(200).json({ message: "sucessfull order" })

  } catch (error) {
    res.status(500).json({ message: "error in placeOrder in user.js", error })
  }
}


// export const getAllOrders = async (req, res, next) => {
//   try {
//     const { productId, userId } = req.body;

//     const user = await User.findById(userId);
//     if (!user.favourites.includes(productId)) {
//       user.favourites.push(productId);
//       await user.save();
//     }
//     return res
//       .status(200)
//       .json({ message: "Product added to favorites successfully", user });
//   } catch (err) {
//     next(err);
//   }
// };

//Favorites

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId, userId } = req.body;
    const user = await User.findById(userId);
    user.favourites = user.favourites.filter((fav) => !fav.equals(productId));
    await user.save();

    return res
      .status(200)
      .json({ message: "Product removed from favorites successfully", user });
  } catch (err) {
    next(err);
  }
};


//!addToFavorites()

export const addToFavorites = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Product added to favorites successfully", user });
  } catch (err) {
    next(err);
  }
};


export const getUserFavorites = async (req, res, next) => {
  try {
    const { userId } = req.query

    const user = await User.findById(userId).populate("favourites").exec();
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const favoriteProducts = user.favourites;

    // console.log("from uid")

    return res.status(200).json(favoriteProducts)


  } catch (err) {
    next(err);
  }
};

export const getverfied = async (req, res) => {
  try {
    // Extract the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(500).Json({ message: "header is not reaching to decoder" })
    }
    // Extract the JWT token from the Authorization header
    const token = authHeader.substring("Bearer=".length)

    try {
      // Decode the token to get the user ID or other relevant information
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // Find the user in the database by their ID
      const user = await User.findById(userId).select('name email');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      } else {
        return res.status(200).json({ message: 'User found', userId });

      }
    } catch (error) {
      console.log('Error decoding token:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.log('Server error:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const SplitBill = async (req, res) => {
  try {
    const { userId } = req.query

    const user = await User.findById(userId)

    if (!user) {
      return res.status(500).json({ message: "user not found" })
    }

    const splitBill = new SplitBills(req.body);

    const savedSplitBill = await splitBill.save();

    user.splitBills.push(savedSplitBill)

    await user.save()

    return res
      .status(201)
      .json(savedSplitBill); // Ensure to use 'return' to prevent further execution

  } catch (error) {
    return res.status(400).json({ error: error.message }); // Ensure to use 'return' to prevent further execution
  }
};


export const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.query;
    // console.log('userId', userId)
    const user = await User.findById(userId)
      .populate({
        path: 'orders',
        select: 'address products',  
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user.orders)
  } catch (err) {
    next(err);
  }
};


