import '../styles/globals.css'
import { fal } from "@fal-ai/client";
import { AuthProvider } from '../contexts/auth-context';

// 客户端使用代理来保护API密钥
if (typeof window !== "undefined") {
  fal.config({
    proxyUrl: "/api/fal/proxy",
  });
}

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp 