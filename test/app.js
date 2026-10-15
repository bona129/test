/**
 * ==============================================================================
 * 퍼스트 클래스 비서실 : 고객접견 실무 시뮬레이터 (app.js)
 * 고등학교 3학년 비서·사무행정 교과 실습용 웹 애플리케이션
 * 
 * [선생님을 위한 안내]
 * - 아래 SCENARIOS 배열의 내용을 수정하거나 추가하면 시뮬레이터의 문제와 해설이 바로 변경됩니다.
 * - 별도의 데이터베이스나 서버 없이 브라우저 자체에서 안전하게 작동합니다.
 * ==============================================================================
 */

// ==============================================================================
// 1. 시나리오 데이터베이스 (교사용 상황 및 문제 데이터)
// ==============================================================================
const SCENARIOS = [
  {
    id: 1,
    category: "VIP 내방객 응대",
    visitor: {
      name: "박성민 전무",
      company: "(주)글로벌네트웍스",
      status: "사전 약속 있음 (14:00)",
      purpose: "대표이사와 신규 전략 프로젝트 2차 협의차 내방",
      dialogue: "안녕하세요. 오늘 2시에 최 대표님과 미팅이 약속되어 있어 찾아왔습니다.",
      avatar: "👔",
      mood: "normal" // normal, warning, urgent
    },
    // [1단계: 올바른 인사 각도]
    correctAngle: 30, // 30° 보통례
    angleExplanations: {
      15: "목례(15°)는 복도에서 우연히 마주치거나 가벼운 스침 인사일 때 적절합니다. 사전에 약속된 정식 내방객에게는 정규 인사인 보통례(30°)를 해야 격식에 맞습니다.",
      30: "정답입니다! 보통례(30°)는 고객을 처음 맞이하고 배웅할 때 행하는 가장 표준적인 비즈니스 정규 인사입니다. 신뢰감과 정중함을 동시에 전달합니다.",
      45: "정중례(45°)는 사죄, 깊은 감사, 또는 최고위직 국가 의전 시 행하는 인사입니다. 일반적인 내방객 첫 영접에는 보통례(30°)가 가장 자연스럽고 알맞습니다."
    },
    // [2단계: 비즈니스 언어 및 행동 선택지]
    dialogueOptions: [
      {
        id: 1,
        text: "“박성민 전무님, 어서 오십시오. 대표님께서 기다리고 계셨습니다. 이쪽 안쪽 응접실로 안내해 드리겠습니다.”",
        isCorrect: true,
        reason: "내방객의 직함(전무님)을 부르며 반갑게 맞이하고, 상사가 이미 기다리고 있음을 밝혀 내방객을 존중하는 가장 표준적인 비서의 모범 응대입니다."
      },
      {
        id: 2,
        text: "“아, 네. 대표실 안으로 그냥 들어가시면 됩니다. 지금 안에 계십니다.”",
        isCorrect: false,
        reason: "내방객을 안내 없이 혼자 집무실로 들여보내는 것은 비서의 결례입니다. 항상 먼저 응접실로 안내하거나 노크 후 문을 열어드려야 합니다."
      },
      {
        id: 3,
        text: "“전무님 오셨습니까? 대표님은 지금 화장실 가셨는데 여기서 잠깐 서서 기다리세요.”",
        isCorrect: false,
        reason: "상사의 개인적 생리 현상이나 사생활을 내방객에게 구체적으로 알리는 것은 금기이며, 고객을 서서 기다리게 하는 것은 매우 무례합니다."
      },
      {
        id: 4,
        text: "“대표님 방에 커피 나오셨으니 들어가서 드시면 되십니다.”",
        isCorrect: false,
        reason: "‘커피 나오셨으니’, ‘되십니다’는 사물을 불필요하게 높인 잘못된 이중 존칭입니다. ‘커피를 준비해 두었으니’가 올바른 표현입니다."
      }
    ],
    // 실무 핵심 코칭 노트
    etiquetteTip: "내방객 영접 시에는 방문객의 성명과 직함을 정확히 확인하고, 정규 인사(보통례 30°)와 함께 쿠션어를 사용하여 편안한 응접실 좌석으로 유도해야 합니다."
  },

  {
    id: 2,
    category: "약속 없는 방문객(불청객) 응대",
    visitor: {
      name: "강태훈 팀장",
      company: "세이프티시스템",
      status: "사전 약속 없음 (영업 방문)",
      purpose: "대표이사에게 신규 보안 솔루션 카탈로그를 직접 전달하고자 불시 방문",
      dialogue: "안녕하십니까 비서관님! 대표님께 저희 획기적인 보안 솔루션 카탈로그를 직접 전달해 드리고자 잠시 뵙고자 합니다.",
      avatar: "💼",
      mood: "warning"
    },
    correctAngle: 30, // 보통례
    angleExplanations: {
      15: "목례(15°)는 약식 인사입니다. 약속 없는 방문객이라도 회사를 찾아온 손님이므로 단정하게 보통례(30°)로 영접한 뒤 거절 절차를 밟아야 기업 이미지가 손상되지 않습니다.",
      30: "정답입니다! 비록 사전 약속이 없는 방문객이더라도 기업을 찾아온 손님이므로 품격 있는 보통례(30°)로 맞이한 후, 정중하고 명확하게 사유를 밝히는 것이 원칙입니다.",
      45: "정중례(45°)는 과도합니다. 영업 방문객 응대 시에는 단정하고 절도 있는 보통례(30°)가 가장 적합합니다."
    },
    dialogueOptions: [
      {
        id: 1,
        text: "“대표님은 잡상인이나 영업사원 안 만나십니다. 바쁘시니 그냥 가세요.”",
        isCorrect: false,
        reason: "방문객을 멸시하거나 문전박대하는 언행은 회사의 대외 평판을 크게 훼손시킵니다."
      },
      {
        id: 2,
        text: "“실례지만 대표님께서는 사전 예약된 공식 일정으로 인하여 오늘은 면담이 어려우십니다. 명함과 제안서를 남겨주시면 대표님께 보고드린 후 별도로 연락드리도록 하겠습니다.”",
        isCorrect: true,
        reason: "쿠션어(실례지만)를 사용해 거절의 충격을 완화하고, 사전 약속 원칙을 정중히 설명하며 자료를 접수하는 가장 전문적인 비서의 거절 기법입니다."
      },
      {
        id: 3,
        text: "“대표님 지금 방에서 한가하시니까 일단 문 열고 들어가서 한번 물어보세요.”",
        isCorrect: false,
        reason: "상사의 시간 관리와 보안 유지는 비서의 핵심 임무입니다. 약속 없는 외부인을 상사에게 무단으로 연결해서는 안 됩니다."
      },
      {
        id: 4,
        text: "“제가 바빠서 그러는데 저기 로비 구석에 카탈로그 두고 가시면 나중에 볼게요.”",
        isCorrect: false,
        reason: "성의 없는 태도로 자료를 방치하게 하는 것은 방문객에 대한 최소한의 비즈니스 매너에 어긋납니다."
      }
    ],
    etiquetteTip: "약속 없는 방문객(불청객)을 거절할 때는 반드시 '쿠션어'를 사용하고, 거절의 사유가 방문객 개인이 아닌 '사전 예약 원칙 및 일정'에 있음을 정중하게 납득시켜야 합니다."
  },

  {
    id: 3,
    category: "상사 회의 지연 상황 대처",
    visitor: {
      name: "최정우 상무",
      company: "한양물산",
      status: "사전 약속 있음 (15:00)",
      purpose: "납품 계약서 최종 날인차 방문 (현재 시각 15:10, 상사 회의 지연 중)",
      dialogue: "약속 시간 3시가 벌써 10분이나 지났는데, 아직 대표님 회의가 안 끝났습니까? 저도 다음 일정이 있는데요.",
      avatar: "⏱️",
      mood: "warning"
    },
    correctAngle: 30, // 보통례 (사과와 함께)
    angleExplanations: {
      15: "고객이 대기로 인해 불편을 겪고 있는 상황에서 가벼운 목례(15°)만 하는 것은 무성의하게 보일 수 있습니다.",
      30: "정답입니다! 보통례(30°)를 취하며 진심 어린 표정으로 지연에 대한 정중한 사과와 양해를 구하는 것이 가장 적합합니다.",
      45: "상황에 따라 정중례(45°)도 가능하지만, 일반적인 회의 지연 시에는 보통례(30°)로도 충분히 정중한 사과와 상황 설명이 가능합니다."
    },
    dialogueOptions: [
      {
        id: 1,
        text: "“원래 대표님 회의가 맨날 길어지셔서요. 조금만 더 참으시고 기다리세요.”",
        isCorrect: false,
        reason: "상사의 업무 습관을 외부인에게 험담하듯 노출하고, 고객에게 참으라고 강요하는 것은 비서로서 절대 해서는 안 될 행동입니다."
      },
      {
        id: 2,
        text: "“최 상무님, 많이 기다리시게 하여 대단히 죄송합니다. 대표님께서 앞선 긴급 회의가 다소 길어지고 계십니다. 약 10분 정도 더 소요될 것으로 예상되는데, 안쪽 소파에서 차 한잔 드시며 잠시만 기다려 주시겠습니까?”",
        isCorrect: true,
        reason: "진심 어린 사과, 지연 사유의 정중한 설명, 구체적인 예상 소요 시간 안내(약 10분), 음료 대접을 통한 배려가 완벽히 결합된 답변입니다."
      },
      {
        id: 3,
        text: "“대표님 방에 그냥 쳐들어가서 상무님 오셨다고 소리칠까요?”",
        isCorrect: false,
        reason: "진행 중인 상사의 중요 회의 흐름을 깨뜨리는 극단적이고 무례한 행동입니다."
      },
      {
        id: 4,
        text: "“저는 시키는 대로만 하는 비서라 잘 모르겠습니다. 대표님께 직접 전화해 보세요.”",
        isCorrect: false,
        reason: "자신의 책임을 회피하고 고객에게 불편을 전가하는 극히 무책임한 응대입니다."
      }
    ],
    etiquetteTip: "약속 시간 지연 시에는 반드시 지연 사유를 정중히 밝히고, '예상 대기 시간'을 알려주어 고객이 일정을 가늠할 수 있게 배려해야 합니다. 또한 차나 다과를 권하여 대기의 지루함을 덜어주는 것이 센스 있는 비서의 역할입니다."
  },

  {
    id: 4,
    category: "불만 고객(컴플레인) 응대",
    visitor: {
      name: "이기철 대표",
      company: "성원산업",
      status: "긴급 항의 방문",
      purpose: "납품 자재 결함으로 인한 공장 가동 중단에 격분하여 고성 항의",
      dialogue: "지난주 납품받은 부품에 전량 불량이 발생해서 우리 라인이 멈췄어요! 지금 당장 대표이사 나오라고 하세요!",
      avatar: "😡",
      mood: "urgent"
    },
    correctAngle: 45, // 정중례 (깊은 사죄와 경청)
    angleExplanations: {
      15: "격앙된 불만 고객에게 가벼운 목례(15°)를 하면 성의가 없거나 상대를 무시한다고 느껴 더 큰 분노를 유발합니다.",
      30: "보통례(30°)도 기본적인 예의이나, 심각한 고객 피해와 거센 항의 상황에서는 사죄와 존중의 의미를 담아 깊이 숙이는 정중례(45°)가 신뢰 회복에 훨씬 효과적입니다.",
      45: "정답입니다! 극도로 화가 난 고객이나 회사의 귀책 사유로 큰 피해를 입은 고객을 영접할 때는 진심 어린 사과와 공감의 뜻을 담아 정중례(45°)로 맞이해야 흥분을 가라앉힐 수 있습니다."
    },
    dialogueOptions: [
      {
        id: 1,
        text: "“여기서 이렇게 소리 지르시면 업무방해죄로 경찰 부를 겁니다. 조용히 하세요.”",
        isCorrect: false,
        reason: "정당한 클레임을 제기하러 온 고객을 범죄자 취급하며 법적 위협을 가하면 걷잡을 수 없는 사태로 번집니다."
      },
      {
        id: 2,
        text: "“이기철 대표님, 저희 제품으로 인하여 막대한 차질과 심려를 끼쳐 드려 진심으로 송구스럽습니다. 로비가 소란스러우니 안쪽 조용한 VIP 상담실로 모시겠습니다. 즉시 담당 품질 총괄 본부장님께 연락하여 상세히 확인해 드리겠습니다.”",
        isCorrect: true,
        reason: "즉각적인 공감과 사과, 개방된 로비에서 독립된 상담실로의 신속한 장소 이동(분리 기법), 즉각적인 담당 부서장 연결 조치가 모두 들어맞은 최상의 위기관리 매너입니다."
      },
      {
        id: 3,
        text: "“공장이 멈춘 건 그쪽 사정이고, 납품 검수는 성원산업에서 승인하신 거 아닌가요?”",
        isCorrect: false,
        reason: "흥분한 고객과 잘잘못을 따지며 말싸움을 벌이는 것은 비서로서 최악의 응대입니다."
      },
      {
        id: 4,
        text: "“대표님은 불만 고객 절대 안 만나주시니 품질팀 전화번호 드릴게요.”",
        isCorrect: false,
        reason: "회사의 최고경영진을 방패 삼아 고객을 일방적으로 떠넘기는 불성실한 태도입니다."
      }
    ],
    etiquetteTip: "불만 고객 응대의 3대 원칙: ① 즉시 독립된 공간으로 이동시켜 다른 고객 및 직원과의 접촉을 차단할 것 ② 변명하지 말고 고객의 불편에 먼저 진심으로 공감할 것 ③ 경청 후 신속하게 권한 있는 담당자에게 인계할 것."
  },

  {
    id: 5,
    category: "명함 교환 및 상석 안내",
    visitor: {
      name: "신동열 이사",
      company: "(주)태양무역",
      status: "사전 약속 있음 (첫 방문)",
      purpose: "신임 임원 부임 인사 및 상호 업무 협약 논의차 방문",
      dialogue: "오늘 처음 인사드립니다. 태양무역 신동열 이사입니다. (두 손으로 정중히 명함을 건네며)",
      avatar: "🤝",
      mood: "normal"
    },
    correctAngle: 30, // 보통례
    angleExplanations: {
      15: "첫 대면에서 공식 명함을 주고받을 때는 목례(15°)보다는 비즈니스 정규 인사인 보통례(30°)가 신뢰감을 줍니다.",
      30: "정답입니다! 첫 대면 비즈니스 미팅 및 명함 교환 시에는 단정하고 바른 보통례(30°) 인사를 나누는 것이 표준 규범입니다.",
      45: "정중례(45°)는 첫 대면 인사치고는 과도하게 격식에 치우쳐 다소 어색함을 줄 수 있습니다."
    },
    dialogueOptions: [
      {
        id: 1,
        text: "“신동열 이사님, 반갑습니다. (두 손으로 명함을 정중히 받아 확인한 후) 저는 최 대표님을 보좌하는 비서 홍길동입니다. 안쪽 창가 쪽 상석으로 편히 앉으십시오. 대표님께 도착하셨음을 즉시 알리겠습니다.”",
        isCorrect: true,
        reason: "두 손으로 명함을 수수하고 성명과 직함을 확인한 뒤, 자신의 소속을 밝히고, 출입문에서 먼 창가 안쪽(상석)으로 고객을 안내하는 완벽한 의전 행동입니다."
      },
      {
        id: 2,
        text: "“(한 손으로 낚아채며 주머니에 넣고) 명함 잘 받았습니다. 문 앞 의자에 대충 앉아 계세요.”",
        isCorrect: false,
        reason: "명함을 한 손으로 받고 보지도 않고 주머니에 넣는 행위, 출입문 앞 하석(말석)에 고객을 앉히는 것은 심각한 의전 결례입니다."
      },
      {
        id: 3,
        text: "“명함 글씨가 너무 작아서 안 보이네요. 아무 데나 빈자리에 앉아 계세요.”",
        isCorrect: false,
        reason: "상대방의 명함에 대해 무례한 품평을 하거나 좌석을 안내하지 않고 방치하는 것은 비서의 기본 소양이 부족한 처사입니다."
      },
      {
        id: 4,
        text: "“신 이사님, 명함은 이따 대표님 오시면 대표님한테 직접 주세요.”",
        isCorrect: false,
        reason: "비서에게 먼저 건넨 명함을 거부하고 대표에게 직접 주라고 돌려보내는 것은 접견 에티켓에 크게 위배됩니다."
      }
    ],
    etiquetteTip: "명함은 반드시 두 손으로 받고, 받은 즉시 상대방의 회사명과 직함, 성명을 나직하게 읽어 확인해야 합니다. 접견실에서는 출입문에서 가장 먼 안쪽이나 전망이 좋은 자리가 '상석(상좌)'이므로 내방객을 그곳으로 정중히 안내해야 합니다."
  }
];

// ==============================================================================
// 2. 사운드 효과음 합성기 (Web Audio API - 외부 파일 의존성 없음)
// ==============================================================================
class SoundManager {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // 성공 / 정답 차임벨 (도-미-솔 청명한 화음)
  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      const startTime = this.ctx.currentTime + idx * 0.08;
      const duration = 0.28;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // 오답 / 주의 부저 (부드러운 저음 경고음)
  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, this.ctx.currentTime); // A3
    osc.frequency.linearRampToValueAtTime(180, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // 클릭 효과음
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}

// ==============================================================================
// 3. 애플리케이션 상태 관리 (State)
// ==============================================================================
const state = {
  traineeName: "",
  currentIndex: 0,
  score: 0,
  greetingScore: 0, // 인사 예절 점수 (최대 50점)
  dialogueScore: 0, // 언어/행동 점수 (최대 50점)
  selectedAngle: null,
  selectedDialogue: null,
  history: [] // 각 상황별 실습 결과 기록
};

const sound = new SoundManager();

// ==============================================================================
// 4. DOM 요소 참조
// ==============================================================================
const DOM = {
  // 화면
  startScreen: document.getElementById("start-screen"),
  simulationScreen: document.getElementById("simulation-screen"),
  resultScreen: document.getElementById("result-screen"),

  // 헤더 컨트롤
  soundToggleBtn: document.getElementById("soundToggleBtn"),
  soundIcon: document.getElementById("soundIcon"),
  guideBtn: document.getElementById("guideBtn"),

  // 시작 폼
  traineeNameInput: document.getElementById("traineeNameInput"),
  startSimBtn: document.getElementById("startSimBtn"),

  // 시뮬레이션 상태 바
  scenarioCounter: document.getElementById("scenarioCounter"),
  scenarioCategory: document.getElementById("scenarioCategory"),
  progressBar: document.getElementById("progressBar"),
  currentScoreBadge: document.getElementById("currentScoreBadge"),

  // 방문객 정보
  visitorAvatar: document.getElementById("visitorAvatar"),
  visitorMoodIndicator: document.getElementById("visitorMoodIndicator"),
  visitorCompany: document.getElementById("visitorCompany"),
  visitorAppt: document.getElementById("visitorAppt"),
  visitorName: document.getElementById("visitorName"),
  visitorPurpose: document.getElementById("visitorPurpose"),
  visitorDialogue: document.getElementById("visitorDialogue"),

  // 스텝 박스
  greetingStepBox: document.getElementById("greetingStepBox"),
  dialogueStepBox: document.getElementById("dialogueStepBox"),
  greetingOptionsGrid: document.getElementById("greetingOptionsGrid"),
  dialogueOptionsList: document.getElementById("dialogueOptionsList"),

  // 피드백 모달
  feedbackModal: document.getElementById("feedbackModal"),
  feedbackResultBadge: document.getElementById("feedbackResultBadge"),
  feedbackScoreAdded: document.getElementById("feedbackScoreAdded"),
  feedbackTitle: document.getElementById("feedbackTitle"),
  greetingAnalysisText: document.getElementById("greetingAnalysisText"),
  dialogueAnalysisText: document.getElementById("dialogueAnalysisText"),
  feedbackTipText: document.getElementById("feedbackTipText"),
  nextScenarioBtn: document.getElementById("nextScenarioBtn"),
  nextBtnText: document.getElementById("nextBtnText"),

  // 결과 화면
  resultTraineeName: document.getElementById("resultTraineeName"),
  resultGradeIcon: document.getElementById("resultGradeIcon"),
  resultGradeTitle: document.getElementById("resultGradeTitle"),
  resultTotalScore: document.getElementById("resultTotalScore"),
  resultGradeComment: document.getElementById("resultGradeComment"),
  greetingScoreBar: document.getElementById("greetingScoreBar"),
  greetingScoreText: document.getElementById("greetingScoreText"),
  dialogueScoreBar: document.getElementById("dialogueScoreBar"),
  dialogueScoreText: document.getElementById("dialogueScoreText"),
  reviewList: document.getElementById("reviewList"),
  restartBtn: document.getElementById("restartBtn"),
  printBtn: document.getElementById("printBtn"),

  // 가이드 모달
  guideModal: document.getElementById("guideModal"),
  closeGuideBtn: document.getElementById("closeGuideBtn"),
  dismissGuideBtn: document.getElementById("dismissGuideBtn")
};

// ==============================================================================
// 5. 화면 전환 및 초기화 함수
// ==============================================================================
function switchScreen(screen) {
  [DOM.startScreen, DOM.simulationScreen, DOM.resultScreen].forEach(s => {
    s.classList.remove("active");
  });
  screen.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetSimulation() {
  state.currentIndex = 0;
  state.score = 0;
  state.greetingScore = 0;
  state.dialogueScore = 0;
  state.selectedAngle = null;
  state.selectedDialogue = null;
  state.history = [];
}

// ==============================================================================
// 6. 시뮬레이션 단계별 렌더링
// ==============================================================================
function loadScenario(index) {
  const data = SCENARIOS[index];
  if (!data) return;

  // 상태 초기화
  state.selectedAngle = null;
  state.selectedDialogue = null;

  // 상태 바 갱신
  DOM.scenarioCounter.textContent = `상황 ${index + 1} / ${SCENARIOS.length}`;
  DOM.scenarioCategory.textContent = data.category;
  const progressPercent = ((index + 1) / SCENARIOS.length) * 100;
  DOM.progressBar.style.width = `${progressPercent}%`;
  DOM.currentScoreBadge.textContent = `${state.score}점`;

  // 내방객 카드 렌더링
  DOM.visitorAvatar.textContent = data.visitor.avatar;
  DOM.visitorCompany.textContent = data.visitor.company;
  DOM.visitorAppt.textContent = data.visitor.status;
  DOM.visitorName.textContent = data.visitor.name;
  DOM.visitorPurpose.textContent = data.visitor.purpose;
  DOM.visitorDialogue.textContent = data.visitor.dialogue;

  // 고객 기분 인디케이터
  DOM.visitorMoodIndicator.className = "visitor-status-indicator";
  if (data.visitor.mood === "urgent") {
    DOM.visitorMoodIndicator.classList.add("urgent");
  } else if (data.visitor.mood === "warning") {
    DOM.visitorMoodIndicator.classList.add("warning");
  }

  // 1단계 활성화, 2단계 비활성화
  DOM.greetingStepBox.classList.remove("disabled-step");
  DOM.greetingStepBox.classList.add("active-step");
  DOM.dialogueStepBox.classList.add("disabled-step");
  DOM.dialogueStepBox.classList.remove("active-step");

  // 인사 버튼 선택 해제
  const angleButtons = DOM.greetingOptionsGrid.querySelectorAll(".greeting-card-btn");
  angleButtons.forEach(btn => btn.classList.remove("selected"));

  // 2단계 선택지 리스트 렌더링
  renderDialogueOptions(data.dialogueOptions);
}

function renderDialogueOptions(options) {
  DOM.dialogueOptionsList.innerHTML = "";
  options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "dialogue-option-btn";
    btn.innerHTML = `
      <div class="dialogue-num">${idx + 1}</div>
      <div class="dialogue-text">${opt.text}</div>
    `;
    btn.addEventListener("click", () => handleDialogueChoice(opt));
    DOM.dialogueOptionsList.appendChild(btn);
  });
}

// ==============================================================================
// 7. 유저 인터랙션 핸들러
// ==============================================================================

// 1단계: 인사 각도 선택 핸들러
function handleGreetingChoice(angle) {
  sound.playClick();
  state.selectedAngle = angle;

  // 시각적 선택 표시
  const angleButtons = DOM.greetingOptionsGrid.querySelectorAll(".greeting-card-btn");
  angleButtons.forEach(btn => {
    if (parseInt(btn.getAttribute("data-angle"), 10) === angle) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });

  // 2단계 활성화로 부드럽게 전환
  DOM.greetingStepBox.classList.remove("active-step");
  DOM.dialogueStepBox.classList.remove("disabled-step");
  DOM.dialogueStepBox.classList.add("active-step");

  // 모바일 사용자를 위해 2단계 박스로 자동 스크롤
  setTimeout(() => {
    DOM.dialogueStepBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

// 2단계: 응대 대화 선택 핸들러 (판정 및 모달 팝업)
function handleDialogueChoice(dialogueOption) {
  if (state.selectedAngle === null) {
    alert("먼저 STEP 1에서 인사 예절(각도)을 선택해 주세요!");
    return;
  }

  // 중복 클릭 방지
  const optionButtons = DOM.dialogueOptionsList.querySelectorAll(".dialogue-option-btn");
  optionButtons.forEach(b => b.disabled = true);

  state.selectedDialogue = dialogueOption;
  const currentData = SCENARIOS[state.currentIndex];

  // 채점 로직 (인사 각도 10점 + 대화 10점 = 총 20점)
  const isGreetingCorrect = state.selectedAngle === currentData.correctAngle;
  const isDialogueCorrect = dialogueOption.isCorrect;

  let addedScore = 0;
  if (isGreetingCorrect) {
    addedScore += 10;
    state.greetingScore += 10;
  }
  if (isDialogueCorrect) {
    addedScore += 10;
    state.dialogueScore += 10;
  }

  state.score += addedScore;
  DOM.currentScoreBadge.textContent = `${state.score}점`;

  // 효과음 재생
  if (isGreetingCorrect && isDialogueCorrect) {
    sound.playCorrect();
  } else {
    sound.playWrong();
  }

  // 실습 기록 저장
  state.history.push({
    scenario: currentData,
    selectedAngle: state.selectedAngle,
    selectedDialogue: dialogueOption,
    isGreetingCorrect,
    isDialogueCorrect,
    addedScore
  });

  // 피드백 모달 표시
  showFeedbackModal({
    isGreetingCorrect,
    isDialogueCorrect,
    addedScore,
    currentData,
    dialogueOption
  });
}

// 피드백 모달 렌더링
function showFeedbackModal({ isGreetingCorrect, isDialogueCorrect, addedScore, currentData, dialogueOption }) {
  const isPerfect = isGreetingCorrect && isDialogueCorrect;

  // 뱃지 및 점수
  DOM.feedbackResultBadge.className = "feedback-result-badge " + (isPerfect ? "correct" : (addedScore > 0 ? "correct" : "wrong"));
  DOM.feedbackResultBadge.textContent = isPerfect ? "🎉 완벽한 응대입니다!" : (addedScore > 0 ? "💡 부분 정답입니다" : "⚠️ 보완이 필요합니다");
  DOM.feedbackScoreAdded.textContent = `+${addedScore}점 획득`;

  // 헤딩
  DOM.feedbackTitle.textContent = isPerfect 
    ? "비서로서 탁월한 에티켓과 언어를 구사하셨습니다."
    : "실무 상황에 알맞은 매너를 함께 점검해 보세요.";

  // 1단계 인사 예절 분석
  const greetingExplanation = currentData.angleExplanations[state.selectedAngle] || "인사 각도를 확인하세요.";
  DOM.greetingAnalysisText.innerHTML = `
    <strong>선택한 각도: ${state.selectedAngle}°</strong> (${isGreetingCorrect ? "✅ 정답" : "❌ 오답 - 올바른 각도: " + currentData.correctAngle + "°"})<br>
    ${greetingExplanation}
  `;

  // 2단계 대화 분석
  DOM.dialogueAnalysisText.innerHTML = `
    <strong>선택한 대화:</strong> ${isDialogueCorrect ? "✅ 적절한 비즈니스 표현" : "❌ 부적절한 표현"}<br>
    ${dialogueOption.reason}
  `;

  // 실무 핵심 노트
  DOM.feedbackTipText.textContent = currentData.etiquetteTip;

  // 다음 버튼 텍스트 설정
  const isLast = state.currentIndex === SCENARIOS.length - 1;
  DOM.nextBtnText.textContent = isLast ? "최종 실무 평가서 확인하기" : "다음 내방객 응대하기";

  // 모달 열기
  DOM.feedbackModal.classList.add("active");
  DOM.feedbackModal.setAttribute("aria-hidden", "false");
}

function handleNextScenario() {
  sound.playClick();
  DOM.feedbackModal.classList.remove("active");
  DOM.feedbackModal.setAttribute("aria-hidden", "true");

  if (state.currentIndex < SCENARIOS.length - 1) {
    state.currentIndex++;
    loadScenario(state.currentIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    // 최종 결과 화면 표시
    renderResultScreen();
  }
}

// ==============================================================================
// 8. 최종 결과 화면 렌더링
// ==============================================================================
function renderResultScreen() {
  switchScreen(DOM.resultScreen);

  // 학생 이름
  DOM.resultTraineeName.textContent = state.traineeName || "비서 실습생";

  // 총점 (100점 만점)
  DOM.resultTotalScore.textContent = state.score;

  // 등급 및 평가 코멘트
  let gradeIcon = "👑";
  let gradeTitle = "특급 수석 비서 (Executive Chief Secretary)";
  let gradeComment = "완벽한 인사 각도와 격조 높은 비즈니스 언어를 갖추었습니다. 대기업 및 최고경영진 비서실에 즉각 배치될 수 있는 최고의 실무 역량을 입증했습니다!";

  if (state.score >= 90) {
    gradeIcon = "👑";
    gradeTitle = "특급 수석 비서 (Executive Chief)";
    gradeComment = "고객의 상황을 꿰뚫어 보는 통찰력과 품격 있는 화법이 매우 뛰어납니다. 실무 면접에서 높은 점수를 받을 것입니다.";
  } else if (state.score >= 70) {
    gradeIcon = "⭐";
    gradeTitle = "프로페셔널 전문 비서 (Professional Secretary)";
    gradeComment = "기본적인 고객접견 예절과 대화 기술이 우수합니다. 조금만 더 쿠션어와 특수 상황 대처를 다듬는다면 완벽한 수석 비서로 도약할 수 있습니다.";
  } else {
    gradeIcon = "📝";
    gradeTitle = "성실한 수습 비서 (Junior Secretary)";
    gradeComment = "상황별 인사 각도 규범과 사물 존칭 지양 등 기초 비즈니스 매너에 대한 추가 복습이 권장됩니다. 아래 오답 노트를 꼼꼼히 확인하고 다시 도전해 보세요!";
  }

  DOM.resultGradeIcon.textContent = gradeIcon;
  DOM.resultGradeTitle.textContent = gradeTitle;
  DOM.resultGradeComment.textContent = gradeComment;

  // 영역별 세부 진단
  const greetingPercent = (state.greetingScore / 50) * 100;
  const dialoguePercent = (state.dialogueScore / 50) * 100;

  DOM.greetingScoreBar.style.width = `${greetingPercent}%`;
  DOM.greetingScoreText.textContent = `${state.greetingScore} / 50점 (${greetingPercent}%)`;

  DOM.dialogueScoreBar.style.width = `${dialoguePercent}%`;
  DOM.dialogueScoreText.textContent = `${state.dialogueScore} / 50점 (${dialoguePercent}%)`;

  // 5대 상황 복습 리스트 렌더링
  DOM.reviewList.innerHTML = "";
  state.history.forEach((item, idx) => {
    const isFullPass = item.isGreetingCorrect && item.isDialogueCorrect;
    const reviewItem = document.createElement("div");
    reviewItem.className = `review-item ${isFullPass ? "pass" : "fail"}`;
    reviewItem.innerHTML = `
      <div class="review-meta">
        <div class="review-step-name">${idx + 1}. [${item.scenario.category}] ${item.scenario.visitor.name}</div>
        <div class="review-step-sub">
          인사 예절: ${item.isGreetingCorrect ? "정답 (30°/45°)" : "오답 (" + item.selectedAngle + "° 선택)"} | 
          대화 매너: ${item.isDialogueCorrect ? "정답" : "오답"}
        </div>
      </div>
      <span class="review-badge ${isFullPass ? "pass" : "fail"}">
        ${item.addedScore} / 20점
      </span>
    `;
    DOM.reviewList.appendChild(reviewItem);
  });
}

// ==============================================================================
// 9. 이벤트 리스너 바인딩
// ==============================================================================
function initEventListeners() {
  // 효과음 토글
  DOM.soundToggleBtn.addEventListener("click", () => {
    const isEnabled = sound.toggle();
    DOM.soundIcon.textContent = isEnabled ? "🔔" : "🔕";
    DOM.soundToggleBtn.title = isEnabled ? "효과음 켜짐" : "효과음 꺼짐";
  });

  // 가이드 모달 열기/닫기
  DOM.guideBtn.addEventListener("click", () => {
    sound.playClick();
    DOM.guideModal.classList.add("active");
    DOM.guideModal.setAttribute("aria-hidden", "false");
  });

  [DOM.closeGuideBtn, DOM.dismissGuideBtn].forEach(btn => {
    btn.addEventListener("click", () => {
      sound.playClick();
      DOM.guideModal.classList.remove("active");
      DOM.guideModal.setAttribute("aria-hidden", "true");
    });
  });

  // 시작 버튼 클릭
  DOM.startSimBtn.addEventListener("click", () => {
    const name = DOM.traineeNameInput.value.trim();
    state.traineeName = name || "비서 실습생";
    sound.playClick();
    resetSimulation();
    loadScenario(0);
    switchScreen(DOM.simulationScreen);
  });

  // 엔터 키로 시작
  DOM.traineeNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      DOM.startSimBtn.click();
    }
  });

  // 1단계 인사 버튼 바인딩
  const angleButtons = DOM.greetingOptionsGrid.querySelectorAll(".greeting-card-btn");
  angleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const angle = parseInt(btn.getAttribute("data-angle"), 10);
      handleGreetingChoice(angle);
    });
  });

  // 모달 다음 버튼
  DOM.nextScenarioBtn.addEventListener("click", handleNextScenario);

  // 다시 시작 버튼
  DOM.restartBtn.addEventListener("click", () => {
    sound.playClick();
    resetSimulation();
    switchScreen(DOM.startScreen);
  });

  // 인쇄 / PDF 저장 버튼
  DOM.printBtn.addEventListener("click", () => {
    sound.playClick();
    window.print();
  });
}

// 애플리케이션 부팅
document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
});
