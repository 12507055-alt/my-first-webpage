/* -----------------------------------------
   1. 탭 UI 구현 (click 이벤트)
----------------------------------------- */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    // 1) 모든 버튼과 콘텐츠의 active 클래스 제거 (스타일 초기화)
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    // 2) 클릭된 버튼에 active 클래스 추가 (버튼 스타일 변경)
    this.classList.add('active');
    
    // 3) 클릭된 버튼의 data-target 값과 동일한 id를 가진 콘텐츠 활성화 (화면 표시 상태 변경)
    const targetId = this.getAttribute('data-target');
    document.getElementById(targetId).classList.add('active');
  });
});

/* -----------------------------------------
   2. 이름 입력 실시간 피드백 (input 이벤트)
----------------------------------------- */
const nameInput = document.getElementById('userName');
const nameGreeting = document.getElementById('nameGreeting');

nameInput.addEventListener('input', function() {
  const name = this.value.trim();
  
  if (name.length > 0) {
    // 문구와 스타일 동시 변경
    nameGreeting.textContent = `반갑습니다, ${name}님! 맞춤 식단을 준비해 드릴게요.`;
    nameGreeting.style.color = '#2e7d32'; 
  } else {
    nameGreeting.textContent = '';
  }
});

/* -----------------------------------------
   3. 목표 선택 맞춤 메시지 (change 이벤트)
----------------------------------------- */
const goalSelect = document.getElementById('goal');
const goalMessage = document.getElementById('goalMessage');

goalSelect.addEventListener('change', function() {
  goalMessage.style.display = 'block'; // 숨겨져 있던 요소를 보이게 함 (스타일 변경)
  
  if (this.value === 'diet') {
    goalMessage.textContent = '💡 칼로리는 낮추고 포만감은 높인 샐러드 위주의 식단이 추천됩니다.';
    goalMessage.style.backgroundColor = '#e3f2fd'; // 파란 배경
    goalMessage.style.color = '#1565c0';
  } else if (this.value === 'muscle') {
    goalMessage.textContent = '💡 단백질이 풍부한 육류 및 해산물 위주의 식단이 추천됩니다.';
    goalMessage.style.backgroundColor = '#fce4ec'; // 핑크 배경
    goalMessage.style.color = '#c2185b';
  } else if (this.value === 'health') {
    goalMessage.textContent = '💡 영양소가 골고루 분배된 지중해식 밸런스 식단이 추천됩니다.';
    goalMessage.style.backgroundColor = '#e8f5e9'; // 초록 배경
    goalMessage.style.color = '#2e7d32';
  } else {
    goalMessage.style.display = 'none'; // 선택 안함일 경우 다시 숨김
  }
});

/* -----------------------------------------
   4. 폼 제출 검증 및 피드백 (submit 이벤트)
----------------------------------------- */
const form = document.getElementById('applyForm');
const emailInput = document.getElementById('userEmail');
const submitBtn = document.getElementById('submitBtn');
const feedbackMessage = document.getElementById('feedbackMessage');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // 페이지 새로고침 방지

  const userName = nameInput.value.trim();
  
  // 제출 성공 조건 처리
  feedbackMessage.textContent = `${userName}님, 맞춤 식단 리포트 신청이 완료되었습니다!`;
  feedbackMessage.style.color = '#2e7d32';
  feedbackMessage.style.fontWeight = 'bold';

  // 버튼 상태 변경
  submitBtn.textContent = '신청 완료됨';
  submitBtn.style.backgroundColor = '#9e9e9e'; // 버튼 색상을 회색으로 변경
  submitBtn.disabled = true; // 버튼 클릭 비활성화
  
  // 폼 입력창 모두 비활성화
  nameInput.disabled = true;
  emailInput.disabled = true;
  goalSelect.disabled = true;
});
