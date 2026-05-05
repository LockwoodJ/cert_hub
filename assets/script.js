
function gradeQuiz(id){const quiz=document.getElementById(id);const questions=quiz.querySelectorAll('.quiz-question');let correct=0;questions.forEach(q=>{const chosen=q.querySelector('input[type=radio]:checked');const answer=q.getAttribute('data-answer');q.querySelectorAll('label').forEach(l=>l.style.borderColor='#dce3f2');if(chosen){const label=chosen.closest('label');if(chosen.value===answer){correct++;label.style.borderColor='#33CC66'}else{label.style.borderColor='#b42318'}}});const result=quiz.querySelector('.quiz-result');const pct=Math.round(correct/questions.length*100);result.className='quiz-result '+(pct>=80?'pass':'retry');result.textContent=`Score: ${correct}/${questions.length} (${pct}%). ${pct>=80?'Certification check passed. Ask your instructor for the hands-on performance check.':'Review the learning section and try again.'}`;}
function updateSafetySim(){if(!document.getElementById('safetyOutput'))return;const goggles=document.getElementById('goggles').checked,hair=document.getElementById('hair').checked,guard=document.getElementById('guard').checked,clutter=Number(document.getElementById('clutter').value);let score=100;if(!goggles)score-=35;if(!hair)score-=20;if(!guard)score-=25;score-=clutter*5;score=Math.max(0,score);document.getElementById('safetyOutput').textContent=`Readiness Score: ${score}/100 — ${score>=85?'Ready for instructor check.':score>=65?'Fix the highlighted issues before using tools.':'Stop. This setup is unsafe.'}`;}
function updatePrinterSim(){if(!document.getElementById('printerOutput'))return;const layer=Number(document.getElementById('layerHeight').value),infill=Number(document.getElementById('infill').value),supports=document.getElementById('supports').value==='yes';const time=Math.round(45*(0.2/layer)*(1+infill/100)*(supports?1.25:1));const quality=layer<=.16?'high detail':layer<=.24?'balanced':'draft';document.getElementById('printerOutput').textContent=`Estimated print time: ${time} minutes. Expected quality: ${quality}. Material use increases as infill and supports increase.`;}
function updateLaserSim(){if(!document.getElementById('laserOutput'))return;const speed=Number(document.getElementById('laserSpeed').value),power=Number(document.getElementById('laserPower').value),focus=Number(document.getElementById('focusOffset').value);const energy=Math.round((power/speed)*100),focusMsg=Math.abs(focus)<=1?'good focus':'poor focus risk';document.getElementById('laserOutput').textContent=`Relative burn energy: ${energy}. ${focusMsg}. Higher power and lower speed produce darker engraves or deeper cuts.`;}
function updateCNCSim(){if(!document.getElementById('cncOutput'))return;const feed=Number(document.getElementById('feedRate').value),rpm=Number(document.getElementById('rpm').value),flutes=Number(document.getElementById('flutes').value);document.getElementById('cncOutput').textContent=`Chip load: ${(feed/(rpm*flutes)).toFixed(4)} in/tooth. Too low can rub and heat the bit; too high can chatter or break the bit.`;}
function drawSimpleCanvas(canvasId,type){const c=document.getElementById(canvasId);if(!c)return;const ctx=c.getContext('2d');c.width=c.offsetWidth*devicePixelRatio;c.height=c.offsetHeight*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio);ctx.lineWidth=3;ctx.strokeStyle='#003399';ctx.fillStyle='#33CC66';if(type==='printer'){ctx.strokeRect(80,40,220,150);ctx.fillRect(120,155,140,20);ctx.strokeRect(145,80,90,60);ctx.fillStyle='#FFCC00';ctx.fillRect(160,120,60,20)}else if(type==='laser'){ctx.strokeRect(60,45,280,155);ctx.beginPath();ctx.moveTo(200,55);ctx.lineTo(200,170);ctx.stroke();ctx.fillStyle='#FFCC00';ctx.beginPath();ctx.arc(200,170,14,0,Math.PI*2);ctx.fill()}else if(type==='cnc'){ctx.strokeRect(70,55,260,145);ctx.beginPath();ctx.moveTo(200,65);ctx.lineTo(200,145);ctx.stroke();ctx.fillStyle='#FFCC00';ctx.fillRect(130,150,140,25)}}
window.addEventListener('load',()=>{updateSafetySim();updatePrinterSim();updateLaserSim();updateCNCSim();drawSimpleCanvas('printerCanvas','printer');drawSimpleCanvas('laserCanvas','laser');drawSimpleCanvas('cncCanvas','cnc');});

function tryNextImage(img){
  const sources = (img.dataset.sources || '').split('|').filter(Boolean);
  const idx = Number(img.dataset.idx || 0);
  if(idx < sources.length){
    img.dataset.idx = idx + 1;
    img.src = sources[idx];
  }else{
    const card = img.closest('.tool-card,.hero-tool-card');
    if(card){ card.classList.add('image-error'); }
  }
}

function gradeCertificationQuiz(id, levelTitle){
  const quiz = document.getElementById(id);
  const studentName = (document.getElementById(id + '-name')?.value || '').trim();
  const questions = quiz.querySelectorAll('.quiz-question');
  let correct = 0;
  questions.forEach(q=>{
    const chosen = q.querySelector('input[type=radio]:checked');
    const answer = q.getAttribute('data-answer');
    q.querySelectorAll('label').forEach(l=>l.style.borderColor='#dce3f2');
    if(chosen){
      const label = chosen.closest('label');
      if(chosen.value === answer){ correct++; label.style.borderColor='#33CC66'; }
      else{ label.style.borderColor='#b42318'; }
    }
  });
  const pct = Math.round(correct/questions.length*100);
  const status = document.getElementById(id + '-status');
  const cert = document.getElementById(id + '-certificate');
  if(!studentName){
    status.className = 'cert-status retry';
    status.textContent = 'Please enter your full name before submitting the certification quiz.';
    cert.classList.remove('show');
    return;
  }
  if(pct >= 80){
    status.className = 'cert-status pass';
    status.textContent = `Passed: ${correct}/${questions.length} (${pct}%). Your certificate is ready below. Print or save it as a PDF and upload it to Google Classroom.`;
    cert.querySelector('[data-cert-name]').textContent = studentName;
    cert.querySelector('[data-cert-level]').textContent = levelTitle;
    cert.querySelector('[data-cert-score]').textContent = `${correct}/${questions.length} (${pct}%)`;
    cert.querySelector('[data-cert-date]').textContent = new Date().toLocaleDateString();
    cert.classList.add('show');
    cert.scrollIntoView({behavior:'smooth', block:'start'});
  }else{
    status.className = 'cert-status retry';
    status.textContent = `Not passed yet: ${correct}/${questions.length} (${pct}%). You need at least 80%, or 20 out of 25, to earn the certificate. Review the level modules and try again.`;
    cert.classList.remove('show');
  }
}
function printCertificate(id){
  const cert = document.getElementById(id + '-certificate');
  if(cert && cert.classList.contains('show')) window.print();
}

function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}
function setupCertificationQuiz(id){
  const quiz=document.getElementById(id);
  if(!quiz || quiz.dataset.ready==='1') return;
  quiz.dataset.ready='1';
  const questions=Array.from(quiz.querySelectorAll('.quiz-question'));
  shuffleArray(questions).forEach((q,idx)=>{
    const p=q.querySelector('p');
    if(p){ p.textContent = p.textContent.replace(/^\d+\.\s*/,''); p.textContent = `${idx+1}. ${p.textContent}`; }
    const labels=Array.from(q.querySelectorAll('label'));
    shuffleArray(labels).forEach(label=>q.appendChild(label));
    quiz.insertBefore(q, quiz.querySelector('button'));
  });
  const progress=document.createElement('div');
  progress.className='progress-wrap';
  progress.innerHTML='<div class="progress-bar"></div>';
  quiz.insertBefore(progress, quiz.firstChild);
  quiz.addEventListener('change',()=>updateQuizProgress(id));
  updateQuizProgress(id);
}
function updateQuizProgress(id){
  const quiz=document.getElementById(id);
  if(!quiz) return;
  const questions=quiz.querySelectorAll('.quiz-question');
  const answered=Array.from(questions).filter(q=>q.querySelector('input[type=radio]:checked')).length;
  const bar=quiz.querySelector('.progress-bar');
  if(bar) bar.style.width = `${Math.round(answered/questions.length*100)}%`;
  const pill=document.getElementById(id+'-answered');
  if(pill) pill.textContent = `${answered}/${questions.length} answered`;
}
function makeCertificateId(levelTitle, name, score){
  const cleanLevel=(levelTitle||'CERT').replace(/[^A-Z0-9]/gi,'').toUpperCase().slice(0,8);
  const initials=(name||'STUDENT').split(/\s+/).map(x=>x[0]||'').join('').toUpperCase().slice(0,4);
  const stamp=new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14);
  const rand=Math.random().toString(36).slice(2,7).toUpperCase();
  return `${cleanLevel}-${initials}-${score}-${stamp}-${rand}`;
}
function launchConfetti(){
  const colors=['#003399','#33CC66','#FFCC00','#ffffff'];
  for(let i=0;i<80;i++){
    const piece=document.createElement('div');
    piece.className='confetti-piece';
    piece.style.left=Math.random()*100+'vw';
    piece.style.background=colors[Math.floor(Math.random()*colors.length)];
    piece.style.animationDelay=(Math.random()*0.45)+'s';
    piece.style.transform=`rotate(${Math.random()*360}deg)`;
    document.body.appendChild(piece);
    setTimeout(()=>piece.remove(),2600);
  }
}
function gradeCertificationQuiz(id, levelTitle){
  setupCertificationQuiz(id);
  const quiz = document.getElementById(id);
  const studentName = (document.getElementById(id + '-name')?.value || '').trim();
  const questions = quiz.querySelectorAll('.quiz-question');
  let correct = 0;
  questions.forEach(q=>{
    const chosen = q.querySelector('input[type=radio]:checked');
    const answer = q.getAttribute('data-answer');
    q.querySelectorAll('label').forEach(l=>l.style.borderColor='#dce3f2');
    if(chosen){
      const label = chosen.closest('label');
      if(chosen.value === answer){ correct++; label.style.borderColor='#33CC66'; }
      else{ label.style.borderColor='#b42318'; }
    }
  });
  const pct = Math.round(correct/questions.length*100);
  const status = document.getElementById(id + '-status');
  const cert = document.getElementById(id + '-certificate');
  if(!studentName){
    status.className = 'cert-status retry';
    status.textContent = 'Please enter your full name before submitting the certification quiz.';
    cert.classList.remove('show');
    return;
  }
  const answered=Array.from(questions).filter(q=>q.querySelector('input[type=radio]:checked')).length;
  if(answered < questions.length){
    status.className = 'cert-status retry';
    status.textContent = `Please answer all questions before submitting. You have answered ${answered}/${questions.length}.`;
    cert.classList.remove('show');
    return;
  }
  if(pct >= 80){
    const certId=makeCertificateId(levelTitle, studentName, `${correct}of${questions.length}`);
    status.className = 'cert-status pass';
    status.innerHTML = `Passed: ${correct}/${questions.length} (${pct}%). Certificate ID: <span class="cert-id">${certId}</span>. Save it as a PDF and upload it to Google Classroom.`;
    cert.querySelector('[data-cert-name]').textContent = studentName;
    cert.querySelector('[data-cert-level]').textContent = levelTitle;
    cert.querySelector('[data-cert-score]').textContent = `${correct}/${questions.length} (${pct}%)`;
    cert.querySelector('[data-cert-date]').textContent = new Date().toLocaleDateString();
    const idSlot=cert.querySelector('[data-cert-id]');
    if(idSlot) idSlot.textContent = certId;
    cert.classList.add('show');
    launchConfetti();
    cert.scrollIntoView({behavior:'smooth', block:'start'});
  }else{
    status.className = 'cert-status retry';
    status.textContent = `Not passed yet: ${correct}/${questions.length} (${pct}%). You need at least 80%, or 20 out of 25, to earn the certificate. Review the level modules and try again.`;
    cert.classList.remove('show');
  }
}
window.addEventListener('load',()=>{
  document.querySelectorAll('.quiz[id^="level_"]').forEach(q=>setupCertificationQuiz(q.id));
});

function generateSafetyContract(){
  const required = Array.from(document.querySelectorAll('[data-contract-required]'));
  const missing = required.filter(cb => !cb.checked);
  const name = (document.getElementById('contract-name')?.value || '').trim();
  const section = (document.getElementById('contract-section')?.value || '').trim();
  const date = (document.getElementById('contract-date')?.value || '').trim();
  const signature = (document.getElementById('contract-signature')?.value || '').trim();
  const status = document.getElementById('contract-status');
  const output = document.getElementById('contract-output');

  if(!name || !date || !signature){
    status.className = 'contract-status retry';
    status.textContent = 'Please enter your full name, date, and digital signature before generating the contract.';
    output.classList.remove('show');
    return;
  }
  if(missing.length > 0){
    status.className = 'contract-status retry';
    status.textContent = `Please check every agreement box before generating the contract. Missing: ${missing.length}.`;
    output.classList.remove('show');
    return;
  }

  const contractId = 'LS-SAFETY-' + new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14) + '-' + Math.random().toString(36).slice(2,7).toUpperCase();
  document.querySelector('[data-contract-name]').textContent = name;
  document.querySelector('[data-contract-section]').textContent = section || 'Not provided';
  document.querySelector('[data-contract-date]').textContent = new Date(date + 'T00:00:00').toLocaleDateString();
  document.querySelector('[data-contract-signature]').textContent = signature;
  document.querySelector('[data-contract-id]').textContent = contractId;
  status.className = 'contract-status pass';
  status.innerHTML = `Safety contract generated. Contract ID: <span class="cert-id">${contractId}</span>. Use the button below to print or save as PDF, then upload it to Google Classroom.`;
  output.classList.add('show');
  output.scrollIntoView({behavior:'smooth', block:'start'});
}
function printSafetyContract(){
  const output = document.getElementById('contract-output');
  if(output && output.classList.contains('show')) window.print();
}
window.addEventListener('load',()=>{
  const date = document.getElementById('contract-date');
  if(date && !date.value){
    date.value = new Date().toISOString().split('T')[0];
  }
});
