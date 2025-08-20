import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import prisma from '@/lib/prisma';
import { emailVerifyDto } from './dto';
import { ZodError } from "zod";


export async function POST(req: Request) {
    try {
        const body = await req.json();
    
        // ✅ Validate input with Zod
        const parsed = emailVerifyDto.safeParse(body);
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
        const { email, code } = parsed.data;
        
        // Check if the code exists in Redis
        const redisKey = `VERIF:${email}`;
        const storedCode = await redis.get(redisKey);
        if (!storedCode) {
            return NextResponse.json(
                { error: 'Invalid or expired verification code' },
                { status: 400 }
            );
        }
        // Check if the code matches
        if (storedCode !== code) {
            return NextResponse.json(
                { error: 'Invalid verification code.' },
                { status: 400 }
            );
        }
        // Update the user's email verification status in the database
        await prisma.user.update({
            where: { email },
            data: { emailVerified: true }, //also set account_is_active = true if by default it is false and you want to activate the account after email verification
            // data: { emailVerified: true, account_is_active: true }
        });
        // Delete the code from Redis
        await redis.del(redisKey);
        return NextResponse.json(
            { message: 'Email verified successfully.' },
            { status: 200 }
        );
       
    } catch (error) {
        console.error('Error verifying email:', error);
        return NextResponse.json(
            { error: 'Failed to verify email.' },
            { status: 500 }
        );

    }
}
