import AppSidebar from '@/components/global/app-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <AppSidebar />
            <main className="flex-1 md:pl-64 transition-all duration-300 ease-in-out">
                {children}
            </main>
        </div>
    );
}