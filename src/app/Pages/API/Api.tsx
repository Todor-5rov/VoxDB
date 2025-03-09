import AppHeader from "@/app/Pages/Components/AppHeader"
import { Button } from "@/shadcn/ui/button"

export default function APIPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8 text-center">VoxDB API</h1>
          <div className="max-w-3xl mx-auto bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow-lg">
            <p className="text-lg mb-6">
              Welcome to the VoxDB API documentation. This page will provide information on how to perform CRUD
              operations using natural language queries. Stay tuned for detailed documentation and examples.
            </p>
            <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>API endpoint details</li>
              <li>Authentication methods</li>
              <li>Request and response formats</li>
              <li>Example queries for Create, Read, Update, and Delete operations</li>
              <li>Error handling and status codes</li>
              <li>Rate limiting information</li>
            </ul>
            <p className="mb-6">
              Our API will allow you to interact with your database using simple text commands. Send a JSON payload
              describing what you want to do, and our AI will translate it into the appropriate database operation.
            </p>
            <div className="text-center">
              <Button className="bg-accent hover:bg-accent/90">Join Waitlist for API Access</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}