import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, User } from "@/context/AuthContext";
import { MotionConfig } from "framer-motion";
import { vi } from "vitest";

export const mockUser: User = {
  name: "Alexandra Vance",
  username: "alex_vance",
  email: "alexandra@lumora.design",
  plan: "Pro",
  avatarInitials: "AV",
  avatarColor: "#A78B75",
  createdAt: "2026-01-15T10:00:00Z",
};

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialUser?: User | null;
  queryClient?: QueryClient;
  mockFetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const {
    initialUser = null,
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    }),
    mockFetch,
    ...renderOptions
  } = options;

  if (mockFetch) {
    vi.spyOn(globalThis, "fetch").mockImplementation(mockFetch);
  } else if (initialUser) {
    localStorage.setItem("lumora_token", "mock-valid-jwt-token");
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      if (url.includes("/api/auth/me")) {
        return new Response(JSON.stringify(initialUser), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    });
  } else {
    localStorage.removeItem("lumora_token");
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      if (url.includes("/api/auth/me")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    });
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MotionConfig transition={{ duration: 0 }}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </MotionConfig>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}
