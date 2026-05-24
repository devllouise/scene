export const CONTENT_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
};

export function normalizeContentType(value) {
  if (!value) return null;

  const tipo = String(value).trim().toLowerCase();

  if (tipo === CONTENT_TYPES.MOVIE || tipo === 'filme') {
    return CONTENT_TYPES.MOVIE;
  }

  if (tipo === CONTENT_TYPES.TV || tipo === 'serie' || tipo === 'série') {
    return CONTENT_TYPES.TV;
  }

  return null;
}

export function contentTypeLabel(value) {
  return normalizeContentType(value) === CONTENT_TYPES.TV ? 'Série' : 'Filme';
}