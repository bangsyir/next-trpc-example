import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type Inputs = {
  email: string;
  password: string;
};

const inputSchema = z.object({
  email: z.string().min(1, { message: "email is required" }).email(),
  password: z.string().min(1, { message: "password is required" }).min(5),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(inputSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true);
    signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    }).then(
      // @ts-ignore
      ({ ok, error }) => {
        if (error !== null) {
          alert("Uh oh! Somthing went wrong.");
        } else {
          router.push("/dashboard");
        }
        setIsLoading(false);
      }
    );
  };
  return (
    <main className="flex items-center justify-center">
      <div className="w-[300px] pt-24">
        <form method="post" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              {...register("email")}
              className="border rounded-md px-2 py-1"
            />
            <small className="text-red-500">{errors.email?.message}</small>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" htmlFor="name">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="border rounded-md px-2 py-1"
            />
            <small className="text-red-500">{errors.password?.message}</small>
          </div>
          <div>
            <button
              type="submit"
              className="border py-1 px-2 bg-neutral-900 hover:bg-neutral-900/90 text-white rounded-md w-full mt-4"
            >
              {isLoading ? (
                <div className="flex items-center text-center">
                  <span className="animate-spin">S</span> Loading...
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
