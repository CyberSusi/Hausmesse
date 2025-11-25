import { Card, CardContent } from "@/components/ui/card.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
export default function SkeletonContainer() {
  return (
    <div>
      <Card className={"w-72 m-5 shadow-md  rounded-md hover:scale-105 transition-all duration-200 "}>
        <CardContent className={"flex flex-col gap-y-4 m-1"}>
          <Skeleton className={"w-full h-12 "} />
          <Skeleton className={"w-1/2 h-12"} />
          <Skeleton className={"w-full h-12"} />
        </CardContent>
      </Card>
      <Card className={"w-72 m-5 shadow-md rounded-md hover:scale-105 transition-all duration-200 "}>
        <CardContent className={"flex flex-col gap-y-4 m-1"}>
          <Skeleton className={"w-full h-12"} />
          <Skeleton className={"w-1/2 h-12"} />
          <Skeleton className={"w-full h-12"} />
        </CardContent>
      </Card>
      <Card className={"w-72 m-5 shadow-md rounded-md hover:scale-105 transition-all duration-200 "}>
        <CardContent className={"flex flex-col gap-y-4 m-1"}>
          <Skeleton className={"w-full h-12"} />
          <Skeleton className={"w-1/2 h-12"} />
          <Skeleton className={"w-full h-12"} />
        </CardContent>
      </Card>
    </div>
  )
}
