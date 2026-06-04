# 00-01 로그인 화면 설계 명세

**날짜:** 2026-06-04
**범위:** Phase 1 HTML 목업 — 00-01 로그인 (1개 파일)
**참고:** 00-03 알림함은 이번 범위에서 제외.

---

## 개요

DevSRM 진입 로그인 화면. 다른 화면과 달리 **사이드바·헤더 없는 전체화면**이며 `sidebar.js`를 로드하지 않는다. 화면 중앙에 단일 로그인 카드를 배치한다(중앙 카드 레이아웃).

---

## 파일

**파일:** `mockups/00_common/00-01_login.html`
**data-menu:** 불필요(사이드바 없음). `<body>`에 menu 속성 없음.

---

## 레이아웃

### 전체 배경
- 전체화면(100vh), 회색 톤 배경. Navy 계열 옅은 그라데이션 또는 단색 `#eef1f5`.
- 화면 정중앙에 로그인 카드를 flex center 배치.

### 로그인 카드 (width 380px, 흰 배경, 라운드 8px, 그림자)
구성(위→아래):
1. **로고 영역**
   - "Dev**SRM**" 로고 (SRM은 blue 강조, 기존 index.html 로고 스타일 계승)
   - 부제: "동희산업 개발구매시스템"
2. **폼 영역**
   - 아이디 입력 (라벨 "아이디", placeholder "아이디를 입력하세요", 기본값 `kim.dev` — 데모 편의)
   - 비밀번호 입력 (type=password, 라벨 "비밀번호", 기본값 채움 `••••••` — 데모 편의)
   - 로그인 상태 유지 체크박스 (체크됨)
3. **로그인 버튼**
   - navy 풀폭 버튼 "로그인", height 40px
   - onclick → `location.href='00-02_dashboard.html'`
   - Enter 키로도 로그인 동작
4. **하단 보조 영역**
   - "비밀번호 찾기" · "관리자 문의" 텍스트 링크 (구분점 가운데)
   - 최하단: 버전 표기 "DevSRM v1.0 · © 2026 Sepoasoft" (text-mute, 작게)

---

## 스타일 토큰 (tokens.css 재사용)

- `../common/tokens.css` 링크 (Pretendard, 색 변수)
- 카드 배경 `var(--surface)`, 테두리 `var(--border)`, 그림자 `0 4px 24px rgba(0,0,0,.10)`
- 로고 navy `var(--navy)`, 강조 blue `var(--blue)`
- 입력 필드는 tokens.css의 `.form-input` 스타일 활용(또는 자체 정의), height 40px로 키움
- 로그인 버튼: 배경 `var(--navy)`, hover `var(--navy-dark)`, 흰 글씨

---

## 동작 (vanilla JS)

- 로그인 버튼 클릭 또는 Enter → `00-02_dashboard.html` 이동 (검증 로직 없음, 데모)
- 비밀번호 표시 토글 아이콘(eye) — 선택적, 있으면 좋음
- lucide 아이콘 사용(로고 옆 또는 입력 필드 아이콘). lucide CDN 로드 + `lucide.createIcons()`

---

## 절대 금지

- 이모지 사용 금지(아이콘은 lucide)
- 사이드바·헤더 주입 금지 (`sidebar.js` 로드하지 않음)

---

## index.html / PROGRESS.md 갱신

- index.html: 00. 공통 섹션의 00-01 항목을 미작업 → 링크+완료로 교체
- PROGRESS.md: 진행률 45 → 46, `- [ ] 00-01 로그인` → `- [x]`
- sidebar.js: 00-01 href는 이미 `00-01_login.html`로 일치 — 변경 불필요(단, 로그인 화면 자체는 사이드바를 안 쓰지만 다른 화면 사이드바에서 00-01 링크로 진입 가능)
