import { useEffect, useState } from "react";
import type { IOrder } from "../../../types/IOrder";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { TbCancel } from "react-icons/tb";

export default function OrderInfoPage() {
    const navigate = useNavigate();

    const [order, setOrder] = useState<IOrder>();
    const [total, setTotal] = useState<number>(0);
    const { id } = useParams();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get(`http://localhost:5000/order/info/${id}`, {
                headers: { Authorization: token },
            })
            .then((res) => {
                if (!res.data) {
                    toast.error("Product Not found", { theme: "colored" });
                    navigate("/profile/orders");
                }
                console.log(res.data);
                setOrder(res.data);
            });
    }, []);

    useEffect(() => {
        let t = 0;
        order?.products.forEach((prod) => {
            t += prod.product.price * prod.qty;
        });
        setTotal(t);
    }, [order]);

    const handleCancelOrder = () => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        if (!order) return;

        axios
            .put(
                "http://localhost:5000/order/cancel",
                { orderId: order._id, pidx: order.pidx },
                { headers: { Authorization: token } },
            )
            .then((res) => {
                const orders = res.data.orders as IOrder[];
                const o = orders.filter((ord) => ord._id === order._id);
                setOrder(o[0]);
                toast.success(res.data.message, { theme: "colored" });
            })
            .catch((err) =>
                toast.error(err.response.data.message, { theme: "colored" }),
            );
    };

    return (
        <>
            <div className="grid grid-cols-2 grid-rows-[auto_1fr] w-full">
                <h3 className="text-slate-600 flex items-center">
                    Order Information
                </h3>
                <div className="grid grid-cols-[auto_1fr] p-4 items-start gap-1 gap-x-8">
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
                    <h6 className="text-slate-400 font-bold">
                        {order?.status?.toUpperCase()}
                    </h6>
                    <button
                        className="flex items-center gap-1 col-start-2 bg-slate-600 text-white p-2 rounded-md cursor-pointer hover:bg-slate-400 outline-0 disabled:cursor-auto disabled:bg-slate-400 w-fit self-end"
                        disabled={!order?.status || order.status !== "pending"}
                        onClick={() => handleCancelOrder()}
                    >
                        <TbCancel size={16} />
                        Cancel Order
                    </button>
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
