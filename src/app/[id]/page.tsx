'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import moment from "moment";
import MyCalendar from "@/components/calendar";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

moment.updateLocale('en', {
    // Налаштування локалі (якщо потрібно)
});

interface Student {
    fullName: string;
    group: string;
}

interface Teacher {
    fullName: string;
    faculty: string;
    department: string;
    photo: string;
    startHour: number;
    endHour: number;
    students: Student[];
}

const Appointment = () => {
    const { id } = useParams() as { id: string };  // Замість useParams() перевіряємо наявність id
    const router = useRouter();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);  // Додаємо стан для завантаження
    const [hasMoreThanThreeStudents, setHasMoreThanThreeStudents] = useState(false);

    useEffect(() => {
        if (!id || typeof id !== 'string') return;

        console.log("Fetching teacher for ID:", id); // Лог для перевірки

        const fetchTeacher = async () => {
            try {
                const response = await fetch(`/api/teachers/${id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: Teacher = await response.json();
                if (data.students.length >= 4) {
                    setHasMoreThanThreeStudents(true);
                }
                console.log('Teacher data:', data);
                setTeacher(data);
                setLoading(false);  // Завершуємо завантаження
            } catch (error) {
                console.error('Error fetching teacher:', error);
                setTeacher(null);
                setLoading(false);  // Завершуємо завантаження
            }
        };

        fetchTeacher();
    }, [id]);  // Залежність від id для повторного запиту

    if (loading) {
        return <Loader/>;  // Показуємо loading, поки не прийшли дані
    }

    if (!teacher) {
        return <div>Помилка завантаження даних викладача. Спробуйте пізніше.</div>;
    }

    const availableSlots = 4 - teacher.students.length;

    return (
        <div className="mt-5 flex flex-col items-center">
            <div className="flex py-10 flex-col md:flex-row w-full p-5 bg-white rounded-lg shadow-lg space-y-5 md:space-y-0 md:space-x-10">
                <div className="flex justify-center items-center bg-gray-100 rounded-full overflow-hidden w-[150px] h-[130px] shadow-lg">
                    {teacher.photo ? (
                        <Image src={teacher.photo} alt="Teacher photo" width={200} height={200} className="object-cover" priority />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                            No Photo
                        </div>
                    )}
                </div>
                <div className={'flex space-x-5 flex-row w-[100%] justify-between'}>
                    <div className="flex flex-col text-center md:text-left space-y-3">
                        <p className="text-2xl font-bold text-gray-800">{teacher.fullName}</p>
                        <p className="text-lg text-gray-600">{teacher.faculty}</p>
                        <p className="text-lg text-gray-600">{teacher.department}</p>

                        <p className="text-lg text-gray-600">{teacher.department}</p>
                        <p className={`mt-2 text-lg font-semibold ${availableSlots > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {availableSlots > 0 ? `Вільні місця: ${availableSlots}` : "Немає вільних місць"}
                        </p>
                        <div>
                            {teacher.students.length > 0 ? (
                                teacher.students.map((student, index) => (
                                    <div
                                        key={index}
                                        className={'mt-4 flex  px-6 py-2 w-max bg-[#3b3d93] text-white font-semibold rounded-lg shadow-md text-xl font-bold text-gray-800 transition disabled:bg-gray-500 disabled:cursor-not-allowed'}>
                                        <p>{student.fullName}</p> <p className={'ml-5'}>{student.group}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Немає студентів.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <MyCalendar data={hasMoreThanThreeStudents} startHour={teacher.startHour} endHour={teacher.endHour} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointment;
