/** Process children to return only text conent of it */
export function childToString(children?: React.ReactNode): string | undefined {
  const base = children?.toString()
  if (typeof base !== 'string') {
    return
  }

  // remove ,[object Object], from base string
  return base.replace(/,\[object Object\],/g, '')
}
