function joinUrl(base, path) {
    if (!base) return path
    if (base.endsWith('/') && path.startsWith('/')) return base + path.slice(1)
    if (!base.endsWith('/') && !path.startsWith('/')) return base + '/' + path
    return base + path
}

export async function request(path, options = {}) {
    const base = import.meta.env.VITE_API_BASE || ''
    const url = joinUrl(base, path)

    const headers = new Headers(options.headers || {})
    headers.set('Content-Type', headers.get('Content-Type') || 'application/json')

    const token = localStorage.getItem('access_token')
    if (token) headers.set('Authorization', `Bearer ${token}`)

    const res = await fetch(url, { ...options, headers })

    const contentType = res.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null)

    if (!res.ok) {
        const err = new Error((data && data.message) || `HTTP ${res.status}`)
        err.status = res.status
        err.data = data
        throw err
    }

    return data
}