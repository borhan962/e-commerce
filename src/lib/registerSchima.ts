import zod from "zod";
import z from "zod";

 
 
 export  const  formSchema = z.object({
    name:zod.string().min(3, "Name must be at least 3 characters long"),
    email:zod.string().email("Please enter a valid email address"),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rePassword: z.string(),
    phone:zod.string().regex(/^[0-9]{11}$/, "Phone number must be 10 digits"),
  }).refine((data) => data.password === data.rePassword, {
    message: 'Passwords do not match',
    path: ['rePassword'], // Highlights the confirmPassword field
  });