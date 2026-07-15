import type { Metadata } from "next";
import { StudioDashboard } from "@/components/StudioDashboard";

export const metadata: Metadata = {
  title: "内容管理后台｜MAGO",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <StudioDashboard />;
}
