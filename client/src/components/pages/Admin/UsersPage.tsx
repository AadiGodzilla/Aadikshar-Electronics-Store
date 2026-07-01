import { BiSearch } from "react-icons/bi";
import type { IUser } from "../../../types/IUser";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa6";
import { IoEye, IoEyeOff } from "react-icons/io5";
import clsx from "clsx";

export default function UsersAdminPage() {
    const [search, setSearch] = useState<string>("");
    const [users, setUsers] = useState<IUser[]>([]);
    const [display, setDisplay] = useState<IUser[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("http://localhost:5000/user/info", {
                headers: { Authorization: token },
            })
            .then((res) => {
                setUsers(res.data);
                setDisplay(res.data);
            })
            .catch((err) => toast.error(err.message, { theme: "colored" }));
    }, []);

    const searchUsers = useMemo(() => {
        return users.filter((user) => {
            const term = search.toLowerCase();
            return (
                user._id.toLowerCase().includes(term) ||
                user.fullName.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                user.phone.toLowerCase().includes(term)
            );
        });
    }, [search, users]);

    useEffect(() => {
        search === "" ? setDisplay(users) : setDisplay(searchUsers);
    }, [searchUsers]);

    const toggleUser = (id: string) => {
        const token = localStorage.getItem("token");
        axios
            .delete(`http://localhost:5000/user/toggle/${id}`, {
                headers: { Authorization: token },
            })
            .then((res) => {
                toast.success(res.data.message, { theme: "colored" });
                setUsers(res.data.users);
            })
            .catch((err) => {
                toast.error(err.message, { theme: "colored" });
            });
    };

    return (
        <>
            <div className="min-h-screen max-h-fit flex flex-col gap-4">
                <h3 className="text-slate-600">Manage User</h3>
                <form
                    className="flex gap-4 items-center"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <span className="whitespace-nowrap font-bold text-slate-600">
                        Search Users
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
                </form>
                <div className="w-full overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-600 text-white border-white border">
                            <tr className="border border-white">
                                <th className="border-r-white"></th>
                                <th className="border-r-white">User ID</th>
                                <th className="border-r-white">Full Name</th>
                                <th className="border-r-white">
                                    Email Address
                                </th>
                                <th className="border-r-white">Phone Number</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display.map((user, index) => (
                                <tr key={index} className="text-center">
                                    <td className="text-center flex justify-center border-0 text-slate-600">
                                        <FaUser size={24} />
                                    </td>
                                    <td>{user._id}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td
                                        className={clsx(
                                            "font-bold text-center",
                                            user.disabled
                                                ? "text-red-400"
                                                : "text-green-400",
                                        )}
                                    >
                                        {user.disabled ? "DISABLED" : "ACTIVE"}
                                    </td>
                                    <td className="flex items-center justify-center gap-2 border-0">
                                        {user.email !== "admin@shop.com" ? (
                                            <button
                                                className="bg-slate-600 text-white p-2 rounded-md border-0 cursor-pointer hover:bg-slate-400"
                                                onClick={() =>
                                                    toggleUser(user._id)
                                                }
                                            >
                                                {user.disabled ? (
                                                    <IoEye size={24} />
                                                ) : (
                                                    <IoEyeOff size={24} />
                                                )}
                                            </button>
                                        ) : null}
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
