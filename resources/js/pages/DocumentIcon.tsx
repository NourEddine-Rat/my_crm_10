const DocumentIcon = ({ type, isUploaded }) => {
    const getIcon = (docType) => {
      switch (docType) {
        case 'CIN':
          return <CINIcon />;
        case 'Carte Grise':
          return <CarteGriseIcon />;
        case 'Permis':
          return <PermisIcon />;
        case 'RTP':
          return <RTPIcon />;
        case 'Relevé d\'information':
          return <ReleveInfoIcon />;
        default:
          return <DefaultDocumentIcon />;
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