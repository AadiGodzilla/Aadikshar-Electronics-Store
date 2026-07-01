import axios from "axios";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext, type UserContextType } from "../../contexts/UserContext";

export default function Header(props: { color: "dark" | "light" }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [cartLength, setCartLength] = useState<number>(0);
    const { user, setUser } = useContext<UserContextType>(UserContext);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "") return setCartLength(0);

        if (user) {
            setCartLength(user.cart.length);
            return;
        }

        console.log(location.pathname);

        axios
            .get("http://localhost:5000/user", {
                headers: { Authorization: token },
            })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => toast.error(err.message));
    }, [location]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!user || !token || token === "") return setCartLength(0);

        setCartLength(user.cart.length);
    }, [user, location]);

    return (
        <>
            <div
                className={clsx(
                    "w-full flex justify-between items-center px-8 py-4",
                    props.color === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-slate-700",
                )}
            >
                <h1
                    className="font-audiowide cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    AES
                </h1>
                <nav className="flex gap-8">
                    {user && user.email === "admin@shop.com" ? (
                        <a
                            onClick={() => navigate("/admin")}
                            className={clsx(
                                "transition duration-200 cursor-pointer font-semibold ",
                                props.color === "light"
                                    ? "hover:text-slate-300"
                                    : "hover:text-slate-700",
                            )}
                        >
                            Admin Panel
                        </a>
                    ) : null}
                    <a
                        onClick={() => navigate("/")}
                        className={clsx(
                            "transition duration-200 cursor-pointer font-semibold",
                            props.color === "light"
                                ? "hover:text-slate-300"
                                : "hover:text-slate-700",
                        )}
                    >
                        Home
                    </a>
                    <a
                        onClick={() => navigate("/products")}
                        className={clsx(
                            "transition duration-200 cursor-pointer font-semibold",
                            props.color === "light"
                                ? "hover:text-slate-300"
                                : "hover:text-slate-700",
                        )}
                    >
                        Products
                    </a>
                    <a
                        href="#"
                        className={clsx(
                            "transition duration-200 cursor-pointer font-semibold group",
                            props.color === "light"
                                ? "hover:text-slate-300"
                                : "hover:text-slate-700",
                        )}
                        onClick={() => navigate("/cart")}
                    >
                        Cart
                        {cartLength !== 0 ? (
                            <span
                                className={clsx(
                                    "ml-1 py-1 px-2 text-xs rounded-full transition duration-200 font-bold",
                                    props.color === "light"
                                        ? "bg-slate-700 text-white group-hover:bg-slate-300"
                                        : "bg-white text-black group-hover:bg-slate-700 group-hover:text-white",
                                )}
                            >
                                {cartLength}
                            </span>
                        ) : null}
                    </a>
                    <a
                        href="#"
                        className={clsx(
                            "transition duration-200 cursor-pointer font-semibold",
                            props.color === "light"
                                ? "hover:text-slate-300"
                                : "hover:text-slate-700",
                        )}
                        onClick={() => {
                            localStorage.getItem("token")
                                ? navigate("/profile")
                                : navigate("/login");
                        }}
                    >
                        {localStorage.getItem("token") ? "Profile" : "Login"}
                    </a>
                </nav>
            </div>
        </>
    );
}
