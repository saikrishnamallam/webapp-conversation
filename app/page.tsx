import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default async function HomePage() {


  // console.log("isUserAdmin is: ", isUserAdmin)

  // const response = await (await fetch('http://localhost:3000/api/auth/checkadmin', { credentials: 'include' })).json()
  // const isUserAdmin = response.data

  // console.log("response is: ", response)
  // console.log("isUserAdmin in base Page is: ", isUserAdmin)
  const isUserAdmin = false;

  return (
    <div className="relative overflow-hidden">
      <div className="relative pt-6 pb-16 sm:pb-24">
        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Benvenuto nella </span>
              {/* <span className="block text-blue-600">Web Application</span> */}
              <span className="block text-[#7b2a20]">Smart knowledge base di SBNP</span>
            </h1>
            {/* <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A modern web application with authentication system using Next.js, MySQL, and JWT.
            </p> */}
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#7b2a20] hover:bg-[#3e0b05] md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
              {isUserAdmin ?
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Add Users
                  </Link>
                </div> : ''}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
