// Speech Recognition API type declarations
export interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: ISpeechRecognition, ev: ISpeechRecognitionEvent) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: ISpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
}

export interface ISpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: ISpeechRecognitionResultList;
}

export interface ISpeechRecognitionResultList {
  readonly length: number;
  item(index: number): ISpeechRecognitionResult;
  [index: number]: ISpeechRecognitionResult;
}

export interface ISpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): ISpeechRecognitionAlternative;
  [index: number]: ISpeechRecognitionAlternative;
}

export interface ISpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface ISpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

export interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionConstructor;
    webkitSpeechRecognition?: ISpeechRecognitionConstructor;
  }
}

export {};