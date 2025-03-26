import Image, { StaticImageData } from "next/image";
import { FC } from "react";
import ApointmentButton from "@/components/apointmentButton";

type TeacherProps = {
    photo?: string | StaticImageData;
    availableSlots: number; // Кількість вільних місць
    pib :string,
    link : string,
    degree : string
};

const Teacher: FC<TeacherProps> = ({ photo, degree , pib ,availableSlots,link }) => {

    function handleSubmit(){

    }

    return (

        <div className="w-full px-7 py-5 h-auto flex flex-col md:flex-row items-center bg-[#3b3d93] rounded-[10px] relative overflow-hidden space-y-5 md:space-y-0 md:space-x-5">

            {/* Фото викладача */}
            <div className="flex justify-center   ">
                <div className="bg-white rounded-full overflow-hidden w-[150px] h-[150px]">
                    {photo ? (
                        <Image src={photo} alt="Teacher photo" width={150} height={150} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No Photo
                        </div>
                    )}
                </div>
            </div>

            {/* Інформація про викладача */}
            <div className="flex w-[100%] flex-col text-white">
                <p className="text-2xl font-bold">{pib}</p>
                <p className="text-lg">Факультет комп’ютерних та інформаційних технологій</p>
                <p className="text-lg">Кафедра комп’ютерних наук</p>
                <p className="text-lg">{degree}</p>

                {/* Вільні місця */}
                <p className={`mt-2 text-lg font-semibold ${availableSlots > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {availableSlots > 0 ? `Вільні місця: ${availableSlots}` : "Немає вільних місць"}
                </p>

                <ApointmentButton availableSlots={availableSlots} link={link}/>
            </div>
        </div>
    );
};

export default Teacher;
