import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold mb-6 text-orange-500">404</h1>
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button path="/" variant="gradient">
        Back to Home
      </Button>
    </div>
  );
}