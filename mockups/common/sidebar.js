/**
 * DevSRM sidebar.js
 * 헤더 + 오버레이 사이드바를 DOM에 자동 주입합니다.
 *
 * 사용법:
 *   <body data-menu="01-02">
 *     ...
 *     <script src="../common/sidebar.js"></script>
 *   </body>
 *
 * 컨텍스트 재정의 (sidebar.js 로드 전에 설정):
 *   window.DEVSRM_CONTEXT = {
 *     project: { code: 'PJT-...', name: '...' },
 *     part:    { code: 'H1110-T100', name: '...' },
 *     user:    { name: '홍길동', dept: '구매팀', initial: '홍' },
 *     notificationCount: 0
 *   };
 */
(function (W, D) {
  'use strict';

  /* ──────────────────────────────────────────────────────────────
     1. 메뉴 트리 데이터  (MENU_STRUCTURE.md 기반, 9모듈 56화면)
  ────────────────────────────────────────────────────────────── */
  var MENU = [
    {
      id: '00',
      label: '공통',
      icon: 'layout-dashboard',
      children: [
        { id: '00-01', label: '로그인',        href: '../00_common/00-01_login.html' },
        { id: '00-02', label: '메인 대시보드', href: '../00_common/00-02_dashboard.html' },
        { id: '00-03', label: '알림함',        href: '../00_common/00-03_notifications.html' }
      ]
    },
    {
      id: '01',
      label: '개발 프로젝트',
      icon: 'briefcase',
      children: [
        { id: '01-01', label: '고객 RFQ 목록',        href: '../01_project/01-01_rfq_list.html' },
        { id: '01-02', label: '고객 RFQ 등록/상세',    href: '../01_project/01-02_rfq_register.html' },
        { id: '01-03', label: '개발 프로젝트 목록',     href: '../01_project/01-03_project_list.html' },
        { id: '01-04', label: '개발 프로젝트 상세',     href: '../01_project/01-04_project_detail.html' },
        { id: '01-05', label: '프로젝트 일정/마일스톤', href: '../01_project/01-05_milestone.html' }
      ]
    },
    {
      id: '02',
      label: '설계 / BOM',
      icon: 'git-branch',
      children: [
        { id: '02-01', label: '품번 목록',          href: '../02_design_bom/02-01_part_list.html' },
        { id: '02-02', label: '품번·BOM·도면 상세',  href: '../02_design_bom/02-02_part_detail.html' },
        { id: '02-03', label: '도면 리비전 이력',    href: '../02_design_bom/02-03_drawing_history.html' },
        { id: '02-04', label: 'BOM 트리 뷰',        href: '../02_design_bom/02-04_bom_tree.html' },
        { id: '02-05', label: 'BOM 구성 작성',       href: '../02_design_bom/02-05_bom_create.html' }
      ]
    },
    {
      id: '03',
      label: '원가관리',
      icon: 'calculator',
      children: [
        { id: '03-01', label: '목표가 설정 목록',         href: '../03_cost/03-01_target_list.html' },
        { id: '03-02', label: '목표가 설정 상세',         href: '../03_cost/03-02_target_detail.html' },
        { id: '03-03', label: 'LME 기준정보 목록',       href: '../03_cost/03-03_lme_list.html' },
        { id: '03-04', label: 'LME 기준정보 등록',       href: '../03_cost/03-04_lme_register.html' },
        { id: '03-05', label: '환율 관리',               href: '../03_cost/03-05_exchange_rate.html' },
        { id: '03-06', label: '재료비 산출 목록',         href: '../03_cost/03-06_material_list.html' },
        { id: '03-07', label: '재료비 산출 상세',         href: '../03_cost/03-07_material_cost.html' },
        { id: '03-08', label: '목표가 대비 원가 분석',    href: '../03_cost/03-08_cost_analysis.html' },
        { id: '03-09', label: '목표원가 차수 관리',       href: '../03_cost/03-09_target_revision.html' },
        { id: '03-10', label: '원가절감 목표 배부',       href: '../03_cost/03-10_cost_reduction_dept.html' },
        { id: '03-11', label: '현상원가 차이 분석',       href: '../03_cost/03-11_cost_gap_analysis.html' }
      ]
    },
    {
      id: '04',
      label: '개발구매',
      icon: 'shopping-cart',
      children: [
        { id: '04-01', label: '구매대상 품목 확정',     href: '../04_dev_purchase/04-01_purchase_target.html' },
        { id: '04-02', label: 'RFQ 목록',              href: '../04_dev_purchase/04-02_rfq_list.html' },
        { id: '04-03', label: 'RFQ 생성/발송',         href: '../04_dev_purchase/04-03_rfq_create.html' },
        { id: '04-04', label: 'RFQ 상세',              href: '../04_dev_purchase/04-04_rfq_detail.html' },
        { id: '04-05', label: '협력사 견적 제출',       href: '../04_dev_purchase/04-05_supplier_quote.html' },
        { id: '04-06', label: '견적 Breakdown 비교',   href: '../04_dev_purchase/04-06_quote_compare.html' },
        { id: '04-07', label: '부서별 검토',            href: '../04_dev_purchase/04-07_dept_review.html' },
        { id: '04-08', label: '협상 이력 관리',         href: '../04_dev_purchase/04-08_negotiation.html' },
        { id: '04-09', label: '원가절감안 등록',         href: '../04_dev_purchase/04-09_cost_reduction.html' },
        { id: '04-10', label: '업체 선정 품의/결재',    href: '../04_dev_purchase/04-10_selection_approval.html' },
        { id: '04-11', label: '심의입찰 평가',          href: '../04_dev_purchase/04-11_bid_evaluation.html' },
        { id: '04-12', label: '업체변경 / 이원화 품의', href: '../04_dev_purchase/04-12_supplier_change.html' }
      ]
    },
    {
      id: '05',
      label: '품질관리',
      icon: 'shield-check',
      children: [
        { id: '05-01', label: '협력사 품질 평가',       href: '../05_quality/05-01_supplier_quality.html' },
        { id: '05-02', label: 'APQP 일정 관리',        href: '../05_quality/05-02_apqp.html' },
        { id: '05-03', label: '샘플·금형 일정',         href: '../05_quality/05-03_sample_mold.html' },
        { id: '05-04', label: 'PPAP 문서 관리',        href: '../05_quality/05-04_ppap_list.html' },
        { id: '05-05', label: 'EO 접수 현황',          href: '../05_quality/05-05_eo_list.html' },
        { id: '05-06', label: '개발 요청서 (가단가)',   href: '../05_quality/05-06_dev_request.html' },
        { id: '05-07', label: '설계 변경 통보',         href: '../05_quality/05-07_design_notice.html' }
      ]
    },
    {
      id: '06',
      label: '단가관리',
      icon: 'tag',
      children: [
        { id: '06-01', label: '확정단가 목록',            href: '../06_price/06-01_price_list.html' },
        { id: '06-02', label: '확정단가 등록/상세',        href: '../06_price/06-02_price_detail.html' },
        { id: '06-03', label: '단가 이력 (시계열)',       href: '../06_price/06-03_price_history.html' },
        { id: '06-04', label: '가·정·사급단가 품의',      href: '../06_price/06-04_price_approval.html' },
        { id: '06-05', label: '단가 미결 현황',           href: '../06_price/06-05_price_pending.html' },
        { id: '06-06', label: '임의정산 관리',            href: '../06_price/06-06_retroactive.html' },
        { id: '06-07', label: '단가합의서',               href: '../06_price/06-07_price_agreement_list.html' }
      ]
    },
    // 화면 미구현 — 추후 복원
    /* {
      id: '07',
      label: '연계관리',
      icon: 'link',
      children: [
        { id: '07-01', label: 'ERP 양산 전환 체크리스트', href: '../07_erp/07-01_erp_checklist.html' },
        { id: '07-02', label: 'ERP 전송 이력',            href: '../07_erp/07-02_erp_history.html' },
        { id: '07-03', label: '외부 API 연동 현황',        href: '../07_erp/07-03_api_status.html' }
      ]
    },
    {
      id: '08',
      label: '변경관리',
      icon: 'refresh-cw',
      children: [
        { id: '08-01', label: '설계 변경 영향 분석',  href: '../08_change/08-01_design_change.html' },
        { id: '08-02', label: 'LME 변동 영향 분석',  href: '../08_change/08-02_lme_impact.html' },
        { id: '08-03', label: '환율 변동 영향 분석',  href: '../08_change/08-03_fx_impact.html' },
        { id: '08-04', label: '단가 변경 이력',        href: '../08_change/08-04_price_change.html' }
      ]
    }, */
    {
      id: '09',
      label: '협력사 관리',
      icon: 'users',
      children: [
        { id: '09-01', label: '협력사 등록 신청',   href: '../09_supplier/09-01_supplier_apply_list.html' },
        { id: '09-02', label: '협력사 신규 등록',   href: '../09_supplier/09-02_supplier_apply_form.html' },
        { id: '09-03', label: '적격성 심사·승인',   href: '../09_supplier/09-03_supplier_qualification.html' },
        { id: '09-04', label: '정식 협력사 마스터', href: '../09_supplier/09-04_supplier_master.html' },
        { id: '09-05', label: '협력사 등급평가',    href: '../09_supplier/09-05_supplier_grade.html' },
        { id: '09-06', label: '협력사 사후 평가',   href: '../09_supplier/09-06_supplier_eval.html' }
      ]
    }
  ];

  /* ──────────────────────────────────────────────────────────────
     2. 컨텍스트 (프로젝트·품번·사용자) — window.DEVSRM_CONTEXT 로 재정의 가능
  ────────────────────────────────────────────────────────────── */
  var CTX = W.DEVSRM_CONTEXT || {
    project: { code: 'PJT-520PHEV-FT-2026', name: '520 PHEV Fuel Tank Module 개발' },
    part:    { code: 'H1110-T100', name: "Frame Sub Ass'y" },
    user:    { name: '김개발', dept: '개발구매팀', initial: '김' },
    notificationCount: 3
  };

  /* ──────────────────────────────────────────────────────────────
     3. 활성 메뉴 감지  (<body data-menu="01-02">)
     같은 id를 공유하는 항목(09-01 계열)은 현재 파일명으로 추가 구분
  ────────────────────────────────────────────────────────────── */
  var activeId = (D.body.dataset && D.body.dataset.menu) || '';
  var currentFile = location.pathname.split('/').pop().split('?')[0];

  function isItemActive(item) {
    if (item.id !== activeId) return false;
    var itemFile = item.href.split('/').pop();
    return itemFile === currentFile;
  }

  function findActiveGroup(menuId) {
    for (var i = 0; i < MENU.length; i++) {
      for (var j = 0; j < MENU[i].children.length; j++) {
        if (isItemActive(MENU[i].children[j])) return MENU[i].id;
      }
    }
    /* href 매칭 실패 시 id 기준으로 fallback */
    for (var i = 0; i < MENU.length; i++) {
      for (var j = 0; j < MENU[i].children.length; j++) {
        if (MENU[i].children[j].id === menuId) return MENU[i].id;
      }
    }
    return null;
  }
  var activeGroupId = findActiveGroup(activeId);

  /* ──────────────────────────────────────────────────────────────
     4. 상태
  ────────────────────────────────────────────────────────────── */
  var isOpen = false;

  /* ──────────────────────────────────────────────────────────────
     5. 헤더 HTML 생성
  ────────────────────────────────────────────────────────────── */
  function buildHeaderHTML() {
    var notifBadge = CTX.notificationCount > 0
      ? '<span class="srm-header-notif">' + CTX.notificationCount + '</span>'
      : '';

    return (
      '<button id="srm-gnb-toggle" class="srm-gnb-toggle" aria-label="메뉴 열기/닫기">' +
        '<i data-lucide="menu" style="width:18px;height:18px"></i>' +
      '</button>' +

      '<div class="srm-header-logo">Dev<span>SRM</span></div>' +
      '<div class="srm-header-divider"></div>' +

      '<div class="srm-header-context">' +
        '<span class="srm-header-ctx-label">프로젝트</span>' +
        '<strong class="srm-header-ctx-val">' + CTX.project.code + '</strong>' +
        '<span class="srm-header-ctx-sep"></span>' +
        '<span class="srm-header-ctx-label">품번</span>' +
        '<strong class="srm-header-ctx-val">' + CTX.part.code + '</strong>' +
      '</div>' +

      '<div class="srm-header-spacer"></div>' +

      '<div class="srm-header-user">' +
        '<button class="srm-notif-btn" title="알림">' +
          '<i data-lucide="bell" style="width:16px;height:16px"></i>' +
          notifBadge +
        '</button>' +
        '<div class="srm-user-avatar">' + CTX.user.initial + '</div>' +
        '<span>' + CTX.user.name + ' (' + CTX.user.dept + ')</span>' +
        '<i data-lucide="chevron-down" style="width:14px;height:14px;opacity:0.55"></i>' +
      '</div>'
    );
  }

  /* ──────────────────────────────────────────────────────────────
     6. 사이드바 내부 HTML 생성
  ────────────────────────────────────────────────────────────── */
  function buildSidebarHTML() {
    var html = '';

    /* 사용자 프로필 */
    html +=
      '<div class="srm-sidebar-profile">' +
        '<div class="srm-sidebar-avatar">' + CTX.user.initial + '</div>' +
        '<div class="srm-sidebar-profile-info">' +
          '<div class="srm-sidebar-profile-name">' + CTX.user.name + '</div>' +
          '<div class="srm-sidebar-profile-dept">' + CTX.user.dept + '</div>' +
        '</div>' +
      '</div>';

    /* 현재 프로젝트 */
    html +=
      '<div class="srm-sidebar-project">' +
        '<div class="srm-sidebar-project-code">' + CTX.project.code + '</div>' +
        '<div class="srm-sidebar-project-name">' + CTX.project.name + '</div>' +
      '</div>';

    /* 메뉴 그룹 */
    for (var i = 0; i < MENU.length; i++) {
      var group = MENU[i];
      var isActiveGroup = group.id === activeGroupId;

      html += '<div class="srm-nav-group' + (isActiveGroup ? ' open' : '') + '" data-group="' + group.id + '">';

      /* 1뎁스 헤더 (아코디언 토글) */
      html +=
        '<button class="srm-nav-group-header">' +
          '<i data-lucide="' + group.icon + '" style="width:18px;height:18px;flex-shrink:0"></i>' +
          '<span class="srm-nav-group-label">' + group.label + '</span>' +
          '<i data-lucide="chevron-right" class="srm-nav-chevron" style="width:13px;height:13px"></i>' +
        '</button>';

      /* 2뎁스 자식 목록 */
      html += '<ul class="srm-nav-children" role="list">';
      for (var j = 0; j < group.children.length; j++) {
        var item = group.children[j];
        var isActive = isItemActive(item);
        html +=
          '<li>' +
            '<a href="' + item.href + '"' +
              ' class="srm-nav-item' + (isActive ? ' active' : '') + '"' +
              ' data-menu="' + item.id + '">' +
              '<span class="srm-nav-item-dot"></span>' +
              '<span>' + item.label + '</span>' +
            '</a>' +
          '</li>';
      }
      html += '</ul>';

      html += '</div>'; /* srm-nav-group */
    }

    return html;
  }

  /* ──────────────────────────────────────────────────────────────
     7. 열기 / 닫기
  ────────────────────────────────────────────────────────────── */
  function openSidebar() {
    isOpen = true;
    D.getElementById('srm-sidebar').classList.add('open');
    D.getElementById('srm-overlay').classList.add('visible');
    setToggleIcon('x');
  }

  function closeSidebar() {
    isOpen = false;
    D.getElementById('srm-sidebar').classList.remove('open');
    D.getElementById('srm-overlay').classList.remove('visible');
    setToggleIcon('menu');
  }

  function setToggleIcon(name) {
    var btn = D.getElementById('srm-gnb-toggle');
    if (!btn) return;
    btn.innerHTML = '<i data-lucide="' + name + '" style="width:18px;height:18px"></i>';
    btn.setAttribute('aria-label', name === 'menu' ? '메뉴 열기' : '메뉴 닫기');
    if (W.lucide) W.lucide.createIcons({ nodes: [btn] });
  }

  /* ──────────────────────────────────────────────────────────────
     8. 아코디언 초기화
  ────────────────────────────────────────────────────────────── */
  function initAccordion() {
    var headers = D.querySelectorAll('.srm-nav-group-header');
    for (var k = 0; k < headers.length; k++) {
      headers[k].addEventListener('click', function (e) {
        var group = e.currentTarget.closest('.srm-nav-group');
        var wasOpen = group.classList.contains('open');

        /* 다른 그룹 모두 닫기 */
        var allGroups = D.querySelectorAll('.srm-nav-group');
        for (var g = 0; g < allGroups.length; g++) {
          allGroups[g].classList.remove('open');
        }

        /* 클릭한 그룹 토글 */
        if (!wasOpen) group.classList.add('open');
      });
    }
  }

  /* ──────────────────────────────────────────────────────────────
     9. 이벤트 핸들러 연결
  ────────────────────────────────────────────────────────────── */
  function initEventHandlers() {
    /* GNB 토글 버튼 */
    var toggle = D.getElementById('srm-gnb-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        if (isOpen) closeSidebar(); else openSidebar();
      });
    }

    /* 오버레이 클릭 → 닫기 */
    var overlay = D.getElementById('srm-overlay');
    if (overlay) overlay.addEventListener('click', closeSidebar);

    /* ESC 키 → 닫기 */
    D.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeSidebar();
    });

    /* 메뉴 항목 클릭 → 닫기 (같은 페이지 내 이동 시에도 닫힘) */
    var items = D.querySelectorAll('.srm-nav-item');
    for (var m = 0; m < items.length; m++) {
      items[m].addEventListener('click', closeSidebar);
    }
  }

  /* ──────────────────────────────────────────────────────────────
     10. DOM 주입 및 초기화
  ────────────────────────────────────────────────────────────── */
  function init() {
    /* ── 헤더 ── */
    var header = D.createElement('header');
    header.id = 'srm-header';
    header.className = 'srm-header';
    header.innerHTML = buildHeaderHTML();

    /* ── 오버레이 ── */
    var overlay = D.createElement('div');
    overlay.id = 'srm-overlay';
    overlay.className = 'srm-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    /* ── 사이드바 ── */
    var sidebar = D.createElement('nav');
    sidebar.id = 'srm-sidebar';
    sidebar.className = 'srm-sidebar';
    sidebar.setAttribute('aria-label', '주 내비게이션');

    var inner = D.createElement('div');
    inner.className = 'srm-sidebar-inner';
    inner.innerHTML = buildSidebarHTML();
    sidebar.appendChild(inner);

    /* ── body 앞에 삽입 (prepend 순서: 마지막 prepend가 첫 번째가 됨) ── */
    /* 최종 DOM 순서: header → overlay → sidebar → [페이지 콘텐츠]     */
    /* z-index로 스태킹 제어하므로 DOM 순서는 렌더링에 영향 없음         */
    D.body.prepend(sidebar);
    D.body.prepend(overlay);
    D.body.prepend(header);

    /* ── 동작 초기화 ── */
    initAccordion();
    initEventHandlers();

    /* ── Lucide 아이콘 렌더 ── */
    if (W.lucide && W.lucide.createIcons) {
      W.lucide.createIcons();
    } else {
      /* lucide가 아직 로드되지 않은 경우 load 이벤트에서 처리 */
      W.addEventListener('load', function () {
        if (W.lucide && W.lucide.createIcons) W.lucide.createIcons();
      });
    }
  }

  /* ──────────────────────────────────────────────────────────────
     11. 실행 진입점
  ────────────────────────────────────────────────────────────── */
  if (D.readyState === 'loading') {
    D.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ──────────────────────────────────────────────────────────────
     12. 공개 API (다른 스크립트에서 호출 가능)
         window.DevSRM.openSidebar()
         window.DevSRM.closeSidebar()
         window.DevSRM.setContext({ project, part, user, notificationCount })
  ────────────────────────────────────────────────────────────── */
  W.DevSRM = {
    openSidebar: openSidebar,
    closeSidebar: closeSidebar,
    /** 헤더 컨텍스트(프로젝트/품번) 런타임 갱신 */
    setContext: function (ctx) {
      var pCode = D.querySelector('.srm-header-ctx-val');
      if (!pCode) return;
      var vals = D.querySelectorAll('.srm-header-ctx-val');
      if (ctx.project && ctx.project.code && vals[0]) vals[0].textContent = ctx.project.code;
      if (ctx.part    && ctx.part.code    && vals[1]) vals[1].textContent = ctx.part.code;
    }
  };

})(window, document);
