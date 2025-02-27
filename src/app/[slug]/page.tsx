"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

interface PageConfig {
  title: string;
  dataset: string;
  component: string;
  conditions: any[];
  page: number;
  limit: number;
  app_secret: string;
  features: {
    search?: boolean;
    sorting?: boolean;
    pagination?: boolean;
  };
}

export default function DynamicPage() {
  const router = useRouter();
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageConfig = async () => {
      try {
        const res = await fetch("/config/pages.json");
        const configData = await res.json();
        const slug = window.location.pathname.replace("/", ""); // Extract slug

        if (configData[slug]) {
          const config = configData[slug];
          setPageConfig(config);

          // Dynamically import the specified component
          import(`@/app/components/${config.component}`)
            .then((mod) => setComponent(() => mod.default))
            .catch((err) => {
              console.error("Error loading component:", err);
              router.push("/404");
            });

          // Fetch data from api/proxy
          fetchData(config);
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.error("Error loading page config:", error);
      }
    };

    fetchPageConfig();
  }, []);

  const fetchData = async (config: PageConfig) => {
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-TYPE": "search",
        },
        body: JSON.stringify({
          conditions: config.conditions,
          page: config.page,
          limit: config.limit,
          dataset: config.dataset,
          app_secret: config.app_secret,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const jsonData = await response.json();
      setData(jsonData.data || []);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!pageConfig || !Component) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">{pageConfig.title}</h1>
      {loading ? (
        <p className="text-gray-400">Loading data...</p>
      ) : (
        <Component config={{ ...pageConfig, data }} />
      )}
    </div>
  );
}
