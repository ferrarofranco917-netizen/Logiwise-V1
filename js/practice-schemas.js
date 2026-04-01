window.KedrixOnePracticeSchemas = (() => {
  'use strict';

  const incoterms2020 = ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF'];

  const sharedNotes = [
    { name: 'internalNotes', type: 'textarea', labelKey: 'ui.internalNotes', required: false }
  ];

  const schemas = {
    sea_import: {
      group: 'sea',
      tabs: {
        practice: [
          { name: 'importer', type: 'text', labelKey: 'ui.importer' },
          { name: 'clientContact', type: 'text', labelKey: 'ui.clientContact' },
          { name: 'clientAgency', type: 'text', labelKey: 'ui.agency' },
          { name: 'client', type: 'derived', labelKey: 'ui.clientRequired' },
          { name: 'consignee', type: 'text', labelKey: 'ui.consignee' },
          { name: 'company', type: 'text', labelKey: 'ui.shippingCompany' },
          { name: 'portLoading', type: 'text', labelKey: 'ui.seaPortLoading' },
          { name: 'portDischarge', type: 'text', labelKey: 'ui.seaPortDischarge' },
          { name: 'vesselVoyage', type: 'text', labelKey: 'ui.vesselVoyage' },
          { name: 'arrivalDate', type: 'date', labelKey: 'ui.arrivalDate' },
          { name: 'booking', type: 'text', labelKey: 'ui.booking' },
          { name: 'customsOffice', type: 'text', labelKey: 'ui.customsOffice' },
          { name: 'incoterm', type: 'select', labelKey: 'ui.incoterm', options: incoterms2020 },
          { name: 'category', type: 'select-derived', labelKey: 'ui.categoryLabel' }
        ],
        detail: [
          { name: 'articleCode', type: 'text', labelKey: 'ui.articleCode' },
          { name: 'containerCode', type: 'text', labelKey: 'ui.containerCode' },
          { name: 'taric', type: 'text', labelKey: 'ui.taric' },
          { name: 'goodsDescription', type: 'textarea', labelKey: 'ui.goodsDescription' },
          { name: 'packageType', type: 'text', labelKey: 'ui.packageType' },
          { name: 'packageCount', type: 'number', labelKey: 'ui.packageCount' },
          { name: 'grossWeight', type: 'number', labelKey: 'ui.grossWeight' },
          { name: 'netWeight', type: 'number', labelKey: 'ui.netWeight' },
          { name: 'teu', type: 'number', labelKey: 'ui.teu' },
          { name: 'cbm', type: 'number', labelKey: 'ui.cbm' },
          { name: 'vgm', type: 'text', labelKey: 'ui.vgm' },
          { name: 'inspectionFlags', type: 'checkbox-group', labelKey: 'ui.verifications', options: ['ui.verifyMerce','ui.verifyDocumentale','ui.verifyScanner','ui.verifySanitario','ui.verifyMagazzino'] }
        ],
        notes: sharedNotes
      }
    },
    sea_export: {
      group: 'sea',
      tabs: {
        practice: [
          { name: 'shipper', type: 'text', labelKey: 'ui.shipper' },
          { name: 'client', type: 'derived', labelKey: 'ui.clientRequired' },
          { name: 'consignee', type: 'text', labelKey: 'ui.consignee' },
          { name: 'company', type: 'text', labelKey: 'ui.shippingCompany' },
          { name: 'portLoading', type: 'text', labelKey: 'ui.seaPortLoading' },
          { name: 'portDischarge', type: 'text', labelKey: 'ui.seaPortDischarge' },
          { name: 'vesselVoyage', type: 'text', labelKey: 'ui.vesselVoyage' },
          { name: 'departureDate', type: 'date', labelKey: 'ui.departureDate' },
          { name: 'booking', type: 'text', labelKey: 'ui.booking' },
          { name: 'customsOffice', type: 'text', labelKey: 'ui.customsOffice' },
          { name: 'incoterm', type: 'select', labelKey: 'ui.incoterm', options: incoterms2020 },
          { name: 'category', type: 'select-derived', labelKey: 'ui.categoryLabel' }
        ],
        detail: [
          { name: 'articleCode', type: 'text', labelKey: 'ui.articleCode' },
          { name: 'containerCode', type: 'text', labelKey: 'ui.containerCode' },
          { name: 'taric', type: 'text', labelKey: 'ui.taric' },
          { name: 'goodsDescription', type: 'textarea', labelKey: 'ui.goodsDescription' },
          { name: 'packageType', type: 'text', labelKey: 'ui.packageType' },
          { name: 'packageCount', type: 'number', labelKey: 'ui.packageCount' },
          { name: 'grossWeight', type: 'number', labelKey: 'ui.grossWeight' },
          { name: 'netWeight', type: 'number', labelKey: 'ui.netWeight' },
          { name: 'teu', type: 'number', labelKey: 'ui.teu' },
          { name: 'cbm', type: 'number', labelKey: 'ui.cbm' },
          { name: 'vgm', type: 'text', labelKey: 'ui.vgm' },
          { name: 'inspectionFlags', type: 'checkbox-group', labelKey: 'ui.verifications', options: ['ui.verifyMerce','ui.verifyDocumentale','ui.verifyScanner','ui.verifySanitario','ui.verifyMagazzino'] }
        ],
        notes: sharedNotes
      }
    },
    air_import: {
      group: 'air',
      tabs: {
        practice: [
          { name: 'importer', type: 'text', labelKey: 'ui.importer' },
          { name: 'client', type: 'derived', labelKey: 'ui.clientRequired' },
          { name: 'consignee', type: 'text', labelKey: 'ui.consignee' },
          { name: 'airline', type: 'text', labelKey: 'ui.airline' },
          { name: 'airportDeparture', type: 'text', labelKey: 'ui.airportDeparture' },
          { name: 'airportDestination', type: 'text', labelKey: 'ui.airportDestination' },
          { name: 'mawb', type: 'text', labelKey: 'ui.mawb' },
          { name: 'hawb', type: 'text', labelKey: 'ui.hawb' },
          { name: 'arrivalDate', type: 'date', labelKey: 'ui.arrivalDate' },
          { name: 'booking', type: 'text', labelKey: 'ui.booking' },
          { name: 'customsOffice', type: 'text', labelKey: 'ui.customsOperator' },
          { name: 'incoterm', type: 'select', labelKey: 'ui.incoterm', options: incoterms2020 }
        ],
        detail: [
          { name: 'articleCode', type: 'text', labelKey: 'ui.articleCode' },
          { name: 'goodsDescription', type: 'textarea', labelKey: 'ui.goodsDescription' },
          { name: 'packageCount', type: 'number', labelKey: 'ui.packageCount' },
          { name: 'packageType', type: 'text', labelKey: 'ui.packageType' },
          { name: 'grossWeight', type: 'number', labelKey: 'ui.grossWeight' },
          { name: 'chargeableWeight', type: 'number', labelKey: 'ui.chargeableWeight' },
          { name: 'volumeWeight', type: 'number', labelKey: 'ui.volumeWeight' },
          { name: 'cbm', type: 'number', labelKey: 'ui.cbm' },
          { name: 'originDest', type: 'text', labelKey: 'ui.originDestination' },
          { name: 'warehouseFlag', type: 'checkbox-group', labelKey: 'ui.verifications', options: ['ui.verifyMerce','ui.verifyDocumentale','ui.verifyScanner','ui.verifySanitario'] }
        ],
        notes: sharedNotes
      }
    },
    air_export: {
      group: 'air',
      tabs: {
        practice: [
          { name: 'shipper', type: 'text', labelKey: 'ui.shipper' },
          { name: 'client', type: 'derived', labelKey: 'ui.clientRequired' },
          { name: 'consignee', type: 'text', labelKey: 'ui.consignee' },
          { name: 'airline', type: 'text', labelKey: 'ui.airline' },
          { name: 'airportDeparture', type: 'text', labelKey: 'ui.airportDeparture' },
          { name: 'airportDestination', type: 'text', labelKey: 'ui.airportDestination' },
          { name: 'mawb', type: 'text', labelKey: 'ui.mawb' },
          { name: 'hawb', type: 'text', labelKey: 'ui.hawb' },
          { name: 'departureDate', type: 'date', labelKey: 'ui.departureDate' },
          { name: 'booking', type: 'text', labelKey: 'ui.booking' },
          { name: 'customsOffice', type: 'text', labelKey: 'ui.customsOperator' },
          { name: 'incoterm', type: 'select', labelKey: 'ui.incoterm', options: incoterms2020 }
        ],
        detail: [
          { name: 'articleCode', type: 'text', labelKey: 'ui.articleCode' },
          { name: 'goodsDescription', type: 'textarea', labelKey: 'ui.goodsDescription' },
          { name: 'packageCount', type: 'number', labelKey: 'ui.packageCount' },
          { name: 'packageType', type: 'text', labelKey: 'ui.packageType' },
          { name: 'grossWeight', type: 'number', labelKey: 'ui.grossWeight' },
          { name: 'chargeableWeight', type: 'number', labelKey: 'ui.chargeableWeight' },
          { name: 'volumeWeight', type: 'number', labelKey: 'ui.volumeWeight' },
          { name: 'cbm', type: 'number', labelKey: 'ui.cbm' },
          { name: 'originDest', type: 'text', labelKey: 'ui.originDestination' }
        ],
        notes: sharedNotes
      }
    },
    road_import: {
      group: 'road',
      tabs: {
        practice: [
          { name: 'shipper', type: 'text', labelKey: 'ui.sender' },
          { name: 'client', type: 'derived', labelKey: 'ui.clientRequired' },
          { name: 'consignee', type: 'text', labelKey: 'ui.consignee' },
          { name: 'carrier', type: 'text', labelKey: 'ui.carrier' },
          { name: 'originDest', type: 'text', labelKey: 'ui.originDestination' },
          { name: 'pickupDate', type: 'date', labelKey: 'ui.pickupDate' },
          { name: 'deliveryDate', type: 'date', labelKey: 'ui.deliveryDate' },
          { name: 'vehicleType', type: 'text', labelKey: 'ui.vehicleType' },
          { name: 'plateDriver', type: 'text', labelKey: 'ui.plateDriver' },
          { name: 'pickupPlace', type: 'text', labelKey: 'ui.pickupPlace' },
          { name: 'deliveryPlace', type: 'text', labelKey: 'ui.deliveryPlace' },
          { name: 'incoterm', type: 'select', labelKey: 'ui.incoterm', options: incoterms2020 }
        ],
        detail: [
          { name: 'articleCode', type: 'text', labelKey: 'ui.articleCode' },
          { name: 'containerCode', type: 'text', labelKey: 'ui.containerCode' },
          { name: 'taric', type: 'text', labelKey: 'ui.taric' },
          { name: 'goodsDescription', type: 'textarea', labelKey: 'ui.goodsDescription' },
          { name: 'packageCount', type: 'number', labelKey: 'ui.packageCount' },
          { name: 'grossWeight', type: 'number', labelKey: 'ui.grossWeight' },
          { name: 'netWeight', type: 'number', labelKey: 'ui.netWeight' },
          { name: 'cbm', type: 'number', labelKey: 'ui.cbm' },
          { name: 'linearMeters', type: 'number', labelKey: 'ui.linearMeters' },
          { name: 'booking', type: 'text', labelKey: 'ui.booking' }
        ],
        notes: sharedNotes
      }
    },
    road_export: {
      group: 'road',
      tabs: {
        practice: [
          { name: 'shipper', type: 'text', labelKey: 'ui.sender' },
          { name: 'client', type: 'derived', labelKey: 'ui.clientRequired' },
          { name: 'consignee', type: 'text', labelKey: 'ui.consignee' },
          { name: 'carrier', type: 'text', labelKey: 'ui.carrier' },
          { name: 'originDest', type: 'text', labelKey: 'ui.originDestination' },
          { name: 'pickupDate', type: 'date', labelKey: 'ui.pickupDate' },
          { name: 'deliveryDate', type: 'date', labelKey: 'ui.deliveryDate' },
          { name: 'vehicleType', type: 'text', labelKey: 'ui.vehicleType' },
          { name: 'plateDriver', type: 'text', labelKey: 'ui.plateDriver' },
          { name: 'pickupPlace', type: 'text', labelKey: 'ui.pickupPlace' },
          { name: 'deliveryPlace', type: 'text', labelKey: 'ui.deliveryPlace' },
          { name: 'incoterm', type: 'select', labelKey: 'ui.incoterm', options: incoterms2020 }
        ],
        detail: [
          { name: 'articleCode', type: 'text', labelKey: 'ui.articleCode' },
          { name: 'containerCode', type: 'text', labelKey: 'ui.containerCode' },
          { name: 'taric', type: 'text', labelKey: 'ui.taric' },
          { name: 'goodsDescription', type: 'textarea', labelKey: 'ui.goodsDescription' },
          { name: 'packageCount', type: 'number', labelKey: 'ui.packageCount' },
          { name: 'grossWeight', type: 'number', labelKey: 'ui.grossWeight' },
          { name: 'netWeight', type: 'number', labelKey: 'ui.netWeight' },
          { name: 'cbm', type: 'number', labelKey: 'ui.cbm' },
          { name: 'linearMeters', type: 'number', labelKey: 'ui.linearMeters' },
          { name: 'booking', type: 'text', labelKey: 'ui.booking' }
        ],
        notes: sharedNotes
      }
    },
    warehouse: {
      group: 'warehouse',
      tabs: {
        practice: [
          { name: 'client', type: 'derived', labelKey: 'ui.clientRequired' },
          { name: 'warehouseContact', type: 'text', labelKey: 'ui.clientContact' },
          { name: 'originDest', type: 'text', labelKey: 'ui.originDestination' },
          { name: 'lots', type: 'text', labelKey: 'ui.lots' },
          { name: 'deposit', type: 'text', labelKey: 'ui.deposit' },
          { name: 'linkedTo', type: 'text', labelKey: 'ui.linkedTo' },
          { name: 'baseQuotation', type: 'text', labelKey: 'ui.baseQuotation' },
          { name: 'plateDriver', type: 'text', labelKey: 'ui.plateDriver' }
        ],
        detail: [
          { name: 'articleCode', type: 'text', labelKey: 'ui.articleCode' },
          { name: 'containerCode', type: 'text', labelKey: 'ui.containerCode' },
          { name: 'taric', type: 'text', labelKey: 'ui.taric' },
          { name: 'goodsDescription', type: 'textarea', labelKey: 'ui.goodsDescription' },
          { name: 'packageCount', type: 'number', labelKey: 'ui.packageCount' },
          { name: 'grossWeight', type: 'number', labelKey: 'ui.grossWeight' },
          { name: 'netWeight', type: 'number', labelKey: 'ui.netWeight' },
          { name: 'cbm', type: 'number', labelKey: 'ui.cbm' },
          { name: 'linearMeters', type: 'number', labelKey: 'ui.linearMeters' },
          { name: 'vgm', type: 'text', labelKey: 'ui.vgm' }
        ],
        notes: sharedNotes
      }
    }
  };

  function getSchema(type) {
    return schemas[type] || null;
  }

  return {
    incoterms2020,
    schemas,
    getSchema
  };
})();