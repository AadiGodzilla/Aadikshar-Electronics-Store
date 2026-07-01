import axios from "axios";
import { useContext, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TbTrash } from "react-icons/tb";
import {
    UserContext,
    type UserContextType,
} from "../../../contexts/UserContext";

export default function AddressPage() {
    const navigate = useNavigate();

    const { user, setUser } = useContext<UserContextType>(UserContext);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");
        axios
            .get("http://localhost:5000/user", {
                headers: { Authorization: token },
            })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                return toast.error(err.message, { theme: "colored" });
            });
    }, []);

    const handleRemoveAddress = (index: number) => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        axios
            .delete(`http://localhost:5000/user/address/del/${index}`, {
                headers: { Authorization: token },
            })
            .then((res) => {
                toast.info("Address deleted successfully", {
                    theme: "colored",
                });
                setUser(res.data.user);
            })
            .catch((err) => toast.error(err.response.data.message));
    };

    const handleSetDefault = (index: number) => {
        const token = localStorage.getItem("token");
        if (!token || token === "") navigate("/login");

        axios
            .put(
                `http://localhost:5000/user/address/default/${index.toString()}`,
                {},
                { headers: { Authorization: token } },
            )
            .then((res) => {
                toast.success(res.data.message, { theme: "colored" });
                setUser(res.data.user);
            })
            .catch((err) => {
                return toast.error(err.response.data.message, {
                    theme: "colored",
                });
            });
    };

    return (
        <>
            <div className="flex flex-col gap-4 w-full p-4">
                <h3 className="text-slate-600">Address Book</h3>
                {!user
                    ? null
                    : user.addresses.map((item, index) => (
                          <div
                              className="relative rounded-md border-2 border-slate-300 p-4 cursor-pointer hover:border-slate-600"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetDefault(index);
                              }}
                          >
                              <h6 className="text-slate-600">
                                  Address {index + 1}
                              </h6>
                              <p>{item}</p>
                              {user.defaultAddress !== index ? null : (
                                  <span className="absolute right-0 top-0 mr-2 mt-1 italic text-slate-500">
                                      Default
                                  </span>
                              )}
                              <button
                                  className="absolute right-0 bottom-0 mb-1 mr-2 p-2 text-white bg-slate-600 cursor-pointer transition duration-200 rounded-md hover:bg-slate-400"
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveAddress(index);
                                  }}
                              >
                                  <TbTrash size={16} />
                              </button>
                          </div>
                      ))}
                <button
                    className="flex gap-2 items-center text-white bg-slate-600 cursor-pointer rounded-md p-2 w-fit transition duration-200 hover:bg-slate-400 "
                    onClick={() => navigate("/profile/address/add")}
                >
                    <FaPlus size={16} />
                    Add Address
                </button>
            </div>
        </>
    );
}
