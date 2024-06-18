import ExpandingArrow from '@/components/expanding-arrow'
import GameCarousel from '@/components/game-carousel'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Game Idea Generator 
        
      </h1>
      <Image
            src="/logo.svg"
            alt="website Logo"
            width={48}
            height={48}
            priority
          />

      <GameCarousel />

      <div className="flex flex-col items-center justify-center mt-12">
        <footer className="font-light text-gray-600 w-full max-w-lg text-center mt-6">
          Built with{' '}
          <Link
            href="https://prisma.io"
            className="font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            Prisma
          </Link>
          , {' '}
          <Link
            href="https://platform.openai.com/"
            className="font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            OpenAI
          </Link>
          , and {' '}
          <Link
            href="https://nextjs.org/docs"
            className="font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            Next.js App Router
          </Link>
          .
        </footer>
      </div>
      <div className="mt-12 w-full flex items-center justify-between px-6 ">
        <Link
          href="https://github.com/jachewz/game-generation"
          className="lg:absolute bottom-12 right-12 flex items-center space-x-2"
        >
          <Image
            src="/github.svg"
            alt="GitHub Logo"
            width={24}
            height={24}
            priority
          />
          <span className="font-light">Source</span>
        </Link>
      </div></main>
  )
}
