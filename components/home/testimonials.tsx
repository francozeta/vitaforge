import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Professional Athlete",
    content:
      "VitaForge supplements have been a game-changer for my training regimen. The quality is unmatched and I've seen significant improvements in my recovery time.",
    avatar: "/placeholder.svg?height=100&width=100&query=athletic+man+portrait",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Fitness Instructor",
    content:
      "I recommend VitaForge to all my clients. Their products are clean, effective, and backed by science. The protein blend is my personal favorite.",
    avatar: "/placeholder.svg?height=100&width=100&query=fitness+woman+portrait",
    rating: 5,
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Nutritionist",
    content:
      "As a nutritionist, I'm very particular about the supplements I endorse. VitaForge meets all my criteria for quality, transparency, and efficacy.",
    avatar: "/placeholder.svg?height=100&width=100&query=asian+man+professional+portrait",
    rating: 4,
  },
]

export function Testimonials() {
  return (
    <section className="container px-4 mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What Our Customers Say</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Don't just take our word for it. Here's what athletes and fitness enthusiasts have to say about our
            products.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "fill-black text-black" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
