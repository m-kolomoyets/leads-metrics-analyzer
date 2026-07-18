const e = (r, t) => {
    if (!t) return;
    const o = [...document.querySelectorAll(`${r} [aria-invalid="true"]`)];
    let n;
    for (const i of o)
        if (t[i.name]) {
            n = i;
            break;
        }
    n?.focus();
};
export { e as f };
