import Header from "../components/ui/Header";
import { PiAddressBook, PiPackage } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/ui/Footer";
import { LuLogOut } from "react-icons/lu";
import { useEffect } from "react";

export default function ProfileLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");
    }, []);

    return (
        <>
            <Header color="light" />
            <div className="flex mx-32 m-auto min-h-screen max-h-fit">
                <nav className="p-4 flex flex-col items-center gap-2 w-60">
                    <button
                        className="text-center w-full p-2 rounded-md text-slate-700 hover:bg-gray-200 font-bold flex items-center gap-4 cursor-pointer"
                        onClick={() => navigate("/profile")}
                    >
                        <CgProfile size={32} />
                        HOME
                    </button>
                    <button
                        className="text-center w-full p-2 rounded-md text-slate-700 hover:bg-gray-200 font-bold flex items-center gap-4 cursor-pointer"
                        onClick={() => navigate("/profile/orders")}
                    >
                        <PiPackage size={32} />
                        ORDERS
                    </button>
                    <button
                        className="text-center w-full p-2 rounded-md text-slate-700 hover:bg-gray-200 font-bold flex items-center gap-4 cursor-pointer"
                        onClick={() => navigate("/profile/address")}
                    >
                        <PiAddressBook size={32} />
                        ADDRESSES
                    </button>
                    <button
                        className="text-center w-full p-2 rounded-md text-slate-700 hover:bg-gray-200 font-bold flex items-center gap-4 mt-auto cursor-pointer"
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                        }}
                    >
                        <LuLogOut size={32} />
                        LOGOUT
                    </button>
                </nav>
                <Outlet />
            </div>
            <div className="m-auto mx-32">
                <Footer />
            </div>
        </>
    );
}
