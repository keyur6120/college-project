// import User from '../models/User.js'

export const testing = async (req, res) => {
    try {
      const userId = req.body
      console.log(userId)
    } catch (error) {
      res.status(500).json({error})
    }
  };