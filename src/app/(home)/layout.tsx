interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-[#18181b] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#232329_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="flex flex-1 flex-col px-4 pb-4">{children}</div>
    </main>
  );
}
