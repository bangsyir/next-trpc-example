import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  title: string;
};

export default function DashboardPage() {
  const session = useSession();
  const { register, handleSubmit } = useForm<Inputs>();
  const getTodos = trpc.note.getTodo.useQuery(undefined, {
    enabled: session.data?.user !== undefined,
  });
  const create = trpc.note.create.useMutation({
    onError(error) {
      console.error(error);
    },
    onSettled() {
      getTodos.refetch();
    },
  });
  const setDone = trpc.note.updateDone.useMutation({
    onSettled() {
      getTodos.refetch();
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    create.mutate(data);
  };

  return (
    <main className="container mx-auto pt-10">
      <div className="text-xl pb-8">New Todo</div>
      <form
        method="post"
        className="w-[300px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" htmlFor="name">
            title
          </label>
          <input
            type="text"
            {...register("title")}
            className="border rounded-md px-2 py-1"
          />
        </div>
        <div>
          <button
            type="submit"
            className="border py-1 px-2 bg-neutral-900 hover:bg-neutral-900/90 text-white rounded-md w-full mt-4"
          >
            submit
          </button>
        </div>
      </form>
      {getTodos.isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {getTodos.data?.map((todo, i) => (
            <div key={i}>
              <input
                type="checkbox"
                name="check"
                checked={!!todo.done}
                onChange={() =>
                  setDone.mutate({ id: todo.id, done: todo.done ? 0 : 1 })
                }
              />
              <label htmlFor="check">{todo.title}</label>
            </div>
          ))}
        </>
      )}
    </main>
  );
}
