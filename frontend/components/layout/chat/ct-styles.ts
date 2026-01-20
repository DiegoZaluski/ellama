// Everything related to the chat folder style should be moved to this file.
export const COLORS = {
    BACKGROUND: 'bg-chat',
    TEXT: 'text-white',
    SHADOW: 'shadow-b-md',
    background: 'bg-[#0000004D]',
    text: 'text-white',
    caret: 'caret-white',
    border: 'border-black border-b-2',
    newWindowBorder: 'border-white/50 border-b-2 ', //leave space at the end
    newWindowBg: 'bg-white/5',
    button: {
        base: 'bg-[#F5F5DC]',
        hover: 'hover:bg-white',
        generating: 'hover:bg-red-500 hover:text-white',
        disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    },
    tooltip: 'bg-black/30 text-white',
} as const;
