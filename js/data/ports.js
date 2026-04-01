window.KedrixOnePortData = (() => {
  'use strict';

  const defaultSeaPortLocodes = [
    { value: 'ITGOA - Genova', label: 'Genova', code: 'ITGOA', city: 'Genova', displayValue: 'Genova · ITGOA', aliases: ['Genova', 'Genoa', 'ITGOA', 'GOA'] },
    { value: 'ITVDL - Vado Ligure', label: 'Vado Ligure', code: 'ITVDL', city: 'Vado Ligure', displayValue: 'Vado Ligure · ITVDL', aliases: ['Vado Ligure', 'Vado', 'ITVDL', 'VDL'] },
    { value: 'ITSPE - La Spezia', label: 'La Spezia', code: 'ITSPE', city: 'La Spezia', displayValue: 'La Spezia · ITSPE', aliases: ['La Spezia', 'ITSPE', 'SPE'] },
    { value: 'ITTRS - Trieste', label: 'Trieste', code: 'ITTRS', city: 'Trieste', displayValue: 'Trieste · ITTRS', aliases: ['Trieste', 'ITTRS', 'TRS'] },
    { value: 'ITLIV - Livorno', label: 'Livorno', code: 'ITLIV', city: 'Livorno', displayValue: 'Livorno · ITLIV', aliases: ['Livorno', 'ITLIV', 'LIV'] },
    { value: 'ITNAP - Napoli', label: 'Napoli', code: 'ITNAP', city: 'Napoli', displayValue: 'Napoli · ITNAP', aliases: ['Napoli', 'Naples', 'ITNAP', 'NAP'] },
    { value: 'NLRTM - Rotterdam', label: 'Rotterdam', code: 'NLRTM', city: 'Rotterdam', displayValue: 'Rotterdam · NLRTM', aliases: ['Rotterdam', 'NLRTM', 'RTM'] },
    { value: 'BEANR - Antwerp', label: 'Antwerp', code: 'BEANR', city: 'Antwerp', displayValue: 'Antwerp · BEANR', aliases: ['Antwerp', 'Anversa', 'BEANR', 'ANR'] },
    { value: 'DEHAM - Hamburg', label: 'Hamburg', code: 'DEHAM', city: 'Hamburg', displayValue: 'Hamburg · DEHAM', aliases: ['Hamburg', 'DEHAM', 'HAM'] },
    { value: 'FRLEH - Le Havre', label: 'Le Havre', code: 'FRLEH', city: 'Le Havre', displayValue: 'Le Havre · FRLEH', aliases: ['Le Havre', 'FRLEH', 'LEH'] },
    { value: 'ESALG - Algeciras', label: 'Algeciras', code: 'ESALG', city: 'Algeciras', displayValue: 'Algeciras · ESALG', aliases: ['Algeciras', 'ESALG', 'ALG'] },
    { value: 'ESBCN - Barcelona', label: 'Barcelona', code: 'ESBCN', city: 'Barcelona', displayValue: 'Barcelona · ESBCN', aliases: ['Barcelona', 'ESBCN', 'BCN'] },
    { value: 'ESVLC - Valencia', label: 'Valencia', code: 'ESVLC', city: 'Valencia', displayValue: 'Valencia · ESVLC', aliases: ['Valencia', 'ESVLC', 'VLC'] },
    { value: 'GRPIR - Piraeus', label: 'Piraeus', code: 'GRPIR', city: 'Piraeus', displayValue: 'Piraeus · GRPIR', aliases: ['Piraeus', 'Pireo', 'GRPIR', 'PIR'] },
    { value: 'GBFXT - Felixstowe', label: 'Felixstowe', code: 'GBFXT', city: 'Felixstowe', displayValue: 'Felixstowe · GBFXT', aliases: ['Felixstowe', 'GBFXT', 'FXT'] },
    { value: 'SGSIN - Singapore', label: 'Singapore', code: 'SGSIN', city: 'Singapore', displayValue: 'Singapore · SGSIN', aliases: ['Singapore', 'SGSIN', 'SIN'] },
    { value: 'CNSHA - Shanghai', label: 'Shanghai', code: 'CNSHA', city: 'Shanghai', displayValue: 'Shanghai · CNSHA', aliases: ['Shanghai', 'CNSHA', 'SHA'] },
    { value: 'CNNGB - Ningbo', label: 'Ningbo', code: 'CNNGB', city: 'Ningbo', displayValue: 'Ningbo · CNNGB', aliases: ['Ningbo', 'CNNGB', 'NGB'] },
    { value: 'CNYTN - Yantian', label: 'Yantian', code: 'CNYTN', city: 'Yantian', displayValue: 'Yantian · CNYTN', aliases: ['Yantian', 'CNYTN', 'YTN'] },
    { value: 'CNXMN - Xiamen', label: 'Xiamen', code: 'CNXMN', city: 'Xiamen', displayValue: 'Xiamen · CNXMN', aliases: ['Xiamen', 'CNXMN', 'XMN'] },
    { value: 'HKHKG - Hong Kong', label: 'Hong Kong', code: 'HKHKG', city: 'Hong Kong', displayValue: 'Hong Kong · HKHKG', aliases: ['Hong Kong', 'HKHKG', 'HKG'] },
    { value: 'KRPUS - Busan', label: 'Busan', code: 'KRPUS', city: 'Busan', displayValue: 'Busan · KRPUS', aliases: ['Busan', 'Pusan', 'KRPUS', 'PUS'] },
    { value: 'AEJEA - Jebel Ali', label: 'Jebel Ali', code: 'AEJEA', city: 'Jebel Ali', displayValue: 'Jebel Ali · AEJEA', aliases: ['Jebel Ali', 'Dubai', 'AEJEA', 'JEA'] },
    { value: 'USNYC - New York', label: 'New York', code: 'USNYC', city: 'New York', displayValue: 'New York · USNYC', aliases: ['New York', 'USNYC', 'NYC'] },
    { value: 'USSAV - Savannah', label: 'Savannah', code: 'USSAV', city: 'Savannah', displayValue: 'Savannah · USSAV', aliases: ['Savannah', 'USSAV', 'SAV'] },
    { value: 'USLAX - Los Angeles', label: 'Los Angeles', code: 'USLAX', city: 'Los Angeles', displayValue: 'Los Angeles · USLAX', aliases: ['Los Angeles', 'USLAX', 'LAX'] },
    { value: 'BRSSZ - Santos', label: 'Santos', code: 'BRSSZ', city: 'Santos', displayValue: 'Santos · BRSSZ', aliases: ['Santos', 'BRSSZ', 'SSZ'] },
    { value: 'INNSA - Nhava Sheva', label: 'Nhava Sheva', code: 'INNSA', city: 'Nhava Sheva', displayValue: 'Nhava Sheva · INNSA', aliases: ['Nhava Sheva', 'Jawaharlal Nehru Port', 'INNSA', 'NSA'] }
  ];

  return {
    defaultSeaPortLocodes
  };
})();
