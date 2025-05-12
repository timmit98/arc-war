'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-storm-grey-dark">
          <div className="bg-darkblue p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h2 className="text-text-light text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-text-light mb-6">Sorry, an error occurred while processing your request.</p>
            <button
              className="bg-lightblue text-text-light px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => reset()}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
} 