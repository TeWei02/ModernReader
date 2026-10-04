import type { Request, Response } from 'express'

type Species = 'tree' | 'dolphin' | 'bird' | 'unknown'

const speciesPool: Species[] = ['tree', 'dolphin', 'bird', 'unknown']

function chooseSpecies(input: string): Species {
    const lower = input.toLowerCase()
    if (lower.includes('tree') || lower.includes('樹')) return 'tree'
    if (lower.includes('dolphin') || lower.includes('海豚')) return 'dolphin'
    if (lower.includes('bird') || lower.includes('鳥')) return 'bird'
    return speciesPool[Math.floor(Math.random() * speciesPool.length)]
}

export function nonHumanSignalHandler(req: Request, res: Response): void {
    const signalId = typeof req.body?.signalId === 'string' && req.body.signalId.trim().length > 0
        ? req.body.signalId.trim()
        : `signal-${Date.now()}`

    const description = typeof req.body?.description === 'string' ? req.body.description : ''
    const species = chooseSpecies(`${signalId} ${description}`)
    const confidence = Number((0.42 + Math.random() * 0.48).toFixed(2))

    res.json({
        species,
        signalId,
        mockInterpretation:
            `Simulation only: interpreted ${species} signal pattern as "resource-sharing / attention-shift" behavior. ` +
            'This is mock data, not a real translation.',
        confidence,
        warnings: [
            'Simulation mode only. Not scientifically validated.',
            'Output is synthetic and should be treated as research placeholder data.',
        ],
    })
}
