import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { ToastProvider } from "@/components/common/ToastProvider";

export const metadata: Metadata = {
  title: "PlanMate",
  description: "Azure 배포를 목표로 하는 일정 관리 MVP"
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

