import { BaseAgent, type AgentContext, type AgentResponse } from '@/agents/core/Agent'

type SceneObjectType = 'bookShelf' | 'screen' | 'desk' | 'avatar' | 'annotationBubble'
type TriggerType = 'gaze' | 'click' | 'proximity'

interface SceneObject {
    id: string
    type: SceneObjectType
    position: { x: number; y: number; z: number }
    props: Record<string, unknown>
}

interface SceneInteraction {
    id: string
    trigger: TriggerType
    action: string
}

export class VrReadingAgent extends BaseAgent {
    id = 'vr-reading'
    name = 'VR Reading Planner Agent'
    description = 'Generates structured VR/AR reading scene plans as JSON for future clients.'

    async run(input: string, context: AgentContext): Promise<AgentResponse> {
        try {
            const prompt = input.trim() || 'Design a VR reading classroom'
            this.log('run', { prompt, context })

            const sceneName = this.createSceneName(prompt)
            const objects: SceneObject[] = this.createObjects(prompt)
            const interactions: SceneInteraction[] = this.createInteractions(prompt)

            return {
                type: 'structured',
                data: {
                    sceneName,
                    objects,
                    interactions,
                    metadata: {
                        generatedAt: new Date().toISOString(),
                        mode: 'planning',
                        note: 'Generated for simulation/planning, not tied to a hardware SDK.',
                    },
                },
            }
        } catch (error) {
            return this.safeError(error, 'VrReadingAgent failed')
        }
    }

    private createSceneName(prompt: string): string {
        if (/classroom|教室/i.test(prompt)) return 'Immersive Reading Classroom'
        if (/library|圖書館/i.test(prompt)) return 'Spatial Research Library'
        if (/lab|實驗/i.test(prompt)) return 'Experimental Reading Lab'
        return 'Adaptive VR Reading Space'
    }

    private createObjects(prompt: string): SceneObject[] {
        const hasTeacher = /teacher|老師|instructor/i.test(prompt)

        const base: SceneObject[] = [
            { id: 'shelf-1', type: 'bookShelf', position: { x: -2, y: 0, z: -1 }, props: { capacity: 120 } },
            { id: 'screen-1', type: 'screen', position: { x: 0, y: 1.8, z: -2.2 }, props: { mode: 'shared-reading', size: 'large' } },
            { id: 'desk-1', type: 'desk', position: { x: 0.8, y: 0, z: -0.8 }, props: { seats: 1, ergonomic: true } },
            { id: 'bubble-1', type: 'annotationBubble', position: { x: 0.3, y: 1.5, z: -1.2 }, props: { source: 'highlight-stream' } },
        ]

        if (hasTeacher) {
            base.push({
                id: 'avatar-teacher',
                type: 'avatar',
                position: { x: -0.2, y: 0, z: -1.8 },
                props: { role: 'teacher', followMode: true },
            })
        }

        return base
    }

    private createInteractions(prompt: string): SceneInteraction[] {
        const interactions: SceneInteraction[] = [
            { id: 'it-1', trigger: 'gaze', action: 'open annotation bubble details' },
            { id: 'it-2', trigger: 'click', action: 'pin excerpt to personal notebook' },
            { id: 'it-3', trigger: 'proximity', action: 'sync chapter focus with shared screen' },
        ]

        if (/quiz|測驗/i.test(prompt)) {
            interactions.push({
                id: 'it-4',
                trigger: 'click',
                action: 'start contextual quiz overlay for current chapter',
            })
        }

        return interactions
    }
}
