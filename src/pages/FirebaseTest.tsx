import { useState } from "react";
import { Button } from "@/components/ui/button";
import { testFirebaseConnection } from "@/utils/firebaseTest";
import { useToast } from "@/components/ui/use-toast";

export default function FirebaseTest() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const runTest = async () => {
    setIsLoading(true);
    try {
      const result = await testFirebaseConnection();
      toast({
        title: result.success ? "Success!" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test Firebase connection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      <Button 
        onClick={runTest} 
        disabled={isLoading}
      >
        {isLoading ? "Testing..." : "Test Firebase Connection"}
      </Button>
    </div>
  );
}
