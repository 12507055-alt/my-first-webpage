/* ------------------------------------------------
   9주차 요구사항 2: 조건부 입력 구현 (알레르기 체크박스)
------------------------------------------------- */
const hasAllergy = document.getElementById('hasAllergy');
const allergyInputBox = document.getElementById('allergyInputBox');
const allergyDetails = document.getElementById('allergyDetails');

hasAllergy.addEventListener('change', function(e) {
  if (e.target.checked) {
    // 체크 시 영역 표시 및 입력 활성화
    allergyInputBox.style.display = 'block';
    allergyDetails.disabled = false;
    allergyDetails.focus();
  } else {
    // 해제 시 영역 숨김, 비활성화 및 값 초기화
    allergyInputBox.style.display = 'none';
    allergyDetails.disabled = true;
    allergyDetails.value = ''; 
  }
});

/* ------------------------------------------------
   9주차 요구사항 3: 입력 검증과 피드백 (글자 수 체크)
------------------------------------------------- */
const requestDetails = document.getElementById('requestDetails');
const requestFeedback = document.getElementById('requestFeedback');
const charCount = document.getElementById('charCount');
let isRequestValid = false; // 글자 수 충족 여부 상태

requestDetails.addEventListener('input', function(e) {
  const val = e.target.value.trim();
  const len = val.length;
  charCount.textContent = `${len}/100`; // 실시간 글자 수 갱신

  if (len === 0) {
    requestFeedback.textContent = '';
    requestDetails.style.borderColor = '#ccc';
    isRequestValid = false;
  } else if (len < 10) {
    // 조건 미달 시 오류 문구 및 붉은색 테두리 피드백
    requestFeedback.textContent = '❌ 최소 10자 이상 입력해주세요.';
    requestFeedback.style.color = '#d32f2f';
    requestDetails.style.borderColor = '#d32f2f';
    isRequestValid = false;
  } else {
    // 조건 충족 시 성공 문구 및 초록색 테두리로 전환 (오류 해제)
    requestFeedback.textContent = '✅ 조건이 충족되었습니다.';
    requestFeedback.style.color = '#2e7d32';
    requestDetails.style.borderColor = '#2e7d32';
    isRequestValid = true;
  }
});

/* ------------------------------------------------
   9주차 요구사항 4: 폼 제출 상태 처리 및 확인 화면 전환
------------------------------------------------- */
const applyForm = document.getElementById('applyForm');
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const goalSelect = document.getElementById('goal');
const errorMessage = document.getElementById('errorMessage');
const btnNext = document.getElementById('btnNext');

// 폼의 submit 이벤트로 데이터 제출 제어
applyForm.addEventListener('submit', function(e) {
  e.preventDefault(); // 페이지 새로고침 방지

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const goal = goalSelect.value;
  const requestVal = requestDetails.value.trim();

  // 1. 기본 필수 항목 누락 검증
  if (!name || !email || !goal || !requestVal) {
    showError('❌ 모든 필수 항목을 입력하거나 선택해 주세요.');
    return;
  }

  // 2. 조건부 입력 검증 (알레르기 체크해놓고 내용 안 쓴 경우)
  if (hasAllergy.checked && allergyDetails.value.trim() === '') {
    showError('❌ 알레르기 상세 정보를 입력해주세요.');
    allergyDetails.focus();
    return;
  }

  // 3. 최소 글자 수 검증
  if (!isRequestValid) {
    showError('❌ 추가 요청사항을 10자 이상 수정하여 작성해주세요.');
    requestDetails.focus();
    return;
  }

  errorMessage.style.display = 'none'; // 모든 오류 해제

  // 제출 중 상태 처리 (버튼 비활성화로 중복 제출 방지)
  const originalText = btnNext.textContent;
  btnNext.disabled = true;
  btnNext.textContent = '⏳ 데이터 검증 및 서버 전송 중...';

  // 서버 통신 지연 시뮬레이션 (1.5초)
  setTimeout(() => {
    // 💡 [실패 처리 테스트 기능]: 이름에 '오류'라고 입력하면 제출 실패를 시뮬레이션함
    if (name.includes('오류')) {
      showError('⚠️ 네트워크 응답이 지연되어 제출에 실패했습니다. 다시 시도해 주세요.');
      // 실패 시: 입력 내용을 유지한 채 버튼만 원래대로 복구
      btnNext.disabled = false;
      btnNext.textContent = originalText;
    } else {
      // 성공 처리: 확인 화면(Step 2)으로 데이터 넘기고 전환
      document.getElementById('confirmName').textContent = name;
      document.getElementById('confirmEmail').textContent = email;
      document.getElementById('confirmGoal').textContent = goalSelect.options[goalSelect.selectedIndex].text;
      
      // 요청사항 및 알레르기 통합 출력
      let finalRequest = requestVal;
      if (hasAllergy.checked) {
        finalRequest += ` [알레르기 주의: ${allergyDetails.value.trim()}]`;
      }
      document.getElementById('confirmRequest').textContent = finalRequest;

      // 화면 전환 및 버튼 복구 (이전 버튼을 누르고 돌아왔을 때를 대비)
      btnNext.disabled = false;
      btnNext.textContent = originalText;
      
      document.getElementById('step1-input').classList.remove('active');
      document.getElementById('step2-confirm').classList.add('active');
    }
  }, 1500);
});

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.style.display = 'block';
}

/* ------------------------------------------------
   기존 기능: 확인/수정/완료 및 목록 누적 기능 유지
------------------------------------------------- */
const step1 = document.getElementById('step1-input');
const step2 = document.getElementById('step2-confirm');
const step3 = document.getElementById('step3-complete');

// [이전 (수정하기)]
document.getElementById('btnEdit').addEventListener('click', function() {
  step2.classList.remove('active');
  step1.classList.add('active');
});

// [최종 신청 확정하기 및 내역 누적]
let historyData = [];
document.getElementById('btnSubmitFinal').addEventListener('click', function() {
  const finalName = nameInput.value.trim();
  document.getElementById('finalName').textContent = finalName;
  
  const newData = {
    id: Date.now(),
    name: finalName,
    goal: goalSelect.options[goalSelect.selectedIndex].text
  };
  historyData.push(newData);
  renderHistory();

  step2.classList.remove('active');
  step3.classList.add('active');
});

// [추가 신청하기 (초기화 및 다시 작성)]
document.getElementById('btnRestart').addEventListener('click', function() {
  applyForm.reset(); // 모든 폼 값 리셋
  
  // 9주차 추가 폼 상태도 함께 초기화
  allergyInputBox.style.display = 'none';
  allergyDetails.disabled = true;
  charCount.textContent = '0/100';
  requestFeedback.textContent = '';
  requestDetails.style.borderColor = '#ccc';
  isRequestValid = false;
  errorMessage.style.display = 'none';

  step3.classList.remove('active');
  step1.classList.add('active');
});

// [신청 내역 렌더링]
function renderHistory() {
  const list = document.getElementById('historyList');
  const emptyMsg = document.getElementById('emptyHistoryMessage');
  list.innerHTML = ''; 
  
  if (historyData.length === 0) {
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
    historyData.forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.innerHTML = `<div><strong>${item.name}</strong> <span>[${item.goal}]</span></div>`;
      
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn-cancel';
      cancelBtn.textContent = '신청 취소';
      cancelBtn.addEventListener('click', function() {
        historyData = historyData.filter(h => h.id !== item.id);
        renderHistory(); 
      });
      
      li.appendChild(cancelBtn);
      list.appendChild(li);
    });
  }
}
