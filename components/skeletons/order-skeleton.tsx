import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function OrderSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="overflow-hidden py-5" >
          <CardHeader className="pb-0">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
