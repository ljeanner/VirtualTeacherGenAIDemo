export class SessionItem {
    id: string;
    title?: string;
    isComplete?: boolean;
    timestamp?: Date;
    userId: string;
    scenarioName: string;
    scenarioDescription: string;
    agents: SessionAgent[];

    
    constructor(id: string, title: string, isComplete: boolean, timestamp: Date, userId: string, scenarioName: string, scenarioDescription: string, agents: SessionAgent[]) {
        this.id = id;
        this.title = title;
        this.isComplete = isComplete;
        this.timestamp = timestamp;
        this.userId = userId;
        this.scenarioName = scenarioName;
        this.scenarioDescription = scenarioDescription;
        this.agents = agents;
    }
}

export class SessionAgent {
    id:string
    prompt: string;
    type: string;

    
    constructor(id:string, prompt: string, type: string) {
        this.prompt = prompt;
        this.type = type;
        this.id = id;
    }
}