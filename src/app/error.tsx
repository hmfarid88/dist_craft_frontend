'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container">
      <div className="flex w-full h-[calc(100vh-228px)] items-center justify-center">
        <div role="alert" className="alert alert-warning w-1/3">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Something went wrong !</span>
          <button className='btn btn-ghost'
            onClick={
              () => reset()
            }
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}