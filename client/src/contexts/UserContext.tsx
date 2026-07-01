import { createContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { IUser } from "../types/IUser";

export type UserContextType = {
    user?: IUser;
    setUser: Dispatch<SetStateAction<IUser | undefined>>;
};

export const UserContext = createContext<UserContextType>({ setUser: () => {} });

export function UserProvider(props: { children: ReactNode }) {
    const [user, setUser] = useState<IUser>();

    return (
        <>
            <UserContext.Provider value={{ user, setUser }}>{props.children}</UserContext.Provider>
        </>
    );
}
