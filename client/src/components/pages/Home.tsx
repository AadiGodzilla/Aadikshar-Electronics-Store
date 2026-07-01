import Header from "../ui/Header";
import {
    PiCpuBold,
    PiGraphicsCardBold,
    PiMonitorBold,
    PiUsbBold,
} from "react-icons/pi";
import { LuHardDrive, LuMemoryStick } from "react-icons/lu";
import Footer from "../ui/Footer";
import { useContext, useEffect } from "react";
import { UserContext, type UserContextType } from "../../contexts/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function HomePage() {
    const navigate = useNavigate();

    const { user, setUser } = useContext<UserContextType>(UserContext);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios
            .get("http://localhost:5000/user", {
                headers: { Authorization: token },
            })
            .then((res) => setUser(res.data))
            .catch((err) => toast.error(err.message));
    }, []);

    return (
        <>
            <Header color="dark" />
            <div className="flex flex-col w-full">
                <div className="w-full min-h-screen bg-black flex gap">
                    <img
                        src="/src/assets/images/header.jpg"
                        className="w-[50%] h-screen bg-contain"
                    />
                    <div className="w-full h-screen flex flex-col justify-center items-center gap-8">
                        <h1 className="font-audiowide text-white text-center">
                            THE GROWLING ENGINE OF CHANGE
                        </h1>
                        <button
                            className="bg-slate-700 text-white py-2 px-4 cursor-pointer hover:bg-slate-500 transition duration-200"
                            onClick={() => navigate("/products")}
                        >
                            SHOW NOW &gt;
                        </button>
                    </div>
                </div>
                <div className="w-full p-16 min-h-screen max-h-fit bg-white flex items-center justify-center">
                    <div className="flex flex-col justify-center items-center gap-8 box-border p-8 h-full w-[50%]">
                        <h1 className="text-center text-black font-audiowide">
                            BUGET-FRIENDLY FUNCTIONALITY FOR STUDENTS AND
                            FAMILIES
                        </h1>
                        <button
                            className="bg-slate-700 cursor-pointer transition duration-200 hover:bg-slate-500 text-white w-fit py-2 px-4"
                            onClick={() => navigate("/products")}
                        >
                            Go to Products &gt;
                        </button>
                    </div>
                    <img
                        src="/src/assets/images/laptop.png"
                        className="h-120 w-160"
                    />
                </div>
                <div className=" w-full min-h-screen max-h-fit flex flex-col py-16 px-8 gap-12 justify-cente items-center bg-[url(/src/assets/images/info_background.jpg)] bg-cover bg-no-repeat ">
                    <h1 className="font-audiowide text-white">
                        BEST PLACE TO GET GAMING READY LAPTOPS
                    </h1>
                    <img src="/src/assets/images/laptop2.png" width={"340px"} />
                    <h3 className="text-white">ASUS TUF F16 Pro</h3>
                    <ul className="text-white col-end-2 columns-2 gap-8 leading-12 text-xl">
                        <li className="flex items-center gap-2">
                            <PiCpuBold size={32} />
                            AMD Ryzen 7 7780HS
                        </li>
                        <li className="flex items-center gap-2">
                            <PiGraphicsCardBold size={32} />
                            Nvidia RTX 4060 8GB GDDR6
                        </li>
                        <li className="flex items-center gap-2">
                            <LuMemoryStick size={32} />
                            32GB DDR5 5600Mhz RAM
                        </li>
                        <li className="flex items-center gap-2">
                            <LuHardDrive size={32} />2 TB NVME SSD
                        </li>
                        <li className="flex items-center gap-2">
                            <PiMonitorBold size={32} />
                            1080P FHD Anti Glare Display 180Hz
                        </li>
                        <li className="flex items-center gap-2">
                            <PiUsbBold size={32} />
                            USB 3.0 and HDMI 3.2 Support
                        </li>
                    </ul>
                </div>
                <div className="w-full bg-white flex flex-col items-center gap-8 p-8">
                    <h1 className="font-audiowide text-center">CONTACT US</h1>
                    <form className="flex flex-col items-center w-[75%] gap-4 ">
                        <div className="grid grid-cols-2 grid-rows-3 gap-8 w-full justify-center">
                            <input
                                type="text"
                                className="border border-black col-start-1 col-end-1 p-3"
                                placeholder="Enter Name"
                            />
                            <input
                                type="text"
                                className="border border-black col-start-1 col-end-1 p-3"
                                placeholder="Enter Subject"
                            />
                            <input
                                type="text"
                                className="border border-black col-start-1 col-end-1 p-3"
                                placeholder="Enter Email Address"
                            />
                            <textarea
                                name=""
                                id=""
                                className="border border-black col-start-2 row-start-1 col-span-2 row-span-3 p-3 resize-none"
                                placeholder="Enter Message"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="self-end bg-slate-700 cursor-pointer transition duration-200 hover:bg-slate-500 text-white px-4 py-2"
                        >
                            SUBMIT
                        </button>
                    </form>
                    <Footer />
                </div>
            </div>
        </>
    );
}
