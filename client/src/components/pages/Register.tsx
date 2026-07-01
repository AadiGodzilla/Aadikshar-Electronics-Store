import axios from "axios";
import { useEffect, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [fullname, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirm, setConfirm] = useState<string>("");

    useEffect(() => {
        if (localStorage.getItem("token")) navigate("/");
    }, []);

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const payload = {
            fullName: fullname,
            email: email,
            phone: phone,
            password: password,
        };

        if (password !== confirm) {
            toast.error("Password do not match", { theme: "colored" });
            return;
        }

        axios
            .post("http://localhost:5000/user", payload)
            .then((res) => {
                toast.success(res.data.message, {
                    theme: "colored",
                });
                navigate("/login");
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: "top-right",
                    theme: "colored",
                });
            });
    };

    return (
        <>
            <div className="w-screen h-screen flex justify-center items-center bg-slate-600">
                <form
                    className="flex flex-col gap-4 bg-white px-8 py-4 rounded-md w-120"
                    onSubmit={handleSubmit}
                >
                    <h1 className="relative text-center py-3 font-audiowide text-slate-600">
                        <span className="font-audiowide">REGISTER</span>
                    </h1>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-slate-600"
                            value={fullname}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-slate-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="">Phone Number</label>
                        <input
                            type="tel"
                            className="w-full p-2 border border-slate-600"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-slate-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-slate-600"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="p-2 text-center bg-slate-700 font-bold text-white rounded-md cursor-pointer transition duration-200 hover:bg-slate-500"
                    >
                        SIGN UP
                    </button>
                    <p className="text-center">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-slate-600 font-bold hover:underline"
                        >
                            Register
                        </a>
                    </p>
                </form>
            </div>
        </>
    );
}
