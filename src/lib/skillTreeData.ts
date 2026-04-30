export interface SkillNodeData {
  id: string;
  name: string;
  description: string;
  category: 'Engineering' | 'Physical Fitness' | 'Content Creation' | 'Mental Fortitude';
  x: number;
  y: number;
  parentId?: string;
}

export const SKILL_TREE: SkillNodeData[] = [
  // Engineering Branch
  { id: 'eng-1', name: 'Web Fundamentals', description: 'Master HTML, CSS, and basic JS. +5% coding efficiency.', category: 'Engineering', x: 0, y: 0 },
  { id: 'eng-2', name: 'React Architect', description: 'Build complex component trees. +10% UI speed.', category: 'Engineering', x: -100, y: 100, parentId: 'eng-1' },
  { id: 'eng-3', name: 'Backend Mastery', description: 'Efficient database and API design. +10% system stability.', category: 'Engineering', x: 100, y: 100, parentId: 'eng-1' },
  { id: 'eng-4', name: 'Next.js 14 Pro', description: 'Server components and advanced routing. +15% performance.', category: 'Engineering', x: -150, y: 200, parentId: 'eng-2' },
  { id: 'eng-5', name: 'AI Integration', description: 'Harness LLMs for smarter apps. +20% developer velocity.', category: 'Engineering', x: 150, y: 200, parentId: 'eng-3' },

  // Physical Fitness Branch
  { id: 'fit-1', name: 'Base Conditioning', description: 'Consistent daily movement. +5% stamina.', category: 'Physical Fitness', x: 500, y: 0 },
  { id: 'fit-2', name: 'Strength Specialist', description: 'Advanced weight lifting techniques. +10% power.', category: 'Physical Fitness', x: 400, y: 100, parentId: 'fit-1' },
  { id: 'fit-3', name: 'Endurance Runner', description: 'Optimize VO2 max and breath control. +10% focus duration.', category: 'Physical Fitness', x: 600, y: 100, parentId: 'fit-1' },
  { id: 'fit-4', name: 'Master of Calisthenics', description: 'Elite body control (10+ pull-ups). +15% agility.', category: 'Physical Fitness', x: 400, y: 200, parentId: 'fit-2' },

  // Content Creation Branch
  { id: 'cont-1', name: 'Visual Literacy', description: 'Understanding design principles. +5% aesthetic appeal.', category: 'Content Creation', x: 1000, y: 0 },
  { id: 'cont-2', name: 'Storytelling Flow', description: 'Narrative structure for high engagement. +10% retention.', category: 'Content Creation', x: 900, y: 100, parentId: 'cont-1' },
  { id: 'cont-3', name: 'Video Production', description: 'High-quality editing and grading. +10% production value.', category: 'Content Creation', x: 1100, y: 100, parentId: 'cont-1' },

  // Mental Fortitude Branch
  { id: 'ment-1', name: 'The Focused Mind', description: 'Basic meditation and deep work. +5% clarity.', category: 'Mental Fortitude', x: 1500, y: 0 },
  { id: 'ment-2', name: 'Stoic Resilience', description: 'Emotional regulation under pressure. +10% decision speed.', category: 'Mental Fortitude', x: 1400, y: 100, parentId: 'ment-1' },
  { id: 'ment-3', name: 'Elite Flow State', description: 'Immediate entry into deep focus. +15% productivity.', category: 'Mental Fortitude', x: 1600, y: 100, parentId: 'ment-1' },
];
