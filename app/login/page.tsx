import { Camera } from "lucide-react";
import { signIn } from "../lib/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="bg-zinc-100 hover:bg-white text-zinc-950 font-medium px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2.5 shadow-lg hover:shadow-zinc-500/10"
        >
          <Camera className="w-4 h-4" />
          Войти через GitHub
        </button>
      </form>
    </div>
  );
}