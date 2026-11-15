/* ------------------------------------------------
   1. 모바일 메뉴 열기/닫기 및 반응형 제어 (10주차 Req 4)
------------------------------------------------- */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('#mainNav a');

function closeMobileMenu() {
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  mobileMenuBtn.textContent = '메뉴 열기 ☰';
  mainNav.classList.remove('open');
}

function openMobileMenu() {
  mobileMenuBtn.setAttribute('aria-expanded', 'true');
  mobileMenuBtn.textContent = '메뉴 닫기 ✕';
  mainNav.classList.add('open');
}

mobileMenuBtn.addEventListener('click', function() {
  const isExpanded = this.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// 화면 폭이 넓어지면 모바일 메뉴 상태 초기화
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});

/* ------------------------------------------------
   2. 현재 위치 표시 (클릭 · 스크롤 · 새로고침 · 뒤로 가기) (10주차 Req 2)
------------------------------------------------- */
const sections = document.querySelectorAll('section');
let isManualNavigating = false;

function setActiveNav(targetHash) {
  let matched = false;
  navLinks.forEach(link => {
    if (link.getAttribute('href') === targetHash) {
      link.setAttribute('aria-current', 'page');
      matched = true;
    } else {
      link.removeAttribute('aria-current');
    }
  });
  // 일치하는 해시가 없으면 첫 번째 메뉴 활성화
  if (!matched && navLinks.length > 0) {
    navLinks[0].setAttribute('aria-current', 'page');
  }
}

function syncNavWithScroll() {
  let currentId = sections[0].getAttribute('id');

  // 페이지 맨 아래에 도달한 경우 마지막 섹션 활성화
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 20) {
    currentId = sections[sections.length - 1].getAttribute('id');
  } else {
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 160) {
        currentId = section.getAttribute('id');
      }
    });
  }
  setActiveNav(`#${currentId}`);
}

// 메뉴 클릭 시 즉시 aria-current 변경 및 모바일 메뉴 닫기
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    const targetHash = this.getAttribute('href');
    setActiveNav(targetHash);
    isManualNavigating = true;
    setTimeout(() => { isManualNavigating = false; }, 600);

    if (window.innerWidth <= 768) {
      closeMobileMenu();
    }
  });
});

// 스크롤 이동 시 현재 섹션 감지
window.addEventListener('scroll', () => {
  if (!isManualNavigating) {
    syncNavWithScroll();
  }
});

// 브라우저 뒤로 가기 / 앞으로 가기 시 해시와 메뉴 일치
window.addEventListener('hashchange', () => {
  if (window.location.hash) {
    setActiveNav(window.location.hash);
  } else {
    syncNavWithScroll();
  }
});

// 새로고침 시 현재 URL 해시 또는 스크롤 위치 기준으로 메뉴 일치
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash) {
    setActiveNav(window.location.hash);
  } else {
    syncNavWithScroll();
  }
});

/* ------------------------------------------------
   3. 추천 식단 탭 UI
------------------------------------------------- */
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

/* ------------------------------------------------
   4. 9주차 폼 조건부 입력 · 실시간 검증 · 제출 처리
------------------------------------------------- */
const applyForm = document.getElementById('applyForm');
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const goalSelect = document.getElementById('goal');
const hasAllergy = document.getElementById('hasAllergy');
const allergyInputBox = document.getElementById('allergyInputBox');
const allergyDetails = document.getElementById('allergyDetails');
const requestDetails = document.getElementById('requestDetails');
const requestFeedback = document.getElementById('requestFeedback');
const charCount = document.getElementById('charCount');
const errorMessage = document.getElementById('errorMessage');
const btnNext = document.getElementById('btnNext');

let isRequestValid = false;

hasAllergy.addEventListener('change', e => {
  if (e.target.checked) {
    allergyInputBox.style.display = 'block';
    allergyDetails.disabled = false;
    allergyDetails.focus();
  } else {
    allergyInputBox.style.display = 'none';
    allergyDetails.disabled = true;
    allergyDetails.value = '';
  }
});

requestDetails.addEventListener('input', e => {
  const len = e.target.value.trim().length;
  charCount.textContent = `${len}/100`;

  if (len === 0) {
    requestFeedback.textContent = '';
    requestDetails.style.borderColor = '#cccccc';
    isRequestValid = false;
  } else if (len < 10) {
    requestFeedback.textContent = '❌ 최소 10자 이상 입력해주세요.';
    requestFeedback.style.color = '#d32f2f';
    requestDetails.style.borderColor = '#d32f2f';
    isRequestValid = false;
  } else {
    requestFeedback.textContent = '✅ 조건이 충족되었습니다.';
    requestFeedback.style.color = '#2e7d32';
    requestDetails.style.borderColor = '#2e7d32';
    isRequestValid = true;
  }
});

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.style.display = 'block';
}

applyForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const goal = goalSelect.value;
  const reqVal = requestDetails.value.trim();

  if (!name || !email || !goal || !reqVal) {
    showError('❌ 이름, 이메일, 건강 목표, 추가 요청사항을 모두 입력해주세요.');
    return;
  }

  if (hasAllergy.checked && allergyDetails.value.trim() === '') {
    showError('❌ 알레르기 유발 식품을 입력해주세요.');
    allergyDetails.focus();
    return;
  }

  if (!isRequestValid) {
    showError('❌ 추가 요청사항을 10자 이상으로 수정해주세요.');
    requestDetails.focus();
    return;
  }

  errorMessage.style.display = 'none';

  const originalText = btnNext.textContent;
  btnNext.disabled = true;
  btnNext.textContent = '⏳ 데이터 검증 및 서버 전송 중...';

  setTimeout(() => {
    // 이름에 '오류' 포함 시 실패 복구 테스트용 분기
    if (name.includes('오류')) {
      showError('⚠️ 일시적인 네트워크 오류로 제출에 실패했습니다. 입력값은 유지되니 다시 시도해주세요.');
      btnNext.disabled = false;
      btnNext.textContent = originalText;
      return;
    }

    document.getElementById('confirmName').textContent = name;
    document.getElementById('confirmEmail').textContent = email;
    document.getElementById('confirmGoal').textContent = goalSelect.options[goalSelect.selectedIndex].text;

    let finalRequest = reqVal;
    if (hasAllergy.checked) {
      finalRequest += ` [알레르기 주의: ${allergyDetails.value.trim()}]`;
    }
    document.getElementById('confirmRequest').textContent = finalRequest;

    btnNext.disabled = false;
    btnNext.textContent = originalText;

    document.getElementById('step1-input').classList.remove('active');
    document.getElementById('step2-confirm').classList.add('active');
  }, 1200);
});

document.getElementById('btnEdit').addEventListener('click', () => {
  document.getElementById('step2-confirm').classList.remove('active');
  document.getElementById('step1-input').classList.add('active');
});

/* ------------------------------------------------
   5. 목록 필터링 및 결과 안내 (10주차 Req 3)
------------------------------------------------- */
let historyData = [];
let currentFilter = 'all';

document.getElementById('btnSubmitFinal').addEventListener('click', () => {
  const finalName = nameInput.value.trim();
  document.getElementById('finalName').textContent = finalName;

  historyData.push({
    id: Date.now(),
    name: finalName,
    goalText: goalSelect.options[goalSelect.selectedIndex].text,
    goalValue: goalSelect.value
  });

  renderHistory();

  document.getElementById('step2-confirm').classList.remove('active');
  document.getElementById('step3-complete').classList.add('active');
});

document.getElementById('btnRestart').addEventListener('click', () => {
  applyForm.reset();
  allergyInputBox.style.display = 'none';
  allergyDetails.disabled = true;
  charCount.textContent = '0/100';
  requestFeedback.textContent = '';
  requestDetails.style.borderColor = '#cccccc';
  isRequestValid = false;
  errorMessage.style.display = 'none';

  document.getElementById('step3-complete').classList.remove('active');
  document.getElementById('step1-input').classList.add('active');
});

const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
    this.setAttribute('aria-pressed', 'true');
    currentFilter = this.getAttribute('data-filter');
    renderHistory();
  });
});

function renderHistory() {
  const list = document.getElementById('historyList');
  const emptyMsg = document.getElementById('emptyHistoryMessage');
  const countSpan = document.getElementById('listCount');

  list.innerHTML = '';

  const filteredData = currentFilter === 'all'
    ? historyData
    : historyData.filter(item => item.goalValue === currentFilter);

  countSpan.textContent = filteredData.length;

  // 전체 내역이 없는 경우 vs 선택한 조건에 맞는 결과만 없는 경우 구분 안내
  if (historyData.length === 0) {
    emptyMsg.textContent = '현재 누적된 신청 내역이 없습니다. 상단에서 무료 체험을 신청해 보세요.';
    emptyMsg.style.display = 'block';
  } else if (filteredData.length === 0) {
    emptyMsg.textContent = '선택한 건강 목표 조건에 해당하는 신청 내역이 없습니다.';
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';

    filteredData.forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.innerHTML = `<div><strong>${item.name}</strong> <span>[${item.goalText}]</span></div>`;

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn-cancel';
      cancelBtn.textContent = '신청 취소';
      cancelBtn.addEventListener('click', () => {
        historyData = historyData.filter(h => h.id !== item.id);
        renderHistory();
      });

      li.appendChild(cancelBtn);
      list.appendChild(li);
    });
  }
}
