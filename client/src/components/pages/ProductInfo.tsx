import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Counter from "../ui/Counter";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { IProduct } from "../../types/IProduct";
import { toast } from "react-toastify";
import clsx from "clsx";
import { UserContext, type UserContextType } from "../../contexts/UserContext";

export default function ProductInfoPage() {
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState<number>(1);
    const { id } = useParams();

    const [product, setProduct] = useState<IProduct>();
    const [primary, setPrimaryImage] = useState<string>();

    const [imageIndex, setImageIndex] = useState<number>(0);

    const { setUser } = useContext<UserContextType>(UserContext);

    useEffect(() => {
        axios.get(`http://localhost:5000/product/single/${id}`).then((res) => {
            if (!res.data) {
                toast.error("Product does not exists or is hidden", {
                    theme: "colored",
                });
                navigate("/products");
            }
            setProduct(res.data);
            setPrimaryImage(res.data.images[0]);
        });
    }, []);

    const handleAddToCart = () => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        const payload = {
            productId: id,
            image: product?.images[0],
            product: product?.about,
            price: product?.price,
            qty: quantity,
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
            <Header color="light" />
            <div className="m-auto mx-40 grid grid-cols-2 grid-rows-1 gap-16 place-items-center mt-12 mb-4">
                <div className="flex flex-col justify-center gap-4 items-center h-fit">
                    <img
                        src={`http://localhost:5000/${primary}`}
                        className="h-90 w-120 mb-8"
                    />
                    <div className="flex justify-start gap-3 w-full h-16 overflow-y-auto">
                        {product?.images.map((image: string, index: number) => (
                            <img
                                className={clsx(
                                    "w-18 h-16 cursor-pointer",
                                    imageIndex === index
                                        ? "border-slate-500 border-2 rounded-md"
                                        : "",
                                )}
                                src={`http://localhost:5000/${image}`}
                                alt=""
                                onClick={() => {
                                    setPrimaryImage(image);
                                    setImageIndex(index);
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className=" flex flex-col justify-center gap-4 h-fit">
                    <h4 className="text-slate-700">{product?.about}</h4>
                    <h4 className="text-amber-500">
                        NRS {product?.price.toLocaleString()}
                    </h4>
                    <div className="flex gap-4 w-full items-center">
                        <Counter onChange={(value) => setQuantity(value)} />
                        <button
                            className="bg-slate-600 text-white font-bold p-4 rounded-md hover:bg-slate-500 cursor-pointer"
                            onClick={handleAddToCart}
                        >
                            BUY NOW
                        </button>
                    </div>
                    <table className="w-full border-slate-600 border">
                        <thead>
                            <tr
                                key={"component-header"}
                                className="text-white bg-slate-600"
                            >
                                <th>Component</th>
                                <th>Information</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product
                                ? Object.entries(product.info).map(
                                      (
                                          [key, value]: [string, string],
                                          index,
                                      ) =>
                                          index < 4 ? (
                                              <tr
                                                  key={key}
                                                  className="text-slate-600"
                                              >
                                                  <th className="text-center">
                                                      {key}
                                                  </th>
                                                  <td
                                                      key={value}
                                                      className="text-left"
                                                  >
                                                      {value}
                                                  </td>
                                              </tr>
                                          ) : null,
                                  )
                                : null}
                        </tbody>
                    </table>
                </div>
                <div className="col-span-2 flex flex-col gap-8 w-full">
                    <h4 className="text-slate-600">Additional Information</h4>
                    <table className="w-full">
                        <thead>
                            <tr className="text-white bg-slate-600">
                                <th>Component</th>
                                <th>Information</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product
                                ? Object.entries(product?.info).map(
                                      ([key, value]: [string, string]) => (
                                          <tr
                                              key={key}
                                              className="text-center text-slate-600"
                                          >
                                              <th>{key}</th>
                                              <td>{value}</td>
                                          </tr>
                                      ),
                                  )
                                : null}
                        </tbody>
                    </table>
                </div>
                <div className="col-span-2 w-full h-fit">
                    <Footer />
                </div>
            </div>
        </>
    );
}
