/* 1. 탭 UI */
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

/* 2. 실시간 반응 */
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

/* 3. 사용자 흐름 및 중간고사 추가 기능 제어 */
const step1 = document.getElementById('step1-input');
const step2 = document.getElementById('step2-confirm');
const step3 = document.getElementById('step3-complete');

const btnNext = document.getElementById('btnNext');
const btnEdit = document.getElementById('btnEdit');
const btnSubmitFinal = document.getElementById('btnSubmitFinal');
const btnRestart = document.getElementById('btnRestart');
const errorMessage = document.getElementById('errorMessage');

// 신청 내역을 저장할 배열 선언 (중간고사 기능)
let historyData = [];

// [단계 1 -> 2] 다음 단계
btnNext.addEventListener('click', function() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const goal = goalSelect.value;
  
  if (!name || !email || !goal) {
    errorMessage.textContent = '❌ 이름, 이메일, 건강 목표를 모두 필수로 입력/선택해 주세요.';
    errorMessage.style.display = 'block';
    return;
  }
  
  errorMessage.style.display = 'none';
  document.getElementById('confirmName').textContent = name;
  document.getElementById('confirmEmail').textContent = email;
  document.getElementById('confirmGoal').textContent = goalSelect.options[goalSelect.selectedIndex].text;

  step1.classList.remove('active');
  step2.classList.add('active');
});

// [단계 2 -> 1] 수정하기
btnEdit.addEventListener('click', function() {
  step2.classList.remove('active');
  step1.classList.add('active');
});

// [단계 2 -> 3] 최종 신청 및 내역 누적 (중간고사 기능)
btnSubmitFinal.addEventListener('click', function() {
  const finalName = nameInput.value.trim();
  document.getElementById('finalName').textContent = finalName;
  
  // 새로운 신청 데이터를 객체로 생성하여 배열에 저장
  const newData = {
    id: Date.now(), // 취소를 위한 고유 식별자
    name: finalName,
    email: emailInput.value.trim(),
    goal: goalSelect.options[goalSelect.selectedIndex].text
  };
  historyData.push(newData);
  
  // 내역 화면 갱신
  renderHistory();

  step2.classList.remove('active');
  step3.classList.add('active');
});

// [단계 3 -> 1] 추가 신청하기 (초기화)
btnRestart.addEventListener('click', function() {
  document.getElementById('applyForm').reset();
  nameGreeting.textContent = '';
  goalMessage.style.display = 'none';
  errorMessage.style.display = 'none';

  step3.classList.remove('active');
  step1.classList.add('active');
});

// [새로운 기능] 신청 내역 렌더링 함수
function renderHistory() {
  const list = document.getElementById('historyList');
  const emptyMsg = document.getElementById('emptyHistoryMessage');
  
  list.innerHTML = ''; // 기존 목록 초기화
  
  // 조건 검사: 내역이 없으면 빈 상태 메시지 노출
  if (historyData.length === 0) {
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
    
    // 내역이 있으면 배열을 순회하며 목록 생성
    historyData.forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';
      
      const infoDiv = document.createElement('div');
      infoDiv.className = 'history-info';
      infoDiv.innerHTML = `<strong>${item.name}</strong> <span>[${item.goal}]</span><span style="font-size:0.85rem; color:#757575;">${item.email}</span>`;
      
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn-cancel';
      cancelBtn.textContent = '신청 취소';
      cancelBtn.addEventListener('click', function() {
        // 취소 버튼 클릭 시 해당 아이디를 제외하고 배열 재구성
        historyData = historyData.filter(h => h.id !== item.id);
        renderHistory(); // 화면 다시 그리기
      });
      
      li.appendChild(infoDiv);
      li.appendChild(cancelBtn);
      list.appendChild(li);
    });
  }
}
