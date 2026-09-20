import { z } from 'zod';

export const noteSchema = z.object({ id: z.string().min(1).max(100), text: z.string().trim().min(1).max(4000), time: z.string(), kind: z.enum(['typed', 'voice', 'sample']) });
export type Note = z.infer<typeof noteSchema>;
export const analysisSchema = z.object({
  priority: z.string().min(1).max(160),
  evidence: z.array(z.object({ noteId: z.string(), quote: z.string().min(1).max(4000) })).min(1).max(6),
  interpretation: z.string().min(1).max(1500),
  action: z.string().min(1).max(1500),
  mentorAction: z.string().min(1).max(1000),
  lookFor: z.string().min(1).max(1000),
  unknown: z.string().min(1).max(1000),
  resourceId: z.enum(['ncf-observation', 'ncf-materials']),
});
export type Analysis = z.infer<typeof analysisSchema>;
export const planSchema = z.object({ teacherAction: z.string().trim().min(1).max(1500), mentorAction: z.string().trim().min(1).max(1000), lookFor: z.string().trim().min(1).max(1000), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), completed: z.boolean(), outcome: z.string().max(4000) });
export type Plan = z.infer<typeof planSchema>;
export const visitSchema = z.object({
  id: z.string(), school: z.string().trim().min(1).max(120), teacher: z.string().trim().min(1).max(120), grade: z.string(), subject: z.string(), topic: z.string().max(150), date: z.string(), time: z.string(),
  status: z.enum(['planned', 'draft', 'review', 'follow-up', 'completed']), notes: z.array(noteSchema).max(40), analysis: analysisSchema.nullable(), engine: z.enum(['demo', 'claude']).nullable(), plan: planSchema.nullable(), sample: z.boolean(),
});
export type Visit = z.infer<typeof visitSchema>;
export const storageSchema = z.object({ version: z.literal(1), visits: z.array(visitSchema) });
export type Language = 'en' | 'hi';
export const sampleNotes = [
  'The teacher asked five subtraction questions. The same four children answered each time.',
  'About half the class did not give a response during the questions I observed.',
  'The teacher demonstrated regrouping on the board. I did not see concrete materials used during this part of the lesson.',
];
export const hindiSampleNotes = [
  'शिक्षिका ने घटाव के पाँच सवाल पूछे। हर बार वही चार बच्चों ने जवाब दिया।',
  'मैंने जिन सवालों को देखा, उनमें लगभग आधी कक्षा ने कोई जवाब नहीं दिया।',
  'शिक्षिका ने बोर्ड पर उधार लेकर घटाव दिखाया। पाठ के इस हिस्से में मैंने ठोस सामग्री का उपयोग नहीं देखा।',
];
export const resources = [
  { id: 'ncf-observation' as const, title: 'Observe, gather evidence, reflect', category: 'Assessment', section: 'NCF–FS 2022 · §6.2.1 · pp. 177–178', url: 'https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf#page=188', summary: 'Plan observations around learning goals, record what happens, and use the evidence to adapt teaching.', adaptation: 'Saksham practice idea: ask every child to show a response, then use those responses to plan support. This activity is an adaptation, not a quoted NCERT prescription.' },
  { id: 'ncf-materials' as const, title: 'Make learning tangible', category: 'Learning materials', section: 'NCF–FS 2022 · §5.4 · p. 152 onward', url: 'https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf#page=163', summary: 'Teaching and learning materials support children’s engagement with concepts and classroom experiences.', adaptation: 'Saksham practice idea: use locally available counters for a worked subtraction example. A mentor should check the activity against the lesson and children’s learning needs.' },
];
export function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function dateAfter(days: number) { const d = new Date(); d.setDate(d.getDate()+days); return localDate(d); }
export function formatDate(value: string, language: Language = 'en') { return new Date(`${value}T12:00:00`).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {day:'numeric',month:'short'}); }
export function createVisit(values: Partial<Visit> = {}): Visit {
  return { id: crypto.randomUUID(), school:'', teacher:'', grade:'2', subject:'Mathematics', topic:'', date:localDate(), time:'09:30', status:'planned', notes:[], analysis:null, engine:null, plan:null, sample:false, ...values };
}
export function seedVisits(): Visit[] {
  return [
    createVisit({ id:'demo-1', school:'Primary School, Rampur',teacher:'Sunita Devi',topic:'Subtraction with regrouping',sample:true }),
    createVisit({ id:'demo-2', school:'Primary School, Kalyanpur',teacher:'Anita Yadav',grade:'1',subject:'Language',topic:'Letter–sound relationships',time:'11:15',sample:true }),
    createVisit({ id:'demo-3', school:'Primary School, Bhawanipur',teacher:'Ramesh Kumar',grade:'2',subject:'Language',topic:'Reading with understanding',date:dateAfter(1),time:'10:00',sample:true }),
    createVisit({ id:'demo-4', school:'Primary School, Chandpur',teacher:'Kavita Singh',topic:'Checking every child’s understanding',date:dateAfter(-14),status:'follow-up',sample:true,plan:{teacherAction:'Use response cards so every child can answer after a worked example.',mentorAction:'Bring a set of reusable response cards.',lookFor:'Record how many children respond and what the teacher does with their responses.',date:localDate(),completed:false,outcome:''} }),
    createVisit({ id:'demo-5', school:'Primary School, Meerapur',teacher:'Pooja Verma',grade:'1',subject:'Language',topic:'Pair talk during storytelling',date:dateAfter(-12),status:'follow-up',sample:true,plan:{teacherAction:'Invite each pair to retell one part of the story.',mentorAction:'Demonstrate a short pair-talk routine.',lookFor:'Observe whether each partner has an opportunity to speak.',date:dateAfter(2),completed:false,outcome:''} }),
  ];
}
export function validateGrounding(analysis: Analysis, notes: Note[]): Analysis {
  for (const evidence of analysis.evidence) {
    const note = notes.find(n => n.id === evidence.noteId);
    if (!note || !note.text.includes(evidence.quote)) throw new Error('An evidence reference could not be verified. Please try again.');
  }
  return analysis;
}
export function demoAnalysis(notes: Note[], language: Language = 'en'): Analysis {
  if (!notes.length) throw new Error('Add an observation first.');
  const known = notes.find(n => sampleNotes.includes(n.text) || hindiSampleNotes.includes(n.text));
  const hi = language === 'hi';
  return {
    priority: known ? (hi ? 'हर बच्चे की समझ जानें' : 'Make every child’s thinking visible') : (hi ? 'समझने के लिए और साक्ष्य जुटाएँ' : 'Build a clearer picture of learning'),
    evidence: notes.slice(0,3).map(n=>({ noteId:n.id,quote:n.text })),
    interpretation: known ? (hi ? 'कुछ बच्चों के जवाब पूरी कक्षा की समझ का प्रमाण नहीं हैं। हर बच्चे से जवाब लेने का तरीका आज़माएँ।' : 'Responses from a few children may not show what the rest of the class understands. An all-child response routine could help the teacher check more widely.') : (hi ? 'डेमो मोड इन नोट्स से शिक्षण की गुणवत्ता का मूल्यांकन नहीं कर सकता। शिक्षक के साथ साक्ष्य पर चर्चा करें।' : 'The demo engine cannot assess teaching quality from these notes. Review the recorded evidence together and choose one practice to investigate.'),
    action: known ? (hi ? 'अगले पाठ में एक सवाल के बाद सभी बच्चों को स्लेट पर जवाब लिखकर एक साथ दिखाने को कहें।' : 'After one worked example tomorrow, ask every child to write an answer on their slate and show it together. Use the responses to choose what to revisit.') : (hi ? 'अगले पाठ में एक सवाल पर हर बच्चे का जवाब दर्ज करें।' : 'Agree on one learning question for the next lesson. Record a response from each child before deciding what support is needed.'),
    mentorAction: hi ? 'शिक्षक के साथ पाँच मिनट का उदाहरण तैयार करें।' : 'Co-plan a five-minute example and model how to respond to different answers.',
    lookFor: hi ? 'कितने बच्चों ने जवाब दिया? शिक्षक ने जवाबों के आधार पर क्या बदला?' : 'How many children responded? What did the teacher change after seeing the responses?',
    unknown: hi ? 'हर बच्चे की व्यक्तिगत समझ और बाकी पाठ में इस्तेमाल हुई गतिविधियाँ ज्ञात नहीं हैं।' : 'Individual learning levels and what happened outside the observed lesson segment are unknown.',
    resourceId:'ncf-observation',
  };
}
export const rehearsalSchema = z.object({ reply:z.string().min(1).max(1500), feedback:z.string().min(1).max(1500), strengths:z.array(z.string().max(200)).max(4), nextTry:z.string().min(1).max(1000) });
export type Rehearsal = z.infer<typeof rehearsalSchema>;
export function demoRehearsal(message: string, language: Language): Rehearsal {
  const hi = language === 'hi';
  const evidence = /\d|four|five|observ|noticed|देख|चार|पाँच/i.test(message);
  const invitation = /could|together|try|shall|would|साथ|आज़मा|करें/i.test(message);
  return { reply: hi ? (invitation ? 'यह तरीका आज़मा सकती हूँ। कम समय में सभी के जवाब कैसे देखूँ?' : 'मैंने तो सवाल पूछे थे। कुछ बच्चों ने सही जवाब भी दिए। फिर क्या बदलूँ?') : (invitation ? 'I could try that. How would I check everyone’s answer without losing too much lesson time?' : 'But I did ask questions throughout the lesson, and several children answered correctly. What would you suggest I change?'), feedback: hi ? 'यह अभ्यास-आधारित संकेत है, विशेषज्ञ मूल्यांकन नहीं।' : 'This is a simple practice prompt, not an expert assessment of coaching quality.', strengths: [evidence ? (hi ? 'आपने साक्ष्य का उल्लेख किया।' : 'You referenced an observation.') : (hi ? 'बातचीत शुरू हो गई है।' : 'You opened the conversation.'), ...(invitation ? [hi ? 'आपने मिलकर काम करने का निमंत्रण दिया।' : 'You invited a collaborative next step.'] : [])], nextTry: hi ? 'एक विशिष्ट अवलोकन बताएँ, शिक्षक का नज़रिया पूछें और एक छोटा कदम साथ में तय करें।' : 'Name one specific observation, ask for the teacher’s perspective, and invite them to try one small step together.' };
}
