import { useEffect, useMemo, useState } from "react";
import type { IOrder, OrderStatus } from "../../../types/IOrder";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BiSearch } from "react-icons/bi";
import { ImInfo } from "react-icons/im";

export default function OrdersAdminPage() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [search, setSearch] = useState<string>("");
    const [displayOrders, setDisplayOrders] = useState<IOrder[]>([]);
    const [changed, setChanged] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .get("http://localhost:5000/order/all", {
                headers: { Authorization: token },
            })
            .then((res) => {
                setOrders(res.data);
                setDisplayOrders(res.data);
            })
            .catch((err) => toast.error(err.response.data.message));
    }, [changed]);

    const totals = useMemo(() => {
        if (!orders) return;
        return orders
            .sort(
                (a, b) =>
                    new Date(b.createdAt!).getTime() -
                    new Date(a.createdAt!).getTime(),
            )
            .map((order) => {
                return order.products.reduce(
                    (sum, item) => sum + item.product.price * item.qty,
                    0,
                );
            });
    }, [orders]);

    const searchOrders = useMemo(() => {
        return orders.filter((order) => {
            const term = search.toLowerCase();
            return (
                order._id?.toLowerCase().includes(term) ||
                order.customerId?.fullName.toLowerCase().includes(term) ||
                order.shippingAddress.toLowerCase().includes(term) ||
                order.status?.toLowerCase().includes(term)
            );
        });
    }, [search]);

    useEffect(() => {
        search === ""
            ? setDisplayOrders(orders)
            : setDisplayOrders(searchOrders);
    }, [search]);

    const handleUpdateStatus = (
        orderId: string,
        status: OrderStatus,
        pidx: string,
    ) => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");

        axios
            .put(
                "http://localhost:5000/order/status",
                {
                    pidx: pidx,
                    orderId: orderId,
                    status: status,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                },
            )
            .then((res) => {
                toast.success(res.data.message, { theme: "colored" });
                setChanged(!changed);
            })
            .catch((err) =>
                toast.error(err.response.data.message, {
                    theme: "colored",
                }),
            );
    };

    return (
        <>
            <div className="flex flex-col gap-4 min-h-screen max-h-fit w-full overflow-hidden">
                <h3 className="text-slate-600">Manage Orders</h3>
                <form
                    className="flex gap-4 items-center"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <span className="whitespace-nowrap font-bold text-slate-600">
                        Search Orders
                    </span>
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="w-full border-2 border-slate-400 p-2 rounded-md"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="absolute right-2 top-[25%] text-slate-600">
                            <BiSearch size={24} />
                        </button>
                    </div>
                </form>
                <div className="w-full h-fit overflow-x-auto">
                    <table className="">
                        <thead>
                            <tr className="bg-slate-600 text-white whitespace-nowrap">
                                <th>Order ID</th>
                                <th>Customer's Name</th>
                                <th>Total Price</th>
                                <th>Shipping Address</th>
                                <th>Placed On</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayOrders
                                .sort(
                                    (a, b) =>
                                        new Date(b.createdAt!).getTime() -
                                        new Date(a.createdAt!).getTime(),
                                )
                                .map((item: IOrder, index: number) => (
                                    <tr key={index}>
                                        <td className="text-center">
                                            {item._id}
                                        </td>
                                        <td className="whitespace-nowrap text-center">
                                            {item.customerId?.fullName}
                                        </td>
                                        <td className="whitespace-nowrap font-bold text-amber-400 text-center">
                                            NRS.{" "}
                                            {totals
                                                ? totals[index].toLocaleString()
                                                : null}
                                        </td>
                                        <td className="whitespace-nowrap">
                                            {item.shippingAddress}
                                        </td>
                                        <td className="whitespace-nowrap text-center font-semibold">
                                            {new Date(
                                                item.createdAt!,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="whitespace-nowrap font-bold text-slate-600 border-0 border-slate-600 flex gap-4 text-center justify-center">
                                            <button
                                                className="bg-slate-600 text-white rounded-md p-2 cursor-pointer hover:bg-slate-400"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/orders/${item._id!}`,
                                                    )
                                                }
                                            >
                                                <ImInfo size={24} />
                                            </button>
                                            <select
                                                onChange={(e) => {
                                                    handleUpdateStatus(
                                                        item._id!,
                                                        e.target
                                                            .value as OrderStatus,
                                                        item.pidx,
                                                    );
                                                }}
                                                value={item.status}
                                                className="border-2 border-slate-400 p-2 rounded-md cursor-pointer disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-auto"
                                                // disabled={
                                                //     item.status ===
                                                //         "cancelled" ||
                                                //     item.status === "returned"
                                                // }
                                            >
                                                <option value="pending">
                                                    Pending
                                                </option>
                                                <option value="delivered">
                                                    Delivered
                                                </option>
                                                <option value="returned">
                                                    Returned
                                                </option>
                                                <option value="cancelled">
                                                    Cancelled
                                                </option>
                                            </select>
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
