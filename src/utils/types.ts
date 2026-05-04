export type Replace<T, NewValues extends { [key in keyof T]?: unknown }> = T extends unknown
  ? Omit<T, keyof NewValues> & Readonly<NewValues>
  : never;
