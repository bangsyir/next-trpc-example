import { trpc } from "@/utils/trpc"

export default function UserPage() {
  const { data, isLoading } = trpc.user.list.useQuery()
  return (
    <div className="container mx-auto">
      <div className="py-4">
        <h2 className="text-2xl font-semibold">Users list</h2>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <dl className="divide-y divide-gray-100">
          <div className="grid grid-cols-3 gap-4 px-0">
            <dt className="font-semibold text-xl">Name</dt>
            <dd className="font-semibold text-xl">Email</dd>
          </div>
          {data?.users.map((user) => (
            <div key={user.id} className="grid grid-cols-3 gap-4 py-4">
              <dt>{user.name}</dt>
              <dd>{user.email}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
