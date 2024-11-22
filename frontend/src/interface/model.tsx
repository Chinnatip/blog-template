export interface Parameters {
    model: string;
    outputLength: number;
    temperature: number;
    topP: number;
    topK: number;
    repetitionPenalty: number;
}
  
export type ParametersKey = 'outputLength' | 'temperature' | 'topP' | 'topK' | 'repetitionPenalty'