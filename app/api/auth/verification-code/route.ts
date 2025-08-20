import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import prisma from '@/lib/prisma';
import { emailCodeDto } from './dto';
import { ZodError } from "zod";


export async function POST(req: Request) {
    try {
        const body = await req.json();

        // ✅ Validate input with Zod
        const parsed = emailCodeDto.safeParse(body);
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
            
        const { email } = parsed.data;
        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return NextResponse.json(
                { error: 'Email is already verified or not exist.' },
                { status: 404 }
            );
        }

         if (user.emailVerified) {
            return NextResponse.json(
                { error: 'Email is already verified or not exist.' },
                { status: 404 }
            );
        }

        // Generate a random verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store the code in Redis with a TTL of 5 minutes
        const redisKey = `VERIF:${email}`;
        await redis.set(redisKey, code, 'EX', 300);

        // Here you would send the code to the user's email
        // For demonstration purposes, we will just log it
        console.log(`Verification code for ${email}: ${code}`);

        return NextResponse.json(
            { message: 'Verification code sent successfully.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error sending verification code:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code.' },
            { status: 500 }
        );
    }
}