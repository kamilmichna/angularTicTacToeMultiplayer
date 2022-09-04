interface GameConfig {
    mode: 'single' | 'multiplayer' | 'ai',
    aiProvider?: any,
    multiplayerPlayer?: number,
}