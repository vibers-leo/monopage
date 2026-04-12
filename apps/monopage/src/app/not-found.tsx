export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>404</h1>
      <p style={{ color: '#999', fontSize: '0.875rem' }}>페이지를 찾을 수 없어요</p>
    </div>
  );
}
