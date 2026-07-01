import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { IOrder, OrderStatus } from "../../../types/IOrder";

export default function OrderAdminInfoPage() {
    const navigate = useNavigate();

    const [order, setOrder] = useState<IOrder>();
    const [total, setTotal] = useState<number>(0);
    const [status, setStatus] = useState<OrderStatus>("pending");
    const [changed, setChanged] = useState<boolean>(false);
    const { id } = useParams();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get(`http://localhost:5000/order/info/${id}`, {
                headers: { Authorization: token },
            })
            .then((res) => {
                if (!res.data) {
                    toast.error("Order Not found", { theme: "colored" });
                    navigate("/profile/orders");
                }
                setOrder(res.data);
                let t = 0;
                const order = res.data as IOrder;
                order.products.forEach((prod) => {
                    t += prod.product.price * prod.qty;
                });
                setTotal(t);
                setStatus(res.data.status as OrderStatus);
            });
    }, [changed]);

    const handleStatusChange = () => {
        axios
            .put(
                "http://localhost:5000/order/status",
                {
                    orderId: order?._id,
                    status: status,
                },
                { headers: { Authorization: localStorage.getItem("token") } },
            )
            .then((res) => {
                toast.success(res.data.message, { theme: "colored" });
                setChanged(!changed);
            });
    };

    return (
        <>
            <div className="grid grid-cols-2 grid-rows-[auto_1fr] w-full min-h-screen max-h-fit">
                <h3 className="text-slate-600 flex items-center">
                    Order Information
                </h3>
                <div className="grid grid-cols-[auto_1fr] p-4 gap-3 gap-x-5">
                    <h6 className="text-slate-600 text-right">Order ID: </h6>
                    <h6 className="font-semibold">{id}</h6>
                    <h6 className="text-slate-600 text-right">
                        Shipping Address:
                    </h6>{" "}
                    <h6 className="font-semibold">{order?.shippingAddress}</h6>
                    <h6 className="text-slate-600 text-right">Total Price: </h6>
                    <h6 className="text-amber-500">
                        NRS. {total.toLocaleString()}
                    </h6>
                    <h6 className="text-slate-600 text-right">Placed On: </h6>
                    <h6>{new Date(order?.createdAt!).toLocaleString()}</h6>
                    <h6 className="text-slate-600 self-center text-right">
                        Status:{" "}
                    </h6>
                    <div className="w-fit flex gap-2">
                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value as OrderStatus)
                            }
                            className="p-2 border-2 border-slate-400 rounded-md text-slate-600 cursor-pointer outline-none w-fit disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-auto"
                            // disabled={
                            //     order?.status === "cancelled" ||
                            //     order?.status === "returned"
                            // }
                        >
                            <option value="pending">Pending</option>
                            <option value="delivered">Delivered</option>
                            <option value="returned">Returned</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                            className="p-2 text-white bg-slate-600 rounded-md cursor-pointer hover:bg-slate-400"
                            onClick={handleStatusChange}
                        >
                            Update
                        </button>
                    </div>
                </div>
                <div className="col-span-2">
                    <table className="">
                        <thead>
                            <tr className="whitespace-nowrap text-white bg-slate-600">
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Product Price</th>
                                <th>Quantity</th>
                                <th>Sub Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.products.map((prod) => (
                                <tr>
                                    <td className="whitespace-nowrap text-center">
                                        {prod.product._id}
                                    </td>
                                    <td className="flex gap-2 items-center border-0">
                                        <img
                                            src={`http://localhost:5000/${prod.product.images[0]}`}
                                            alt=""
                                            className="w-32 h-24"
                                        />
                                        {prod.product.about}
                                    </td>
                                    <td className="font-bold whitespace-nowrap text-center text-amber-500">
                                        NRS.{" "}
                                        {prod.product.price.toLocaleString()}
                                    </td>
                                    <td className="font-bold whitespace-nowrap text-center">
                                        {prod.qty}
                                    </td>
                                    <td className="font-bold whitespace-nowrap text-center text-green-500">
                                        NRS.{" "}
                                        {(
                                            prod.product.price * prod.qty
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
