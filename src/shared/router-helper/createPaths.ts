export function createPaths<
  T extends Record<string, string>,
  Keys extends keyof any = keyof Readonly<T>
>(pathsObj: Readonly<T>) {
  const routeNames = Object.keys(pathsObj).reduce((names, key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    names[key] = key

    return names
  }, {} as SameKeyValue<Keys>)

  return { routeNames, paths: pathsObj }
}
