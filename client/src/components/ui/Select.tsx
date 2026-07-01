import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FaSort } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";

type SelectProp = {
    options: Record<string, string>;
    onChange?: (value: string) => void;
};

export default function Select(props: SelectProp) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isOpen, setOpen] = useState<boolean>(false);
    const [selectedKey, setSelectedKey] = useState<string>(
        Object.keys(props.options)[0],
    );
    const [selectedValue, setSelectedValue] = useState<string>(
        Object.values(props.options)[0],
    );

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        props.onChange ? props.onChange(selectedKey) : "";
    }, [selectedKey]);

    return (
        <>
            <div
                className={clsx(
                    "relative border-2 rounded-md box-border text-gray-500 cursor-pointer select-none",
                    isOpen ? "border-slate-400" : "border-slate-300",
                )}
            >
                <div
                    className="flex flex-col px-3 py-2"
                    onClick={() => setOpen(!isOpen)}
                >
                    <span
                        className={clsx(
                            "flex items-center gap-2 justify-between",
                            "",
                        )}
                    >
                        {selectedValue}
                        <RiArrowDropDownLine size={24} />
                    </span>
                    <span
                        aria-hidden="true"
                        className="invisible h-0 overflow-hidden pointer-events-none"
                    >
                        {Object.values(props.options!).map((value) => (
                            <span
                                key={value}
                                className="flex gap-2 justify-between whitespace-nowrap"
                            >
                                {value}
                                <FaSort size={24} />
                            </span>
                        ))}
                    </span>
                </div>
                <div
                    className={clsx(
                        "absolute w-full top-full left-0 mt-2 text-left p-2 border z-10 bg-white border-gray-400 rounded-md transition-all ease-out duration-200 origin-top",
                        isOpen
                            ? "scale-y-100 opacity-100 visible "
                            : "scale-y-0 opacity-0 invisible",
                    )}
                    ref={dropdownRef}
                >
                    {Object.entries(props.options).map(([key, value]) => (
                        <div
                            key={key}
                            className="p-2 pr-0 hover:bg-gray-200 rounded-md whitespace-nowrap flex justify-between gap-2"
                            onClick={() => {
                                setSelectedKey(key);
                                setSelectedValue(value);
                                setOpen(!isOpen);
                            }}
                        >
                            {value}
                            <span className="h-0 invisible">
                                <FaSort size={24} />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
