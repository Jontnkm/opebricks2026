document.addEventListener("DOMContentLoaded", function () {
    allMenu(); //전체메뉴
    //swiperMain() // 메인슬라이드
    fixedTap(); //상단 고정 탭 메뉴
    //introView(); //메인 - 인트로부터 시작
    //introSkip(); //메인 - 인트로 생략
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
    const quickArea = document.querySelector('.quickArea');
    const menuBtn = quickArea.querySelector('.menuBtn');
    const gnb = document.querySelector('.cptGnb');

    menuBtn.addEventListener('click', function () {

        const allMenuBox = window.matchMedia('(max-width: 768px)').matches
            ? document.querySelector('.allMenuBox.mo')
            : document.querySelector('.allMenuBox.pc');

        quickArea.classList.toggle('active');
        gnb.classList.toggle('active');
        allMenuBox.classList.toggle('active');
    });
}

// 메인슬라이드
function swiperMain(){
    const mainBanner = document.querySelector(".cptMain .swiperContainer");
    if (!mainBanner) return;
    let mainSlide = new Swiper(".cptMain .swiperContainer", {
        slidesPerView: 1.5,

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
                slidesPerView: 4,
            },

            // 1200px 이상
            1200: {
                slidesPerView: 4,
            }
        }
    });
}

//상단 고정 탭 메뉴
function fixedTap(){
    const modSticky = document.querySelector('.modSticky');
    if (!modSticky) return;

    const tabItems = modSticky.querySelectorAll('.tabGroup .tabItem');
    const stickyConts = modSticky.querySelectorAll('.stickyCont');
    const OFFSET = 300; // 헤더 등 상단 여유값, 필요시 조정

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

    window.addEventListener('scroll', onScroll);
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
            let fileName;
            if(window.FileReader){
                fileName = this.files[0].name;
                //console.log(fileName);
            } else {
                //console.log("noFileReader");
                //var filename = $(this).val().split('/').pop().split('\\').pop();
                //var filename = this.val().split('/').pop().split('\\').pop();
            }
            fileBox.querySelector(".textBox").innerText = fileName;
            fileBox.classList.add("on");
        });
    });
    //파일찾기 취소
    const delFiles = document.querySelectorAll(".fileBox .fileDel");
    delFiles.forEach(function(delFile,idx){
        delFile.addEventListener("click",function(event){
            const fileBox = parentsElementFind(this, "fileBox");
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
    let parentElement = my.parentNode;
    for(let i = 0;i<=20;++i){
        if(!parentElement.classList.contains(findElement)){
            parentElement = my.parentNode.parentNode;
        }else{
            return parentElement;
        }
    }
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
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.infoItem .item input[type="text"]');
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

    //20260805 추가
    // ai-service slide
    let serviceSlide = new Swiper(".si_slide .swiper-container", {
        slidesPerView: "auto",
        //loop:true,
        
        navigation: {
            prevEl: ".section06 .prev",
            nextEl: ".section06 .next",
        },
    });

    //tab menu for mobile
    const comTabs = document.querySelectorAll('.comTab.mo');

    comTabs.forEach(tab => {
        const button = tab.querySelector('.current');
        const menuItems = tab.querySelectorAll('ul li a');

        // 드롭다운 열기/닫기
        button.addEventListener('click', (e) => {
            e.stopPropagation();

            // 다른 메뉴 닫기
            comTabs.forEach(otherTab => {
                if (otherTab !== tab) {
                    otherTab.classList.remove('open');
                }
            });

            tab.classList.toggle('open');
        });


        // 메뉴 선택
        menuItems.forEach(item => {
            item.addEventListener('click', () => {

                // 버튼 텍스트 변경
                button.childNodes[0].textContent = item.textContent;

                // active 변경
                menuItems.forEach(menu => {
                    menu.classList.remove('active');
                });

                item.classList.add('active');

                // 닫기
                tab.classList.remove('open');
            });
        });
    });


    // 바깥 클릭 시 닫기
    document.addEventListener('click', () => {
        comTabs.forEach(tab => {
            tab.classList.remove('open');
        });
    });

    //레퍼런스 아코디언
    const items = document.querySelectorAll(".refList > ul > li");

    items.forEach((item) => {
        const button = item.querySelector("button");

        button.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // 모두 닫기
            items.forEach((el) => {
                el.classList.remove("active");
            });

            // 클릭한 항목이 닫혀있었다면 열기
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });


    //협력사 로고 롤링
    const slider = document.querySelector(".rolling");
    if(slider) {
        const list = slider.querySelector("ul");
    
        list.innerHTML += list.innerHTML;

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
    const quickTop = document.getElementById("quickTop");

    // 스크롤 위치 감지
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            quickTop.classList.add("show");
        } else {
            quickTop.classList.remove("show");
        }
        });

        // 클릭 시 상단 이동
        quickTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    //gnb 컨트롤
    // const depth1Lists = document.querySelectorAll('.depth1Group .depth1List');
    // const depth2Uls = document.querySelectorAll('.depth02');

    // depth2Uls.forEach((ul, index) => {
    //     const parentLi = ul.closest('li');

    //     ul.addEventListener('mouseenter', () => {
    //         // depth02 부모 li
    //         parentLi.classList.add('on');

    //         // 대응되는 depth1List
    //         if (depth1Lists[index]) {
    //             depth1Lists[index].classList.add('on');
    //         }
    //     });

    //     ul.addEventListener('mouseleave', () => {
    //         parentLi.classList.remove('on');

    //         if (depth1Lists[index]) {
    //             depth1Lists[index].classList.remove('on');
    //         }
    //     });
    // });

    const depth1Lists = document.querySelectorAll('.depth1Group .depth1List');
    const depth2Uls = document.querySelectorAll('.allMenuBox .depth02');

    // depth2 -> depth1 매핑
    const map = [0, 1, 4];

    depth2Uls.forEach((ul, i) => {
        const parentLi = ul.closest('li');

        ul.addEventListener('mouseenter', () => {
            parentLi.classList.add('on');
            depth1Lists[map[i]].classList.add('on');
        });

        ul.addEventListener('mouseleave', () => {
            parentLi.classList.remove('on');
            depth1Lists[map[i]].classList.remove('on');
        });
    });

    function mobileMenu() {
        const depth1Items = document.querySelectorAll('.allMenuBox.mo .depth1List');

        depth1Items.forEach(item => {
            const link = item.querySelector('.depth1Name');
            const depth2 = item.querySelector('.depth2Cov');

            // 하위 메뉴가 없으면 아무 처리 안 함(링크 이동)
            if (!depth2) return;

            link.addEventListener('click', function (e) {
                e.preventDefault();

                const isActive = item.classList.contains('active');

                // 다른 메뉴 닫기 (아코디언 방식)
                depth1Items.forEach(el => {
                    el.classList.remove('active');

                    const sub = el.querySelector('.depth2Cov');
                    if (sub) {
                        sub.style.maxHeight = null;
                    }
                });

                // 현재 메뉴 열기/닫기
                if (!isActive) {
                    item.classList.add('active');
                    depth2.style.maxHeight = depth2.scrollHeight + 'px';
                }
            });
        });
    }

    mobileMenu();
});

//회사소개서 다운로드
function fileDownload() {
    const link = document.createElement('a');
    link.href = '/common/file/OPENBRICS.pdf'; // PDF 경로
    link.download = 'OPENBRICS_회사소개서.pdf';    // 다운로드될 파일명
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

