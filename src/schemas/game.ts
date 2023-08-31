import { z } from 'zod'

const gameSchema = z.object({
    players: z.array(z.object({
        name: z.string().nonempty(),
        points: z.number().int().min(0).max(999).default(0)
    })).min(2)
})

export function validateGame(object: any) {
    return gameSchema.safeParse(object)
}

export function validatePartialGame(object: any) {
    return gameSchema.partial().safeParse(object)
}