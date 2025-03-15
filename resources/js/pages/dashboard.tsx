import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { MdSupervisedUserCircle } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { GoVerified } from "react-icons/go";
import { FiAlertCircle } from "react-icons/fi";
import "@fontsource/instrument-sans";
import StatsChart from './StatsChart';
import PerformanceDeVenteChart from './PerformanceDeVenteChart';
import './dashboard.css';
import { router } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard(props: { auth: { name: any; }, CinqDernierLead: any }) {
    const statsData = [
        { label: "Total Clients", value: 120 },
        { label: "Nouveaux Leads", value: 45 },
        { label: "En Qualification", value: 30 },
        { label: "Autres", value: 15 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex justify-between items-center gap-4 p-6 bg-white dark:bg-neutral-900 shadow-sm">
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100" style={{ textTransform: 'capitalize' }}>
                    Bienvenue, {props.auth.name.toLowerCase()}!
                </h1>
                <select className="form-select bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100">
                    <option>Aujourd'hui</option>
                    <option>Cette semaine</option>
                    <option>Ce mois</option>
                    <option>Cette année</option>
                </select>
            </div>

            <div className="p-6 space-y-6 bg-neutral-50 dark:bg-neutral-900">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Total Clients", value: "1,234", icon: <MdSupervisedUserCircle />, rate: "+12.3% ce mois" },
                        { label: "Nouveaux Leads", value: "10", icon: <CiCirclePlus />, rate: "+12.3% ce mois" },
                        { label: "En Qualification", value: "3", icon: <GoVerified />, rate: "+12.3% ce mois" },
                        { label: "En attente", value: "12", icon: <FiAlertCircle />, rate: "+12.3% ce mois" },
                    ].map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stat.value}</p>
                                    <p className="text-xs text-green-500 mt-1">{stat.rate}</p>
                                </div>
                                <div className="text-4xl text-neutral-900 dark:text-neutral-100">
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts and Leads Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Derniers Leads */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Derniers Leads</h2>
                        <ul className="space-y-3">
                            {props.CinqDernierLead && props.CinqDernierLead.map((client: any) => (
                                <li
                                    key={client.client_id}
                                    className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => router.get(`/Details_clients/${client.client_id}`)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                                                {client.first_name} {client.last_name}
                                            </h3>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {client.email}
                                            </p>
                                        </div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                                            {new Date(client.created_at).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Stats Chart */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 flex items-center justify-center">
                        
                        <StatsChart stats={statsData} />
                    </div>
                </div>

                {/* Performance Chart */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Performance de Vente</h2>
                    <PerformanceDeVenteChart />
                </div>
            </div>
        </AppLayout>
    );
}