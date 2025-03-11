import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
export default function Clients() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Gestion D'etat",
            href: '/Clients',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="p-6">
                <h1 className="text-2xl font-bold">L'etat de Client</h1>
            </div>
        </AppLayout>
    );
}