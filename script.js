/* StudyBuddy — rebuilt vanilla frontend demo */

const students = [
  {id:1,name:'Paing Htoo Kyaw',age:20,major:'Digital Technology',subjects:['DTI224','GEN102'],distance:'1.2 km',match:92,time:'Today · 4:00 PM',availability:'Afternoon · Library',bio:'Preparing for the DTI224 exam and looking for someone to review with.',image:'/img/profile.jpg',online:true},
  {id:2,name:'Aung Maw Oo',age:20,major:'Thai for Communication',subjects:['GEN102','GEN132'],distance:'2.4 km',match:86,time:'Tomorrow · 10:00 AM',availability:'Morning · Study room',bio:'Likes comparing notes and working through practice questions with a study partner.',image:'/img/profile.jpg',online:false},
  {id:3,name:'Han Win Htun',age:20,major:'Digital Technology',subjects:['DTI224','DTI201'],distance:'2.9 km',match:84,time:'Friday · 1:00 PM',availability:'Afternoon · Library',bio:'Looking for focused study sessions before exams and project deadlines.',image:'/img/profile.jpg',online:true},
  {id:4,name:'Kaung Khant Kyaw',age:21,major:'Digital Technology',subjects:['GEN132','DTI201'],distance:'3.4 km',match:79,time:'Saturday · 2:00 PM',availability:'Afternoon · Café',bio:'Enjoys collaborative study sessions and explaining difficult topics out loud.',image:'/img/profile.jpg',online:false},
  {id:5,name:'Thar Htet Aung',age:19,major:'Digital Technology',subjects:['DTI224','GEN102'],distance:'1.6 km',match:88,time:'Sunday · 11:00 AM',availability:'Morning · Library',bio:'Preparing for DTI224 and GEN102 and looking for a consistent study partner.',image:'/img/profile.jpg',online:true}
];

const state={screen:'welcome-screen',onboardingStep:1,subjects:new Set(['DTI224','GEN102']),filter:'All',pool:[...students],index:0,currentStudent:students[0],saved:new Set(),chatName:'Paing Htoo Kyaw'};

const $=id=>document.getElementById(id);
const $$=sel=>Array.from(document.querySelectorAll(sel));

function show(id){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  $(id)?.classList.add('active');
  state.screen=id;
  const appScreens=['discover-screen','sessions-screen','messages-screen','profile-screen','profile-detail-screen','chat-screen','schedule-create-screen'];
  $('topbar').classList.toggle('visible',appScreens.includes(id));
  $('bottom-nav').classList.toggle('visible',['discover-screen','sessions-screen','messages-screen','profile-screen'].includes(id));
  updateNav(id);
  window.scrollTo(0,0);
}
function updateNav(id){
  $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.target===id));
}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
function initials(name){return name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()}

function setUserName(){const name=$('profile-name')?.value.trim()||'Group Two';$('display-name').textContent=name}

function renderCards(){
  const stack=$('card-stack'); if(!stack)return; stack.innerHTML='';
  let pool=state.filter==='All'?students:students.filter(s=>s.subjects.includes(state.filter));
  if(!pool.length) pool=students;
  const ordered=[...pool.slice(state.index),...pool.slice(0,state.index)].slice(0,4).reverse();
  ordered.forEach((student,reverseIndex)=>{
    const isTop=reverseIndex===ordered.length-1;
    const card=document.createElement('article');card.className='study-card'+(isTop?' top':'');card.dataset.id=student.id;card.style.zIndex=20-reverseIndex;
    if(!isTop){const depth=reverseIndex;card.style.transform=`translateY(${depth*10}px) scale(${1-depth*.035})`}
    card.innerHTML=`
      <img class="study-card-image" src="${student.image}" alt="${student.name}">
      <div class="study-card-fallback"><span>${initials(student.name)}</span></div>
      <div class="card-shade"></div>
      ${student.online?'<div class="card-badge online">● Online now</div>':'<div class="card-badge">Recently active</div>'}
      <div class="swipe-label like">LIKE</div><div class="swipe-label pass">PASS</div>
      <div class="card-info"><h3>${student.name}, ${student.age}</h3><div class="card-major">${student.major}</div><div class="match-pill">${student.match}% study match</div><div class="card-meta"><span>${student.subjects[0]}</span><span>${student.distance}</span><span>${student.time}</span></div></div>`;
    const img=card.querySelector('.study-card-image'), fallback=card.querySelector('.study-card-fallback');
    img.addEventListener('load',()=>fallback.style.display='none');
    img.addEventListener('error',()=>{img.classList.add('is-hidden');fallback.style.display='grid'});
    card.addEventListener('click',e=>{if(card.dataset.dragged==='1'){card.dataset.dragged='0';return} if(isTop)openDetail(student)});
    stack.appendChild(card);
  });
  state.currentStudent=pool[state.index%pool.length];
  bindTopCard();
}

function bindTopCard(){
  const card=$('.study-card.top');
  if(!card)return;

  let startX=0;
  let startY=0;
  let lastX=0;
  let lastY=0;
  let dragging=false;
  let activePointerId=null;

  const like=card.querySelector('.like');
  const pass=card.querySelector('.pass');

  const resetCard=()=>{
    card.classList.remove('dragging');
    card.style.transition='transform .3s var(--ease)';
    card.style.transform='';
    like.style.opacity=0;
    pass.style.opacity=0;
  };

  card.onpointerdown=(e)=>{
    if(e.button!==undefined && e.pointerType==='mouse' && e.button!==0)return;
    if(e.target.closest('button'))return;

    e.preventDefault();

    dragging=true;
    activePointerId=e.pointerId;
    startX=e.clientX;
    startY=e.clientY;
    lastX=e.clientX;
    lastY=e.clientY;

    card.dataset.dragged='0';
    card.classList.add('dragging');

    if(card.setPointerCapture){
      try{card.setPointerCapture(e.pointerId)}catch(_){/* ignore */}
    }
  };

  card.onpointermove=(e)=>{
    if(!dragging || (activePointerId!==null && e.pointerId!==activePointerId))return;

    e.preventDefault();

    lastX=e.clientX;
    lastY=e.clientY;

    const dx=lastX-startX;
    const dy=lastY-startY;

    /* Keep vertical movement mostly neutral so the card feels horizontal. */
    const rot=dx*0.055;

    card.style.transition='none';
    card.style.transform=`translate3d(${dx}px,${Math.min(Math.max(dy*0.08,-18),18)}px,0) rotate(${rot}deg)`;

    if(Math.abs(dx)>8 || Math.abs(dy)>8){
      card.dataset.dragged='1';
    }

    like.style.opacity=Math.min(Math.max(dx/90,0),1);
    pass.style.opacity=Math.min(Math.max(-dx/90,0),1);
  };

  const finishPointer=(e)=>{
    if(!dragging)return;
    if(activePointerId!==null && e.pointerId!==undefined && e.pointerId!==activePointerId)return;

    const dx=lastX-startX;
    dragging=false;

    if(card.releasePointerCapture && activePointerId!==null){
      try{card.releasePointerCapture(activePointerId)}catch(_){/* ignore */}
    }

    activePointerId=null;

    card.classList.remove('dragging');

    if(Math.abs(dx)>75){
      swipe(dx>0?'right':'left',card);
    }else{
      resetCard();
    }
  };

  card.onpointerup=finishPointer;
  card.onpointercancel=()=>{
    dragging=false;
    activePointerId=null;
    resetCard();
  };

  /* Prevent the browser's native image/text drag behavior. */
  card.ondragstart=(e)=>e.preventDefault();
}

function swipe(direction,card= $('.study-card.top')){
  if(!card)return;const student=students.find(s=>String(s.id)===card.dataset.id)||state.currentStudent;card.style.transition='transform .35s var(--ease),opacity .25s ease';card.style.opacity='0';card.style.transform=`translateX(${direction==='right'?window.innerWidth*1.3:-window.innerWidth*1.3}px) rotate(${direction==='right'?25:-25}deg)`;setTimeout(()=>{state.index=(state.index+1)%students.length;renderCards();if(direction==='right')openMatch(student)},300)
}
function openDetail(student){state.currentStudent=student;$('detail-media').style.backgroundImage=`url("${student.image}")`;$('detail-name').textContent=`${student.name}, ${student.age}`;$('detail-major').textContent=student.major;$('detail-status').textContent=student.online?'● Online':'Recently active';$('detail-score').textContent=student.match+'%';$('detail-subjects').innerHTML=student.subjects.map(s=>`<span>${s}</span>`).join('');$('detail-bio').textContent=student.bio;$('detail-availability').textContent=student.availability;$('detail-connect').textContent=`Connect with ${student.name.split(' ')[0]}`;show('profile-detail-screen')}
function openMatch(student){$('match-subject').textContent=student.subjects[0];$('match-score').textContent=student.match+'% match';$('match-photo').style.backgroundImage=`url("${student.image}")`;$('match-modal').classList.add('visible');}
function closeMatch(){ $('match-modal').classList.remove('visible') }
function openChat(name,image){state.chatName=name;$('chat-name').textContent=name;if(image)$('chat-avatar').style.backgroundImage=`url("${image}")`;show('chat-screen');setTimeout(()=>{const b=$('chat-body');b.scrollTop=b.scrollHeight},30)}
function confirmSession(){ $('confirmation-modal').classList.add('visible') }

function bindNavigation(){
  $$('.nav-item').forEach(btn=>btn.addEventListener('click',()=>show(btn.dataset.target)));
  $('open-profile').addEventListener('click',()=>show('profile-screen'));
  $('notification-btn').addEventListener('click',()=>toast("You're all caught up."));
  $('detail-back').addEventListener('click',()=>show('discover-screen'));
  $('detail-connect').addEventListener('click',()=>openMatch(state.currentStudent));
  $('match-keep').addEventListener('click',()=>{closeMatch();show('discover-screen')});
  $('match-chat').addEventListener('click',()=>{const s=state.currentStudent;closeMatch();openChat(s.name,s.image)});
  $('schedule-from-chat').addEventListener('click',()=>show('schedule-create-screen'));
  $('schedule-back').addEventListener('click',()=>show('chat-screen'));
  $('confirm-session').addEventListener('click',confirmSession);
  $('close-confirmation').addEventListener('click',()=>$('confirmation-modal').classList.remove('visible'));
  $('view-session').addEventListener('click',()=>{ $('confirmation-modal').classList.remove('visible');show('sessions-screen');toast('Session confirmed.')});
  $('pass-btn').addEventListener('click',()=>swipe('left'));
  $('connect-btn').addEventListener('click',()=>swipe('right'));
  $('save-btn').addEventListener('click',()=>{const s=state.currentStudent;state.saved.add(s.id);toast(`${s.name} saved.`)});
  $('logout-btn').addEventListener('click',()=>{show('welcome-screen');$('topbar').classList.remove('visible');$('bottom-nav').classList.remove('visible');toast('Signed out.')});
  $$('.conversation').forEach(row=>row.addEventListener('click',()=>openChat(row.dataset.chat,'')));
  $$('.match-bubble').forEach(row=>row.addEventListener('click',()=>openChat(row.dataset.chat||'Paing Htoo Kyaw','')));
  $('chat-back').addEventListener('click',()=>show('messages-screen'));
  $('send-message').addEventListener('click',sendMessage);$('chat-input').addEventListener('keydown',e=>{if(e.key==='Enter')sendMessage()});
  $$('.chip').forEach(chip=>chip.addEventListener('click',()=>{state.filter=chip.dataset.filter;state.index=0;$$('.chip').forEach(c=>c.classList.remove('active'));chip.classList.add('active');renderCards()}));
  $$('.subject-option').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('selected');const subject=btn.dataset.subject;if(btn.classList.contains('selected'))state.subjects.add(subject);else state.subjects.delete(subject)}));
}
function sendMessage(){const input=$('chat-input');const text=input.value.trim();if(!text)return;const bubble=document.createElement('div');bubble.className='bubble sent';bubble.textContent=text;$('chat-body').appendChild(bubble);input.value='';$('chat-body').scrollTop=$('chat-body').scrollHeight;setTimeout(()=>{const reply=document.createElement('div');reply.className='bubble received';reply.textContent='Sounds good!';$('chat-body').appendChild(reply);$('chat-body').scrollTop=$('chat-body').scrollHeight},700)}
function nextWizard(){
  if(state.onboardingStep===1){setUserName();state.onboardingStep=2;$('wizard-step-1').classList.remove('active');$('wizard-step-2').classList.add('active');$('wizard-count').textContent='2 / 2';$('wizard-progress').style.width='100%';$('wizard-title').innerHTML='What are you<br>studying?';$('wizard-description').textContent='Choose the subjects you want help with.';$('wizard-action').textContent='Start discovering';return}
  if(!state.subjects.size){toast('Choose at least one subject.');return}setUserName();show('discover-screen');renderCards();
}
function sendToOnboarding(){show('onboarding-screen')}

$('member-continue').addEventListener('click',()=>{$('member-overlay').classList.add('closed');document.body.style.overflow='';show('welcome-screen')});
$('login-btn').addEventListener('click',()=>{const b=$('login-btn');b.disabled=true;b.querySelector('span:last-child').textContent='Signing you in…';setTimeout(()=>{b.disabled=false;b.querySelector('span:last-child').textContent='Continue with Google';show('onboarding-screen')},550)});
$('onboarding-back').addEventListener('click',()=>{if(state.onboardingStep===2){state.onboardingStep=1;$('wizard-step-2').classList.remove('active');$('wizard-step-1').classList.add('active');$('wizard-count').textContent='1 / 2';$('wizard-progress').style.width='50%';$('wizard-title').innerHTML='Tell us about<br>yourself.';$('wizard-description').textContent='A little context helps us recommend better study partners.'}else show('welcome-screen')});
$('wizard-action').addEventListener('click',nextWizard);

document.addEventListener('DOMContentLoaded',()=>{
  bindNavigation();
  renderCards();
  document.body.style.overflow='hidden';
  setTimeout(()=>document.body.style.overflow='',350);
});
