const g = "_top";
class f extends HTMLElement {
	constructor() {
		super(),
			(this._current = this.querySelector('a[aria-current="true"]')),
			(this.minH = parseInt(this.dataset.minH || "2", 10)),
			(this.maxH = parseInt(this.dataset.maxH || "3", 10)),
			(this.onIdle = (e) =>
				(window.requestIdleCallback || ((o) => setTimeout(o, 1)))(e)),
			(this.init = () => {
				const e = [...this.querySelectorAll("a")],
					o = (t) => {
						if (t instanceof HTMLHeadingElement) {
							if (t.id === g) {
								return !0;
							}
							const s = t.tagName[1];
							if (s) {
								const n = parseInt(s, 10);
								if (n >= this.minH && n <= this.maxH) {
									return !0;
								}
							}
						}
						return !1;
					},
					i = (t) => {
						if (!t) {
							return null;
						}
						const s = t;
						for (; t; ) {
							if (o(t)) {
								return t;
							}
							for (t = t.previousElementSibling; t?.lastElementChild; ) {
								t = t.lastElementChild;
							}
							const n = i(t);
							if (n) {
								return n;
							}
						}
						return i(s.parentElement);
					},
					c = (t) => {
						for (const { isIntersecting: s, target: n } of t) {
							if (!s) {
								continue;
							}
							const d = i(n);
							if (!d) {
								continue;
							}
							const l = e.find(
								(m) => m.hash === "#" + encodeURIComponent(d.id),
							);
							if (l) {
								this.current = l;
								break;
							}
						}
					},
					u = document.querySelectorAll(
						"main [id], main [id] ~ *, main .content > *",
					);
				let r;
				const a = () => {
					r ||
						((r = new IntersectionObserver(c, {
							rootMargin: this.getRootMargin(),
						})),
						u.forEach((t) => r.observe(t)));
				};
				a();
				let h;
				window.addEventListener("resize", () => {
					r && (r.disconnect(), (r = void 0)),
						clearTimeout(h),
						(h = setTimeout(() => this.onIdle(a), 200));
				});
			}),
			this.onIdle(() => this.init());
	}
	set current(e) {
		e !== this._current &&
			(this._current && this._current.removeAttribute("aria-current"),
			e.setAttribute("aria-current", "true"),
			(this._current = e));
	}
	getRootMargin() {
		const e =
				document.querySelector("header")?.getBoundingClientRect().height || 0,
			o = this.querySelector("summary")?.getBoundingClientRect().height || 0,
			i = e + o + 32,
			c = i + 53,
			u = document.documentElement.clientHeight;
		return `-${i}px 0% ${c - u}px`;
	}
}
customElements.define("starlight-toc", f);
export { f as S };
