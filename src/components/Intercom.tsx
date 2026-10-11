import Script from 'next/script';

const APP_ID = 'f30o7b3j';

const SETTINGS = `window.intercomSettings = {
  api_base: "https://api-iam.intercom.io",
  app_id: "${APP_ID}",
};`;

// Official Intercom loader snippet (unchanged apart from the app id constant).
const LOADER = `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${APP_ID}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`;

/** Intercom chat widget, loaded on every public page. */
export function Intercom() {
  return (
    <>
      <Script id="intercom-settings" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: SETTINGS }} />
      <Script id="intercom-loader" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: LOADER }} />
    </>
  );
}
