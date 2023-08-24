import Image from "next/image";
import { Inter } from "next/font/google";
import { trpc } from "@/utils/trpc";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <span>Main</span>
      <div className="flex items-center gap-4">
        <Link href={"/login"} className="border rounded-md py-1 px-2">
          Login
        </Link>
        <Link href={"/register"} className="border rounded-md py-1 px-2">
          Register
        </Link>
      </div>
    </main>
  );
}
