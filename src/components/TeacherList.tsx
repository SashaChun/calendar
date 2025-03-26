"use client";
import { useEffect, useState } from "react";
import Teacher from "@/components/teacher";
import Loader from "@/components/Loader";

interface Student {
    fullName: string;
    group: string;
}

interface Teacher {
    id: string;
    fullName: string;
    photo: string;
    students: Student[];
    degree : string
}

export default function TeacherList() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/teachers`;
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error("Помилка завантаження викладачів");
                const data = await response.json();
                setTeachers(data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    if (loading) return <Loader/>;
    if (!teachers.length) return <div>Немає викладачів для відображення</div>;

    const maxStudents = 4;

    return (
        <div className="mt-10 grid grid-cols-2 gap-5 flex space-x-5">
            {teachers.map((teacher) => {
                const availableSlots = maxStudents - teacher.students.length;

                return (
                    <Teacher
                        link={teacher.id}
                        pib={teacher.fullName}
                        key={teacher.id}
                        photo={teacher?.photo }
                        availableSlots={availableSlots}
                        degree={teacher.degree}
                    />
                );
            })}
        </div>
    );
}
