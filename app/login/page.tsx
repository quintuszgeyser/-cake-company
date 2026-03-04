"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, AlertCircle, Cake } from "lucide-react";
import { createClient } from "@/lib/auth/supabase-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Authentication failed");
      }

      // Verify user is in admin_users table
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", authData.user.email)
        .single();

      if (adminError || !adminUser) {
        // User authenticated but not an admin - sign them out
        await supabase.auth.signOut();
        throw new Error("You do not have admin privileges");
      }

      // Success - redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <Card
        className="w-full max-w-md"
        style={{
          backgroundColor: "#141414",
          border: "1px solid #2A2A2A",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
      >
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{
                backgroundColor: "rgba(212, 175, 55, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
              }}
            >
              <Cake className="w-8 h-8" style={{ color: "#D4AF37" }} />
            </div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#FFF8E7" }}
            >
              Admin Access
            </h1>
            <p style={{ color: "rgba(255, 248, 231, 0.6)" }}>
              Sign in to manage your cake shop
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 rounded-lg flex items-center gap-3"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <AlertCircle className="w-5 h-5" style={{ color: "#EF4444" }} />
              <p className="text-sm" style={{ color: "#EF4444" }}>
                {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#FFF8E7" }}>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cakeco.com"
                required
                autoFocus
                style={{
                  backgroundColor: "#0A0A0A",
                  border: "1px solid #2A2A2A",
                  color: "#FFF8E7",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: "#FFF8E7" }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  backgroundColor: "#0A0A0A",
                  border: "1px solid #2A2A2A",
                  color: "#FFF8E7",
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              style={{
                backgroundColor: "#D4AF37",
                color: "#0A0A0A",
                fontWeight: 600,
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Info */}
          <div
            className="mt-6 p-4 rounded-lg text-center"
            style={{
              backgroundColor: "rgba(212, 175, 55, 0.05)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}
          >
            <p className="text-xs" style={{ color: "rgba(255, 248, 231, 0.5)" }}>
              Demo Mode: Use the credentials provided by your administrator
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
