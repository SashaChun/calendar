'use client'

import {useRouter} from "next/navigation";
import {FC} from "react";

type ApointmentButton = {
    availableSlots : number,
    link : string
}

const ApointmentButton:FC<ApointmentButton> = ({availableSlots , link}) => {

    const router = useRouter();

    const handleNavigation = () => {
        router.push( `/${link}`);
    };

    return <div>
        <button
            onClick={handleNavigation}
            className="mt-4 px-6 py-2 w-[100%] bg-white text-[#3b3d93] font-semibold rounded-lg shadow-md
                    hover:bg-gray-200 transition disabled:bg-gray-500 disabled:cursor-not-allowed"

        >
            Записатися
        </button>
    </div>
}

export default ApointmentButton;