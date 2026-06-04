# 06. 단가관리 HTML 목업 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 동희산업 DevSRM 단가관리 섹션(06-01~06-06) HTML 목업 6개 화면을 완성하고 index.html에 링크를 추가한다.

**Architecture:** 기존 05_quality 화면과 동일한 standalone HTML 패턴을 따른다. 목록 화면은 `grid-area + data-table`, 상세/폼 화면은 `content-scroll + section-box`, 품의 화면은 tab + step-bar 결재선 패턴을 사용한다.

**Tech Stack:** Standalone HTML, Tailwind 없음, tokens.css (CDN Pretendard + CSS 변수), lucide (CDN), vanilla JS

---

## 파일 구조

| 작업 | 경로 |
|------|------|
| Create | `mockups/06_price/06-01_price_list.html` |
| Create | `mockups/06_price/06-02_price_detail.html` |
| Create | `mockups/06_price/06-03_price_history.html` |
| Create | `mockups/06_price/06-04_price_approval.html` |
| Create | `mockups/06_price/06-05_price_pending.html` |
| Create | `mockups/06_price/06-06_retroactive.html` |
| Modify | `mockups/index.html` (06. 단가관리 섹션 링크 추가) |
| Modify | `docs/PROGRESS.md` (06-01~06-06 체크) |

---

## Task 1: 06-01 확정단가 목록

**Files:**
- Create: `mockups/06_price/06-01_price_list.html`

- [ ] **Step 1: 파일 생성**

`mockups/06_price/06-01_price_list.html` 전체 내용:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1920">
<title>확정단가 목록 | DevSRM</title>
<link rel="stylesheet" href="../common/tokens.css">
<script src="https://unpkg.com/lucide@latest"></script>
<style>
  .grid-area {
    flex:1; overflow:hidden; display:flex; flex-direction:column; padding:14px 24px 16px;
  }
  .table-fill { flex:1; overflow-y:auto; }
  .table-fill::-webkit-scrollbar { width:6px; }
  .table-fill::-webkit-scrollbar-thumb { background:var(--border-strong); border-radius:3px; }

  .td-link { color:var(--blue); font-weight:600; text-decoration:none; }
  .td-link:hover { text-decoration:underline; }

  .st { display:inline-flex; align-items:center; gap:5px; font-size:12px; white-space:nowrap; }
  .st::before { content:''; width:6px; height:6px; border-radius:50%; flex-shrink:0; }
  .st-ok   { color:var(--status-ok);  } .st-ok::before   { background:var(--status-ok); }
  .st-prog { color:var(--text-sub);   } .st-prog::before { background:var(--text-sub); }
  .st-wait { color:var(--text-mute);  } .st-wait::before { background:var(--border-strong); }
  .st-bad  { color:var(--status-bad); } .st-bad::before  { background:var(--status-bad); }

  .pt { display:inline-block; font-size:11px; padding:0 7px; height:18px; line-height:18px;
        border-radius:2px; border:1px solid; white-space:nowrap; }
  .pt-prov   { border-color:var(--status-warn); color:var(--status-warn); }
  .pt-final  { border-color:var(--blue);        color:var(--blue); }
  .pt-supply { border-color:var(--status-ok);   color:var(--status-ok); }

  .diff-over  { color:var(--status-bad); font-weight:600; }
  .diff-under { color:var(--blue);       font-weight:600; }
</style>
</head>

<body data-menu="06-01">
<div class="page-wrap">

  <div class="page-title-bar">
    <span class="page-title">확정단가 목록</span>
    <div class="page-title-spacer"></div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="location.href='06-02_price_detail.html'">
        <i data-lucide="plus"></i>단가 등록
      </button>
    </div>
  </div>

  <div class="search-bar" style="gap:8px">
    <div class="search-wrap">
      <input type="text" id="f-search" placeholder="Search" oninput="applyFilter()">
      <i data-lucide="search" class="s-icon" style="width:15px;height:15px"></i>
    </div>
    <button class="btn-filter" onclick="toggleFilter()">
      <i data-lucide="filter" style="width:14px;height:14px;color:#dc2626"></i>필터
    </button>
    <button class="btn-status" onclick="toggleStatusPanel()">
      <i data-lucide="bar-chart-2" style="width:14px;height:14px;color:var(--blue)"></i>상태
    </button>
    <div class="date-range">
      <input type="date" id="f-from" value="2026-01-01" onchange="applyFilter()">
      <span class="dr-sep">~</span>
      <input type="date" id="f-to" value="2026-12-31" onchange="applyFilter()">
      <i data-lucide="calendar" style="width:14px;height:14px;color:var(--text-mute);margin-left:2px"></i>
    </div>
  </div>

  <div class="filter-panel" id="filter-panel">
    <div class="search-field">
      <span class="search-label">단가종류</span>
      <select class="search-input" id="f-type" style="width:120px;height:28px;padding:0 8px;cursor:pointer" onchange="applyFilter()">
        <option value="">전체</option>
        <option value="가단가">가단가</option>
        <option value="정단가">정단가</option>
        <option value="사급단가">사급단가</option>
      </select>
    </div>
    <div class="search-field">
      <span class="search-label">협력사</span>
      <select class="search-input" id="f-supplier" style="width:100px;height:28px;padding:0 8px;cursor:pointer" onchange="applyFilter()">
        <option value="">전체</option>
        <option value="A사">A사</option>
        <option value="B사">B사</option>
        <option value="C사">C사</option>
      </select>
    </div>
  </div>

  <div class="status-strip" id="status-strip">
    <button class="ss-btn active" onclick="setStatus('')">전체 <span class="ss-cnt" id="cnt-all">0</span></button>
    <button class="ss-btn" onclick="setStatus('확정')">확정 <span class="ss-cnt" id="cnt-ok">0</span></button>
    <button class="ss-btn" onclick="setStatus('진행')">진행 <span class="ss-cnt" id="cnt-prog">0</span></button>
    <button class="ss-btn" onclick="setStatus('대기')">대기 <span class="ss-cnt" id="cnt-wait">0</span></button>
    <button class="ss-btn" onclick="setStatus('만료')">만료 <span class="ss-cnt" id="cnt-exp">0</span></button>
  </div>

  <div class="grid-area">
    <div class="table-fill">
      <table class="data-table" id="tbl" style="border:1px solid var(--border);border-radius:4px">
        <thead>
          <tr>
            <th style="width:40px"><input type="checkbox"></th>
            <th style="width:120px">품번</th>
            <th>품명</th>
            <th style="width:80px">단가종류</th>
            <th style="width:110px">확정단가(원)</th>
            <th style="width:108px">적용 시작일</th>
            <th style="width:108px">적용 종료일</th>
            <th style="width:80px">협력사</th>
            <th style="width:130px">목표가 대비</th>
            <th style="width:80px">상태</th>
            <th style="width:108px">등록일</th>
          </tr>
        </thead>
        <tbody id="tbody"></tbody>
      </table>
    </div>
  </div>

</div>

<script>
const DATA = [
  { part:'H1110-T100', name:"Frame Sub Ass'y",     type:'정단가', price:14500, start:'2026-04-01', end:'2030-09-30', sup:'A사', target:12100, st:'확정', reg:'2026-04-01' },
  { part:'H1110-T101', name:'Bracket Assy Upper',  type:'가단가', price:8200,  start:'2026-03-01', end:'2026-09-30', sup:'B사', target:7800,  st:'진행', reg:'2026-03-01' },
  { part:'H1110-T102', name:'Cover Plate',         type:'정단가', price:5600,  start:'2026-04-01', end:'2030-09-30', sup:'A사', target:5800,  st:'확정', reg:'2026-04-05' },
  { part:'H1110-T103', name:'Rubber Seal',         type:'사급단가',price:1200, start:'2026-05-01', end:'2030-09-30', sup:'C사', target:1100,  st:'진행', reg:'2026-05-10' },
  { part:'H1110-T104', name:'Pipe Connector',      type:'가단가', price:3100,  start:'2026-02-01', end:'2026-07-31', sup:'B사', target:3000,  st:'대기', reg:'2026-02-01' },
  { part:'H1110-T105', name:'Hose Assembly',       type:'정단가', price:9800,  start:'2025-10-01', end:'2026-03-31', sup:'A사', target:9500,  st:'만료', reg:'2025-10-01' },
];

const ST_CLS   = { '확정':'st-ok', '진행':'st-prog', '대기':'st-wait', '만료':'st-bad' };
const TYPE_CLS = { '가단가':'pt-prov', '정단가':'pt-final', '사급단가':'pt-supply' };
let currentSt = '';

function applyFilter() {
  const q    = document.getElementById('f-search').value.trim().toLowerCase();
  const from = document.getElementById('f-from').value;
  const to   = document.getElementById('f-to').value;
  const type = document.getElementById('f-type')?.value || '';
  const sup  = document.getElementById('f-supplier')?.value || '';

  const rows = DATA.filter(d => {
    if (currentSt && d.st !== currentSt) return false;
    if (q && !d.part.toLowerCase().includes(q) && !d.name.toLowerCase().includes(q)) return false;
    if (from && d.start < from) return false;
    if (to   && d.start > to)   return false;
    if (type && d.type !== type) return false;
    if (sup  && d.sup  !== sup)  return false;
    return true;
  });
  renderRows(rows);
  updateCounts();
}

function fmt(n) { return n.toLocaleString(); }

function renderRows(rows) {
  document.getElementById('tbody').innerHTML = rows.map(d => {
    const diff = d.price - d.target;
    const pct  = ((diff / d.target) * 100).toFixed(1);
    const sign = diff >= 0 ? '+' : '';
    const cls  = diff > 0 ? 'diff-over' : 'diff-under';
    return `<tr onclick="location.href='06-02_price_detail.html'">
      <td class="c" onclick="event.stopPropagation()"><input type="checkbox"></td>
      <td class="c"><a class="td-link" href="06-02_price_detail.html">${d.part}</a></td>
      <td style="padding-left:12px">${d.name}</td>
      <td class="c"><span class="pt ${TYPE_CLS[d.type]}">${d.type}</span></td>
      <td class="r" style="padding-right:12px;font-variant-numeric:tabular-nums">${fmt(d.price)}</td>
      <td class="c muted">${d.start}</td>
      <td class="c muted">${d.end}</td>
      <td class="c">${d.sup}</td>
      <td class="c ${cls}">${sign}${fmt(diff)} (${sign}${pct}%)</td>
      <td class="c"><span class="st ${ST_CLS[d.st]}">${d.st}</span></td>
      <td class="c muted">${d.reg}</td>
    </tr>`;
  }).join('');
}

function updateCounts() {
  document.getElementById('cnt-all').textContent  = DATA.length;
  document.getElementById('cnt-ok').textContent   = DATA.filter(d => d.st === '확정').length;
  document.getElementById('cnt-prog').textContent = DATA.filter(d => d.st === '진행').length;
  document.getElementById('cnt-wait').textContent = DATA.filter(d => d.st === '대기').length;
  document.getElementById('cnt-exp').textContent  = DATA.filter(d => d.st === '만료').length;
}

function setStatus(st) {
  currentSt = st;
  document.querySelectorAll('.ss-btn').forEach(b => b.classList.remove('active'));
  ['', '확정', '진행', '대기', '만료'].forEach((s, i) => {
    if (s === st) document.querySelectorAll('.ss-btn')[i]?.classList.add('active');
  });
  applyFilter();
}

function toggleFilter() { document.getElementById('filter-panel').classList.toggle('open'); }
function toggleStatusPanel() {
  const el = document.getElementById('status-strip');
  el.style.display = el.style.display === 'none' ? 'flex' : 'none';
}

renderRows(DATA);
updateCounts();
</script>

<script src="../common/sidebar.js"></script>
<script>lucide.createIcons();</script>
</body>
</html>
```

- [ ] **Step 2: 브라우저에서 확인**
  - `mockups/06_price/06-01_price_list.html` 열기
  - H1110-T100 첫 행에 정단가 / 14,500원 / +2,400(+19.8%, 빨강) 표시 확인
  - 필터 버튼, 상태 스트립, 날짜 범위 동작 확인
  - 행 클릭 시 06-02로 이동 확인

- [ ] **Step 3: 커밋**
```
git add mockups/06_price/06-01_price_list.html
git commit -m "feat(06-01): 확정단가 목록 화면 추가"
```

---

## Task 2: 06-02 확정단가 등록/상세

**Files:**
- Create: `mockups/06_price/06-02_price_detail.html`

- [ ] **Step 1: 파일 생성**

`mockups/06_price/06-02_price_detail.html` 전체 내용:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1920">
<title>확정단가 등록/상세 | DevSRM</title>
<link rel="stylesheet" href="../common/tokens.css">
<script src="https://unpkg.com/lucide@latest"></script>
<style>
  /* ── 단가종류 탭 ── */
  .type-tabs { display:flex; gap:0; border-bottom:2px solid var(--border); margin-bottom:16px; }
  .type-tab {
    padding:0 20px; height:36px; font-size:13px; font-weight:500; cursor:pointer;
    border:none; background:transparent; color:var(--text-sub);
    border-bottom:2px solid transparent; margin-bottom:-2px;
    transition:color .15s, border-color .15s;
  }
  .type-tab.active { color:var(--blue); border-bottom-color:var(--blue); font-weight:600; }
  .type-pane { display:none; }
  .type-pane.active { display:block; }

  /* ── 스냅샷 인라인 표 ── */
  .snap-table { width:100%; border-collapse:collapse; font-size:12px; margin-top:6px; }
  .snap-table th {
    background:var(--grid-head); padding:0 12px; height:30px; font-weight:600;
    color:var(--text); text-align:center; border:1px solid var(--border); white-space:nowrap;
  }
  .snap-table td {
    padding:0 12px; height:30px; border:1px solid var(--border);
    color:var(--text); vertical-align:middle;
  }
  .snap-table td.r { text-align:right; font-variant-numeric:tabular-nums; }
  .snap-table td.c { text-align:center; }

  /* ── 사급 소재 표 ── */
  .supply-table { width:100%; border-collapse:collapse; font-size:12px; margin-top:6px; }
  .supply-table th {
    background:var(--grid-head); padding:0 10px; height:30px; font-weight:600;
    color:var(--text); text-align:center; border:1px solid var(--border); white-space:nowrap;
  }
  .supply-table td {
    padding:0 10px; height:30px; border:1px solid var(--border);
    color:var(--text); vertical-align:middle;
  }
  .supply-table td.r  { text-align:right; font-variant-numeric:tabular-nums; }
  .supply-table td.c  { text-align:center; }
  .supply-table tr.total td { background:var(--navy); color:#fff; font-weight:700; }

  /* ── 결재선 (step-bar) ── */
  .step-bar { display:flex; align-items:center; gap:0; padding:8px 0; }
  .step-node { display:flex; align-items:center; }
  .step-box {
    width:110px; border:1px solid var(--border); border-radius:4px;
    padding:8px 10px; display:flex; flex-direction:column; gap:3px;
    background:var(--surface);
  }
  .step-box.done { border-color:var(--status-ok); background:#f0fdf4; }
  .step-box.prog { border-color:var(--blue); background:var(--blue-light); }
  .step-box.wait { border-color:var(--border); background:#f9fafb; }
  .step-role { font-size:10px; color:var(--text-mute); }
  .step-name { font-size:12px; font-weight:600; color:var(--text); }
  .step-date { font-size:10px; color:var(--text-sub); }
  .step-sep {
    width:28px; height:1px; background:var(--border-strong); flex-shrink:0;
    position:relative;
  }
  .step-sep::after {
    content:''; position:absolute; right:-4px; top:-3px;
    border:4px solid transparent; border-left-color:var(--border-strong);
  }

  .toast {
    position:fixed; bottom:24px; right:24px; background:#1f2937; color:#fff;
    padding:10px 16px; border-radius:4px; font-size:13px;
    z-index:500; display:none; align-items:center; gap:8px;
    box-shadow:0 4px 16px rgba(0,0,0,.18);
  }
  .toast.show { display:flex; }
</style>
</head>

<body data-menu="06-02">
<div class="page-wrap">

  <div class="page-title-bar">
    <span class="page-title">확정단가 등록/상세</span>
    <div class="page-title-spacer"></div>
    <div class="page-actions">
      <button class="btn btn-secondary" onclick="location.href='06-01_price_list.html'">
        <i data-lucide="arrow-left"></i>목록
      </button>
      <button class="btn btn-secondary" onclick="location.href='06-03_price_history.html'">
        <i data-lucide="clock"></i>단가 이력
      </button>
      <button class="btn btn-secondary" onclick="showToast('임시저장이 완료되었습니다.')">
        <i data-lucide="save"></i>임시저장
      </button>
      <button class="btn btn-primary" onclick="showToast('승인 요청이 완료되었습니다.')">
        <i data-lucide="send"></i>승인 요청
      </button>
    </div>
  </div>

  <div class="content-scroll">

    <!-- 1. 품번 기본 정보 -->
    <div class="section-box">
      <div class="section-box-header">
        <span class="section-box-title">품번 기본 정보</span>
        <span class="badge badge-prog" style="font-size:10px;margin-left:8px">구매팀장 검토 중</span>
      </div>
      <div class="form-row form-row-4">
        <div class="form-field">
          <label class="form-label">품번</label>
          <input class="form-input" value="H1110-T100" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
        <div class="form-field">
          <label class="form-label">품명</label>
          <input class="form-input" value="Frame Sub Ass'y" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
        <div class="form-field">
          <label class="form-label">협력사</label>
          <input class="form-input" value="A사 (협성알루미늄)" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
        <div class="form-field">
          <label class="form-label">프로젝트</label>
          <input class="form-input" value="PJT-520PHEV-FT-2026" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
      </div>
      <div class="form-row form-row-4">
        <div class="form-field">
          <label class="form-label">도면 리비전</label>
          <input class="form-input" value="Rev.C" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
        <div class="form-field">
          <label class="form-label">재질</label>
          <input class="form-input" value="Aluminum 6061 (LME 연동)" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
        <div class="form-field">
          <label class="form-label">LME 기준월</label>
          <input class="form-input" value="2026-03" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
        <div class="form-field">
          <label class="form-label">연간수량</label>
          <input class="form-input num" value="100,000 개" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
      </div>
    </div>

    <!-- 2. 단가 종류 탭 -->
    <div class="section-box">
      <div class="section-box-header">
        <span class="section-box-title">단가 설정</span>
      </div>

      <div class="type-tabs">
        <button class="type-tab" onclick="switchTab('prov')">가단가 (임시)</button>
        <button class="type-tab active" onclick="switchTab('final')">정단가 (확정)</button>
        <button class="type-tab" onclick="switchTab('supply')">사급단가</button>
      </div>

      <!-- 공통 -->
      <div class="form-row form-row-4" style="margin-bottom:16px">
        <div class="form-field">
          <label class="form-label">확정단가 (원) <span class="req">*</span></label>
          <input class="form-input num result" id="price-input" value="14,500">
        </div>
        <div class="form-field">
          <label class="form-label">적용 시작일 <span class="req">*</span></label>
          <input type="date" class="form-input" value="2026-04-01">
        </div>
        <div class="form-field">
          <label class="form-label">적용 종료일 <span class="req">*</span></label>
          <input type="date" class="form-input" value="2030-09-30">
        </div>
        <div class="form-field">
          <label class="form-label">목표 구매단가 (원)</label>
          <input class="form-input num" value="12,100" readonly style="background:#f0f2f5;color:var(--status-bad);font-weight:600">
          <span class="form-hint" style="color:var(--status-bad)">+2,400 (+19.8%) 초과</span>
        </div>
      </div>

      <!-- 가단가 패널 -->
      <div class="type-pane" id="pane-prov">
        <div class="form-row form-row-3">
          <div class="form-field">
            <label class="form-label">임시 적용 사유 <span class="req">*</span></label>
            <select class="form-select">
              <option>개발 초기 — 도면 미확정</option>
              <option>협의 진행 중</option>
              <option>PPAP 진행 중</option>
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">정단가 전환 예정일 <span class="req">*</span></label>
            <input type="date" class="form-input" value="2026-09-30">
          </div>
          <div class="form-field">
            <label class="form-label">LME 기준월 (산출 시점)</label>
            <input class="form-input" value="2026-05" readonly style="background:#f0f2f5;color:var(--text-sub)">
          </div>
        </div>
        <div class="form-row form-row-full">
          <div class="form-field">
            <label class="form-label">정단가 전환 조건</label>
            <textarea class="form-textarea" rows="2">PPAP 최종 승인 완료 및 초도량 시험(PSO) 적합 판정 후 정단가 재협의. 가단가 적용 기간 내 LME 변동 ±5% 초과 시 재산출 가능.</textarea>
          </div>
        </div>
      </div>

      <!-- 정단가 패널 -->
      <div class="type-pane active" id="pane-final">
        <div class="section-box-header" style="margin-bottom:8px">
          <span class="section-box-title" style="font-size:12px;color:var(--text-sub)">LME · 환율 스냅샷</span>
          <span style="font-size:11px;color:var(--text-mute);margin-left:8px">단가 확정 시점 기준</span>
        </div>
        <table class="snap-table" style="margin-bottom:14px">
          <thead>
            <tr>
              <th>소재</th>
              <th>LME 기준가 (USD/MT)</th>
              <th>환율 (KRW/USD)</th>
              <th>프리미엄 (USD/MT)</th>
              <th>부대비 (원/kg)</th>
              <th>소재단가 (원/kg)</th>
              <th>도면 Rev</th>
              <th>기준월</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="c">Al 6061</td>
              <td class="r">2,650</td>
              <td class="r">1,380</td>
              <td class="r">120</td>
              <td class="r">150</td>
              <td class="r" style="font-weight:600;color:var(--navy)">3,810</td>
              <td class="c">Rev.C</td>
              <td class="c">2026-03</td>
            </tr>
          </tbody>
        </table>
        <div class="form-row form-row-3">
          <div class="form-field">
            <label class="form-label">조정 조건</label>
            <input class="form-input" value="LME ±10% 초과 시 재협의">
          </div>
          <div class="form-field">
            <label class="form-label">협상 단계</label>
            <select class="form-select">
              <option selected>1차 협상 완료</option>
              <option>2차 협상 완료</option>
              <option>최종 확정</option>
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">연계 문서</label>
            <input class="form-input" value="RFQ-2026-0012 · 협상이력-003">
          </div>
        </div>
        <div class="form-row form-row-full">
          <div class="form-field">
            <label class="form-label">단가 결정 사유 / 비고</label>
            <textarea class="form-textarea" rows="2">04-08 협상 이력 3라운드 최종 합의. 목표가(12,100원) 대비 +2,400원 초과 — 고객사 판매가 재협의 병행 진행. LME 조정 조건 부가.</textarea>
          </div>
        </div>
      </div>

      <!-- 사급단가 패널 -->
      <div class="type-pane" id="pane-supply">
        <div class="section-box-header" style="margin-bottom:8px">
          <span class="section-box-title" style="font-size:12px;color:var(--text-sub)">지급소재 명세</span>
        </div>
        <table class="supply-table" style="margin-bottom:14px">
          <thead>
            <tr>
              <th style="width:160px">소재명</th>
              <th style="width:80px">단위</th>
              <th style="width:100px">수량</th>
              <th style="width:120px">단가 (원)</th>
              <th style="width:130px">금액 (원)</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Al 6061 압출재</td>
              <td class="c">kg</td>
              <td class="r">2.85</td>
              <td class="r">3,810</td>
              <td class="r">10,859</td>
              <td style="color:var(--text-sub)">LME 기준 소재단가 적용</td>
            </tr>
            <tr>
              <td>스크랩 회수 차감</td>
              <td class="c">kg</td>
              <td class="r">0.42</td>
              <td class="r">1,500</td>
              <td class="r" style="color:var(--blue)">-630</td>
              <td style="color:var(--text-sub)">회수단가 적용</td>
            </tr>
            <tr class="total">
              <td colspan="4" style="text-align:right;padding-right:12px">소재 합계</td>
              <td class="r">10,229</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div class="form-row form-row-3">
          <div class="form-field">
            <label class="form-label">가공비 단가 (원) <span class="req">*</span></label>
            <input class="form-input num" value="4,271">
            <span class="form-hint">사급단가 = 소재합계 + 가공비</span>
          </div>
          <div class="form-field">
            <label class="form-label">사급단가 합계 (원)</label>
            <input class="form-input num result" value="14,500" readonly style="background:#f0f2f5;font-weight:700;color:var(--navy)">
          </div>
          <div class="form-field">
            <label class="form-label">지급 소재 공급 방식</label>
            <select class="form-select">
              <option>동희산업 직납</option>
              <option>지정 업체 공급</option>
            </select>
          </div>
        </div>
      </div>

    </div>

    <!-- 3. 결재선 -->
    <div class="section-box">
      <div class="section-box-header">
        <span class="section-box-title">결재선</span>
      </div>
      <div class="step-bar">
        <div class="step-node">
          <div class="step-box done">
            <span class="step-role">구매담당</span>
            <span class="step-name">김구매</span>
            <span class="step-date">2026-03-28</span>
          </div>
          <div class="step-sep"></div>
        </div>
        <div class="step-node">
          <div class="step-box done">
            <span class="step-role">구매팀장</span>
            <span class="step-name">이팀장</span>
            <span class="step-date">2026-03-29</span>
          </div>
          <div class="step-sep"></div>
        </div>
        <div class="step-node">
          <div class="step-box prog">
            <span class="step-role">구매부장</span>
            <span class="step-name">박부장</span>
            <span class="step-date">검토중</span>
          </div>
          <div class="step-sep"></div>
        </div>
        <div class="step-node">
          <div class="step-box wait">
            <span class="step-role">재경팀장</span>
            <span class="step-name">최팀장</span>
            <span class="step-date">대기</span>
          </div>
          <div class="step-sep"></div>
        </div>
        <div class="step-node">
          <div class="step-box wait">
            <span class="step-role">대표이사</span>
            <span class="step-name">정대표</span>
            <span class="step-date">대기</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

<div class="toast" id="toast">
  <i data-lucide="check-circle" style="width:15px;height:15px;color:#4ade80;flex-shrink:0"></i>
  <span id="toast-msg"></span>
</div>

<script>
function switchTab(type) {
  document.querySelectorAll('.type-tab').forEach((t, i) => {
    const types = ['prov', 'final', 'supply'];
    t.classList.toggle('active', types[i] === type);
  });
  document.querySelectorAll('.type-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('pane-' + type).classList.add('active');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
</script>

<script src="../common/sidebar.js"></script>
<script>lucide.createIcons();</script>
</body>
</html>
```

- [ ] **Step 2: 브라우저에서 확인**
  - 기본 탭: 정단가 탭 활성 확인
  - 탭 전환 시 하단 패널 전환 확인
  - 결재선 3단계(완료→검토중→대기) 상태 색상 확인
  - [단가 이력] 버튼 → 06-03 이동 확인

- [ ] **Step 3: 커밋**
```
git add mockups/06_price/06-02_price_detail.html
git commit -m "feat(06-02): 확정단가 등록/상세 화면 추가"
```

---

## Task 3: 06-03 단가 이력 (시계열)

**Files:**
- Create: `mockups/06_price/06-03_price_history.html`

- [ ] **Step 1: 파일 생성**

`mockups/06_price/06-03_price_history.html` 전체 내용:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1920">
<title>단가 이력 (시계열) | DevSRM</title>
<link rel="stylesheet" href="../common/tokens.css">
<script src="https://unpkg.com/lucide@latest"></script>
<style>
  .kpi-row { display:flex; gap:16px; padding:16px 24px 0; flex-shrink:0; }
  .kpi-card {
    flex:1; background:var(--surface); border:1px solid var(--border); border-radius:4px;
    padding:14px 18px;
  }
  .kpi-label { font-size:12px; color:var(--text-sub); margin-bottom:6px; }
  .kpi-value { font-size:22px; font-weight:700; color:var(--text); font-variant-numeric:tabular-nums; line-height:1.2; }
  .kpi-sub   { font-size:11px; color:var(--text-sub); margin-top:4px; }
  .kpi-card.over { border-left:3px solid var(--status-bad); }
  .kpi-card.over .kpi-value { color:var(--status-bad); }

  .grid-area {
    flex:1; overflow:hidden; display:flex; flex-direction:column; padding:14px 24px 16px;
  }
  .table-fill { flex:1; overflow-y:auto; }
  .table-fill::-webkit-scrollbar { width:6px; }
  .table-fill::-webkit-scrollbar-thumb { background:var(--border-strong); border-radius:3px; }

  .diff-over  { color:var(--status-bad); font-weight:600; }
  .diff-under { color:var(--blue);       font-weight:600; }
  .diff-none  { color:var(--text-mute); }

  .pt { display:inline-block; font-size:11px; padding:0 7px; height:18px; line-height:18px;
        border-radius:2px; border:1px solid; white-space:nowrap; }
  .pt-prov   { border-color:var(--status-warn); color:var(--status-warn); }
  .pt-final  { border-color:var(--blue);        color:var(--blue); }
  .pt-supply { border-color:var(--status-ok);   color:var(--status-ok); }

  .td-link { color:var(--blue); font-weight:600; text-decoration:none; }
  .td-link:hover { text-decoration:underline; }
</style>
</head>

<body data-menu="06-03">
<div class="page-wrap">

  <div class="page-title-bar">
    <span class="page-title">단가 이력 (시계열)</span>
    <div class="page-title-spacer"></div>
    <div class="page-actions">
      <button class="btn btn-secondary" onclick="location.href='06-01_price_list.html'">
        <i data-lucide="arrow-left"></i>목록
      </button>
      <button class="btn btn-secondary" onclick="location.href='06-02_price_detail.html'">
        <i data-lucide="edit-3"></i>상세 편집
      </button>
      <button class="btn btn-primary" onclick="location.href='06-04_price_approval.html'">
        <i data-lucide="file-text"></i>단가 변경 품의
      </button>
    </div>
  </div>

  <!-- 품번 컨텍스트 바 -->
  <div style="padding:8px 24px;background:#f9fafb;border-bottom:1px solid var(--border);font-size:12px;color:var(--text-sub);display:flex;gap:16px;flex-shrink:0">
    <span>품번: <strong style="color:var(--text)">H1110-T100</strong></span>
    <span>품명: <strong style="color:var(--text)">Frame Sub Ass'y</strong></span>
    <span>협력사: <strong style="color:var(--text)">A사</strong></span>
    <span>목표 구매단가: <strong style="color:var(--status-bad)">12,100원</strong></span>
  </div>

  <!-- KPI 카드 -->
  <div class="kpi-row">
    <div class="kpi-card">
      <div class="kpi-label">최초 단가 (가단가)</div>
      <div class="kpi-value">13,200<span style="font-size:14px;font-weight:400"> 원</span></div>
      <div class="kpi-sub">2026-01-15 · 1차 가단가</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">현재 단가 (정단가)</div>
      <div class="kpi-value">14,500<span style="font-size:14px;font-weight:400"> 원</span></div>
      <div class="kpi-sub">2026-04-01 · 3차 정단가</div>
    </div>
    <div class="kpi-card over">
      <div class="kpi-label">최초 대비 누적 변동</div>
      <div class="kpi-value">+1,300<span style="font-size:14px;font-weight:400"> 원</span></div>
      <div class="kpi-sub">+9.8% 인상 · 목표가 대비 +2,400원 초과</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">이력 건수</div>
      <div class="kpi-value">3<span style="font-size:14px;font-weight:400"> 건</span></div>
      <div class="kpi-sub">가단가 2회 → 정단가 1회 전환</div>
    </div>
  </div>

  <!-- 그리드 -->
  <div class="grid-area">
    <div class="table-fill">
      <table class="data-table" style="border:1px solid var(--border);border-radius:4px">
        <thead>
          <tr>
            <th style="width:50px">차수</th>
            <th style="width:80px">단가종류</th>
            <th style="width:110px">확정단가 (원)</th>
            <th style="width:110px">변동액 (원)</th>
            <th style="width:80px">변동률</th>
            <th>변경사유</th>
            <th style="width:100px">변경 트리거</th>
            <th style="width:108px">적용일</th>
            <th style="width:108px">종료일</th>
            <th style="width:80px">승인자</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="c" style="font-weight:600">1차</td>
            <td class="c"><span class="pt pt-prov">가단가</span></td>
            <td class="r" style="font-variant-numeric:tabular-nums;padding-right:12px">13,200</td>
            <td class="c diff-none">—</td>
            <td class="c diff-none">—</td>
            <td style="padding-left:12px">개발 초기 적용 · 도면 Rev.A 기준 산출</td>
            <td class="c muted">DR-2026-0001</td>
            <td class="c muted">2026-01-15</td>
            <td class="c muted">2026-02-28</td>
            <td class="c muted">김구매</td>
          </tr>
          <tr>
            <td class="c" style="font-weight:600">2차</td>
            <td class="c"><span class="pt pt-prov">가단가</span></td>
            <td class="r" style="font-variant-numeric:tabular-nums;padding-right:12px">13,500</td>
            <td class="c diff-over">+300</td>
            <td class="c diff-over">+2.3%</td>
            <td style="padding-left:12px">LME 상승 (Al 6061: 2,520→2,590 USD/MT) 반영</td>
            <td class="c muted">LME 변동 (03-05)</td>
            <td class="c muted">2026-03-01</td>
            <td class="c muted">2026-03-31</td>
            <td class="c muted">김구매</td>
          </tr>
          <tr style="background:var(--blue-light)">
            <td class="c" style="font-weight:700;color:var(--blue)">3차</td>
            <td class="c"><span class="pt pt-final">정단가</span></td>
            <td class="r" style="font-variant-numeric:tabular-nums;padding-right:12px;font-weight:700">14,500</td>
            <td class="c diff-over">+1,000</td>
            <td class="c diff-over">+7.4%</td>
            <td style="padding-left:12px">04-08 협상 3라운드 최종 합의 · Rev.C 도면 확정</td>
            <td class="c muted">협상 완료 (04-08)</td>
            <td class="c muted">2026-04-01</td>
            <td class="c muted">2030-09-30</td>
            <td class="c muted">박부장</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>

<script src="../common/sidebar.js"></script>
<script>lucide.createIcons();</script>
</body>
</html>
```

- [ ] **Step 2: 브라우저에서 확인**
  - KPI 카드 4개 레이아웃 확인
  - 3차 행이 파란 배경(현재 단가) 강조 확인
  - 변동액 컬럼 빨강(인상) 확인
  - [단가 변경 품의] 버튼 → 06-04 이동 확인

- [ ] **Step 3: 커밋**
```
git add mockups/06_price/06-03_price_history.html
git commit -m "feat(06-03): 단가 이력(시계열) 화면 추가"
```

---

## Task 4: 06-04 가단가/정단가/사급단가 품의

**Files:**
- Create: `mockups/06_price/06-04_price_approval.html`

- [ ] **Step 1: 파일 생성**

`mockups/06_price/06-04_price_approval.html` 전체 내용:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1920">
<title>단가 품의 | DevSRM</title>
<link rel="stylesheet" href="../common/tokens.css">
<script src="https://unpkg.com/lucide@latest"></script>
<style>
  /* ── 품의 탭 ── */
  .type-tabs { display:flex; gap:0; border-bottom:2px solid var(--border); margin-bottom:16px; }
  .type-tab {
    padding:0 20px; height:36px; font-size:13px; font-weight:500; cursor:pointer;
    border:none; background:transparent; color:var(--text-sub);
    border-bottom:2px solid transparent; margin-bottom:-2px;
    transition:color .15s, border-color .15s;
  }
  .type-tab.active { color:var(--blue); border-bottom-color:var(--blue); font-weight:600; }
  .type-pane { display:none; }
  .type-pane.active { display:block; }

  /* ── 첨부 체크리스트 ── */
  .checklist { list-style:none; display:flex; flex-direction:column; gap:6px; margin-top:6px; }
  .checklist li { display:flex; align-items:center; gap:8px; font-size:13px; }
  .checklist input[type=checkbox] { width:15px; height:15px; cursor:pointer; accent-color:var(--blue); }
  .checklist .cl-req { color:var(--status-bad); font-size:11px; }

  /* ── 결재선 ── */
  .step-bar { display:flex; align-items:center; gap:0; }
  .step-node { display:flex; align-items:center; }
  .step-box {
    width:110px; border:1px solid var(--border); border-radius:4px;
    padding:8px 10px; display:flex; flex-direction:column; gap:3px;
    background:var(--surface);
  }
  .step-box.done { border-color:var(--status-ok); background:#f0fdf4; }
  .step-box.prog { border-color:var(--blue); background:var(--blue-light); }
  .step-box.wait { border-color:var(--border); background:#f9fafb; }
  .step-role { font-size:10px; color:var(--text-mute); }
  .step-name { font-size:12px; font-weight:600; color:var(--text); }
  .step-date { font-size:10px; color:var(--text-sub); }
  .step-sep {
    width:28px; height:1px; background:var(--border-strong); flex-shrink:0; position:relative;
  }
  .step-sep::after {
    content:''; position:absolute; right:-4px; top:-3px;
    border:4px solid transparent; border-left-color:var(--border-strong);
  }

  .toast {
    position:fixed; bottom:24px; right:24px; background:#1f2937; color:#fff;
    padding:10px 16px; border-radius:4px; font-size:13px;
    z-index:500; display:none; align-items:center; gap:8px;
    box-shadow:0 4px 16px rgba(0,0,0,.18);
  }
  .toast.show { display:flex; }
</style>
</head>

<body data-menu="06-04">
<div class="page-wrap">

  <div class="page-title-bar">
    <span class="page-title">단가 품의</span>
    <div class="page-title-spacer"></div>
    <div class="page-actions">
      <button class="btn btn-secondary" onclick="location.href='06-01_price_list.html'">
        <i data-lucide="arrow-left"></i>목록
      </button>
      <button class="btn btn-secondary" onclick="showToast('임시저장이 완료되었습니다.')">
        <i data-lucide="save"></i>임시저장
      </button>
      <button class="btn btn-primary" onclick="showToast('품의 결재 요청이 완료되었습니다.')">
        <i data-lucide="send"></i>결재 요청
      </button>
    </div>
  </div>

  <div class="content-scroll">

    <!-- 1. 기본 정보 -->
    <div class="section-box">
      <div class="section-box-header">
        <span class="section-box-title">품의 기본 정보</span>
        <span class="badge badge-wait" style="font-size:10px;margin-left:8px">기안 작성 중</span>
      </div>
      <div class="form-row form-row-4">
        <div class="form-field">
          <label class="form-label">품의번호</label>
          <input class="form-input" value="APV-PRC-2026-0031" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
        <div class="form-field">
          <label class="form-label">작성일</label>
          <input type="date" class="form-input" value="2026-06-04">
        </div>
        <div class="form-field">
          <label class="form-label">기안자</label>
          <input class="form-input" value="김구매 (구매팀)" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
        <div class="form-field">
          <label class="form-label">프로젝트</label>
          <input class="form-input" value="PJT-520PHEV-FT-2026" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
      </div>
      <div class="form-row form-row-4">
        <div class="form-field">
          <label class="form-label">품번</label>
          <input class="form-input" value="H1110-T100">
        </div>
        <div class="form-field">
          <label class="form-label">품명</label>
          <input class="form-input" value="Frame Sub Ass'y" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
        <div class="form-field">
          <label class="form-label">협력사</label>
          <input class="form-input" value="A사 (협성알루미늄)" readonly style="background:#f0f2f5;color:var(--text-sub)">
        </div>
        <div class="form-field">
          <label class="form-label">연계 화면</label>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost" style="font-size:12px;padding:0 8px;height:32px" onclick="location.href='../05_quality/05-06_dev_request.html'">05-06 DR</button>
            <button class="btn btn-ghost" style="font-size:12px;padding:0 8px;height:32px" onclick="location.href='06-02_price_detail.html'">06-02 상세</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 단가 유형 탭 -->
    <div class="section-box">
      <div class="section-box-header">
        <span class="section-box-title">단가 유형 선택</span>
      </div>

      <div class="type-tabs">
        <button class="type-tab" onclick="switchTab('prov')">가단가 품의</button>
        <button class="type-tab active" onclick="switchTab('final')">정단가 품의</button>
        <button class="type-tab" onclick="switchTab('supply')">사급단가 품의</button>
      </div>

      <!-- 가단가 패널 -->
      <div class="type-pane" id="pane-prov">
        <div class="form-row form-row-4">
          <div class="form-field">
            <label class="form-label">요청 가단가 (원) <span class="req">*</span></label>
            <input class="form-input num" value="14,200">
          </div>
          <div class="form-field">
            <label class="form-label">적용 시작일 <span class="req">*</span></label>
            <input type="date" class="form-input" value="2026-07-01">
          </div>
          <div class="form-field">
            <label class="form-label">적용 종료일 <span class="req">*</span></label>
            <input type="date" class="form-input" value="2026-09-30">
          </div>
          <div class="form-field">
            <label class="form-label">정단가 전환 예정일</label>
            <input type="date" class="form-input" value="2026-09-30">
          </div>
        </div>
        <div class="form-row form-row-full">
          <div class="form-field">
            <label class="form-label">품의 사유 <span class="req">*</span></label>
            <textarea class="form-textarea" rows="2">개발 초기 단계로 도면 Rev.B 미확정 상태. DR-2026-0042 가단가 결정 기준 적용. PPAP 완료 후 정단가 전환 예정.</textarea>
          </div>
        </div>
        <div style="margin-top:12px">
          <div class="form-label" style="margin-bottom:6px">필수 첨부 서류</div>
          <ul class="checklist">
            <li><input type="checkbox" checked><span>견적서 (A사 제출)</span><span class="cl-req">*필수</span></li>
            <li><input type="checkbox" checked><span>원가 비교표 (내부 기준 vs A사)</span><span class="cl-req">*필수</span></li>
            <li><input type="checkbox"><span>DR 원본 (DR-2026-0042)</span></li>
          </ul>
        </div>
      </div>

      <!-- 정단가 패널 -->
      <div class="type-pane active" id="pane-final">
        <div class="form-row form-row-4">
          <div class="form-field">
            <label class="form-label">요청 정단가 (원) <span class="req">*</span></label>
            <input class="form-input num" value="14,500">
          </div>
          <div class="form-field">
            <label class="form-label">적용 시작일 <span class="req">*</span></label>
            <input type="date" class="form-input" value="2026-04-01">
          </div>
          <div class="form-field">
            <label class="form-label">적용 종료일 <span class="req">*</span></label>
            <input type="date" class="form-input" value="2030-09-30">
          </div>
          <div class="form-field">
            <label class="form-label">LME 기준월</label>
            <input class="form-input" value="2026-03" readonly style="background:#f0f2f5;color:var(--text-sub)">
          </div>
        </div>
        <div class="form-row form-row-4">
          <div class="form-field">
            <label class="form-label">LME 확정가 (USD/MT)</label>
            <input class="form-input num" value="2,650" readonly style="background:#f0f2f5;color:var(--text-sub)">
          </div>
          <div class="form-field">
            <label class="form-label">환율 (KRW/USD)</label>
            <input class="form-input num" value="1,380" readonly style="background:#f0f2f5;color:var(--text-sub)">
          </div>
          <div class="form-field">
            <label class="form-label">도면 리비전</label>
            <input class="form-input" value="Rev.C" readonly style="background:#f0f2f5;color:var(--text-sub)">
          </div>
          <div class="form-field">
            <label class="form-label">조정 조건</label>
            <input class="form-input" value="LME ±10% 초과 시 재협의">
          </div>
        </div>
        <div class="form-row form-row-full">
          <div class="form-field">
            <label class="form-label">품의 사유 <span class="req">*</span></label>
            <textarea class="form-textarea" rows="2">04-08 협상 이력 3라운드 최종 합의 완료. LME/환율/도면 스냅샷 확정. 목표가(12,100원) 대비 +2,400원 초과 — 고객가 재협상 병행 진행 예정.</textarea>
          </div>
        </div>
        <div style="margin-top:12px">
          <div class="form-label" style="margin-bottom:6px">필수 첨부 서류</div>
          <ul class="checklist">
            <li><input type="checkbox" checked><span>LME 확인서 (2026-03 기준)</span><span class="cl-req">*필수</span></li>
            <li><input type="checkbox" checked><span>환율 확인서 (한국은행 기준)</span><span class="cl-req">*필수</span></li>
            <li><input type="checkbox" checked><span>견적 Breakdown (A사 제출본)</span><span class="cl-req">*필수</span></li>
            <li><input type="checkbox" checked><span>협상 결과서 (04-08 이력 출력본)</span><span class="cl-req">*필수</span></li>
            <li><input type="checkbox"><span>도면 Rev.C 확인서</span></li>
          </ul>
        </div>
      </div>

      <!-- 사급단가 패널 -->
      <div class="type-pane" id="pane-supply">
        <div class="form-row form-row-4">
          <div class="form-field">
            <label class="form-label">지급소재 금액 합계 (원)</label>
            <input class="form-input num" value="10,229" readonly style="background:#f0f2f5">
          </div>
          <div class="form-field">
            <label class="form-label">가공비 단가 (원) <span class="req">*</span></label>
            <input class="form-input num" value="4,271">
          </div>
          <div class="form-field">
            <label class="form-label">사급단가 합계 (원)</label>
            <input class="form-input num" value="14,500" readonly style="background:#f0f2f5;font-weight:700;color:var(--navy)">
          </div>
          <div class="form-field">
            <label class="form-label">지급소재 공급 방식</label>
            <select class="form-select">
              <option>동희산업 직납</option>
              <option>지정 업체 공급</option>
            </select>
          </div>
        </div>
        <div class="form-row form-row-2">
          <div class="form-field">
            <label class="form-label">적용 시작일 <span class="req">*</span></label>
            <input type="date" class="form-input" value="2026-04-01">
          </div>
          <div class="form-field">
            <label class="form-label">적용 종료일 <span class="req">*</span></label>
            <input type="date" class="form-input" value="2030-09-30">
          </div>
        </div>
        <div class="form-row form-row-full">
          <div class="form-field">
            <label class="form-label">품의 사유 <span class="req">*</span></label>
            <textarea class="form-textarea" rows="2">지급소재(Al 6061) 동희산업 직납 방식. 가공비만 협력사(A사) 단가로 처리. 소재 LME 변동은 별도 정산.</textarea>
          </div>
        </div>
        <div style="margin-top:12px">
          <div class="form-label" style="margin-bottom:6px">필수 첨부 서류</div>
          <ul class="checklist">
            <li><input type="checkbox" checked><span>소재 공급 단가서</span><span class="cl-req">*필수</span></li>
            <li><input type="checkbox" checked><span>가공비 산출서 (A사)</span><span class="cl-req">*필수</span></li>
            <li><input type="checkbox"><span>지급소재 공급 계약서</span></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 3. 결재선 -->
    <div class="section-box">
      <div class="section-box-header">
        <span class="section-box-title">결재선</span>
      </div>
      <div class="step-bar">
        <div class="step-node">
          <div class="step-box done">
            <span class="step-role">구매담당</span>
            <span class="step-name">김구매</span>
            <span class="step-date">2026-06-04</span>
          </div>
          <div class="step-sep"></div>
        </div>
        <div class="step-node">
          <div class="step-box wait">
            <span class="step-role">구매팀장</span>
            <span class="step-name">이팀장</span>
            <span class="step-date">대기</span>
          </div>
          <div class="step-sep"></div>
        </div>
        <div class="step-node">
          <div class="step-box wait">
            <span class="step-role">구매부장</span>
            <span class="step-name">박부장</span>
            <span class="step-date">대기</span>
          </div>
          <div class="step-sep"></div>
        </div>
        <div class="step-node">
          <div class="step-box wait">
            <span class="step-role">재경팀장</span>
            <span class="step-name">최팀장</span>
            <span class="step-date">대기</span>
          </div>
          <div class="step-sep"></div>
        </div>
        <div class="step-node">
          <div class="step-box wait">
            <span class="step-role">대표이사</span>
            <span class="step-name">정대표</span>
            <span class="step-date">대기</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

<div class="toast" id="toast">
  <i data-lucide="check-circle" style="width:15px;height:15px;color:#4ade80;flex-shrink:0"></i>
  <span id="toast-msg"></span>
</div>

<script>
function switchTab(type) {
  document.querySelectorAll('.type-tab').forEach((t, i) => {
    const types = ['prov', 'final', 'supply'];
    t.classList.toggle('active', types[i] === type);
  });
  document.querySelectorAll('.type-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('pane-' + type).classList.add('active');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
</script>

<script src="../common/sidebar.js"></script>
<script>lucide.createIcons();</script>
</body>
</html>
```

- [ ] **Step 2: 브라우저에서 확인**
  - 기본 탭: 정단가 품의 활성 확인
  - 가단가 탭 전환 → 첨부 체크리스트 다름 확인
  - 사급단가 탭 → 소재/가공비 분리 필드 확인
  - 결재선 5단계 레이아웃 확인

- [ ] **Step 3: 커밋**
```
git add mockups/06_price/06-04_price_approval.html
git commit -m "feat(06-04): 가단가/정단가/사급단가 품의 화면 추가"
```

---

## Task 5: 06-05 단가 미결 현황 모니터링

**Files:**
- Create: `mockups/06_price/06-05_price_pending.html`

- [ ] **Step 1: 파일 생성**

`mockups/06_price/06-05_price_pending.html` 전체 내용:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1920">
<title>단가 미결 현황 모니터링 | DevSRM</title>
<link rel="stylesheet" href="../common/tokens.css">
<script src="https://unpkg.com/lucide@latest"></script>
<style>
  .kpi-row { display:flex; gap:16px; padding:16px 24px 0; flex-shrink:0; }
  .kpi-card {
    flex:1; background:var(--surface); border:1px solid var(--border); border-radius:4px;
    padding:14px 18px; cursor:pointer; transition:border-color .15s;
  }
  .kpi-card:hover { border-color:var(--blue); }
  .kpi-card.active { border-color:var(--blue); border-left:3px solid var(--blue); }
  .kpi-label { font-size:12px; color:var(--text-sub); margin-bottom:6px; }
  .kpi-value { font-size:22px; font-weight:700; color:var(--text); line-height:1.2; }
  .kpi-card.warn .kpi-value { color:var(--status-warn); }
  .kpi-card.bad  .kpi-value { color:var(--status-bad); }
  .kpi-sub { font-size:11px; color:var(--text-sub); margin-top:4px; }

  .grid-area {
    flex:1; overflow:hidden; display:flex; flex-direction:column; padding:14px 24px 16px;
  }
  .table-fill { flex:1; overflow-y:auto; }
  .table-fill::-webkit-scrollbar { width:6px; }
  .table-fill::-webkit-scrollbar-thumb { background:var(--border-strong); border-radius:3px; }

  .row-warn { background:#fefce8 !important; }
  .row-bad  { background:#fef2f2 !important; }
  .row-warn:hover { background:#fef9c3 !important; }
  .row-bad:hover  { background:#fee2e2 !important; }

  .pt { display:inline-block; font-size:11px; padding:0 7px; height:18px; line-height:18px;
        border-radius:2px; border:1px solid; white-space:nowrap; }
  .pt-prov   { border-color:var(--status-warn); color:var(--status-warn); }
  .pt-final  { border-color:var(--blue);        color:var(--blue); }

  .td-act { color:var(--blue); text-decoration:none; font-size:12px; }
  .td-act:hover { text-decoration:underline; }

  .days-over60 { color:var(--status-bad); font-weight:700; }
  .days-over30 { color:var(--status-warn); font-weight:600; }
</style>
</head>

<body data-menu="06-05">
<div class="page-wrap">

  <div class="page-title-bar">
    <span class="page-title">단가 미결 현황 모니터링</span>
    <div class="page-title-spacer"></div>
    <div class="page-actions">
      <button class="btn btn-secondary" onclick="location.href='06-04_price_approval.html'">
        <i data-lucide="file-text"></i>품의 등록
      </button>
    </div>
  </div>

  <div class="search-bar" style="gap:8px">
    <div class="search-wrap">
      <input type="text" id="f-search" placeholder="Search" oninput="applyFilter()">
      <i data-lucide="search" class="s-icon" style="width:15px;height:15px"></i>
    </div>
    <button class="btn-filter" onclick="toggleFilter()">
      <i data-lucide="filter" style="width:14px;height:14px;color:#dc2626"></i>필터
    </button>
    <div class="date-range">
      <input type="date" id="f-from" value="2026-01-01" onchange="applyFilter()">
      <span class="dr-sep">~</span>
      <input type="date" id="f-to" value="2026-12-31" onchange="applyFilter()">
      <i data-lucide="calendar" style="width:14px;height:14px;color:var(--text-mute);margin-left:2px"></i>
    </div>
  </div>

  <div class="filter-panel" id="filter-panel">
    <div class="search-field">
      <span class="search-label">단가종류</span>
      <select class="search-input" id="f-type" style="width:110px;height:28px;padding:0 8px;cursor:pointer" onchange="applyFilter()">
        <option value="">전체</option>
        <option value="가단가">가단가</option>
        <option value="정단가">정단가</option>
      </select>
    </div>
    <div class="search-field">
      <span class="search-label">담당자</span>
      <select class="search-input" id="f-mgr" style="width:100px;height:28px;padding:0 8px;cursor:pointer" onchange="applyFilter()">
        <option value="">전체</option>
        <option value="김구매">김구매</option>
        <option value="이구매">이구매</option>
      </select>
    </div>
  </div>

  <!-- KPI -->
  <div class="kpi-row">
    <div class="kpi-card active" id="kpi-all" onclick="setDaysFilter(0)">
      <div class="kpi-label">전체 미결</div>
      <div class="kpi-value" id="kpi-all-val">5</div>
      <div class="kpi-sub">품의 진행 중</div>
    </div>
    <div class="kpi-card warn" id="kpi-30" onclick="setDaysFilter(30)">
      <div class="kpi-label">30일 초과</div>
      <div class="kpi-value" id="kpi-30-val">3</div>
      <div class="kpi-sub">노란 행 표시 — 경고</div>
    </div>
    <div class="kpi-card bad" id="kpi-60" onclick="setDaysFilter(60)">
      <div class="kpi-label">60일 초과</div>
      <div class="kpi-value" id="kpi-60-val">1</div>
      <div class="kpi-sub">빨간 행 표시 — 즉시 조치</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">평균 미결 일수</div>
      <div class="kpi-value" id="kpi-avg">38</div>
      <div class="kpi-sub">전월 대비 +12일</div>
    </div>
  </div>

  <!-- 그리드 -->
  <div class="grid-area">
    <div class="table-fill">
      <table class="data-table" id="tbl" style="border:1px solid var(--border);border-radius:4px">
        <thead>
          <tr>
            <th style="width:40px"><input type="checkbox"></th>
            <th style="width:120px">품번</th>
            <th>품명</th>
            <th style="width:80px">단가종류</th>
            <th style="width:108px">가단가 적용일</th>
            <th style="width:80px">미결일수</th>
            <th style="width:108px">예상 확정일</th>
            <th style="width:80px">담당자</th>
            <th style="width:80px">협력사</th>
            <th style="width:100px">조치</th>
          </tr>
        </thead>
        <tbody id="tbody"></tbody>
      </table>
    </div>
  </div>

</div>

<script>
const DATA = [
  { part:'H1110-T100', name:"Frame Sub Ass'y",    type:'정단가', start:'2026-04-01', days:64, est:'2026-06-10', mgr:'김구매', sup:'A사' },
  { part:'H1110-T101', name:'Bracket Assy Upper',  type:'가단가', start:'2026-03-01', days:95, est:'2026-06-30', mgr:'김구매', sup:'B사' },
  { part:'H1110-T102', name:'Cover Plate',         type:'가단가', start:'2026-04-10', days:55, est:'2026-07-15', mgr:'이구매', sup:'A사' },
  { part:'H1110-T103', name:'Rubber Seal',         type:'가단가', start:'2026-05-01', days:34, est:'2026-07-31', mgr:'이구매', sup:'C사' },
  { part:'H1110-T104', name:'Pipe Connector',      type:'가단가', start:'2026-05-20', days:15, est:'2026-08-01', mgr:'김구매', sup:'B사' },
];

const TYPE_CLS = { '가단가':'pt-prov', '정단가':'pt-final' };
let currentSt = '';
let minDays = 0;

function rowClass(days) {
  if (days > 60) return 'row-bad';
  if (days > 30) return 'row-warn';
  return '';
}
function daysCls(days) {
  if (days > 60) return 'days-over60';
  if (days > 30) return 'days-over30';
  return '';
}

function applyFilter() {
  const q    = document.getElementById('f-search').value.trim().toLowerCase();
  const type = document.getElementById('f-type')?.value || '';
  const mgr  = document.getElementById('f-mgr')?.value || '';

  const rows = DATA.filter(d => {
    if (d.days < minDays) return false;
    if (q && !d.part.toLowerCase().includes(q) && !d.name.toLowerCase().includes(q)) return false;
    if (type && d.type !== type) return false;
    if (mgr  && d.mgr  !== mgr)  return false;
    return true;
  });
  renderRows(rows);
}

function renderRows(rows) {
  document.getElementById('tbody').innerHTML = rows.map(d => `
    <tr class="${rowClass(d.days)}">
      <td class="c" onclick="event.stopPropagation()"><input type="checkbox"></td>
      <td class="c" style="font-weight:600;color:var(--blue)">${d.part}</td>
      <td style="padding-left:12px">${d.name}</td>
      <td class="c"><span class="pt ${TYPE_CLS[d.type]}">${d.type}</span></td>
      <td class="c muted">${d.start}</td>
      <td class="c"><span class="${daysCls(d.days)}">${d.days}일</span></td>
      <td class="c muted">${d.est}</td>
      <td class="c muted">${d.mgr}</td>
      <td class="c muted">${d.sup}</td>
      <td class="c"><a class="td-act" href="06-04_price_approval.html">품의 진행</a></td>
    </tr>`).join('');
}

function setDaysFilter(min) {
  minDays = min;
  document.querySelectorAll('.kpi-card').forEach(c => c.classList.remove('active'));
  if (min === 0)  document.getElementById('kpi-all').classList.add('active');
  if (min === 30) document.getElementById('kpi-30').classList.add('active');
  if (min === 60) document.getElementById('kpi-60').classList.add('active');
  applyFilter();
}

function toggleFilter() { document.getElementById('filter-panel').classList.toggle('open'); }

/* KPI 집계 */
document.getElementById('kpi-all-val').textContent = DATA.length;
document.getElementById('kpi-30-val').textContent  = DATA.filter(d => d.days > 30).length;
document.getElementById('kpi-60-val').textContent  = DATA.filter(d => d.days > 60).length;
const avg = Math.round(DATA.reduce((s, d) => s + d.days, 0) / DATA.length);
document.getElementById('kpi-avg').textContent = avg;

applyFilter();
</script>

<script src="../common/sidebar.js"></script>
<script>lucide.createIcons();</script>
</body>
</html>
```

- [ ] **Step 2: 브라우저에서 확인**
  - H1110-T101(95일), H1110-T100(64일) 빨간 행 확인
  - H1110-T102(55일), H1110-T103(34일) 노란 행 확인
  - KPI 카드 클릭 시 필터 동작 확인 (30일 초과: 3건 표시)
  - [품의 진행] 링크 → 06-04 이동 확인

- [ ] **Step 3: 커밋**
```
git add mockups/06_price/06-05_price_pending.html
git commit -m "feat(06-05): 단가 미결 현황 모니터링 화면 추가"
```

---

## Task 6: 06-06 임의정산(소급정산) 관리

**Files:**
- Create: `mockups/06_price/06-06_retroactive.html`

- [ ] **Step 1: 파일 생성**

`mockups/06_price/06-06_retroactive.html` 전체 내용:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1920">
<title>임의정산(소급정산) 관리 | DevSRM</title>
<link rel="stylesheet" href="../common/tokens.css">
<script src="https://unpkg.com/lucide@latest"></script>
<style>
  .grid-area {
    flex:1; overflow:hidden; display:flex; flex-direction:column; padding:14px 24px 16px;
  }
  .table-fill { flex:1; overflow-y:auto; }
  .table-fill::-webkit-scrollbar { width:6px; }
  .table-fill::-webkit-scrollbar-thumb { background:var(--border-strong); border-radius:3px; }

  .st { display:inline-flex; align-items:center; gap:5px; font-size:12px; white-space:nowrap; }
  .st::before { content:''; width:6px; height:6px; border-radius:50%; flex-shrink:0; }
  .st-ok   { color:var(--status-ok);  } .st-ok::before   { background:var(--status-ok); }
  .st-prog { color:var(--text-sub);   } .st-prog::before { background:var(--text-sub); }
  .st-wait { color:var(--text-mute);  } .st-wait::before { background:var(--border-strong); }

  .diff-over  { color:var(--status-bad); font-weight:600; }
  .diff-under { color:var(--blue);       font-weight:600; }

  /* ── 슬라이드 패널 ── */
  .slide-panel {
    position:fixed; top:48px; right:0; bottom:0; width:420px;
    background:var(--surface); border-left:1px solid var(--border);
    box-shadow:-4px 0 16px rgba(0,0,0,.1);
    transform:translateX(100%); transition:transform .2s ease-out;
    z-index:100; display:flex; flex-direction:column;
  }
  .slide-panel.open { transform:translateX(0); }
  .slide-header {
    padding:0 20px; height:48px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
  }
  .slide-title { font-size:14px; font-weight:600; color:var(--text); }
  .slide-body { flex:1; overflow-y:auto; padding:20px; }
  .slide-footer {
    padding:12px 20px; border-top:1px solid var(--border);
    display:flex; gap:8px; justify-content:flex-end; flex-shrink:0;
  }

  /* ── 합계 행 ── */
  tr.total-row td {
    background:var(--navy); color:#fff; font-weight:700;
    border-bottom:none;
  }

  /* 정산방식 뱃지 */
  .method {
    display:inline-block; font-size:11px; padding:0 7px; height:18px; line-height:18px;
    border-radius:2px; border:1px solid; white-space:nowrap;
  }
  .method-tax    { border-color:var(--blue);        color:var(--blue); }
  .method-offset { border-color:var(--status-warn); color:var(--status-warn); }

  .toast {
    position:fixed; bottom:24px; right:440px; background:#1f2937; color:#fff;
    padding:10px 16px; border-radius:4px; font-size:13px;
    z-index:500; display:none; align-items:center; gap:8px;
    box-shadow:0 4px 16px rgba(0,0,0,.18);
  }
  .toast.show { display:flex; }
</style>
</head>

<body data-menu="06-06">
<div class="page-wrap">

  <div class="page-title-bar">
    <span class="page-title">임의정산(소급정산) 관리</span>
    <div class="page-title-spacer"></div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="openPanel()">
        <i data-lucide="plus"></i>정산 등록
      </button>
    </div>
  </div>

  <div class="search-bar" style="gap:8px">
    <div class="search-wrap">
      <input type="text" id="f-search" placeholder="Search" oninput="applyFilter()">
      <i data-lucide="search" class="s-icon" style="width:15px;height:15px"></i>
    </div>
    <button class="btn-filter" onclick="toggleFilter()">
      <i data-lucide="filter" style="width:14px;height:14px;color:#dc2626"></i>필터
    </button>
    <button class="btn-status" onclick="toggleStatusPanel()">
      <i data-lucide="bar-chart-2" style="width:14px;height:14px;color:var(--blue)"></i>상태
    </button>
    <div class="date-range">
      <input type="date" id="f-from" value="2026-01-01" onchange="applyFilter()">
      <span class="dr-sep">~</span>
      <input type="date" id="f-to" value="2026-12-31" onchange="applyFilter()">
      <i data-lucide="calendar" style="width:14px;height:14px;color:var(--text-mute);margin-left:2px"></i>
    </div>
  </div>

  <div class="filter-panel" id="filter-panel">
    <div class="search-field">
      <span class="search-label">정산방식</span>
      <select class="search-input" id="f-method" style="width:120px;height:28px;padding:0 8px;cursor:pointer" onchange="applyFilter()">
        <option value="">전체</option>
        <option value="세금계산서">세금계산서</option>
        <option value="상계">상계</option>
      </select>
    </div>
  </div>

  <div class="status-strip" id="status-strip">
    <button class="ss-btn active" onclick="setStatus('')">전체 <span class="ss-cnt" id="cnt-all">0</span></button>
    <button class="ss-btn" onclick="setStatus('완료')">완료 <span class="ss-cnt" id="cnt-ok">0</span></button>
    <button class="ss-btn" onclick="setStatus('진행')">진행 <span class="ss-cnt" id="cnt-prog">0</span></button>
    <button class="ss-btn" onclick="setStatus('대기')">대기 <span class="ss-cnt" id="cnt-wait">0</span></button>
  </div>

  <div class="grid-area">
    <div class="table-fill">
      <table class="data-table" id="tbl" style="border:1px solid var(--border);border-radius:4px">
        <thead>
          <tr>
            <th style="width:40px"><input type="checkbox"></th>
            <th style="width:120px">품번</th>
            <th style="width:180px">소급 기간</th>
            <th style="width:100px">기준단가(원)</th>
            <th style="width:100px">변경단가(원)</th>
            <th style="width:90px">차액/개(원)</th>
            <th style="width:90px">소급수량</th>
            <th style="width:110px">총 차액(원)</th>
            <th style="width:80px">정산방식</th>
            <th style="width:80px">상태</th>
            <th style="width:108px">완료일</th>
          </tr>
        </thead>
        <tbody id="tbody"></tbody>
        <tfoot id="tfoot"></tfoot>
      </table>
    </div>
  </div>

</div>

<!-- 정산 등록 슬라이드 패널 -->
<div class="slide-panel" id="slide-panel">
  <div class="slide-header">
    <span class="slide-title">소급정산 등록</span>
    <button class="btn btn-ghost" style="padding:0 8px" onclick="closePanel()">
      <i data-lucide="x" style="width:16px;height:16px"></i>
    </button>
  </div>
  <div class="slide-body">
    <div class="form-field" style="margin-bottom:14px">
      <label class="form-label">품번 선택 <span class="req">*</span></label>
      <select class="form-select" id="sp-part" onchange="loadPartData()">
        <option value="">품번 선택</option>
        <option value="H1110-T100">H1110-T100 · Frame Sub Ass'y</option>
        <option value="H1110-T101">H1110-T101 · Bracket Assy Upper</option>
        <option value="H1110-T102">H1110-T102 · Cover Plate</option>
      </select>
    </div>
    <div id="sp-info" style="display:none;background:#f9fafb;border:1px solid var(--border);border-radius:4px;padding:10px 12px;margin-bottom:14px;font-size:12px">
      <div style="display:flex;gap:16px">
        <span>기준단가: <strong id="sp-base" style="color:var(--text)"></strong></span>
        <span>변경단가: <strong id="sp-new" style="color:var(--blue)"></strong></span>
      </div>
      <div style="margin-top:4px">단가 차액/개: <strong id="sp-diff" style="color:var(--status-bad)"></strong></div>
    </div>
    <div class="form-row form-row-2" style="margin-bottom:14px">
      <div class="form-field">
        <label class="form-label">소급 시작일 <span class="req">*</span></label>
        <input type="date" class="form-input" id="sp-from" value="2026-01-15" oninput="calcTotal()">
      </div>
      <div class="form-field">
        <label class="form-label">소급 종료일 <span class="req">*</span></label>
        <input type="date" class="form-input" id="sp-to" value="2026-03-31" oninput="calcTotal()">
      </div>
    </div>
    <div class="form-field" style="margin-bottom:14px">
      <label class="form-label">소급 수량 (개) <span class="req">*</span></label>
      <input class="form-input num" id="sp-qty" placeholder="0" oninput="calcTotal()">
    </div>
    <div class="form-field" style="margin-bottom:14px">
      <label class="form-label">총 차액 (원)</label>
      <input class="form-input num result" id="sp-total" readonly placeholder="수량 입력 후 자동 계산" style="background:#f0f2f5;font-weight:700">
    </div>
    <div class="form-field" style="margin-bottom:14px">
      <label class="form-label">정산 방식 <span class="req">*</span></label>
      <select class="form-select" id="sp-method">
        <option>세금계산서 발행</option>
        <option>상계 처리</option>
      </select>
    </div>
    <div class="form-field">
      <label class="form-label">비고</label>
      <textarea class="form-textarea" rows="2" placeholder="정산 사유 또는 특이사항"></textarea>
    </div>
  </div>
  <div class="slide-footer">
    <button class="btn btn-secondary" onclick="closePanel()">취소</button>
    <button class="btn btn-primary" onclick="savePanel()">
      <i data-lucide="save" style="width:14px;height:14px"></i>저장
    </button>
  </div>
</div>

<div class="toast" id="toast">
  <i data-lucide="check-circle" style="width:15px;height:15px;color:#4ade80;flex-shrink:0"></i>
  <span id="toast-msg"></span>
</div>

<script>
const DATA = [
  { part:'H1110-T100', period:'2026-01-15 ~ 2026-03-31', base:13200, newp:14500, diff:1300, qty:25000, total:32500000, method:'세금계산서', st:'완료', done:'2026-04-20' },
  { part:'H1110-T100', period:'2026-02-01 ~ 2026-02-28', base:13200, newp:13500, diff:300,  qty:8000,  total:2400000,  method:'상계',     st:'완료', done:'2026-03-10' },
  { part:'H1110-T101', period:'2026-03-01 ~ 2026-04-30', base:8200,  newp:8500,  diff:300,  qty:15000, total:4500000,  method:'세금계산서', st:'진행', done:'—' },
  { part:'H1110-T102', period:'2026-04-10 ~ 2026-05-31', base:5600,  newp:5800,  diff:200,  qty:20000, total:4000000,  method:'상계',     st:'대기', done:'—' },
];

const ST_CLS    = { '완료':'st-ok', '진행':'st-prog', '대기':'st-wait' };
const METHOD_CLS= { '세금계산서':'method-tax', '상계':'method-offset' };
let currentSt = '';

function fmt(n) { return n.toLocaleString(); }

function applyFilter() {
  const q      = document.getElementById('f-search').value.trim().toLowerCase();
  const method = document.getElementById('f-method')?.value || '';
  const rows = DATA.filter(d => {
    if (currentSt && d.st !== currentSt) return false;
    if (q && !d.part.toLowerCase().includes(q)) return false;
    if (method && d.method !== method) return false;
    return true;
  });
  renderRows(rows);
  updateCounts();
}

function renderRows(rows) {
  document.getElementById('tbody').innerHTML = rows.map(d => {
    const diffCls = d.diff > 0 ? 'diff-over' : 'diff-under';
    return `<tr>
      <td class="c" onclick="event.stopPropagation()"><input type="checkbox"></td>
      <td class="c" style="font-weight:600;color:var(--blue)">${d.part}</td>
      <td class="c muted" style="font-size:11px">${d.period}</td>
      <td class="r" style="padding-right:10px;font-variant-numeric:tabular-nums">${fmt(d.base)}</td>
      <td class="r" style="padding-right:10px;font-variant-numeric:tabular-nums;color:var(--blue);font-weight:600">${fmt(d.newp)}</td>
      <td class="r ${diffCls}" style="padding-right:10px">+${fmt(d.diff)}</td>
      <td class="r" style="padding-right:10px;font-variant-numeric:tabular-nums">${fmt(d.qty)}</td>
      <td class="r" style="padding-right:10px;font-variant-numeric:tabular-nums;font-weight:600">${fmt(d.total)}</td>
      <td class="c"><span class="method ${METHOD_CLS[d.method]}">${d.method}</span></td>
      <td class="c"><span class="st ${ST_CLS[d.st]}">${d.st}</span></td>
      <td class="c muted">${d.done}</td>
    </tr>`;
  }).join('');

  /* 합계 행 */
  const totalAmt = rows.reduce((s, d) => s + d.total, 0);
  document.getElementById('tfoot').innerHTML = `
    <tr class="total-row">
      <td colspan="7" style="text-align:right;padding-right:10px">합계</td>
      <td style="text-align:right;padding-right:10px;font-variant-numeric:tabular-nums">${fmt(totalAmt)}</td>
      <td colspan="3"></td>
    </tr>`;
}

function updateCounts() {
  document.getElementById('cnt-all').textContent  = DATA.length;
  document.getElementById('cnt-ok').textContent   = DATA.filter(d => d.st === '완료').length;
  document.getElementById('cnt-prog').textContent = DATA.filter(d => d.st === '진행').length;
  document.getElementById('cnt-wait').textContent = DATA.filter(d => d.st === '대기').length;
}

function setStatus(st) {
  currentSt = st;
  document.querySelectorAll('.ss-btn').forEach(b => b.classList.remove('active'));
  ['', '완료', '진행', '대기'].forEach((s, i) => {
    if (s === st) document.querySelectorAll('.ss-btn')[i]?.classList.add('active');
  });
  applyFilter();
}

function toggleFilter() { document.getElementById('filter-panel').classList.toggle('open'); }
function toggleStatusPanel() {
  const el = document.getElementById('status-strip');
  el.style.display = el.style.display === 'none' ? 'flex' : 'none';
}

function openPanel() {
  document.getElementById('slide-panel').classList.add('open');
  lucide.createIcons();
}
function closePanel() {
  document.getElementById('slide-panel').classList.remove('open');
}

const PART_DATA = {
  'H1110-T100': { base:13200, newp:14500 },
  'H1110-T101': { base:8200,  newp:8500 },
  'H1110-T102': { base:5600,  newp:5800 },
};

function loadPartData() {
  const part = document.getElementById('sp-part').value;
  const info = document.getElementById('sp-info');
  if (!part || !PART_DATA[part]) { info.style.display='none'; return; }
  const d = PART_DATA[part];
  document.getElementById('sp-base').textContent = d.base.toLocaleString() + '원';
  document.getElementById('sp-new').textContent  = d.newp.toLocaleString() + '원';
  document.getElementById('sp-diff').textContent = '+' + (d.newp - d.base).toLocaleString() + '원';
  info.style.display = 'block';
  calcTotal();
}

function calcTotal() {
  const part = document.getElementById('sp-part').value;
  const qty  = parseInt(document.getElementById('sp-qty').value.replace(/,/g,'')) || 0;
  if (!part || !PART_DATA[part] || !qty) { document.getElementById('sp-total').value=''; return; }
  const diff  = PART_DATA[part].newp - PART_DATA[part].base;
  const total = diff * qty;
  document.getElementById('sp-total').value = total.toLocaleString();
}

function savePanel() {
  closePanel();
  showToast('소급정산이 등록되었습니다.');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

applyFilter();
</script>

<script src="../common/sidebar.js"></script>
<script>lucide.createIcons();</script>
</body>
</html>
```

- [ ] **Step 2: 브라우저에서 확인**
  - [정산 등록] 버튼 → 우측 슬라이드 패널 열림 확인
  - 품번 선택 → 기준/변경단가 자동 표시 확인
  - 수량 입력 → 총 차액 자동 계산 확인
  - 그리드 하단 합계 행(navy 배경) 확인
  - 상태 스트립, 필터 동작 확인

- [ ] **Step 3: 커밋**
```
git add mockups/06_price/06-06_retroactive.html
git commit -m "feat(06-06): 임의정산(소급정산) 관리 화면 추가"
```

---

## Task 7: index.html + PROGRESS.md 업데이트

**Files:**
- Modify: `mockups/index.html`
- Modify: `docs/PROGRESS.md`

- [ ] **Step 1: index.html 06. 단가관리 섹션 교체**

`mockups/index.html` 내 기존 06. 단가관리 섹션을 아래로 교체한다.

찾을 문자열:
```html
      <!-- 06. 단가관리 -->
      <div class="module">
        <div class="module-title">
          <i data-lucide="tag" style="width:13px;height:13px"></i>
          06. 단가관리
        </div>
        <ul class="screen-list">
          <li class="screen-item">
            <span class="screen-code">06-01</span>
            <span class="screen-name">확정단가 목록</span>
            <span class="screen-badge todo">미작업</span>
          </li>
          <li class="screen-item">
            <span class="screen-code">06-02</span>
            <span class="screen-name">확정단가 등록/상세</span>
            <span class="screen-badge todo">미작업</span>
          </li>
          <li class="screen-item">
            <span class="screen-code">06-03</span>
            <span class="screen-name">단가 이력 (시계열)</span>
            <span class="screen-badge todo">미작업</span>
          </li>
        </ul>
      </div>
```

교체할 문자열:
```html
      <!-- 06. 단가관리 -->
      <div class="module">
        <div class="module-title">
          <i data-lucide="tag" style="width:13px;height:13px"></i>
          06. 단가관리
        </div>
        <ul class="screen-list">
          <li class="screen-item">
            <span class="screen-code">06-01</span>
            <a href="06_price/06-01_price_list.html" class="screen-link">확정단가 목록</a>
            <span class="screen-badge">완료</span>
          </li>
          <li class="screen-item">
            <span class="screen-code">06-02</span>
            <a href="06_price/06-02_price_detail.html" class="screen-link">확정단가 등록/상세</a>
            <span class="screen-badge">완료</span>
          </li>
          <li class="screen-item">
            <span class="screen-code">06-03</span>
            <a href="06_price/06-03_price_history.html" class="screen-link">단가 이력 (시계열)</a>
            <span class="screen-badge">완료</span>
          </li>
          <li class="screen-item">
            <span class="screen-code">06-04</span>
            <a href="06_price/06-04_price_approval.html" class="screen-link">가단가/정단가/사급단가 품의</a>
            <span class="screen-badge">완료</span>
          </li>
          <li class="screen-item">
            <span class="screen-code">06-05</span>
            <a href="06_price/06-05_price_pending.html" class="screen-link">단가 미결 현황 모니터링</a>
            <span class="screen-badge">완료</span>
          </li>
          <li class="screen-item">
            <span class="screen-code">06-06</span>
            <a href="06_price/06-06_retroactive.html" class="screen-link">임의정산(소급정산) 관리</a>
            <span class="screen-badge">완료</span>
          </li>
        </ul>
      </div>
```

- [ ] **Step 2: PROGRESS.md 06 섹션 업데이트**

`docs/PROGRESS.md`에서:
- `진행: 29 / 56` → `진행: 35 / 56`
- `## 06. 단가관리` 섹션의 6개 항목 모두 `[ ]` → `[x]` 변경

- [ ] **Step 3: 커밋**
```
git add mockups/index.html docs/PROGRESS.md
git commit -m "docs: 06. 단가관리 6개 화면 index 링크 추가 및 진행률 갱신"
```

---

## 자기검토 (Spec Coverage)

| 스펙 요구사항 | 구현 Task |
|---|---|
| 06-01 목록: 단가종류 테두리 뱃지 | Task 1 (`.pt` 클래스) |
| 06-01 목록: 목표가 대비 빨강/파랑 | Task 1 (`.diff-over/.diff-under`) |
| 06-02 상세: 단가 종류 3탭 | Task 2 (`switchTab()`) |
| 06-02 상세: LME 스냅샷 표 | Task 2 (snap-table) |
| 06-02 상세: 사급단가 소재 명세 | Task 2 (supply-table) |
| 06-02 상세: 결재선 5단계 | Task 2 (step-bar) |
| 06-03 이력: KPI 카드 4개 | Task 3 |
| 06-03 이력: 현재 차수 파란 배경 | Task 3 (row style) |
| 06-04 품의: 3탭 + 첨부 체크리스트 | Task 4 |
| 06-04 품의: 결재선 5단계 | Task 4 (step-bar) |
| 06-05 모니터링: 행 배경 30/60일 구분 | Task 5 (`.row-warn/.row-bad`) |
| 06-05 모니터링: KPI 카드 클릭 필터 | Task 5 (`setDaysFilter()`) |
| 06-06 정산: 슬라이드 패널 | Task 6 (`.slide-panel`) |
| 06-06 정산: 차액 자동 계산 | Task 6 (`calcTotal()`) |
| 06-06 정산: 합계 행 고정 | Task 6 (`tfoot` + `.total-row`) |
| index.html 링크 6개 추가 | Task 7 |
| PROGRESS.md 35/56 갱신 | Task 7 |
