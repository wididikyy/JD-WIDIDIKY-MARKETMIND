export interface Category {
    id: string
    name: string
    created_at: Date
    updated_at: Date
}

export interface Commodity {
    id: string
    name: string
    unit: string
    category_id: string
    created_at: Date
    updated_at: Date

    category?: Category
}

export interface Location {
    id: string
    kecamatan: string
    latitude: string
    longitude: string
    created_at: Date
    updated_at: Date
}

export interface Prediction {
    id: string
    commodity_id: string
    location_id: string
    predicted_price: number
    prediction_date: Date
    confidence_score: number
    created_at: Date
    updated_at: Date

    commodity?: Commodity
    location?: Location
}

export interface PriceHistory {
    id: string
    source_id: string
    commodity_id: string
    location_id: string
    date: Date
    created_at: Date
    updated_at: Date

    source?: Source
    commodity?: Commodity
    location?: Location
}

export interface Source {
    id: string
    name: string
    type: string
    url: string
    created_at: Date
    updated_at: Date
}