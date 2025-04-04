"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";




const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(1, { message: "Age must be at least 1." }),
  adhar: z.coerce.number().min(4, { message: "Enter Last 4 Digits of Adhar" }),
  phone: z.string().length(10, { message: "Phone number must be 10 digits." }),
  email: z.string().email({ message: "Invalid email address." }),
  bloodGroup: z.string().min(1, { message: "Blood group is required." }),
});

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Page for generating Usr UNIQUE ID and Registering User 
export default function GenRegPage() {

  const [isClient, setIsClient] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      adhar: "",
      age: "",
      phone: "",
      email: "",
      bloodGroup: "",
    },
  });
  const router = useRouter()


  useEffect(() => {
    setIsClient(true);
  }, []);


  // Submit Function
  const onSubmit = async (data) => {
    try {
      console.log("User Registered:", data);
      let res = await axios.post("/api/patient/generate", data)
      console.log("resstatus", res.status);

      form.reset()
      router.push("/patient/showinfo")
      toast.success("User Registerd Successfully")
      console.log("Result of register", res)

    } catch (error) {
      if (error.status === 400) {
        toast.error(error.response.data.Message)
        form.reset()
        return
      }
      console.error("Registration error:", error);
      toast.error(error.response.data.Message);
    }
  };

  if (!isClient) return null;



  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-2xl font-semibold text-center mb-4">User Registration</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="9876543210" {...field} maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adhar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Four Digit of Adhar Card</FormLabel>
                  <FormControl>
                    <Input type="tel"
                      placeholder="xxxx-xxxx-xxxx-1234"
                      {...field}
                      maxLength={4}
                      pattern="\d{4}"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Blood Group Dropdown */}

            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your blood group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
