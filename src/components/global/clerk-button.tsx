import {
    SignUpButton,
    SignedIn,
    SignedOut,
} from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '../ui/button'

const ClerkButton = () => {
    return (
        <div className='flex gap-3 items-center justify-center'>
            <SignedOut>
                <SignUpButton>
                    <Button className='bg-rr-500 text-white font-medium py-5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200'>
                        Get Started
                    </Button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                <Link
                    href="/dashboard"
                    className='inline-flex items-center justify-center px-6 py-2.5 bg-rr-500 text-white font-medium rounded-lg hover:bg-rr-600 transition-all duration-200 shadow-md hover:shadow-lg'
                >
                    Dashboard
                </Link>
            </SignedIn>
        </div>
    )
}

export default ClerkButton
