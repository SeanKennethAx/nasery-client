export type UserRole = 'organizer' | 'client'

export interface User {
    id: number
    firstname: string
    middlename: string | null
    lastname: string
    email: string | null
    phone: string | null
    address: string | null
    role: UserRole
}

export interface RegisterPayload {
    firstname: string
    middlename?: string
    lastname: string

    email: string
    phone: string
    address: string

    password: string
    role: UserRole
}

export interface RegisterResponse {
    message: string
    data: User
}

export type LoginPayload =
    | {
        email: string
        phone?: never
        password: string
    }
    | {
        phone: string
        email?: never
        password: string
    }

export interface LoginResponse {
    message: string
    token: string
    user: User
}

export interface LaravelValidationError {
    message: string
    errors: Record<string, string[]>
}

export interface CurrentUserResponse {
    user: User
}