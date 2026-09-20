import test from 'node:test';
import assert from 'node:assert/strict';
import {demoAnalysis,validateGrounding,storageSchema,seedVisits,sampleNotes,type Note} from '../src/lib/domain';
const note=(text:string,id='n1'):Note=>({id,text,kind:'typed',time:'09:30'});
test('every demo evidence excerpt is present in its source note',()=>{const notes=sampleNotes.map((s,i)=>note(s,`n${i}`));const a=demoAnalysis(notes);assert.equal(validateGrounding(a,notes),a);});
test('unknown note IDs and fabricated excerpts are rejected',()=>{const notes=[note('Every child answered correctly.')];const a=demoAnalysis(notes);assert.throws(()=>validateGrounding({...a,evidence:[{noteId:'missing',quote:notes[0].text}]},notes));assert.throws(()=>validateGrounding({...a,evidence:[{noteId:'n1',quote:'No child answered.'}]},notes));});
test('custom evidence does not trigger a claim of poor participation',()=>{const a=demoAnalysis([note('All children responded. No child was left out.')]);assert.equal(a.priority,'Build a clearer picture of learning');assert.match(a.interpretation,/cannot assess/);});
test('empty observations are rejected and seeded state passes persistence schema',()=>{assert.throws(()=>demoAnalysis([]));assert.equal(storageSchema.parse({version:1,visits:seedVisits()}).visits.length,5);});
