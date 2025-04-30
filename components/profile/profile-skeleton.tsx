export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="border rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-5 w-3/4 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-5 w-3/4 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-5 w-1/2 bg-gray-100 rounded"></div>
            </div>
            <div className="h-10 w-full bg-gray-200 rounded mt-4"></div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="border rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
          </div>
          <div className="p-6">
            <div className="h-[150px] w-full bg-gray-100 rounded mb-4"></div>
            <div className="h-10 w-1/3 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="border rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
          </div>
          <div className="p-6">
            <div className="h-5 w-3/4 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
