const tsrStartManifest = () => ({
    routes: {
        __root__: {
            filePath: '/Users/admin/Developer/Pet/Den/lead-metrics/src/routes/__root.tsx',
            children: ['/_authenticated', '/_public', '/_unauthenticated'],
            css: ['/assets/index-DKyJSsCK.css'],
            preloads: [
                '/assets/index-CATHI92X.js',
                '/assets/vendor-react-1kp2ER4x.js',
                '/assets/vendor-zod-D40u6Zl6.js',
            ],
            scripts: [{ attrs: { type: 'module', async: true, src: '/assets/index-CATHI92X.js' } }],
        },
        '/_authenticated': {
            filePath: '/Users/admin/Developer/Pet/Den/lead-metrics/src/routes/_authenticated/route.tsx',
            children: [
                '/_authenticated/admin/',
                '/_authenticated/dashboard/',
                '/_authenticated/merchants/',
                '/_authenticated/vouchers/',
            ],
            preloads: [
                '/assets/route-Bxa2kfp4.js',
                '/assets/index-BgIF0Ych.js',
                '/assets/getPseudoElementBounds-D7ePV0js.js',
                '/assets/useScrollLock-BrgHxV8m.js',
            ],
        },
        '/_public': {
            filePath: '/Users/admin/Developer/Pet/Den/lead-metrics/src/routes/_public/route.tsx',
            children: ['/_public/'],
            preloads: ['/assets/route-b0KtfCgL.js'],
        },
        '/_unauthenticated': {
            filePath: '/Users/admin/Developer/Pet/Den/lead-metrics/src/routes/_unauthenticated/route.tsx',
            children: ['/_unauthenticated/activate/', '/_unauthenticated/login/'],
            preloads: ['/assets/route-CvpCBWE5.js'],
        },
        '/_public/': {
            filePath: '/Users/admin/Developer/Pet/Den/lead-metrics/src/routes/_public/index.tsx',
            children: void 0,
            preloads: ['/assets/index-BE_a3b1D.js'],
        },
        '/_authenticated/admin/': {
            filePath: '/Users/admin/Developer/Pet/Den/lead-metrics/src/routes/_authenticated/admin/index.tsx',
            children: void 0,
            preloads: ['/assets/index-CG7XaCY0.js', '/assets/index-CxJizuOO.js', '/assets/index-CPILwtgz.js'],
        },
        '/_authenticated/dashboard/': {
            filePath: '/Users/admin/Developer/Pet/Den/lead-metrics/src/routes/_authenticated/dashboard/index.tsx',
            children: void 0,
            preloads: ['/assets/index-B5JXjj6F.js', '/assets/index-CxJizuOO.js'],
        },
        '/_authenticated/merchants/': {
            filePath: '/Users/admin/Developer/Pet/Den/lead-metrics/src/routes/_authenticated/merchants/index.tsx',
            children: void 0,
            preloads: ['/assets/index-Mm-D9E6O.js', '/assets/index-CxJizuOO.js'],
        },
        '/_authenticated/vouchers/': {
            filePath: '/Users/admin/Developer/Pet/Den/lead-metrics/src/routes/_authenticated/vouchers/index.tsx',
            children: void 0,
            preloads: ['/assets/index-DPQbE8CJ.js', '/assets/index-CxJizuOO.js'],
        },
        '/_unauthenticated/activate/': {
            filePath: '/Users/admin/Developer/Pet/Den/lead-metrics/src/routes/_unauthenticated/activate/index.tsx',
            children: void 0,
            preloads: [
                '/assets/index-DyMSxq9l.js',
                '/assets/focusFirstError-DXrcz5gg.js',
                '/assets/index-CPILwtgz.js',
                '/assets/getPseudoElementBounds-D7ePV0js.js',
                '/assets/useScrollLock-BrgHxV8m.js',
            ],
        },
        '/_unauthenticated/login/': {
            filePath: '/Users/admin/Developer/Pet/Den/lead-metrics/src/routes/_unauthenticated/login/index.tsx',
            children: void 0,
            preloads: [
                '/assets/index-CaxdFBgf.js',
                '/assets/focusFirstError-DXrcz5gg.js',
                '/assets/index-CPILwtgz.js',
                '/assets/getPseudoElementBounds-D7ePV0js.js',
                '/assets/useScrollLock-BrgHxV8m.js',
            ],
        },
    },
});
export { tsrStartManifest };
