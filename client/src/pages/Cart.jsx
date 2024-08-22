import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { addToCart, deleteFromCart, getCart, order } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import { DeleteOutline } from "@mui/icons-material";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #f5f5f5;
`;

const DeliveryInfo = styled.div`
  flex: 2;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const OrderSummary = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 20px;
  margin-left: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const ScheduleDelivery = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Toggle = styled.div`
  margin-right: 10px;
`;

const PaymentMethod = styled.div`
  margin-top: 20px;
`;

const MethodOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const RadioInput = styled.input`
  margin-right: 10px;
`;

const Calendar = styled.div`
  margin-bottom: 20px;
`;

const Note = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-top: 20px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin-right: 10px;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.h3`
  font-size: 14px;
  color: #333;
`;

const ProductPrice = styled.p`
  font-size: 14px;
  color: #888;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const QuantityInput = styled.input`
  width: 40px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0 5px;
`;

const TotalAmount = styled.div`
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #556b2f;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #6b8e23;
  }
`;

const OrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [product, setProduct] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    emailAddress: "",
    phoneNumber: "",
    address: {
      City: "",
      state: "",
      ZIP: "",
      complete_address: "",
    },
  });
  //done working
  const getProducts = async () => {
    setLoading(true);
    const Id = localStorage.getItem("user_Id");
    try {
      const res = await getCart({
        uid: Id,
      }).then((res) => {
        console.log("console from cart compo getProducts method", res.data);
        setProduct(res.data);
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    const cartItem = product.reduce(
      (total, item) => total + item.quantity * item?.product?.price?.org,
      0
    );
    const Tax = (cartItem * 18) / 100;
    const Total = cartItem + Tax;
    return Total;
  };

  const userOrder = async () => {
    try {
      const Id = localStorage.getItem("user_Id");
      const TotalAmount = calculateSubtotal();
      const Details = {
        Username: deliveryDetails.firstName,
        total_amount: TotalAmount,
        address: {
          city: deliveryDetails.address.City,
          state: deliveryDetails.address.state,
          ZIP: deliveryDetails.address.ZIP,
          complete_address: deliveryDetails.address.complete_address,
        },
        products: product.map((item) => {
          return {
            productId: item._Id,
            quantity: item.quantity,
          };
        }),
        user: "user_id", // Replace with actual user ID
        status: "Pending", // or any other status
      };
    } catch (error) {
      console.log(error);
    }
  };

  const newhandler = async () => {
    try {
      const Id = localStorage.getItem("user_Id");
      const TotalAmount = calculateSubtotal();
      const Details = {
        Username: deliveryDetails.firstName,
        total_amount: TotalAmount,
        address: {
          city: deliveryDetails.address.City,
          state: deliveryDetails.address.state,
          ZIP: deliveryDetails.address.ZIP,
          complete_address: deliveryDetails.address.complete_address,
        },
        products: product.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        user: Id,
        status: "Pending", 
      };
  
      const response = await order(Details)
      .then((res)=>{
        if(res){
          window.location.reload()
        }
      })  
      console.log("Order placed successfully", response.data);
    } catch (error) {
      console.error("Error placing order", error);
    }
  };
  
  


  useEffect(() => {
    getProducts();
  }, [reload]);

  //done
  const addCart = async (id) => {
    const userId = localStorage.getItem("user_Id");
    try {
      await addToCart({ pid: id, uid: userId, qun: 1 });

      setProduct((prevProducts) =>
        prevProducts.map((item) =>
          item.product._id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );

      dispatch(
        openSnackbar({
          message: "Product quantity increased",
          severity: "success",
        })
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.message,
          severity: "error",
        })
      );
    }
  };

  //working
  const removeCart = async (id, quantity, type) => {
    const userId = localStorage.getItem("user_Id");
    let qnt = quantity > 0 ? 1 : null;
    if (type === "full") qnt = null;

    try {
      await deleteFromCart({ pid: id, qun: qnt, uid: userId });

      if (type === "full") {
        setProduct((prevProducts) =>
          prevProducts.filter((item) => item.product._id !== id)
        );
      } else {
        setProduct((prevProducts) =>
          prevProducts.map((item) =>
            item.product._id === id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      }

      dispatch(
        openSnackbar({
          message: "Product quantity decreased",
          severity: "success",
        })
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.message,
          severity: "error",
        })
      );
    }
  };

  return (
    <Container>
      <DeliveryInfo>
        <Title>Delivery Information</Title>
        <InputGroup>
          <Input
            type="text"
            placeholder="Name"
            value={deliveryDetails.firstName}
            onChange={(e) =>
              setDeliveryDetails((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
          />
          <Input
            type="text"
            placeholder="Mobile Number"
            value={deliveryDetails.phoneNumber}
            onChange={(e) =>
              setDeliveryDetails((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
            }
          />
        </InputGroup>
        <InputGroup>
          <Input
            type="email"
            placeholder="Email"
            value={deliveryDetails.emailAddress}
            onChange={(e) =>
              setDeliveryDetails((prev) => ({
                ...prev,
                emailAddress: e.target.value,
              }))
            }
          />
          <Input
            type="text"
            placeholder="City"
            value={deliveryDetails.address.City}
            onChange={(e) =>
              setDeliveryDetails((prevdata) => ({
                ...prevdata,
                address: {
                  ...prevdata.address,
                  City: e.target.value,
                },
              }))
            }
          />
        </InputGroup>
        <InputGroup>
          <Input
            type="text"
            placeholder="State"
            value={deliveryDetails.address.state}
            onChange={(e) =>
              setDeliveryDetails((prevdata) => ({
                ...prevdata,
                address: {
                  ...prevdata.address,
                  state: e.target.value,
                },
              }))
            }
          />
          <Input
            type="text"
            placeholder="ZIP"
            value={deliveryDetails.address.ZIP}
            onChange={(e) =>
              setDeliveryDetails((prevdata) => ({
                ...prevdata,
                address: {
                  ...prevdata.address,
                  ZIP: e.target.value,
                },
              }))
            }
          />
        </InputGroup>
        <Input
          type="text"
          placeholder="Address"
          value={deliveryDetails.address.complete_address}
          onChange={(e) =>
            setDeliveryDetails((prevdata) => ({
              ...prevdata,
              address: {
                ...prevdata.address,
                complete_address: e.target.value,
              },
            }))
          }
        />

        <ScheduleDelivery>
          <Toggle>
            <input type="checkbox" />
          </Toggle>
          <div>Schedule Delivery</div>
        </ScheduleDelivery>

        <Calendar>
          {/* You can use a date picker library here */}
          <p>Select Delivery Date</p>
        </Calendar>

        <PaymentMethod>
          <Title>Payment Method</Title>
          <MethodOption>
            <RadioInput type="radio" name="payment" /> Online Payment
          </MethodOption>
          <MethodOption>
            <RadioInput type="radio" name="payment" /> Cash on Delivery
          </MethodOption>
          <MethodOption>
            <RadioInput type="radio" name="payment" /> POS on Delivery
          </MethodOption>
        </PaymentMethod>

        <Note placeholder="Type your note"></Note>
      </DeliveryInfo>

      <OrderSummary>
        <Title>Order Summary</Title>
        {product.map((item, index) => (
          <>
            <SummaryItem key={index}>
              <ProductImage src={item?.product?.img} alt="Product" />
              <ProductDetails>
                <ProductName>{item?.product?.name}</ProductName>
                <ProductPrice>${item?.product?.price?.org}</ProductPrice>
              </ProductDetails>
              <QuantityControl>
                <QuantityButton
                  onClick={() =>
                    removeCart(item?.product?._id, item?.quantity - 1)
                  }
                >
                  -
                </QuantityButton>
                <QuantityInput type="text" value={item?.quantity} />
                <QuantityButton onClick={() => addCart(item?.product?._id)}>
                  +
                </QuantityButton>
              </QuantityControl>
            </SummaryItem>
          </>
        ))}
        <TotalAmount>
          <span>Total (+Tax):</span>
          <span>${calculateSubtotal()}</span>
        </TotalAmount>

        <ConfirmButton onClick={() => newhandler()}>
          {buttonLoad ? "placing order..." : "confirm order"}
        </ConfirmButton>
      </OrderSummary>
    </Container>
  );
};

export default OrderPage;
