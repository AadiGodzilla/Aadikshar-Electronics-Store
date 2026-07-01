import { FiTrash } from "react-icons/fi";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import type { ICart } from "../../types/ICart";
import { useContext, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext, type UserContextType } from "../../contexts/UserContext";
import type { IPaymentInitiateResponse } from "../../types/IPayment";

export default function CartPage() {
    const navigate = useNavigate();

    const { user, setUser } = useContext<UserContextType>(UserContext);

    const [disabled, setDisabled] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || token === "") {
            navigate("/login");
            return;
        }

        axios
            .get("http://localhost:5000/user", {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setUser(res.data);
            });
    }, []);

    useEffect(() => {
        if (!user) return;

        if (!user.cart || user.cart.length === 0) setDisabled(true);
        else setDisabled(false);
    }, [user]);

    const cartTotal = useMemo(() => {
        if (!user) return 0;
        return user.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }, [user]);

    const handleClearCart = () => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        axios
            .delete(`http://localhost:5000/user/cart/remove/`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                toast.success(res.data.message, { theme: "colored" });
                setUser!(res.data.user);
            })
            .catch((err) => {
                toast.error(err.response.data.message, { theme: "colored" });
            });
    };

    const handleRemoveFromCart = (cartId: string) => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        console.log(cartId);

        axios
            .delete(`http://localhost:5000/user/cart/remove/${cartId}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                toast.success(res.data.message, { theme: "colored" });
                setUser!(res.data.user);
            })
            .catch((err) => {
                toast.error(err.response.data.message, { theme: "colored" });
            });
    };

    const handlePayment = () => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        if (user?.addresses.length === 0)
            return toast.error(
                "Shipping Address is missing, Please set a address from your profile",
                {
                    theme: "colored",
                },
            );

        const products: { product: string; qty: number }[] = [];
        user?.cart.forEach((item) =>
            products.push({ product: item.productId, qty: item.qty }),
        );

        const productDetails: Object[] = [];

        user?.cart.forEach((item) => {
            productDetails.push({
                identity: item._id,
                name: item.product,
                total_price: item.price * item.qty * 100,
                quantity: item.qty,
                unit_price: item.price,
            });
        });

        if (cartTotal)
            axios
                .post(
                    "https://dev.khalti.com/api/v2/epayment/initiate/",
                    {
                        return_url: "http://localhost:3000/payment-verify",
                        website_url: "https://localhost:3000/",
                        amount: cartTotal * 100 + 100000,
                        purchase_order_id: "Order01",
                        purchase_order_name: "test",
                        customer_info: {
                            name: user?.fullName,
                            email: user?.email,
                            phone: user?.phone,
                        },
                        amount_breakdown: [
                            {
                                label: "Mark Price",
                                amount: cartTotal * 100,
                            },
                            {
                                label: "Delivery Fee",
                                amount: 100000,
                            },
                        ],
                        product_details: productDetails,
                        merchant_username: "Aadikshar Electronics Store",
                        merchant_extra: "Aadikshar Electronics Store",
                    },
                    {
                        headers: {
                            Authorization: `Key ${import.meta.env.VITE_KHALTI_SECRET_KEY}`,
                            "Content-Type": "application/json",
                        },
                    },
                )
                .then((res) => {
                    const data = res.data as IPaymentInitiateResponse;
                    window.location.href = data.payment_url;
                })
                .catch((err) => {
                    toast.error(err.response.data.detail, { theme: "colored" });
                });
    };

    return (
        <>
            <Header color="light" />
            <div className="m-auto mx-30 mt-12 mb-4 min-h-screen max-h-fit grid grid-cols-3 grid-rows-1 gap-8">
                <div className="flex flex-col gap-8 col-span-2">
                    <h1 className="text-slate-700">CART</h1>
                    <div className="w-full flex justify-between items-center">
                        <h6 className="text-slate-700">
                            You have {user?.cart ? user?.cart.length : 0}{" "}
                            products in the cart
                        </h6>
                        <button
                            className={clsx(
                                "py-3 px-4 w-fit flex items-center gap-2 rounded-md font-bold text-white",
                                disabled
                                    ? "bg-slate-400"
                                    : "hover:bg-slate-500 bg-slate-600 cursor-pointer",
                            )}
                            onClick={handleClearCart}
                        >
                            <FiTrash />
                            Delete Cart
                        </button>
                    </div>
                    <div className="w-full rounded-md">
                        <table className="w-full rounded-md">
                            <thead className="bg-slate-600 text-white">
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!user?.cart
                                    ? null
                                    : user?.cart.map((item: ICart) => (
                                          <tr
                                              className="border-0 p-4 cursor-pointer"
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  navigate(
                                                      `/products/${item.productId}`,
                                                  );
                                              }}
                                          >
                                              <td className="flex items-center gap-4 border-0">
                                                  <img
                                                      src={`http://localhost:5000/${item.image}`}
                                                      alt=""
                                                      className="w-32 h-24"
                                                  />
                                                  <span>{item.product}</span>
                                              </td>
                                              <td className="text-center whitespace-nowrap font-bold border-0 text-amber-400">
                                                  NRS{" "}
                                                  {item.price.toLocaleString()}
                                              </td>
                                              <td className="text-center border-0 font-bold">
                                                  {item.qty}
                                              </td>
                                              <td className="text-center whitespace-nowrap font-bold border-0 text-green-400">
                                                  NRS{" "}
                                                  {(
                                                      item.price * item.qty
                                                  ).toLocaleString()}
                                              </td>
                                              <td className="text-center text-white border-0">
                                                  <button
                                                      className="bg-slate-600 p-3 rounded-md cursor-pointer hover:bg-slate-500"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleRemoveFromCart(
                                                              item._id,
                                                          );
                                                      }}
                                                  >
                                                      <FiTrash />
                                                  </button>
                                              </td>
                                          </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="py-4">
                    <div className="flex flex-col items-center justify-between border border-slate-600 gap-8 p-4">
                        <h2 className="text-slate-700">Total</h2>
                        <div className="grid grid-cols-2 justify-between items-center">
                            <h5>Total Sum Price: </h5>
                            <h5 className="text-right text-amber-400">
                                NRS.{" "}
                                {cartTotal ? cartTotal.toLocaleString() : null}
                            </h5>
                            <h5>Delivery Fee: </h5>
                            <h5 className="text-right text-amber-400">
                                NRS. 1,000
                            </h5>
                            <h5>Net Total: </h5>
                            <h5 className="text-green-400 text-right">
                                NRS.{" "}
                                {cartTotal
                                    ? (cartTotal + 1000).toLocaleString()
                                    : "1,000"}
                            </h5>
                        </div>
                        <button
                            className={clsx(
                                "p-3 w-full font-bold text-white rounded-md",
                                !disabled
                                    ? "cursor-pointer bg-slate-600 hover:bg-slate-500"
                                    : "cursor-auto bg-slate-400",
                            )}
                            disabled={disabled}
                            onClick={handlePayment}
                        >
                            Pay via Khalti
                        </button>
                    </div>
                </div>
                <div className="w-full col-span-3">
                    <Footer />
                </div>
            </div>
        </>
    );
}
