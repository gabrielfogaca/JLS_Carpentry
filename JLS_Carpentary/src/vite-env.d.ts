/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GOOGLE_PLACE_ID?: string
	readonly VITE_GOOGLE_PLACES_API_KEY?: string
	readonly VITE_GOOGLE_BUSINESS_QUERY?: string
	readonly VITE_GOOGLE_BUSINESS_QUERY_FALLBACK?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
