'use client';

import { FC, useState } from 'react';
import { Calendar, momentLocalizer, View, SlotPropGetter } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import StydenForm from '@/components/stydenForm';
import { useParams } from 'next/navigation';

// Налаштовуємо moment на 24-годинний формат
moment.updateLocale('en', {
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY-MM-DD',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY LT',
        LLLL: 'dddd, MMMM D, YYYY LT'
    },
});

const localizer = momentLocalizer(moment);

interface Params {
    id: string;
}

interface MyCalendarProps {
    startHour: number;
    endHour: number;
    data: boolean;
}

interface FormData {
    name: string;
    group: string;
}

const MyCalendar: FC<MyCalendarProps> = ({ startHour, data, endHour }) => {
    const [currentView, setCurrentView] = useState<View>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    const [formData, setFormData] = useState<FormData>({ name: '', group: '' });

    const params = useParams() as unknown as Params;
    const { id } = params;

    let btnStyle = { btnText: 'Записатися', btnStyle: 'bg-[#3b3d93] text-white py-2 px-4 rounded-md' };

    const events: any[] = [];

    const handleViewChange = (view: View) => {
        setCurrentView(view);
    };

    const roundToQuarter = (date: Date) => {
        const minutes = date.getMinutes();
        const roundedMinutes = Math.round(minutes / 15) * 15;
        date.setMinutes(roundedMinutes);
        return date;
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Функція для форматування дати в ISO 8601 формат з часовою зоною
        const formatToISOString = (date: Date | null): string => {
            if (!date) return '';
            return date.toISOString(); // Повертає дату у форматі '2025-03-25T10:00:00.000Z'
        };

        // Форматуємо дату
        const formattedStartDate = formatToISOString(selectedStartDate);

        try {
            const teacherResponse = await fetch(`/api/teachers/${id}`, {
                cache: 'no-store'
            });
            const teacherData = await teacherResponse.json();

            // Перевіряємо, чи отримали викладача та його студентів
            if (!teacherData || !teacherData.students) {
                alert('Не вдалося знайти інформацію про викладача або його студентів.');
                return;
            }

            if (teacherData.students.length >= 4) {
                return btnStyle = { btnText: 'Немає відьних мість', btnStyle: 'bg-red-700 text-white py-2 px-4 rounded-md' };
            }

            const studentData = {
                "fullName": formData.name,
                "group": formData.group,
                "date": formattedStartDate,
                "teacherId": id
            };

            console.log(studentData);

            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Student created:', data);
        } catch (error) {
            console.error('Error submitting form:', (error as Error).message);
        }
    };

    console.log('Початкова дата:', moment(selectedStartDate).format('YYYY-MM-DD HH:mm').slice(0, 16)); // Перші 16 символів
    console.log('Кінцева дата:', moment(selectedEndDate).format('YYYY-MM-DD HH:mm').slice(0, 16)); // Перші 16 символів

    // Функція для перевірки доступних годин
    const isSlotAvailable = (date: Date) => {
        const hour = date.getHours();
        return hour >= startHour && hour < endHour;
    };

    // Функція для стилізації доступних слотів
    const slotPropGetter: SlotPropGetter = (date: Date) => {
        const available = isSlotAvailable(date);
        return {
            style: {
                backgroundColor: available ? '#3b3d93' : 'lightgrey',
                pointerEvents: available ? 'auto' : 'none' as 'auto' | 'none', // Явне вказання типу
            },
        };
    };



    console.log('data boolean', data)

    return (
        <div style={{ height: 500 }}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-3">
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'month').toDate())}
                    >
                        Назад
                    </button>
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => setCurrentDate(new Date())}
                    >
                        Сьогодні
                    </button>
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => setCurrentDate(moment(currentDate).add(1, 'month').toDate())}
                    >
                        Наступний
                    </button>
                </div>

                <div className="flex space-x-3">
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => handleViewChange('month')}
                    >
                        Місяць
                    </button>
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => handleViewChange('week')}
                    >
                        Тиждень
                    </button>
                    <button
                        className="bg-[#3b3d93] px-2 py-1 rounded-[10px] text-white"
                        onClick={() => handleViewChange('day')}
                    >
                        День
                    </button>
                </div>
            </div>

            <div className="mt-3">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week', 'day']}
                    view={currentView}
                    date={currentDate}
                    selectable
                    onSelectSlot={(slotInfo) => {
                        setCurrentView('day');
                        const roundedStart = roundToQuarter(slotInfo.start);
                        const endDate = new Date(roundedStart);
                        endDate.setMinutes(endDate.getMinutes() + 15);

                        if (isSlotAvailable(roundedStart)) {
                            setSelectedStartDate(roundedStart);
                            setSelectedEndDate(endDate);
                            setCurrentView('day');
                        }
                    }}
                    onNavigate={(date) => setCurrentDate(date)}
                    style={{ width: 500, height: 300 }}
                    step={15}
                    timeslots={1}
                    components={{
                        toolbar: () => null,
                    }}
                    slotPropGetter={slotPropGetter}
                />
            </div>

            {selectedStartDate && selectedEndDate && (
                <p className="mt-4 text-center">
                    Початкова дата: <b>{moment(selectedStartDate).format('YYYY-MM-DD HH:mm')}</b><br />
                    Кінцева дата: <b>{moment(selectedEndDate).format('YYYY-MM-DD HH:mm')}</b>
                </p>
            )}
            {
                data ?
                    <div className="bg-red-500 text-white py-3 px-6 rounded-lg text-center font-bold shadow-md mt-5">
                        <span>Немає вільного місця</span>
                    </div> : <StydenForm btnText={btnStyle.btnText} btnStyle={btnStyle.btnStyle} availableSlots={1}
                                         handleFormSubmit={handleFormSubmit} formData={formData}
                                         setFormData={setFormData}/>
            }
        </div>
    );
};

export default MyCalendar;