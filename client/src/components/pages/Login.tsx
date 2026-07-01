import axios from "axios";
import { useEffect, useState, type SubmitEvent } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        if (localStorage.getItem("token")) navigate("/");
    }, []);

    const handleLogin = (e: SubmitEvent) => {
        e.preventDefault();

        const payload = { email, password };

        axios
            .post("http://localhost:5000/user/login", payload)
            .then((res) => {
                toast.success("User Login Successful", { theme: "colored" });
                localStorage.setItem("token", res.data.message);
                navigate("/");
            })
            .catch((err) => {
                toast.error(err.response.data.message, { theme: "colored" });
            });
    };

    return (
        <>
            <div className="w-screen h-screen flex justify-center items-center bg-slate-600">
                <form className="flex flex-col gap-4 bg-white px-8 py-4 rounded-md w-120" onSubmit={handleLogin}>
                    <h1 className="relative text-center py-3 font-audiowide text-slate-600">
                        <button
                            type="button"
                            className="absolute left-0 p-1 top-[50%] translate-y-[-50%] text-[16px] flex items-center font-opensans rounded-full cursor-pointer transition duration-200 hover:bg-slate-600 hover:text-white"
                            onClick={() => navigate("/")}
                        >
                            <BiLeftArrowAlt size={32} />
                        </button>
                        <span className="font-audiowide">LOGIN</span>
                    </h1>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="">Email Address</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-slate-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-slate-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="p-2 text-center bg-slate-700 font-bold text-white rounded-md cursor-pointer transition duration-200 hover:bg-slate-500">
                        SIGN IN
                    </button>
                    <p className="text-center">
                        Don't have an Account?{" "}
                        <a href="/register" className="text-slate-600 font-bold hover:underline">
                            Register
                        </a>
                    </p>
                </form>
            </div>
        </>
    );
}
