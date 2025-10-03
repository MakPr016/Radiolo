import {
    SignUpButton,
    SignedIn,
    SignedOut,
} from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '../ui/button'

const ClerkButton = () => {
    return (
        <div className='flex gap-1 items-center justify-center'>
            <SignedOut>
                <SignUpButton>
                    <Button className='py-5 px-4'>Get Started</Button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                <Link
                    href="/dashboard"
                    className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                        Dashboard
                </Link>
            </SignedIn>
        </div>
    )
}

export default ClerkButton