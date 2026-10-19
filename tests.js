'use strict';
(async()=>{
 const api=typeof module!=='undefined'?require('./app.js'):CW;
 let passed=0,failed=0;const log=(name,ok,error)=>{if(ok)passed++;else failed++;const text=`${ok?'✓':'×'} ${name}${error?' — '+error:''}`;if(typeof document!=='undefined'){const p=document.createElement('p');p.textContent=text;document.getElementById('results').append(p);}else console.log(text);};
 const assert=(value,message='Condição não satisfeita')=>{if(!value)throw Error(message);};
 async function test(name,fn){try{await fn();log(name,true);}catch(e){log(name,false,e.message);}}
 const rejects=fn=>{let rejected=false;try{fn();}catch{rejected=true;}assert(rejected);};
 await test('Normalização de acentos e cedilha',()=>assert(api.normalize('ação Órgão maçã')==='ACAO ORGAO MACA'));
 await test('Extração, duplicados normalizados, números e exclusões',()=>{const a=api.extract('A ação acompanha outra acao. AÇÃO, 123! Livro livro.',4,12,'outra acompanha');assert(a.length===2);assert(a.find(x=>x.word==='ACAO').frequency===3);assert(a.every(x=>!/[0-9]/.test(x.word)));});
 await test('Todas as ocorrências da resposta são ocultadas na pista',()=>{const a=api.extract('A ação transforma a ação em outra ação.',4,12,'');const clue=a.find(x=>x.word==='ACAO').clue;assert((clue.match(/______/g)||[]).length===3);assert(!api.tokens(clue).some(t=>api.normalize(t)==='ACAO'));});
 await test('Sem contexto, não inventa pistas',()=>assert(api.extract('Biblioteca.',4,20,'')[0].clue===''));
 await test('Numeração partilhada e ordem de leitura',()=>{const a=api.number([{row:2,col:1},{row:0,col:4},{row:0,col:4},{row:0,col:1}]);assert(a.map(w=>w.number).join(',')==='3,2,2,1');});
 const first={word:'CASA',original:'casa',clue:'Um lugar para viver.',row:0,col:0,dir:'H',number:1};
 const cross={word:'SAPO',original:'sapo',clue:'Um animal.',row:0,col:2,dir:'V',number:2};
 const p={version:1,rows:4,cols:4,words:[first,cross],entries:{'0,0':'C'}};
 await test('Grelha ligada válida',()=>assert(api.validate(p)));
 await test('Sobreposição incompatível rejeitada',()=>assert(api.fits({...cross,word:'RATO'},[first])<0));
 await test('Palavras paralelas encostadas rejeitadas',()=>assert(api.fits({...first,row:1},[first])<0));
 await test('Contacto nas extremidades rejeitado',()=>assert(api.fits({...first,col:4},[first])<0));
 await test('Grelha desligada rejeitada',()=>rejects(()=>api.validate({...p,rows:8,words:[first,{...cross,row:4}]})));
 await test('Exportação/importação mantém respostas, pistas e entradas',()=>assert(api.encode(api.decode(api.encode(p)))===api.encode(p)));
 await test('Ficheiros inválidos, entradas externas e dimensões abusivas rejeitados',()=>{rejects(()=>api.decode('{erro'));rejects(()=>api.decode(JSON.stringify({...p,rows:999})));rejects(()=>api.decode(JSON.stringify({...p,entries:{'99,99':'A'}})));rejects(()=>api.decode(JSON.stringify({...p,words:[{...first,word:'<script>'}]})));});
 await test('Texto potencialmente malicioso continua a ser dados',()=>{const q=api.decode(api.encode({...p,words:[{...first,clue:'<img src=x onerror=alert(1)>'},cross]}));assert(q.words[0].clue.startsWith('<img'));});
 await test('Geração real: 3 disposições, validação e origem das palavras',async()=>{const items=api.extract(api.example).slice(0,12);for(let i=0;i<3;i++){const result=await api.generate(items,()=>{},5);assert(result.words.length>=5);assert(api.validate(result));assert(result.words.every(w=>items.some(x=>x.word===w.word)));}});
 await test('Palavras sem letras em comum não criam respostas inventadas',async()=>{const result=await api.generate([{word:'AAA',original:'aaa',clue:'A'},{word:'BBB',original:'bbb',clue:'B'}],()=>{},2);assert(result.words.length===1);});
 const summary=`${passed} testes passaram; ${failed} falharam.`;if(typeof document!=='undefined'){document.getElementById('summary').textContent=summary;}else{console.log(summary);process.exitCode=failed?1:0;}
})();
