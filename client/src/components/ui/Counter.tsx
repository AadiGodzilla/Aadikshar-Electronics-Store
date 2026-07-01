import { useEffect, useRef, useState } from "react";

type CounterProp = {
    onChange?: (value: number) => void;
};

export default function Counter(props: CounterProp) {
    const [count, setCount] = useState<number>(1);

    useEffect(() => {
        if (props.onChange) props.onChange(count);
    }, [count]);

    return (
        <>
            <div className="flex items-center h-fit">
                <button
                    className="px-4 py-2 bg-slate-600 text-white font-bold rounded-l-md border border-x-0 cursor-pointer border-slate-700 hover:bg-slate-500 hover:border-slate-500"
                    onClick={() => {
                        setCount(count + 1);
                    }}
                >
                    +
                </button>
                <p className="px-4 py-2 border border-slate-600 text-center w-16 select-none">{count}</p>
                <button
                    className="px-4 py-2 bg-slate-600 text-white font-bold rounded-r-md border border-x-0 border-slate-700 cursor-pointer hover:bg-slate-500 hover:border-slate-500"
                    onClick={() => {
                        if (count > 1) setCount(count - 1);
                    }}
                >
                    -
                </button>
            </div>
        </>
    );
}
