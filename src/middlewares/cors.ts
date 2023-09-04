import cors from 'cors'

// seteados por defecto
const ACCEPTED_ORIGINS = [
    'http://localhost:8080'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true)
        }
        if (acceptedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error('Restringido por CORS'))
    }
})