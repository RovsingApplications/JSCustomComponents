
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next, lookup.has(block.key));
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    let SvelteElement;
    if (typeof HTMLElement === 'function') {
        SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
                const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
                callbacks.push(callback);
                return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1)
                        callbacks.splice(index, 1);
                };
            }
            $set() {
                // overridden by instance, if it has props
            }
        };
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.20.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }

    /* src\Sort.svelte generated by Svelte v3.20.1 */
    const file = "src\\Sort.svelte";

    // (57:2) {:else}
    function create_else_block(ctx) {
    	let span;
    	let raw_value = /*labels*/ ctx[1].unsorted.html + "";
    	let span_title_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "title", span_title_value = /*labels*/ ctx[1].unsorted.title);
    			add_location(span, file, 57, 4, 1228);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 2 && raw_value !== (raw_value = /*labels*/ ctx[1].unsorted.html + "")) span.innerHTML = raw_value;
    			if (dirty & /*labels*/ 2 && span_title_value !== (span_title_value = /*labels*/ ctx[1].unsorted.title)) {
    				attr_dev(span, "title", span_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(57:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (53:27) 
    function create_if_block_1(ctx) {
    	let span;
    	let raw_value = /*labels*/ ctx[1].asc.html + "";
    	let span_title_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "title", span_title_value = /*labels*/ ctx[1].desc.title);
    			add_location(span, file, 53, 4, 1135);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 2 && raw_value !== (raw_value = /*labels*/ ctx[1].asc.html + "")) span.innerHTML = raw_value;
    			if (dirty & /*labels*/ 2 && span_title_value !== (span_title_value = /*labels*/ ctx[1].desc.title)) {
    				attr_dev(span, "title", span_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(53:27) ",
    		ctx
    	});

    	return block;
    }

    // (49:2) {#if dir === 'asc'}
    function create_if_block(ctx) {
    	let span;
    	let raw_value = /*labels*/ ctx[1].asc.html + "";
    	let span_title_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "title", span_title_value = /*labels*/ ctx[1].asc.title);
    			add_location(span, file, 49, 4, 1025);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 2 && raw_value !== (raw_value = /*labels*/ ctx[1].asc.html + "")) span.innerHTML = raw_value;
    			if (dirty & /*labels*/ 2 && span_title_value !== (span_title_value = /*labels*/ ctx[1].asc.title)) {
    				attr_dev(span, "title", span_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(49:2) {#if dir === 'asc'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let span;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*dir*/ ctx[0] === "asc") return create_if_block;
    		if (/*dir*/ ctx[0] === "desc") return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if_block.c();
    			this.c = noop;
    			attr_dev(span, "class", "sort");
    			add_location(span, file, 47, 0, 958);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, span, anchor);
    			if_block.m(span, null);
    			if (remount) dispose();
    			dispose = listen_dev(span, "click", /*onClick*/ ctx[2], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if_block.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let globalLabels;

    function setLabels(labels) {
    	globalLabels = labels;
    }

    function instance($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { dir = "none" } = $$props;
    	let { key } = $$props;

    	let { labels = {
    		asc: { title: "Ascending", html: "&#8593;" },
    		desc: { title: "Desceding", html: "&#8595;" },
    		unsorted: { title: "Unsorted", html: "&#8645;" },
    		...globalLabels
    	} } = $$props;

    	function onClick(e) {
    		const detail = { originalEvent: e, key, dir: "asc" };

    		if (dir !== "desc") {
    			detail.dir = "desc";
    		}

    		dispatch("sort", detail);

    		if (detail.returnValue !== false) {
    			$$invalidate(0, dir = detail.dir);
    		}
    	}

    	const writable_props = ["dir", "key", "labels"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<sort-component> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("sort-component", $$slots, []);

    	$$self.$set = $$props => {
    		if ("dir" in $$props) $$invalidate(0, dir = $$props.dir);
    		if ("key" in $$props) $$invalidate(3, key = $$props.key);
    		if ("labels" in $$props) $$invalidate(1, labels = $$props.labels);
    	};

    	$$self.$capture_state = () => ({
    		globalLabels,
    		setLabels,
    		createEventDispatcher,
    		dispatch,
    		dir,
    		key,
    		labels,
    		onClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("dir" in $$props) $$invalidate(0, dir = $$props.dir);
    		if ("key" in $$props) $$invalidate(3, key = $$props.key);
    		if ("labels" in $$props) $$invalidate(1, labels = $$props.labels);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dir, labels, onClick, key];
    }

    class Sort extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>.sort{right:0;cursor:pointer;position:absolute;padding:0 0.25em;color:#999}</style>`;
    		init(this, { target: this.shadowRoot }, instance, create_fragment, safe_not_equal, { dir: 0, key: 3, labels: 1 });
    		const { ctx } = this.$$;
    		const props = this.attributes;

    		if (/*key*/ ctx[3] === undefined && !("key" in props)) {
    			console.warn("<sort-component> was created without expected prop 'key'");
    		}

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["dir", "key", "labels"];
    	}

    	get dir() {
    		return this.$$.ctx[0];
    	}

    	set dir(dir) {
    		this.$set({ dir });
    		flush();
    	}

    	get key() {
    		return this.$$.ctx[3];
    	}

    	set key(key) {
    		this.$set({ key });
    		flush();
    	}

    	get labels() {
    		return this.$$.ctx[1];
    	}

    	set labels(labels) {
    		this.$set({ labels });
    		flush();
    	}
    }

    customElements.define("sort-component", Sort);

    /* src\Row.svelte generated by Svelte v3.20.1 */
    const file$1 = "src\\Row.svelte";

    function create_fragment$1(ctx) {
    	let tr;
    	let slot;
    	let tr_class_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			slot = element("slot");
    			this.c = noop;
    			add_location(slot, file$1, 23, 2, 436);
    			attr_dev(tr, "class", tr_class_value = /*$$props*/ ctx[2].class);
    			toggle_class(tr, "odd", /*index*/ ctx[0] % 2 !== 0);
    			toggle_class(tr, "even", /*index*/ ctx[0] % 2 === 0);
    			add_location(tr, file$1, 18, 0, 318);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, slot);
    			if (remount) dispose();
    			dispose = listen_dev(tr, "click", /*onClick*/ ctx[1], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 4 && tr_class_value !== (tr_class_value = /*$$props*/ ctx[2].class)) {
    				attr_dev(tr, "class", tr_class_value);
    			}

    			if (dirty & /*$$props, index*/ 5) {
    				toggle_class(tr, "odd", /*index*/ ctx[0] % 2 !== 0);
    			}

    			if (dirty & /*$$props, index*/ 5) {
    				toggle_class(tr, "even", /*index*/ ctx[0] % 2 === 0);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { index = 0 } = $$props;

    	function onClick(event) {
    		dispatch("click", event);
    	}

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("row-component", $$slots, []);

    	$$self.$set = $$new_props => {
    		$$invalidate(2, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("index" in $$new_props) $$invalidate(0, index = $$new_props.index);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		index,
    		onClick
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(2, $$props = assign(assign({}, $$props), $$new_props));
    		if ("index" in $$props) $$invalidate(0, index = $$new_props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [index, onClick, $$props];
    }

    class Row extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>.odd{background-color:#eee}</style>`;
    		init(this, { target: this.shadowRoot }, instance$1, create_fragment$1, safe_not_equal, { index: 0 });

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["index"];
    	}

    	get index() {
    		return this.$$.ctx[0];
    	}

    	set index(index) {
    		this.$set({ index });
    		flush();
    	}
    }

    customElements.define("row-component", Row);

    /* src\Pagination.svelte generated by Svelte v3.20.1 */

    const file$2 = "src\\Pagination.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (75:4) {#if page + pageButton >= 0 && page + pageButton <= pageCount}
    function create_if_block$1(ctx) {
    	let li;
    	let button;
    	let t_value = /*page*/ ctx[0] + /*pageButton*/ ctx[8] + 1 + "";
    	let t;
    	let button_data_page_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "data-page", button_data_page_value = /*page*/ ctx[0] + /*pageButton*/ ctx[8]);
    			toggle_class(button, "active", /*page*/ ctx[0] === /*page*/ ctx[0] + /*pageButton*/ ctx[8]);
    			add_location(button, file$2, 76, 8, 1485);
    			add_location(li, file$2, 75, 6, 1471);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, t);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*onChange*/ ctx[4], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*page, pageButtons*/ 3 && t_value !== (t_value = /*page*/ ctx[0] + /*pageButton*/ ctx[8] + 1 + "")) set_data_dev(t, t_value);

    			if (dirty & /*page, pageButtons*/ 3 && button_data_page_value !== (button_data_page_value = /*page*/ ctx[0] + /*pageButton*/ ctx[8])) {
    				attr_dev(button, "data-page", button_data_page_value);
    			}

    			if (dirty & /*page, pageButtons*/ 3) {
    				toggle_class(button, "active", /*page*/ ctx[0] === /*page*/ ctx[0] + /*pageButton*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(75:4) {#if page + pageButton >= 0 && page + pageButton <= pageCount}",
    		ctx
    	});

    	return block;
    }

    // (74:2) {#each pageButtons as pageButton}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*page*/ ctx[0] + /*pageButton*/ ctx[8] >= 0 && /*page*/ ctx[0] + /*pageButton*/ ctx[8] <= /*pageCount*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*page*/ ctx[0] + /*pageButton*/ ctx[8] >= 0 && /*page*/ ctx[0] + /*pageButton*/ ctx[8] <= /*pageCount*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(74:2) {#each pageButtons as pageButton}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let ul;
    	let li0;
    	let button0;
    	let t0_value = /*labels*/ ctx[2].first + "";
    	let t0;
    	let button0_data_page_value;
    	let button0_disabled_value;
    	let t1;
    	let li1;
    	let button1;
    	let t2_value = /*labels*/ ctx[2].previous + "";
    	let t2;
    	let button1_data_page_value;
    	let button1_disabled_value;
    	let t3;
    	let t4;
    	let li2;
    	let button2;
    	let t5_value = /*labels*/ ctx[2].next + "";
    	let t5;
    	let button2_data_page_value;
    	let button2_disabled_value;
    	let t6;
    	let li3;
    	let button3;
    	let t7_value = /*labels*/ ctx[2].last + "";
    	let t7;
    	let button3_disabled_value;
    	let dispose;
    	let each_value = /*pageButtons*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			button0 = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			button1 = element("button");
    			t2 = text(t2_value);
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			li2 = element("li");
    			button2 = element("button");
    			t5 = text(t5_value);
    			t6 = space();
    			li3 = element("li");
    			button3 = element("button");
    			t7 = text(t7_value);
    			this.c = noop;
    			attr_dev(button0, "data-page", button0_data_page_value = 0);
    			button0.disabled = button0_disabled_value = /*page*/ ctx[0] === 0;
    			add_location(button0, file$2, 64, 4, 1114);
    			add_location(li0, file$2, 63, 2, 1104);
    			attr_dev(button1, "data-page", button1_data_page_value = /*page*/ ctx[0] - 1);
    			button1.disabled = button1_disabled_value = /*page*/ ctx[0] === 0;
    			add_location(button1, file$2, 69, 4, 1238);
    			add_location(li1, file$2, 68, 2, 1228);
    			attr_dev(button2, "data-page", button2_data_page_value = /*page*/ ctx[0] + 1);
    			button2.disabled = button2_disabled_value = /*page*/ ctx[0] > /*pageCount*/ ctx[3] - 1;
    			add_location(button2, file$2, 86, 4, 1716);
    			add_location(li2, file$2, 85, 2, 1706);
    			attr_dev(button3, "data-page", /*pageCount*/ ctx[3]);
    			button3.disabled = button3_disabled_value = /*page*/ ctx[0] >= /*pageCount*/ ctx[3];
    			add_location(button3, file$2, 91, 4, 1856);
    			add_location(li3, file$2, 90, 2, 1846);
    			add_location(ul, file$2, 62, 0, 1096);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, button0);
    			append_dev(button0, t0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, button1);
    			append_dev(button1, t2);
    			append_dev(ul, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(li2, button2);
    			append_dev(button2, t5);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    			append_dev(li3, button3);
    			append_dev(button3, t7);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*onChange*/ ctx[4], false, false, false),
    				listen_dev(button1, "click", /*onChange*/ ctx[4], false, false, false),
    				listen_dev(button2, "click", /*onChange*/ ctx[4], false, false, false),
    				listen_dev(button3, "click", /*onChange*/ ctx[4], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*labels*/ 4 && t0_value !== (t0_value = /*labels*/ ctx[2].first + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*page*/ 1 && button0_disabled_value !== (button0_disabled_value = /*page*/ ctx[0] === 0)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*labels*/ 4 && t2_value !== (t2_value = /*labels*/ ctx[2].previous + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*page*/ 1 && button1_data_page_value !== (button1_data_page_value = /*page*/ ctx[0] - 1)) {
    				attr_dev(button1, "data-page", button1_data_page_value);
    			}

    			if (dirty & /*page*/ 1 && button1_disabled_value !== (button1_disabled_value = /*page*/ ctx[0] === 0)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty & /*page, pageButtons, onChange, pageCount*/ 27) {
    				each_value = /*pageButtons*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t4);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*labels*/ 4 && t5_value !== (t5_value = /*labels*/ ctx[2].next + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*page*/ 1 && button2_data_page_value !== (button2_data_page_value = /*page*/ ctx[0] + 1)) {
    				attr_dev(button2, "data-page", button2_data_page_value);
    			}

    			if (dirty & /*page, pageCount*/ 9 && button2_disabled_value !== (button2_disabled_value = /*page*/ ctx[0] > /*pageCount*/ ctx[3] - 1)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty & /*labels*/ 4 && t7_value !== (t7_value = /*labels*/ ctx[2].last + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*pageCount*/ 8) {
    				attr_dev(button3, "data-page", /*pageCount*/ ctx[3]);
    			}

    			if (dirty & /*page, pageCount*/ 9 && button3_disabled_value !== (button3_disabled_value = /*page*/ ctx[0] >= /*pageCount*/ ctx[3])) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let globalLabels$1;

    function setLabels$1(labels) {
    	globalLabels$1 = labels;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { elementreference } = $$props;
    	let { page } = $$props;
    	let { count } = $$props;
    	let { pagesize } = $$props;
    	let { pageButtons = [-2, -1, 0, 1, 2] } = $$props;

    	let { labels = {
    		first: "First",
    		last: "Last",
    		next: "Next",
    		previous: "Previous",
    		...globalLabels$1
    	} } = $$props;

    	const onChange = event => {
    		let pageIndex = parseInt(event.target.dataset.page);

    		elementreference.dispatchEvent(new CustomEvent("change",
    		{
    				bubbles: true,
    				cancelable: true,
    				detail: { page: pageIndex }
    			}));
    	};

    	const writable_props = ["elementreference", "page", "count", "pagesize", "pageButtons", "labels"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<pagination-component> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("pagination-component", $$slots, []);

    	$$self.$set = $$props => {
    		if ("elementreference" in $$props) $$invalidate(5, elementreference = $$props.elementreference);
    		if ("page" in $$props) $$invalidate(0, page = $$props.page);
    		if ("count" in $$props) $$invalidate(6, count = $$props.count);
    		if ("pagesize" in $$props) $$invalidate(7, pagesize = $$props.pagesize);
    		if ("pageButtons" in $$props) $$invalidate(1, pageButtons = $$props.pageButtons);
    		if ("labels" in $$props) $$invalidate(2, labels = $$props.labels);
    	};

    	$$self.$capture_state = () => ({
    		globalLabels: globalLabels$1,
    		setLabels: setLabels$1,
    		elementreference,
    		page,
    		count,
    		pagesize,
    		pageButtons,
    		labels,
    		onChange,
    		pageCount
    	});

    	$$self.$inject_state = $$props => {
    		if ("elementreference" in $$props) $$invalidate(5, elementreference = $$props.elementreference);
    		if ("page" in $$props) $$invalidate(0, page = $$props.page);
    		if ("count" in $$props) $$invalidate(6, count = $$props.count);
    		if ("pagesize" in $$props) $$invalidate(7, pagesize = $$props.pagesize);
    		if ("pageButtons" in $$props) $$invalidate(1, pageButtons = $$props.pageButtons);
    		if ("labels" in $$props) $$invalidate(2, labels = $$props.labels);
    		if ("pageCount" in $$props) $$invalidate(3, pageCount = $$props.pageCount);
    	};

    	let pageCount;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*count, pagesize*/ 192) {
    			 $$invalidate(3, pageCount = Math.floor(count / pagesize));
    		}
    	};

    	return [
    		page,
    		pageButtons,
    		labels,
    		pageCount,
    		onChange,
    		elementreference,
    		count,
    		pagesize
    	];
    }

    class Pagination extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>.active{background-color:rgb(64, 105, 130);color:white}ul{flex:1;float:right;list-style:none}li{float:left}button{padding:5px 10px;margin-left:3px;float:left;cursor:pointer}</style>`;

    		init(this, { target: this.shadowRoot }, instance$2, create_fragment$2, safe_not_equal, {
    			elementreference: 5,
    			page: 0,
    			count: 6,
    			pagesize: 7,
    			pageButtons: 1,
    			labels: 2
    		});

    		const { ctx } = this.$$;
    		const props = this.attributes;

    		if (/*elementreference*/ ctx[5] === undefined && !("elementreference" in props)) {
    			console.warn("<pagination-component> was created without expected prop 'elementreference'");
    		}

    		if (/*page*/ ctx[0] === undefined && !("page" in props)) {
    			console.warn("<pagination-component> was created without expected prop 'page'");
    		}

    		if (/*count*/ ctx[6] === undefined && !("count" in props)) {
    			console.warn("<pagination-component> was created without expected prop 'count'");
    		}

    		if (/*pagesize*/ ctx[7] === undefined && !("pagesize" in props)) {
    			console.warn("<pagination-component> was created without expected prop 'pagesize'");
    		}

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["elementreference", "page", "count", "pagesize", "pageButtons", "labels"];
    	}

    	get elementreference() {
    		return this.$$.ctx[5];
    	}

    	set elementreference(elementreference) {
    		this.$set({ elementreference });
    		flush();
    	}

    	get page() {
    		return this.$$.ctx[0];
    	}

    	set page(page) {
    		this.$set({ page });
    		flush();
    	}

    	get count() {
    		return this.$$.ctx[6];
    	}

    	set count(count) {
    		this.$set({ count });
    		flush();
    	}

    	get pagesize() {
    		return this.$$.ctx[7];
    	}

    	set pagesize(pagesize) {
    		this.$set({ pagesize });
    		flush();
    	}

    	get pageButtons() {
    		return this.$$.ctx[1];
    	}

    	set pageButtons(pageButtons) {
    		this.$set({ pageButtons });
    		flush();
    	}

    	get labels() {
    		return this.$$.ctx[2];
    	}

    	set labels(labels) {
    		this.$set({ labels });
    		flush();
    	}
    }

    customElements.define("pagination-component", Pagination);

    /* src\Table.svelte generated by Svelte v3.20.1 */
    const file$3 = "src\\Table.svelte";

    // (84:4) {:else}
    function create_else_block$1(ctx) {
    	let slot;

    	const block = {
    		c: function create() {
    			slot = element("slot");
    			attr_dev(slot, "visiblerows", /*visibleRows*/ ctx[5]);
    			add_location(slot, file$3, 84, 6, 1691);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, slot, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*visibleRows*/ 32) {
    				attr_dev(slot, "visiblerows", /*visibleRows*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(slot);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(84:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (78:39) 
    function create_if_block_1$1(ctx) {
    	let tr;
    	let td;
    	let span;
    	let t_value = /*labels*/ ctx[3].empty + "";
    	let t;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$3, 80, 10, 1615);
    			attr_dev(td, "class", "center");
    			attr_dev(td, "colspan", "100%");
    			add_location(td, file$3, 79, 8, 1569);
    			add_location(tr, file$3, 78, 6, 1555);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 8 && t_value !== (t_value = /*labels*/ ctx[3].empty + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(78:39) ",
    		ctx
    	});

    	return block;
    }

    // (72:4) {#if loading}
    function create_if_block$2(ctx) {
    	let tr;
    	let td;
    	let span;
    	let t_value = /*labels*/ ctx[3].loading + "";
    	let t;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$3, 74, 10, 1449);
    			attr_dev(td, "class", "center");
    			attr_dev(td, "colspan", "100%");
    			add_location(td, file$3, 73, 8, 1403);
    			add_location(tr, file$3, 72, 6, 1389);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 8 && t_value !== (t_value = /*labels*/ ctx[3].loading + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(72:4) {#if loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div0;
    	let table;
    	let slot0;
    	let t0;
    	let t1;
    	let slot1;
    	let table_class_value;
    	let t2;
    	let div1;
    	let slot2;
    	let pagination_component;
    	let pagination_component_count_value;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return create_if_block$2;
    		if (/*visibleRows*/ ctx[5].length === 0) return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			table = element("table");
    			slot0 = element("slot");
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			slot1 = element("slot");
    			t2 = space();
    			div1 = element("div");
    			slot2 = element("slot");
    			pagination_component = element("pagination-component");
    			this.c = noop;
    			attr_dev(slot0, "name", "head");
    			add_location(slot0, file$3, 70, 4, 1342);
    			attr_dev(slot1, "name", "foot");
    			add_location(slot1, file$3, 86, 4, 1742);
    			attr_dev(table, "class", table_class_value = "table " + /*$$props*/ ctx[7].class);
    			add_location(table, file$3, 69, 2, 1296);
    			add_location(div0, file$3, 68, 0, 1287);
    			set_custom_element_data(pagination_component, "page", /*page*/ ctx[0]);
    			set_custom_element_data(pagination_component, "pagesize", /*pagesize*/ ctx[2]);
    			set_custom_element_data(pagination_component, "count", pagination_component_count_value = /*filteredRows*/ ctx[4].length - 1);
    			add_location(pagination_component, file$3, 92, 4, 1821);
    			attr_dev(slot2, "name", "bottom");
    			add_location(slot2, file$3, 91, 2, 1795);
    			add_location(div1, file$3, 90, 0, 1786);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, table);
    			append_dev(table, slot0);
    			append_dev(table, t0);
    			if_block.m(table, null);
    			append_dev(table, t1);
    			append_dev(table, slot1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, slot2);
    			append_dev(slot2, pagination_component);
    			if (remount) dispose();
    			dispose = listen_dev(pagination_component, "change", /*onPageChange*/ ctx[6], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(table, t1);
    				}
    			}

    			if (dirty & /*$$props*/ 128 && table_class_value !== (table_class_value = "table " + /*$$props*/ ctx[7].class)) {
    				attr_dev(table, "class", table_class_value);
    			}

    			if (dirty & /*page*/ 1) {
    				set_custom_element_data(pagination_component, "page", /*page*/ ctx[0]);
    			}

    			if (dirty & /*pagesize*/ 4) {
    				set_custom_element_data(pagination_component, "pagesize", /*pagesize*/ ctx[2]);
    			}

    			if (dirty & /*filteredRows*/ 16 && pagination_component_count_value !== (pagination_component_count_value = /*filteredRows*/ ctx[4].length - 1)) {
    				set_custom_element_data(pagination_component, "count", pagination_component_count_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_block.d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let globalLabels$2;

    function setLabels$2(labels) {
    	globalLabels$2 = labels;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { loading = false } = $$props;
    	let { page = 0 } = $$props;
    	let { pagesize = 10 } = $$props;
    	let { allrows } = $$props;

    	let { labels = {
    		empty: "No records available",
    		loading: "Loading data",
    		...globalLabels$2
    	} } = $$props;

    	let filteredRows;
    	let visibleRows;
    	let pageCount = 0;
    	let buttons = [-2, -1, 0, 1, 2];

    	function onPageChange(event) {
    		$$invalidate(0, page = event.detail);
    	}

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("table-component", $$slots, []);

    	$$self.$set = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("loading" in $$new_props) $$invalidate(1, loading = $$new_props.loading);
    		if ("page" in $$new_props) $$invalidate(0, page = $$new_props.page);
    		if ("pagesize" in $$new_props) $$invalidate(2, pagesize = $$new_props.pagesize);
    		if ("allrows" in $$new_props) $$invalidate(8, allrows = $$new_props.allrows);
    		if ("labels" in $$new_props) $$invalidate(3, labels = $$new_props.labels);
    	};

    	$$self.$capture_state = () => ({
    		Pagination,
    		Row,
    		Sort,
    		globalLabels: globalLabels$2,
    		setLabels: setLabels$2,
    		loading,
    		page,
    		pagesize,
    		allrows,
    		labels,
    		filteredRows,
    		visibleRows,
    		pageCount,
    		buttons,
    		onPageChange,
    		currentFirstItemIndex
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), $$new_props));
    		if ("loading" in $$props) $$invalidate(1, loading = $$new_props.loading);
    		if ("page" in $$props) $$invalidate(0, page = $$new_props.page);
    		if ("pagesize" in $$props) $$invalidate(2, pagesize = $$new_props.pagesize);
    		if ("allrows" in $$props) $$invalidate(8, allrows = $$new_props.allrows);
    		if ("labels" in $$props) $$invalidate(3, labels = $$new_props.labels);
    		if ("filteredRows" in $$props) $$invalidate(4, filteredRows = $$new_props.filteredRows);
    		if ("visibleRows" in $$props) $$invalidate(5, visibleRows = $$new_props.visibleRows);
    		if ("pageCount" in $$props) pageCount = $$new_props.pageCount;
    		if ("buttons" in $$props) buttons = $$new_props.buttons;
    		if ("currentFirstItemIndex" in $$props) $$invalidate(9, currentFirstItemIndex = $$new_props.currentFirstItemIndex);
    	};

    	let currentFirstItemIndex;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*allrows*/ 256) {
    			 $$invalidate(4, filteredRows = allrows);
    		}

    		if ($$self.$$.dirty & /*page, pagesize*/ 5) {
    			 $$invalidate(9, currentFirstItemIndex = page * pagesize);
    		}

    		if ($$self.$$.dirty & /*filteredRows, currentFirstItemIndex, pagesize*/ 532) {
    			 $$invalidate(5, visibleRows = filteredRows.slice(currentFirstItemIndex, currentFirstItemIndex + pagesize));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		page,
    		loading,
    		pagesize,
    		labels,
    		filteredRows,
    		visibleRows,
    		onPageChange,
    		$$props,
    		allrows
    	];
    }

    class Table extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>.table{width:100%;border-collapse:collapse}.table :global(th, td){position:relative}.center{text-align:center;font-style:italic}.center>span{padding:10px 10px;float:left;width:100%}td{width:20%}</style>`;

    		init(this, { target: this.shadowRoot }, instance$3, create_fragment$3, safe_not_equal, {
    			loading: 1,
    			page: 0,
    			pagesize: 2,
    			allrows: 8,
    			labels: 3
    		});

    		const { ctx } = this.$$;
    		const props = this.attributes;

    		if (/*allrows*/ ctx[8] === undefined && !("allrows" in props)) {
    			console.warn("<table-component> was created without expected prop 'allrows'");
    		}

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["loading", "page", "pagesize", "allrows", "labels"];
    	}

    	get loading() {
    		return this.$$.ctx[1];
    	}

    	set loading(loading) {
    		this.$set({ loading });
    		flush();
    	}

    	get page() {
    		return this.$$.ctx[0];
    	}

    	set page(page) {
    		this.$set({ page });
    		flush();
    	}

    	get pagesize() {
    		return this.$$.ctx[2];
    	}

    	set pagesize(pagesize) {
    		this.$set({ pagesize });
    		flush();
    	}

    	get allrows() {
    		return this.$$.ctx[8];
    	}

    	set allrows(allrows) {
    		this.$set({ allrows });
    		flush();
    	}

    	get labels() {
    		return this.$$.ctx[3];
    	}

    	set labels(labels) {
    		this.$set({ labels });
    		flush();
    	}
    }

    customElements.define("table-component", Table);

    function sortString(rows, dir, key) {
      return [...rows].sort((a, b) =>
        dir === "asc"
          ? ("" + a[key]).localeCompare(b[key])
          : ("" + b[key]).localeCompare(a[key])
      );
    }

    function sortNumber(rows, dir, key) {
      return [...rows].sort((a, b) =>
        dir === "asc" ? a[key] - b[key] : b[key] - a[key]
      );
    }

    let data = [];

    async function getAll(url, key) {
      return new Promise(async (resolve, reject) => {
        let headers = new Headers();
        headers.set("Authorization", "apiKey " + key);

        await fetch(url + "/getall", {
          method: "GET",
          headers: headers
        })
          .then(r => r.json())
          .then(jsonData => {
            data = jsonData;
            resolve(data);
    			})
    			.catch(error => {
    				reject(error);
    				console.log(error);
    			});
      });
    }

    async function cancel(id, url, key) {
      let headers = new Headers();
      headers.set("Authorization", "apiKey " + key);

      await fetch(url + "/CancelOnBoarding/?OnBoardingId=" + id, {
        method: "PUT",
        headers: headers
      })
        .then(r => r.text())
        .then(jsonData => {});
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src\Confirm\Confirm.svelte generated by Svelte v3.20.1 */
    const file$4 = "src\\Confirm\\Confirm.svelte";

    // (117:0) {#if showDialog}
    function create_if_block$3(ctx) {
    	let div0;
    	let div0_intro;
    	let div0_outro;
    	let t0;
    	let div3;
    	let div1;
    	let span0;
    	let slot0;
    	let t2;
    	let span1;
    	let slot1;
    	let t4;
    	let div2;
    	let button0;
    	let slot2;
    	let t5;
    	let t6;
    	let button1;
    	let slot3;
    	let t7;
    	let div3_intro;
    	let div3_outro;
    	let current;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			slot0 = element("slot");
    			slot0.textContent = "Are you sure you want to perform this action?";
    			t2 = space();
    			span1 = element("span");
    			slot1 = element("slot");
    			slot1.textContent = "This action can't be undone!";
    			t4 = space();
    			div2 = element("div");
    			button0 = element("button");
    			slot2 = element("slot");
    			t5 = text(/*canceltitle*/ ctx[2]);
    			t6 = space();
    			button1 = element("button");
    			slot3 = element("slot");
    			t7 = text(/*confirmtitle*/ ctx[1]);
    			attr_dev(div0, "class", "overlay");
    			add_location(div0, file$4, 117, 2, 2468);
    			attr_dev(slot0, "name", "title");
    			add_location(slot0, file$4, 127, 8, 2786);
    			attr_dev(span0, "class", "message-title");
    			add_location(span0, file$4, 126, 6, 2748);
    			attr_dev(slot1, "name", "description");
    			add_location(slot1, file$4, 130, 8, 2924);
    			attr_dev(span1, "class", "message-description");
    			add_location(span1, file$4, 129, 6, 2880);
    			attr_dev(div1, "class", "message-section");
    			add_location(div1, file$4, 125, 4, 2711);
    			attr_dev(slot2, "name", "cancel");
    			add_location(slot2, file$4, 139, 8, 3322);
    			attr_dev(button0, "class", "cancel-button");
    			set_style(button0, "--cancel-btn-color", "hsl(" + /*themecolor*/ ctx[0] + ", 40%, 50%)");
    			set_style(button0, "--cancel-btn-color-hover", "hsl(" + /*themecolor*/ ctx[0] + ", 40%, 55%)");
    			add_location(button0, file$4, 134, 6, 3094);
    			attr_dev(slot3, "name", "confirm");
    			add_location(slot3, file$4, 146, 8, 3593);
    			attr_dev(button1, "class", "confirm-button");
    			set_style(button1, "--confirm-btn-bg", "hsl(" + /*themecolor*/ ctx[0] + ", 40%, 50%)");
    			set_style(button1, "--confirm-btn-bg-hover", "hsl(" + /*themecolor*/ ctx[0] + ", 40%, 55%)");
    			add_location(button1, file$4, 141, 6, 3387);
    			attr_dev(div2, "class", "actions");
    			set_style(div2, "background", "hsl(" + /*themecolor*/ ctx[0] + ", 30%, 97%)");
    			add_location(div2, file$4, 133, 4, 3017);
    			attr_dev(div3, "class", "confirm-dialog");
    			add_location(div3, file$4, 121, 2, 2579);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, span0);
    			append_dev(span0, slot0);
    			append_dev(div1, t2);
    			append_dev(div1, span1);
    			append_dev(span1, slot1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(button0, slot2);
    			append_dev(slot2, t5);
    			append_dev(div2, t6);
    			append_dev(div2, button1);
    			append_dev(button1, slot3);
    			append_dev(slot3, t7);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*click_handler_1*/ ctx[7], false, false, false),
    				listen_dev(button1, "click", /*confirm*/ ctx[4], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*canceltitle*/ 4) set_data_dev(t5, /*canceltitle*/ ctx[2]);

    			if (!current || dirty & /*themecolor*/ 1) {
    				set_style(button0, "--cancel-btn-color", "hsl(" + /*themecolor*/ ctx[0] + ", 40%, 50%)");
    			}

    			if (!current || dirty & /*themecolor*/ 1) {
    				set_style(button0, "--cancel-btn-color-hover", "hsl(" + /*themecolor*/ ctx[0] + ", 40%, 55%)");
    			}

    			if (!current || dirty & /*confirmtitle*/ 2) set_data_dev(t7, /*confirmtitle*/ ctx[1]);

    			if (!current || dirty & /*themecolor*/ 1) {
    				set_style(button1, "--confirm-btn-bg", "hsl(" + /*themecolor*/ ctx[0] + ", 40%, 50%)");
    			}

    			if (!current || dirty & /*themecolor*/ 1) {
    				set_style(button1, "--confirm-btn-bg-hover", "hsl(" + /*themecolor*/ ctx[0] + ", 40%, 55%)");
    			}

    			if (!current || dirty & /*themecolor*/ 1) {
    				set_style(div2, "background", "hsl(" + /*themecolor*/ ctx[0] + ", 30%, 97%)");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div0_outro) div0_outro.end(1);
    				if (!div0_intro) div0_intro = create_in_transition(div0, fade, { duration: 200 });
    				div0_intro.start();
    			});

    			add_render_callback(() => {
    				if (div3_outro) div3_outro.end(1);
    				if (!div3_intro) div3_intro = create_in_transition(div3, fly, { y: -10, delay: 200, duration: 200 });
    				div3_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div0_intro) div0_intro.invalidate();
    			div0_outro = create_out_transition(div0, fade, { delay: 200, duration: 200 });
    			if (div3_intro) div3_intro.invalidate();
    			div3_outro = create_out_transition(div3, fly, { y: -10, duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching && div0_outro) div0_outro.end();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			if (detaching && div3_outro) div3_outro.end();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(117:0) {#if showDialog}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let span;
    	let slot;
    	let t;
    	let if_block_anchor;
    	let current;
    	let dispose;
    	let if_block = /*showDialog*/ ctx[3] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			slot = element("slot");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.c = noop;
    			add_location(slot, file$4, 113, 1, 2427);
    			add_location(span, file$4, 112, 0, 2383);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, span, anchor);
    			append_dev(span, slot);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(span, "click", /*click_handler*/ ctx[6], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showDialog*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { elementreference } = $$props;
    	let { themecolor = 200 } = $$props;
    	let { confirmtitle = "Confirm" } = $$props;
    	let { canceltitle = "Cancel" } = $$props;
    	let showDialog = false;

    	function confirm(event) {
    		$$invalidate(3, showDialog = false);

    		elementreference.dispatchEvent(new CustomEvent("confirm",
    		{
    				bubbles: true,
    				cancelable: true,
    				detail: {}
    			}));
    	}

    	const writable_props = ["elementreference", "themecolor", "confirmtitle", "canceltitle"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<confirm-component> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("confirm-component", $$slots, []);
    	const click_handler = () => $$invalidate(3, showDialog = true);
    	const click_handler_1 = () => $$invalidate(3, showDialog = false);

    	$$self.$set = $$props => {
    		if ("elementreference" in $$props) $$invalidate(5, elementreference = $$props.elementreference);
    		if ("themecolor" in $$props) $$invalidate(0, themecolor = $$props.themecolor);
    		if ("confirmtitle" in $$props) $$invalidate(1, confirmtitle = $$props.confirmtitle);
    		if ("canceltitle" in $$props) $$invalidate(2, canceltitle = $$props.canceltitle);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		fade,
    		elementreference,
    		themecolor,
    		confirmtitle,
    		canceltitle,
    		showDialog,
    		confirm
    	});

    	$$self.$inject_state = $$props => {
    		if ("elementreference" in $$props) $$invalidate(5, elementreference = $$props.elementreference);
    		if ("themecolor" in $$props) $$invalidate(0, themecolor = $$props.themecolor);
    		if ("confirmtitle" in $$props) $$invalidate(1, confirmtitle = $$props.confirmtitle);
    		if ("canceltitle" in $$props) $$invalidate(2, canceltitle = $$props.canceltitle);
    		if ("showDialog" in $$props) $$invalidate(3, showDialog = $$props.showDialog);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		themecolor,
    		confirmtitle,
    		canceltitle,
    		showDialog,
    		confirm,
    		elementreference,
    		click_handler,
    		click_handler_1
    	];
    }

    class Confirm extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>.message-title{font-size:22px;font-weight:500;display:block;color:hsl(0, 0%, 20%);line-height:1.2}.message-description{display:block;margin-top:20px;font-size:16px;color:hsl(0, 0%, 30%);line-height:1.4}.actions{display:flex;justify-content:flex-end;margin:25px -40px -30px;padding:15px 20px;border-radius:0 0 3px 3px}.confirm-dialog{font-family:sans-serif;position:fixed;z-index:999;top:50%;left:50%;transform:translate(-50%, -50%);padding:30px 40px;border-radius:3px;background:#fff;max-width:500px;width:500px;box-shadow:0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)}.overlay{top:0;left:0;width:100%;height:100%;position:fixed;user-select:none;z-index:998;background:hsla(0, 0%, 0%, 80%)}.confirm-button{background:hsl(200, 40%, 50%);background:var(--confirm-btn-bg);margin-left:10px;border:none;outline:none;border-radius:2px;padding:10px 15px;cursor:pointer;font-size:16px;color:hsl(0, 0%, 95%);transition:all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)}.confirm-button:hover{background:hsl(200, 40%, 55%);background:var(--confirm-btn-bg-hover)}.cancel-button{border:none;outline:none;background:transparent;padding:5px 10px;cursor:pointer;font-size:16px;color:hsl(200, 40%, 50%);color:var(--cancel-btn-color);transition:all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)}.cancel-button:hover{color:hsl(200, 40%, 55%);color:var(--cancel-btn-color-hover)}</style>`;

    		init(this, { target: this.shadowRoot }, instance$4, create_fragment$4, safe_not_equal, {
    			elementreference: 5,
    			themecolor: 0,
    			confirmtitle: 1,
    			canceltitle: 2
    		});

    		const { ctx } = this.$$;
    		const props = this.attributes;

    		if (/*elementreference*/ ctx[5] === undefined && !("elementreference" in props)) {
    			console.warn("<confirm-component> was created without expected prop 'elementreference'");
    		}

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["elementreference", "themecolor", "confirmtitle", "canceltitle"];
    	}

    	get elementreference() {
    		return this.$$.ctx[5];
    	}

    	set elementreference(elementreference) {
    		this.$set({ elementreference });
    		flush();
    	}

    	get themecolor() {
    		return this.$$.ctx[0];
    	}

    	set themecolor(themecolor) {
    		this.$set({ themecolor });
    		flush();
    	}

    	get confirmtitle() {
    		return this.$$.ctx[1];
    	}

    	set confirmtitle(confirmtitle) {
    		this.$set({ confirmtitle });
    		flush();
    	}

    	get canceltitle() {
    		return this.$$.ctx[2];
    	}

    	set canceltitle(canceltitle) {
    		this.$set({ canceltitle });
    		flush();
    	}
    }

    customElements.define("confirm-component", Confirm);

    // https://github.com/gojutin/svelte-custom-element/blob/master/src/App.svelte
    const timesPath = `M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88
          c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242
          C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879
					s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z`;

    /* src\Icons\times.svelte generated by Svelte v3.20.1 */
    const file$5 = "src\\Icons\\times.svelte";

    function create_fragment$5(ctx) {
    	let svg;
    	let g;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path = svg_element("path");
    			this.c = noop;
    			attr_dev(path, "d", timesPath);
    			add_location(path, file$5, 9, 5, 236);
    			add_location(g, file$5, 9, 2, 233);
    			attr_dev(svg, "height", "8px");
    			attr_dev(svg, "width", "8px");
    			attr_dev(svg, "viewBox", "0 0 47.971 47.971");
    			set_style(svg, "enable-background", "new 0 0 47.971 47.971");
    			add_location(svg, file$5, 7, 0, 118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<icon-times> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("icon-times", $$slots, []);
    	$$self.$capture_state = () => ({ timesPath });
    	return [];
    }

    class Times extends SvelteElement {
    	constructor(options) {
    		super();
    		init(this, { target: this.shadowRoot }, instance$5, create_fragment$5, safe_not_equal, {});

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}
    		}
    	}
    }

    customElements.define("icon-times", Times);

    const Icons = {
    	times: Times,
    };

    /* src\OnboardingTable.svelte generated by Svelte v3.20.1 */
    const file$6 = "src\\OnboardingTable.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    // (122:0) {:else}
    function create_else_block$2(ctx) {
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let t12;
    	let div1;
    	let pagination_component;
    	let pagination_component_count_value;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*rows*/ ctx[2].length === 0) return create_if_block_2;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Company Name";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Contact Name";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Contact Email";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Status";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Created Date";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Actions";
    			t11 = space();
    			if_block.c();
    			t12 = space();
    			div1 = element("div");
    			pagination_component = element("pagination-component");
    			add_location(th0, file$6, 126, 5, 2689);
    			add_location(th1, file$6, 127, 5, 2717);
    			add_location(th2, file$6, 128, 5, 2745);
    			add_location(th3, file$6, 129, 5, 2774);
    			add_location(th4, file$6, 130, 5, 2796);
    			add_location(th5, file$6, 131, 5, 2824);
    			add_location(tr, file$6, 125, 4, 2678);
    			add_location(thead, file$6, 124, 3, 2665);
    			attr_dev(table, "class", "table table-striped");
    			add_location(table, file$6, 123, 2, 2625);
    			add_location(div0, file$6, 122, 1, 2616);
    			set_custom_element_data(pagination_component, "elementreference", /*paginator*/ ctx[4]);
    			set_custom_element_data(pagination_component, "page", /*page*/ ctx[3]);
    			set_custom_element_data(pagination_component, "pagesize", /*pagesize*/ ctx[10]);
    			set_custom_element_data(pagination_component, "count", pagination_component_count_value = /*filteredRows*/ ctx[8].length - 1);
    			add_location(pagination_component, file$6, 180, 2, 4301);
    			add_location(div1, file$6, 179, 1, 4292);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(table, t11);
    			if_block.m(table, null);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, pagination_component);
    			/*pagination_component_binding*/ ctx[19](pagination_component);
    			if (remount) dispose();
    			dispose = listen_dev(pagination_component, "change", /*onPageChange*/ ctx[12], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(table, null);
    				}
    			}

    			if (dirty & /*paginator*/ 16) {
    				set_custom_element_data(pagination_component, "elementreference", /*paginator*/ ctx[4]);
    			}

    			if (dirty & /*page*/ 8) {
    				set_custom_element_data(pagination_component, "page", /*page*/ ctx[3]);
    			}

    			if (dirty & /*filteredRows*/ 256 && pagination_component_count_value !== (pagination_component_count_value = /*filteredRows*/ ctx[8].length - 1)) {
    				set_custom_element_data(pagination_component, "count", pagination_component_count_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_block.d();
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div1);
    			/*pagination_component_binding*/ ctx[19](null);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(122:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (120:23) 
    function create_if_block_1$2(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*fetchError*/ ctx[7]);
    			set_style(p, "color", "red");
    			add_location(p, file$6, 120, 1, 2566);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fetchError*/ 128) set_data_dev(t, /*fetchError*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(120:23) ",
    		ctx
    	});

    	return block;
    }

    // (118:0) {#if loading}
    function create_if_block$4(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Fetching data ...";
    			add_location(span, file$6, 118, 1, 2508);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(118:0) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (141:3) {:else}
    function create_else_block_1(ctx) {
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*visibleRows*/ ctx[9];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*row*/ ctx[20];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tbody, file$6, 141, 4, 3029);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*visibleRows, confirmElementReference, onCancel, apiurl, apikey, Date*/ 2595) {
    				const each_value = /*visibleRows*/ ctx[9];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, tbody, destroy_block, create_each_block$1, null, get_each_context$1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(141:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (135:3) {#if rows.length === 0}
    function create_if_block_2(ctx) {
    	let tr;
    	let td;
    	let span;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			span = element("span");
    			span.textContent = "\"No records available !\"";
    			add_location(span, file$6, 137, 6, 2951);
    			attr_dev(td, "class", "center");
    			attr_dev(td, "colspan", "100%");
    			add_location(td, file$6, 136, 5, 2909);
    			add_location(tr, file$6, 135, 4, 2898);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, span);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(135:3) {#if rows.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (151:49) {:else}
    function create_else_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Processing");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(151:49) {:else}",
    		ctx
    	});

    	return block;
    }

    // (151:41) 
    function create_if_block_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Canceled");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(151:41) ",
    		ctx
    	});

    	return block;
    }

    // (149:8) {#if row.onboarded != null}
    function create_if_block_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Complete");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(149:8) {#if row.onboarded != null}",
    		ctx
    	});

    	return block;
    }

    // (157:8) {#if row.onboarded == null && row.canceledAt == null}
    function create_if_block_3(ctx) {
    	let confirm_component;
    	let span0;
    	let icon_times;
    	let t0;
    	let span1;
    	let t2;
    	let span2;
    	let dispose;

    	function confirm_handler(...args) {
    		return /*confirm_handler*/ ctx[18](/*row*/ ctx[20], ...args);
    	}

    	const block = {
    		c: function create() {
    			confirm_component = element("confirm-component");
    			span0 = element("span");
    			icon_times = element("icon-times");
    			t0 = space();
    			span1 = element("span");
    			span1.textContent = "Cancel confirmation";
    			t2 = space();
    			span2 = element("span");
    			span2.textContent = "are you sure you want to cancel this onboarding?";
    			add_location(icon_times, file$6, 163, 11, 3948);
    			attr_dev(span0, "class", "pointer");
    			add_location(span0, file$6, 162, 10, 3913);
    			attr_dev(span1, "slot", "title");
    			add_location(span1, file$6, 165, 10, 3993);
    			attr_dev(span2, "slot", "description");
    			add_location(span2, file$6, 166, 10, 4050);
    			set_custom_element_data(confirm_component, "elementreference", /*confirmElementReference*/ ctx[5]);
    			add_location(confirm_component, file$6, 157, 9, 3707);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, confirm_component, anchor);
    			append_dev(confirm_component, span0);
    			append_dev(span0, icon_times);
    			append_dev(confirm_component, t0);
    			append_dev(confirm_component, span1);
    			append_dev(confirm_component, t2);
    			append_dev(confirm_component, span2);
    			/*confirm_component_binding*/ ctx[17](confirm_component);
    			if (remount) dispose();
    			dispose = listen_dev(confirm_component, "confirm", confirm_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*confirmElementReference*/ 32) {
    				set_custom_element_data(confirm_component, "elementreference", /*confirmElementReference*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(confirm_component);
    			/*confirm_component_binding*/ ctx[17](null);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(157:8) {#if row.onboarded == null && row.canceledAt == null}",
    		ctx
    	});

    	return block;
    }

    // (143:5) {#each visibleRows as row, index (row)}
    function create_each_block$1(key_1, ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*row*/ ctx[20].senderName + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*row*/ ctx[20].contactName + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*row*/ ctx[20].contactEmail + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6;
    	let td4;
    	let t7_value = new Date(/*row*/ ctx[20].createdAt).toDateString() + "";
    	let t7;
    	let t8;
    	let td5;
    	let t9;

    	function select_block_type_2(ctx, dirty) {
    		if (/*row*/ ctx[20].onboarded != null) return create_if_block_4;
    		if (/*row*/ ctx[20].canceledAt != null) return create_if_block_5;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*row*/ ctx[20].onboarded == null && /*row*/ ctx[20].canceledAt == null && create_if_block_3(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			if_block0.c();
    			t6 = space();
    			td4 = element("td");
    			t7 = text(t7_value);
    			t8 = space();
    			td5 = element("td");
    			if (if_block1) if_block1.c();
    			t9 = space();
    			attr_dev(td0, "data-label", "Company Name");
    			add_location(td0, file$6, 144, 7, 3131);
    			attr_dev(td1, "data-label", "Contat Name");
    			add_location(td1, file$6, 145, 7, 3191);
    			attr_dev(td2, "data-label", "Contact Email");
    			add_location(td2, file$6, 146, 7, 3251);
    			attr_dev(td3, "data-label", "Status");
    			add_location(td3, file$6, 147, 7, 3314);
    			attr_dev(td4, "data-label", "Created Date");
    			add_location(td4, file$6, 152, 7, 3490);
    			attr_dev(td5, "class", "center");
    			attr_dev(td5, "data-label", "Actions");
    			add_location(td5, file$6, 155, 7, 3593);
    			toggle_class(tr, "odd", /*index*/ ctx[22] % 2 !== 0);
    			add_location(tr, file$6, 143, 6, 3090);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			if_block0.m(td3, null);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(td4, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td5);
    			if (if_block1) if_block1.m(td5, null);
    			append_dev(tr, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*visibleRows*/ 512 && t0_value !== (t0_value = /*row*/ ctx[20].senderName + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*visibleRows*/ 512 && t2_value !== (t2_value = /*row*/ ctx[20].contactName + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*visibleRows*/ 512 && t4_value !== (t4_value = /*row*/ ctx[20].contactEmail + "")) set_data_dev(t4, t4_value);

    			if (current_block_type !== (current_block_type = select_block_type_2(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(td3, null);
    				}
    			}

    			if (dirty & /*visibleRows*/ 512 && t7_value !== (t7_value = new Date(/*row*/ ctx[20].createdAt).toDateString() + "")) set_data_dev(t7, t7_value);

    			if (/*row*/ ctx[20].onboarded == null && /*row*/ ctx[20].canceledAt == null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					if_block1.m(td5, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*visibleRows*/ 512) {
    				toggle_class(tr, "odd", /*index*/ ctx[22] % 2 !== 0);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(143:5) {#each visibleRows as row, index (row)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[6]) return create_if_block$4;
    		if (!!/*fetchError*/ ctx[7]) return create_if_block_1$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    			this.c = noop;
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { apiurl } = $$props;
    	let { apikey } = $$props;
    	let rows = [];
    	let page = 0;
    	let pagesize = 8;
    	let paginator;
    	let confirmElementReference;
    	let loading = false;
    	let fetchError = null;

    	function getAllRows(apiurl, apikey) {
    		$$invalidate(6, loading = true);

    		getAll(apiurl, apikey).then(response => {
    			$$invalidate(2, rows = response);
    			$$invalidate(7, fetchError = null);
    		}).catch(error => {
    			$$invalidate(7, fetchError = error);
    		}).finally(() => {
    			$$invalidate(6, loading = false);
    		});
    	}

    	onMount(async () => {
    		getAllRows(apiurl, apikey);
    	});

    	async function onCancel(id, apiurl, apikey) {
    		var result = await cancel(id, apiurl, apikey);
    		getAllRows(apiurl, apikey);
    	}

    	function onSortString({ detail: { dir, key } }) {
    		$$invalidate(2, rows = sortString(rows, dir, key));
    	}

    	function onSortNumber({ detail: { dir, key } }) {
    		$$invalidate(2, rows = sortNumber(rows, dir, key));
    	}

    	const onPageChange = event => {
    		$$invalidate(3, page = event.detail.page);
    	};

    	const writable_props = ["apiurl", "apikey"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<onboarding-table-component> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("onboarding-table-component", $$slots, []);

    	function confirm_component_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(5, confirmElementReference = $$value);
    		});
    	}

    	const confirm_handler = row => onCancel(row.id, apiurl, apikey);

    	function pagination_component_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(4, paginator = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("apiurl" in $$props) $$invalidate(0, apiurl = $$props.apiurl);
    		if ("apikey" in $$props) $$invalidate(1, apikey = $$props.apikey);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Pagination,
    		Row,
    		Sort,
    		getAll,
    		cancel,
    		sortNumber,
    		sortString,
    		slide,
    		Confirm,
    		Icons,
    		apiurl,
    		apikey,
    		rows,
    		page,
    		pagesize,
    		paginator,
    		confirmElementReference,
    		loading,
    		fetchError,
    		getAllRows,
    		onCancel,
    		onSortString,
    		onSortNumber,
    		onPageChange,
    		filteredRows,
    		currentFirstItemIndex,
    		visibleRows
    	});

    	$$self.$inject_state = $$props => {
    		if ("apiurl" in $$props) $$invalidate(0, apiurl = $$props.apiurl);
    		if ("apikey" in $$props) $$invalidate(1, apikey = $$props.apikey);
    		if ("rows" in $$props) $$invalidate(2, rows = $$props.rows);
    		if ("page" in $$props) $$invalidate(3, page = $$props.page);
    		if ("pagesize" in $$props) $$invalidate(10, pagesize = $$props.pagesize);
    		if ("paginator" in $$props) $$invalidate(4, paginator = $$props.paginator);
    		if ("confirmElementReference" in $$props) $$invalidate(5, confirmElementReference = $$props.confirmElementReference);
    		if ("loading" in $$props) $$invalidate(6, loading = $$props.loading);
    		if ("fetchError" in $$props) $$invalidate(7, fetchError = $$props.fetchError);
    		if ("filteredRows" in $$props) $$invalidate(8, filteredRows = $$props.filteredRows);
    		if ("currentFirstItemIndex" in $$props) $$invalidate(13, currentFirstItemIndex = $$props.currentFirstItemIndex);
    		if ("visibleRows" in $$props) $$invalidate(9, visibleRows = $$props.visibleRows);
    	};

    	let filteredRows;
    	let currentFirstItemIndex;
    	let visibleRows;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*rows*/ 4) {
    			 $$invalidate(8, filteredRows = rows);
    		}

    		if ($$self.$$.dirty & /*page*/ 8) {
    			 $$invalidate(13, currentFirstItemIndex = page * pagesize);
    		}

    		if ($$self.$$.dirty & /*filteredRows, currentFirstItemIndex*/ 8448) {
    			 $$invalidate(9, visibleRows = filteredRows.slice(currentFirstItemIndex, currentFirstItemIndex + pagesize));
    		}
    	};

    	return [
    		apiurl,
    		apikey,
    		rows,
    		page,
    		paginator,
    		confirmElementReference,
    		loading,
    		fetchError,
    		filteredRows,
    		visibleRows,
    		pagesize,
    		onCancel,
    		onPageChange,
    		currentFirstItemIndex,
    		getAllRows,
    		onSortString,
    		onSortNumber,
    		confirm_component_binding,
    		confirm_handler,
    		pagination_component_binding
    	];
    }

    class OnboardingTable extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>.center{text-align:center}.odd{background-color:#eee;background-color:rgba(0,0,0,.05)}.table{width:100%;border-collapse:collapse;margin-bottom:1rem;color:#212529}.table :global(th, td){position:relative}.table thead th{border-bottom:2px solid #dee2e6}.table th,.table td{padding:.75rem}.center{text-align:center;font-style:italic}.center>span{padding:10px 10px;float:left;width:100%}td,th{width:20%}.pointer{cursor:pointer}</style>`;
    		init(this, { target: this.shadowRoot }, instance$6, create_fragment$6, safe_not_equal, { apiurl: 0, apikey: 1 });
    		const { ctx } = this.$$;
    		const props = this.attributes;

    		if (/*apiurl*/ ctx[0] === undefined && !("apiurl" in props)) {
    			console.warn("<onboarding-table-component> was created without expected prop 'apiurl'");
    		}

    		if (/*apikey*/ ctx[1] === undefined && !("apikey" in props)) {
    			console.warn("<onboarding-table-component> was created without expected prop 'apikey'");
    		}

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["apiurl", "apikey"];
    	}

    	get apiurl() {
    		return this.$$.ctx[0];
    	}

    	set apiurl(apiurl) {
    		this.$set({ apiurl });
    		flush();
    	}

    	get apikey() {
    		return this.$$.ctx[1];
    	}

    	set apikey(apikey) {
    		this.$set({ apikey });
    		flush();
    	}
    }

    customElements.define("onboarding-table-component", OnboardingTable);

    /* src\App.svelte generated by Svelte v3.20.1 */

    const { console: console_1 } = globals;
    const file$7 = "src\\App.svelte";

    // (49:0) {:else}
    function create_else_block$3(ctx) {
    	let onboarding_table_component;

    	const block = {
    		c: function create() {
    			onboarding_table_component = element("onboarding-table-component");
    			set_custom_element_data(onboarding_table_component, "apiurl", /*apiurl*/ ctx[0]);
    			set_custom_element_data(onboarding_table_component, "apikey", /*apikey*/ ctx[1]);
    			add_location(onboarding_table_component, file$7, 49, 1, 1386);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, onboarding_table_component, anchor);
    			/*onboarding_table_component_binding*/ ctx[6](onboarding_table_component);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*apiurl*/ 1) {
    				set_custom_element_data(onboarding_table_component, "apiurl", /*apiurl*/ ctx[0]);
    			}

    			if (dirty & /*apikey*/ 2) {
    				set_custom_element_data(onboarding_table_component, "apikey", /*apikey*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(onboarding_table_component);
    			/*onboarding_table_component_binding*/ ctx[6](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(49:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:0) {#if !apiurl || !apikey }
    function create_if_block$5(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "invalid parameters";
    			add_location(p, file$7, 47, 1, 1349);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(47:0) {#if !apiurl || !apikey }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (!/*apiurl*/ ctx[0] || !/*apikey*/ ctx[1]) return create_if_block$5;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    			this.c = noop;
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { apiurl } = $$props;
    	let { apikey } = $$props;
    	let { customstyle = "" } = $$props;
    	let onboardingTableElementReference;

    	function addStylingFromAttribute() {
    		if (!customstyle || customstyle.trim() === "") {
    			return;
    		}

    		let customStyleElement = document.createElement("style");
    		customStyleElement.innerHTML = customstyle;
    		onboardingTableElementReference.shadowRoot.appendChild(customStyleElement);
    	}

    	function addStylingFromTag() {
    		let componentElement = onboardingTableElementReference.parentNode.host;

    		if (!componentElement) {
    			return;
    		}

    		let noscriptElementTag = componentElement.querySelector("noscript[role=\"style\"]");

    		if (!noscriptElementTag) {
    			return;
    		}

    		let customStyleElement = document.createElement("style");
    		customStyleElement.innerHTML = noscriptElementTag.innerHTML;
    		onboardingTableElementReference.shadowRoot.appendChild(customStyleElement);
    	}

    	afterUpdate(async () => {
    		console.log("afterUpdate");

    		if (!onboardingTableElementReference || !onboardingTableElementReference.shadowRoot) {
    			return;
    		}

    		addStylingFromAttribute();
    		addStylingFromTag();
    	});

    	const writable_props = ["apiurl", "apikey", "customstyle"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<esignature-onboarding> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("esignature-onboarding", $$slots, []);

    	function onboarding_table_component_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(2, onboardingTableElementReference = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("apiurl" in $$props) $$invalidate(0, apiurl = $$props.apiurl);
    		if ("apikey" in $$props) $$invalidate(1, apikey = $$props.apikey);
    		if ("customstyle" in $$props) $$invalidate(3, customstyle = $$props.customstyle);
    	};

    	$$self.$capture_state = () => ({
    		OnboardingTable,
    		afterUpdate,
    		apiurl,
    		apikey,
    		customstyle,
    		onboardingTableElementReference,
    		addStylingFromAttribute,
    		addStylingFromTag
    	});

    	$$self.$inject_state = $$props => {
    		if ("apiurl" in $$props) $$invalidate(0, apiurl = $$props.apiurl);
    		if ("apikey" in $$props) $$invalidate(1, apikey = $$props.apikey);
    		if ("customstyle" in $$props) $$invalidate(3, customstyle = $$props.customstyle);
    		if ("onboardingTableElementReference" in $$props) $$invalidate(2, onboardingTableElementReference = $$props.onboardingTableElementReference);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		apiurl,
    		apikey,
    		onboardingTableElementReference,
    		customstyle,
    		addStylingFromAttribute,
    		addStylingFromTag,
    		onboarding_table_component_binding
    	];
    }

    class App extends SvelteElement {
    	constructor(options) {
    		super();
    		init(this, { target: this.shadowRoot }, instance$7, create_fragment$7, safe_not_equal, { apiurl: 0, apikey: 1, customstyle: 3 });
    		const { ctx } = this.$$;
    		const props = this.attributes;

    		if (/*apiurl*/ ctx[0] === undefined && !("apiurl" in props)) {
    			console_1.warn("<esignature-onboarding> was created without expected prop 'apiurl'");
    		}

    		if (/*apikey*/ ctx[1] === undefined && !("apikey" in props)) {
    			console_1.warn("<esignature-onboarding> was created without expected prop 'apikey'");
    		}

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["apiurl", "apikey", "customstyle"];
    	}

    	get apiurl() {
    		return this.$$.ctx[0];
    	}

    	set apiurl(apiurl) {
    		this.$set({ apiurl });
    		flush();
    	}

    	get apikey() {
    		return this.$$.ctx[1];
    	}

    	set apikey(apikey) {
    		this.$set({ apikey });
    		flush();
    	}

    	get customstyle() {
    		return this.$$.ctx[3];
    	}

    	set customstyle(customstyle) {
    		this.$set({ customstyle });
    		flush();
    	}
    }

    customElements.define("esignature-onboarding", App);

    return App;

}());
//# sourceMappingURL=bundle.js.map
