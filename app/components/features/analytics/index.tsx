import { useEffect } from "react";
import { useLocation } from "react-router";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const ID = "GTM-W9CGLLF3"; // Google AnalyticsのID

export default function Analytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    // Routerの外側なのでwindow.location.pathnameを使用
    window.dataLayer.push({
      event: "pageView",
      page: pathname,
    });
  }, [pathname]);

  return (
    <>
      <noscript>
        <iframe
          title="gtag"
          src={`https://www.googletagmanager.com/ns.html?id=${ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <script
        async={true}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Google Tag Manager script
        dangerouslySetInnerHTML={{
          __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', '${ID}');
            `,
        }}
      />
    </>
  );
}
