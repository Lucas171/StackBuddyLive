// components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500 z-50">
      <div className="flex justify-center space-x-6">
      <span>&copy; {new Date().getFullYear()} StackBuddy. All rights reserved.</span>
        <a href="/privacy" className="hover:text-gray-800">Privacy Policy</a>
        <a href="/terms" className="hover:text-gray-800">Terms</a>
        <a href="/feedback" className="hover:text-gray-800">Feedback</a>
      </div>
    </footer>
  )
}
