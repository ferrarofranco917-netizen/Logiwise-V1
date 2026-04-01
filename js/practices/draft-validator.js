window.KedrixOnePracticeDraftValidator = (() => {
  'use strict';

  const I18N = window.KedrixOneI18N;
  const PracticeSchemas = window.KedrixOnePracticeSchemas;

  function isEmptyValue(value) {
    if (Array.isArray(value)) return value.length === 0;
    return String(value || '').trim() === '';
  }

  function fieldLabel(field) {
    if (!field) return '';
    return I18N.t(field.labelKey, field.name || '');
  }

  function buildError(fieldName, tab, type, messageKey, fallbackMessage, overrideLabel) {
    const field = PracticeSchemas.getField(type, fieldName);
    return {
      field: fieldName,
      tab,
      label: overrideLabel || fieldLabel(field) || fieldName,
      message: I18N.t(messageKey, fallbackMessage)
    };
  }

  function validateDraft(draft, companyConfig) {
    const errors = [];
    const type = draft && draft.practiceType ? draft.practiceType : '';
    const dynamicData = (draft && draft.dynamicData) || {};

    if (!type) {
      errors.push({ field: 'practiceType', tab: 'identity', label: I18N.t('ui.practiceType', 'Tipo pratica'), message: I18N.t('ui.validationPracticeTypeRequired', 'Seleziona il tipo pratica.') });
    }
    if (isEmptyValue(draft && draft.clientName)) {
      errors.push({ field: 'clientName', tab: 'identity', label: I18N.t('ui.clientEditable', 'Cliente'), message: I18N.t('ui.validationClientRequired', 'Compila il cliente.') });
    }
    if (isEmptyValue(draft && draft.practiceDate)) {
      errors.push({ field: 'practiceDate', tab: 'identity', label: I18N.t('ui.practiceDate', 'Data pratica'), message: I18N.t('ui.validationPracticeDateRequired', 'Compila la data pratica.') });
    }

    if (!type) return { valid: errors.length === 0, errors };

    const schema = PracticeSchemas.getSchema(type);
    if (!schema) {
      errors.push({ field: 'practiceType', tab: 'identity', label: I18N.t('ui.practiceType', 'Tipo pratica'), message: I18N.t('ui.validationInvalidPracticeType', 'Tipologia pratica non riconosciuta.') });
      return { valid: false, errors };
    }

    const allowedCategories = PracticeSchemas.getCategoryOptions(type);
    if (allowedCategories.length && isEmptyValue(draft && draft.category)) {
      errors.push({ field: 'category', tab: 'identity', label: I18N.t('ui.categoryLabel', 'Categoria'), message: I18N.t('ui.validationCategoryRequired', 'Seleziona la categoria coerente con il tipo pratica.') });
    }
    if (!isEmptyValue(draft && draft.category) && allowedCategories.length && !allowedCategories.includes(draft.category)) {
      errors.push({ field: 'category', tab: 'identity', label: I18N.t('ui.categoryLabel', 'Categoria'), message: I18N.t('ui.validationCategoryInvalid', 'Categoria non coerente con la tipologia selezionata.') });
    }

    PracticeSchemas.getFields(type).forEach((field) => {
      if (field.type === 'derived' || field.type === 'select-derived') return;
      const value = dynamicData[field.name];

      if (field.required && isEmptyValue(value)) {
        errors.push(buildError(field.name, field.tab, type, 'ui.validationFieldRequired', `${fieldLabel(field)} obbligatorio.`));
        return;
      }

      if (field.type === 'number' && !isEmptyValue(value)) {
        const numericValue = Number(value);
        if (Number.isNaN(numericValue) || numericValue < 0) {
          errors.push(buildError(field.name, field.tab, type, 'ui.validationPositiveNumber', 'Inserisci un valore numerico valido e non negativo.'));
        }
      }

      if (field.type === 'select' && !isEmptyValue(value)) {
        const allowed = PracticeSchemas.getFieldOptions(type, field, companyConfig);
        if (allowed.length && !allowed.includes(value)) {
          errors.push(buildError(field.name, field.tab, type, 'ui.validationSelectInvalid', 'Seleziona un valore previsto dalla configurazione.'));
        }
      }
    });

    if (type.startsWith('sea_')) {
      if (draft.category === 'FCL-FULL' && isEmptyValue(dynamicData.containerCode)) {
        errors.push(buildError('containerCode', 'detail', type, 'ui.validationContainerRequired', 'Il container è obbligatorio per le pratiche FCL.'));
      }
      if (draft.category === 'FCL-FULL' && isEmptyValue(dynamicData.mbl)) {
        errors.push(buildError('mbl', 'practice', type, 'ui.validationMblRequired', 'Compila il Master BL per le pratiche FCL.'));
      }
      if (draft.category === 'LCL-GROUPAGE' && isEmptyValue(dynamicData.hbl)) {
        errors.push(buildError('hbl', 'practice', type, 'ui.validationHblRequired', "Compila l'House BL per le pratiche LCL / groupage."));
      }
      if (!isEmptyValue(dynamicData.freightAmount) && isEmptyValue(dynamicData.freightCurrency)) {
        errors.push(buildError('freightCurrency', 'practice', type, 'ui.validationFreightCurrencyRequired', 'Se indichi il nolo, seleziona anche la valuta.'));
      }
      if (!isEmptyValue(dynamicData.vesselExchangeRate) && isEmptyValue(dynamicData.vesselExchangeCurrency)) {
        errors.push(buildError('vesselExchangeCurrency', 'practice', type, 'ui.validationExchangeCurrencyRequired', 'Se indichi il cambio nave, seleziona anche la valuta.'));
      }
    }

    if (type.startsWith('air_') && draft.category === 'AIR-CONSOL' && isEmptyValue(dynamicData.hawb)) {
      errors.push(buildError('hawb', 'practice', type, 'ui.validationHawbRequired', "Compila l'HAWB per le spedizioni aeree in consol."));
    }

    if (type.startsWith('road_')) {
      const pickupDate = dynamicData.pickupDate;
      const deliveryDate = dynamicData.deliveryDate;
      if (!isEmptyValue(pickupDate) && !isEmptyValue(deliveryDate) && deliveryDate < pickupDate) {
        errors.push(buildError('deliveryDate', 'practice', type, 'ui.validationDeliveryAfterPickup', 'La consegna non può essere precedente alla presa.'));
      }
    }

    if (type === 'warehouse' && draft.category === 'DEPOSITO DOGANALE' && isEmptyValue(dynamicData.customsOffice)) {
      errors.push(buildError('customsOffice', 'practice', type, 'ui.validationWarehouseCustomsRequired', 'Per il deposito doganale indica la dogana di riferimento.'));
    }

    const uniqueErrors = [];
    const seenErrors = new Set();
    errors.forEach((error) => {
      const key = `${error.tab || ''}|${error.field || ''}|${error.message || ''}`;
      if (seenErrors.has(key)) return;
      seenErrors.add(key);
      uniqueErrors.push(error);
    });

    return { valid: uniqueErrors.length === 0, errors: uniqueErrors };
  }

  return {
    validateDraft
  };
})();
