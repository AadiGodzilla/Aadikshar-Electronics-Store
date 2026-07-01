import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { IUser } from "../../types/IUser";
import { UserContext, type UserContextType } from "../../contexts/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function PaymentVerify() {
    const navigate = useNavigate();

    const [query] = useSearchParams();

    const { setUser } = useContext<UserContextType>(UserContext);

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
                const u = res.data as IUser;

                const pidx = query.get("pidx");
                const status = query.get("status");

                if (!pidx || pidx === "") return;

                if (status === "Pending") {
                    toast.warn("Purchase still pending", {
                        theme: "colored",
                    });
                    navigate("/cart");
                    return;
                } else if (status === "Refunded") {
                    toast.error("Product already refunded", {
                        theme: "colored",
                    });
                    navigate("/cart");
                    return;
                } else if (status === "Initiated") {
                    toast.info("Purchase transaction initiated", {
                        theme: "colored",
                    });
                    navigate("/cart");
                } else if (status === "Expired") {
                    toast.error("Transaction window has expired", {
                        theme: "colored",
                    });
                    navigate("/cart");
                    return;
                } else if (status?.toLowerCase() === "user canceled") {
                    toast.error("Transaction cancelled by the user", {
                        theme: "colored",
                    });
                    navigate("/cart");
                    return;
                }

                if (!u) {
                    toast.error("User not Found", { theme: "colored" });
                    return;
                }

                const products: { product: string; qty: number }[] = [];
                u.cart.forEach((item) =>
                    products.push({ product: item.productId, qty: item.qty }),
                );

                const order = {
                    pidx: pidx,
                    products: products,
                    shippingAddress: u.addresses[u.defaultAddress],
                };

                if (status === "Completed") {
                    axios
                        .post("http://localhost:5000/order", order, {
                            headers: { Authorization: token },
                        })
                        .then((res) => {
                            toast.success(res.data.message, {
                                theme: "colored",
                            });
                            navigate("/cart");
                        })
                        .catch((err) => {
                            toast.error(err.response.data.message, {
                                theme: "colored",
                            });
                            navigate("/cart");
                        });
                }
            });
    }, []);

    return <></>;
}
