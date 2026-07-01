import { FaSearch } from "react-icons/fa";
import Header from "../ui/Header";
import Select from "../ui/Select";
import { FaFilter } from "react-icons/fa6";
import Card from "../ui/Card";
import Footer from "../ui/Footer";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { IProduct } from "../../types/IProduct";

export default function ProductPage() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [display, setDisplay] = useState<IProduct[]>([]);
    const [search, setSearch] = useState<string>("");
    const [priceSort, setPriceSort] = useState<"asc" | "des" | "default">(
        "default",
    );
    const [category, setCategory] = useState<string>("all");

    useEffect(() => {
        axios.get("http://localhost:5000/product").then((res) => {
            setProducts(res.data);
            const products = res.data as IProduct[];
            const filter = products.filter(
                (item) => item.isFeatured && !item.hidden,
            );
            setDisplay(filter);
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
        search === ""
            ? setDisplay(products.filter((item) => item.isFeatured))
            : setDisplay(searchProduct);
    }, [searchProduct]);

    return (
        <>
            <Header color="light" />
            <div className="flex flex-col p-8 items-center m-auto mx-40 gap-4">
                <form
                    className="relative flex items-center gap-4 w-full"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <input
                        type="text"
                        className="w-full border-2 border-slate-300 px-4 py-2 rounded-md outline-none focus:border-2 focus:border-slate-400 focus:outline-none"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder="Search Product"
                    />
                    <button className="absolute p-2 right-1 flex gap-2 cursor-pointer">
                        <FaSearch color="oklch(37.2% 0.044 257.287)" />
                    </button>
                </form>
                <div className="flex items-center gap-4 w-full">
                    <FaFilter color="oklch(37.2% 0.044 257.287)" />
                    <label className="text-slate-500">Category:</label>
                    <Select
                        onChange={(e) => setCategory(e)}
                        options={{
                            all: "All",
                            basic: "Basic",
                            gaming: "Gaming",
                            business: "Business",
                            "low power": "Low Power",
                            workstation: "workstation",
                        }}
                    />
                    <label className="text-slate-500">Price:</label>
                    <Select
                        onChange={(e) => setPriceSort(e as "asc" | "des")}
                        options={{
                            default: "Default",
                            asc: "Low to High",
                            des: "High to Low",
                        }}
                    />
                </div>
                <div className="w-full flex flex-col gap-4">
                    <h3 className="text-slate-700">Features</h3>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8 justify-center w-full">
                        {display
                            .filter((item) =>
                                category !== "all"
                                    ? item.category === category
                                    : item,
                            )
                            .sort((a, b) => {
                                if (priceSort !== "default") {
                                    return priceSort === "asc"
                                        ? a.price - b.price
                                        : b.price - a.price;
                                } else {
                                    return a.price;
                                }
                            })
                            .map((item) => (
                                <Card
                                    image={`${item.images[0]}`}
                                    id={item._id}
                                    price={item.price}
                                    about={item.about}
                                />
                            ))}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
