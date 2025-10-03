import Navbar from "@/components/global/navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col">
      <Navbar />
      <section className="h-screen w-full flex justify-between items-center px-25">
        <div className="flex flex-col gap-6 items-start max-w-xl md:w-1/2">
          <h1 className="text-primary font-sans text-5xl md:text-6xl font-bold tracking-wide leading-tight">
            Stay Safe, Stay Healthy
          </h1>
          <p className="text-gray-700 dark:text-gray-200 text-lg leading-snug">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, explicabo a ipsa sunt obcaecati autem?
            <br />Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur, facere.
          </p>
          <Button className="px-8 py-6 mt-2 text-lg font-medium font-sans rounded w-fit">
            Get Started
          </Button>
        </div>
        <Image
          src='/1.svg'
          alt="Logo"
          width={0}
          height={32}
          sizes="80vw"
          style={{ width: 'auto', height: '60%' }}
        />
      </section>
    </main>
  );
}