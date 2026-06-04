# 09. 협력사 관리 HTML 목업 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 동희산업 DevSRM 협력사 관리 모듈(09-01 목록, 09-01 상세, 09-02 사후평가) 3개 HTML 화면을 완성하고 index.html / PROGRESS.md를 갱신한다.

**Architecture:** 기존 검증 패턴을 재사용한다 — 09-01 목록은 06-01(search-bar+grid), 09-01 상세는 06-02/04-10(section-box+eval-table+step-bar+반려모달), 09-02는 04-11(점수 입력→자동 계산 그리드) 패턴. 신규 디렉토리 `mockups/09_supplier/`를 만든다.

**Tech Stack:** Standalone HTML, tokens.css, lucide CDN, vanilla JS. showToast()/toggleModal() 유틸과 st/step-bar/eval-table 패턴 재사용.

---

## 파일 구조

| 작업 | 경로 | 유형 |
|------|------|------|
| Create | `mockups/09_supplier/09-01_supplier_register.html` | 목록 |
| Create | `mockups/09_supplier/09-01_supplier_register_detail.html` | 상세 |
| Create | `mockups/09_supplier/09-02_supplier_eval.html` | 평가 |
| Modify | `mockups/index.html` (09 섹션 링크) |
| Modify | `docs/PROGRESS.md` (43 → 45) |

sidebar.js는 09-01/09-02 href가 이미 실제 파일명과 일치하므로 변경 불필요.

---

## 공통 재사용 컴포넌트

### 상태/등급 점 (st)
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

### 토스트 유틸 (04 패턴)
```css
.toast { position:fixed; bottom:24px; right:24px; color:#fff; padding:10px 16px; border-radius:4px;
  font-size:13px; z-index:500; display:flex; align-items:center; gap:8px; box-shadow:0 4px 16px rgba(0,0,0,.18); }
```
```javascript
function showToast(msg, type, ms) {
  var bg = type === 'ok' ? '#16a34a' : type === 'bad' ? '#dc2626' : '#1f2937';
  var el = document.createElement('div'); el.className = 'toast'; el.style.background = bg;
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

### 푸터 (모든 화면)
```html
<script src="../common/sidebar.js"></script>
<script>lucide.createIcons();</script>
```

### 절대 금지
이모지, Excel 버튼, 리셋 버튼. 버튼 32px.

---

## Task 1: 09-01 협력사 사전 등록·평가 (목록)

**Files:** Create `mockups/09_supplier/09-01_supplier_register.html`

목록형. 06-01과 동일 구조.

- [ ] **Step 1: 디렉토리 + 파일 작성**

먼저 `mockups/09_supplier/` 디렉토리를 만든다(없으면).

참조: `mockups/06_price/06-01_price_list.html`을 Read하여 search-bar+filter-panel+status-strip+grid-area+data-table+applyFilter/renderRows/updateCounts/setStatus/toggleFilter/toggleStatusPanel 패턴을 그대로 따른다.

구조:
- `<body data-menu="09-01">`
- page-title-bar: "협력사 사전 등록·평가" + 우측 [협력사 등록] btn-primary → `location.href='09-01_supplier_register_detail.html'`
- search-bar: search input(oninput=applyFilter) + 필터 버튼 + 상태 버튼 + date-range(2026-01-01~2026-12-31, 신청일 기준)
- filter-panel:
  - 품목군 select(id=f-group): 전체/알루미늄 가공/프레스/플라스틱/표면처리
  - 등록상태 select(id=f-status): 전체/신청/심사중/승인/반려
- status-strip: 전체/신청/심사중/승인/반려 + ss-cnt (ids: cnt-all, cnt-apply, cnt-review, cnt-ok, cnt-reject)
- grid-area > table-fill > data-table 컬럼:
  체크박스(40) / 업체코드(110, td-link→상세) / 업체명(160) / 품목군(120) / 신청일(108) / 사전평가 점수(r,100) / 등록상태(c,90) / 담당자(80)
- 행 클릭 → 09-01_supplier_register_detail.html (체크박스 셀 event.stopPropagation)
- 등록상태 점: ST_CLS = { '승인':'st-ok', '심사중':'st-prog', '신청':'st-wait', '반려':'st-bad' }
- 사전평가 점수: 값 있으면 "84점", 없으면 muted "—"

DATA:
```javascript
const DATA = [
  { code:'VND-0064', name:'I사 (금강정밀)',   group:'알루미늄 가공', apply:'2026-05-20', score:0,  st:'심사중', mgr:'이구매' },
  { code:'VND-0061', name:'E사 (정밀단조)',   group:'프레스',       apply:'2026-05-25', score:0,  st:'신청',   mgr:'이구매' },
  { code:'VND-0058', name:'F사 (한길표면)',   group:'표면처리',     apply:'2026-05-10', score:84, st:'승인',   mgr:'김구매' },
  { code:'VND-0049', name:'G사 (대한플라텍)', group:'플라스틱',     apply:'2026-04-28', score:72, st:'반려',   mgr:'김구매' },
  { code:'VND-0063', name:'H사 (신성정공)',   group:'프레스',       apply:'2026-06-01', score:0,  st:'신청',   mgr:'이구매' },
];
```
- renderRows: 점수는 `d.score ? d.score+'점' : '<span class="muted">—</span>'`. 업체코드 td-link.
- applyFilter: search(code/name), date(apply), f-group, f-status, status-strip currentSt.
- updateCounts: cnt-all + 상태별.

- [ ] **Step 2: 브라우저 확인** — I사 첫 행 심사중, 점수 미정(—), 필터·상태스트립 동작, 행 클릭→상세.

---

## Task 2: 09-01 협력사 사전 등록·평가 (상세)

**Files:** Create `mockups/09_supplier/09-01_supplier_register_detail.html`

상세형. section-box + eval-table + step-bar 4단계 + 반려 모달.

- [ ] **Step 1: 파일 작성**

참조:
- `mockups/06_price/06-02_price_detail.html` — content-scroll + section-box + form-row + step-bar
- `mockups/04_dev_purchase/04-10_selection_approval.html` — 반려 모달(modal-reject) + step-bar + 라디오

구조:
- `<body data-menu="09-01">`
- page-title-bar: "협력사 사전 등록·평가" + [목록](btn-secondary)→09-01_supplier_register.html + [반려](btn-danger, toggleModal modal-reject) + [승인](btn-primary, showToast '협력사 등록이 승인되었습니다.','ok')

**섹션 1 — 업체 기본정보** (section-box, form-row form-row-4 ×2)
Row1: 업체코드 VND-0064(readonly) / 업체명 I사 (금강정밀) / 대표 김금강 / 사업자번호 123-45-67890
Row2: 소재지 경기도 안산시 / 품목군 select(알루미늄 가공 selected) / 신청일 2026-05-20 / 담당자 이구매
(업체명·대표·사업자·소재지는 일반 입력, 업체코드·신청일 readonly bg #f0f2f5)

**섹션 2 — 사전 평가 체크리스트** (section-box, eval-table)
4개 영역, 각 영역 헤더행 + 항목행(항목 / 배점 / 평가점수 input). 영역 소계 자동.
eval-table 컬럼: 평가 영역·항목 / 배점 / 평가 점수
영역과 항목(배점/평가점수 초기값):
```
[재무] (영역 소계 20)
  자본금·부채비율      | 10 | 8
  최근 3년 매출 추이    | 8  | 7
  신용등급             | 7  | 5
[기술] (영역 소계 22)
  보유 설비 적합성      | 10 | 9
  기술 인증(IATF 등)   | 8  | 7
  R&D 역량             | 7  | 6
[품질] (영역 소계 21)
  품질시스템(ISO/IATF) | 10 | 9
  불량률 실적          | 8  | 7
  클레임 이력          | 7  | 5
[생산] (영역 소계 19)
  생산능력(CAPA)       | 10 | 8
  납기 준수율          | 8  | 7
  공급 안정성          | 7  | 4
```
- 각 영역 헤더행(divider) + 항목행. 평가점수는 `<input class="cell-in">`.
- 영역 소계행: 재무 20 / 기술 22 / 품질 21 / 생산 19 (자동 합산, calcEval()).
- 종합 점수행(강조): 합계 82점 / 100점. 합격 기준선 70점 — 82 ≥ 70 → "합격" 초록 표시. 미달 시 빨강.
- calcEval(): 모든 cell-in 점수를 영역별로 합산→소계, 전체 합산→종합. 종합 ≥70이면 합격(초록), else 불합격(빨강).

eval-table CSS:
```css
.eval-table { width:100%; border-collapse:collapse; font-size:12px; }
.eval-table th { background:var(--grid-head); padding:0 12px; height:32px; font-weight:600; color:var(--text); text-align:center; border:1px solid var(--border); white-space:nowrap; }
.eval-table td { padding:0 12px; height:32px; border:1px solid var(--border); color:var(--text); vertical-align:middle; }
.eval-table td.lbl { text-align:left; }
.eval-table td.c { text-align:center; }
.eval-table .cell-in { width:60px; height:26px; border:1px solid var(--border); border-radius:3px; text-align:center; font-size:12px; font-family:'Pretendard',sans-serif; }
.eval-table .cell-in:focus { border-color:var(--blue); outline:none; box-shadow:0 0 0 2px rgba(26,86,170,0.15); }
.eval-table tr.area-row td { background:#eef0f3; font-weight:700; color:var(--text-sub); height:28px; }
.eval-table tr.sub-row td { background:var(--grid-row-alt); font-weight:600; }
.eval-table tr.total-row td { background:var(--navy); color:#fff; font-weight:700; }
.pass-ok { color:var(--status-ok); font-weight:700; }
.pass-bad { color:var(--status-bad); font-weight:700; }
```

**섹션 3 — 심사 결재선** (section-box, step-bar 4단계)
구매담당(이구매, done, 2026-05-21) → 구매팀장(이팀장, prog, 검토중) → 품질담당(최품질, wait, 대기) → 구매부장(박부장, wait, 대기)
step-bar CSS (width:110px 가능, 4단계라 여유):
```css
.step-bar { display:flex; align-items:center; gap:0; }
.step-node { display:flex; align-items:center; }
.step-box { width:120px; border:1px solid var(--border); border-radius:4px; padding:8px 10px; display:flex; flex-direction:column; gap:3px; background:var(--surface); }
.step-box.done { border-color:var(--status-ok); background:#f0fdf4; }
.step-box.prog { border-color:var(--blue); background:var(--blue-light); }
.step-box.wait { border-color:var(--border); background:#f9fafb; }
.step-role { font-size:10px; color:var(--text-mute); }
.step-name { font-size:12px; font-weight:600; color:var(--text); }
.step-date { font-size:10px; color:var(--text-sub); }
.step-sep { width:28px; height:1px; background:var(--border-strong); flex-shrink:0; position:relative; }
.step-sep::after { content:''; position:absolute; right:-4px; top:-3px; border:4px solid transparent; border-left-color:var(--border-strong); }
```

**반려 모달** (modal-backdrop id=modal-reject, ~480px):
반려 사유 select(재무 부적격/기술 미달/품질시스템 미흡/기타) + textarea + [취소][반려 확정](toggleModal close + showToast '반려 처리되었습니다.','bad')

calcEval()을 로드 시 1회 호출.

- [ ] **Step 2: 브라우저 확인** — 4영역 체크리스트, 점수 입력 시 소계·종합 자동, 82점 합격(초록), 4단계 결재선, 반려 모달.

---

## Task 3: 09-02 협력사 사후 평가 (Q-5스타)

**Files:** Create `mockups/09_supplier/09-02_supplier_eval.html`

평가형. 04-11 패턴(점수 input→자동 계산).

- [ ] **Step 1: 파일 작성**

참조:
- `mockups/04_dev_purchase/04-11_bid_evaluation.html` — eval-table + 점수 input + calcScores 자동 재계산 패턴
- `mockups/06_price/06-03_price_history.html` — 분기 탭 또는 컨텍스트 바

구조:
- `<body data-menu="09-02">`
- page-title-bar: "협력사 사후 평가 (Q-5스타)" + [평가 저장](btn-primary, showToast '분기 평가가 저장되었습니다.','ok')

**평가 기준 안내 바** (gray context bar):
"평가 항목: 품질(Q) · 납기(D) · 가격(P) · 기술(T) · 시스템(S) — 각 1~5점" + 등급 범례(우측):
S 4.5+ / A 3.5+ / B 2.5+ / C 1.5+ / D 미만 (각 등급 앞 색상 점: S/A 초록, B 파랑, C 노랑, D 빨강)

**분기 선택 탭** (type-tabs 스타일):
2026 1Q / 2Q / 3Q(active) / 4Q
탭 클릭 시 switchQuarter(); 데모는 3Q만 실제 데이터, 다른 분기는 동일 데이터 표시(간단 처리) 또는 "데이터 없음". 간단히: 모든 분기 같은 그리드 보여주되 active 표시만 전환해도 됨.

type-tabs CSS:
```css
.type-tabs { display:flex; gap:0; border-bottom:2px solid var(--border); margin-bottom:16px; }
.type-tab { padding:0 20px; height:36px; font-size:13px; font-weight:500; cursor:pointer; border:none; background:transparent; color:var(--text-sub); border-bottom:2px solid transparent; margin-bottom:-2px; }
.type-tab.active { color:var(--blue); border-bottom-color:var(--blue); font-weight:600; }
```

**평가 그리드** (eval-table)
컬럼: 협력사 / 품질(Q) / 납기(D) / 가격(P) / 기술(T) / 시스템(S) / 평균 / 등급 / 조치사항
점수 input(1~5, step 0.1), oninput=calcGrades. 평균·등급·조치 자동.
행 데이터(id 접두사 a/b/c/d):
```
A사 (동희부품)   | 4.8 4.7 4.3 4.6 4.7
B사 (한국알미늄) | 4.2 4.0 4.4 3.8 4.1
C사 (신흥정공)   | 3.5 3.8 4.0 3.4 3.6
D사 (대원금속)   | 2.8 3.0 3.5 2.6 2.9
```
계산: 평균 = (Q+D+P+T+S)/5, 소수 2자리.
- A사 4.62 → S / B사 4.10 → A / C사 3.66 → A / D사 2.96 → B
등급 함수: avg>=4.5 'S' / >=3.5 'A' / >=2.5 'B' / >=1.5 'C' / else 'D'
조치 매핑: S→'우선 발주', A→'우선 발주 후보', B→'정상 거래', C→'경고·개선 계획', D→'거래 중단 검토'
등급 셀 색(grade dot 또는 텍스트색): S/A→st-ok, B→st-prog, C→st-warn, D→st-bad. 등급은 점+텍스트 또는 컬러 텍스트.

calcGrades() JS:
```javascript
function num(id){ return parseFloat(document.getElementById(id).value) || 0; }
function gradeOf(avg){ return avg>=4.5?'S':avg>=3.5?'A':avg>=2.5?'B':avg>=1.5?'C':'D'; }
var ACTION = { S:'우선 발주', A:'우선 발주 후보', B:'정상 거래', C:'경고·개선 계획', D:'거래 중단 검토' };
var GRADE_CLS = { S:'st-ok', A:'st-ok', B:'st-prog', C:'st-warn', D:'st-bad' };
function calcGrades() {
  var firms = ['a','b','c','d'];
  var dist = { S:0, A:0, B:0, C:0, D:0 };
  firms.forEach(function(f){
    var avg = (num(f+'-q')+num(f+'-d')+num(f+'-p')+num(f+'-t')+num(f+'-s'))/5;
    var g = gradeOf(avg);
    dist[g]++;
    document.getElementById(f+'-avg').textContent = avg.toFixed(2);
    var gc = document.getElementById(f+'-grade');
    gc.className = 'st ' + GRADE_CLS[g];
    gc.textContent = g + '등급';
    document.getElementById(f+'-action').textContent = ACTION[g];
  });
  document.getElementById('dist-s').textContent = dist.S;
  document.getElementById('dist-a').textContent = dist.A;
  document.getElementById('dist-b').textContent = dist.B;
  document.getElementById('dist-c').textContent = dist.C;
  document.getElementById('dist-d').textContent = dist.D;
}
```
평균/등급/조치 셀은 비워두고 calcGrades()가 채움. 등급 셀은 `<span class="st" id="a-grade">`. calcGrades() 로드 시 1회 호출.

**하단 — 등급 분포 요약** (작은 카드 또는 한 줄)
S: <span id=dist-s>0</span>개사 / A: <span id=dist-a> / B / C / D. 현재 그리드 기준 자동 집계.
기대값: S 1 / A 2 / B 1 / C 0 / D 0.

- [ ] **Step 2: 브라우저 확인** — A사 4.62 S등급(우선 발주), 점수 변경 시 등급·조치·분포 자동 갱신. 분기 탭 전환. 등급 분포 S1/A2/B1.

---

## Task 4: index.html + PROGRESS.md 갱신

**Files:** Modify `mockups/index.html`, `docs/PROGRESS.md`

- [ ] **Step 1: index.html 09 섹션 교체**

기존 09. 협력사 관리 섹션의 미작업 2개 항목을 링크로 교체하고, 09-01 상세를 별도 줄로 추가(05-04 list/detail 선례):
```html
<li class="screen-item">
  <span class="screen-code">09-01</span>
  <a href="09_supplier/09-01_supplier_register.html" class="screen-link">협력사 사전 등록·평가 (목록)</a>
  <span class="screen-badge">완료</span>
</li>
<li class="screen-item">
  <span class="screen-code">09-01</span>
  <a href="09_supplier/09-01_supplier_register_detail.html" class="screen-link">협력사 사전 등록·평가 (상세)</a>
  <span class="screen-badge">완료</span>
</li>
<li class="screen-item">
  <span class="screen-code">09-02</span>
  <a href="09_supplier/09-02_supplier_eval.html" class="screen-link">협력사 사후 평가 (Q-5스타)</a>
  <span class="screen-badge">완료</span>
</li>
```
(먼저 index.html에서 현재 09 섹션 마크업을 Read로 확인 후 정확히 교체)

- [ ] **Step 2: PROGRESS.md 갱신**
- `진행: 43 / 56` → `진행: 45 / 56`
- 09 섹션: `- [ ] 09-01 ...` → `- [x]`, `- [ ] 09-02 ...` → `- [x]`

- [ ] **Step 3: 최종 통합 QA** — 3개 화면: 이모지/Excel/리셋 0건, data-menu(09-01/09-01/09-02) 정확, 09-02 등급계산 정합(A 4.62 S / B 4.10 A / C 3.66 A / D 2.96 B, 분포 S1·A2·B1), 내부 링크 유효, sidebar.js 09 href 일치 확인.

---

## 자기검토 (Spec Coverage)

| 스펙 요구사항 | Task |
|---|---|
| 09-01 목록: 신규사 그리드 + 등록상태 점 | Task 1 |
| 09-01 목록: 품목군·상태 필터, 상태스트립 | Task 1 |
| 09-01 상세: 기본정보 + 4영역 체크리스트 자동합산 | Task 2 |
| 09-01 상세: 합격 기준선 70점, 4단계 결재선, 반려모달 | Task 2 |
| 09-02: 5항목 점수 입력 + 평균·등급 자동 | Task 3 |
| 09-02: 등급 S/A/B/C/D 산정 + 조치 매핑 | Task 3 |
| 09-02: 분기 탭 + 등급 분포 요약 | Task 3 |
| index 3링크 + PROGRESS 45/56 | Task 4 |
| 데모 일관성(09-01 신규사 / 09-02 기존 A·B·C·D) | 전체 |
| 이모지·Excel·리셋 금지 | 전체 + Task 4 QA |
