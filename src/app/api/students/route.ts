import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import {revalidatePath} from "next/cache";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { fullName, group, date, teacherId } = await request.json();

    // Перевірка обов'язкових полів
    if (!fullName || !group || !date || !teacherId) {
      return NextResponse.json({ error: 'Усі поля є обов’язковими.' }, { status: 400 });
    }

    // Перевірка валідності teacherId
    if (!ObjectId.isValid(teacherId)) {
      return NextResponse.json({ error: 'Невірний teacherId.' }, { status: 400 });
    }

    // Перевірка формату дати
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Невірний формат дати.' }, { status: 400 });
    }

    // Додавання студента
    const newStudent = await prisma.student.create({
      data: {
        fullName,
        group,
        date: parsedDate,
        teacherId,
      },
    });
    console.log(newStudent)
    revalidatePath(`/${teacherId}`, "page");


    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Помилка при додаванні студента:', (error as Error).message);
    return NextResponse.json({ error: 'Не вдалося додати студента.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}