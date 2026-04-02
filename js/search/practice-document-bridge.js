window.KedrixOnePracticeDocumentBridge = (() => {
  'use strict';

  const DocumentEngine = window.KedrixOneDocumentEngine;

  function uniqueMatches(matches = []) {
    const seen = new Set();
    return (Array.isArray(matches) ? matches : []).filter((match) => {
      const key = `${match?.label || ''}|${match?.value || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return Boolean(match?.value);
    });
  }

  function bundleMatchesToPracticeMatches(bundle) {
    const documents = Array.isArray(bundle?.matchedDocuments) ? bundle.matchedDocuments : [];
    return uniqueMatches(documents.flatMap((document) => {
      const direct = Array.isArray(document.matches) ? document.matches : [];
      const header = [{ label: 'Documento', value: document.fileName || '—' }];
      return [...header, ...direct];
    })).slice(0, 6);
  }

  function toPracticeResult(bundle) {
    const practice = bundle?.practice || {};
    return {
      practiceId: bundle.practiceId || practice.id || '',
      reference: bundle.reference || practice.reference || practice.id || '—',
      clientName: bundle.clientName || practice.clientName || practice.client || '—',
      practiceType: practice.practiceType || '',
      practiceTypeLabel: bundle.practiceTypeLabel || practice.practiceTypeLabel || practice.practiceType || '—',
      status: bundle.practiceStatus || practice.status || '—',
      category: practice.category || '—',
      practiceDate: practice.practiceDate || practice.eta || bundle.importedAt || '',
      score: Number(bundle.score || 0),
      matches: bundleMatchesToPracticeMatches(bundle),
      linkedDocumentsCount: bundle.documentsCount || bundle.documents?.length || 0,
      matchedDocumentsCount: bundle.matchedDocumentsCount || 0,
      searchScope: 'documents',
      searchScopeLabel: 'Match documentale',
      documentMatches: (bundle.matchedDocuments || []).slice(0, 3).map((item) => ({
        fileName: item.fileName || '—',
        documentTypeLabel: item.documentTypeLabel || item.documentType || '—'
      }))
    };
  }

  function mergePracticeResults(query, practiceResults = [], state, i18n) {
    if (!query || !DocumentEngine || typeof DocumentEngine.searchBundles !== 'function') {
      return Array.isArray(practiceResults) ? practiceResults : [];
    }

    const baseResults = Array.isArray(practiceResults) ? practiceResults.map((item) => ({ ...item })) : [];
    const documentBundles = DocumentEngine.searchBundles(query, state, i18n);
    if (!documentBundles.length) return baseResults;

    const byPracticeId = new Map(baseResults.map((item) => [String(item.practiceId || '').trim(), item]));

    documentBundles.forEach((bundle) => {
      const practiceId = String(bundle.practiceId || '').trim();
      if (!practiceId) return;
      const existing = byPracticeId.get(practiceId);
      if (existing) {
        const relationalMatches = bundleMatchesToPracticeMatches(bundle);
        existing.matches = uniqueMatches([...(existing.matches || []), ...relationalMatches]).slice(0, 6);
        existing.linkedDocumentsCount = bundle.documentsCount || bundle.documents?.length || existing.linkedDocumentsCount || 0;
        existing.matchedDocumentsCount = bundle.matchedDocumentsCount || 0;
        existing.documentMatches = (bundle.matchedDocuments || []).slice(0, 3).map((item) => ({
          fileName: item.fileName || '—',
          documentTypeLabel: item.documentTypeLabel || item.documentType || '—'
        }));
        existing.searchScope = 'practice+documents';
        existing.searchScopeLabel = 'Pratica + documenti collegati';
        existing.score = Number(existing.score || 0) + Number(bundle.score || 0);
        return;
      }

      const next = toPracticeResult(bundle);
      if (!next.practiceId) return;
      baseResults.push(next);
      byPracticeId.set(next.practiceId, next);
    });

    return baseResults.sort((left, right) => Number(right.score || 0) - Number(left.score || 0));
  }

  return {
    mergePracticeResults
  };
})();
