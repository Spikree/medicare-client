import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-600 mb-2">MedCare Pro</h1>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">{children}</div>
      </div>
    </div>
  )
}
