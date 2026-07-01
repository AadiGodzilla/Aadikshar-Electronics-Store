import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import type { IProduct } from "../../../types/IProduct";

type ProductCategory =
    | "basic"
    | "business"
    | "gaming"
    | "low power"
    | "workstation";

export default function UpdateProductForm() {
    const { id } = useParams();

    const inputRef = useRef<HTMLInputElement>(null);
    const [about, setAbout] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [isFeatured, setFeatured] = useState<boolean>(false);
    const [category, setCategory] = useState<ProductCategory>("basic");
    const [files, setFiles] = useState<File[]>([]);
    const [info, setInfo] = useState<[string, string][]>([["", ""]]);

    useEffect(() => {
        let cancelled = false;

        axios
            .get(`http://localhost:5000/product/admin/single/${id}`, {
                headers: { Authorization: localStorage.getItem("token") },
            })
            .then((res) => {
                const product = res.data as IProduct;

                setAbout(product.about);
                setPrice(product.price);
                setFeatured(product.isFeatured);
                setCategory(product.category);
                setInfo(Object.entries(product.info));

                if (!cancelled)
                    product.images.forEach((image) => {
                        axios
                            .get(`http://localhost:5000/${image}`, {
                                responseType: "blob",
                                headers: { "Content-Type": "image/jpeg" },
                            })
                            .then((res) => {
                                setFiles((prev) => [...prev, res.data]);
                            });
                    });
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const addFiles = (f: FileList | null) => {
        const images = Array.from(f!).filter((item) =>
            item.type.startsWith("image/"),
        );
        setFiles((prev) => [...prev, ...images]);
    };

    const handleUpdateInfo = (
        index: number,
        tupleIndex: 0 | 1,
        value: string,
    ) => {
        setInfo((prevInfo) =>
            prevInfo.map((item, i) => {
                if (i === index) {
                    const updatedTuple = [...item] as [string, string];
                    tupleIndex === 0
                        ? (updatedTuple[tupleIndex] = value.trim())
                        : (updatedTuple[tupleIndex] = value);
                    return updatedTuple;
                }
                return item;
            }),
        );
    };

    const handleRemoveFile = (i: number) => {
        setFiles((prev) => prev.filter((_, index) => i !== index));
    };

    const handleSubmit = () => {
        const token = localStorage.getItem("token");
        let error = false;

        if (files.length === 0) {
            error = true;
            return toast.error("Please provide at least one product image");
        }

        if (info.length < 5) {
            error = true;
            return toast.error(
                "Write at least five components of the product",
                {
                    theme: "colored",
                },
            );
        }

        info.forEach((item) => {
            if (item[0] === "" || item[1] === "") {
                error = true;
                return toast.error("Component field cannot be empty", {
                    theme: "colored",
                });
            }
        });

        const formData = new FormData();
        formData.append("_id", id!.toString());
        formData.append("about", about);
        formData.append("price", price.toString());
        formData.append("info", JSON.stringify(Object.fromEntries(info)));
        formData.append("isFeatured", String(isFeatured));
        formData.append("category", category);
        files.forEach((file) => {
            formData.append(
                "images",
                new File([file], "image.jpg", { type: "image/jpeg" }),
            );
            console.log(file);
        });

        if (!error) {
            axios
                .put("http://localhost:5000/product", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: token,
                    },
                })
                .then((res) => {
                    toast.success(res.data.message, { theme: "colored" });
                })
                .catch((err) => {
                    toast.error(err.response.data.message, {
                        theme: "colored",
                    });
                });
        }
    };

    return (
        <>
            <form
                className="grid grid-cols-[auto_1fr] gap-2 items-center justify-center min-h-screen max-h-fit"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className="flex justify-between col-span-2">
                    <h3 className="text-slate-600 pb-2">Update Product</h3>
                    <button
                        type="submit"
                        className="bg-slate-600 text-white px-2 cursor-pointer hover:bg-slate-400 rounded-md"
                    >
                        Update Product
                    </button>
                </div>
                <h6 className="text-slate-600">Product Name: </h6>
                <input
                    type="text"
                    className="border-2 border-slate-300 p-2 rounded-md outline-none focus:border-slate-400"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                />
                <h6 className="text-slate-600">Product Images: </h6>
                <div className="overflow-x-auto w-full flex gap-2 items-center">
                    {files.map((file, i) => (
                        <div className="relative shrink-2 p-4 border-2 border-slate-300 rounded-md">
                            <img
                                src={URL.createObjectURL(file)}
                                className="w-56 h-48 box-border p-4 shrink-2"
                            />
                            <button
                                type="button"
                                className="absolute bg-slate-600 text-white top-2 right-2 rounded-md cursor-pointer hover:bg-slate-400 p-1"
                                onClick={() => handleRemoveFile(i)}
                            >
                                <BiMinus size={24} />
                            </button>
                        </div>
                    ))}
                    <div
                        className="border-2 w-56 h-48 shrink-0 text-slate-600 flex justify-center items-center border-slate-300 hover:border-slate-400 cursor-pointer rounded-md"
                        onClick={() => {
                            inputRef.current?.click();
                        }}
                    >
                        <BiPlus size={128} />
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        ref={inputRef}
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                            addFiles(e.target.files);
                        }}
                    />
                </div>
                <h6 className="text-slate-600">Product Price: </h6>
                <input
                    type="number"
                    className="border-2 border-slate-300 p-2 rounded-md outline-none focus:border-slate-400"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                />
                <h6 className="text-slate-600">Featured Product: </h6>
                <div className="w-fit h-fit">
                    <input
                        type="checkbox"
                        className="w-8 h-8 bg-slate-600 cursor-pointer"
                        checked={isFeatured}
                        onClick={() => setFeatured(!isFeatured)}
                    />
                </div>
                <h6 className="text-slate-600">Category:</h6>
                <select
                    className="border-2 border-slate-300 p-2 rounded-md cursor-pointer hover:border-slate-400"
                    onChange={(e) =>
                        setCategory(
                            e.target.value as unknown as ProductCategory,
                        )
                    }
                    value={category}
                >
                    <option value="basic">Basic</option>
                    <option value="business">Business</option>
                    <option value="gaming">Gaming</option>
                    <option value="low power">Low Power</option>
                    <option value="workstation">WorkStation</option>
                </select>
                <h6 className="text-slate-600">Additional Information: </h6>
                <div className="w-full flex flex-col gap-2">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-600 text-white">
                                <th>Component</th>
                                <th>Information</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {info.map((item, index) => (
                                <tr key={index} className="p-0 m-0">
                                    <td className="p-0">
                                        <input
                                            type="text"
                                            value={item[0]}
                                            onChange={(e) =>
                                                handleUpdateInfo(
                                                    index,
                                                    0,
                                                    e.target.value,
                                                )
                                            }
                                            className="p-2 w-full m-0 outline-none"
                                        />
                                    </td>
                                    <td className="p-0">
                                        <input
                                            type="text"
                                            value={item[1]}
                                            onChange={(e) =>
                                                handleUpdateInfo(
                                                    index,
                                                    1,
                                                    e.target.value,
                                                )
                                            }
                                            className="p-2 w-full m-0 outline-none"
                                        />
                                    </td>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className={clsx(
                                                "p-2 bg-slate-600 cursor-pointer rounded-md hover:bg-slate-400 text-white disabled:opacity-50 disabled:cursor-default disabled:hover:bg-slate-600",
                                            )}
                                            disabled={info.length <= 1}
                                            onClick={() => {
                                                setInfo(
                                                    info.filter(
                                                        (_, i) => i !== index,
                                                    ),
                                                );
                                            }}
                                        >
                                            <BiTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        type="button" // Prevents intentional form submission resets
                        className="bg-slate-600 w-full p-1 font-bold text-white cursor-pointer rounded-md flex justify-center items-center gap-2 hover:bg-slate-400"
                        onClick={() => setInfo([...info, ["", ""]])}
                    >
                        <BiPlus size={24} />
                        Add Row
                    </button>
                </div>
            </form>
        </>
    );
}
