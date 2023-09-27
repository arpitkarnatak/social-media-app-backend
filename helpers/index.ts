
export function buildUserClause(params: [string, any | undefined][]) {
    const paramsForClause = params.filter(([_, value]) => !!value)
    const entries = new Map(paramsForClause)
    return Object.fromEntries(entries)
}
