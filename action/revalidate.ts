"use server";

import { revalidatePath } from "next/cache";

export async function revalidateStudentPage(studentId: string) {
    console.log(`🔄 Ревалідація сторінки студента: /${studentId}`);
    revalidatePath(`/${studentId}`, "page"); // Оновлює сторінку студента
}
