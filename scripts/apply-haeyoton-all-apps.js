#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 토스 말투체 변환 규칙
const TONE_RULES = [
  // 기본 동작 - 더 구체적인 패턴 먼저
  [/이 이미지 사용/g, '이 이미지 써볼게요'],
  [/생성하기/g, '만들기'],
  [/생성하세요/g, '만들어요'],
  [/생성/g, '만들기'],
  [/업로드하기/g, '올리기'],
  [/업로드하세요/g, '올려요'],
  [/업로드/g, '올리기'],
  [/삭제하기/g, '없애기'],
  [/삭제하세요/g, '없애요'],
  [/삭제/g, '없애기'],
  [/제거하기/g, '없애기'],
  [/제거하세요/g, '없애요'],
  [/제거/g, '없애기'],

  // 저장/완료
  [/완료!/g, '완료했어요!'],
  [/완료\s/g, '완료했어요 '],
  [/저장하기/g, '저장해요'],
  [/저장하세요/g, '저장해요'],

  // 분석/살펴보기
  [/분석하기/g, '살펴보기'],
  [/분석하세요/g, '살펴볼게요'],
  [/분석/g, '살펴보기'],
  [/검색하기/g, '찾기'],
  [/검색하세요/g, '찾아봐요'],
  [/검색/g, '찾기'],

  // 다운로드
  [/다운로드하기/g, '담아받기'],
  [/다운로드하세요/g, '담아받아요'],
  [/다운로드/g, '담아받기'],
  [/ZIP으로 다운로드/g, '모두 담아받기'],

  // 건너뛰기
  [/건너뛰기/g, '이 단계는 건너뛸게요'],

  // 확인
  [/확인하기/g, '확인해요'],
  [/확인하세요/g, '확인해봐요'],
  [/확인/g, '확인해요'],
];

function applyToneRules(content) {
  let result = content;
  for (const [pattern, replacement] of TONE_RULES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const modified = applyToneRules(content);

    if (content !== modified) {
      fs.writeFileSync(filePath, modified, 'utf8');
      return { status: 'modified', path: filePath };
    }
    return { status: 'unchanged', path: filePath };
  } catch (err) {
    return { status: 'error', path: filePath, error: err.message };
  }
}

const appsDir = '/Users/juuuno/Desktop/macminim4/dev/nextjs/apps';
const apps = fs.readdirSync(appsDir).filter(f =>
  fs.statSync(path.join(appsDir, f)).isDirectory()
);

console.log(`🔍 Found ${apps.length} apps\n`);

let totalModified = 0;
let totalUnchanged = 0;
let totalError = 0;

apps.forEach(appName => {
  const appPath = path.join(appsDir, appName);

  // src/app 또는 app 폴더 찾기
  let appDirPath = path.join(appPath, 'src/app');
  if (!fs.existsSync(appDirPath)) {
    appDirPath = path.join(appPath, 'app');
  }

  if (!fs.existsSync(appDirPath)) {
    console.log(`⊘ ${appName}: No app directory found`);
    return;
  }

  try {
    // page.tsx 찾기 (public 제외)
    const result = execSync(
      `find "${appDirPath}" -name "page.tsx" -type f ! -path "*/public/*" ! -path "*/.next/*" ! -path "*/node_modules/*"`,
      { encoding: 'utf8' }
    );

    const files = result.trim().split('\n').filter(f => f);
    if (files.length === 0) {
      console.log(`⊘ ${appName}: No page.tsx files found`);
      return;
    }

    console.log(`📁 ${appName} (${files.length} files)`);

    let appModified = 0;
    files.forEach(file => {
      const result = processFile(file);
      if (result.status === 'modified') {
        appModified++;
        totalModified++;
        console.log(`  ✓ ${path.relative(appPath, file)}`);
      } else if (result.status === 'unchanged') {
        totalUnchanged++;
      } else {
        totalError++;
      }
    });

    if (appModified === 0) {
      console.log(`  (모두 이미 적용됨)`);
    }
    console.log('');

  } catch (err) {
    console.log(`✗ ${appName}: ${err.message}\n`);
    totalError++;
  }
});

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`총 결과`);
console.log(`✓ 수정된 파일: ${totalModified}`);
console.log(`- 이미 적용됨: ${totalUnchanged}`);
console.log(`✗ 오류: ${totalError}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
