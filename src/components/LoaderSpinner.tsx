
import { Spinner } from '@phosphor-icons/react/dist/ssr'
import React from 'react'

const LoaderSpinner = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <Spinner className="animate-spin text-primary" size={30} />
        </div>
    )
}

export default LoaderSpinner