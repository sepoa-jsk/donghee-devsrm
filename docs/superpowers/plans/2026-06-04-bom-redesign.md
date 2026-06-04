# 02. 설계/BOM 보완 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** H1110-T100 표준 BOM을 02 전 화면(+04-03)에 통일하고, 프로젝트 키체인 컨텍스트 바와 eBOM/mBOM·PLM·적용시점 보완을 적용한다.

**Architecture:** 기존 02-01~04 / 04-03 파일을 수정한다. 표준 BOM 데이터(아래 정본 표)를 모든 화면의 단일 출처로 삼고, 02-02/03/04에 공통 키체인 바를 추가한다.

**Tech Stack:** Standalone HTML, tokens.css, lucide CDN, vanilla JS.

---

## 표준 BOM 정본 (모든 Task의 단일 출처)

| 레벨 | 품번 | 품명 | 재질 | Rev | 수량 | 구매구분 | 순중량 | 투입중량 | 스크랩 | 목표구매단가 | 적용시점 | 상태 | PLM |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | H1110-T100 | Frame Sub Ass'y | Aluminum 6061 | Rev.B | 1 | 구매대상 | 2.60 | 2.85 | 0.42 | 12,100 | 2026-03-10 | 개발중 | 연동 |
| 1 | H1110-T101 | Bracket Assy Upper | SPCC | Rev.A | 1 | 구매대상 | 0.38 | 0.42 | 0.04 | 2,200 | 2026-01-15 | 개발중 | 연동 |
| 2 | H1110-T101A | Upper Bracket Body | SPCC | Rev.A | 1 | 내제 | 0.28 | 0.32 | 0.04 | 1,600 | 2026-01-15 | 개발중 | 연동 |
| 2 | H1110-T101B | Mounting Tab | SPCC | Rev.A | 2 | 내제 | 0.05 | 0.06 | 0.01 | — | 2026-01-15 | 개발중 | 연동 |
| 1 | H1110-T102 | Cover Plate | Aluminum 6061 | Rev.A | 1 | 구매대상 | 0.32 | 0.38 | 0.06 | 1,800 | 2026-01-15 | 개발중 | 연동 |
| 2 | H1110-T102A | Cover Base Plate | Aluminum 6061 | Rev.A | 1 | 내제 | 0.30 | 0.34 | 0.04 | 1,500 | 2026-01-15 | 개발중 | 연동 |
| 1 | H1110-T103 | Rubber Seal | NBR70 | Rev.A | 2 | 사급 | 0.08 | 0.08 | 0.00 | 420 | 2026-01-15 | 개발중 | 연동 |
| 1 | H1110-T104 | Pipe Connector | Aluminum 6061 | Rev.A | 1 | 구매대상 | 0.15 | 0.18 | 0.03 | 1,100 | 2026-01-15 | 개발중 | 연동 |
| 1 | H1110-T105 | Hose Assembly | EPDM | Rev.A | 1 | 구매대상 | 0.20 | 0.22 | 0.02 | 3,200 | 2026-01-15 | 미연동 | 미연동 |

루트 = H1110-T100. T101/T102는 펼침 자식 보유. 가상 상위(H1000/H1100) 및 T200/T300/T400 폐기.

**키체인 컨텍스트 바** (02-02/03/04 공통, page-title-bar 아래 gray 바):
```html
<div style="padding:8px 24px;background:#f9fafb;border-bottom:1px solid var(--border);font-size:12px;color:var(--text-sub);display:flex;align-items:center;gap:10px;flex-shrink:0">
  <span>프로젝트 <a href="01-04 경로" style="color:var(--blue);font-weight:600;text-decoration:none">PJT-520PHEV-FT-2026</a></span>
  <i data-lucide="chevron-right" style="width:13px;height:13px;color:var(--text-mute)"></i>
  <span>품번 <strong style="color:var(--text)">H1110-T100</strong></span>
  <i data-lucide="chevron-right" style="width:13px;height:13px;color:var(--text-mute)"></i>
  <span>리비전 <strong style="color:var(--text)">Rev.B</strong></span>
  <i data-lucide="chevron-right" style="width:13px;height:13px;color:var(--text-mute)"></i>
  <span>적용 <strong style="color:var(--text)">2026-03-10</strong></span>
  <span style="margin-left:auto;display:flex;gap:6px">
    <a href="다운스트림" class="kc-link">목표가</a>
    <a href="다운스트림" class="kc-link">재료비</a>
    <a href="다운스트림" class="kc-link">견적비교</a>
  </span>
</div>
```
kc-link CSS: `.kc-link{font-size:11px;color:var(--blue);border:1px solid var(--border);border-radius:3px;padding:2px 8px;text-decoration:none}` 
- 01-04 경로: 02 파일은 같은 폴더이므로 `01-04_project_detail.html`
- 다운스트림: `../03_cost/03-02_target_detail.html`, `../03_cost/03-07_material_cost.html`, `../04_dev_purchase/04-06_quote_compare.html`

---

## Task 1: 02-04 BOM 트리 뷰 보완

**Files:** Modify `mockups/02_design_bom/02-04_bom_tree.html`

이 화면은 표준에 가장 가깝다. BOM_DATA 정합 + eBOM/mBOM 실동작 + 적용시점 컬럼 + 키체인/프로젝트 링크.

- [ ] **Step 1: BOM_DATA FTM 노드 정합**

`BOM_DATA.FTM.nodes`에서 다음을 수정(다른 노드는 유지):
```javascript
'H1110-T100': { name:"Frame Sub Ass'y",    mat:'Aluminum 6061', rev:'Rev.B', type:'구매대상', netW:2.60, inW:2.85, scrap:0.42, target:12100, qty:1, eff:'2026-03-10', children:['H1110-T101','H1110-T102','H1110-T103','H1110-T104','H1110-T105'], status:'개발중', plm:'연동' },
'H1110-T101': { name:'Bracket Assy Upper', mat:'SPCC',          rev:'Rev.A', type:'구매대상', netW:0.38, inW:0.42, scrap:0.04, target:2200,  qty:1, eff:'2026-01-15', children:['H1110-T101A','H1110-T101B'], status:'개발중', plm:'연동' },
'H1110-T102': { name:'Cover Plate',        mat:'Aluminum 6061', rev:'Rev.A', type:'구매대상', netW:0.32, inW:0.38, scrap:0.06, target:1800,  qty:1, eff:'2026-01-15', children:['H1110-T102A'], status:'개발중', plm:'연동' },
'H1110-T103': { name:'Rubber Seal',        mat:'NBR70',         rev:'Rev.A', type:'사급',     netW:0.08, inW:0.08, scrap:0.00, target:420,   qty:2, eff:'2026-01-15', children:[], status:'개발중', plm:'연동' },
'H1110-T104': { name:'Pipe Connector',     mat:'Aluminum 6061', rev:'Rev.A', type:'구매대상', netW:0.15, inW:0.18, scrap:0.03, target:1100,  qty:1, eff:'2026-01-15', children:[], status:'개발중', plm:'연동' },
'H1110-T105': { name:'Hose Assembly',      mat:'EPDM',          rev:'Rev.A', type:'구매대상', netW:0.20, inW:0.22, scrap:0.02, target:3200,  qty:1, eff:'2026-01-15', children:[], status:'개발중', plm:'미연동' },
'H1110-T101A':{ name:'Upper Bracket Body', mat:'SPCC',          rev:'Rev.A', type:'내제',     netW:0.28, inW:0.32, scrap:0.04, target:1600,  qty:1, eff:'2026-01-15', children:[], status:'개발중', plm:'연동', mfg:'프레스 → 절곡' },
'H1110-T101B':{ name:'Mounting Tab',       mat:'SPCC',          rev:'Rev.A', type:'내제',     netW:0.05, inW:0.06, scrap:0.01, target:null,  qty:2, eff:'2026-01-15', children:[], status:'개발중', plm:'연동', mfg:'프레스' },
'H1110-T102A':{ name:'Cover Base Plate',   mat:'Aluminum 6061', rev:'Rev.A', type:'내제',     netW:0.30, inW:0.34, scrap:0.04, target:1500,  qty:1, eff:'2026-01-15', children:[], status:'개발중', plm:'연동', mfg:'프레스 → 트리밍' },
```
(내제 노드에 `mfg` 공정 라벨 추가 — mBOM 표시용)

- [ ] **Step 2: 보조 프로젝트 RB/BM → 01-03 정합(NX5/MQ4)**

`BOM_DATA.RB`/`BOM_DATA.BM`를 다음으로 교체:
```javascript
CM: {
  roots: ['K2200-C100'],
  nodes: {
    'K2200-C100': { name:'Cooling Module Assy', mat:'Aluminum 6061', rev:'Rev.A', type:'구매대상', netW:1.80, inW:2.00, scrap:0.20, target:18500, qty:1, eff:'2026-02-10', children:['K2200-C101','K2200-C102'], status:'개발중', plm:'연동' },
    'K2200-C101': { name:'Radiator Bracket',    mat:'SPCC',          rev:'Rev.A', type:'구매대상', netW:0.42, inW:0.48, scrap:0.06, target:2600,  qty:2, eff:'2026-02-10', children:[], status:'개발중', plm:'연동' },
    'K2200-C102': { name:'Hose Clamp Set',      mat:'SUS304',        rev:'Rev.A', type:'구매대상', netW:0.03, inW:0.03, scrap:0.00, target:120,   qty:4, eff:'2026-02-10', children:[], status:'개발중', plm:'연동' },
  }
},
BR: {
  roots: ['M3300-B100'],
  nodes: {
    'M3300-B100': { name:'Bracket Assy',        mat:'SPCC',          rev:'Rev.A', type:'구매대상', netW:0.95, inW:1.08, scrap:0.13, target:9500,  qty:1, eff:'2026-03-02', children:['M3300-B101'], status:'개발중', plm:'미연동' },
    'M3300-B101': { name:'Reinforce Plate',     mat:'SPCC',          rev:'-',     type:'구매대상', netW:0.30, inW:0.35, scrap:0.05, target:null,  qty:1, eff:'-',          children:[], status:'도면등록중', plm:'미연동' },
  }
}
```
그리고 프로젝트 셀렉터(line 144-148) 교체:
```html
<select class="ctrl-select" style="width:240px" onchange="switchProject(this.value)">
  <option value="FTM">PJT-520PHEV-FT-2026 · Fuel Tank Module</option>
  <option value="CM">PJT-NX5-CM-2026 · Cooling Module</option>
  <option value="BR">PJT-MQ4-BR-2026 · Bracket Assy</option>
</select>
```

- [ ] **Step 3: 적용시점 컬럼 추가**

thead(line 184-198)의 도면 Rev `<th>` 뒤에 적용시점 컬럼 추가:
```html
<th style="width:90px">적용시점</th>
```
(도면 Rev th 다음, 구매구분 th 앞)

renderTree의 tr.innerHTML(line 318-336)에서 도면 Rev td 다음에 적용시점 td 추가:
```html
<td style="text-align:center;color:var(--text-sub);font-size:11px">${r.node.eff || '-'}</td>
```

- [ ] **Step 4: eBOM/mBOM 실제 전환**

`switchBomType`은 그대로(renderTree 재호출). renderTree에서 mBOM일 때 내제 행 강조 + 공정 라벨 표시. tr 생성부에 추가:
```javascript
// 내제 행 mBOM 강조
if (bomType === 'mBOM' && r.node.type === '내제') tr.classList.add('mfg-row');
```
품명 셀에 mBOM이면 공정 라벨 append. tree-cell의 품명 span을 다음으로:
```javascript
const mfgTag = (bomType === 'mBOM' && r.node.mfg)
  ? ` <span style="font-size:10px;color:var(--status-warn);border:1px solid var(--status-warn);border-radius:2px;padding:0 4px;margin-left:4px">${r.node.mfg}</span>` : '';
```
그리고 품명 span: `<span style="color:var(--text-sub)">${r.node.name}${mfgTag}</span>`
mfg-row CSS 추가(style 블록):
```css
table.bom-table tbody tr.mfg-row td { background:#fffbeb; }
table.bom-table tbody tr.mfg-row:hover td { background:#fef3c7; }
```
컨트롤 바에 mBOM 안내(summary 영역 또는 btn 옆): mBOM 활성 시 `bom-summary` 앞에 "내제 공정품 강조" 표기는 생략 가능(행 음영으로 충분).

- [ ] **Step 5: 프로젝트 카드 → 키체인 링크화**

프로젝트 카드(line 172-178) "대상 품번" pc-item을 클릭 링크로, 그리고 카드 우측에 [프로젝트 상세] 버튼 추가:
```html
<div class="pc-item"><span class="pc-label">대상 품번</span><a href="02-02_part_detail.html" class="pc-val" style="color:var(--blue);text-decoration:none">H1110-T100 · Frame Sub Ass'y</a></div>
```
proj-card 끝에 추가:
```html
<div style="margin-left:auto;display:flex;gap:6px">
  <a href="01-04_project_detail.html" class="ctrl-btn" style="text-decoration:none">프로젝트 상세</a>
  <a href="../03_cost/03-07_material_cost.html" class="ctrl-btn" style="text-decoration:none">재료비 산출</a>
</div>
```

- [ ] **Step 6: 브라우저 확인** — T103 사급/T104 Pipe/T105 Hose, 적용시점 컬럼, mBOM 클릭 시 내제 행 노란 강조+공정라벨, 프로젝트 셀렉터 NX5/MQ4, 카드 링크 동작.

---

## Task 2: 02-02 품번·BOM·도면 상세 보완

**Files:** Modify `mockups/02_design_bom/02-02_part_detail.html`

좌측 트리 교체 + eBOM/mBOM 탭 + PLM 배지 + 키체인 바 + 영향카드 링크.

- [ ] **Step 1: 기존 파일 읽고 구조 파악**
먼저 `02-02_part_detail.html` 전체를 Read하여 BOM 트리(좌측 패널), 탭 구조, 영향 카드(리비전 탭) 위치를 파악한다.

- [ ] **Step 2: 좌측 BOM 트리 교체**
가상 상위(H1000-T000 Fuel Tank Module Ass'y, H1100-T000 Tank Body Ass'y) 및 T200/T300/T400 노드를 제거하고, 루트 H1110-T100 기준 표준 트리로 교체:
```
H1110-T100 Frame Sub Ass'y (선택)
├ H1110-T101 Bracket Assy Upper
│  ├ H1110-T101A Upper Bracket Body
│  └ H1110-T101B Mounting Tab
├ H1110-T102 Cover Plate
│  └ H1110-T102A Cover Base Plate
├ H1110-T103 Rubber Seal
├ H1110-T104 Pipe Connector
└ H1110-T105 Hose Assembly
```
기존 트리 노드 마크업 패턴(클래스)을 그대로 쓰되 품번/품명만 표준으로.

- [ ] **Step 3: 트리 상단 eBOM/mBOM 탭 추가**
좌측 패널 "BOM 트리" 헤더 아래(또는 옆)에 토글 2버튼 추가:
```html
<div style="display:flex;gap:4px;margin-bottom:8px">
  <button class="ctrl-btn active" id="ebom-btn" onclick="setBomView('eBOM')">eBOM</button>
  <button class="ctrl-btn" id="mbom-btn" onclick="setBomView('mBOM')">mBOM</button>
</div>
```
ctrl-btn CSS(02-04와 동일)를 style에 추가. setBomView(): 두 버튼 active 토글 + mBOM이면 내제 트리노드(T101A/T101B/T102A)에 공정 라벨/음영 표시(간단히 노드 옆 작은 라벨 또는 배경). 목업 수준이므로 active 전환 + 안내 텍스트 변경으로 충분:
```javascript
function setBomView(v){
  document.getElementById('ebom-btn').classList.toggle('active', v==='eBOM');
  document.getElementById('mbom-btn').classList.toggle('active', v==='mBOM');
  document.querySelectorAll('.mfg-node').forEach(n=>n.style.display = v==='mBOM' ? 'inline-block' : 'none');
}
```
내제 트리 노드(T101A/T101B/T102A) 품명 뒤에 `<span class="mfg-node" style="display:none;font-size:10px;color:var(--status-warn);margin-left:4px">[가공]</span>` 추가.

- [ ] **Step 4: PLM 연계 상태 배지**
우측 상세 헤더(info bar, 선택 품번 코드+이름+Rev 배지 영역)에 PLM 배지 추가. H1110-T100 = 연동(초록):
```html
<span class="badge badge-ok" style="font-size:10px">PLM 연동</span>
```
(badge badge-ok / badge-wait / badge-bad 활용. H1110-T100은 연동→badge-ok)

- [ ] **Step 5: 기본정보 탭 데이터 정합**
적용 프로젝트 PJT-520PHEV-FT-2026 유지. 상위 품번 필드 = "— (최상위)" 또는 제거(H1110-T100이 루트). 현재 리비전 Rev.B, 재질 Aluminum 6061, 순중량 2.60, 투입중량 2.85, 스크랩 0.42(06-02 정합)로 수정. 재료 이용률 = 2.60/2.85 = 91.2%로 갱신.

- [ ] **Step 6: 키체인 컨텍스트 바 추가**
page-title-bar 아래에 공통 키체인 바(위 정본 참조) 삽입. 01-04 경로=`01-04_project_detail.html`, 다운스트림=`../03_cost/03-02_target_detail.html` 등. kc-link CSS 추가.

- [ ] **Step 7: 리비전 탭 영향 카드 링크화**
리비전 이력 탭의 영향 항목 3카드(재료비/RFQ/설계변경)를 클릭 가능한 `<a>` 또는 onclick으로:
- 재료비 산출 → `../03_cost/03-07_material_cost.html`
- RFQ 상세 → `../04_dev_purchase/04-04_rfq_detail.html`
- 설계 변경 영향 → `../08_change/08-01_design_change.html` (미구현이면 onclick showToast 또는 # 유지 — 08-01 미작업이므로 `#`+안내 텍스트)
리비전 행: Rev.A(2026-01-15 초도) + Rev.B(2026-03-10 설계변경, 투입 2.70→2.85) 2행으로.

- [ ] **Step 8: 브라우저 확인** — 표준 트리, eBOM/mBOM 탭(mBOM 시 가공 라벨), PLM 연동 배지, 키체인 바, 영향카드 링크(03-07/04-04 이동).

---

## Task 3: 02-01 품번 목록 데이터 정합

**Files:** Modify `mockups/02_design_bom/02-01_part_list.html`

- [ ] **Step 1: 기존 파일 읽기** — DATA 배열 구조 파악.

- [ ] **Step 2: FTM 프로젝트 품번을 표준 BOM으로 교체**
H1110-T100 프로젝트(PJT-520PHEV-FT-2026)의 행을 표준 9품번으로:
```
H1110-T100 | Frame Sub Ass'y    | Aluminum 6061 | Rev.B | L1 | 구매대상 | 12,100
H1110-T101 | Bracket Assy Upper | SPCC          | Rev.A | L2 | 구매대상 | 2,200
H1110-T101A| Upper Bracket Body | SPCC          | Rev.A | L3 | 내제     | 1,600
H1110-T101B| Mounting Tab       | SPCC          | Rev.A | L3 | 내제     | —
H1110-T102 | Cover Plate        | Aluminum 6061 | Rev.A | L2 | 구매대상 | 1,800
H1110-T102A| Cover Base Plate   | Aluminum 6061 | Rev.A | L3 | 내제     | 1,500
H1110-T103 | Rubber Seal        | NBR70         | Rev.A | L2 | 사급     | 420
H1110-T104 | Pipe Connector     | Aluminum 6061 | Rev.A | L2 | 구매대상 | 1,100
H1110-T105 | Hose Assembly      | EPDM          | Rev.A | L2 | 구매대상 | 3,200
```
(기존 DATA의 다른 프로젝트 행 NX5/MQ4 1~2개는 K2200-C100, M3300-B100으로 정합; 가상 SANTA/ION9 행은 제거)
프로젝트 코드/명 = PJT-520PHEV-FT-2026 / 520 PHEV FTM. 상태는 H1110-T100=개발중 등 기존 패턴.

- [ ] **Step 3: 브라우저 확인** — 표준 9품번 표시, 레벨/구매구분/목표가 정합.

---

## Task 4: 02-03 도면 리비전 이력 데이터 정합

**Files:** Modify `mockups/02_design_bom/02-03_drawing_history.html`

- [ ] **Step 1: 기존 파일 읽기** — DATA 배열 구조 파악.

- [ ] **Step 2: H1110-T100 리비전 행 정합 + 키체인 바**
H1110-T100 행을 Rev.A(2026-01-15, 초도 등록, 순2.40/투입2.70) → Rev.B(2026-03-10, 설계 변경, 순2.60/투입2.85, 변동 +0.20/+0.15)로. 하위 품번 T101~T105 Rev.A 초도 행 추가(2026-01-15). 가상 프로젝트(SANTA/ION9) 행은 NX5/MQ4 1~2개로 정합.
page-title-bar 아래 키체인 바 추가(02-02와 동일 패턴, 01-04/다운스트림 링크).

- [ ] **Step 3: 브라우저 확인** — H1110-T100 Rev.A→B + 하위 Rev.A 행, 키체인 바.

---

## Task 5: 04-03 RFQ 하위 품목 정합

**Files:** Modify `mockups/04_dev_purchase/04-03_rfq_create.html`

- [ ] **Step 1: PARTS 배열 교체**
기존 PARTS(H1111-T100~H1115-T100)를 표준 BOM 구매대상/사급 하위로 교체:
```javascript
var PARTS = [
  { code: 'H1110-T101', name: 'Bracket Assy Upper', mat: 'SPCC',          rev: 'Rev.A', unit: '개', qty: '100,000', note: '프레스 가공 조립',       isNew: false, checked: true },
  { code: 'H1110-T102', name: 'Cover Plate',        mat: 'Aluminum 6061', rev: 'Rev.A', unit: '개', qty: '100,000', note: '프레스 + 트리밍',        isNew: false, checked: true },
  { code: 'H1110-T103', name: 'Rubber Seal',        mat: 'NBR70',         rev: 'Rev.A', unit: '개', qty: '200,000', note: '사급 (지급소재)',         isNew: false, checked: true },
  { code: 'H1110-T104', name: 'Pipe Connector',     mat: 'Aluminum 6061', rev: 'Rev.A', unit: '개', qty: '100,000', note: '절삭 가공',              isNew: false, checked: true },
  { code: 'H1110-T105', name: 'Hose Assembly',      mat: 'EPDM',          rev: 'Rev.A', unit: 'SET', qty: '100,000', note: '고무 압출 + 조립',         isNew: false, checked: true },
];
```
(품번 정보 카드의 도면 리비전 Rev.A→Rev.B로 정합도 함께)

- [ ] **Step 2: 브라우저 확인** — 하위 품목 T101~T105 표시, 표준 BOM 정합.

---

## Task 6: 통합 QA

**Files:** (검증)

- [ ] **Step 1: BOM 정합 교차 검증**
02-01/02-02/02-04 세 화면의 H1110-T100 하위 품번이 동일(T101 Bracket, T102 Cover, T103 Rubber 사급, T104 Pipe, T105 Hose)한지 확인. 02-04 BOM_DATA와 02-02 트리, 02-01 목록 일치. 04-03 PARTS = 구매/사급 하위 일치. 무게(T100 투입 2.85·스크랩 0.42) 일치. 가상 품번(H1000/H1100/T200/T300/T400/H1111~1115/H2210/H3310/SANTA/ION9) 잔존 0건 확인(grep).

- [ ] **Step 2: 프로젝트 연결 검증**
02-02/03/04 키체인 바 존재 + 01-04 링크 + 다운스트림(03-02/03-07/04-06) 링크 유효. 02-04 프로젝트 셀렉터 NX5/MQ4 정합.

- [ ] **Step 3: 스펙 갭 검증**
02-02 eBOM/mBOM 탭 + PLM 배지 존재. 02-04 eBOM/mBOM 전환 동작 + 적용시점 컬럼. 이모지·Excel·리셋 0건.

---

## 자기검토 (Spec Coverage)

| 스펙 요구사항 | Task |
|---|---|
| 표준 BOM 9품번 정본 | Task 1·2·3 |
| 02-04 BOM_DATA 정합 + 적용시점 + eBOM/mBOM | Task 1 |
| 02-02 트리 교체 + eBOM/mBOM 탭 + PLM 배지 + 영향카드 링크 | Task 2 |
| 02-01 품번 데이터 정합 | Task 3 |
| 02-03 리비전 행 정합 | Task 4 |
| 04-03 하위 품목 정합 | Task 5 |
| 키체인 컨텍스트 바(02-02/03/04) | Task 2·4·1 |
| 다운스트림 링크(03-02/03-07/04-06) | Task 1·2·4 |
| 가상 BOM 제거 검증 | Task 6 |
