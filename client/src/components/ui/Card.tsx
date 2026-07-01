import axios from "axios";
import { useContext, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext, type UserContextType } from "../../contexts/UserContext";

type CardProp = {
    id: string;
    image: string;
    price: number;
    about: string;
};

export default function Card(props: CardProp) {
    const navigate = useNavigate();

    const { setUser } = useContext<UserContextType>(UserContext);

    const addToCart = (e: MouseEvent) => {
        e.stopPropagation();

        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        const payload = {
            productId: props.id,
            image: props.image,
            product: props.about,
            price: props.price,
            qty: 1,
        };

        axios
            .post("http://localhost:5000/user/cart/add", payload, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                toast.success(res.data.message, { theme: "colored" });
                setUser(res.data.user);
            })
            .catch((err) => {
                toast.error(err.response?.data.message);
            });
    };

    return (
        <>
            <div
                className="flex flex-col items-center w-full gap-4 border-2 p-4 justify-around border-slate-300 rounded-md cursor-pointer hover:border-slate-400 transition duration-200"
                onClick={() => {
                    navigate(`/products/${props.id}`);
                }}
            >
                <img
                    src={`http://localhost:5000/${props.image}`}
                    className="w-full h-40"
                />
                <div className="flex flex-col gap-4 items-center">
                    <p className="text-slate-600 text-sm line-clamp-2">
                        {props.about}
                    </p>
                    <p className="font-bold text-amber-400">
                        NRS. {props.price.toLocaleString()}
                    </p>
                    <button
                        className="p-2 w-full bg-slate-500 text-white cursor-pointer hover:bg-slate-400 rounded-md text-sm font-semibold"
                        onClick={addToCart}
                    >
                        ADD TO CART
                    </button>
                </div>
            </div>
        </>
    );
}
