export function buildPaginationLinks(path: string, page: number, totalPages: number, params: URLSearchParams) {
  let next = null;
  let prev = null;

  if (page < totalPages) {
    const nextParams = new URLSearchParams(params);
    nextParams.set('page', String(page + 1));
    next = `${path}?${nextParams.toString()}`;
  }

  if (page > 1) {
    const prevParams = new URLSearchParams(params);
    prevParams.set('page', String(page - 1));
    prev = `${path}?${prevParams.toString()}`;
  }

  return { prev, next };
}
