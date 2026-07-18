import { r as reactExports } from './react.mjs';

const mergeClasses = (...classes) =>
    classes
        .filter((className, index, array) => {
            return Boolean(className) && className.trim() !== '' && array.indexOf(className) === index;
        })
        .join(' ')
        .trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const toCamelCase = (string) =>
    string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => (p2 ? p2.toUpperCase() : p1.toLowerCase()));
const toPascalCase = (string) => {
    const camelCase = toCamelCase(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};
const hasA11yProp = (props) => {
    for (const prop in props) {
        if (prop.startsWith('aria-') || prop === 'role' || prop === 'title') {
            return true;
        }
    }
    return false;
};
const LucideContext = reactExports.createContext({});
const useLucideContext = () => reactExports.useContext(LucideContext);
const Icon = reactExports.forwardRef(
    ({ color, size, strokeWidth, absoluteStrokeWidth, className = '', children, iconNode, ...rest }, ref) => {
        const {
            size: contextSize = 24,
            strokeWidth: contextStrokeWidth = 2,
            absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
            color: contextColor = 'currentColor',
            className: contextClass = '',
        } = useLucideContext() ?? {};
        const calculatedStrokeWidth =
            (absoluteStrokeWidth ?? contextAbsoluteStrokeWidth)
                ? (Number(strokeWidth ?? contextStrokeWidth) * 24) / Number(size ?? contextSize)
                : (strokeWidth ?? contextStrokeWidth);
        return reactExports.createElement(
            'svg',
            {
                ref,
                ...defaultAttributes,
                width: size ?? contextSize ?? defaultAttributes.width,
                height: size ?? contextSize ?? defaultAttributes.height,
                stroke: color ?? contextColor,
                strokeWidth: calculatedStrokeWidth,
                className: mergeClasses('lucide', contextClass, className),
                ...(!children && !hasA11yProp(rest) && { 'aria-hidden': 'true' }),
                ...rest,
            },
            [
                ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
                ...(Array.isArray(children) ? children : [children]),
            ]
        );
    }
);
const createLucideIcon = (iconName, iconNode) => {
    const Component = reactExports.forwardRef(({ className, ...props }, ref) =>
        reactExports.createElement(Icon, {
            ref,
            iconNode,
            className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
            ...props,
        })
    );
    Component.displayName = toPascalCase(iconName);
    return Component;
};
const __iconNode$l = [['path', { d: 'M20 6 9 17l-5-5', key: '1gmf2c' }]];
const Check = createLucideIcon('check', __iconNode$l);
const __iconNode$k = [['path', { d: 'm9 18 6-6-6-6', key: 'mthhwq' }]];
const ChevronRight = createLucideIcon('chevron-right', __iconNode$k);
const __iconNode$j = [
    ['path', { d: 'm7 15 5 5 5-5', key: '1hf1tw' }],
    ['path', { d: 'm7 9 5-5 5 5', key: 'sgt6xg' }],
];
const ChevronsUpDown = createLucideIcon('chevrons-up-down', __iconNode$j);
const __iconNode$i = [['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }]];
const Circle = createLucideIcon('circle', __iconNode$i);
const __iconNode$h = [
    ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2', key: '17jyea' }],
    ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2', key: 'zix9uf' }],
];
const Copy = createLucideIcon('copy', __iconNode$h);
const __iconNode$g = [
    [
        'path',
        {
            d: 'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49',
            key: 'ct8e1f',
        },
    ],
    ['path', { d: 'M14.084 14.158a3 3 0 0 1-4.242-4.242', key: '151rxh' }],
    [
        'path',
        {
            d: 'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143',
            key: '13bj9a',
        },
    ],
    ['path', { d: 'm2 2 20 20', key: '1ooewy' }],
];
const EyeOff = createLucideIcon('eye-off', __iconNode$g);
const __iconNode$f = [
    [
        'path',
        {
            d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
            key: '1nclc0',
        },
    ],
    ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
];
const Eye = createLucideIcon('eye', __iconNode$f);
const __iconNode$e = [
    [
        'path',
        {
            d: 'M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z',
            key: '1oefj6',
        },
    ],
    ['path', { d: 'M14 2v5a1 1 0 0 0 1 1h5', key: 'wfsgrz' }],
    ['circle', { cx: '11.5', cy: '14.5', r: '2.5', key: '1bq0ko' }],
    ['path', { d: 'M13.3 16.3 15 18', key: '2quom7' }],
];
const FileSearch = createLucideIcon('file-search', __iconNode$e);
const __iconNode$d = [
    ['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8', key: '5wwlr5' }],
    [
        'path',
        {
            d: 'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
            key: 'r6nss1',
        },
    ],
];
const House = createLucideIcon('house', __iconNode$d);
const __iconNode$c = [
    ['rect', { width: '7', height: '9', x: '3', y: '3', rx: '1', key: '10lvy0' }],
    ['rect', { width: '7', height: '5', x: '14', y: '3', rx: '1', key: '16une8' }],
    ['rect', { width: '7', height: '9', x: '14', y: '12', rx: '1', key: '1hutg5' }],
    ['rect', { width: '7', height: '5', x: '3', y: '16', rx: '1', key: 'ldoo1y' }],
];
const LayoutDashboard = createLucideIcon('layout-dashboard', __iconNode$c);
const __iconNode$b = [['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56', key: '13zald' }]];
const LoaderCircle = createLucideIcon('loader-circle', __iconNode$b);
const __iconNode$a = [
    ['path', { d: 'm10 17 5-5-5-5', key: '1bsop3' }],
    ['path', { d: 'M15 12H3', key: '6jk70r' }],
    ['path', { d: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4', key: 'u53s6r' }],
];
const LogIn = createLucideIcon('log-in', __iconNode$a);
const __iconNode$9 = [
    ['path', { d: 'm16 17 5-5-5-5', key: '1bji2h' }],
    ['path', { d: 'M21 12H9', key: 'dn1m92' }],
    ['path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', key: '1uf3rs' }],
];
const LogOut = createLucideIcon('log-out', __iconNode$9);
const __iconNode$8 = [
    ['path', { d: 'm15 9-6 6', key: '1uzhvr' }],
    [
        'path',
        {
            d: 'M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z',
            key: '2d38gg',
        },
    ],
    ['path', { d: 'm9 9 6 6', key: 'z0biqf' }],
];
const OctagonX = createLucideIcon('octagon-x', __iconNode$8);
const __iconNode$7 = [
    ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', key: 'afitv7' }],
    ['path', { d: 'M9 3v18', key: 'fh3hqa' }],
];
const PanelLeft = createLucideIcon('panel-left', __iconNode$7);
const __iconNode$6 = [
    ['path', { d: 'M5 12h14', key: '1ays0h' }],
    ['path', { d: 'M12 5v14', key: 's699le' }],
];
const Plus = createLucideIcon('plus', __iconNode$6);
const __iconNode$5 = [
    ['path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', key: '1357e3' }],
    ['path', { d: 'M3 3v5h5', key: '1xhq8a' }],
];
const RotateCcw = createLucideIcon('rotate-ccw', __iconNode$5);
const __iconNode$4 = [
    [
        'path',
        {
            d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
            key: 'oel41y',
        },
    ],
    ['path', { d: 'M6.376 18.91a6 6 0 0 1 11.249.003', key: 'hnjrf2' }],
    ['circle', { cx: '12', cy: '11', r: '4', key: '1gt34v' }],
];
const ShieldUser = createLucideIcon('shield-user', __iconNode$4);
const __iconNode$3 = [
    ['path', { d: 'M16 10a4 4 0 0 1-8 0', key: '1ltviw' }],
    ['path', { d: 'M3.103 6.034h17.794', key: 'awc11p' }],
    [
        'path',
        {
            d: 'M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z',
            key: 'o988cm',
        },
    ],
];
const ShoppingBag = createLucideIcon('shopping-bag', __iconNode$3);
const __iconNode$2 = [
    ['circle', { cx: '12', cy: '12', r: '4', key: '4exip2' }],
    ['path', { d: 'M12 2v2', key: 'tus03m' }],
    ['path', { d: 'M12 20v2', key: '1lh1kg' }],
    ['path', { d: 'm4.93 4.93 1.41 1.41', key: '149t6j' }],
    ['path', { d: 'm17.66 17.66 1.41 1.41', key: 'ptbguv' }],
    ['path', { d: 'M2 12h2', key: '1t8f8n' }],
    ['path', { d: 'M20 12h2', key: '1q8mjw' }],
    ['path', { d: 'm6.34 17.66-1.41 1.41', key: '1m8zz5' }],
    ['path', { d: 'm19.07 4.93-1.41 1.41', key: '1shlcs' }],
];
const Sun = createLucideIcon('sun', __iconNode$2);
const __iconNode$1 = [
    ['path', { d: 'm3.173 8.18 11-5a2 2 0 0 1 2.647.993L18.56 8', key: '15hfpj' }],
    ['path', { d: 'M6 10V8', key: '1y41hn' }],
    ['path', { d: 'M6 14v1', key: 'cao2tf' }],
    ['path', { d: 'M6 19v2', key: '1loha6' }],
    ['rect', { x: '2', y: '8', width: '20', height: '13', rx: '2', key: 'p3bz5l' }],
];
const Tickets = createLucideIcon('tickets', __iconNode$1);
const __iconNode = [
    ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
    ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
];
const X = createLucideIcon('x', __iconNode);
export {
    ChevronsUpDown as C,
    EyeOff as E,
    FileSearch as F,
    House as H,
    LoaderCircle as L,
    OctagonX as O,
    PanelLeft as P,
    RotateCcw as R,
    ShoppingBag as S,
    Tickets as T,
    X,
    LayoutDashboard as a,
    ShieldUser as b,
    Sun as c,
    LogOut as d,
    ChevronRight as e,
    Circle as f,
    LogIn as g,
    Check as h,
    Plus as i,
    Copy as j,
    Eye as k,
};
