# 00-02 메인 대시보드 재구성 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 00-02 메인 대시보드를 실제 구현 화면 데이터로 채우고 3열 균등+stretch 레이아웃으로 재작성해 하단 공백을 제거한다.

**Architecture:** 기존 `00-02_dashboard.html`의 CSS 클래스(kpi-tile, cbar, donut, appr-item, sop-item, lme-grid, todo-t, sc-grid)는 재사용하고, `.dash-grid`를 `1fr 1fr 1fr` + `align-items:stretch`로 바꾸며 퍼널 위젯을 제거한다. body 위젯 데이터를 01-03/09-02/06-02/03-08 실데이터로 교체.

**Tech Stack:** Standalone HTML, tokens.css, lucide CDN, vanilla JS.

---

## 파일 구조

| 작업 | 경로 |
|------|------|
| Overwrite | `mockups/00_common/00-02_dashboard.html` (전면 재작성) |

index.html/PROGRESS.md/sidebar.js 변경 없음 (00-02는 이미 완료, 재작성만).

---

## Task 1: 대시보드 전면 재작성

**Files:** Overwrite `mockups/00_common/00-02_dashboard.html`

- [ ] **Step 1: CSS 레이아웃 변경**

`.dash-grid`를 균등 stretch로 교체, 퍼널(.funnel/.fn-*) CSS 제거, 박스 height:100% 추가:
```css
.dash-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
  align-items: stretch;
  margin-bottom: 14px;
}
.dash-grid > .section-box { height: 100%; display: flex; flex-direction: column; margin-bottom: 0; }
.dash-grid > .section-box > .section-box-header { flex-shrink: 0; }
```
나머지 위젯 CSS(kpi-row, kpi-tile, cbar-*, donut-*, appr-item, sop-item, lme-grid, todo-t, sc-grid, dash-bottom)는 기존 그대로 유지.

- [ ] **Step 2: body 재작성 — 행1 KPI 스트립 (6타일)**

`.kpi-row` 6타일 데이터:
| 순 | num | label | hint | tile/icon |
|---|---|---|---|---|
| 1 | 4 | 진행 중 프로젝트 | 지연 1 포함 · 완료 1 별도 | prog / folder-open |
| 2 | 1 | 지연 프로젝트 | Reinforcement 78% | bad / triangle-alert |
| 3 | 1 | 목표가 초과 품번 | H1110-T100 +19.8% | bad / trending-up |
| 4 | 1 | 협상 / 결재 진행 | 520 PHEV FTM | warn / handshake |
| 5 | 1 | 단가 미결 | 정단가 전환 대기 | warn / clock |
| 6 | 1 | 협력사 S등급 | A사 (동희부품) | ok / award |

- [ ] **Step 3: body — 행2 dash-grid 3박스**

**박스① 개발 프로젝트 현황** (data-table, 5행)
헤더: 프로젝트명 / 차종 / 대표품번 / 현재단계 / 진행(prog-bar 또는 ps 점) / SOP / PM / 상태
헤더 우측 [전체 보기]→01-03_project_list.html
5행(01-03 데이터):
```
Fuel Tank Module | 520 PHEV(현대) | H1110-T100 외4 | 개발구매 | 45% | 2026-10 | 김개발 | 진행중(prog)   → 01-04
Cooling Module   | NX5(기아)      | K2200-C100     | 원가산출 | 22% | 2026-12 | 이프로 | 진행중(prog)   → 01-03
Bracket Assy     | MQ4(모비스)    | M3300-B100     | 설계     | 12% | 2027-01 | 박PM   | 진행중(prog)   → 01-03
Reinforcement    | 520 PHEV(현대) | H1120-R100     | 품질준비 | 78% | 2026-09 | 김개발 | 지연(bad)      → 01-03
Heat Protector   | NX5(기아)      | K2210-H100     | 양산전환 | 100%| 2026-03 | 이프로 | 완료(ok)       → 01-03
```
진행 셀: `.prog-cell`(.prog-bar/.prog-fill/.prog-pct) 사용. 상태: `.st` 점+텍스트(st-prog/st-bad/st-ok). prog-cell/st CSS는 없으면 추가:
```css
.prog-cell { display:flex; align-items:center; gap:6px; }
.prog-bar { flex:1; height:6px; background:var(--grid-head); border-radius:3px; overflow:hidden; min-width:40px; }
.prog-fill { height:100%; background:var(--blue); border-radius:3px; }
.prog-pct { font-size:11px; color:var(--text-sub); width:32px; text-align:right; font-variant-numeric:tabular-nums; }
.st { display:inline-flex; align-items:center; gap:5px; font-size:12px; white-space:nowrap; }
.st::before { content:''; width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.st-prog { color:var(--status-prog);} .st-prog::before { background:var(--status-prog); }
.st-bad  { color:var(--status-bad); } .st-bad::before  { background:var(--status-bad); }
.st-ok   { color:var(--status-ok);  } .st-ok::before   { background:var(--status-ok); }
```

**박스② 목표가 대비 원가 현황** (cbar 3개)
헤더 [상세 보기]→03-08_cost_analysis.html
- 520 PHEV · Fuel Tank Module: 목표 12,100 / 현재 14,500 / +19.8% 초과(over). tgt width 80.7%, act over width 96.7%, foot ▲ +2,400원
- NX5 · Cooling Module: 목표 18,500 / 현재 17,800 / -3.8% 달성(under). tgt 92.5%, act under 89%, foot ▼ -700원
- MQ4 · Bracket Assy: 목표 9,500 / 현재 9,200 / -3.2% 달성(under). tgt 95%, act under 92%, foot ▼ -300원

**박스③ SOP 임박 현황** (sop-item 4건)
헤더 [일정]→01-05_milestone.html (a 링크)
- D-89 warn / H1120-R100 / 520 PHEV · Reinforcement / 2026-09-01
- D-119 ok / H1110-T100 / 520 PHEV · Fuel Tank Module / 2026-10-01
- D-180 ok / K2200-C100 / NX5 · Cooling Module / 2026-12-01
- D-225 ok / M3300-B100 / MQ4 · Bracket Assy / 2027-01-15
(D-89는 지연 프로젝트이므로 warn 배지)

- [ ] **Step 4: body — 행3 dash-grid 3박스**

**박스④ 결재 대기** (appr-item 3건, 헤더 뱃지 "3건")
- urgent / file-check-2 / 업체 선정 품의서 / H1110-T100 · 김개발 상신 / D+1(bad) → 04-10_selection_approval.html (appr-item onclick)
- warn / tag / 정단가 품의 / H1110-T100 · 김구매 상신 / D+2(warn) → 06-04_price_approval.html
- info / user-check / 협력사 사전등록 승인 / I사 금강정밀 · 이구매 상신 / D+3(mute) → 09-01_supplier_register_detail.html

**박스⑤ 협력사 등급 분포** (donut + 범례)
헤더 우측 [평가 보기]→09-02_supplier_eval.html
도넛 conic-gradient: S 0-25% (#16a34a), A 25-75% (#1a56aa), B 75-100% (#d97706). 중앙 "4 개사".
범례:
- #16a34a S등급 · A사 (동희부품) → cnt 1
- #1a56aa A등급 · B·C사 → cnt 2
- #d97706 B등급 · D사 (대원금속) → cnt 1

**박스⑥ LME / 환율** (lme-grid 4셀, 06-02 스냅샷 정합)
헤더 [상세]→03-03_lme_list.html, 기준일 2026-06-04
- Al LME: $2,650/ton · up +2.1% vs 전월
- 원/달러: 1,380원 · up +0.8% vs 전월
- Al 소재단가: 3,810원/kg · up +120원 vs 전월
- Al 프리미엄: $120/ton · down -$10 vs 전월

- [ ] **Step 5: body — 행4 dash-bottom (내 할 일 + 바로가기)**

**내 할 일** (todo-t 3행, 헤더 뱃지 "3건")
- 긴급 / H1110-T100 업체 선정 결재 상신 / 520 PHEV / H1110-T100 / 오늘(bad) / 바로가기→04-10_selection_approval.html
- 검토 / 정단가 품의 결재 대기 / 520 PHEV / H1110-T100 / 대기 / 바로가기→06-04_price_approval.html
- 마감 / NX5 Cooling 견적 검토 / NX5 / K2200-C100 / D-5(warn) / 바로가기→04-06_quote_compare.html

**바로가기** (sc-grid 6버튼)
- file-plus 고객 RFQ 목록 → 01-01_rfq_list.html
- briefcase 프로젝트 목록 → 01-03_project_list.html
- trending-up LME 기준정보 → 03-04_lme_register.html
- send RFQ 생성/발송 → 04-03_rfq_create.html
- bar-chart-2 견적 비교 → 04-06_quote_compare.html
- star 협력사 평가 → 09-02_supplier_eval.html

- [ ] **Step 6: 푸터 + 유지 요소**
- page-title-bar: 제목 "메인 대시보드" + "2026-06-04 (목) 기준" + 새로고침 버튼(showToast)
- `<div class="toast" id="toast" style="display:none"></div>` + showToast 스크립트 유지
- `<script src="../common/sidebar.js"></script>` 유지
- 퍼널 섹션(`.funnel` 블록 308~362) 완전 제거

- [ ] **Step 7: 브라우저 확인**
  - 3열 본문 각 컬럼 동일 높이, 하단 공백 없음
  - 프로젝트 5개·등급 도넛 S1/A2/B1·SOP 4건·LME $2,650 표시
  - 모든 링크 구현 화면으로 연결(클릭 확인)
  - 이모지 없음, 퍼널 사라짐

---

## 자기검토 (Spec Coverage)

| 스펙 요구사항 | Step |
|---|---|
| dash-grid 1fr×3 + stretch + 공백 제거 | Step 1 |
| KPI 6타일 실데이터 | Step 2 |
| 프로젝트 현황 5개(01-03) | Step 3 |
| 원가 3품번(H1110-T100 +19.8%) | Step 3 |
| SOP 4건(D-89/119/180/225) | Step 3 |
| 결재 대기 3건(04-10/06-04/09-01) | Step 4 |
| 협력사 등급 분포 S1/A2/B1(09-02) | Step 4 |
| LME 06-02 정합($2,650/3,810/120) | Step 4 |
| 내 할일 + 바로가기 구현링크 | Step 5 |
| 퍼널 제거 | Step 6 |
| 데이터 전면 실화면 반영 | 전체 |
