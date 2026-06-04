# CLAUDE.md — 동희산업 개발구매시스템 (Donghee DevSRM)

> 이 문서는 Claude Code가 본 프로젝트에서 작업할 때 반드시 따라야 하는 **프로젝트 규칙(Project Rules)** 입니다.
> 작업을 시작하기 전 항상 이 파일과 `DESIGN.md`, `docs/PRD.md`, `docs/MENU_STRUCTURE.md`를 먼저 읽으십시오.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | 동희산업 개발구매시스템 (Donghee DevSRM) |
| 고객사 | 동희산업 (Tier 1 HMC 공급사) |
| 개발사 | 세포아소프트 (Sepoasoft) |
| 목적 | 자동차 부품 개발구매 라이프사이클(고객 RFQ → 양산 전환)을 한 품번 기준으로 통제 |
| 단계 | Phase 1: HTML 목업 (데모용) → Phase 2: 실제 풀스택 구현 |
| 한 줄 정의 | "고객 RFQ부터 LME 기반 재료비, 협력사 견적 비교, 품질·설계·영업 검토, 단가 확정, ERP 양산 전환까지를 **품번 기준**으로 연결하여 개발단계 원가와 구매 의사결정을 통제하는 시스템" |

---

## 2. 핵심 도메인 원칙 (절대 위반 금지)

본 시스템의 모든 화면·로직은 다음 원칙을 따른다.

1. **목표가 선행 원칙** — 협력사 견적을 받기 전에 내부 목표 구매단가를 먼저 설정한다. 목표가는 협력사에 공개되지 않는다.
2. **LME 기반 재료비 원칙** — 재료비는 수기 입력이 아니라 `투입중량 × 소재단가 − 스크랩중량 × 회수단가` 공식으로 자동 산출한다. 소재단가는 `LME × 환율 + 프리미엄 + 부대비`로 계산한다.
3. **품번 기준 추적 원칙** — 모든 화면은 `프로젝트 → 품번 → 도면리비전 → 적용시점` 키 체인으로 연결된다. 화면 간 흐름이 끊기면 안 된다.
4. **Breakdown 검증 원칙** — 협력사 견적은 총액만 받지 않는다. LME 기준가, 환율, 프리미엄, 투입중량, 스크랩, 가공비, 물류비, 관리비/이윤을 항목별로 받아 내부 산출값과 비교 가능해야 한다.
5. **다부서 검토 원칙** — 업체 선정은 가격만으로 결정하지 않는다. 설계 / 품질 / 영업 검토가 결재 흐름에 포함된다.
6. **변경 추적 원칙** — 도면 리비전 변경, LME 변동, 환율 변동 시 재료비·단가 영향이 자동 재계산되고 이력이 남는다.
7. **ERP 전환 통제 원칙** — 목표가·재료비·품질승인·단가확정 체크리스트가 모두 충족되기 전에는 ERP 전송 버튼이 비활성화된다.

---

## 3. 기술 스택

### Phase 1 — HTML 목업 (현재 단계)

| 항목 | 선택 |
|---|---|
| 형식 | Standalone HTML 파일 (singlesuite-style) |
| CSS | Tailwind CDN |
| 아이콘 | lucide (CDN) |
| 폰트 | Pretendard |
| 데이터 | 화면별 하드코딩 mock data (JS 객체) |
| 상태 관리 | localStorage (선택 화면 간 이동 시) |
| 해상도 | 1920×1080 고정, 좌측 사이드바 + 상단 헤더 + 컨텐츠 영역 |

### Phase 2 — 실제 구현 (추후)

| Layer | 선택 |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind |
| Backend | Node.js + Express + TypeScript |
| DB | MariaDB (mysql2, **Prisma 사용 금지**) |
| Icon | lucide-react |
| Port | FE 3002 / BE 3001 (AI-DLC PMS와 동일 패턴) |

---

## 4. 코딩/디자인 규칙

### 4.1 절대 금지 사항

- **이모지 사용 금지** — 화면, 코드, 커밋메시지 어디에도 이모지 넣지 않는다. 상태 표시는 lucide 아이콘 또는 컬러 뱃지로 한다.
- **Excel 다운로드 버튼 금지** — 그리드 우측 상단 Excel 버튼 만들지 않는다 (동희 표준).
- **리셋(초기화) 버튼 금지** — 검색 조건에 리셋 버튼 두지 않는다.
- **수기 검색 버튼 의존 금지** — 조건 변경 시 자동 조회를 기본으로 한다 (`auto-search`).
- **Prisma 금지** — Phase 2에서도 mysql2 직접 사용.
- **목표가의 협력사 노출 금지** — 협력사 견적 화면에는 목표가 절대 표시 안 됨.

### 4.2 화면 표준 (singlesuite 규칙 계승)

- 그리드는 화면 하단까지 채운다 (`grid fills to bottom`).
- 검색 조건은 상단 1줄, 그리드는 그 아래 풀공간.
- 메인 컬러: 동희 식별을 위해 본 프로젝트는 **Navy `#1e2d4e` / Accent Blue `#1a56aa`** 사용 (EasyProcure 톤 계승).
- 상태 뱃지: 회색=대기, 파랑=진행, 초록=승인, 빨강=초과/반려, 노랑=주의.
- 폰트: Pretendard, 본문 13px, 헤더 14px, 그리드 12px.

자세한 규칙은 `DESIGN.md` 참조.

---

## 5. 디렉토리 구조 (Phase 1)

```
donghee-devsrm/
├─ CLAUDE.md                    # 본 파일
├─ DESIGN.md                    # 화면 디자인 규칙
├─ docs/
│  ├─ PRD.md                    # 요구사항정의서
│  └─ MENU_STRUCTURE.md         # 메뉴/화면 목록 구조도
├─ mockups/                     # HTML 목업
│  ├─ index.html                # 메뉴 진입 페이지
│  ├─ common/
│  │  ├─ layout.html            # 공통 레이아웃 (sidebar + header)
│  │  └─ tokens.css             # 디자인 토큰
│  ├─ 01_project/               # 개발 프로젝트
│  ├─ 02_design_bom/            # 설계/BOM
│  ├─ 03_cost/                  # 원가관리
│  ├─ 04_dev_purchase/          # 개발구매
│  ├─ 05_quality/               # 품질관리
│  ├─ 06_price/                 # 단가관리
│  ├─ 07_erp/                   # 연계관리
│  └─ 08_change/                # 변경관리
└─ assets/
   └─ data/                     # mock data JSON
```

---

## 6. 데모 시나리오 (반드시 기억할 것)

데모는 **한 품번을 끝까지 따라가는 방식**으로 진행된다.

| 항목 | 값 |
|---|---|
| 고객사 | 현대자동차 |
| 차종 | 520 PHEV |
| 프로젝트 | Fuel Tank Module 개발 |
| 품번 | H1110-T100 |
| 품명 | Frame Sub Ass'y |
| 재질 | Aluminum 6061 (LME 연동) |
| 연간수량 | 100,000개 |
| SOP | 2026-10-01 |
| 고객 목표 판매가 | 16,000원 |
| 목표 마진율 | 15% |
| 목표 구매단가 | **12,100원** |
| 선정 협력사 | A사 |
| 협상 후 확정단가 | 14,500원 (+2,400 초과 → 고객가 재협상 트리거) |

→ 이 데이터는 **모든 목업 화면에 동일하게** 반영되어야 한다. 화면마다 다른 품번 쓰지 않는다.

---

## 7. 작업 진행 규칙

1. 새 화면을 만들기 전 `docs/MENU_STRUCTURE.md`에서 해당 화면의 위치/번호/필수 컬럼을 먼저 확인한다.
2. 화면 구현 후 반드시 `mockups/index.html` 메뉴 트리에 링크를 추가한다.
3. 동일한 mock 데이터(H1110-T100)를 사용해 화면 간 흐름이 자연스럽게 연결되게 한다.
4. 한 번에 한 화면씩 완성한다. 여러 화면을 동시에 어설프게 만들지 않는다.
5. 화면 완료 시 `docs/PROGRESS.md`에서 해당 항목을 `[ ]` → `[x]`로 변경하고 상단 진행률 숫자(예: `진행: 2 / 43`)만 갱신. 그 외 추가 기록 없음.

---

## 8. 커밋 메시지 규칙

```
feat(03_cost): 목표가 설정 화면 추가
feat(04_dev_purchase): 견적 Breakdown 비교 화면 추가
fix(common): 사이드바 활성 메뉴 표시 오류 수정
docs: PRD 9.4절 보완
```

- 이모지 사용 금지
- 한글 본문 허용
- 영역 prefix 필수 (`feat/fix/docs/refactor`)

---

## 9. 자주 쓰는 약어

| 약어 | 의미 |
|---|---|
| RFQ | Request for Quotation (견적 요청) |
| SOP | Start of Production (양산 시작일) |
| BOM | Bill of Materials (부품 구성표) |
| LME | London Metal Exchange (국제 비철금속 거래소) |
| PPAP | Production Part Approval Process (양산부품 승인) |
| APQP | Advanced Product Quality Planning |
| MOQ | Minimum Order Quantity |
| DevSRM | Development SRM (개발구매시스템) |
