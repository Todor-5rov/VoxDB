import AppHeader from "@/app/Pages/Components/AppHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <h1 className="text-4xl font-bold mb-8 text-center">About VoxDB</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <p className="mb-4">
                  At VoxDB, we're on a mission to revolutionize the way people interact with databases. We believe that
                  the power of data should be accessible to everyone, regardless of their technical expertise.
                </p>
                <p>
                  Our goal is to bridge the gap between human language and database queries, making data retrieval and
                  analysis as simple as having a conversation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Our Story</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <p className="mb-4">
                  VoxDB was born out of a simple observation: too many great ideas were getting lost in translation
                  between business users and database administrators. We saw an opportunity to leverage the latest
                  advancements in AI and natural language processing to solve this problem.
                </p>
                <p>
                  Since our inception, we've been dedicated to developing a platform that transforms the way
                  organizations interact with their data, making it more intuitive, efficient, and accessible.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Our Technology</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <p className="mb-4">
                  VoxDB utilizes cutting-edge AI and machine learning algorithms to understand natural language queries
                  and translate them into precise database commands. Our technology is constantly learning and
                  improving, ensuring that your data interactions become more intuitive over time.
                </p>
                <p>
                  We prioritize security and privacy, ensuring that your data remains protected while providing the
                  flexibility and power you need to extract valuable insights.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Our Commitment</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <p className="mb-4">
                  We are committed to continuous innovation and improvement. As the field of AI and data science
                  evolves, so does VoxDB. We're dedicated to staying at the forefront of technology to provide our users
                  with the most advanced and user-friendly database interaction experience possible.
                </p>
                <p>
                  Thank you for considering VoxDB for your data needs. We're excited to be part of your journey in
                  unlocking the full potential of your data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}