import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { BiPackage, BiRupee, BiUser } from "react-icons/bi";
import { PiLaptop } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import type { IOrder } from "../../../types/IOrder";

export default function DashboardPage() {
    const navigate = useNavigate();
    const [orderCount, setOrderCount] = useState<number>(0);
    const [productCount, setProductCount] = useState<number>(0);
    const [userCount, setUserCount] = useState<number>(0);
    const [orders, setOrders] = useState<IOrder[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/");
        axios
            .get("http://localhost:5000/order/count", {
                headers: { Authorization: token },
            })
            .then((res) => {
                setOrderCount(res.data.message);
            });
        axios.get("http://localhost:5000/product/count").then((res) => {
            setProductCount(res.data.message);
        });
        axios
            .get("http://localhost:5000/user/count", {
                headers: { Authorization: token },
            })
            .then((res) => {
                setUserCount(res.data.message);
            });

        axios
            .get("http://localhost:5000/order/all", {
                headers: { Authorization: token },
            })
            .then((res) => {
                setOrders(res.data);
            });
    }, []);

    const totalRevenueEarned = useMemo(() => {
        return orders.reduce(
            (sum, item) =>
                item.status !== "cancelled" && item.status !== "returned"
                    ? sum +
                      item.products.reduce(
                          (s, i) => s + i.product.price * i.qty,
                          0,
                      )
                    : sum,
            0,
        );
    }, [orders]);

    const totalRefunded = useMemo(() => {
        return orders.reduce(
            (sum, item) =>
                item.status === "cancelled" || item.status === "returned"
                    ? sum +
                      item.products.reduce(
                          (s, i) => s + i.product.price * i.qty,
                          0,
                      )
                    : sum,
            0,
        );
    }, [orders]);

    return (
        <>
            <div className="p-4 w-full flex-wrap min-h-screen">
                <div className="grid grid-cols-3 gap-8 h-fit w-full">
                    <div className="p-8 flex justify-between items-center h-fit bg-slate-600 text-white rounded-md">
                        <div className="flex flex-col gap-2">
                            <h2>ORDERS</h2>
                            <h1>{orderCount}</h1>
                        </div>
                        <BiPackage size={128} />
                    </div>

                    <div className="p-8 flex justify-between items-center h-fit bg-slate-600 text-white rounded-md">
                        <div className="flex flex-col gap-2">
                            <h2>PRODUCTS</h2>
                            <h1>{productCount}</h1>
                        </div>
                        <PiLaptop size={128} />
                    </div>

                    <div className="p-8 flex justify-between items-center h-fit bg-slate-600 text-white rounded-md">
                        <div className="flex flex-col gap-2">
                            <h2>USERS</h2>
                            <h1>{userCount}</h1>
                        </div>
                        <BiUser size={128} />
                    </div>

                    <div className="p-8 flex justify-between items-center h-fit bg-slate-600 text-white rounded-md">
                        <div className="flex flex-col gap-2">
                            <h2>REVENUE</h2>
                            <h1>
                                {totalRevenueEarned
                                    ? totalRevenueEarned.toLocaleString()
                                    : null}
                            </h1>
                        </div>
                        <BiRupee size={128} />
                    </div>
                    <div className="p-8 flex justify-between items-center h-fit bg-slate-600 text-white rounded-md">
                        <div className="flex flex-col gap-2">
                            <h2>REFUNDS</h2>
                            <h1>
                                {totalRefunded
                                    ? totalRefunded!.toLocaleString()
                                    : null}
                            </h1>
                        </div>
                        <BiRupee size={128} />
                    </div>
                </div>
            </div>
        </>
    );
}
