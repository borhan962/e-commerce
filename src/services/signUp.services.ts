"use server"


export async function signUp(payload:any) {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signup`,
        {
        method:"POST",
        body:JSON.stringify(payload),
        headers:{
            "content-type":"application/json"
        }
        }
    );
     const data = await response.json()
    return data ;

}