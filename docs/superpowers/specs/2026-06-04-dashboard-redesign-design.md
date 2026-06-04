# 00-02 메인 대시보드 재구성 설계 명세

**날짜:** 2026-06-04
**범위:** 기존 `mockups/00_common/00-02_dashboard.html` 전면 재작성 (1개 파일)
**목적:** (1) 모든 위젯 데이터를 실제 구현 화면 기준으로 교체 (2) 레이아웃 공백 완전 제거

---

## 문제 정의 (현재 대시보드)

1. **가상 데이터** — 후면범퍼(싼타페 H2210-R200), 배터리 마운트(아이오닉9 H3310-B150) 등 구현 화면에 없는 프로젝트 사용.
2. **공백 발생** — 3열 본문 `grid-template-columns:1fr 380px 272px` + `align-items:start` → 컬럼별 내용 높이 차이로 하단 빈 공간.

---

## 실제 데이터 소스 (구현 화면 기준)

### 프로젝트 5개 (01-03_project_list 기준)
| 코드 | 명 | 고객·차종 | 대표품번 | 단계 | 진척 | PM | SOP | 상태 |
|---|---|---|---|---|---|---|---|---|
| PJT-520PHEV-FT-2026 | Fuel Tank Module 개발 | 현대 520 PHEV | H1110-T100 | 개발구매 | 45% | 김개발 | 2026-10-01 | 진행중 |
| PJT-NX5-CM-2026 | Cooling Module 개발 | 기아 NX5 | K2200-C100 | 원가산출 | 22% | 이프로 | 2026-12-01 | 진행중 |
| PJT-MQ4-BR-2026 | Bracket Assy 개발 | 모비스 MQ4 | M3300-B100 | 설계 | 12% | 박PM | 2027-01-15 | 진행중 |
| PJT-520PHEV-RP-2026 | Reinforcement 개발 | 현대 520 PHEV | H1120-R100 | 품질·양산준비 | 78% | 김개발 | 2026-09-01 | 지연 |
| PJT-NX5-HP-2025 | Heat Protector 개발 | 기아 NX5 | K2210-H100 | 양산전환 | 100% | 이프로 | 2026-03-01 | 완료 |

### 협력사 등급 (09-02_supplier_eval 기준, 2026 3Q)
- A사(동희부품) 4.62 → S / B사(한국알미늄) 4.10 → A / C사(신흥정공) 3.66 → A / D사(대원금속) 2.96 → B
- 등급 분포: **S 1 / A 2 / B 1 / C 0 / D 0** (총 4개사)

### 원가 (03-08 / 04-08 / 06 기준)
- H1110-T100: 목표 구매단가 12,100원 / 확정 14,500원 → +2,400원 (+19.8% 초과)
- (대시보드 원가 위젯엔 H1110-T100 + 진행 프로젝트 2개 추정치 표기)

### SOP 임박 (작성일 2026-06-04 기준 D-Day)
- H1120-R100 Reinforcement: SOP 2026-09-01 → **D-89 (지연 프로젝트)**
- H1110-T100 Fuel Tank: SOP 2026-10-01 → **D-119**
- K2200-C100 Cooling: SOP 2026-12-01 → **D-180**
- M3300-B100 Bracket: SOP 2027-01-15 → **D-225**

### 결재 대기 (구현 품의 화면 기준)
- 업체 선정 품의 (H1110-T100) → 04-10_selection_approval.html, D+1
- 정단가 품의 (H1110-T100) → 06-04_price_approval.html, D+2
- 협력사 사전등록 승인 (I사 금강정밀) → 09-01_supplier_register_detail.html, D+3

---

## 레이아웃 (공백 제거)

`content-scroll` 내부를 **세로 flex 컬럼**으로 구성, 4개 행. 3열 그리드는 **`1fr 1fr 1fr` 균등 + `align-items:stretch`**로 변경(기존 `1fr 380px 272px`+`start` 폐기). 각 `.section-box`는 `height:100%`로 컬럼을 채워 하단 공백 제거.

```
[행1] KPI 스트립 — 6타일 (grid repeat(6,1fr))
[행2] dash-grid (1fr 1fr 1fr, stretch):
      ① 개발 프로젝트 현황 (5개)   ② 목표가 대비 원가 (3품번)   ③ SOP 임박 (4건)
[행3] dash-grid (1fr 1fr 1fr, stretch):
      ④ 결재 대기 (3건)           ⑤ 협력사 등급 분포 (도넛)    ⑥ LME / 환율
[행4] dash-bottom (1fr 340px):
      ⑦ 내 할 일 (3건)            ⑧ 바로가기 (구현 화면 6개)
```

### 레이아웃 CSS 변경
```css
.dash-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;   /* 기존 1fr 380px 272px → 균등 */
  gap: 14px;
  align-items: stretch;                  /* 기존 start → stretch */
  margin-bottom: 14px;
}
.dash-grid > .section-box { height: 100%; display: flex; flex-direction: column; margin-bottom: 0; }
.dash-col { display:flex; flex-direction:column; gap:14px; height:100%; }  /* 컬럼 내 다중 박스 시 */
```
- 행2/행3은 각각 3개 `.section-box`를 직접 자식으로 두어 균등·동일 높이.
- 각 박스 내부 리스트/테이블이 짧아도 박스 자체가 컬럼 높이를 채움(테이블 아래 여백은 박스 배경으로 채워져 시각적 공백 없음).

---

## 위젯별 명세

### ① KPI 스트립 (6타일, 실데이터)
| 타일 | 값 | 라벨 | 힌트 | 색 |
|---|---|---|---|---|
| 진행 중 프로젝트 | 4 | 진행 중 프로젝트 | 지연 1 포함 · 완료 1 별도 | prog |
| 지연 프로젝트 | 1 | 지연 프로젝트 | Reinforcement 78% | bad |
| 목표가 초과 품번 | 1 | 목표가 초과 품번 | H1110-T100 +19.8% | bad |
| 협상·결재 진행 | 1 | 협상 / 결재 진행 | 520 PHEV FTM | warn |
| 단가 미결 | 1 | 단가 미결 | 정단가 전환 대기 | warn |
| 협력사 S등급 | 1 | 협력사 S등급 | A사 (동희부품) | ok |

### ② 개발 프로젝트 현황 (테이블, 5행)
컬럼: 프로젝트명 / 차종 / 대표품번 / 현재단계 / 진척(prog-bar) / SOP / PM / 상태(점+텍스트)
- 5개 프로젝트 전부. 1행 클릭 → 01-04_project_detail.html, 나머지 → 01-03_project_list.html
- 헤더 우측 [전체 보기] → 01-03_project_list.html
- 상태 점: 진행중(prog)/지연(bad)/완료(ok)

### ③ 목표가 대비 원가 (cbar 3개)
- 520 PHEV Fuel Tank: 목표 12,100 / 현재 14,500 / +19.8% 초과(over)
- NX5 Cooling: 목표 18,500 / 현재 17,800 / -3.8% 달성(under)
- MQ4 Bracket: 목표 9,500 / 현재 9,200 / -3.2% 달성(under)
- 헤더 [상세 보기] → 03-08_cost_analysis.html

### ④ 결재 대기 (3건)
- 업체 선정 품의서 / H1110-T100 · 김개발 상신 / D+1 (urgent) → 04-10_selection_approval.html
- 정단가 품의 / H1110-T100 · 김구매 상신 / D+2 (warn) → 06-04_price_approval.html
- 협력사 사전등록 승인 / I사 금강정밀 · 이구매 상신 / D+3 (info) → 09-01_supplier_register_detail.html
- 헤더 뱃지 "3건"

### ⑤ 협력사 등급 분포 (도넛 + 범례) — 신규
- 도넛: S 25% / A 50% / B 25% (conic-gradient), 중앙 "4 개사"
- 범례: S등급 1(A사 동희부품) / A등급 2(B·C사) / B등급 1(D사 대원금속)
- 등급 색: S=#16a34a(ok) / A=#1a56aa(blue) / B=#d97706(warn) / 회색 트랙
- 헤더 우측 [평가 보기] → 09-02_supplier_eval.html

### ⑥ LME / 환율 (4셀, 기존 유지)
- Al LME $2,650/ton (+2.1%) — 06-02 스냅샷과 정합(2,650 USD/MT)
- 원/달러 1,380원 (+0.8%)
- Al 소재단가 3,810원/kg (06-02 정합)
- Al 프리미엄 $120/ton (06-02 정합)
- 헤더 [상세] → 03-03_lme_list.html

### ⑦ 내 할 일 (테이블 3건)
- 긴급: H1110-T100 업체 선정 결재 상신 → 04-10, 오늘
- 검토: 정단가 품의 결재 대기 → 06-04, 대기
- 마감: NX5 Cooling 견적 검토 → 04-06, D-5
(구현 화면 링크로 연결)

### ⑧ 바로가기 (6버튼, 구현 화면)
- 고객 RFQ 목록 → 01-01_rfq_list.html
- 프로젝트 목록 → 01-03_project_list.html
- LME 기준정보 → 03-04_lme_register.html
- RFQ 생성/발송 → 04-03_rfq_create.html
- 견적 비교 → 04-06_quote_compare.html
- 협력사 평가 → 09-02_supplier_eval.html

---

## 유지 사항

- `<body data-menu="00-02">`, page-title-bar(제목+기준일+새로고침), sidebar.js, lucide
- 기존 CSS 클래스(kpi-tile, cbar, donut, appr-item, sop-item, lme-grid, todo-t, sc-grid 등) 재사용
- 이모지·Excel·리셋 금지 (새로고침 버튼은 유지 — 리셋과 다름)
- 퍼널(파이프라인) 위젯은 **제거**(가상 단계 건수라 데이터 정합 어려움) → 그 공간을 행2/행3 균등 그리드로 대체

PROGRESS.md/index.html/sidebar.js 변경 없음(00-02는 이미 완료 상태, 재작성만).
