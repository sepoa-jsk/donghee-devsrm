# 01. 개발 프로젝트 모듈 HTML 목업 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 개발 프로젝트 모듈의 미작업 3개 화면(01-01 고객 RFQ 목록, 01-03 개발 프로젝트 목록, 01-05 프로젝트 일정/마일스톤)을 완성하고 index.html / PROGRESS.md를 갱신한다.

**Architecture:** 검증 패턴 재사용 — 01-01·01-03 목록은 06-01(search-bar+grid), 01-05는 01-04 간트(g-bar done/active/plan) 패턴 계승 + delay 추가 + 작업 상세 컬럼. 디렉토리 `mockups/01_project/`는 이미 존재.

**Tech Stack:** Standalone HTML, tokens.css, lucide CDN, vanilla JS. st 상태점, prog-bar 진척막대, gantt 패턴 재사용.

---

## 파일 구조

| 작업 | 경로 | 유형 |
|------|------|------|
| Create | `mockups/01_project/01-01_rfq_list.html` | 목록 |
| Create | `mockups/01_project/01-03_project_list.html` | 목록 |
| Create | `mockups/01_project/01-05_milestone.html` | 간트 |
| Modify | `mockups/index.html` (01 섹션 링크) |
| Modify | `docs/PROGRESS.md` (46 → 49) |

sidebar.js는 01-01/01-03/01-05 href가 이미 일치 — 변경 불필요.

---

## 공통 재사용 컴포넌트

### 상태 점 (st)
```css
.st { display:inline-flex; align-items:center; gap:5px; font-size:12px; white-space:nowrap; }
.st::before { content:''; width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.st-ok   { color:var(--status-ok);  } .st-ok::before   { background:var(--status-ok); }
.st-prog { color:var(--status-prog);} .st-prog::before { background:var(--status-prog); }
.st-wait { color:var(--text-mute);  } .st-wait::before { background:var(--border-strong); }
.st-warn { color:var(--status-warn);} .st-warn::before { background:var(--status-warn); }
.st-bad  { color:var(--status-bad); } .st-bad::before  { background:var(--status-bad); }
.td-link { color:var(--blue); font-weight:600; text-decoration:none; }
.td-link:hover { text-decoration:underline; }
```

### 진척 막대 (prog-bar) — 01-03, 01-05
```css
.prog-cell { display:flex; align-items:center; gap:8px; }
.prog-bar { flex:1; height:6px; background:var(--grid-head); border-radius:3px; overflow:hidden; min-width:60px; }
.prog-fill { height:100%; background:var(--blue); border-radius:3px; }
.prog-pct { font-size:11px; color:var(--text-sub); font-variant-numeric:tabular-nums; width:34px; text-align:right; }
```

### 토스트 (01-05)
```css
.toast { position:fixed; bottom:24px; right:24px; color:#fff; padding:10px 16px; border-radius:4px; font-size:13px; z-index:500; display:flex; align-items:center; gap:8px; box-shadow:0 4px 16px rgba(0,0,0,.18); }
```
```javascript
function showToast(msg, type, ms) {
  var bg = type === 'ok' ? '#16a34a' : type === 'bad' ? '#dc2626' : '#1f2937';
  var el = document.createElement('div'); el.className='toast'; el.style.background=bg;
  el.innerHTML = '<i data-lucide="'+(type==='bad'?'alert-circle':'check-circle')+'" style="width:14px;height:14px;flex-shrink:0"></i><span>'+msg+'</span>';
  document.body.appendChild(el);
  if (window.lucide) window.lucide.createIcons({ nodes:[el] });
  setTimeout(function(){ el.style.opacity='0'; el.style.transition='opacity .2s'; setTimeout(function(){ el.remove(); },220); }, ms||2400);
}
```

### 푸터 (모든 화면)
```html
<script src="../common/sidebar.js"></script>
<script>lucide.createIcons();</script>
```

### 절대 금지
이모지, Excel 버튼, 리셋 버튼. 버튼 32px.

---

## Task 1: 01-01 고객 RFQ 목록

**Files:** Create `mockups/01_project/01-01_rfq_list.html`

목록형. 06-01 패턴.

- [ ] **Step 1: 파일 작성**

참조: `mockups/06_price/06-01_price_list.html`을 Read하여 search-bar+filter-panel+status-strip+grid-area+data-table+applyFilter/renderRows/updateCounts/setStatus/toggleFilter/toggleStatusPanel 구조를 그대로 따른다.

구조:
- `<body data-menu="01-01">`
- page-title-bar: "고객 RFQ 목록" + 우측 [RFQ 등록] btn-primary → `location.href='01-02_rfq_register.html'`
- search-bar: search input(oninput=applyFilter) + 필터 버튼 + 상태 버튼 + date-range(2026-01-01~2026-12-31, 등록일)
- filter-panel:
  - 고객사 select(id=f-customer): 전체/현대자동차/기아/현대모비스
  - 차종 select(id=f-car): 전체/520 PHEV/NX5/MQ4
  - 상태 select(id=f-status): 전체/RFQ등록/프로젝트전환대기/검토요청/프로젝트생성완료
- status-strip: 전체/RFQ등록/프로젝트전환대기/검토요청/프로젝트생성완료 + ss-cnt (ids: cnt-all, cnt-reg, cnt-wait, cnt-review, cnt-done)
- grid-area > table-fill > data-table 컬럼:
  체크박스(40) / RFQ번호(130, td-link→01-02) / 고객사(100) / 차종(90) / 품목 / 고객목표가(r,100) / 연간수량(r,90) / SOP(100) / 등록일(100) / 상태(c,130)
- 행 클릭 → 01-02_rfq_register.html (체크박스 셀 event.stopPropagation)
- 상태 점: ST_CLS = { '프로젝트생성완료':'st-ok', '프로젝트전환대기':'st-prog', '검토요청':'st-warn', 'RFQ등록':'st-wait' }
- 고객목표가/연간수량 우정렬 toLocaleString

DATA:
```javascript
const DATA = [
  { rfq:'CRFQ-2026-0007', cust:'현대자동차', car:'520 PHEV', item:'Fuel Tank Module',    target:16000, qty:100000, sop:'2026-10-01', reg:'2026-01-05', st:'프로젝트생성완료' },
  { rfq:'CRFQ-2026-0012', cust:'기아',       car:'NX5',      item:'Cooling Module',      target:22000, qty:80000,  sop:'2026-12-01', reg:'2026-02-10', st:'검토요청' },
  { rfq:'CRFQ-2026-0015', cust:'현대모비스', car:'MQ4',      item:'Bracket Assy',        target:9500,  qty:150000, sop:'2027-01-15', reg:'2026-03-02', st:'프로젝트전환대기' },
  { rfq:'CRFQ-2026-0019', cust:'현대자동차', car:'520 PHEV', item:'Reinforcement Panel', target:7200,  qty:100000, sop:'2026-11-01', reg:'2026-03-20', st:'RFQ등록' },
  { rfq:'CRFQ-2026-0023', cust:'기아',       car:'NX5',      item:'Heat Protector',      target:4800,  qty:80000,  sop:'2026-12-01', reg:'2026-04-08', st:'RFQ등록' },
];
```
- applyFilter: currentSt, search(rfq/cust/item), date(reg), f-customer, f-car, f-status.
- updateCounts: cnt-all + 상태별(RFQ등록→cnt-reg, 프로젝트전환대기→cnt-wait, 검토요청→cnt-review, 프로젝트생성완료→cnt-done).

- [ ] **Step 2: 브라우저 확인** — 현대 520 PHEV Fuel Tank Module 첫 행, 16,000원, 프로젝트생성완료. 필터·상태스트립 동작. 행 클릭→01-02.

---

## Task 2: 01-03 개발 프로젝트 목록

**Files:** Create `mockups/01_project/01-03_project_list.html`

목록형 + 진척 막대.

- [ ] **Step 1: 파일 작성**

참조: 06-01 패턴(위와 동일). 추가로 진척 막대 prog-bar.

구조:
- `<body data-menu="01-03">`
- page-title-bar: "개발 프로젝트 목록" + 우측 [신규 프로젝트] btn-primary → `location.href='01-02_rfq_register.html'`
- search-bar: search input + 필터 버튼 + 상태 버튼 (날짜 범위 없음 — 프로젝트는 상시)
- filter-panel:
  - 고객사 select(id=f-customer): 전체/현대자동차/기아/현대모비스
  - 단계 select(id=f-stage): 전체/기획/설계/원가산출/개발구매/품질·양산준비/양산전환
  - PM select(id=f-pm): 전체/김개발/이프로/박PM
- status-strip: 전체/진행중/지연/완료/보류 + ss-cnt (ids: cnt-all, cnt-prog, cnt-delay, cnt-done, cnt-hold)
- grid-area > table-fill > data-table 컬럼:
  체크박스(40) / 프로젝트코드(170, td-link→01-04) / 프로젝트명(170) / 고객사·차종(130) / 대표품번(110) / 현재단계(110) / 진척률(160) / PM(70) / SOP(100) / 상태(c,90)
- 진척률 셀: `<div class="prog-cell"><div class="prog-bar"><div class="prog-fill" style="width:45%"></div></div><span class="prog-pct">45%</span></div>`
- 행 클릭 → 01-04_project_detail.html
- 상태 점: ST_CLS = { '진행중':'st-prog', '지연':'st-bad', '완료':'st-ok', '보류':'st-wait' }

DATA:
```javascript
const DATA = [
  { code:'PJT-520PHEV-FT-2026', name:'Fuel Tank Module 개발', cust:'현대 520 PHEV', part:'H1110-T100', stage:'개발구매',      prog:45,  pm:'김개발', sop:'2026-10-01', st:'진행중' },
  { code:'PJT-NX5-CM-2026',     name:'Cooling Module 개발',   cust:'기아 NX5',      part:'K2200-C100', stage:'원가산출',      prog:22,  pm:'이프로', sop:'2026-12-01', st:'진행중' },
  { code:'PJT-MQ4-BR-2026',     name:'Bracket Assy 개발',     cust:'모비스 MQ4',    part:'M3300-B100', stage:'설계',          prog:12,  pm:'박PM',   sop:'2027-01-15', st:'진행중' },
  { code:'PJT-520PHEV-RP-2026', name:'Reinforcement 개발',    cust:'현대 520 PHEV', part:'H1120-R100', stage:'품질·양산준비', prog:78,  pm:'김개발', sop:'2026-09-01', st:'지연' },
  { code:'PJT-NX5-HP-2025',     name:'Heat Protector 개발',   cust:'기아 NX5',      part:'K2210-H100', stage:'양산전환',      prog:100, pm:'이프로', sop:'2026-03-01', st:'완료' },
];
```
- applyFilter: currentSt, search(code/name/part), f-customer(부분일치 — cust에 '현대'/'기아'/'모비스' 포함 여부로 매칭하거나 select 값을 cust 포함검사), f-stage, f-pm.
  - 주: f-customer 매칭은 `d.cust.includes(브랜드)` 방식. '현대자동차'→'현대', '현대모비스'→'모비스', '기아'→'기아'로 매핑하거나, 간단히 select option을 현대/기아/모비스로 두고 includes.
  - **간단화**: filter-panel 고객사 select options을 전체/현대/기아/모비스로 하고 `d.cust.includes(value)`.
- updateCounts: cnt-all + 상태별.

- [ ] **Step 2: 브라우저 확인** — PJT-520PHEV-FT 첫 행 45% 막대, 진행중. 지연 행(78%) 빨강 상태. 행 클릭→01-04.

---

## Task 3: 01-05 프로젝트 일정/마일스톤

**Files:** Create `mockups/01_project/01-05_milestone.html`

간트형. 01-04 간트 패턴 계승.

- [ ] **Step 1: 파일 작성**

참조:
- `mockups/01_project/01-04_project_detail.html` — `.gantt` 테이블 + `.g-bar done/active/plan` CSS, 마일스톤 스텝퍼
- `mockups/06_price/06-03_price_history.html` — gray 컨텍스트 바 + kpi-row/kpi-card(over 빨강)

구조:
- `<body data-menu="01-05">`
- page-title-bar: "프로젝트 일정/마일스톤" + [프로젝트 상세](btn-secondary)→01-04_project_detail.html + [일정 저장](btn-primary, showToast '일정이 저장되었습니다.','ok')
- 프로젝트 컨텍스트 바(gray): 프로젝트 PJT-520PHEV-FT-2026 / 품번 H1110-T100 / 고객 현대 520 PHEV / PM 김개발
- KPI 카드 4장(kpi-row):
  - 전체 진척률 45% (sub: 마일스톤 3/9 완료)
  - 완료 마일스톤 3 / 9 (sub: 도면·목표가·RFQ 완료)
  - D-Day D-119 (sub: SOP 2026-10-01)
  - 지연 작업 1건 (over 카드 빨강, sub: 견적/업체선정 지연)

- content-scroll 내부 2개 section-box:

**섹션 1 — 마일스톤 진행 현황** (가로 9단계 카드 스트립)
각 카드: 단계명 + 기준일 + 상태 점. 가로 스크롤 가능.
```
도면/BOM 등록 (2026-02-20, 완료) | 목표가/재료비 (2026-03-10, 완료) | RFQ 발송 (2026-04-15, 완료) |
견적/업체선정 (2026-05-20, 진행) | 금형/샘플 (2026-07-31, 예정) | APQP (2026-08-31, 예정) |
PPAP (2026-09-15, 예정) | 양산성 검증 (2026-09-25, 예정) | SOP (2026-10-01, 예정)
```
ms-card CSS:
```css
.ms-strip { display:flex; gap:10px; overflow-x:auto; padding-bottom:6px; }
.ms-card { flex:0 0 auto; min-width:130px; border:1px solid var(--border); border-radius:4px; padding:10px 12px; }
.ms-card.done { border-color:var(--status-ok); background:#f0fdf4; }
.ms-card.prog { border-color:var(--blue); background:var(--blue-light); }
.ms-card.wait { background:#f9fafb; }
.ms-card .ms-step { font-size:12px; font-weight:600; color:var(--text); margin-bottom:4px; }
.ms-card .ms-date { font-size:11px; color:var(--text-sub); }
.ms-card .ms-stat { margin-top:6px; }
```

**섹션 2 — 작업 일정 (작업 상세 + 간트 통합 테이블)**
좌측 작업 정보 컬럼(작업명/담당/시작/종료/진척/상태) + 우측 월별 간트(1~10월).
gantt 테이블(01-04 계승). 컬럼: 작업명 / 담당 / 시작 / 종료 / 진척 / 상태 / 1월~10월(10칸).
현재월(6월) th에 cur 클래스.
작업 행(8개):
```
도면/BOM 등록      | 정설계 | 2026-01-05 | 2026-02-20 | 100% | 완료 | 막대 1~2월 done
목표가/재료비 산출  | 한원가 | 2026-02-01 | 2026-03-10 | 100% | 완료 | 막대 2~3월 done
개발구매 RFQ 발송   | 김개발 | 2026-03-01 | 2026-04-15 | 100% | 완료 | 막대 3~4월 done
견적 비교/업체 선정 | 김개발 | 2026-04-01 | 2026-05-20 | 70%  | 지연 | 막대 4~5월 delay
금형/샘플 제작      | 최금형 | 2026-05-15 | 2026-07-31 | 10%  | 진행 | 막대 5~7월 active
APQP/품질 준비      | 이품질 | 2026-06-01 | 2026-08-31 | 0%   | 예정 | 막대 6~8월 plan
PPAP 승인          | 이품질 | 2026-08-01 | 2026-09-15 | 0%   | 예정 | 막대 8~9월 plan
SOP 준비           | 김개발 | 2026-09-01 | 2026-10-01 | 0%   | 예정 | 막대 9~10월 plan
```
- 진척 셀: prog-bar(좁게). 상태 점: 완료(st-ok)/지연(st-bad)/진행(st-prog)/예정(st-wait).
- 정적 테이블(JS 계산 불필요). 막대는 해당 월 td에 `<div class="g-bar done|active|plan|delay"></div>`.

gantt CSS (01-04 계승 + delay 추가):
```css
.gantt-wrap { overflow-x:auto; }
table.gantt { width:100%; border-collapse:collapse; font-size:11px; table-layout:fixed; }
table.gantt thead th { background:var(--grid-head); height:28px; padding:0 4px; font-size:11px; font-weight:600; color:var(--text-sub); text-align:center; border:1px solid var(--border); white-space:nowrap; }
table.gantt thead th.info-col { text-align:left; padding:0 10px; }
table.gantt thead th.cur { background:#eef2f8; color:var(--blue); }
table.gantt tbody td { height:30px; border:1px solid var(--border); padding:4px 3px; vertical-align:middle; text-align:center; }
table.gantt tbody td.info { text-align:left; padding:0 10px; font-size:12px; white-space:nowrap; background:var(--surface); }
table.gantt tbody td.cur { background:#f7f9fc; }
.g-bar { height:14px; border-radius:2px; width:100%; }
.g-bar.done   { background:var(--navy); }
.g-bar.active { background:var(--blue); opacity:0.65; }
.g-bar.plan   { background:var(--navy); opacity:0.2; }
.g-bar.delay  { background:var(--status-bad); }
```
간트 헤더: 작업명(168) / 담당(70) / 시작(90) / 종료(90) / 진척(120) / 상태(80) / 1~10월(각 좁게). info-col 클래스로 좌측 6개 헤더 좌정렬.

**범례** (테이블 하단):
완료(navy) / 진행(blue 0.65) / 예정(navy 0.2) / 지연(red) 색상 박스 + 라벨.

- [ ] **Step 2: 브라우저 확인** — KPI 4장(지연 1건 빨강), 마일스톤 9카드(완료3/진행1/예정5), 간트 8작업, 견적/업체선정 delay 빨강 막대, 6월 cur 강조.

---

## Task 4: index.html + PROGRESS.md 갱신

**Files:** Modify `mockups/index.html`, `docs/PROGRESS.md`

- [ ] **Step 1: index.html 01 섹션 미작업 3개 교체**

`mockups/index.html`에서 01-01, 01-03, 01-05 미작업 항목을 링크로 교체.
- 01-01:
```html
<li class="screen-item">
  <span class="screen-code">01-01</span>
  <a href="01_project/01-01_rfq_list.html" class="screen-link">고객 RFQ 목록</a>
  <span class="screen-badge">완료</span>
</li>
```
- 01-03: `<a href="01_project/01-03_project_list.html" class="screen-link">개발 프로젝트 목록</a>` + 완료 뱃지
- 01-05: `<a href="01_project/01-05_milestone.html" class="screen-link">프로젝트 일정/마일스톤</a>` + 완료 뱃지
(먼저 index.html에서 현재 01 섹션 마크업을 Read로 확인 후 각 항목 정확히 교체)

- [ ] **Step 2: PROGRESS.md 갱신**
- `진행: 46 / 56` → `진행: 49 / 56`
- 01 섹션: 01-01, 01-03, 01-05 `[ ]` → `[x]`

- [ ] **Step 3: 최종 통합 QA** — 3개 화면: 이모지/Excel/리셋 0건, data-menu(01-01/01-03/01-05) 정확, 데모 일관(현대 520 PHEV / PJT-520PHEV-FT / 45% / D-119 / 지연 1건), 내부 링크 유효, sidebar 01 href 일치.

---

## 자기검토 (Spec Coverage)

| 스펙 요구사항 | Task |
|---|---|
| 01-01 RFQ 목록 + 상태 4종 + 고객목표가 | Task 1 |
| 01-03 프로젝트 목록 + 진척 막대 | Task 2 |
| 01-03 지연 프로젝트 빨강 상태 | Task 2 |
| 01-05 KPI 4장(지연 over) | Task 3 |
| 01-05 마일스톤 9카드 스트립 | Task 3 |
| 01-05 작업+간트 통합(delay 빨강) | Task 3 |
| 01-05 간트 01-04 패턴 계승 | Task 3 |
| index 3링크 + PROGRESS 49/56 | Task 4 |
| 데모 일관(520 PHEV/PJT-FT/45%/D-119) | 전체 |
| 이모지·Excel·리셋 금지 | 전체 + Task 4 QA |
