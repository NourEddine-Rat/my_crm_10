import AppLayout from '@/layouts/app-layout';
import React, { useState, useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Title } from '@radix-ui/react-dialog';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
export default function Client({ client }) {
  const [documents, setDocuments] = useState({
    'CIN': false,
    'Carte Grise': false,
    'Permis': false, 
    'RTP': false,
    "Relevé d'information": false
  });

  // Mettre à jour les documents quand le client change
  useEffect(() => {
    if (client && client.documents) {
      const clientDocs = {};
      client.documents.forEach(doc => {
        clientDocs[doc.document_type] = true;
      });
      setDocuments(prevDocs => ({
        ...prevDocs,
        ...clientDocs
      }));
    }
  }, [client]);

  const handleCheckboxChange = (docType) => {
    setDocuments(prevDocs => ({
      ...prevDocs,
      [docType]: !prevDocs[docType]
    }));
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  // Fonction pour déterminer la couleur du statut
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'résilié':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const title =  "Détail de client "+ client.first_name

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title}/>
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* En-tête avec nom et email */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-3">
            {client.first_name?.charAt(0)}{client.last_name?.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{client.first_name} {client.last_name}</h2>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center">
          <svg className="w-4 h-4 text-gray-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-600">{client.email}</span>
        </div>
      </div>
      
      {/* Info rapide */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
          {client.status || 'Statut non défini'}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {client.insurance_type || 'Type non défini'}
        </span>
        {client.subscriptions && client.subscriptions.length > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {client.subscriptions[0].insurance_formula || 'Formule non définie'}
          </span>
        )}
      </div>
      
      {/* Détails du client */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Informations personnelles</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 flex justify-between">
              <span className="font-medium">Régime :</span> 
              <span className="text-gray-800">{client.health_regime || '—'}</span>
            </p>
            <p className="text-sm text-gray-600 flex justify-between">
              <span className="font-medium">Code Postal :</span> 
              <span className="text-gray-800">{client.postal_code || '—'}</span>
            </p>
            <p className="text-sm text-gray-600 flex justify-between">
              <span className="font-medium">Date de naissance :</span> 
              <span className="text-gray-800">{client.birth_date || '—'}</span>
            </p>
          </div>
        </div>
        
        {/* Informations de souscription */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Détails de souscription</h3>
          <div className="space-y-2">
            {client.subscriptions && client.subscriptions.length > 0 ? (
              <>
                <p className="text-sm text-gray-600 flex justify-between">
                  <span className="font-medium">Statut contrat :</span>
                  <span className={`${getStatusColor(client.subscriptions[0].contract_status)} px-2 py-1 rounded text-xs`}>
                    {client.subscriptions[0].contract_status || '—'}
                  </span>
                </p>
                <p className="text-sm text-gray-600 flex justify-between">
                  <span className="font-medium">Formule :</span>
                  <span className="text-gray-800">{client.subscriptions[0].insurance_formula || '—'}</span>
                </p>
                <p className="text-sm text-gray-600 flex justify-between">
                  <span className="font-medium">Garantie :</span>
                  <span className="text-gray-800">{client.subscriptions[0].guarantee_type || '—'}</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">Aucune souscription active</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Documents */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Documents</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(documents).map(([docType, hasDocument]) => (
              <label key={docType} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-md hover:bg-gray-100 transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={hasDocument}
                  onChange={() => handleCheckboxChange(docType)}
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{docType}</span>
                {hasDocument && (
                  <span className="flex-grow text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Reçu
                    </span>
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}