import { useState, type SubmitEvent } from "react";
import NepalDistrict from "../../../types/Districts";
import Select from "../../ui/Select";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddressForm() {
    const navigate = useNavigate();

    const [province, setProvince] = useState<string>("");
    const [district, setDistrict] = useState<string>("");
    const [additional, setAdditional] = useState<string>("");

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        if (province === "" || district === "" || additional === "")
            return toast.error("Please fill all the fields", { theme: "colored" });

        const addrStr = `${additional}, ${district}, ${province}, Nepal`;

        axios
            .post("http://localhost:5000/user/address/add", { address: addrStr }, { headers: { Authorization: token } })
            .then((res) => {
                toast.success(res.data.message, { theme: "colored" });
                navigate("..");
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    };

    return (
        <>
            <form className="grid grid-cols-[auto_1fr] w-full h-fit gap-4 items-center" onSubmit={handleSubmit}>
                <h3 className="col-span-2 text-slate-700">Add an Address</h3>
                <h6 className="text-slate-700">Province</h6>
                <Select
                    label="Select Province"
                    options={Object.fromEntries(Object.keys(NepalDistrict).map((p) => [p, p]))}
                    onChange={(value: string) => {
                        setProvince(value);
                    }}
                />
                <h6 className="text-slate-700">District</h6>
                <Select
                    label="Select District"
                    options={NepalDistrict[province] ? NepalDistrict[province] : {}}
                    onChange={(value) => setDistrict(value)}
                />
                <h6 className="text-slate-700">Landmarks</h6>
                <input
                    type="text"
                    className="border-2 rounded-md text-gray-500 focus:border-slate-400 outline-none border-slate-300 w-full p-2"
                    value={additional}
                    onChange={(e) => setAdditional(e.target.value)}
                />
                <button className="bg-slate-600 p-2 text-white rounded-md cursor-pointer hover:bg-slate-400 transition duration-200">
                    SUBMIT
                </button>
            </form>
        </>
    );
}
