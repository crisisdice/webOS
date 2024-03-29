export const separate = (args: string): { name: string; path: string } => {
  if (args.indexOf('/') === -1) return { path: '.', name: args }
  const tokens = args.split('/')
  const path = tokens.slice(0, tokens.length - 1).join('/')
  return { name: tokens.at(-1), path }
}

export const absoluteTokens = (path: string) => path.split('/').filter((t) => !!t)
