import { useEffect, useMemo, useState } from "react";
import { BiEdit, BiPlus, BiSearch } from "react-icons/bi";
import type { IProduct } from "../../../types/IProduct";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoEye, IoEyeOff } from "react-icons/io5";
import clsx from "clsx";

export default function ProductAdminPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState<string>("");
    const [products, setProducts] = useState<IProduct[]>([]);
    const [display, setDisplay] = useState<IProduct[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("http://localhost:5000/product/admin", {
                headers: { Authorization: token },
            })
            .then((res) => {
                setProducts(res.data);
            });
    }, []);

    const searchProduct = useMemo(() => {
        return products.filter((item) => {
            const term = search.toLowerCase();
            return (
                item._id.toLowerCase().includes(term) ||
                item.about.toLowerCase().includes(term) ||
                item.category.toLowerCase().includes(term) ||
                item.price.toString().includes(term)
            );
        });
    }, [search]);

    useEffect(() => {
        search === "" ? setDisplay(products) : setDisplay(searchProduct);
    }, [searchProduct, products]);

    const removeProduct = (id: string) => {
        const token = localStorage.getItem("token");
        console.log(token);
        axios
            .put(
                `http://localhost:5000/product/toggle/${id}`,
                {},
                {
                    headers: { Authorization: token },
                },
            )
            .then((res) => {
                toast.success(res.data.message, { theme: "colored" });
                setProducts(res.data.products);
            })
            .catch((err) => toast.error(err.response.data.message));
    };

    return (
        <>
            <div className="flex flex-col gap-4 min-h-screen max-h-fit">
                <h3 className="text-slate-600">Manage Products</h3>
                <form
                    className="flex gap-4 items-center"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <span className="whitespace-nowrap font-bold text-slate-600">
                        Search Products
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
                    <button
                        className="flex whitespace-nowrap gap-2 p-3 rounded-md bg-slate-600 hover:bg-slate-400 cursor-pointer text-white"
                        onClick={() => navigate("/admin/products/add")}
                    >
                        <BiPlus size={24} />
                        Add Product
                    </button>
                </form>
                <div className="w-full">
                    <table className="w-full">
                        <thead className="bg-slate-600 text-white">
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Featured</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {display.map((item) => (
                                <tr>
                                    <td>{item._id}</td>
                                    <td className="flex border-0 items-center gap-4">
                                        <img
                                            src={`http://localhost:5000/${item.images[0]}`}
                                            alt=""
                                            className="w-32 h-24"
                                        />
                                        {item.about}
                                    </td>
                                    <td className="text-slate-600 font-bold text-center">
                                        {item.category.toUpperCase()}
                                    </td>
                                    <td className="font-bold text-amber-400 text-center">
                                        NRS.{item.price.toLocaleString()}
                                    </td>
                                    <td className="text-center text-slate-600 font-bold">
                                        {item.isFeatured ? "YES" : "NO"}
                                    </td>
                                    <td
                                        className={clsx(
                                            "text-center font-bold",
                                            item.hidden
                                                ? "text-red-600"
                                                : "text-green-600",
                                        )}
                                    >
                                        {item.hidden ? "HIDDEN" : "VISIBLE"}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-slate-600 text-white p-2 rounded-md cursor-pointer hover:bg-slate-400"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/products/update/${item._id}`,
                                                    )
                                                }
                                            >
                                                <BiEdit size={24} />
                                            </button>
                                            <button
                                                className="bg-slate-600 text-white p-2 rounded-md cursor-pointer hover:bg-slate-400"
                                                onClick={() =>
                                                    removeProduct(item._id)
                                                }
                                            >
                                                {item.hidden ? (
                                                    <IoEye size={24} />
                                                ) : (
                                                    <IoEyeOff size={24} />
                                                )}
                                            </button>
                                        </div>
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
