/**
 * 단가합의서 공유 더미 데이터 (06-07 목록 ↔ 상세 일관성 유지용)
 * 백엔드 연동 없음. 목록/상세 양쪽에서 동일 데이터를 사용한다.
 */
window.PRICE_AGREEMENTS = [
  {
    no: 'PA-2026-0001', supplier: '(주)대구부품', bizno: '503-81-44210', mgr: '박영업 (영업팀)',
    refNo: 'RFQ-2026-0042', dept: '개발구매팀 / 김개발',
    periodStart: '2026-07-01', periodEnd: '2027-06-30',
    pay: '월말 마감 익월 말 현금 결제', annualQty: '100,000', moq: '1,000',
    varCond: 'LME 알루미늄 기준가 ±5% 초과 변동 시 분기 단위 재산정. 환율 1,400원/USD 초과 지속 시 별도 협의.',
    status: '합의대기', created: '2026-06-22',
    buyer:   { title: '구매담당 임원', name: '정구매', date: '2026-06-22' },
    partner: { title: '대표이사',     name: '한대표', date: '—' },
    items: [
      { code: 'H1110-T100', name: "Frame Sub Ass'y",    spec: 'AL6061 / 2.85kg', unit: 'EA', base: 14500, agreed: 14200 },
      { code: 'H1110-T101', name: 'Bracket Assy Upper', spec: 'SPCC / 0.42kg',   unit: 'EA', base: 2200,  agreed: 2150  },
      { code: 'H1110-T102', name: 'Cover Plate',        spec: 'AL6061 / 0.38kg', unit: 'EA', base: 1800,  agreed: 1820  }
    ],
    versions: [
      { ver: 'v3', date: '2026-06-22', user: '김개발', summary: 'H1110-T100 합의단가 14,200원으로 조정 (LME 하락 반영)', status: '합의대기', current: true },
      { ver: 'v2', date: '2026-06-15', user: '김개발', summary: '결제조건 변경 (어음 60일 → 익월 말 현금)', status: '작성중' },
      { ver: 'v1', date: '2026-06-10', user: '김개발', summary: '최초 작성 — 기존단가 기준 등록', status: '작성중' }
    ]
  },
  {
    no: 'PA-2026-0002', supplier: '(주)동화공업', bizno: '134-81-56766', mgr: '최영업 (영업1팀)',
    refNo: 'RFQ-2026-0031', dept: '개발구매팀 / 이구매',
    periodStart: '2026-05-01', periodEnd: '2027-04-30',
    pay: '월말 마감 익월 말 현금 결제', annualQty: '80,000', moq: '500',
    varCond: '강판 기준가 ±3% 초과 변동 시 반기 단위 재산정.',
    status: '합의완료', created: '2026-05-10',
    buyer:   { title: '구매팀장',   name: '이구매', date: '2026-05-12' },
    partner: { title: '영업이사',   name: '동화업', date: '2026-05-12' },
    items: [
      { code: 'H1120-P200', name: 'Reinforcement Panel', spec: 'SPCC / 1.20kg', unit: 'EA', base: 3200, agreed: 3100 },
      { code: 'H1120-P201', name: 'Stiffener',           spec: 'SPCC / 0.35kg', unit: 'EA', base: 900,  agreed: 900  }
    ],
    versions: [
      { ver: 'v2', date: '2026-05-10', user: '이구매', summary: '합의 완료 (양사 날인)', status: '합의완료', current: true },
      { ver: 'v1', date: '2026-05-02', user: '이구매', summary: '최초 작성', status: '작성중' }
    ]
  },
  {
    no: 'PA-2026-0003', supplier: '유니테크노(주)', bizno: '312-86-53066', mgr: '강영업 (영업팀)',
    refNo: 'RFQ-2026-0055', dept: '개발구매팀 / 김개발',
    periodStart: '2026-08-01', periodEnd: '2027-07-31',
    pay: '납품 즉시 현금 결제', annualQty: '40,000', moq: '1,000',
    varCond: 'LME 알루미늄 기준가 ±5% 초과 변동 시 분기 단위 재산정.',
    status: '작성중', created: '2026-06-18',
    buyer:   { title: '구매담당',   name: '김개발', date: '—' },
    partner: { title: '영업팀장',   name: '유니업', date: '—' },
    items: [
      { code: 'H1130-A300', name: 'Alu Housing', spec: 'AL6061 / 1.65kg', unit: 'EA', base: 8800, agreed: 8600 }
    ],
    versions: [
      { ver: 'v1', date: '2026-06-18', user: '김개발', summary: '최초 작성 — 기존단가 기준 등록', status: '작성중', current: true }
    ]
  },
  {
    no: 'PA-2026-0004', supplier: '(주)태양정공', bizno: '130-86-44583', mgr: '윤영업 (영업2팀)',
    refNo: 'RFQ-2026-0018', dept: '개발구매팀 / 이구매',
    periodStart: '2026-03-01', periodEnd: '2027-02-28',
    pay: '월말 마감 익월 말 어음 60일', annualQty: '60,000', moq: '2,000',
    varCond: 'LME 알루미늄 기준가 ±5% 초과 변동 시 분기 단위 재산정.',
    status: '합의완료', created: '2026-04-02',
    buyer:   { title: '구매팀장', name: '이구매', date: '2026-04-05' },
    partner: { title: '대표이사', name: '태양공', date: '2026-04-05' },
    items: [
      { code: 'H1140-A400', name: 'Casting Bracket', spec: 'AL6061 / 0.95kg', unit: 'EA', base: 5400, agreed: 5250 },
      { code: 'H1140-A401', name: 'Boss',            spec: 'AL6061 / 0.12kg', unit: 'EA', base: 1200, agreed: 1200 }
    ],
    versions: [
      { ver: 'v2', date: '2026-04-02', user: '이구매', summary: '합의 완료 (양사 날인)', status: '합의완료', current: true },
      { ver: 'v1', date: '2026-03-25', user: '이구매', summary: '최초 작성', status: '작성중' }
    ]
  },
  {
    no: 'PA-2026-0005', supplier: '(주)디팜스테크', bizno: '123-81-98150', mgr: '서영업 (영업팀)',
    refNo: 'RFQ-2026-0061', dept: '개발구매팀 / 김개발',
    periodStart: '2026-09-01', periodEnd: '2027-08-31',
    pay: '월말 마감 익월 말 현금 결제', annualQty: '120,000', moq: '5,000',
    varCond: '전자부품 환율 연동 — 1,400원/USD 초과 지속 시 별도 협의.',
    status: '합의대기', created: '2026-06-20',
    buyer:   { title: '구매담당 임원', name: '정구매', date: '2026-06-20' },
    partner: { title: '대표이사',     name: '디팜대', date: '—' },
    items: [
      { code: 'H1150-E500', name: 'Sensor Mount', spec: 'PA66-GF30 / 0.08kg', unit: 'EA', base: 4200, agreed: 4400 }
    ],
    versions: [
      { ver: 'v1', date: '2026-06-20', user: '김개발', summary: '최초 작성 — 환율 상승분 반영 단가 제시', status: '합의대기', current: true }
    ]
  },
  {
    no: 'PA-2026-0006', supplier: '(주)한길표면', bizno: '118-86-55210', mgr: '노영업 (영업팀)',
    refNo: 'RFQ-2026-0070', dept: '개발구매팀 / 이구매',
    periodStart: '2026-10-01', periodEnd: '2027-09-30',
    pay: '월말 마감 익월 말 현금 결제', annualQty: '30,000', moq: '1,000',
    varCond: '표면처리 약품가 ±5% 초과 변동 시 반기 단위 재산정.',
    status: '작성중', created: '2026-06-21',
    buyer:   { title: '구매담당', name: '이구매', date: '—' },
    partner: { title: '영업팀장', name: '한길업', date: '—' },
    items: [
      { code: 'H1160-S600', name: 'Coated Plate', spec: 'SPCC + 아연도금 / 0.40kg', unit: 'EA', base: 2600, agreed: 2550 }
    ],
    versions: [
      { ver: 'v1', date: '2026-06-21', user: '이구매', summary: '최초 작성 — 기존단가 기준 등록', status: '작성중', current: true }
    ]
  }
];
