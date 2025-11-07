const buildUrl = (params) => {
  const searchString = params.toString();
  const query = searchString ? `?${searchString}` : '';
  return `${window.location.pathname}${query}${window.location.hash}`;
};

export const readSearchParams = () => new URLSearchParams(window.location.search);

export const writeSearchParams = (params, { replace = false } = {}) => {
  const nextUrl = buildUrl(params);
  if (nextUrl === `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    return params;
  }

  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', nextUrl);
  return params;
};

export const mergeSearchParams = (updates, options = {}) => {
  const params = readSearchParams();

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  return writeSearchParams(params, options);
};

export const deleteSearchParams = (keys, options = {}) => {
  const params = readSearchParams();

  keys.forEach((key) => {
    params.delete(key);
  });

  return writeSearchParams(params, options);
};

