"use client"

import OtpVerifyForm from '@/components/form/OtpVerifyForm'
import Link from 'next/link'
import { Suspense } from 'react'


const OtpVerifyPage = () => {



  return (
    <div className="flex min-h-svh w-full flex-col items-center bg-[#F4F5F7] px-4 py-10 text-[#15171C] sm:px-6 md:py-16">
      {/* ------brand */}
      <Link
        href="/"
        className="mb-10 flex items-center gap-2.5 text-[21px] font-bold tracking-tight text-[#15171C]"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2.5C12 2.5 5 10.2 5 15a7 7 0 0 0 14 0c0-4.8-7-12.5-7-12.5Z"
            fill="#B4232A"
          />
          <path
            d="M9.5 15.5a2.5 2.5 0 0 0 2.5 2.5"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        Blood For Life
      </Link>

      {/* ------form card */}
      <div className="w-full max-w-[440px]">

         <Suspense fallback={<div className="h-80 rounded-[20px] border border-[#E3E5EA] bg-white" />}>
          <OtpVerifyForm />
        </Suspense>

      </div>
    </div>
  )
}

export default OtpVerifyPage