// common 폴더 경로 (회사소개서 등 리소스 경로 계산용)
const COMMON_BASE = document.currentScript ? document.currentScript.src.replace(/js\/common\.js.*$/, '') : '/common/';

// GNB가 숨겨지고 전체메뉴(mo)로 전환되는 폭 - _maxin.scss $breakpointText의 pc 값과 동일
const GNB_BREAKPOINT = '(max-width: 1280px)';

document.addEventListener("DOMContentLoaded", function () {
    allMenu(); //전체메뉴
    //swiperMain() // 메인슬라이드
    fixedTap(); //상단 고정 탭 메뉴
    //introView(); //메인 - 인트로부터 시작
    //introSkip(); //메인 - 인트로 생략
    contactInput(); //문의하기 입력값 표시
    contactForm(); //문의하기 필수값 검사
    serviceSlider(); //ai-service slide
    comTabMobile(); //모바일 탭 메뉴
    refAccordion(); //레퍼런스 아코디언
    logoRolling(); //협력사 로고 롤링
    quickTop(); //퀵 상단이동
    quickOverlap(); //퀵 버튼이 탭 메뉴와 겹치면 숨김
    mobileMenu(); //모바일 전체메뉴 아코디언
    searchFile(); //파일찾기 (파일 첨부 영역이 있는 페이지에서만 동작)
});

//인트로부터 시작
function introView(){
    const main = document.querySelector('.cptMain');
    if (!main) return;
    setTimeout(function(){
        main.querySelector('.scene02').classList.add('sceneView');
        swiperMain(); // 메인슬라이드
    }, 5600);
}
//인트로 생략
function introSkip(){
    const main = document.querySelector('.cptMain');
    if (!main) return;
    main.classList.add("introSkip");
    swiperMain(); // 메인슬라이드
}

//전체메뉴
function allMenu() {
    const gnb = document.querySelector('.cptGnb');
    if (!gnb) return;
    const quickArea = gnb.querySelector('.quickArea');
    const menuBtn = gnb.querySelector('.menuBtn');
    if (!quickArea || !menuBtn) return;

    const mq = window.matchMedia(GNB_BREAKPOINT);
    const depth1Lists = gnb.querySelectorAll('.gnbBox .depth1Group .depth1List');
    const pcCols = gnb.querySelectorAll('.allMenuBox.pc .inner > ul > li');
    let closeTimer = null;
    let hoverLock = false; // 링크를 누른 직후에는 마우스를 올려도 다시 열지 않음 (헤더 밖으로 나가면 해제)

    // 1depth와 같은 순서의 2depth 열 강조 (-1이면 해제)
    // 메뉴가 닫혀 있을 때는 강조를 붙이지 않음 (개발 반영 2026.11.23)
    function highlight(idx) {
        if (idx >= 0 && !gnb.classList.contains('active')) return;
        depth1Lists.forEach((li, i) => li.classList.toggle('on', i === idx));
        pcCols.forEach((li, i) => li.classList.toggle('on', i === idx));
    }

    function setOpen(open) {
        clearTimeout(closeTimer);
        const allMenuBox = gnb.querySelector(mq.matches ? '.allMenuBox.mo' : '.allMenuBox.pc');

        quickArea.classList.toggle('active', open);
        gnb.classList.toggle('active', open);
        gnb.querySelectorAll('.allMenuBox').forEach(box => box.classList.remove('active'));
        if (allMenuBox) allMenuBox.classList.toggle('active', open);
        document.body.classList.toggle('noScrl', open && mq.matches); // 모바일 메뉴 열림 동안 배경 스크롤 잠금
        if (!open) highlight(-1);

        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? '전체 메뉴 닫기' : '전체 메뉴 열기');
    }

    // 햄버거 클릭
    menuBtn.addEventListener('click', function () {
        setOpen(!quickArea.classList.contains('active'));
    });

    // PC: 1depth 마우스오버/포커스 시 드롭다운 열기
    depth1Lists.forEach((li, i) => {
        const open = () => {
            if (mq.matches || hoverLock) return;
            setOpen(true);
            highlight(i);
        };
        li.addEventListener('mouseenter', open);
        li.addEventListener('focusin', open);
    });
    pcCols.forEach((li, i) => {
        li.addEventListener('mouseenter', () => highlight(i));
        li.addEventListener('focusin', () => highlight(i));
    });

    // PC: 헤더+드롭다운 영역을 벗어나면 닫기
    gnb.addEventListener('mouseleave', () => {
        hoverLock = false;
        if (mq.matches || !gnb.classList.contains('active')) return;
        closeTimer = setTimeout(() => setOpen(false), 200);
    });
    gnb.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    gnb.addEventListener('focusout', (e) => {
        if (!mq.matches && gnb.classList.contains('active') && !gnb.contains(e.relatedTarget)) setOpen(false);
    });

    // ESC로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gnb.classList.contains('active')) {
            setOpen(false);
            menuBtn.focus();
        }
    });

    // 헤더 안의 링크(로고·1depth·2depth·상단 바로가기)를 누르면 닫기 (모바일 아코디언 1depth는 제외)
    // 누른 직후에는 마우스가 메뉴 위에 있어도 다시 열지 않음 (개발 반영 2026.11.23)
    gnb.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            if (a.classList.contains('depth1Name') && a.parentElement.querySelector('.depth2Cov')) return;
            if (!mq.matches) hoverLock = true;
            setOpen(false);
        });
    });

    // 뒤로가기 등으로 페이지가 복원되거나, pc/mo 구간이 바뀌면 닫기
    window.addEventListener('pageshow', (e) => { if (e.persisted) { hoverLock = false; setOpen(false); } });
    mq.addEventListener('change', () => setOpen(false));
}

// 메인슬라이드
function swiperMain(){
    const mainBanner = document.querySelector(".cptMain .swiperContainer");
    if (!mainBanner) return;
    let mainSlide = new Swiper(".cptMain .swiperContainer", {
        slidesPerView: "auto", // 카드 폭은 CSS(380px, 모바일 276px) 기준
        spaceBetween: 20,
        loop: false, // 복제 슬라이드 없이 5개만, 마지막 이후 처음으로 되돌아감

        keyboard: {
            enabled: true
        },

        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },

        pagination: {
            el: ".cptMain .swiper-pagination",
            clickable: true
        },

        breakpoints: {
            // 768px 이상
            768: {
                spaceBetween: 40,
            }
        }
    });

    // 마지막 정지 위치까지 남은 거리가 카드 반 장보다 짧으면 바로 앞 정지 위치를 제거
    // (넓은 화면에서 마지막 점이 몇 px만 움직이는 현상 방지 → 1920px에서는 점 2개)
    function trimSnapGrid() {
        const grid = mainSlide.snapGrid;
        const firstSlide = mainSlide.slides[0];
        if (!firstSlide || grid.length < 3) return;
        const step = firstSlide.offsetWidth + mainSlide.params.spaceBetween;
        if (grid[grid.length - 1] - grid[grid.length - 2] < step / 2) {
            grid.splice(grid.length - 2, 1);
            mainSlide.updateActiveIndex();
            mainSlide.pagination.render();
            mainSlide.pagination.update();
        }
    }
    trimSnapGrid();
    mainSlide.on('resize', trimSnapGrid);

    // 자동재생 일시정지: 마우스를 올리거나 키보드 포커스가 카드 줄에 있는 동안 정지 (WCAG 2.2.2)
    // 감지 영역은 카드 줄(swiper-wrapper)만 — .mainBnArea는 화면 전체 높이라 어디에 마우스가 있어도 멈추던 문제 (개발 반영 2026.11.23)
    // 움직임 줄이기(prefers-reduced-motion) 설정과 관계없이 자동재생 유지 (클라이언트 결정 2026.11.23)
    const hoverArea = mainBanner.querySelector('.swiper-wrapper') || mainBanner;
    const stop = () => mainSlide.autoplay.stop();
    const start = () => mainSlide.autoplay.start();
    hoverArea.addEventListener('mouseenter', stop);
    hoverArea.addEventListener('mouseleave', start);
    hoverArea.addEventListener('focusin', stop);
    hoverArea.addEventListener('focusout', (e) => { if (!hoverArea.contains(e.relatedTarget)) start(); });

    // 카드 전체에 손가락 커서가 표시되므로 카드 아무 곳이나 눌러도 '자세히 보기'로 이동
    mainBanner.querySelectorAll('.bnItem').forEach(card => {
        const more = card.querySelector('.more');
        if (!more) return;
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return; // 링크 자체 클릭은 기본 동작
            if (window.getSelection && String(window.getSelection())) return; // 텍스트 드래그 선택 중이면 이동 안 함
            if (mainSlide.animating) return;
            more.click();
        });
    });
}

//상단 고정 탭 메뉴
function fixedTap(){
    const modSticky = document.querySelector('.modSticky');
    if (!modSticky) return;

    const tabItems = modSticky.querySelectorAll('.tabGroup .tabItem');
    const stickyConts = modSticky.querySelectorAll('.stickyCont');
    const OFFSET = 300; // 헤더 등 상단 여유값, 필요시 조정

    let ticking = false;
    function requestScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            onScroll();
            ticking = false;
        });
    }

    function onScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        let currentIdx = 0;

        stickyConts.forEach((cont, i) => {
            const contTop = cont.getBoundingClientRect().top + window.scrollY - OFFSET;
            if (scrollY >= contTop) {
                currentIdx = i;
            }
        });

        tabItems.forEach((tab, i) => {
            if (i === currentIdx) {
                tab.classList.add('on');
                tab.querySelector('.btnTab').setAttribute('title', '선택됨');
            } else {
                tab.classList.remove('on');
                tab.querySelector('.btnTab').removeAttribute('title');
            }
        });
    }

    window.addEventListener('scroll', requestScroll, { passive: true });
    onScroll(); // 초기화

    // 탭 클릭 시 해당 컨텐츠로 스크롤 이동
    tabItems.forEach((tab, idx) => {
        const btn = tab.querySelector('.btnTab');
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const targetCont = stickyConts[idx];
            if (targetCont) {
                const targetTop = targetCont.getBoundingClientRect().top + window.scrollY - 80; // 상단 여유값
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
            }
        });
    });
}


// ------------------------------- 파일찾기 함수 ------------------------------- //
function searchFile(){
    //파일찾기
    const uploadFiles = document.querySelectorAll(".fileBox .uploadBtn");
    uploadFiles.forEach(function(uploadFile,idx){
        uploadFile.addEventListener("change",function(event){
            const fileBox = parentsElementFind(this, "fileBox");
            if (!fileBox || !this.files || !this.files.length) return; // 파일 선택 취소
            const fileName = this.files[0].name;
            fileBox.querySelector(".textBox").innerText = fileName;
            fileBox.classList.add("on");
        });
    });
    //파일찾기 취소
    const delFiles = document.querySelectorAll(".fileBox .fileDel");
    delFiles.forEach(function(delFile,idx){
        delFile.addEventListener("click",function(event){
            const fileBox = parentsElementFind(this, "fileBox");
            if (!fileBox) return;
            fileBox.querySelector(".uploadBtn").value = "";
            fileBox.querySelector(".textBox").innerText = "";
            fileBox.classList.remove("on");
        });
    });
}

// ------------------------------- 팝업 함수 ------------------------------- //
//팝업 열기
function openPopup($popName){
    document.querySelector("#"+$popName).classList.add("on");
}
//팝업 닫기
function closePopup($popName){
    document.querySelector("#"+$popName).classList.remove("on");
}

//알럿
function openAlert($altName){
    document.querySelector("#"+$altName).classList.add("on");
}
function closeAlert($altName){
    document.querySelector("#"+$altName).classList.remove("on");
}

// ------------------------------- 탭메뉴 함수 ------------------------------- //
//모드 탭 함수
function tabMenuInit(){
    //모드탭의 수
    const modTabs = document.querySelectorAll(".modTab");
    modTabs.forEach(function(modTab,tabIdx,elements){
        const tabmenus = modTab.querySelectorAll(".tabName");
        const tabConts = modTab.querySelectorAll(".tabCont");

        //모드탭 내의 메뉴 수
        tabmenus.forEach(function(tabmenu,menuIdx,inElements){
            tabmenu.addEventListener("click", function(event){
                inElements.forEach(function(inElement){
                    inElement.classList.remove("on");
                    inElement.setAttribute("title", "탭메뉴");
                });
                this.classList.add("on");
                this.setAttribute("title", "선택 된 탭메뉴");
                tabConts.forEach(function(tabCont,contIdx){
                    tabCont.classList.remove("on");
                    if(menuIdx == contIdx){
                        tabCont.classList.add("on");
                    }
                })
            });
        });
    });
}


// ------------------------------- 아코디언 함수 ------------------------------- //
//모드 아코디언 함수
function accordionInit(){
    const modAccos = document.querySelectorAll(".modAccordion");
    modAccos.forEach(function(modAcco,modIdx){
        const accoItems = modAcco.querySelectorAll(".accoArea");
        accoItems.forEach(function(accoItem,itemIdx,elements){
            const accoBtn = accoItem.querySelector(".accoTitle");
            const accoCont = accoItem.querySelector(".accoBody");
            accoBtn.addEventListener("click",function(){
                if(this.classList.contains("on")){
                    this.classList.remove("on");
                    slideUp(accoCont,300);
                    return;
                }
                this.classList.add("on");
                slideDown(accoCont,300);
            });
        });
    });
}


// ------------------------------- 아코디언 리스트 함수 ------------------------------- //
//모드 아코디언 리스트 함수
function accordionListInit(){
    const modAccos = document.querySelectorAll(".modAccordionList");
    modAccos.forEach(function(modAcco,modIdx){
        const accoItems = modAcco.querySelectorAll(".accoArea");
        accoItems.forEach(function(accoItem,itemIdx,elements){
            const accoBtn = accoItem.querySelector(".accoTitle");
            const accoCont = accoItem.querySelector(".accoBody");

            accoBtn.addEventListener("click",function(){
                elements.forEach(function(element, eleIdx){
                    if(element.classList.contains("on")){
                        element.classList.remove("on");
                        slideUp(element.querySelector(".accoBody"),300);
                    }else if(itemIdx == eleIdx){
                        element.classList.add("on");
                        slideDown(element.querySelector(".accoBody"),300);
                    }
                });
            });
        });
    });
}

// ------------------------------- input text reset 함수 ------------------------------- //
function inputTextReset(){
    let btnResets = document.querySelectorAll('.btnReset');
    btnResets.forEach(function(btn){
        btn.addEventListener('click', function(){
            btn.parentNode.querySelector('.iptText').value = "";
        });
    });
}

// ------------------------------- 모션 함수 ------------------------------- //

//fade in
function fadeIn(element, duration){
    let opacity = 0;
    element.style.display = "block";
    element.style.opacity = opacity;
    let action = setInterval(function(){
        opacity += 10/duration;
        element.style.opacity = opacity;
        if(opacity >= 1){
            clearInterval(action);
        }
    }, 10);
}

//fade out
function fadeOut(element, duration){
    let opacity = 1;
    element.style.opacity = opacity;
    let action = setInterval(function(){
        opacity -= 10/duration;
        element.style.opacity = opacity;
        if(opacity <= 0){
            clearInterval(action);
            element.style.display = "none";
        }
    }, 10);
}

//fade toggle
function fadeToggle(element, duration){
    element.style.display == "block" ? fadeOut(element, duration) : fadeIn(element, duration);
}

//slide function (slideUp)
function slideUp(element, duration) {
    let height = element.scrollHeight;
    let interval = 10; // millidurationonds per frame
    let steps = Math.ceil(duration / interval);
    let stepHeight = height / steps;
    let currentStep = 0;

    let slideUpInterval = setInterval(function() {
        currentStep++;
        element.style.height = (height - stepHeight * currentStep) + "px";
        if (currentStep >= steps) {
            clearInterval(slideUpInterval);
            element.style.display = "none";
            element.style.height = ""; // 높이를 초기화하여 다시 제대로 작동하도록 합니다.
        }
    }, interval);
}

//slide function (slideDown)
function slideDown(element, duration) {
    element.style.display = "block";
    element.style.height = "0px"; // 이 부분을 수정하여 초기 높이를 0으로 설정합니다.
    let height = element.scrollHeight;
    let interval = 10; // millidurationonds per frame
    let steps = Math.ceil(duration / interval);
    let stepHeight = height / steps;
    let currentStep = 0;

    let slideDownInterval = setInterval(function() {
        currentStep++;
        element.style.height = (stepHeight * currentStep) + "px";
        if (currentStep >= steps) {
            clearInterval(slideDownInterval);
            element.style.height = ""; // 높이를 초기화하여 다시 제대로 작동하도록 합니다.
        }
    }, interval);
}

// ------------------------------- 기타 함수 ------------------------------- //
//parents 엘리먼트 찾기
function parentsElementFind(my, findElement){
    return my.parentElement ? my.parentElement.closest('.' + findElement) : null;
}

// ------------------------------- datePicker ------------------------------- //
//날짜
function datePicker(startIpt, startCont){
    let datepicker = new tui.DatePicker('#'+startCont, {
        date: new Date(),
        input: {
            element: '#'+ startIpt,
            format: 'yyyy-MM-dd'
        }
    });
}
//날짜 + 시간
function timePicker(startIpt, startCont){
    let datepicker = new tui.DatePicker('#'+startCont, {
        date: new Date(),
        input: {
            element: '#'+ startIpt,
            format: 'yyyy-MM-dd HH:mm A'
        },
        timePicker: true
    });
}
//datePicker("datepicker-input","wrapper");

//날짜 기간~기간
function datePickerTo(startIpt, startCont, endIpt, endCont){
    let today = new Date();
    let picker = tui.DatePicker.createRangePicker({
        startpicker: {
            date: today,
            input: '#'+ startIpt,
            container: '#'+ startCont
        },
        endpicker: {
            date: today,
            input: '#'+ endIpt,
            container: '#'+ endCont
        },
        selectableRanges: [
            [today, new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())]
        ],
        format: 'YYYY-MM-dd'
    });

    picker.on('change:end', () => {
        //console.log(123);
    })
}
//날짜 기간+시간 ~ 기간+시간
function timePickerTo(startIpt, startCont, endIpt, endCont){
    let today = new Date();
    let picker = tui.DatePicker.createRangePicker({
        startpicker: {
            date: today,
            input: '#'+ startIpt,
            container: '#'+ startCont
        },
        endpicker: {
            date: today,
            input: '#'+ endIpt,
            container: '#'+ endCont
        },
        selectableRanges: [
            [today, new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())]
        ],
        format: 'YYYY-MM-dd HH:mm',
        timePicker: true
    });

    picker.on('change:end', () => {
        //console.log(123);
    })
}

//datePickerTo("startpicker-input", "startpicker-container", "endpicker-input", "endpicker-container");


/* contact_us.html input의 css */
function contactInput(){
    const inputs = document.querySelectorAll('.infoItem .item input');
    function checkValue(e) {
        if (e.target.value.trim() !== '') {
            e.target.classList.add('add');
        } else {
            e.target.classList.remove('add');
        }
    }
    inputs.forEach(input => {
        input.addEventListener('input', checkValue);
        if (input.value.trim() !== '') {
            input.classList.add('add');
        }
    });
}

/* contact_us.html 필수값 검사 */
function contactForm(){
    const form = document.getElementById('contactForm');
    if (!form) return;
    const submitBtn = form.querySelector('.btnSubmit');
    const fields = form.querySelectorAll('[required]');

    // 공백만 입력한 경우도 미입력으로 처리
    function checkBlank(field) {
        if (field.type === 'checkbox') return;
        field.setCustomValidity(field.value.trim() === '' && field.value !== '' ? (field.dataset.err || ' ') : '');
    }

    // 필드 오류 표시 (한 번 입력/이탈한 필드만)
    function showError(field) {
        const msg = document.getElementById(field.getAttribute('aria-describedby'));
        const invalid = !field.validity.valid;
        field.setAttribute('aria-invalid', String(invalid));
        const wrap = field.closest('.item') || field.closest('.chkBox');
        if (wrap) wrap.classList.toggle('error', invalid);
        if (msg) msg.textContent = invalid ? (field.dataset.err || '') : '';
    }

    function update() {
        fields.forEach(checkBlank);
        const valid = form.checkValidity();
        submitBtn.classList.toggle('isDisabled', !valid);
        submitBtn.setAttribute('aria-disabled', String(!valid));
    }

    fields.forEach(field => {
        field.addEventListener('blur', () => { field.dataset.touched = 'y'; checkBlank(field); showError(field); });
        field.addEventListener(field.type === 'checkbox' ? 'change' : 'input', () => {
            if (field.dataset.touched || field.type === 'checkbox') { checkBlank(field); showError(field); }
        });
    });

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', function (e) {
        update();
        if (!form.checkValidity()) {
            e.preventDefault();
            fields.forEach(field => { field.dataset.touched = 'y'; showError(field); });
            const first = form.querySelector(':invalid');
            if (first) first.focus();
            return;
        }
        // 실제 전송 처리는 개발 연동 시 구현 — action 미지정 상태에서는 전송하지 않음(현재 페이지로 개인정보가 전송되는 것 방지)
        if (!form.getAttribute('action')) e.preventDefault();
    });
    update();
}

//20260805 추가
// ai-service slide
function serviceSlider(){
    const slider = document.querySelector('.si_slide .swiper-container');
    if (!slider) return;
    const section = slider.closest('.section06') || document;
    new Swiper(slider, {
        slidesPerView: "auto",
        //loop:true,

        navigation: {
            prevEl: section.querySelector('.prev'),
            nextEl: section.querySelector('.next'),
        },
    });
}

//tab menu for mobile
function comTabMobile(){
    const comTabs = document.querySelectorAll('.comTab.mo');
    if (!comTabs.length) return;

    comTabs.forEach(tab => {
        const button = tab.querySelector('.current');
        if (!button) return;

        // 드롭다운 열기/닫기
        button.addEventListener('click', (e) => {
            e.stopPropagation();

            // 다른 메뉴 닫기
            comTabs.forEach(otherTab => {
                if (otherTab !== tab) {
                    otherTab.classList.remove('open');
                    const otherBtn = otherTab.querySelector('.current');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            const isOpen = tab.classList.toggle('open');
            button.setAttribute('aria-expanded', String(isOpen));
        });
    });

    function closeAll() {
        comTabs.forEach(tab => {
            tab.classList.remove('open');
            const button = tab.querySelector('.current');
            if (button) button.setAttribute('aria-expanded', 'false');
        });
    }

    // 바깥 클릭 시 닫기
    document.addEventListener('click', closeAll);

    // ESC로 닫고 버튼으로 포커스 복귀, 키보드 포커스가 탭 밖으로 나가면 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const opened = document.querySelector('.comTab.mo.open');
        if (!opened) return;
        closeAll();
        const btn = opened.querySelector('.current');
        if (btn) btn.focus();
    });
    comTabs.forEach(tab => {
        tab.addEventListener('focusout', (e) => {
            if (tab.classList.contains('open') && !tab.contains(e.relatedTarget)) closeAll();
        });
    });
}

//레퍼런스 아코디언
function refAccordion(){
    const items = document.querySelectorAll(".refList > ul > li");

    items.forEach((item, idx) => {
        const button = item.querySelector("button");
        if (!button) return;

        // 버튼 ↔ 펼쳐지는 내용 연결 (스크린리더)
        const panel = item.querySelector(".listInfo");
        if (panel) {
            if (!panel.id) panel.id = "refPanel" + (idx + 1);
            button.setAttribute("aria-controls", panel.id);
        }

        button.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // 모두 닫기
            items.forEach((el) => {
                el.classList.remove("active");
                const btn = el.querySelector("button");
                if (btn) btn.setAttribute("aria-expanded", "false");
            });

            // 클릭한 항목이 닫혀있었다면 열기
            if (!isActive) {
                item.classList.add("active");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });
}

//협력사 로고 롤링
function logoRolling(){
    const slider = document.querySelector(".rolling");
    if (!slider) return;
    const list = slider.querySelector("ul");
    if (!list) return;

    // 무한 롤링용 복제본은 스크린리더에서 제외
    [...list.children].forEach(li => {
        const clone = li.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        list.appendChild(clone);
    });

    // 움직임 줄이기 설정과 관계없이 롤링 유지 (클라이언트 결정 2026.11.23)
    let x = 0;
    const speed = 0.5; // 숫자가 작을수록 느림
    let pause = false;

    slider.addEventListener("mouseenter", () => {
        pause = true;
    });

    slider.addEventListener("mouseleave", () => {
        pause = false;
    });

    function animate() {
        if (!pause) {
            x += speed;

            // 원본 리스트 길이만큼 이동하면 처음으로
            if (x >= list.scrollWidth / 2) {
                x = 0;
            }

            list.style.transform = `translateX(-${x}px)`;
        }

        requestAnimationFrame(animate);
    }

    animate();
}

//퀵 상단이동
function quickTop(){
    const quickTopBtn = document.getElementById("quickTop");
    if (!quickTopBtn) return;

    // 스크롤 위치 감지
    function toggle() {
        quickTopBtn.classList.toggle("show", window.scrollY > 300);
    }
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    // 클릭 시 상단 이동
    quickTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

//퀵 버튼이 탭 메뉴(PC 탭, 모바일 탭·펼친 목록, 고정 탭)와 겹치는 동안 숨김 (개발 반영 2026.11.23)
function quickOverlap(){
    const quick = document.querySelector('.quick');
    const tabs = document.querySelectorAll('.comTab, .modSticky .stickyHead');
    if (!quick || !tabs.length) return;

    let ticking = false;
    function check() {
        ticking = false;
        // 실제로 보이는 버튼만 기준 (상단이동 버튼은 스크롤 전에는 투명)
        const btns = [...quick.querySelectorAll('a')].filter(a => getComputedStyle(a).visibility !== 'hidden').map(a => a.getBoundingClientRect());
        const hit = [...tabs].some(tab => {
            // 탭 자체 + 펼쳐진 모바일 목록까지 포함
            return [tab, ...tab.querySelectorAll(':scope > ul')].some(el => {
                if (!el.offsetParent) return false; // 숨겨진 요소 제외
                const r = el.getBoundingClientRect();
                return r.width && r.height && btns.some(q => r.left < q.right && r.right > q.left && r.top < q.bottom && r.bottom > q.top);
            });
        });
        quick.classList.toggle('isHidden', hit);
        quick.inert = hit; // 숨긴 동안 키보드 포커스도 막음
    }
    function request() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(check);
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    document.addEventListener('click', request); // 모바일 탭 목록 열고 닫을 때
    check();
}

function mobileMenu() {
    const depth1Items = document.querySelectorAll('.allMenuBox.mo .depth1List');

    depth1Items.forEach(item => {
        const link = item.querySelector('.depth1Name');
        const depth2 = item.querySelector('.depth2Cov');

        // 하위 메뉴가 없으면 아무 처리 안 함(링크 이동)
        if (!depth2) return;

        link.setAttribute('aria-expanded', 'false');

        link.addEventListener('click', function (e) {
            e.preventDefault();

            const isActive = item.classList.contains('active');

            // 다른 메뉴 닫기 (아코디언 방식)
            depth1Items.forEach(el => {
                el.classList.remove('active');

                const sub = el.querySelector('.depth2Cov');
                if (sub) {
                    sub.style.maxHeight = null;
                    el.querySelector('.depth1Name').setAttribute('aria-expanded', 'false');
                }
            });

            // 현재 메뉴 열기/닫기
            if (!isActive) {
                item.classList.add('active');
                depth2.style.maxHeight = depth2.scrollHeight + 'px';
                link.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

//회사소개서 다운로드
function fileDownload() {
    const link = document.createElement('a');
    link.href = COMMON_BASE + 'file/OPENBRICKS.pdf'; // PDF 경로
    link.download = 'OPENBRICKS_회사소개서.pdf';    // 다운로드될 파일명
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
