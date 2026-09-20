import fs from 'node:fs/promises';
import path from 'node:path';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {finalizePresentation} from '/Users/jatinpandey/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.61513/skills/presentations/container_tools/artifact_tool_utils.mjs';
const root='/Users/jatinpandey/Antigravity/Sprint';
const dir=path.join(root,'.deck-build');
const skill='/Users/jatinpandey/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.61513/skills/presentations';
const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={paper:'#F7F5EF',ink:'#173F36',muted:'#69776B',line:'#D9DED1',lime:'#D5E9AC',white:'#FFFFFF',orange:'#BE653F',light:'#E8EDDF'};
const font='Avenir Next';
let counter=0;
const sources={niti:'https://niti.gov.in/sites/default/files/2026-05/School-Education-System-in-India.pdf',ncf:'https://ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf',coach:'https://blogs.worldbank.org/en/education/7-steps-facilitate-effective-one-one-support-teachers',teachfx:'https://teachfx.com/blog/tips-for-instructional-leaders',mursion:'https://www.mursion.com/solutions/education/',diksha:'https://ciet.ncert.gov.in/NISHTHA_Courses'};
const manifest=[];
function text(s,content,x,y,w,h,size=24,color=C.ink,bold=false,extra={}){const q=s.shapes.add({geometry:'textbox',name:`text-${++counter}`,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});q.text=content;q.text.style={typeface:font,fontSize:size,bold,color,alignment:'left',verticalAlignment:'top',autoFit:'none',insets:{top:0,left:0,bottom:0,right:0},...extra};return q;}
function line(s,x,y,w,color=C.line){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:1},fill:color,line:{fill:'none',width:0}});}
function label(s,content,x,y,w=1100,dark=false){return text(s,content.toUpperCase(),x,y,w,25,13,dark?C.lime:C.orange,true);}
async function image(s,file,x,y,w,h,fit='contain',crop){return s.images.add({blob:new Uint8Array(await fs.readFile(path.join(dir,'assets',file))),contentType:'image/png',alt:file.replace('.png','').replaceAll('-',' '),fit,position:{left:x,top:y,width:w,height:h},...(crop?{crop}:{})});}
function slide(title,section,{dark=false,foot='',urls=[]}={}){const s=p.slides.add();s.background.fill=dark?C.ink:C.paper;label(s,section,64,37,1000,dark);text(s,title,64,84,1152,116,45,dark?C.paper:C.ink,true);const n=p.slides.items.length-1;text(s,'SAKSHAM AI',64,677,150,18,11,dark?'#A4BAAB':'#84917F',true);text(s,String(n).padStart(2,'0'),1180,676,36,21,12,dark?'#A4BAAB':'#84917F',false,{alignment:'right'});if(foot)text(s,foot,238,675,918,34,11,dark?'#ABC0AE':'#7B8675');manifest.push({slide:p.slides.items.length,title,urls});return s;}
function notes(s,txt){s.speakerNotes.textFrame.setText(txt);}
function table(s,values,x,y,w,h,widths,{fontSize=22,header=C.ink,lastRow=false}={}){const tb=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,values,columnWidths:widths});tb.borders.assign({fill:C.line,width:.7,style:'solid'});for(let r=0;r<values.length;r++){for(let c=0;c<values[0].length;c++){const cell=tb.getCell(r,c);cell.fill=r===0?header:lastRow&&r===values.length-1?C.light:C.paper;cell.text.style={typeface:font,fontSize:r===0?16:fontSize,color:r===0?C.white:C.ink,bold:r===0||(lastRow&&r===values.length-1),verticalAlignment:'middle',insets:{left:18,right:18,top:13,bottom:13}};}}return tb;}
function box(s,content,x,y,w,h,{dark=false,size=23}={}){const q=s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill:dark?'#2E5846':'#E7EDDA',line:{fill:dark?'#6E9270':'#CAD7BC',width:1}});q.text=content;q.text.style={typeface:font,fontSize:size,color:dark?C.white:C.ink,bold:true,alignment:'center',verticalAlignment:'middle',insets:{left:14,right:14,top:8,bottom:8},autoFit:'none'};return q;}
function connect(s,a,b,from='right',to='left'){s.shapes.connect(a,b,{kind:'straight',fromSide:from,toSide:to,line:{fill:'#8C9C7F',width:2},tail:{type:'triangle',width:'sm',length:'sm'}});}
// Cover: the only illustrative image. All other imagery is captured from our prototype.
{
 const s=p.slides.add();s.background.fill=C.ink;
 await image(s,'mentor-illustration.png',710,0,570,720,'cover');
 label(s,'AI FOR FOUNDATIONAL LEARNING HACKATHON',64,57,580,true);
 text(s,'Saksham AI',61,161,620,109,78,C.paper,true);
 text(s,'A field coach for\nIndia’s teacher mentors',64,289,577,162,44,C.lime,false);
 text(s,'Classroom evidence. Better conversations.\nA clear next step for every visit.',64,477,578,90,24,'#C5D3C2');
 text(s,'CHALLENGE 5: SYSTEM CAPACITY',64,651,570,24,14,'#ADBFAC',true);
 notes(s,'Ideate-stage proposal. Nine content slides follow this cover. Working name: Saksham AI. The cover is an AI-generated editorial illustration, not a photograph of a real school or pilot. No claim of government endorsement. Team profiles are omitted because member details have not been supplied.');
 manifest.push({slide:1,title:'Saksham AI',urls:[]});
}
// 1 Problem
{
 const s=slide('The mentoring gap between a visit and a change','01 / PROBLEM UNDERSTANDING',{foot:'Sources: NITI Aayog, School Education System in India (2026), pp. 151–152; World Bank Coach (2021).',urls:[sources.niti,sources.coach]});
 text(s,'CRPs are expected to\nhelp teachers improve\nclassroom practice.',64,226,530,175,38,C.ink,true);
 text(s,'Our focus is the moment after an observation: choosing useful feedback, discussing it well, and returning to the agreed practice.',64,442,510,150,26,C.muted);
 label(s,'THE DOCUMENTED NEED',680,225,490);
 text(s,'India’s school supervision still gives substantial attention to compliance. The NITI Aayog report calls for stronger academic mentoring and CRP capacity.',680,268,525,146,25);
 line(s,680,432,525);
 text(s,'It recommends regular classroom visits, follow-up support, and digital records of teaching practices.',680,461,525,110,25);
 text(s,'Primary user: CRP / teacher mentor\nBeneficiaries: teachers and early-grade learners',680,598,525,56,18,C.muted);
 notes(s,`Problem source: ${sources.niti} printed pp. 151–152 (PDF pp. 177–178). The report recommends stronger CRP mentoring, revised workloads and digital visit records. It is a research report, not an endorsement of Saksham. Coaching design source: ${sources.coach}. The chosen post-observation bottleneck is our product hypothesis. No CRP interviews or impact results are claimed.`);
}
// 2 Solution
{
 const s=slide('One observation becomes one usable coaching plan','02 / PROPOSED SOLUTION',{foot:'Actual prototype capture with fictional sample observations. Demo output shown; mentor review remains required.'});
 text(s,'01',64,220,60,35,24,C.orange,true);text(s,'Capture evidence',64,262,330,37,27,C.ink,true);text(s,'Speak or type what happened during a short lesson segment.',64,309,315,100,23,C.muted);
 text(s,'02',64,422,60,35,24,C.orange,true);text(s,'Choose one next step',64,464,338,38,27,C.ink,true);text(s,'Review the interpretation, its source, and a practice the teacher can try.',64,511,310,110,23,C.muted);
 await image(s,'insights.png',410,220,804,430,'contain');
 notes(s,'This is a screenshot of the working local prototype, captured in explicitly labelled demo mode. The seeded Grade 2 subtraction observations are fictional. Notes map to exact excerpts. The proposed live version uses Claude for contextual interpretation and recommendation generation. A resource citation does not prove that the model’s recommendation is pedagogically correct. Mentor and expert review remain necessary.');
}
// 3 Rehearsal
{
 const s=slide('The mentor practises before the real conversation','03 / PROPOSED SOLUTION',{dark:true,foot:'Actual prototype capture. Scripted rehearsal shown. Adaptive Claude role-play is planned and requires validation.'});
 text(s,'AI takes the teacher’s role',64,220,325,92,30,C.lime,true);
 text(s,'The mentor rehearses a response grounded in the observation.',64,332,304,102,24,'#CFDACA');
 text(s,'The coach gets feedback',64,461,326,84,29,C.lime,true);
 text(s,'On specificity, respectful inquiry, and a feasible next step.',64,559,302,79,23,'#CFDACA');
 await image(s,'rehearsal.png',412,220,804,430,'contain');
 notes(s,'Screenshot from the local scripted demonstration. The proposed frontier-model capability is adaptive role-play conditioned on the current observation, with qualitative feedback on the mentor’s wording. The screenshot does not demonstrate validated AI scoring. No numeric coaching-quality scores are claimed. Existing simulation systems such as Mursion show that rehearsal itself is not novel; our intended differentiation is its connection to a CRP’s actual FLN observation and follow-up plan.');
}
// 4 Users
{
 const s=slide('Designed around the mentor’s field day','04 / USERS AND CONTEXT',{foot:'Meena is a fictional design persona. Constraints are design assumptions to validate with CRPs; voice support is browser-dependent.'});
 await image(s,'mobile-detail.png',64,215,248,426,'contain');
 text(s,'Meena, Cluster Resource Person',362,215,825,50,30,C.ink,true);
 text(s,'Supports early-grade teachers across a school cluster. Needs an observation she can use in a conversation, with minimal re-entry.',362,274,825,83,25,C.muted);
 const rows=[['Field constraint','Product response'],['Limited time after a visit','A few notes and one coaching priority'],['Hindi or another local language','Hindi / English first; review the transcript'],['Intermittent connectivity','Device-local drafts; AI waits for connection'],['Trust and sensitive classroom data','Mentor notes, no continuous child recording']];
 table(s,rows,362,383,854,250,[304,550],{fontSize:20});
 notes(s,'Design persona and constraints are assumptions for validation, not field-research findings. Intended primary user: Cluster Resource Person / Academic Resource Person / teacher mentor. Current prototype has partial Hindi UI and demo output, English/Hindi browser speech selection, typed note capture, and browser-local persistence. Browser speech may use a remote service and is not guaranteed offline. Planned second Indian language will depend on pilot context. Device storage is not a production multi-user database.');
}
// 5 Journey
{
 const s=slide('A complete loop around one teaching practice','05 / USER JOURNEY',{foot:'Illustrative Grade 2 scenario. A 14-day revisit is a proposed cadence, to be agreed locally; it is not an impact result.'});
 const xs=[64,298,532,766,1000],labels=['Prepare','Observe','Reflect','Rehearse','Commit'];
 const descriptions=['Review the last\nagreed practice','Capture short\nmentor notes','Check evidence\nand one next step','Practise the\nconversation','Agree an action\nand revisit date'];
 let prev;for(let i=0;i<5;i++){const b=box(s,labels[i],xs[i],218,216,64,{size:24});if(prev)connect(s,prev,b);prev=b;text(s,descriptions[i],xs[i],304,216,71,21,C.muted);}
 line(s,64,410,1152);
 text(s,'At the next visit',64,451,410,54,34,C.ink,true);
 text(s,'“Did more children respond?\nWhat did the teacher change\nafter seeing their answers?”',64,519,468,111,27,C.muted);
 label(s,'THE AGREED PRACTICE',690,451,526);text(s,'After a worked example, every child writes an answer on a slate.',690,493,510,110,29,C.ink,true);text(s,'Mentor: co-plan the task and revisit in 14 days.',690,610,518,38,20,C.muted);
 notes(s,'Workflow design, not an observed pilot journey. The teacher tries a whole-class slate response after a worked subtraction example. The mentor co-plans the task and returns to observe response participation and the teacher’s use of evidence. A completed visit is not evidence of improvement. Follow-ups are tracked in the local prototype; automatic reminders and system integrations are not implemented.');
}
// 6 Comparison
{
 const s=slide('A distinct CRP workflow within an existing field','06 / INNOVATION AND DIFFERENTIATION',{foot:'Sources: TeachFX, Mursion and NCERT/DIKSHA public product pages. Comparison of stated focus, not an exhaustive feature audit.',urls:[sources.teachfx,sources.mursion,sources.diksha]});
 const rows=[['Approach','Published focus','Saksham’s proposed contribution'],['TeachFX','Lesson-audio analysis and teacher reflection','Mentor-authored field evidence, without requiring full-lesson audio'],['Mursion','Simulated conversations for educator skills','Rehearsal anchored to the current FLN observation and agreed action'],['DIKSHA / NISHTHA','Teacher professional learning resources','Relevant resource excerpts at the moment a mentor gives feedback']];
 table(s,rows,64,218,1152,322,[214,406,532],{fontSize:22});
 text(s,'Our differentiation hypothesis',64,573,406,35,24,C.orange,true);
 text(s,'Hindi-first CRP support that connects evidence, coaching rehearsal and the next classroom visit.',493,572,722,74,27,C.ink,true);
 notes(s,`Sources accessed 19 September 2026: TeachFX ${sources.teachfx}; Mursion ${sources.mursion}; NCERT NISHTHA ${sources.diksha}. TeachFX supports classroom audio analysis and coaching discussions. Mursion supports educator conversation simulation. DIKSHA/NISHTHA provides professional learning. We make no claim that these products lack all overlapping capabilities. Saksham’s context-specific combination is a hypothesis to test, not proof of first-in-market novelty or superior outcomes.`);
}
// 7 Trust
{
 const s=slide('Every recommendation has an evidence trail','07 / INNOVATION AND TRUST',{foot:'Source principle: NCERT NCF–FS 2022, §6.2.1, pp. 177–178. The suggested activity is a Saksham adaptation.',urls:[sources.ncf]});
 label(s,'OBSERVED',64,218,600);text(s,'“The same four children answered.”',64,254,696,62,31,C.ink,true);
 line(s,64,335,665);
 label(s,'INFERRED',64,361,600);text(s,'The teacher may need a way to see\nwhat the rest of the class understands.',64,397,690,88,28,C.muted);
 line(s,64,506,665);
 label(s,'UNKNOWN',64,533,600);text(s,'Individual learning levels and what\nhappened outside this lesson segment.',64,569,690,82,27,C.muted);
 await image(s,'evidence-chain.png',797,212,418,439,'contain');
 notes(s,`NCERT source: ${sources.ncf} section 6.2.1 printed pp. 177–178. It describes planned observation, recording concrete evidence, and reflection to inform teaching. Saksham’s slate-response activity is an adaptation, not a direct NCERT prescription. Exact quote matching and valid resource IDs are machine-checkable. Relevance, unsupported inference and instructional suitability require additional model checks, evaluation and human judgement. Do not rank teachers or infer capability, motivation or child diagnoses. Capture mentor notes without child-identifying data.`);
}
// 8 Technical plan
{
 const s=slide('AI reasons over evidence before a mentor approves','08 / TECHNOLOGY AND DATA FEASIBILITY',{dark:true,foot:'Proposed production flow. Prototype uses fixed curated summaries; document retrieval, sync and multilingual ASR are build milestones.'});
 const a=box(s,'Mentor notes\n+ lesson context',64,219,238,85,{dark:true,size:22});
 const b=box(s,'Claude extracts\nevidence + uncertainty',358,219,258,85,{dark:true,size:22});
 const c=box(s,'Retrieve reviewed\nFLN source passages',672,219,252,85,{dark:true,size:22});
 const d=box(s,'Claude proposes\none coaching move',980,219,236,85,{dark:true,size:22});connect(s,a,b);connect(s,b,c);connect(s,c,d);
 const e=box(s,'Quote / source checks\n+ mentor approval',980,375,236,92,{dark:true,size:21});connect(s,d,e,'bottom','top');
 const f=box(s,'Claude role-play\n+ coach feedback',672,375,252,92,{dark:true,size:22});connect(s,e,f,'left','right');
 const g=box(s,'Agreed action\n+ next-visit evidence',358,375,258,92,{dark:true,size:22});connect(s,f,g,'left','right');
 text(s,'Offline: capture drafts\nOnline: model + retrieval',64,387,255,78,22,C.lime);
 label(s,'DATA',64,519,500,true);text(s,'NCF–FS, NIPUN Bharat and permitted state FLN resources. Expert-reviewed scenarios for evaluation. No fine-tuning planned.',64,557,526,91,22,'#D2DECB');
 label(s,'IMPLEMENTATION',672,519,540,true);text(s,'Next.js / TypeScript, server-side Claude, schema validation. Planned: PostgreSQL + pgvector, secure sync and multilingual speech.',672,557,544,91,22,'#D2DECB');
 notes(s,`Architecture proposal. The local prototype currently uses React/Next.js, browser-local storage, Zod schemas, exact evidence-substring verification and curated resource summaries. A server-side Anthropic Messages route exists, but successful live-provider operation was not established in this session. Retrieval and PostgreSQL/pgvector are planned. NCF reference: ${sources.ncf}. Before indexing any material, verify licence/permission, version, section and language. Exclude identifying child information and establish consent, retention and access controls before any pilot. No child audio corpus or fine-tuning is needed for this MVP. No automatic teacher ranking. Live AI requires connectivity; a model failure must preserve notes and return a recoverable error.`);
}
// 9 Feasibility/evaluation
{
 const s=slide('A measurable path to a field pilot','09 / FEASIBILITY AND EVALUATION',{foot:'All sample sizes and thresholds below are proposed validation targets, not measured results. No pilot partners are confirmed.'});
 text(s,'What we will test',64,212,630,44,30,C.ink,true);
 table(s,[['Check','Proposed acceptance target'],['Evidence precision','≥95% of cited claims supported'],['Expert agreement','≥80% agreement on top coaching priority'],['Mentor usability','Median reviewed plan in ≤3 minutes']],64,280,695,240,[285,410],{fontSize:21});
 text(s,'40 synthetic cases, reviewed by FLN experts.\nThen 5 consenting mentors across 10 paired visits.\nMeasure practice adoption separately from learning gains.',64,555,705,95,22,C.muted);
 label(s,'BUILD MILESTONES',825,215,390);
 text(s,'By 27 September',825,258,390,38,25,C.ink,true);text(s,'Submit the proposal and demonstrate the core interaction.',825,303,378,81,23,C.muted);
 text(s,'If shortlisted: by 1 November',825,414,390,65,25,C.ink,true);text(s,'Validate live AI and source retrieval. Test Hindi use and device constraints. Publish the testable build and demo.',825,493,375,119,23,C.muted);
 notes(s,'Evaluation plan only. Forty fictional/de-identified expert-reviewed scenarios should cover sparse evidence, contradictory notes, negation, Hindi/code-switching and attempts to elicit punitive judgements. Separate development cases from a held-out set. Define supported claims and use two expert reviewers for disagreements. Compare with an ungrounded LLM baseline. The proposed field sample is small and for usability/formative learning, not causal evidence of student impact. Time target measures the reviewed plan, not the classroom observation or teacher conversation. Proposed milestone dates follow the supplied hackathon guidelines. Current status: demo capture, evidence view, scripted rehearsal, commitments and reload persistence tested. Live Claude, expert endorsement, full Hindi localisation, secure multi-user deployment and offline reload resilience still require validation.');
}
await fs.mkdir(path.join(dir,'renders'),{recursive:true});
await fs.writeFile(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2));
await (await PresentationFile.exportPptx(p)).save(path.join(dir,'candidate.pptx'));
console.log('Draft exported',p.slides.items.length,'slides');
for(let i=0;i<p.slides.items.length;i++){const s=p.slides.items[i];const png=await p.export({slide:s,format:'png',scale:1.5});await fs.writeFile(path.join(dir,'renders',`slide-${i+1}.png`),new Uint8Array(await png.arrayBuffer()));console.log('Rendered',i+1);}
await finalizePresentation({workspaceDir:root,candidatePath:path.join(dir,'candidate.pptx'),finalPath:path.join(root,'output/presentation/Saksham-AI-Ideate-Proposal.pptx'),pythonExecutable:'/Users/jatinpandey/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','5','--require-native-table-slide','7','--require-native-table-slide','10'],explicitTotalSlideCount:10,requiredNativeTableOwnerSlides:[5,7,10],fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:path.join(dir,'validation.json')});
console.log('Finalized');
