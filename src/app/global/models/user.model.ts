export interface User {
    is_admin: boolean, 
    notifications_enabled?: boolean,
    email: String,
    name: String,
    is_verified: boolean,
    joined: String,
    phone_number?: String,
    image_url?: String
    pending_verification: boolean
}