import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</p>
      <p className="text-gray-500 mb-6">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link href={"/dashboard"}>
        <Button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-all">
          Go Home
        </Button>
      </Link>
    </div>
  )
}

export default NotFound