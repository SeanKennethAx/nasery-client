export type UserRole = 'organizer' | 'client'

export interface User {
    id: number
    firstname: string
    middlename: string | null
    lastname: string
    email: string | null
    phone: string | null
    role: UserRole
}

interface RegisterBasePayload {
    firstname: string
    middlename?: string | null
    lastname: string
    password: string
    role: UserRole
}

export interface RegisterPayload {
    firstname: string
    middlename?: string
    lastname: string
    email?: string
    phone?: string
    password: string
    role: UserRole

    register_method: 'email' | 'phone'
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
export interface User {
    id: number
    firstname: string
    middlename: string | null
    lastname: string
    email: string | null
    phone: string | null
    role: UserRole
}