# 지정 컴포넌트 스토리북 생성 (Context-Aware)

사용자가 지정한 컴포넌트 파일을 분석하여 최적화된 Storybook(CSF 3.0) 파일을 생성한다.

## 1. 대상 식별 및 성격 분석

- **대상 확인**: 사용자가 명령어와 함께 입력한 컴포넌트(예: @파일명 또는 파일 이름)를 최우선으로 분석해.
- **유형 분류**: 해당 컴포넌트의 Props 구조에 따라 아래와 같이 유형을 분류해:
  - **UI Unit**: Props(variant, size 등)로 외형이 결정되는 단일 컴포넌트
  - **Layout/Container**: `children`을 통해 내부 컨텐츠가 구성되는 컴포넌트
  - **Static/Simple**: Props가 없거나 UI 변화가 거의 없는 단순 컴포넌트

## 2. CSF 3.0 작성 가이드

- **파일 위치**: 분석한 컴포넌트와 동일 디렉토리에 `{FileName}.stories.tsx` 생성.
- **필수 Props 선별 (No Noise)**: UI 렌더링과 무관한 속성(aria-\*, role, id, callback 등)은 `argTypes`에서 제외하거나 `control: false` 처리하여 핵심에 집중.
- **유형별 최적화 설계**:
  1. **UI Unit**: 하나의 'Default' 스토리로 구성. 인터페이스를 분석해 최적화된 Control(select, radio, boolean 등)과 범용적인 초기값(`args`)을 자동 설정.
  2. **Layout/Container**: `children`의 다양한 활용 사례(Empty, Text, Complex UI 조합)를 별개 스토리로 구성하여 시각적 가이드 제공.
  3. **Static/Simple**: 불필요한 조작 도구 없이 'Default' 스토리 하나만 간결하게 작성.
- **Interactive Focus**: 여러 스토리를 나열하지 말고, 메인 스토리의 Controls 패널을 통해 모든 Props 조합을 실시간 테스트할 수 있도록 설계.

## 3. 실행 프로세스

- 지정된 컴포넌트 분석 결과와 분류(Unit/Layout/Static)를 먼저 보고해.
- 성격에 맞춰 생성될 코드 미리보기를 보여주고, 사용자의 승인을 얻어 파일을 생성해.
