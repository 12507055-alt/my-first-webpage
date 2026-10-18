/* 1. 탭 UI (6주차) */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(this.getAttribute('data-target')).classList.add('active');
  });
});

/* 2. 실시간 반응 (6주차) */
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const goalSelect = document.getElementById('goal');

const nameGreeting = document.getElementById('nameGreeting');
const goalMessage = document.getElementById('goalMessage');

nameInput.addEventListener('input', function() {
  const name = this.value.trim();
  nameGreeting.textContent = name.length > 0 ? `반갑습니다, ${name}님! 맞춤 식단을 준비해 드릴게요.` : '';
});

goalSelect.addEventListener('change', function() {
  goalMessage.style.display = 'block';
  if (this.value === 'diet') {
    goalMessage.textContent = '💡 칼로리는 낮추고 포만감은 높인 샐러드 위주의 식단이 추천됩니다.';
    goalMessage.style.backgroundColor = '#e3f2fd'; goalMessage.style.color = '#1565c0';
  } else if (this.value === 'muscle') {
    goalMessage.textContent = '💡 단백질이 풍부한 육류 및 해산물 위주의 식단이 추천됩니다.';
    goalMessage.style.backgroundColor = '#fce4ec'; goalMessage.style.color = '#c2185b';
  } else if (this.value === 'health') {
    goalMessage.textContent = '💡 영양소가 골고루 분배된 지중해식 밸런스 식단이 추천됩니다.';
    goalMessage.style.backgroundColor = '#e8f5e9'; goalMessage.style.color = '#2e7d32';
  } else {
    goalMessage.style.display = 'none';
  }
});

/* ----------------------------------------------------
   3. 사용자 흐름 및 인터랙션 시나리오 제어 (7주차)
---------------------------------------------------- */
const step1 = document.getElementById('step1-input');
const step2 = document.getElementById('step2-confirm');
const step3 = document.getElementById('step3-complete');

const btnNext = document.getElementById('btnNext');
const btnEdit = document.getElementById('btnEdit');
const btnSubmitFinal = document.getElementById('btnSubmitFinal');
const btnRestart = document.getElementById('btnRestart');
const errorMessage = document.getElementById('errorMessage');

// [단계 1 -> 2] 다음 단계로 (입력값 유효성 검사 및 데이터 전달)
btnNext.addEventListener('click', function() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const goal = goalSelect.value;
  
  // 필수값 누락 검사 (에러 처리)
  if (!name || !email || !goal) {
    errorMessage.textContent = '❌ 이름, 이메일, 건강 목표를 모두 필수로 입력/선택해 주세요.';
    errorMessage.style.display = 'block';
    return;
  }
  
  // 성공 시 에러 숨기기
  errorMessage.style.display = 'none';

  // 확인 화면(Step 2)에 입력값 반영하기
  document.getElementById('confirmName').textContent = name;
  document.getElementById('confirmEmail').textContent = email;
  document.getElementById('confirmGoal').textContent = goalSelect.options[goalSelect.selectedIndex].text;

  // 화면 전환
  step1.classList.remove('active');
  step2.classList.add('active');
});

// [단계 2 -> 1] 이전 (수정하기)
btnEdit.addEventListener('click', function() {
  // 사용자가 입력했던 값은 인풋창에 그대로 유지된 상태로 화면만 전환됨
  step2.classList.remove('active');
  step1.classList.add('active');
});

// [단계 2 -> 3] 최종 신청 완료
btnSubmitFinal.addEventListener('click', function() {
  // 완료 화면(Step 3)에 이름 전달
  document.getElementById('finalName').textContent = nameInput.value.trim();
  
  // 화면 전환
  step2.classList.remove('active');
  step3.classList.add('active');
});

// [단계 3 -> 1] 초기화 및 다시 시작
btnRestart.addEventListener('click', function() {
  // 모든 폼 입력 상태 초기화
  document.getElementById('applyForm').reset();
  
  // 실시간 안내 문구 초기화
  nameGreeting.textContent = '';
  goalMessage.style.display = 'none';
  errorMessage.style.display = 'none';

  // 화면 전환 (첫 단계로)
  step3.classList.remove('active');
  step1.classList.add('active');
});
