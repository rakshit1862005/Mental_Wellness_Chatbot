'use server'
import { connectdb } from "@/dbConfig/dbconfig";
import User from "@/models/usermodel";

export async function POST(req) {
    await connectdb();

    console.log("Signup Request Received");
    
    try {
        const body = await req.json();
        const { name, email, password, emergencyContact } = body;

        // Validate required fields
        if (!name || !email || !password) {
            return new Response(
                JSON.stringify({ 
                    message: 'Missing required fields',
                    success: false 
                }),
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            email: email.trim().toLowerCase() 
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({ 
                    message: 'Email already registered',
                    success: false 
                }),
                { status: 409 }
            );
        }

        // Create new user
        const newUser = new User({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password, // Note: In production, hash this password!
            contact: emergencyContact ? emergencyContact.trim() : null,
            createdAt: new Date()
        });

        await newUser.save();

        return new Response(
            JSON.stringify({ 
                message: 'Account created successfully',
                success: true,
                email: newUser.email
            }),
            { status: 201 }
        );

    } catch (error) {
        console.error("Signup error:", error);
        return new Response(
            JSON.stringify({ 
                message: 'Server error occurred',
                success: false 
            }),
            { status: 500 }
        );
    }
}