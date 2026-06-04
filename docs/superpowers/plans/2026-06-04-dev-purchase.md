# 04. 개발구매 HTML 목업 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 동희산업 DevSRM 개발구매 섹션의 미작업 8개 화면(04-02, 04-04, 04-05, 04-08, 04-09, 04-10, 04-11, 04-12)을 완성하고 index.html / PROGRESS.md를 갱신한다.

**Architecture:** 기존 04_dev_purchase 화면(04-03 등)과 06_price 화면의 standalone HTML 패턴을 따른다. 목록형(04-02, 04-09)은 `search-bar + grid-area + data-table`, 상세형(04-04, 04-08)은 `content-scroll + section-box`, 품의형(04-10, 04-12)은 `section-box + step-bar 결재선 + 반려 모달`, 평가형(04-11)은 `편집 테이블 + 자동계산`, 견적입력형(04-05)은 `content-scroll + 입력표`를 쓴다.

**Tech Stack:** Standalone HTML, tokens.css (CDN Pretendard + CSS 변수), lucide (CDN), vanilla JS. 04-03의 `showToast()`/`toggleModal()` 유틸과 modal-backdrop 패턴, 06의 step-bar 결재선 패턴을 재사용한다.

---

## 파일 구조

| 작업 | 경로 | 유형 |
|------|------|------|
| Create | `mockups/04_dev_purchase/04-02_rfq_list.html` | 목록 |
| Create | `mockups/04_dev_purchase/04-04_rfq_detail.html` | 상세 |
| Create | `mockups/04_dev_purchase/04-05_supplier_quote.html` | 견적입력 |
| Create | `mockups/04_dev_purchase/04-08_negotiation.html` | 상세 |
| Create | `mockups/04_dev_purchase/04-09_cost_reduction.html` | 목록+모달 |
| Create | `mockups/04_dev_purchase/04-10_selection_approval.html` | 품의 |
| Create | `mockups/04_dev_purchase/04-11_bid_evaluation.html` | 평가 |
| Create | `mockups/04_dev_purchase/04-12_supplier_change.html` | 품의 |
| Modify | `mockups/index.html` (04. 개발구매 섹션 링크) |
| Modify | `docs/PROGRESS.md` (35 → 43) |

---

## 공통 재사용 컴포넌트 (모든 화면 공통)

각 화면의 `<head><style>` 또는 `<script>`에 필요한 부분만 포함한다.

### 상태 점 (st) — 목록/상세 공통
```css
.st { display:inline-flex; align-items:center; gap:5px; font-size:12px; white-space:nowrap; }
.st::before { content:''; width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.st-ok   { color:var(--status-ok);  } .st-ok::before   { background:var(--status-ok); }
.st-prog { color:var(--status-prog);} .st-prog::before { background:var(--status-prog); }
.st-wait { color:var(--text-mute);  } .st-wait::before { background:var(--border-strong); }
.st-bad  { color:var(--status-bad); } .st-bad::before  { background:var(--status-bad); }
```

### 테두리 뱃지 (pt) — 유형 표시
```css
.pt { display:inline-block; font-size:11px; padding:0 7px; height:18px; line-height:18px;
      border-radius:2px; border:1px solid; white-space:nowrap; }
```

### 결재선 step-bar (04-10, 04-12) — 7단계용 (step-box 너비 축소)
```css
.step-bar { display:flex; align-items:center; gap:0; flex-wrap:nowrap; }
.step-node { display:flex; align-items:center; }
.step-box { width:96px; border:1px solid var(--border); border-radius:4px;
  padding:7px 8px; display:flex; flex-direction:column; gap:2px; background:var(--surface); }
.step-box.done { border-color:var(--status-ok); background:#f0fdf4; }
.step-box.prog { border-color:var(--blue); background:var(--blue-light); }
.step-box.wait { border-color:var(--border); background:#f9fafb; }
.step-role { font-size:10px; color:var(--text-mute); }
.step-name { font-size:12px; font-weight:600; color:var(--text); }
.step-date { font-size:10px; color:var(--text-sub); }
.step-sep { width:18px; height:1px; background:var(--border-strong); flex-shrink:0; position:relative; }
.step-sep::after { content:''; position:absolute; right:-4px; top:-3px;
  border:4px solid transparent; border-left-color:var(--border-strong); }
```

### 토스트 유틸 (04-03 동일) — 모든 화면 JS 하단
```javascript
function showToast(msg, type, ms) {
  var bg = type === 'ok' ? '#16a34a' : type === 'bad' ? '#dc2626' : '#1f2937';
  var el = document.createElement('div');
  el.className = 'toast'; el.style.background = bg;
  el.innerHTML = '<i data-lucide="' + (type === 'bad' ? 'alert-circle' : 'check-circle') +
    '" style="width:14px;height:14px;flex-shrink:0"></i><span>' + msg + '</span>';
  document.body.appendChild(el);
  if (window.lucide) window.lucide.createIcons({ nodes: [el] });
  setTimeout(function(){ el.style.opacity='0'; el.style.transition='opacity .2s';
    setTimeout(function(){ el.remove(); }, 220); }, ms || 2400);
}
function toggleModal(id, open) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('open', open === undefined ? !el.classList.contains('open') : open);
}
```
(`.toast` CSS는 06 화면 패턴: `position:fixed;bottom:24px;right:24px;color:#fff;padding:10px 16px;border-radius:4px;font-size:13px;z-index:500;display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(0,0,0,.18)` — 단 04-03은 동적 생성이므로 `.toast{...display:flex 기본}` 사용)

### 푸터 (모든 화면 `</body>` 직전)
```html
<script src="../common/sidebar.js"></script>
<script>lucide.createIcons();</script>
```

### 절대 금지
- 이모지, Excel 다운로드 버튼, 리셋 버튼
- 04-05에 목표가(12,100원) 표시

---

## Task 1: 04-02 RFQ 목록

**Files:** Create `mockups/04_dev_purchase/04-02_rfq_list.html`

목록형 화면. 06-01과 동일 구조(search-bar + filter-panel + status-strip + grid-area + data-table).

- [ ] **Step 1: 파일 작성**

구조:
- `<body data-menu="04-02">`
- page-title-bar: 제목 "RFQ 목록" + 우측 [RFQ 생성] 버튼 `onclick="location.href='04-03_rfq_create.html'"`
- search-bar: search input(oninput=applyFilter) + 필터 버튼 + 상태 버튼 + date-range(2026-01-01~2026-12-31)
- filter-panel: 상태 select(작성중/발송완료/접수중/마감/선정완료), 차종 select(520 PHEV/기타)
- status-strip: 전체/작성중/발송완료/접수중/마감/선정완료 + ss-cnt 스팬
- grid-area > table-fill > data-table 컬럼: 체크박스(40px) / RFQ번호(130px, td-link→04-04) / 품번(110px) / 품명 / 대상협력사수(c, 90px) / 발송일(108px) / 마감일(108px) / 회신현황(c, 80px) / 상태(c, 90px) / 담당자(80px)
- 상태 점: ST_CLS = { '선정완료':'st-ok', '접수중':'st-prog', '발송완료':'st-prog', '작성중':'st-wait', '마감':'st-bad' }

DATA 배열:
```javascript
const DATA = [
  { rfq:'RFQ-2026-0012', part:'H1110-T100', name:"Frame Sub Ass'y",     cnt:3, send:'2026-02-10', due:'2026-02-28', reply:'1/3', st:'접수중',   mgr:'김구매' },
  { rfq:'RFQ-2026-0013', part:'H1110-T101', name:'Bracket Assy Upper',  cnt:3, send:'2026-02-10', due:'2026-02-28', reply:'3/3', st:'선정완료', mgr:'김구매' },
  { rfq:'RFQ-2026-0014', part:'H1110-T102', name:'Cover Plate',         cnt:2, send:'2026-02-15', due:'2026-03-05', reply:'2/2', st:'마감',     mgr:'이구매' },
  { rfq:'RFQ-2026-0018', part:'H1110-T103', name:'Rubber Seal',         cnt:2, send:'2026-03-02', due:'2026-03-20', reply:'0/2', st:'발송완료', mgr:'이구매' },
  { rfq:'RFQ-2026-0021', part:'H1110-T105', name:'Hose Assembly',       cnt:4, send:'—',          due:'2026-04-10', reply:'0/4', st:'작성중',   mgr:'김구매' },
];
```

- applyFilter()/renderRows()/updateCounts()/setStatus()/toggleFilter()/toggleStatusPanel() — 06-01과 동일 로직. 회신현황은 그대로 텍스트 출력. RFQ번호/품번 행 클릭 시 `location.href='04-04_rfq_detail.html'`.

- [ ] **Step 2: 브라우저 확인** — H1110-T100 RFQ가 첫 행, 회신 1/3, 접수중. 필터·상태스트립 동작. 행 클릭 → 04-04.

- [ ] **Step 3:** (git 없음 — 커밋 생략)

---

## Task 2: 04-04 RFQ 상세 (대상 협력사 진행상태)

**Files:** Create `mockups/04_dev_purchase/04-04_rfq_detail.html`

상세형. content-scroll + section-box.

- [ ] **Step 1: 파일 작성**

구조:
- `<body data-menu="04-04">`
- page-title-bar: "RFQ 상세" + [목록]→04-02 + [협력사 견적 제출]→04-05 + [견적 비교]→04-06
- content-scroll 내부 3개 section-box:

**섹션 1 — RFQ 정보 카드** (form-row form-row-4 ×2, 읽기 readonly)
- RFQ번호 RFQ-2026-0012 / 품번 H1110-T100 / 품명 Frame Sub Ass'y / 담당자 김구매
- 발송일 2026-02-10 / 마감일 2026-02-28 / 프로젝트 PJT-520PHEV-FT-2026 / 재질 Aluminum 6061

**섹션 2 — 4년치 단가 요청 조건** (snap-table 스타일 표)
컬럼: 구분 / 1차년(2026) / 2차년(2027) / 3차년(2028) / 4차년(2029)
행: 요청 단가 기준(원) — "협력사 제출" / 인하율(%) 0/2/3/3 / 옵션율(%) 0/1/1/2

**섹션 3 — 대상 협력사 진행 현황** (data-table)
컬럼: 협력사 / 발송일 / 열람일 / 견적 제출일 / 진행 상태(st) / Breakdown
행:
```
A사 (동희부품) | 2026-02-10 | 2026-02-11 | 2026-02-20 | 제출완료(st-ok)  | [보기]→04-06_quote_compare.html
B사 (한국알미늄)| 2026-02-10 | 2026-02-15 | —          | 열람(st-prog)    | —
C사 (신흥정공) | 2026-02-10 | —          | —          | 미열람(st-wait)  | —
```

snap-table CSS (06-02에서 가져옴):
```css
.snap-table { width:100%; border-collapse:collapse; font-size:12px; margin-top:6px; }
.snap-table th { background:var(--grid-head); padding:0 12px; height:30px; font-weight:600;
  color:var(--text); text-align:center; border:1px solid var(--border); white-space:nowrap; }
.snap-table td { padding:0 12px; height:30px; border:1px solid var(--border); color:var(--text);
  vertical-align:middle; }
.snap-table td.r { text-align:right; font-variant-numeric:tabular-nums; }
.snap-table td.c { text-align:center; }
```

- [ ] **Step 2: 브라우저 확인** — 협력사 3개사 진행상태(제출완료/열람/미열람) 점 색상, A사 [보기]→04-06.

---

## Task 3: 04-05 협력사 견적 제출

**Files:** Create `mockups/04_dev_purchase/04-05_supplier_quote.html`

견적입력형. 내부 레이아웃(사이드바). **목표가 미표시.**

- [ ] **Step 1: 파일 작성**

구조:
- `<body data-menu="04-05">`
- page-title-bar: "협력사 견적 제출" + [임시저장](showToast) + [견적 제출](showToast 'ok')
- content-scroll 내부 4개 section-box:

**섹션 1 — RFQ 정보 (읽기, 목표가 없음)** form-row-4 ×2
- RFQ번호 RFQ-2026-0012 / 품번 H1110-T100 / 품명 Frame Sub Ass'y / 협력사 A사 (동희부품)
- 마감일 2026-02-28 / 연간수량 100,000개 / 재질 Aluminum 6061 / 도면 Rev.A
- 섹션 헤더 옆 안내: `<span style="font-size:11px;color:var(--status-warn)">목표 구매단가는 제공되지 않습니다</span>`

**섹션 2 — 4년치 연도별 단가 입력표** (snap-table, 입력 셀은 form-input)
컬럼: 구분 / 1차년(2026) / 2차년(2027) / 3차년(2028) / 4차년(2029)
행: 단가(원) 15,200/14,900/14,600/14,300 · 인하율(%) 0/2/2/2 · 옵션율(%) 0/1/1/2
(입력값은 `<input class="form-input num" value="...">` 형태, 첫 행 단가만 입력형, 나머지는 표시형도 무방)

**섹션 3 — Breakdown 입력** (snap-table 2열: 항목 / 입력값 / 단위)
| 항목 | 값 | 단위 |
| LME 기준가 | 2,650 | USD/MT |
| 환율 | 1,380 | KRW/USD |
| 프리미엄 | 120 | USD/MT |
| 투입중량 | 2.85 | kg |
| 스크랩 중량 | 0.42 | kg |
| 가공비 | 2,400 | 원 |
| 물류비 | 300 | 원 |
| 관리비/이윤 | 580 | 원 |
값은 form-input. 하단에 "견적 합계 15,200원 (1차년 기준)" 표시.

**섹션 4 — 구비서류 업로드 체크리스트**
- 견적서 / 원가산출서 / LME 기준 확인서 / 품질 보증서 (checkbox + 파일 placeholder + 필수 표시)

- [ ] **Step 2: 브라우저 확인** — 목표가 어디에도 없음. 4년치 단가표 + Breakdown 입력 + 구비서류. [제출] 토스트.

---

## Task 4: 04-08 협상 이력 관리 ★

**Files:** Create `mockups/04_dev_purchase/04-08_negotiation.html`

상세형. KPI + 라운드별 협상 테이블.

- [ ] **Step 1: 파일 작성**

구조:
- `<body data-menu="04-08">`
- page-title-bar: "협상 이력 관리" + [목록]→04-02 + [업체 선정 품의]→04-10_selection_approval.html (btn-primary)
- 품번 컨텍스트 바(06-03 패턴): 품번 H1110-T100 / 품명 Frame Sub Ass'y / 협력사 A사 (동희부품)
- KPI 카드 3장(06-03 .kpi-row/.kpi-card):
  - 목표 구매단가 12,100원 (sub: 03-02 목표가)
  - 최초 견적 15,200원 (sub: A사 1차 제출)
  - 협상 후 현재 14,500원 (over 카드, 빨강, sub: 목표 대비 +2,400원 / 3R 합의)
- content-scroll > section-box "라운드별 협상 내역" > 협상 테이블(snap-table 확장):

컬럼: 라운드 / 일자 / 항목 / 최초(원) / 협상 후(원) / 절감액(원) / 누적 절감(원)
데이터(라운드별 그룹, 각 라운드 합계행 강조):
```
1R 2026-03-05 | 재료비   | 11,200 | 11,000 | -200 |
              | 가공비   | 2,400  | 2,300  | -100 |
              | 물류+관리| 1,600  | 1,500  | -100 |
              | [1R 합계]| 15,200 | 14,800 | -400 | -400  (강조행)
2R 2026-03-12 | 가공비   | 2,300  | 2,200  | -100 |
              | 관리비   | 800    | 700    | -100 |
              | [2R 합계]| 14,800 | 14,600 | -200 | -600  (강조행)
3R 2026-03-20 | 가공비   | 2,200  | 2,150  | -50  |
              | 관리비   | 700    | 650    | -50  |
              | [3R 합계]| 14,600 | 14,500 | -100 | -700  (강조행, 최종)
```
- 절감액 컬럼 파랑(`color:var(--blue)`), 합계행 `background:var(--grid-head);font-weight:700`, 최종 3R 합계행 `background:var(--blue-light)`.
- 하단 section-box "협상 근거 및 첨부": textarea(협상 근거 — "3라운드에 걸쳐 가공비·관리비 중심 절감. 재료비는 LME 연동분으로 추가 인하 불가. 최종 14,500원 합의(목표가 대비 +2,400원). 고객가 재협상 병행 필요.") + [라운드 추가] 버튼(showToast) + 첨부 placeholder

- [ ] **Step 2: 브라우저 확인** — KPI 3장(현재 14,500 빨강), 3라운드 협상 흐름 15,200→14,500, 누적절감 -700, 최종 합계행 강조.

---

## Task 5: 04-09 원가절감안 등록

**Files:** Create `mockups/04_dev_purchase/04-09_cost_reduction.html`

목록+모달형.

- [ ] **Step 1: 파일 작성**

구조:
- `<body data-menu="04-09">`
- page-title-bar: "원가절감안 등록" + [절감안 등록] 버튼(openModal)
- search-bar: search input + 필터(절감유형 select: 설계변경/공법변경/소재변경/물류개선) + date-range
- grid-area > table-fill > data-table 컬럼: 체크박스 / 절감안번호 / 절감유형(pt 뱃지) / 절감 항목 / 현재원가(r) / 개선후원가(r) / 절감액(r, 파랑) / 적용시점 / 상태(st) / 담당자
- tfoot 합계행(total-row, navy): 총 절감액 합산
- 절감유형 뱃지 색: 설계변경=blue, 공법변경=status-ok, 소재변경=status-warn, 물류개선=text-sub (각 pt-xxx 클래스)
- 상태: 검토중(st-prog)/승인(st-ok)/반려(st-bad)/적용완료(st-ok)

DATA:
```javascript
const DATA = [
  { no:'CR-2026-0007', type:'공법변경', item:'가공 2공정 → 1공정 통합', cur:2400, imp:1600, save:800, apply:'2026-04-01', st:'승인',     mgr:'김구매' },
  { no:'CR-2026-0009', type:'소재변경', item:'스크랩 회수율 개선',       cur:11200,imp:10900,save:300, apply:'2026-04-01', st:'검토중',   mgr:'정설계' },
  { no:'CR-2026-0011', type:'물류개선', item:'평택 직납 전환',           cur:300,  imp:220,  save:80,  apply:'2026-05-01', st:'적용완료', mgr:'이구매' },
  { no:'CR-2026-0013', type:'설계변경', item:'리브 구조 단순화 (VE)',    cur:1500, imp:1350, save:150, apply:'2026-06-01', st:'반려',     mgr:'정설계' },
];
```
- 등록 모달(modal-backdrop): 절감유형 select / 절감 항목 input / 현재원가 input / 개선후원가 input(→ 절감액 자동 표시) / 적용시점 date / 사유 textarea + [취소][저장](showToast). 현재-개선후 입력 시 절감액 자동계산 표시 함수 포함.

- [ ] **Step 2: 브라우저 확인** — 4개 절감안, 절감유형 뱃지, 합계행, 등록 모달 차액 자동계산.

---

## Task 6: 04-10 업체 선정 품의/결재 ★

**Files:** Create `mockups/04_dev_purchase/04-10_selection_approval.html`

품의형. 선정유형 + 이원화 + 7단계 결재선 + 반려 모달.

- [ ] **Step 1: 파일 작성**

구조:
- `<body data-menu="04-10">`
- page-title-bar: "업체 선정 품의/결재" + [목록]→04-02 + [임시저장](showToast) + [반려](openReject, btn-danger) + [결재 상신](showToast 'ok')
- content-scroll 내부:

**섹션 1 — 품의 기본 정보** form-row-4 ×2 (읽기)
- 품의번호 APV-SEL-2026-0008 / 품번 H1110-T100 / 품명 Frame Sub Ass'y / 선정업체 A사 (동희부품)
- 확정단가 14,500원 / 연간수량 100,000개 / 연간 구매금액 14.5억원 / 작성자 김구매

**섹션 2 — 선정 유형** (라디오 그룹, 가로 배치)
- ○ 전략적 선정  ● 경쟁 입찰  ○ 심의입찰
- 심의입찰 옆: `<a>` "심의입찰 평가표 보기 → 04-11" (`location.href='04-11_bid_evaluation.html'`)

**섹션 3 — 이원화 여부** (라디오 + 조건부 비율표)
- ● 단일  ○ 이원화  ○ 다원화
- 라디오 변경 시 비율 입력표 표시/숨김(toggleDual 함수). 단일이면 숨김. 이원화 선택 시 표:
  | 업체 | 공급 비율(%) |
  | A사 | 70 |
  | D사 (대원금속) | 30 |
  합계 100% 자동검증 표시.

**섹션 4 — 선정 근거 요약** (카드 4장 grid, 06 kpi 스타일 또는 cmp-card)
- 가격: 협상 14,500원 (3R 합의) / 품질: PPAP 승인 / 납기: SOP 2026-10-01 충족 / 기술: 2공정 가공 적합
- 하단 textarea: 종합 선정 의견

**섹션 5 — 결재선 (수평 7단계)** step-bar (위 공통 CSS, width:96px)
- 구매담당(김구매, done) → 구매팀장(이팀장, done) → 구매부장(박부장, prog) → 품질담당(최품질, wait) → 개발담당(정개발, wait) → 재경팀장(한재경, wait) → 대표이사(정대표, wait)
- step-sep 6개

**반려 모달**(modal-backdrop, id=modal-reject): 반려 사유 select(가격 미달/근거 부족/이원화 검토 필요/기타) + textarea + [취소][반려 확정](showToast 'bad')

- [ ] **Step 2: 브라우저 확인** — 선정유형 라디오, 이원화 선택 시 비율표 노출, 7단계 결재선, 반려 모달.

---

## Task 7: 04-11 심의입찰 평가 (가중치 기반)

**Files:** Create `mockups/04_dev_purchase/04-11_bid_evaluation.html`

평가형. 가중치 편집 + 점수 입력 + 자동 가중합산.

- [ ] **Step 1: 파일 작성**

구조:
- `<body data-menu="04-11">`
- page-title-bar: "심의입찰 평가" + [목록]→04-02 + [업체 선정 품의 연동]→04-10 (btn-primary)
- 품번 컨텍스트 바: 품번 H1110-T100 / 품명 Frame Sub Ass'y / RFQ-2026-0012 / 평가 대상 3개사
- content-scroll 내부:

**섹션 1 — 평가 항목 가중치** (편집 테이블)
컬럼: 평가 항목 / 가중치(%) (input)
행: 가격 40 / 품질 30 / 납기 15 / 기술 15 / [합계] (자동, 100% 검증 — 100이 아니면 빨강)

**섹션 2 — 협력사별 평가 점수** (평가 그리드)
컬럼: 평가 항목 / 가중치(%) / A사 / B사 / C사
행(점수 input 0~100):
```
가격 | 40 | 85 | 90 | 80
품질 | 30 | 92 | 85 | 80
납기 | 15 | 88 | 82 | 90
기술 | 15 | 90 | 84 | 78
[가중 합산] | 100 | (자동) | (자동) | (자동)
[순위]      |     | (자동) | (자동) | (자동)
```
- 가중 합산 = Σ(점수 × 가중치/100). 점수 입력 시 calcScores() 자동 재계산.
- A사 = 85×.4+92×.3+88×.15+90×.15 = 34+27.6+13.2+13.5 = 88.3
- B사 = 90×.4+85×.3+82×.15+84×.15 = 36+25.5+12.3+12.6 = 86.4
- C사 = 80×.4+80×.3+90×.15+78×.15 = 32+24+13.5+11.7 = 81.2
- 순위: A사 1위 / B사 2위 / C사 3위. 1위 열(A사) 강조(blue-light).

**섹션 3 — 최종 선정 의견** textarea("가중 합산 결과 A사 88.3점으로 최고. 품질·기술 우위. A사 선정 권고.") + [04-10 품의 연동] 링크

calcScores() JS: 가중치 input과 점수 input을 읽어 각 사 가중합산·순위 계산하여 셀 갱신. 가중치 합계 100 검증.

- [ ] **Step 2: 브라우저 확인** — 점수 입력 시 가중합산 자동 갱신, A사 88.3 1위 강조, 가중치 합 100 검증.

---

## Task 8: 04-12 업체변경 / 이원화·다원화 품의

**Files:** Create `mockups/04_dev_purchase/04-12_supplier_change.html`

품의형. 기존 업체 조회 + 변경 사유 + 비율 + 결재선.

- [ ] **Step 1: 파일 작성**

구조:
- `<body data-menu="04-12">`
- page-title-bar: "업체변경 / 이원화·다원화 품의" + [목록]→04-02 + [임시저장](showToast) + [결재 상신](showToast 'ok')
- content-scroll 내부:

**섹션 1 — 기존 선정 업체** form-row-4 (읽기)
- 품번 H1110-T100 / 현재 업체 A사 (동희부품) 단독 / 확정단가 14,500원 / 적용 시작 2026-04-01

**섹션 2 — 변경·추가 사유** (라디오 + 상세)
- ○ 품질 이슈  ● 공급 안정성  ○ 원가 절감  ○ 기타
- 사유 상세 textarea("Fuel Tank Module 단일 공급 리스크 대응. 공급 안정성 확보를 위한 이원화 추진. D사(대원금속) 품질평가 완료, 단가 경쟁력 확보.")

**섹션 3 — 변경 설정** (변경유형 라디오 + 비율표)
- 변경 유형: ○ 업체 교체  ● 이원화 추가  ○ 다원화 추가
- 업체별 공급 비율표(편집 가능, 합계 100% 자동검증):
  | 업체 | 공급 비율(%) | 비고 |
  | A사 (동희부품) | 70 | 기존 |
  | D사 (대원금속) | 30 | 신규 추가 |
- 합계 표시(100%, 미달/초과 시 빨강)

**섹션 4 — 결재선 (수평 7단계)** step-bar (04-10과 동일 7단계, 전부 wait 또는 첫 단계만 done)
- 구매담당(김구매, done) → 구매팀장(이팀장, prog) → 구매부장 → 품질담당 → 개발담당 → 재경팀장 → 대표이사 (이하 wait)

- [ ] **Step 2: 브라우저 확인** — 기존 A사 조회, 이원화 비율 A 70/D 30 합계 100, 7단계 결재선.

---

## Task 9: index.html + PROGRESS.md 갱신

**Files:** Modify `mockups/index.html`, `docs/PROGRESS.md`

- [ ] **Step 1: index.html 04. 개발구매 섹션 교체**

기존 04 섹션에서 미작업 8개 항목(04-02, 04-04, 04-05, 04-08, 04-09, 04-10, 04-11, 04-12)을 링크+완료 뱃지로 교체. 현재 04 섹션은 04-01~04-12까지 있으며, 04-01/03/06/07은 이미 링크 완료, 04-08/04-10은 priority 뱃지 상태. 8개를 아래 형식으로 교체:
```html
<li class="screen-item">
  <span class="screen-code">04-02</span>
  <a href="04_dev_purchase/04-02_rfq_list.html" class="screen-link">RFQ 목록</a>
  <span class="screen-badge">완료</span>
</li>
```
(04-04: RFQ 상세, 04-05: 협력사 견적 제출, 04-08: 협상 이력 관리, 04-09: 원가절감안 등록, 04-10: 업체 선정 품의/결재, 04-11: 심의입찰 평가, 04-12: 업체변경/이원화·다원화 품의 — 각 파일명 매칭)

- [ ] **Step 2: PROGRESS.md 갱신**
- `진행: 35 / 56` → `진행: 43 / 56`
- 04 섹션 8개 항목(04-02, 04-04, 04-05, 04-08, 04-09, 04-10, 04-11, 04-12) `[ ]` → `[x]`

- [ ] **Step 3: 최종 검토** — 8개 화면 통합 QA(이모지/Excel/리셋 0건, data-menu 정확, 04-05 목표가 미표시, 데모데이터 일관, 내부 링크 유효).

---

## 자기검토 (Spec Coverage)

| 스펙 요구사항 | Task |
|---|---|
| 04-02 RFQ 목록 그리드 + 회신현황 | Task 1 |
| 04-04 협력사 진행상태(제출완료/열람/미열람) | Task 2 |
| 04-04 4년치 단가 요청조건 표 | Task 2 |
| 04-05 목표가 미표시 + 4년치 입력 + Breakdown | Task 3 |
| 04-08 KPI 3장 + 3라운드 협상(15,200→14,500) | Task 4 |
| 04-09 절감안 그리드 + 유형 뱃지 + 등록 모달 | Task 5 |
| 04-10 선정유형 + 이원화 비율 + 7단계 결재 + 반려모달 | Task 6 |
| 04-11 가중치 100% 검증 + 점수 가중합산 자동 + 순위 | Task 7 |
| 04-12 기존업체 조회 + 변경사유 + 이원화 비율 + 결재선 | Task 8 |
| index.html 8개 링크 + PROGRESS 43/56 | Task 9 |
| 데모 일관성(H1110-T100/A사/12,100/14,500) | 전체 |
| 이모지·Excel·리셋 금지, 04-05 목표가 차단 | 전체 + Task 9 QA |
