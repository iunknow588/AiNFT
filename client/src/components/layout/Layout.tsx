import { FC, ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 py-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} NFT Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Layout
