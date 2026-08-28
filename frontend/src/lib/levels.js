export const LEVELS = {
  critical: {
    label: 'Critical',
    text: 'text-[#FF4757]',
    bg: 'bg-[#FF4757]',
    bgSoft: 'bg-[#4A1620]',
    border: 'border-[#FF4757]/40',
    dot: '#FF4757',
  },
  high: {
    label: 'High',
    text: 'text-[#FF8A3D]',
    bg: 'bg-[#FF8A3D]',
    bgSoft: 'bg-[#402812]',
    border: 'border-[#FF8A3D]/40',
    dot: '#FF8A3D',
  },
  elevated: {
    label: 'Elevated',
    text: 'text-[#FFB020]',
    bg: 'bg-[#FFB020]',
    bgSoft: 'bg-[#4A3311]',
    border: 'border-[#FFB020]/40',
    dot: '#FFB020',
  },
  safe: {
    label: 'Safe',
    text: 'text-[#2ED573]',
    bg: 'bg-[#2ED573]',
    bgSoft: 'bg-[#143627]',
    border: 'border-[#2ED573]/40',
    dot: '#2ED573',
  },
  nominal: {
    label: 'Nominal',
    text: 'text-[#2ED573]',
    bg: 'bg-[#2ED573]',
    bgSoft: 'bg-[#143627]',
    border: 'border-[#2ED573]/40',
    dot: '#2ED573',
  },
}

export function levelOf(key) {
  return LEVELS[key] || LEVELS.nominal
}
