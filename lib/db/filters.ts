export const isNotNull = <T>() => {
  return { not: undefined } as T;
};