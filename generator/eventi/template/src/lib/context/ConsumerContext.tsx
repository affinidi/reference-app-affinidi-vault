import { Dispatch, SetStateAction, createContext } from "react";
import {UserInfo} from "../../types/types";

export interface ConsumerInfoProps {
    userId: string;
    user: UserInfo;
}

export const ConsumerInfoValue = {
    userId: '',
    user: {
        email: "",
        familyName: "",
        givenName: "",
        middleName: "",
        // picture: "",
        country: "",
        nickname: "",
        // phoneNumber: "",
        gender: "",
        birthdate: "",
        postalCode: "",
        city: "",
        address: "",
        verified: false,
    }
}

export const ConsumerContext = createContext<[ConsumerInfoProps, Dispatch<SetStateAction<ConsumerInfoProps>>]>(([ConsumerInfoValue, () => { }]));