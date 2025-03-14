import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { MdSupervisedUserCircle } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { GoVerified } from "react-icons/go";
import { FiAlertCircle } from "react-icons/fi";
import "@fontsource/instrument-sans";
import StatsChart from './StatsChart';
import PerformanceDeVenteChart from './PerformanceDeVenteChart'
import './dashboard.css'
import { router } from '@inertiajs/react';
// import 'bootstrap/dist/css/bootstrap.min.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard(props) {
    const statsData = [
        { label: "Total Clients", value: 120 },
        { label: "Nouveaux Leads", value: 45 },
        { label: "En Qualification", value: 30 },
        { label: "Autres", value: 15 },
      ];
    return (

        <AppLayout breadcrumbs={breadcrumbs}>
          <Head title="Dashboard"/>
  <div className="flex justify-between items-center gap-3 p-4">
    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100" style={{textTransform:'capitalize'}}>Bienvenue, {(props.auth.name).toLowerCase()}!</h1>
    
    {/* Select Dropdown */}
    <select className="form-select bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm">
      <option>Aujourd'hui</option>
      <option>Cette semaine</option>
      <option>Ce mois</option>
      <option>Cette année</option>
    </select>
  </div>

  <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4" style={{ fontFamily: "system-ui, sans-serif", fontWeight: 500 }}>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div className="nav-item border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
        <div className="flex justify-between p-4 sm:p-6">
          <div className="flex flex-col flex-grow min-w-0">
            <div>
              <p className="nav-item-text text-base sm:text-lg lg:text-xl text-neutral-900 dark:text-neutral-100 font-light">
                Total clients
              </p>
              <span className="nav-item-number text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                1,234
              </span>
            </div>
            <div className="mt-2">
              <span className="nav-item-rate text-xs sm:text-sm lg:text-base text-green-500">
              + 12.3% ce mois
              </span>
            </div>
          </div>
          <div className="nav-item-icon flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl pl-4">
            <MdSupervisedUserCircle />
          </div>
        </div>
      </div>

      <div className="nav-item border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
        <div className="flex justify-between p-4 sm:p-6">
          <div className="flex flex-col flex-grow min-w-0">
            <div>
              <p className="nav-item-text text-base sm:text-lg lg:text-xl text-neutral-900 dark:text-neutral-100 font-light">
                Nouveaux leads
              </p>
              <span className="nav-item-number text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                10
              </span>
            </div>
            <div className="mt-2">
              <span className="nav-item-rate text-xs sm:text-sm lg:text-base text-green-500">
              + 12.3% ce mois
              </span>
            </div>
          </div>
          <div className="nav-item-icon flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl pl-4">
            <CiCirclePlus />
          </div>
        </div>
      </div>

      <div className="nav-item border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
        <div className="flex justify-between p-4 sm:p-6">
          <div className="flex flex-col flex-grow min-w-0">
            <div>
              <p className="nav-item-text text-base sm:text-lg lg:text-xl text-neutral-900 dark:text-neutral-100 font-light">
                En qualification
              </p>
              <span className="nav-item-number text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                3
              </span>
            </div>
            <div className="mt-2">
              <span className="nav-item-rate text-xs sm:text-sm lg:text-base text-green-500">
              + 12.3% ce mois
              </span>
            </div>
          </div>
          <div className="nav-item-icon flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl pl-4">
            <GoVerified />
          </div>
        </div>
      </div>

      <div className="nav-item border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
        <div className="flex justify-between p-4 sm:p-6">
          <div className="flex flex-col flex-grow min-w-0">
            <div>
              <p className="nav-item-text text-base sm:text-lg lg:text-xl text-neutral-900 dark:text-neutral-100 font-light">
                En attente
              </p>
              <span className="nav-item-number text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                12
              </span>
            </div>
            <div className="mt-2">
            <span className="nav-item-rate text-xs sm:text-sm lg:text-base text-green-500">
                + 12.3% ce mois
              </span>

            </div>
          </div>
          <div className="nav-item-icon flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl pl-4">
            <FiAlertCircle />
          </div>
        </div>
      </div>
    </div>
    <div className="mb-8 bg-white border border-gray-200 rounded-lg shadow-sm p-6 min-w-[300px] w-full md:w-1/2">
  <h2 className="text-xl font-bold text-gray-800 mb-4">Derniers 5 Lead</h2>
  <ul className="space-y-4">
    {props.CinqDernierLead && props.CinqDernierLead.map((client : any) => (
      <li 
        key={client.client_id} 
        className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow"
        onClick={() =>  router.get(⁠ `/Details_clients/${client.client_id}` ⁠)}
      >
        <div className="flex justify-between items-start">
          {/* Partie gauche - Nom et Email */}
          <div>
            <h3 className="font-bold text-gray-800 block mb-1">
              {client.first_name} {client.last_name}
            </h3>
            <p className="text-sm text-gray-600">
              {client.email}
            </p>
          </div>

          {/* Partie droite - Date */}
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {new Date(client.created_at).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min flex">
      <div className="w-1/2 p-4 flex items-center justify-center bg-gray-100 dark:bg-transparent">
        <PerformanceDeVenteChart />
      </div>

      <div className="w-1/2 p-4 flex items-center justify-center bg-gray-100 dark:bg-transparent">
        <StatsChart stats={statsData} />
      </div>
    </div>

  </div>
</AppLayout>

    );
}
