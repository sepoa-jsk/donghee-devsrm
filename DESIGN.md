# DESIGN.md — 동희산업 개발구매시스템 화면 디자인 규칙

> 이 문서는 모든 HTML 목업/실구현 화면이 따라야 할 **시각·인터랙션 표준**을 정의한다.
> singlesuite SKILL.md의 누적 규칙을 본 프로젝트에 맞게 정리한 버전이다.

---

## 1. 디자인 철학

- **ERP-grade 정보 밀도** — 한 화면에 의사결정에 필요한 모든 정보를 담는다. 불필요한 여백·애니메이션 금지.
- **고정 해상도** — 1920×1080 기준으로 설계. 반응형 고려하지 않는다 (사내 PC 사용).
- **읽는 화면, 쓰는 화면** — 조회 그리드 중심 화면과 입력 폼 중심 화면을 명확히 분리한다.
- **상태 한눈에** — 모든 핵심 화면은 상단에 KPI/상태 요약 영역을 둔다.
- **ERP 톤 유지** — AI/SaaS 느낌의 디자인 요소(알약형 컴포넌트, 그라데이션, 컬러풀 아이콘, 인포 배너) 일절 금지.

---

## 2. 컬러 토큰

```css
:root {
  /* Brand */
  --navy:         #1e2d4e;   /* 사이드바, 헤더 */
  --navy-dark:    #16223b;
  --blue:         #1a56aa;   /* 강조, 액티브, 주요 버튼 */
  --blue-hover:   #1648a0;
  --blue-light:   #e8f0fb;

  /* Status */
  --status-wait:    #6b7280;  /* 회색 - 대기 */
  --status-prog:    #1a56aa;  /* 파랑 - 진행중 */
  --status-ok:      #16a34a;  /* 초록 - 승인/이내 */
  --status-warn:    #d97706;  /* 주황 - 주의 */
  --status-bad:     #dc2626;  /* 빨강 - 초과/반려 */

  /* Surface */
  --bg:           #f5f6f8;
  --surface:      #ffffff;
  --border:       #d8dde4;
  --border-strong:#b6bcc7;

  /* Text */
  --text:         #1f2937;
  --text-sub:     #6b7280;
  --text-mute:    #9ca3af;

  /* Grid */
  --grid-head:    #f0f2f5;
  --grid-row-alt: #fafbfc;
  --grid-hover:   #eef4fc;
  --grid-select:  #d6e6f9;
}
```

**사용 금지 컬러**: 보라, 핫핑크, 그라데이션, 형광 계열.

---

## 3. 타이포그래피

| 요소 | 폰트/크기/굵기 |
|---|---|
| 본문 | Pretendard 13px / 400 |
| 그리드 셀 | Pretendard 12px / 400 |
| 그리드 헤더 | Pretendard 12px / 600 |
| 라벨 | Pretendard 12px / 500, color: --text-sub |
| 입력값 | Pretendard 13px / 400 |
| 페이지 타이틀 | Pretendard 16px / 600 |
| 섹션 타이틀 | Pretendard 14px / 600 |
| KPI 숫자 | Pretendard 22px / 700 |
| 통화/숫자 | tabular-nums, font-variant-numeric: tabular-nums |

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
```

---

## 4. 레이아웃 골격

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER (h: 48px, navy)                                       │
│  [≡] DevSRM        프로젝트: PJT-520PHEV-FT-2026  [user]     │
├─────────────────────────────────────────────────────────────┤
│  Page Title (h: 48px)         [임시저장] [인쇄] [저장]       │
├─────────────────────────────────────────────────────────────┤
│  Search/Filter Bar (h: 44px)  ← 목록 화면에만               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Content (Grid / Form / Detail)                             │
│                                                             │
│  ▶ 그리드는 화면 하단까지 채움                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- 사이드바: **오버레이 방식** (position: fixed, 260px), 콘텐츠 폭 밀지 않음. 기본 닫힘 상태.
- 사이드바 배경: --navy, 활성 메뉴: 좌측 3px blue 라인 + `rgba(255,255,255,0.08)` 배경
- 헤더 좌측 끝 GNB 토글 (lucide `menu`/`x`, 18px), 헤더 우측: 프로젝트·품번·사용자

### 4.1 페이지 타이틀 바 표준 (전체 화면 공통)

```
┌──────────────────────────────────────────────────────────────┐
│  페이지 제목                    [임시저장] [인쇄] [저장]      │
└──────────────────────────────────────────────────────────────┘
  h: 48px, bg: --surface, border-bottom: 1px solid --border
```

- **브레드크럼 완전 제거** — 어느 화면에도 브레드크럼을 두지 않는다.
- **상태 뱃지 제거** — 타이틀 바에 "RFQ 등록 완료" 같은 상태 뱃지를 두지 않는다. 상태는 화면 내 그리드·KPI 카드에서 확인한다.
- 페이지 제목: 좌측, Pretendard 16px / 600, color: --text
- 액션 버튼: 우측, 중요도 순 왼쪽→오른쪽 배치 (취소 → 임시저장 → 저장/승인)

### 4.2 안내 박스 금지

다음 패턴들은 **모든 화면에서 전면 금지**한다.

- 페이지 상단 하늘색 인포 박스 (`alert-info`, `alert-bar` 류)
- "... 하신 후 ... 하시면 됩니다" 형 배너 문구
- 연노랑 경고 배너, 연회색 안내 배너
- 절차 안내 notice/tip/hint 박스

**대안**: 안내가 필요하면 해당 폼 라벨 아래 `form-hint`(11px, --text-mute)나 라벨 보조 텍스트(12px, --text-sub)로만 인라인 표현한다. 화면 설계 자체를 직관적으로 만들어 별도 안내가 불필요하게 한다.

### 4.3 ERP 톤 유지 — 금지 목록

| 금지 항목 | 규칙 | 대안 |
|---|---|---|
| 알약형 컴포넌트 | border-radius 5px 이상 금지 | 최대 4px |
| 카드 그림자 | box-shadow 금지 | 1px solid --border 만 |
| 그라데이션 | 배경·버튼 그라데이션 금지 | solid 단색 |
| 섹션 헤더 컬러 아이콘 | `<form-card-header>` 안 lucide 아이콘 금지 | 텍스트 + 캡션만 |
| 초록/컬러 알약 뱃지 | LME 연동 등 컬러풀 강조 뱃지 금지 | `badge-outline` (회색 테두리) |
| 컬러풀 일러스트 | 아이콘·그림 컬러 강조 금지 | --text-mute 단색 아이콘 |
| 온기 있는 경고박스 | 오렌지·노랑 배경 박스 금지 | --bg 배경 + 1px --border |
| Primary 버튼 그라데이션 | 그라데이션 배경 버튼 금지 | solid #1a56aa |

### 4.4 형광/원색 강조 색상 전면 금지

- `#dc2626`(빨강), `#16a34a`(초록), `#facc15`(노랑) 등 채도 높은 색을 **큰 숫자·강조 텍스트**에 사용 금지
- **금액·계산 결과 숫자는 모두 `--text`(다크그레이)로 통일.** 색으로 결과값을 강조하지 않는다.
- 강조가 필요하면 색 대신 **굵기(600)와 크기(14~15px)** 로만 표현한다. 예: `"12,100원"` (font-weight:600, color:--text)
- 상태 표시가 꼭 필요한 경우에만 **작은 뱃지**(높이 20px, 채도 낮은 톤)로만 표시
- 컬러풀 뱃지(초록 LME 연동 등) 모두 `badge-outline`(회색 테두리, `--text-sub`)으로 교체

### 4.5 계산식 요약 카드 / 결과 강조 카드 제거

**금지 패턴:**

```
┌──────────────────────────────────────────────┐  ← 파란 배경 카드
│ 허용 총원가          = 판매가 × (1 - 마진율) │
│   13,600원 (파랑 굵게)                        │
└──────────────────────────────────────────────┘
┌────────────────────────────────────────────┐  ← 주황 경고 카드
│ 협력사 공개 금지  [lock]                    │
└────────────────────────────────────────────┘
```

**허용 패턴:**

```
허용 총원가 (원/개)
[   13,600   ] (readonly input, 배경 #f0f2f5)
 = 판매가 × (1 - 마진율)  →  16,000 × 0.85    ← form-hint, 11px, --text-mute

목표 구매단가 (원/개)
[   12,100   ] (readonly input)
 = 허용총원가 - 내부비용  →  13,600 - 1,500  ※ 협력사 미공개
```

### 4.6 카드(박스) 형태 구분

**금지 (이하는 기존과 동일하게 전면 금지):**

- `.form-card` 클래스(헤더 구분선 있는 폼 카드)
- 그림자(`box-shadow`)·컬러 배경 박스로 정보 영역을 강조하는 것
- 계산식 요약 카드, 결과 강조 카드, 우측 메타 카드

**허용 — 소제목 영역 분리용 `.section-box` (§5.9 참조):**

- 여러 소제목 영역을 시각적으로 분리할 때 `.section-box` 사용 (1px solid --border, radius 4px, 그림자 없음)
- `.section-box`는 `형광 카드·결과 강조 카드`와 다른 개념 (레이아웃 구분 목적)

**허용 섹션 구분 패턴 (`.sec-hdr` + `.sec-cap` — 소제목 하나뿐인 단일 영역 화면):**

```html
<div class="sec-hdr"><span class="sec-cap">기본 정보</span></div>
<div class="form-row form-row-4">...</div>
```

캡션 텍스트(11px/700/--text-sub/uppercase) 뒤에 1px 가로 구분선이 자동으로 늘어난다.

예외: KPI 카드(`.kpi-card`)는 상단 요약 지표 표시 목적으로만 허용.

### 4.7 우측 상단 메타정보 영역 단순화

**금지:**

- 페이지 타이틀 바 우측에 "RFQ 번호 / 등록일 / 등록자 / 상태 뱃지" 묶음 표시

**허용:**

- 타이틀 바 우측: **액션 버튼만** (임시저장 / 인쇄 / 등록 확정 / 생성 등)
- RFQ 번호·등록일·등록자·진행 상태 → **폼 그리드 첫 번째 행**에 `readonly` 입력 필드로 통합

---

## 5. 컴포넌트 표준

### 5.1 버튼

| 종류 | 색상 | 용도 |
|---|---|---|
| Primary | blue 배경 / 흰글자 | 저장, 승인, 전송 |
| Secondary | 흰색 / navy 글자 / border | 취소, 닫기 |
| Danger | 빨강 글자 / 흰배경 / border | 반려 |
| Ghost | 투명 / navy 글자 | 보조 액션 |

- 크기: 높이 32px, padding 0 14px, border-radius 4px
- **절대 둥근 모서리(5px+) 금지.** ERP 톤 유지.
- **그라데이션 배경 금지.** Primary는 solid #1a56aa.
- **아이콘 크기: 16px × 16px 고정** (`.btn` 내부 모든 `<i>` 태그)
  - 아이콘·텍스트 간격: `gap: 6px`
  - 예외 (16px 규칙 미적용):
    - 헤더 GNB 토글: **18px**
    - 사이드바 그룹 헤더 아이콘: **18px**
    - 그리드 행 인라인 액션(삭제 X 등, `.btn-grid`): **14px**
    - 소형 컨텍스트 버튼(`.btn-sm`, 높이 26px): **12px**
  - CSS 강제: `tokens.css` 섹션 22 — `.btn i { width:16px !important; height:16px !important; }`
- **배치: 항상 우측 정렬**
  - 타이틀 바: `<div class="page-title-spacer">` (flex:1) + `<div class="page-actions">`
  - 섹션 툴바(+ 행 추가 등): `<div style="margin-left:auto">` 안에 배치
  - 모달 footer: `justify-content: flex-end`
  - 폼 하단 저장/취소: `justify-content: flex-end`
- **버튼 순서(좌→우)**: 보조 → 주요 (예: 취소 → 임시저장 → 인쇄 → 등록 확정)

### 5.2 입력 폼

- input 높이 32px, border 1px solid --border
- focus: border --blue, box-shadow 0 0 0 2px rgba(26,86,170,0.15)
- 필수 항목: label 앞에 빨강 `*`
- disabled: bg #f0f2f5, color --text-mute

### 5.3 그리드 (데이터 테이블)

- 헤더 높이 32px, 행 높이 30px
- 행 hover 시 bg --grid-hover
- 선택 행 bg --grid-select
- 짝수 행 alt 색상 사용 (--grid-row-alt)
- **그리드 헤더 `<th>`: `text-align: center` 기본값** — 모든 컬럼 헤더는 가운데 정렬
  - 숫자/금액 헤더: `.r` 클래스로 우측 정렬 (`text-align: right`)
  - 작업명·설명 등 예외: 명시적 `text-align: left` 또는 `.task-col` 클래스
  - CSS 강제: `tokens.css` 섹션 22 — `table.data-table thead th { text-align: center }`
- 본문 셀(`<td>`) 정렬은 별도 유지:
  - 숫자/금액: 우측 정렬(`.r`), tabular-nums, 천단위 콤마
  - 텍스트: 좌측 정렬 (기본)
  - 상태/뱃지/아이콘: 중앙 정렬(`.c`)
- 정렬 가능 헤더에는 ↕ 아이콘 (lucide chevrons-up-down, 12px, 텍스트 우측 6px)
- **Excel 다운로드 버튼 없음** (동희 표준)
- 페이징: 하단 우측, 페이지번호 + prev/next

### 5.4 검색 바

- 한 줄 배치, label–input 쌍 가로 나열
- 조건 변경 시 **자동 조회** (검색 버튼은 보조용)
- **리셋 버튼 없음**

### 5.5 상태 뱃지

```html
<span class="badge badge-ok">승인</span>
<span class="badge badge-warn">주의</span>
<span class="badge badge-bad">초과</span>
<span class="badge badge-wait">대기</span>
<span class="badge badge-prog">진행중</span>
<span class="badge badge-outline">LME</span>  <!-- ERP 톤 중립 뱃지 -->
```

스타일: 높이 20px, padding 0 8px, **border-radius 2px**, 글자 11px/600.

- **알약형(border-radius 10px+) 뱃지 금지.** 2px 유지.
- 색상 뱃지는 상태 표시(승인/반려/초과 등) 용도에만 사용.
- 기능 속성 표시 (LME 연동, 시스템 자동 등)에는 `badge-outline` (회색 테두리 + --text-sub 텍스트) 사용.

### 5.6 KPI 카드

```
┌────────────────────────┐
│ 목표 구매단가          │  ← 라벨 12px sub
│  12,100원              │  ← 숫자 22px bold
│  ▼ 목표가 이내         │  ← 보조 텍스트 + 컬러
└────────────────────────┘
```

- 4개 또는 5개를 한 줄에 배치
- 카드 padding 14px 18px, 간격 12px
- **그림자 없음**, 1px solid --border

### 5.7 결재선 / 협상 이력

- 수평 스텝 표시 (lucide chevron-right로 연결)
- 각 노드: 담당자명 + 상태 점(●) + 일시
- 완료=초록, 진행=파랑, 대기=회색, 반려=빨강

### 5.9 소제목 단위 박스 그룹핑 (Rule 4)

한 화면에 여러 소제목 영역이 있을 때 각 영역을 `.section-box`로 묶는다.

```
┌─────────────────────────────────────────────────────┐  ← 1px solid --border, radius 4px
│  소제목 (14px/600/--text)         [+ 추가] 버튼 우측  │  ← section-box-header, mb 12px
│  ─────────────────────────────────────────────────  │  ← 구분선 없음 (헤더와 내용 연속)
│  [폼 필드 / 테이블 / 기타 내용]                       │  ← padding 16px 20px
└─────────────────────────────────────────────────────┘
     ↕ 박스 간격 16px
┌─────────────────────────────────────────────────────┐
│  ...다음 소제목 영역...                               │
└─────────────────────────────────────────────────────┘
```

**박스 스타일:**
- `background: var(--surface)` / `border: 1px solid var(--border)` / `border-radius: 4px`
- `padding: 16px 20px` / 박스 간 `margin-bottom: 16px` / 그림자 없음

**소제목(`.section-box-title`):**
- Pretendard 14px / 600, color: --text, 박스 상단 좌측
- 하단 12px 간격 후 내용 시작, 소제목과 내용 사이 구분선 없음
- 소제목 우측에 액션 버튼(Rule 3 우측 배치 적용)

**HTML 패턴:**
```html
<div class="section-box">
  <div class="section-box-header">
    <span class="section-box-title">소제목</span>
    <!-- 선택: 우측 액션 버튼 -->
    <button class="btn btn-secondary btn-sm">
      <i data-lucide="plus"></i>추가
    </button>
  </div>
  <!-- 폼 필드 / 테이블 / 기타 내용 -->
</div>
```

**적용 대상:** 한 화면에 소제목 영역이 2개 이상인 경우
**적용 제외:** 소제목이 하나뿐인 단일 영역 화면, 비교 테이블만 있는 화면

### 5.8 폼 카드(섹션) 헤더

- 높이: padding 11px 20px
- 제목: 14px / 600, color: --text
- 보조 캡션: 12px / 400, color: --text-sub (제목 뒤 inline)
- **아이콘 금지** — lucide 아이콘을 폼 섹션 헤더에 두지 않는다. 텍스트만.
- 섹션 구분은 card의 border로만. 추가 구분선/배경 색상 금지.

---

## 6. 화면 패턴별 표준

### 6.1 목록(List) 화면

```
[Page Title + 액션버튼]
[검색바]
[KPI 4~5개]  ← 선택적
[그리드 (하단까지)]
[페이징]
```

### 6.2 상세/편집(Detail) 화면

```
[Page Title + 우측 액션버튼]
[기본정보 카드]
[탭 (있으면)]
[세부 영역들]
[하단 결재선 / 이력]
```

- 브레드크럼 없음.
- 페이지 제목으로 현재 화면을 충분히 식별할 수 있도록 명확하게 작성.

### 6.3 비교(Compare) 화면 — 견적 Breakdown

```
[품번/RFQ 정보 카드]
[비교 테이블]
  ┌─────────┬───────┬───────┬───────┬───────┐
  │ 항목    │ 내부   │ A사   │ B사   │ C사   │
  ├─────────┼───────┼───────┼───────┼───────┤
  │ LME     │ 2,400 │ 2,500 │ 2,450 │ 2,480 │
  │ ...
  └─────────┴───────┴───────┴───────┴───────┘
- 내부 기준 대비 차이 셀은 컬러 음영 (높음=주황, 낮음=회색)
- 종합판단 행은 하단 강조
```

### 6.4 분석(Analysis) 화면 — 목표가 대비

- 좌: 원가 항목 누적 차트 (재료비/가공비/물류/관리)
- 우: 목표 vs 예상 비교 게이지
- 하단: 부서별 검토 의견 리스트

---

## 7. 아이콘 사용

- lucide-icons CDN 사용 (`<script src="https://unpkg.com/lucide@latest"></script>` + `lucide.createIcons()`)
- 아이콘 크기 기본 14px, 헤더용 18px
- **폼 섹션 헤더(form-card-header)에는 아이콘 금지** — 텍스트만 사용
- 아이콘 색상은 --text-mute 또는 --text-sub. 컬러 강조 금지.
- 메뉴 아이콘 (사이드바 1뎁스만):
  - 개발 프로젝트: `briefcase`
  - 설계/BOM: `git-branch`
  - 원가관리: `calculator`
  - 개발구매: `shopping-cart`
  - 품질관리: `shield-check`
  - 단가관리: `tag`
  - 연계관리: `link`
  - 변경관리: `refresh-cw`

---

## 8. 숫자/단위 표기 규칙

| 종류 | 표기 | 예 |
|---|---|---|
| 통화(원) | `12,100원` 또는 `₩12,100` | 화면 내 일관성 유지 |
| 외화(USD) | `2,400 USD/ton` | 단위 함께 |
| 중량 | `3.2 kg` | 소수점 1자리 |
| 환율 | `1,350원/USD` | 정수 |
| 비율 | `15.0%` | 소수점 1자리 |
| 일자 | `2026-10-01` | ISO 8601 |
| 일시 | `2026-02-05 14:32` | 24시간제 |

- 음수/감액 표시는 ▼와 빨강 또는 `-` 부호로. 절대 괄호`()` 사용 금지.
- 목표가 초과는 `+2,400원` (빨강), 이내는 `-1,200원` (초록).

---

## 9. 인터랙션 규칙

- 검색 조건 변경 → 자동 조회 (debounce 300ms)
- 그리드 행 클릭 → 선택 (하이라이트)
- 그리드 행 더블클릭 → 상세 화면 이동
- 저장/승인/전송 → 확인 모달 필수
- 반려/삭제 → 확인 모달 + 사유 입력 필수
- 키보드 단축키: Ctrl+S(저장), Esc(닫기), F3(검색 포커스)

---

## 10. 접근성/품질 체크리스트

화면 완료 시 다음을 확인한다:

- [ ] 1920×1080에서 스크롤 없이 핵심 정보가 보이는가
- [ ] 그리드가 하단까지 채워지는가
- [ ] 검색 조건은 한 줄에 들어가는가
- [ ] 모든 금액에 천단위 콤마와 단위가 있는가
- [ ] 상태 뱃지 색상이 표준을 따르는가
- [ ] 이모지가 없는가
- [ ] Excel/리셋 버튼이 없는가
- [ ] H1110-T100 데모 데이터를 사용하는가
- [ ] 사이드바에 현재 메뉴가 활성 표시되는가
- [ ] 헤더에 현재 프로젝트/품번이 표시되는가
- [ ] 페이지 타이틀 바에 브레드크럼·상태 뱃지가 없는가 (§4.1)
- [ ] 화면 상단에 안내(인포) 박스가 없는가 (§4.2)
- [ ] 폼 섹션 헤더에 아이콘이 없는가 (§5.8)
- [ ] border-radius가 4px 이하인가 (알약형 금지, §4.3)
- [ ] box-shadow·그라데이션이 없는가 (§4.3)
- [ ] 금액·결과 숫자에 형광/원색 강조색 없이 --text 색상인가 (§4.4)
- [ ] 계산식 카드 박스 없이 readonly 필드 + form-hint 로 표시되는가 (§4.5)
- [ ] 폼 섹션이 form-card 없이 sec-hdr 패턴으로 구성되는가 (§4.6)
- [ ] 페이지 헤더 우측에 메타정보 묶음 없이 액션 버튼만 있는가 (§4.7)
- [ ] 모든 `.btn` 내부 아이콘이 16px × 16px인가 (§5.1 — 예외: GNB 18px / 행 액션 14px / btn-sm 12px)
- [ ] 모든 그리드 `<th>` 가 center 정렬인가 (§5.3 — 숫자 열은 `.r` 우측, 예외열만 명시 left)
- [ ] 버튼이 항상 우측 정렬이고 보조→주요 순서를 지키는가 (§5.1)
- [ ] 소제목 2개 이상 화면에서 각 영역이 .section-box로 감싸져 있는가 (§5.9)
- [ ] section-box에 그림자가 없고 border-radius가 4px 이하인가 (§5.9)

---

## 11. 공통 데모 데이터 스니펫

```js
// mockups/assets/data/demo.js
window.DEMO = {
  project: {
    code: 'PJT-520PHEV-FT-2026',
    name: '520 PHEV Fuel Tank Module 개발',
    customer: '현대자동차',
    carModel: '520 PHEV',
    sop: '2026-10-01',
    pm: '개발팀 김대리',
  },
  part: {
    code: 'H1110-T100',
    name: 'Frame Sub Ass\'y',
    drawingRev: 'Rev.A',
    material: 'Aluminum 6061',
    netWeight: 2.8,
    inputWeight: 3.2,
    scrapWeight: 0.4,
    annualQty: 100000,
  },
  target: {
    customerPrice: 16000,
    marginRate: 0.15,
    allowedCost: 13600,
    internalCost: 1500,
    targetBuyPrice: 12100,
  },
  lme: {
    item: 'Aluminum',
    baseMonth: '2026-01',
    basePrice: 2400,         // USD/ton
    fx: 1350,                // KRW/USD
    premium: 300,            // KRW/kg
    overhead: 100,           // KRW/kg
    materialUnit: 3640,      // KRW/kg
  },
  suppliers: [
    { code: 'A', name: 'A사', price: 16128, qGrade: 'A', leadTime: 8 },
    { code: 'B', name: 'B사', price: 15200, qGrade: 'B', leadTime: 10 },
    { code: 'C', name: 'C사', price: 16500, qGrade: 'A', leadTime: 7 },
  ],
  finalPrice: 14500,  // 협상 후
};
```

모든 화면은 이 객체를 import 또는 inline 포함하여 사용한다.
