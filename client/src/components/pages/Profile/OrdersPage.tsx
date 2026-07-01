import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IOrder } from "../../../types/IOrder";
import { toast } from "react-toastify";
import { TbCancel } from "react-icons/tb";
import { BiPackage } from "react-icons/bi";
import { ImInfo } from "react-icons/im";

export default function OrdersPage() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState<IOrder[]>();
    // const [total, setTotal] = useState<number[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        axios
            .get("http://localhost:5000/order", {
                headers: { Authorization: token },
            })
            .then((res) => setOrders(res.data))
            .catch((err) =>
                toast.error(err.response.data.message, { theme: "colored" }),
            );
    }, []);

    const total = useMemo(() => {
        if (!orders) return;
        return orders
            .sort(
                (a, b) =>
                    new Date(b.createdAt!).getTime() -
                    new Date(a.createdAt!).getTime(),
            )
            .map((item) =>
                item.products.reduce(
                    (sum, item) => sum + item.product.price * item.qty,
                    0,
                ),
            );
    }, [orders]);

    const handleCancelOrder = (orderId: string) => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        axios
            .put(
                `http://localhost:5000/order/cancel/${orderId}`,
                {},
                { headers: { Authorization: token } },
            )
            .then((res) => {
                toast.success(res.data.message, { theme: "colored" });
                setOrders(res.data.orders);
            })
            .catch((err) =>
                toast.error(err.response.data.message, { theme: "colored" }),
            );
    };

    const handleInfoClick = (id: string) => {
        navigate(`/profile/orders/${id}`);
    };

    return (
        <>
            <div className="max-w-full p-4 overflow-hidden">
                <h3 className="text-slate-600 mb-8">Your Orders</h3>
                <div className="min-w-full overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-600 text-white">
                            <tr className="whitespace-nowrap">
                                <th></th>
                                <th>Order Id</th>
                                <th>Total Price</th>
                                <th>Shipping Address</th>
                                <th>Status</th>
                                <th>Placed On</th>
                                <th></th>
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
                                          <tr className="border text-center">
                                              <td className="text-slate-600 text-center border w-fit px-4">
                                                  <BiPackage size={32} />
                                              </td>
                                              <td className="border px-4">
                                                  {order._id}
                                              </td>
                                              <td className="border text-center font-bold text-amber-500 whitespace-nowrap">
                                                  NRS.{" "}
                                                  {total
                                                      ? total[
                                                            index
                                                        ].toLocaleString()
                                                      : null}
                                              </td>
                                              <td className="border text-center whitespace-nowrap">
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
                                              <td className="border-0 flex gap-2 items-center justify-center h-fit">
                                                  <button
                                                      className="bg-slate-600 text-white p-2 cursor-pointer hover:bg-slate-400 rounded-md"
                                                      onClick={() =>
                                                          handleInfoClick(
                                                              order._id!,
                                                          )
                                                      }
                                                  >
                                                      <ImInfo size={24} />
                                                  </button>
                                                  <button
                                                      className="flex items-center gap-1 bg-slate-600 text-white p-2 rounded-md cursor-pointer hover:bg-slate-400 outline-0 disabled:cursor-auto disabled:bg-slate-400"
                                                      disabled={
                                                          !order.status ||
                                                          order.status !==
                                                              "pending"
                                                      }
                                                      onClick={() =>
                                                          handleCancelOrder(
                                                              order._id!,
                                                          )
                                                      }
                                                  >
                                                      <TbCancel size={16} />
                                                      Cancel
                                                  </button>
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
