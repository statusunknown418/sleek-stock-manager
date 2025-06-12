
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../lib/auth/client";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending) {
      if (session) {
        navigate("/dashboard");
      } else {
        navigate("/auth");
      }
    }
  }, [session, isPending, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
};

export default Index;
