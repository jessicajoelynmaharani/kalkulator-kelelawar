const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const STORE="batAdventureCalculator";
const defaultState={history:[],memory:0,xp:0,level:1,calculations:0,achievements:{},settings:{theme:"dark",sound:false,animation:true,vibration:false,decimal:"auto"}};
let state=loadState(), current="", expression="", operator=null, waiting=false, soundCtx=null;

function loadState(){try{return {...defaultState,...JSON.parse(localStorage.getItem(STORE)||"{}")}}catch{return structuredClone(defaultState)}}
function save(){localStorage.setItem(STORE,JSON.stringify(state))}
function format(n){if(!Number.isFinite(n))return "Error"; if(state.settings.decimal!=="auto") return Number(n).toFixed(+state.settings.decimal).replace(/\.?0+$/,""); return Number(n).toLocaleString("en-US",{maximumFractionDigits:12})}
function raw(n){return Number(n).toString()}
function updateDisplay(){ $("#expression").textContent=expression; $("#result").textContent=current||"0"; $("#memoryStatus").textContent=`MEMORY: ${state.memory?format(state.memory):"—"}`; $("#memoryIndicator").textContent=state.memory?format(state.memory):"—"; }
function beep(type="click"){if(!state.settings.sound)return; try{soundCtx ||= new (window.AudioContext||window.webkitAudioContext)(); const o=soundCtx.createOscillator(),g=soundCtx.createGain(); o.frequency.value={click:420,op:560,equal:720,error:170,level:880}[type]||420;o.type="sine";g.gain.setValueAtTime(.035,soundCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,soundCtx.currentTime+.12);o.connect(g);g.connect(soundCtx.destination);o.start();o.stop(soundCtx.currentTime+.12)}catch{}}
function vibrate(){if(state.settings.vibration&&navigator.vibrate)navigator.vibrate(12)}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),1800)}
function message(msg){$("#mascotMessage").textContent=msg}
function addXP(amount=10){state.xp+=amount; while(state.xp>=100){state.xp-=100;state.level++;beep("level");message("LEVEL UP! 🌙🦇");toast(`🦇 Level ${state.level} reached!`)}}
const levels=["Night Rookie","Bat Apprentice","Moon Flyer","Shadow Bat","Crystal Bat","Night Guardian","Royal Bat","Legendary Bat","Master of Numbers","Bat Master"];
function renderProgress(){const max=100;$("#levelNumber").textContent=String(state.level).padStart(2,"0");$("#levelName").textContent=levels[Math.min(state.level-1,levels.length-1)];$("#xpBar").style.width=`${state.xp}%`;$("#xpText").textContent=state.xp;$("#xpMax").textContent=max;$("#calcCount").textContent=state.calculations;$("#achievementCount").textContent=Object.values(state.achievements).filter(Boolean).length}
const achievements=[
["first","🌙 FIRST FLIGHT","Melakukan perhitungan pertama.",()=>state.calculations>=1],
["speed","⚡ SPEED BAT","Melakukan 10 perhitungan.",()=>state.calculations>=10],
["warrior","🦇 MATH BAT","Melakukan 100 perhitungan.",()=>state.calculations>=100],
["science","🔬 SCIENCE BAT","Menggunakan scientific calculator.",()=>$("#modeSelect").value==="scientific"],
["master","🏆 BAT MASTER","Mencapai Level 10.",()=>state.level>=10]
];
function renderAchievements(){const el=$("#achievementList");el.innerHTML="";achievements.forEach(([id,name,desc,check])=>{if(check())state.achievements[id]=true;const d=document.createElement("div");d.className="achievement "+(state.achievements[id]?"unlocked":"");d.innerHTML=`<strong>${name}</strong><br>${desc}`;el.appendChild(d)});save();renderProgress()}
function addHistory(expr,res){state.history.unshift({expr,res,time:Date.now()});state.history=state.history.slice(0,50);renderHistory();save()}
function renderHistory(){const el=$("#historyList");if(!state.history.length){el.innerHTML='<p class="empty">Belum ada perhitungan.</p>';return}el.innerHTML=state.history.map((h,i)=>`<div class="history-item" data-i="${i}"><button class="history-delete" data-del="${i}">×</button><div class="history-expression">${escapeHTML(h.expr)}</div><div class="history-result">= ${escapeHTML(h.res)}</div></div>`).join("")}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function calculate(a,op,b){a=Number(a);b=Number(b);return op==="+"?a+b:op==="-"?a-b:op==="*"?a*b:op==="/"?(b===0?NaN:a/b):op==="^"?a**b:op==="%"?(b===0?NaN:a%b):NaN}
function enterNumber(v){if(waiting){current="";waiting=false} if(v==="."&&current.includes("."))return;if(current==="0"&&v!==".")current="";current+=v;updateDisplay();beep()}
function chooseOperator(op){if(!current && !expression)return;if(expression&&operator&&!waiting)equals(false);expression=(current||"0")+" "+op+" ";operator=op;waiting=true;updateDisplay();beep("op")}
function equals(gainXP=true){if(!operator||waiting)return;const parts=expression.trim().split(" ");const a=Number(parts[0]),b=Number(current);const result=calculate(a,operator,b);if(!Number.isFinite(result)){current="Error";message("Oops! Check your equation.");beep("error");updateDisplay();operator=null;return}const expr=`${parts[0]} ${operator} ${b}`;current=raw(result);expression="";operator=null;waiting=true;addHistory(expr,current);if(gainXP){state.calculations++;addXP(10);message("Calculation complete! +10 XP 🦇");state.achievements.first=true;beep("equal");vibrate();save();renderProgress();renderAchievements();}updateDisplay()}
function clearAll(){current="";expression="";operator=null;waiting=false;updateDisplay();beep()}
function backspace(){if(waiting)return;current=current.slice(0,-1);updateDisplay()}
function unary(fn){const n=Number(current||0);let r;try{r=fn(n)}catch{r=NaN}if(!Number.isFinite(r)){current="Error";message("Oops! Invalid move.");beep("error")}else{current=raw(r);waiting=true;message("Calculation ready! 🦇");beep()}updateDisplay()}
function percent(){current=raw(Number(current||0)/100);updateDisplay()}
function addConstant(c){const v=c==="pi"?Math.PI:c==="e"?Math.E:(1+Math.sqrt(5))/2;current=raw(v);waiting=true;updateDisplay()}
function memory(action){const n=Number(current||0);if(action==="memory-clear")state.memory=0;if(action==="memory-recall"){current=raw(state.memory);waiting=true}if(action==="memory-add")state.memory+=n;if(action==="memory-subtract")state.memory-=n;if(action==="memory-store")state.memory=n;save();updateDisplay();toast(`MEMORY: ${state.memory?format(state.memory):"—"}`)}
function handleFunction(fn){
  const n=Number(current||0);
  if(fn==="power"){chooseOperator("^");return}
  if(fn==="mod"){chooseOperator("%");return}
  const f={
    sqrt:Math.sqrt,
    square:x=>x*x,
    reciprocal:x=>x===0?NaN:1/x,
    sin:x=>Math.sin(x*Math.PI/180),
    cos:x=>Math.cos(x*Math.PI/180),
    tan:x=>Math.tan(x*Math.PI/180),
    asin:x=>Math.asin(x)*180/Math.PI,
    acos:x=>Math.acos(x)*180/Math.PI,
    atan:x=>Math.atan(x)*180/Math.PI,
    log:x=>Math.log10(x),
    ln:Math.log,
    exp:Math.exp,
    tenpower:x=>10**x,
    factorial:x=>{if(x<0||x>170||x%1)return NaN;let r=1;for(let i=2;i<=x;i++)r*=i;return r},
    abs:Math.abs
  };
  if(fn==="random"){current=raw(Math.random());waiting=true;updateDisplay();return}
  unary(f[fn]||((x)=>x))
}
function setMode(mode){["scientific","programmer","converter"].forEach(x=>$(`#${x}Panel`).classList.toggle("active",mode===x));renderAchievements()}
const units={length:{meter:1,kilometer:1000,centimeter:.01,millimeter:.001,mile:1609.344,foot:.3048},weight:{gram:1,kilogram:1000,milligram:.001,pound:453.59237},area:{sqm:1,sqkm:1e6,sqcm:.0001},volume:{liter:1,milliliter:.001,cubicmeter:1000},time:{second:1,minute:60,hour:3600,day:86400},speed:{mps:1,kph:1/3.6,mph:.44704},data:{byte:1,kb:1024,mb:1048576,gb:1073741824},energy:{joule:1,kilojoule:1000,calorie:4.184,kwh:3600000}};
function updateUnits(){const cat=$("#converterCategory").value;let list=Object.keys(units[cat]||{celsius:1,fahrenheit:1,kelvin:1});$("#convertFrom").innerHTML=list.map(x=>`<option>${x}</option>`).join("");$("#convertTo").innerHTML=list.map(x=>`<option>${x}</option>`).join("");if(list[1])$("#convertTo").value=list[1];convert()}
function convert(){const cat=$("#converterCategory").value,v=Number($("#convertInput").value);const from=$("#convertFrom").value,to=$("#convertTo").value;let out;if(cat==="temperature"){let c=from==="celsius"?v:from==="fahrenheit"?(v-32)*5/9:v-273.15;out=to==="celsius"?c:to==="fahrenheit"?c*9/5+32:c+273.15}else{out=v*(units[cat][from]||1)/(units[cat][to]||1)}$("#conversionResult").textContent=Number.isFinite(out)?format(out):"Error"}
$$("[data-number]").forEach(b=>b.onclick=()=>{enterNumber(b.dataset.number);vibrate()});
$$("[data-op]").forEach(b=>b.onclick=()=>chooseOperator(b.dataset.op));
$$("[data-action]").forEach(b=>b.onclick=()=>{const a=b.dataset.action;if(a.startsWith("memory"))memory(a);else if(a==="clear")clearAll();else if(a==="sign")unary(x=>-x);else if(a==="percent")percent();else if(a==="equals")equals()});
$("#backspaceBtn").onclick=backspace;
$$("[data-fn]").forEach(b=>b.onclick=()=>{handleFunction(b.dataset.fn);state.calculations++;addXP(10);renderProgress();renderAchievements();save()});
$$("[data-constant]").forEach(b=>b.onclick=()=>addConstant(b.dataset.constant));
$$("[data-base]").forEach(b=>b.onclick=()=>{const n=Math.trunc(Number(current||0));const base=+b.dataset.base;current=n.toString(base).toUpperCase();waiting=true;updateDisplay()});
$$("[data-bit]").forEach(b=>b.onclick=()=>{let n=Math.trunc(Number(current||0));if(b.dataset.bit==="NOT")n=~n;else{const op=prompt("Masukkan angka kedua:","1");const m=Number(op);if(!Number.isFinite(m))return;const q={AND:n&m,OR:n|m,XOR:n^m,SHL:n<<m,SHR:n>>m};n=q[b.dataset.bit]}current=String(n);waiting=true;updateDisplay()});
$("#modeSelect").onchange=e=>setMode(e.target.value);
$("#historyBtn").onclick=()=>$("#historyPanel").classList.add("open");
$("#closeHistory").onclick=()=>$("#historyPanel").classList.remove("open");
$("#clearHistory").onclick=()=>{state.history=[];save();renderHistory();toast("History dibersihkan.")};
$("#historyList").onclick=e=>{const del=e.target.dataset.del;if(del!==undefined){state.history.splice(+del,1);save();renderHistory();return}const item=e.target.closest(".history-item");if(item){current=state.history[+item.dataset.i].res;waiting=true;updateDisplay();$("#historyPanel").classList.remove("open")}};
$("#themeToggle").onclick=()=>{state.settings.theme=state.settings.theme==="dark"?"light":"dark";applySettings();save()};
$("#soundToggle").onclick=()=>{state.settings.sound=!state.settings.sound;applySettings();save();beep()};
$("#settingsBtn").onclick=()=>{$("#settingsDialog").showModal();syncSettings()};
$("#closeSettings").onclick=()=>$("#settingsDialog").close();
$("#themeSetting").onchange=e=>{state.settings.theme=e.target.value;applySettings();save()};
$("#soundSetting").onchange=e=>{state.settings.sound=e.target.checked;applySettings();save()};
$("#animationSetting").onchange=e=>{state.settings.animation=e.target.checked;applySettings();save()};
$("#vibrationSetting").onchange=e=>{state.settings.vibration=e.target.checked;applySettings();save()};
$("#decimalSetting").onchange=e=>{state.settings.decimal=e.target.value;updateDisplay();save()};
$("#resetData").onclick=()=>{if(confirm("Reset semua data Bat Adventure?")){localStorage.removeItem(STORE);location.reload()}};
$("#converterCategory").onchange=updateUnits;$("#convertFrom").onchange=convert;$("#convertTo").onchange=convert;$("#convertInput").oninput=convert;$("#convertBtn").onclick=convert;
function syncSettings(){$("#themeSetting").value=state.settings.theme;$("#soundSetting").checked=state.settings.sound;$("#animationSetting").checked=state.settings.animation;$("#vibrationSetting").checked=state.settings.vibration;$("#decimalSetting").value=state.settings.decimal}
function applySettings(){document.body.classList.toggle("light",state.settings.theme==="light");document.body.classList.toggle("no-animation",!state.settings.animation);$("#soundToggle").textContent=state.settings.sound?"🔊":"🔇";$("#themeToggle").textContent=state.settings.theme==="dark"?"🌙":"☀️";updateDisplay()}
document.addEventListener("keydown",e=>{if(e.target.matches("input,select"))return;if(/^[0-9.]$/.test(e.key))enterNumber(e.key);else if(["+","-","*","/"].includes(e.key))chooseOperator(e.key);else if(e.key==="Enter"||e.key==="=")equals();else if(e.key==="Escape")clearAll();else if(e.key==="Backspace")backspace();else if(e.key==="%")percent()});
applySettings();renderHistory();renderProgress();renderAchievements();updateUnits();updateDisplay();
