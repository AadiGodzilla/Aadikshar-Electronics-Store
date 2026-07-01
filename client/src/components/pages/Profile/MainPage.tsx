import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { IOrder } from "../../../types/IOrder";
import { toast } from "react-toastify";
import {
    UserContext,
    type UserContextType,
} from "../../../contexts/UserContext";
import { BiPackage } from "react-icons/bi";

export default function ProfileMainPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<IOrder[]>([]);

    const { user, setUser } = useContext<UserContextType>(UserContext);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        if (!user)
            axios
                .get("http://localhost:5000/user", {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((res) => {
                    setUser(res.data);
                });

        axios
            .get("http://localhost:5000/order", {
                headers: { Authorization: token },
            })
            .then((res) => setOrders(res.data))
            .catch((err) =>
                toast.error(err.response.data.message, { theme: "colored" }),
            );
    }, []);

    const totals = useMemo(() => {
        if (!orders) return;
        return orders
            .sort(
                (a, b) =>
                    new Date(b.createdAt!).getTime() -
                    new Date(a.createdAt!).getTime(),
            )
            .map((order) =>
                order.products.reduce(
                    (sum, item) => sum + item.product.price * item.qty,
                    0,
                ),
            );
    }, [orders]);

    const handleGotoUpdateForm = () => {
        if (user) {
            const params = new URLSearchParams({
                fullname: user.fullName,
                email: user.email,
                phone: user.phone,
            });
            navigate(`/profile/update?${params.toString()}`);
        }
    };

    return (
        <>
            <div className="grid grid-cols-2 w-full min-h-screen max-h-fit gap-4 p-4">
                <h3 className="text-slate-600 col-span-4">Manage My Account</h3>
                <div className="bg-white flex-1 p-4 border border-slate-600 flex flex-col gap-4">
                    <h5 className="text-slate-600">Personal Information</h5>
                    <p>
                        <span className="font-bold">Full Name: </span>
                        {user?.fullName}
                    </p>
                    <p>
                        <span className="font-bold">Email Address: </span>
                        {user?.email}
                    </p>
                    <p>
                        <span className="font-bold">Phone Number: </span>
                        {user?.phone}
                    </p>
                    <button
                        className="w-fit p-2 cursor-pointer bg-slate-600 text-white hover:bg-slate-400 rounded-md"
                        onClick={handleGotoUpdateForm}
                    >
                        UPDATE
                    </button>
                </div>
                <div className="bg-white flex-2 p-4 border border-slate-600 col-start-2 col-span-3">
                    <h5 className="text-slate-600 mb-4">Address</h5>
                    <p>{user?.addresses[user?.defaultAddress]}</p>
                </div>
                <h5 className="text-slate-600 h-fit col-span-4">
                    Recent Orders
                </h5>
                <div className="h-128 row-start-4 border border-slate-500 overflow-x-auto w-full overflow-y-auto col-span-4">
                    <table className="w-full">
                        <thead className="bg-slate-600 text-white">
                            <tr>
                                <th></th>
                                <th>Order Id</th>
                                <th>Total Price</th>
                                <th>Shipping Address</th>
                                <th>Status</th>
                                <th>Placed On</th>
                            </tr>
                        </thead>
                        <tbody className="border-0">
                            {!orders
                                ? null
                                : orders
                                      .sort(
                                          (a, b) =>
                                              new Date(b.createdAt!).getTime() -
                                              new Date(a.createdAt!).getTime(),
                                      )
                                      .map((order, index) => (
                                          <tr
                                              className="border cursor-pointer hover:bg-slate-200 text-center"
                                              onClick={() =>
                                                  navigate(
                                                      `/profile/orders/${order._id}`,
                                                  )
                                              }
                                          >
                                              <td className="text-slate-600 text-center border-0 w-fit">
                                                  <BiPackage size={32} />
                                              </td>
                                              <td className="border-0">
                                                  {order._id}
                                              </td>
                                              <td className="border text-center whitespace-nowrap text-amber-400 font-bold">
                                                  NRS.{" "}
                                                  {totals
                                                      ? totals[
                                                            index
                                                        ].toLocaleString()
                                                      : null}
                                              </td>
                                              <td className="text-slate-600">
                                                  {order.shippingAddress}
                                              </td>
                                              <td className="border font-bold text-slate-600">
                                                  {order.status?.toLocaleUpperCase()}
                                              </td>
                                              <td className="border whitespace-nowrap font-bold">
                                                  {new Date(
                                                      order.createdAt!,
                                                  ).toLocaleString()}
                                              </td>
                                          </tr>
                                      ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
