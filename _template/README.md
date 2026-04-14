# NCP Docker 배포 템플릿

vibers-home 파일럿 기준. Next.js standalone + Cloudflare Flexible SSL + Nginx Proxy Manager 구조.

## 변수 4개

| 변수 | 설명 | 예시 |
|------|------|------|
| `{{PROJECT_NAME}}` | 프로젝트명 | `faneasy`, `semophone` |
| `{{PORT}}` | NCP 호스트 포트 | `4130`, `4140` |
| `{{DOMAIN}}` | 서비스 도메인 | `faneasy.kr` |
| `{{NETWORK}}` | Docker 네트워크 | `npm_default` (기본값 그대로) |

## 사용법

### 1. 파일 복사 + 변수 치환

```bash
# 앱 디렉토리로 복사
cp _template/Dockerfile         apps/{{PROJECT_NAME}}/Dockerfile
cp _template/docker-compose.yml apps/{{PROJECT_NAME}}/docker-compose.yml (NCP 서버로 올림)
cp _template/.github/workflows/deploy.yml apps/{{PROJECT_NAME}}/.github/workflows/deploy.yml

# 변수 일괄 치환 (예: faneasy, 포트 4130)
sed -i '' \
  -e 's/{{PROJECT_NAME}}/faneasy/g' \
  -e 's/{{PORT}}/4130/g' \
  -e 's/{{DOMAIN}}/faneasy.kr/g' \
  -e 's/{{NETWORK}}/npm_default/g' \
  apps/faneasy/Dockerfile \
  apps/faneasy/.github/workflows/deploy.yml
```

### 2. next.config.ts 확인

```ts
const nextConfig: NextConfig = {
  output: 'standalone', // ← 필수
};
```

### 3. .dockerignore 생성 (빌드 컨텍스트 최소화)

```
.git
.next
node_modules
.env*
*.pptx
*.pdf
apps/*/node_modules
apps/*/.next
```

### 4. NCP 서버 디렉토리 + 파일 세팅

```bash
ssh wero "mkdir -p /root/projects/{{PROJECT_NAME}}/repo"

# docker-compose.yml 업로드
scp docker-compose.yml wero:/root/projects/{{PROJECT_NAME}}/docker-compose.yml

# .env 업로드 (앱별 환경변수)
scp .env.production wero:/root/projects/{{PROJECT_NAME}}/.env

# GitHub에서 소스 clone
ssh wero "cd /root/projects/{{PROJECT_NAME}}/repo && git clone <repo_url> ."
```

### 5. NPM Proxy Host 등록

NPM API 또는 http://49.50.138.93:81 에서:
- Domain: `{{DOMAIN}}`, `www.{{DOMAIN}}`
- Forward Host: `{{PROJECT_NAME}}`
- Forward Port: `3000`
- SSL: 없음 (Cloudflare Flexible이 처리)

```bash
# NPM API로 등록
NPM_TOKEN=$(ssh wero "curl -s -X POST http://localhost:81/api/tokens \
  -H 'Content-Type: application/json' \
  -d '{\"identity\":\"juuuno@naver.com\",\"secret\":\"wero2026\"}'" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

ssh wero "curl -s -X POST http://localhost:81/api/nginx/proxy-hosts \
  -H 'Authorization: Bearer $NPM_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    \"domain_names\": [\"{{DOMAIN}}\", \"www.{{DOMAIN}}\"],
    \"forward_host\": \"{{PROJECT_NAME}}\",
    \"forward_port\": 3000,
    \"forward_scheme\": \"http\",
    \"block_exploits\": true,
    \"allow_websocket_upgrade\": true,
    \"enabled\": true
  }'"
```

### 6. Cloudflare DNS 설정

```bash
CF_TOKEN="..."
ZONE_ID="..."  # dig {{DOMAIN}} NS → CF zone ID

# A 레코드 추가 (Proxied ON)
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
  -d '{"type":"A","name":"{{DOMAIN}}","content":"49.50.138.93","ttl":1,"proxied":true}'
```

---

## 배포 체크리스트

- [ ] 변수 4개 치환 완료 (`{{PROJECT_NAME}}`, `{{PORT}}`, `{{DOMAIN}}`, `{{NETWORK}}`)
- [ ] `next.config.ts`에 `output: 'standalone'` 확인
- [ ] NCP 서버 `/root/projects/{{PROJECT_NAME}}/` 디렉토리 생성
- [ ] NCP 서버 `/root/projects/{{PROJECT_NAME}}/.env` 업로드
- [ ] NCP 서버 `/root/projects/{{PROJECT_NAME}}/repo/` 에 소스 clone
- [ ] GitHub Actions Secrets 확인: `NCP_HOST`, `NCP_USER`, `NCP_SSH_KEY`
- [ ] Cloudflare DNS A 레코드 → `49.50.138.93`, Proxied ON
- [ ] NPM Proxy Host 추가 (`{{DOMAIN}}` → `{{PROJECT_NAME}}:3000`)
- [ ] Cloudflare SSL 모드: Flexible 확인
- [ ] 첫 배포 후 헬스체크: `curl -s -o /dev/null -w "%{http_code}" https://{{DOMAIN}}/`

---

## 포트 현황 (NCP wero 서버)

| 앱 | 포트 |
|----|------|
| matecheck-web | 4011 |
| wayo-web | 4030 |
| dlab-website | 4040 |
| nusucheck | 4080 |
| mission7 | 4090 |
| honsul | 4100 |
| monopage-api | 4110 |
| **vibers-home** | **4120** |
| 다음 앱 | 4130~ |

---

## 구조 요약

```
브라우저 ──HTTPS──▶ Cloudflare (SSL Flexible) ──HTTP──▶ NPM:80 ──HTTP──▶ {{PROJECT_NAME}}:3000
```

- SSL 인증서: Cloudflare 자동 관리 (갱신 불필요)
- NPM: HTTP 프록시만, SSL 없음
- 컨테이너: Next.js standalone, 3000 포트
