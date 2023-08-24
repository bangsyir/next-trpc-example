import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const inputSchema = z.object({
  name: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(5),
});

export default function RegisterPage() {
  const router = useRouter();
  const { mutate, isLoading } = trpc.user.register.useMutation({
    onSuccess() {
      router.push("/");
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(inputSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    mutate(data);
  };
  return (
    <main className="flex items-center justify-center">
      <div className="w-[300px] pt-24">
        <form method="psot" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="border rounded-md px-2 py-1"
            />
            <small className="text-red-500">{errors.name?.message}</small>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              {...register("email")}
              className="border rounded-md px-2 py-1"
            />
            <small className="text-red-500">{errors.email?.message}</small>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <input
              type="text"
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
