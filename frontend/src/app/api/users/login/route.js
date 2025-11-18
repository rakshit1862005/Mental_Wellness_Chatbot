import { connectdb } from "@/dbConfig/dbconfig";
import User from "@/models/usermodel";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

export async function POST(req) {
    await connectdb();

    console.log("Request Recieved");
    const body = await req.json();
    const{email,password}= body;

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if(!user){
        return new Response(JSON.stringify({message:'Email Not Registered',
            email:user.email
        }))
    }
    let match = 0;
    if(password ==  user.password){
        match=1;
    }
    if(match==1){
        return new Response(JSON.stringify({message:'Logged-IN'}))
    }
    else{
        return new Response(JSON.stringify({message:'Incorrect Password'}))
    }


}