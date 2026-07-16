import axios from "axios";
import { useContext, useEffect } from "react";
import { BiPackage, BiUser } from "react-icons/bi";
import { CgLaptop, CgLogOut } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { type UserContextType, UserContext } from "../contexts/UserContext";
import Footer from "../components/ui/Footer";

export default function AdminLayout() {
    const navigate = useNavigate();

    const { setUser } = useContext<UserContextType>(UserContext);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/");

        axios
            .get("http://localhost:5000/user", {
                headers: { Authorization: token },
            })
            .then((res) => {
                setUser(res.data);
                if (res.data.email !== "admin@shop.com") {
                    toast.error("Access Denied", { theme: "colored" });
                    navigate("/");
                }
            });
    }, []);

    return (
        <>
            <div className="flex w-full justify-between items-center p-4 px-8 col-span-2">
                <h3 className="font-audiowide text-slate-600">ADMIN PANEL</h3>
                <p
                    className="font-bold flex gap-1 items-center text-slate-600 select-none cursor-pointer hover:text-slate-400"
                    onClick={() => navigate("/")}
                >
                    <CgLogOut size={32} />
                    GO BACK
                </p>
            </div>
            <div className="grid grid-cols-[220px_1fr] grid-rows-[auto_1fr] m-auto mx-4 min-h-screen">
                <nav className="flex flex-col items-center gap-2 p-3 h-full">
                    <button
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-slate-200 font-bold text-slate-600 cursor-pointer"
                        onClick={() => navigate("/admin/")}
                    >
                        <MdDashboard size={32} />
                        DASHBOARD
                    </button>
                    <button
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-slate-200 font-bold text-slate-600 cursor-pointer"
                        onClick={() => navigate("/admin/orders")}
                    >
                        <BiPackage size={32} />
                        ORDERS
                    </button>
                    <button
                        className="flex items-center  gap-2 w-full px-3 py-2 rounded-md hover:bg-slate-200 font-bold text-slate-600 cursor-pointer"
                        onClick={() => navigate("/admin/products")}
                    >
                        <CgLaptop size={32} />
                        PRODUCTS
                    </button>
                    <button
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-slate-200 font-bold text-slate-600 cursor-pointer"
                        onClick={() => navigate("/admin/users")}
                    >
                        <BiUser size={32} />
                        USERS
                    </button>
                </nav>
                <Outlet />
                <div className="w-full py-4 px-4 col-span-2">
                    <Footer />
                </div>
            </div>
        </>
    );
}
