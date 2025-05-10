function pathIs(path, options) {
  const pathname = window?.location?.pathname;
  if (options?.exact) return pathname === path;
  return pathname.includes(path);
}

export { pathIs };
