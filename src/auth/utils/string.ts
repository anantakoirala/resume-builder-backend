export const kebabCase = (string?: string | null) => {
  if (!string) return '';

  return (
    string
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
      )
      ?.join('-')
      .toLowerCase() ?? ''
  );
};
