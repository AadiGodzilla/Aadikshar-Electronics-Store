import axios from "axios";
import { useState, type SubmitEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function UpdateForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        const payload = {
            fullName,
            email,
            phone,
        };

        if (email === "") payload.email = searchParams.get("email")!.toString();
        else payload.email = email;
        if (fullName === "") payload.fullName = searchParams.get("fullname")!.toString();
        else payload.fullName = fullName;
        if (phone === "") payload.phone = searchParams.get("phone")!.toString();
        else payload.phone = phone;

        axios
            .put("http://localhost:5000/user/update", payload, { headers: { Authorization: token } })
            .then((res) => {
                toast.success(res.data.message, { theme: "colored" });
                navigate("..");
            })
            .catch((err) => {
                toast.success(err.response.data.message, { theme: "colored" });
            });
    };

    return (
        <form className="grid grid-cols-[auto_1fr] w-full h-fit gap-4 items-center" onSubmit={handleSubmit}>
            <h3 className="col-span-2 text-slate-700">Update Information</h3>
            <h6 className="text-slate-700">Full Name</h6>
            <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={searchParams.get("fullname") ?? ""}
                className="border-2 rounded-md text-gray-700 focus:border-slate-400 outline-none border-slate-300 w-full p-2"
            />
            <h6 className="text-slate-700">Email Address</h6>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={searchParams.get("email") ?? ""}
                className="border-2 rounded-md text-gray-700 focus:border-slate-400 outline-none border-slate-300 w-full p-2"
            />
            <h6 className="text-slate-700">Phone Number</h6>
            <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={searchParams.get("phone") ?? ""}
                className="border-2 rounded-md text-gray-700 focus:border-slate-400 outline-none border-slate-300 w-full p-2"
            />
            <button
                type="submit"
                className="bg-slate-600 p-2 text-white rounded-md cursor-pointer hover:bg-slate-400 transition duration-200"
            >
                SUBMIT
            </button>
        </form>
    );
}
