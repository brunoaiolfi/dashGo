type AllowedKeys<T> = {
    [K in keyof T]: T[K] extends PropertyKey ? K : never;
  }[keyof T]
  
  export default function groupBy<T extends Record<PropertyKey, any>, Key extends AllowedKeys<T>>(
    list: T[],
    criteria: Key,
  )
    : Record<T[Key], T[] | undefined> {
    return list.reduce((acc, currentValue) => {
      if (!acc[currentValue[criteria]]) {
        acc[currentValue[criteria]] = [];
      }
      (acc[currentValue[criteria]] as T[]).push(currentValue);
      return acc;
    }, {} as Record<T[Key], T[] | undefined>);
  }
  