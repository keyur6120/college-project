import axios from "axios";

export const MYDB = axios.create({
  baseURL: " http://localhost:8080",

});

const API = axios.create({
  baseURL: "https://fooddelivery-mern.onrender.com/api/"
})

export const UserSignUp = async (data) => await MYDB.post("/user/signup", data);
export const UserSignIn = async (data) => await MYDB.post("/user/signin", data);

//products
export const getAllProducts = async (filter) => await MYDB.get(`/food?${filter}`);



export const getProductDetails = async (id) => await MYDB.get(`/food/${id}`);

//Cart
// done 
export const getCart = async ({ uid }) =>
  await MYDB.get(`/user/getallcartItem`, {
    params: { userId: uid }
  });


// add to cart 
// done 
export const addToCart = async ({ pid, uid, qun }) =>
  await MYDB.post(`/user/addcart`, { productId: pid, userId: uid, quantity: qun });


// delete from cart
//done
export const deleteFromCart = async ({ pid, uid, qun }) =>
  await MYDB.patch(`/user/RemovecartItem`, { productId: pid, quantity: qun, Id: uid });

//favorites
// but work when user has fac
export const getFavourite = async ({uid, pid}) =>
  await MYDB.get(`/user/getfav`,
    {
      params : {userId : uid, productId : pid}
    }
  );

// done
export const addToFavourite = async ({uid, pid}) =>
  await MYDB.post(`/user/addfav`,{userId : uid , productId : pid});

//done
export const deleteFromFavourite = async ({pid,uid}) =>
  await MYDB.patch(`/user/removefav`,{productId: pid , userId : uid});

//Orders
export const placeOrder = async (token, data) => (
  await MYDB.post(`/user/order/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  }));

export const getOrders = async (token) =>
  await MYDB.get(`/user/order/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

//verify user 

// export const VerfiUser = async (data) => 
//   await Token.post("/user/verify", {
//     headers: { Authorization: `${data}` }
//   })
export const VerfiUser = async (token) => {
  return await MYDB.post("/user/verify", {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};