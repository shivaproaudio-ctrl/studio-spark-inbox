import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const App = lazy(() => import("@/click-arrow/App"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Click Arrow — Creative, Brand & Digital Studio" },
      {
        name: "description",
        content:
          "Click Arrow brings strategy, creative direction, and digital execution together to build stronger brands and meaningful experiences.",
      },
      {
        property: "og:title",
        content: "Click Arrow — Creative, Brand & Digital Studio",
      },
      {
        property: "og:description",
        content:
          "Strategy, creative direction, and digital execution for brands ready to move forward.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const fallback = <div className="min-h-screen bg-brand-black" />;

  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <App />
      </Suspense>
    </ClientOnly>
  );
}
