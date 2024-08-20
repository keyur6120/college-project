import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { addToCart, deleteFromCart, getCart, placeOrder } from "../api";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import { DeleteOutline } from "@mui/icons-material";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  gap: 28px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 12px;
  @media (max-width: 750px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px) {
    flex: 1.2;
  }
`;

const Table = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 30px;
  ${({ head }) => head && `margin-bottom: 22px`}
`;

const TableItem = styled.div`
  ${({ flex }) => flex && `flex: 1; `}
  ${({ bold }) =>
    bold &&
    `font-weight: 600; 
  font-size: 18px;`}
`;

const Counter = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 8px;
  padding: 4px 12px;
`;

const Product = styled.div`
  display: flex;
  gap: 16px;
`;

const Img = styled.img`
  height: 80px;
`;

const Details = styled.div`
  max-width: 130px;
  @media (max-width: 700px) {
    max-width: 60px;
  }
`;

const Protitle = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  font-weight: 500;
`;

const ProDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProSize = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px) {
    flex: 0.8;
  }
`;

const Subtotal = styled.div`
  font-size: 22px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;

const Delivery = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [products, setProducts] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    completeAddress: "",
  });

  //done working
  const getProducts = async () => {
    setLoading(true);
    const Id = localStorage.getItem("user_Id");
    try { 
      const res = await getCart({
        uid : Id
      })
      .then((res)=>{
        console.log('console from cart compo getProducts method',res.data)
        setProducts(res.data)
      })
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return products.reduce(
      (total, item) => total + item.quantity * item?.product?.price?.org,
      0
    );
  };

  const convertAddressToString = (addressObj) => {
    // Convert the address object to a string representation
    return `${addressObj.firstName} ${addressObj.lastName}, ${addressObj.completeAddress}, ${addressObj.phoneNumber}, ${addressObj.emailAddress}`;
  };

  const PlaceOrder = async () => {
    setButtonLoad(true);
    try {
      const isDeliveryDetailsFilled =
        deliveryDetails.firstName &&
        deliveryDetails.lastName &&
        deliveryDetails.completeAddress &&
        deliveryDetails.phoneNumber &&
        deliveryDetails.emailAddress;

      if (!isDeliveryDetailsFilled) {
        // Show an error message or handle the situation where delivery details are incomplete
        dispatch(
          openSnackbar({
            message: "Please fill in all required delivery details.",
            severity: "error",
          })
        );
        return;
      }

      const token = localStorage.getItem("krist-app-token");
      const totalAmount = calculateSubtotal().toFixed(2);
      const orderDetails = {
        products,
        address: convertAddressToString(deliveryDetails),
        totalAmount,
      };

      await placeOrder(token, orderDetails);
      dispatch(
        openSnackbar({
          message: "Order placed successfully",
          severity: "success",
        })
      );
      setReload(!reload);
    } catch (err) {
      dispatch(
        openSnackbar({
          message: "Failed to place order. Please try again.",
          severity: "error",
        })
      );
    } finally {
      setButtonLoad(false);
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
  
      setProducts((prevProducts) =>
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
        setProducts((prevProducts) =>
          prevProducts.filter((item) => item.product._id !== id)
        );
      } else {
        setProducts((prevProducts) =>
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
      <Section>
        <Title>Your Shopping Cart</Title>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {products.length === 0 ? (
              <>Cart is empty</>
            ) : (
              <Wrapper>
                <Left>
                  <Table>
                    <TableItem bold flex>
                      Product
                    </TableItem>
                    <TableItem bold>Price</TableItem>
                    <TableItem bold>Quantity</TableItem>
                    <TableItem bold>Subtotal</TableItem>
                    <TableItem></TableItem>
                  </Table>
                  {products.map((item) => (
                    <Table key={item?.product?._id}>
                      <TableItem flex>
                        <Product>
                          <Img src={item?.product?.img} />
                          <Details>
                            <Protitle>{item?.product?.name}</Protitle>
                            <ProDesc>{item?.product?.desc}</ProDesc>
                          </Details>
                        </Product>
                      </TableItem>
                      <TableItem>${item?.product?.price?.org}</TableItem>
                      <TableItem>
                        <Counter>
                          <div
                            style={{
                              cursor: "pointer",
                              flex: 1,
                            }}
                            onClick={() =>
                              removeCart(item?.product?._id, item?.quantity - 1)
                            }
                          >
                            -
                          </div>
                          {item?.quantity}
                          <div
                            style={{
                              cursor: "pointer",
                              flex: 1,
                            }}
                            onClick={() => addCart(item?.product?._id)}
                          >
                            +
                          </div>
                        </Counter>
                      </TableItem>
                      <TableItem>
                        ${item?.quantity * item?.product?.price?.org}
                      </TableItem>
                      <TableItem
                        onClick={() =>
                          removeCart(item?.product?._id, item?.quantity, "full")
                        }
                      >
                        <DeleteOutline />
                      </TableItem>
                    </Table>
                  ))}
                </Left>
                <Right>
                  <Subtotal>
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </Subtotal>
                  <Delivery>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={deliveryDetails.firstName}
                      onChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          firstName: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={deliveryDetails.lastName}
                      onChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          lastName: e.target.value,
                        })
                      }
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={deliveryDetails.emailAddress}
                      onChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          emailAddress: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={deliveryDetails.phoneNumber}
                      onChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Complete Address"
                      value={deliveryDetails.completeAddress}
                      onChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          completeAddress: e.target.value,
                        })
                      }
                    />
                  </Delivery>
                  <button onClick={PlaceOrder} disabled={buttonLoad}>
                    {buttonLoad ? "Placing Order..." : "Place Order"}
                  </button>
                </Right>
              </Wrapper>
            )}
          </>
        )}
      </Section>
    </Container>
  );
};

export default Cart;
