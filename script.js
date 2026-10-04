// 1. 필요한 HTML 요소 선택
const form = document.getElementById('applyForm');
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const submitBtn = document.getElementById('submitBtn');
const feedbackMessage = document.getElementById('feedbackMessage');

// 2. 폼 제출 시 실행될 이벤트 리스너 연결
form.addEventListener('submit', function(event) {
  event.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 기본 동작 방지

  // 입력된 값 변수에 저장
  const userName = nameInput.value.trim();
  const userEmail = emailInput.value.trim();

  // 3. 조건 처리: 이름이나 이메일이 비어있는지 확인
  if (userName === '' || userEmail === '') {
    // 실패 조건: 안내 문구 표시 및 빨간색 스타일 적용
    feedbackMessage.textContent = '이름과 이메일을 정확히 입력해 주세요.';
    feedbackMessage.style.color = '#d32f2f'; // 경고용 빨간색
    
  } else {
    // 성공 조건: 4. 처리 결과에 따른 안내 문구 및 버튼 상태 변경
    feedbackMessage.textContent = `${userName}님, 맞춤 식단 리포트 신청이 완료되었습니다!`;
    feedbackMessage.style.color = '#2e7d32'; // 성공용 초록색
    feedbackMessage.style.fontWeight = 'bold';

    // 제출 버튼 상태 변경 (텍스트 변경, 색상 회색 처리, 클릭 비활성화)
    submitBtn.textContent = '신청 완료됨';
    submitBtn.style.backgroundColor = '#9e9e9e';
    submitBtn.disabled = true; 
    
    // 추가 입력 방지를 위해 입력창도 비활성화
    nameInput.disabled = true;
    emailInput.disabled = true;
    document.getElementById('goal').disabled = true;
  }
});
