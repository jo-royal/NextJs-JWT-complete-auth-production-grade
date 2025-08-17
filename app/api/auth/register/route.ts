import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { userSchema } from "./dto";
import { ZodError } from "zod";


export async function POST(req: Request) {

  try {
    const body = await req.json();

    // ✅ Validate input with Zod
    const parsed = userSchema.safeParse(body);
    if (!parsed.success) {
      const error = parsed.error as ZodError;

      return NextResponse.json(
        {
          errors: error.issues.map((err : any) => ({
            path: err.path.join("."), // "email", "password", etc.
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { email, password, fname, lname } = parsed.data;


    // check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, //make sure to save hashed password
        fname,
        lname,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
