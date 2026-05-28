# 이도건설 (YIDO CONSTRUCTION)

건물의 안전과 가치를 지키는 이도건설의 공식 웹사이트입니다.

## 🚀 GitHub에 업로드하는 방법

이 프로젝트를 자신의 GitHub 저장소에 업로드하려면 터미널(Terminal)에서 아래 명령어를 순서대로 입력하세요.

```bash
# 1. 로컬 저장소 초기화 (처음 한 번만)
git init

# 2. 모든 파일 스테이징
git add .

# 3. 변경 사항 기록
git commit -m "이도건설 웹사이트 레이아웃 및 기능 구현 완료"

# 4. 브랜치 이름을 main으로 변경
git branch -M main

# 5. GitHub 원격 저장소 연결
git remote add origin https://github.com/leesoyull/yidotest2.git

# 6. GitHub로 파일 전송
git push -u origin main
```

## 🛠 주요 수정 사항
- **회사 소개(About)**: 좌측 타이틀/설명, 우측 4대 핵심 가치 카드의 2단 레이아웃 적용
- **여백 최적화**: 모든 주요 섹션의 상하 여백을 시원하게 확대 (`py-24 md:py-32`)
- **견적 문의(CTA)**: 네이비색 섹션의 상하 여백 대폭 확대 (`py-32`)
- **푸터(Footer)**: 불필요한 여백을 줄이고 CEO 정보 등 필수 정보만 간결하게 배치
- **기능 추가**: 시공 실적의 '누적 시공 사례' 카드 클릭 시 포트폴리오 페이지로 이동
