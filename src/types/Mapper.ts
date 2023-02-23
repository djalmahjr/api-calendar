export type BaseMap<T, B> = (elem: B[] | B) => T[] | T;
export type BaseArrayMap<T, B> = (elem: B[]) => T[];
export type BaseObjectMap<T, B> = (elem: B) => T;
