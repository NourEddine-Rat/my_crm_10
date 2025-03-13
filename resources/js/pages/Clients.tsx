import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios';

// Enhanced Client type definition with additional fields
interface Client {
  id: string;
  name: string;
  email: string;
  etat: 'nouveau' | 'en_qualification' | 'client' | 'archive';
  insuranceType?: 'Auto' | 'Habitation' | 'Prévoyance' | 'Décès' | 'Obsèque' | 'Santé';
  healthRegime?: 'général' | 'ALSA' | 'TNS' | 'MSA';
  postalCode?: string;
  hasActiveSubscription?: boolean;
  contractStatus?: 'actif' | 'en_attente' | 'resilie';
  insuranceFormula?: 'Tous risques' | 'Tiers' | 'Intermédiaire';
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  guaranteeType?: string;
  birthDate?: string;
  documents?: {
    'CIN': boolean;
    'Carte Grise': boolean;
    'Permis': boolean;
    'RTP': boolean;
    "Relevé d'information": boolean;
  };
}

// Document icon component
const DocumentIcon = ({ type, isUploaded }) => {
  // Define icons based on document type
  const getIcon = (docType) => {
    switch(docType) {
      case 'CIN':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        );
      case 'Carte Grise':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'Permis':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'RTP':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "Relevé d'information":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={`relative tooltip-container p-1.5 rounded-full ${
        isUploaded 
          ? 'text-green-600 bg-green-100 border border-green-200' 
          : 'text-gray-400 bg-gray-100 border border-gray-200'
      } transition-colors duration-200`}
      title={isUploaded ? `${type} téléchargé` : `${type} non téléchargé`}
    >
      {getIcon(type)}
      
      <div className="tooltip opacity-0 invisible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap transition-opacity duration-200 z-10">
        {isUploaded ? `${type} téléchargé` : `${type} non téléchargé`}
      </div>
    </div>
  );
};

// Column type definition
interface Column {
  id: string;
  title: string;
  clientIds: string[];
}

// Filter state interface
interface FilterState {
  insuranceType: string[];
  healthRegime: string[];
  contractStatus: string[];
  paymentStatus: string[];
  insuranceFormula: string[];
  guaranteeType: string[];
  hasActiveSubscription: boolean | null;
  documentStatus: {
    'CIN': boolean | null;
    'Carte Grise': boolean | null;
    'Permis': boolean | null;
    'RTP': boolean | null;
    "Relevé d'information": boolean | null;
  };
}

// Props from Inertia
interface ClientsProps {
  clients: Client[];
}

export default function Clients({ clients }: ClientsProps) {
  // Convert clients array into an object for easier access
  const clientData = clients.reduce((acc, client) => {
    acc[client.id] = client;
    return acc;
  }, {} as { [key: string]: Client });

  // Initial columns setup based on status
  const initialColumns: { [key: string]: Column } = {
    'nouveau': {
      id: 'nouveau',
      title: 'Nouveau',
      clientIds: clients.filter(client => client.etat === 'nouveau').map(client => client.id),
    },
    'en_qualification': {
      id: 'en_qualification',
      title: 'En Qualification',
      clientIds: clients.filter(client => client.etat === 'en_qualification').map(client => client.id),
    },
    'client': {
      id: 'client',
      title: 'Client',
      clientIds: clients.filter(client => client.etat === 'client').map(client => client.id),
    },
    'archive': {
      id: 'archive',
      title: 'Archive',
      clientIds: clients.filter(client => client.etat === 'archive').map(client => client.id),
    },
  };

  const columnOrder = ['nouveau', 'en_qualification', 'client', 'archive'];

  // State
  const [clientState, setClientState] = useState(clientData);
  const [columns, setColumns] = useState(initialColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleClients, setVisibleClients] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    insuranceType: [],
    healthRegime: [],
    contractStatus: [],
    paymentStatus: [],
    insuranceFormula: [],
    guaranteeType: [],
    hasActiveSubscription: null,
    documentStatus: {
      'CIN': null,
      'Carte Grise': null,
      'Permis': null,
      'RTP': null,
      "Relevé d'information": null
    }
  });

  // Handle Drag & Drop
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (sourceColumn.id === destColumn.id) {
      const newClientIds = Array.from(sourceColumn.clientIds);
      newClientIds.splice(source.index, 1);
      newClientIds.splice(destination.index, 0, draggableId);

      setColumns({
        ...columns,
        [sourceColumn.id]: { ...sourceColumn, clientIds: newClientIds },
      });

      return;
    }

    const sourceClientIds = Array.from(sourceColumn.clientIds);
    sourceClientIds.splice(source.index, 1);

    const destinationClientIds = Array.from(destColumn.clientIds);
    destinationClientIds.splice(destination.index, 0, draggableId);

    const updatedClient = {
      ...clientState[draggableId],
      etat: destination.droppableId,
    };

    // Update the client state locally
    setColumns({
      ...columns,
      [sourceColumn.id]: { ...sourceColumn, clientIds: sourceClientIds },
      [destColumn.id]: { ...destColumn, clientIds: destinationClientIds },
    });

    setClientState({
      ...clientState,
      [draggableId]: updatedClient,
    });

    // Call API to update status in the database
    try {
      await axios.put(`/clients/${draggableId}/status`, {
        status: destination.droppableId,
      });
    } catch (error) {
      console.error('Error updating client status', error);
    }
  };

  // Toggle filter value in an array
  const toggleFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prevFilters => {
      if (Array.isArray(prevFilters[filterType])) {
        const currentFilters = prevFilters[filterType] as string[];
        
        if (currentFilters.includes(value)) {
          return {
            ...prevFilters,
            [filterType]: currentFilters.filter(item => item !== value)
          };
        } else {
          return {
            ...prevFilters,
            [filterType]: [...currentFilters, value]
          };
        }
      }
      return prevFilters;
    });
  };

  // Toggle document status filter
  const toggleDocumentFilter = (docType: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      documentStatus: {
        ...prevFilters.documentStatus,
        [docType]: prevFilters.documentStatus[docType] === null 
          ? true 
          : prevFilters.documentStatus[docType] === true 
            ? false 
            : null
      }
    }));
  };

  // Toggle active subscription filter (true/false/null)
  const toggleSubscriptionFilter = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      hasActiveSubscription: 
        prevFilters.hasActiveSubscription === null ? true :
        prevFilters.hasActiveSubscription === true ? false : null
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      insuranceType: [],
      healthRegime: [],
      contractStatus: [],
      paymentStatus: [],
      insuranceFormula: [],
      guaranteeType: [],
      hasActiveSubscription: null,
      documentStatus: {
        'CIN': null,
        'Carte Grise': null,
        'Permis': null,
        'RTP': null,
        "Relevé d'information": null
      }
    });
    setSearchTerm('');
  };

  // Apply filters to clients
  const applyFilters = (client: Client) => {
    // Check name search filter
    if (searchTerm && !client.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Check insurance type filter
    if (filters.insuranceType.length > 0 && client.insuranceType && 
        !filters.insuranceType.includes(client.insuranceType)) {
      return false;
    }

    // Check health regime filter
    if (filters.healthRegime.length > 0 && client.healthRegime &&
        !filters.healthRegime.includes(client.healthRegime)) {
      return false;
    }

    // Check contract status filter
    if (filters.contractStatus.length > 0 && client.contractStatus &&
        !filters.contractStatus.includes(client.contractStatus)) {
      return false;
    }

    // Check payment status filter
    if (filters.paymentStatus.length > 0 && client.paymentStatus &&
        !filters.paymentStatus.includes(client.paymentStatus)) {
      return false;
    }

    // Check insurance formula filter
    if (filters.insuranceFormula.length > 0 && client.insuranceFormula &&
        !filters.insuranceFormula.includes(client.insuranceFormula)) {
      return false;
    }

    // Check guarantee type filter
    if (filters.guaranteeType.length > 0 && client.guaranteeType &&
        !filters.guaranteeType.includes(client.guaranteeType)) {
      return false;
    }

    // Check active subscription filter
    if (filters.hasActiveSubscription !== null && client.hasActiveSubscription !== filters.hasActiveSubscription) {
      return false;
    }

    // Check document status filters
    if (client.documents) {
      for (const [docType, filterValue] of Object.entries(filters.documentStatus)) {
        if (filterValue !== null && client.documents[docType] !== filterValue) {
          return false;
        }
      }
    }

    return true;
  };

  // Get filtered clients
  const filteredClients = Object.values(clientState).filter(applyFilters);

  // Load more Clients
  const loadMoreClients = () => {
    setVisibleClients(prevVisibleClients => prevVisibleClients + 10);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Gestion D'état",
      href: '/Clients',
    },
  ];

  // Add CSS for tooltip hover effect
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .tooltip-container:hover .tooltip {
        opacity: 1;
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Clients" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Statut des leads</h1>
        
        {/* Search and Filters Area */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-2 md:items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtres
              {(Object.values(filters).some(f => 
                (Array.isArray(f) && f.length > 0) || 
                (f !== null && typeof f !== 'object')
              ) || Object.values(filters.documentStatus).some(f => f !== null)) && (
                <span className="ml-1 px-1.5 bg-blue-500 text-white rounded-full text-xs">✓</span>
              )}
            </button>
            {(Object.values(filters).some(f => 
              (Array.isArray(f) && f.length > 0) || 
              (f !== null && typeof f !== 'object')
            ) || Object.values(filters.documentStatus).some(f => f !== null)) && (
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Document Status Filter - New section */}
                <div>
                  <h3 className="font-medium mb-2">Documents</h3>
                  <div className="space-y-2">
                    {Object.keys(filters.documentStatus).map(docType => (
                      <div key={docType} className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleDocumentFilter(docType)}
                          className={`px-2 py-1 rounded-lg border text-xs ${
                            filters.documentStatus[docType] === true 
                              ? 'bg-green-100 border-green-500 text-green-700' 
                              : filters.documentStatus[docType] === false
                                ? 'bg-red-100 border-red-500 text-red-700'
                                : 'bg-gray-100 border-gray-300 text-gray-600'
                          }`}
                        >
                          {docType} {filters.documentStatus[docType] === true ? '✓' : filters.documentStatus[docType] === false ? '✗' : 'Tous'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insurance Type Filter */}
                <div>
                  <h3 className="font-medium mb-2">Type d'assurance</h3>
                  <div className="space-y-1">
                    {['Auto', 'Habitation', 'Prévoyance', 'Décès', 'Obsèque', 'Santé'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.insuranceType.includes(type)}
                          onChange={() => toggleFilter('insuranceType', type)}
                          className="mr-2"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Health Regime Filter */}
                <div>
                  <h3 className="font-medium mb-2">Régime de santé</h3>
                  <div className="space-y-1">
                    {['général', 'ALSA', 'TNS', 'MSA'].map(regime => (
                      <label key={regime} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.healthRegime.includes(regime)}
                          onChange={() => toggleFilter('healthRegime', regime)}
                          className="mr-2"
                        />
                        {regime}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contract Status Filter */}
                <div>
                  <h3 className="font-medium mb-2">État du contrat</h3>
                  <div className="space-y-1">
                    {['actif', 'en_attente', 'resilie'].map(status => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.contractStatus.includes(status)}
                          onChange={() => toggleFilter('contractStatus', status)}
                          className="mr-2"
                        />
                        {status === 'actif' ? 'Actif' : 
                         status === 'en_attente' ? 'En attente' : 'Résilié'}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <h3 className="font-medium mb-2">État de paiement</h3>
                  <div className="space-y-1">
                    {['paid', 'pending', 'overdue'].map(status => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.paymentStatus.includes(status)}
                          onChange={() => toggleFilter('paymentStatus', status)}
                          className="mr-2"
                        />
                        {status === 'paid' ? 'Payé' : 
                         status === 'pending' ? 'En attente' : 'En retard'}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Insurance Formula Filter */}
                <div>
                  <h3 className="font-medium mb-2">Formule d'assurance</h3>
                  <div className="space-y-1">
                    {['Tous risques', 'Tiers', 'Intermédiaire'].map(formula => (
                      <label key={formula} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.insuranceFormula.includes(formula)}
                          onChange={() => toggleFilter('insuranceFormula', formula)}
                          className="mr-2"
                        />
                        {formula}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Guarantee Type Filter */}
                <div>
                  <h3 className="font-medium mb-2">Type de garantie</h3>
                  <div className="space-y-1">
                    {['Responsabilité Civile', 'Protection Juridique', 'Assistance 24/7', 'Défense Pénale'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.guaranteeType.includes(type)}
                          onChange={() => toggleFilter('guaranteeType', type)}
                          className="mr-2"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subscription Status Toggle */}
              <div className="mt-4">
                <h3 className="font-medium mb-2">Abonnement actif</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleSubscriptionFilter}
                    className={`px-3 py-1 rounded-lg border text-sm ${
                      filters.hasActiveSubscription === true 
                        ? 'bg-green-100 border-green-500 text-green-700' 
                        : filters.hasActiveSubscription === false
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                    }`}
                  >
                    {filters.hasActiveSubscription === true ? 'Oui' : 
                     filters.hasActiveSubscription === false ? 'Non' : 'Tous'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Client Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columnOrder.map(columnId => {
              const column = columns[columnId];
              const columnClients = column.clientIds
                .filter(clientId => clientState[clientId] && filteredClients.some(c => c.id === clientId))
                .slice(0, visibleClients);

              return (
                <div key={column.id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold">{column.title}</h2>
                    <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {columnClients.length}
                    </span>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-80"
                      >
                        {columnClients.map((clientId, index) => {
                          const client = clientState[clientId];
                          
                          return (
                            <Draggable key={client.id} draggableId={client.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h3 className="font-medium">{client.name}</h3>
                                      <p className="text-sm text-gray-600">{client.email}</p>
                                    </div>
                                    
                                    {/* Insurance Type Badge */}
                                    {client.insuranceType && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {client.insuranceType}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Contract Status & Payment Status */}
                                  {(client.contractStatus || client.paymentStatus) && (
                                    <div className="flex gap-2 mb-3">
                                      {client.contractStatus && (
                                        <span className={`text-xs px-2 py-1 rounded ${
                                          client.contractStatus === 'actif' 
                                            ? 'bg-green-100 text-green-800' 
                                            : client.contractStatus === 'en_attente'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-red-100 text-red-800'
                                        }`}>
                                          {client.contractStatus === 'actif' ? 'Contrat actif' : 
                                           client.contractStatus === 'en_attente' ? 'En attente' : 'Résilié'}
                                        </span>
                                      )}
                                      
                                      {client.paymentStatus && (
                                        <span className={`text-xs px-2 py-1 rounded ${
                                          client.paymentStatus === 'paid' 
                                            ? 'bg-green-100 text-green-800' 
                                            : client.paymentStatus === 'pending'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-red-100 text-red-800'
                                        }`}>
                                          {client.paymentStatus === 'paid' ? 'Payé' : 
                                           client.paymentStatus === 'pending' ? 'En attente' : 'En retard'}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Documents Status */}
                                  {client.documents && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {Object.entries(client.documents).map(([docType, isUploaded]) => (
                                        <DocumentIcon 
                                          key={docType} 
                                          type={docType} 
                                          isUploaded={isUploaded} 
                                        />
                                      ))}
                                    </div>
                                  )}
                                  
                                  {/* Additional Information - Health Regime & Formula */}
                                  <div className="mt-2 text-xs text-gray-500">
                                    {client.healthRegime && (
                                      <div className="mb-1">Régime: {client.healthRegime}</div>
                                    )}
                                    {client.insuranceFormula && (
                                      <div>Formule: {client.insuranceFormula}</div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  
                  {column.clientIds.length > visibleClients && (
                    <button
                      onClick={loadMoreClients}
                      className="mt-3 w-full py-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      Afficher plus
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </AppLayout>
  );
}