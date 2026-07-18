import { S as Separator$1 } from '../_libs/base-ui__react.mjs';
import { j as jsxRuntimeExports } from '../_libs/react.mjs';
import { n as SidebarTrigger } from './index-B7V87wvP.mjs';
import { c as cn } from './router-BqEFGHsP.mjs';

function Separator({ className, orientation = 'horizontal', ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Separator$1, {
        'data-slot': 'separator',
        orientation,
        className: cn(
            'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
            className
        ),
        ...props,
    });
}
function MainLayoutHeader({ children, className, ...rest }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('header', {
        className: cn('flex items-center gap-2 p-6 -mx-6 -mt-6', className),
        ...rest,
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                className: 'flex shrink-0 items-center gap-2',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarTrigger, {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: 'vertical', className: 'mr-2' }),
                ],
            }),
            children,
        ],
    });
}
export { MainLayoutHeader as M, Separator as S };
