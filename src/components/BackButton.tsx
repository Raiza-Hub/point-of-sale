'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { CaretLeft } from '@phosphor-icons/react'


const BackButton = () => {
    const router = useRouter();
    return (
        <Button
            onClick={() => router.back()}
            className='flex gap-2 items-center text-sm p-2'
            variant='secondary'
            size='sm'
        >
            <CaretLeft
                className='h-4 w-4'
                aria-hidden='true'
            />
            Back
        </Button>
    )
}

export default BackButton