import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";


//create restaurant
export const makeProfileforRestaurant = async (req, res, next) => {
    try {
        const { email, address, img, phone, website, name, RestroMail } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({ message: "user don't have account" });
        }
        const newRestro = new Restaurant({
            RestroMail,
            email,
            phone,
            website,
            img,
            name,
            address,
        });

        const savedrestro = await newRestro.save()
        user.restaurant.push(savedrestro._id);
        await user.save();
        res.status(200).json({ message: "your profile is created" });
    } catch (error) {
        next(error);
    }
};



