//#region pkg/vtracer.js
/**
* Trace an RGBA buffer into an SVG document.
*
* `pixels` is row-major RGBA (4 bytes per pixel, `width * height * 4` bytes
* in total), as produced by `ImageData.data`. `options` accepts the camelCase
* fields of [`vtracer::Config`]; `undefined`/`null` means "all defaults".
* `on_progress`, when given, is called as `(phase, fraction)` with `phase` one
* of `"segment" | "compose" | "optimize"` and `fraction` in `0..=1`.
* @param {Uint8Array} pixels
* @param {number} width
* @param {number} height
* @param {any} options
* @param {Function | null} [on_progress]
* @returns {string}
*/
function convert_pixels(pixels, width, height, options, on_progress) {
	let deferred3_0;
	let deferred3_1;
	try {
		const ptr0 = passArray8ToWasm0(pixels, wasm.__wbindgen_malloc);
		const len0 = WASM_VECTOR_LEN;
		const ret = wasm.convert_pixels(ptr0, len0, width, height, options, isLikeNone(on_progress) ? 0 : addToExternrefTable0(on_progress));
		var ptr2 = ret[0];
		var len2 = ret[1];
		if (ret[3]) {
			ptr2 = 0;
			len2 = 0;
			throw takeFromExternrefTable0(ret[2]);
		}
		deferred3_0 = ptr2;
		deferred3_1 = len2;
		return getStringFromWasm0(ptr2, len2);
	} finally {
		wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
	}
}
function __wbg_get_imports() {
	return {
		__proto__: null,
		"./vtracer_bg.js": {
			__proto__: null,
			__wbg_Error_67e7344beaa85059: function(arg0, arg1) {
				return Error(getStringFromWasm0(arg0, arg1));
			},
			__wbg_String_8564e559799eccda: function(arg0, arg1) {
				const ptr1 = passStringToWasm0(String(arg1), wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbg___wbindgen_boolean_get_7a12af2b3f899c5a: function(arg0) {
				const v = arg0;
				const ret = typeof v === "boolean" ? v : void 0;
				return isLikeNone(ret) ? 16777215 : ret ? 1 : 0;
			},
			__wbg___wbindgen_debug_string_0e68cf47c9cbd9b0: function(arg0, arg1) {
				const ptr1 = passStringToWasm0(debugString(arg1), wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbg___wbindgen_in_50072d4d6e45c193: function(arg0, arg1) {
				return arg0 in arg1;
			},
			__wbg___wbindgen_is_function_fcda5e3902d732fe: function(arg0) {
				return typeof arg0 === "function";
			},
			__wbg___wbindgen_is_null_5160b3e381865372: function(arg0) {
				return arg0 === null;
			},
			__wbg___wbindgen_is_object_edb6b15aa3afe12e: function(arg0) {
				const val = arg0;
				return typeof val === "object" && val !== null;
			},
			__wbg___wbindgen_is_undefined_8c687d0b90d5b524: function(arg0) {
				return arg0 === void 0;
			},
			__wbg___wbindgen_jsval_loose_eq_3c30021c243b64cd: function(arg0, arg1) {
				return arg0 == arg1;
			},
			__wbg___wbindgen_number_get_1dc732b810cb937c: function(arg0, arg1) {
				const obj = arg1;
				const ret = typeof obj === "number" ? obj : void 0;
				getDataViewMemory0().setFloat64(arg0 + 8, isLikeNone(ret) ? 0 : ret, true);
				getDataViewMemory0().setInt32(arg0 + 0, !isLikeNone(ret), true);
			},
			__wbg___wbindgen_string_get_92ab86bb19cbc12f: function(arg0, arg1) {
				const obj = arg1;
				const ret = typeof obj === "string" ? obj : void 0;
				var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				var len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbg___wbindgen_throw_5d9e815e6fdf150f: function(arg0, arg1) {
				throw new Error(getStringFromWasm0(arg0, arg1));
			},
			__wbg_call_7bbd9cceba9949ad: function() {
				return handleError(function(arg0, arg1, arg2, arg3) {
					return arg0.call(arg1, arg2, arg3);
				}, arguments);
			},
			__wbg_error_757e9472f8410341: function(arg0, arg1) {
				let deferred0_0;
				let deferred0_1;
				try {
					deferred0_0 = arg0;
					deferred0_1 = arg1;
					console.error(getStringFromWasm0(arg0, arg1));
				} finally {
					wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
				}
			},
			__wbg_get_unchecked_363572bdd397d473: function(arg0, arg1) {
				return arg0[arg1 >>> 0];
			},
			__wbg_get_with_ref_key_6412cf3094599694: function(arg0, arg1) {
				return arg0[arg1];
			},
			__wbg_instanceof_ArrayBuffer_d4ff01f8247925ae: function(arg0) {
				let result;
				try {
					result = arg0 instanceof ArrayBuffer;
				} catch (_) {
					result = false;
				}
				return result;
			},
			__wbg_instanceof_Uint8Array_598adc0fef426aa8: function(arg0) {
				let result;
				try {
					result = arg0 instanceof Uint8Array;
				} catch (_) {
					result = false;
				}
				return result;
			},
			__wbg_isArray_5674713bb7b79043: function(arg0) {
				return Array.isArray(arg0);
			},
			__wbg_keys_6efc298980178da1: function(arg0) {
				return Object.keys(arg0);
			},
			__wbg_length_31bdaf014f5fbde2: function(arg0) {
				return arg0.length;
			},
			__wbg_length_4e1adc0d42e23620: function(arg0) {
				return arg0.length;
			},
			__wbg_new_1da3429bc3c4541c: function(arg0) {
				return new Uint8Array(arg0);
			},
			__wbg_new_227d7c05414eb861: function() {
				return /* @__PURE__ */ new Error();
			},
			__wbg_prototypesetcall_ae9f5e7459250748: function(arg0, arg1, arg2) {
				Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
			},
			__wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
				const ret = arg1.stack;
				const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbindgen_generic_0000000000000001: function(arg0) {
				return arg0;
			},
			__wbindgen_generic_0000000000000002: function(arg0, arg1) {
				return getStringFromWasm0(arg0, arg1);
			},
			__wbindgen_init_externref_table: function() {
				const table = wasm.__wbindgen_externrefs;
				const offset = table.grow(4);
				table.set(0, void 0);
				table.set(offset + 0, void 0);
				table.set(offset + 1, null);
				table.set(offset + 2, true);
				table.set(offset + 3, false);
			}
		}
	};
}
function addToExternrefTable0(obj) {
	const idx = wasm.__externref_table_alloc();
	wasm.__wbindgen_externrefs.set(idx, obj);
	return idx;
}
function debugString(val) {
	const type = typeof val;
	if (type == "number" || type == "boolean" || val == null) return `${val}`;
	if (type == "string") return `"${val}"`;
	if (type == "symbol") {
		const description = val.description;
		if (description == null) return "Symbol";
		else return `Symbol(${description})`;
	}
	if (type == "function") {
		const name = val.name;
		if (typeof name == "string" && name.length > 0) return `Function(${name})`;
		else return "Function";
	}
	if (Array.isArray(val)) {
		const length = val.length;
		let debug = "[";
		if (length > 0) debug += debugString(val[0]);
		for (let i = 1; i < length; i++) debug += ", " + debugString(val[i]);
		debug += "]";
		return debug;
	}
	const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
	let className;
	if (builtInMatches && builtInMatches.length > 1) className = builtInMatches[1];
	else return toString.call(val);
	if (className == "Object") try {
		return "Object(" + JSON.stringify(val) + ")";
	} catch (_) {
		return "Object";
	}
	if (val instanceof Error) return `${val.name}: ${val.message}\n${val.stack}`;
	return className;
}
function getArrayU8FromWasm0(ptr, len) {
	ptr = ptr >>> 0;
	return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
	if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
	return cachedDataViewMemory0;
}
function getStringFromWasm0(ptr, len) {
	return decodeText(ptr >>> 0, len);
}
let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
	if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
	return cachedUint8ArrayMemory0;
}
function handleError(f, args) {
	try {
		return f.apply(this, args);
	} catch (e) {
		const idx = addToExternrefTable0(e);
		wasm.__wbindgen_exn_store(idx);
	}
}
function isLikeNone(x) {
	return x === void 0 || x === null;
}
function passArray8ToWasm0(arg, malloc) {
	const ptr = malloc(arg.length * 1, 1) >>> 0;
	getUint8ArrayMemory0().set(arg, ptr / 1);
	WASM_VECTOR_LEN = arg.length;
	return ptr;
}
function passStringToWasm0(arg, malloc, realloc) {
	if (realloc === void 0) {
		const buf = cachedTextEncoder.encode(arg);
		const ptr = malloc(buf.length, 1) >>> 0;
		getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
		WASM_VECTOR_LEN = buf.length;
		return ptr;
	}
	let len = arg.length;
	let ptr = malloc(len, 1) >>> 0;
	const mem = getUint8ArrayMemory0();
	let offset = 0;
	for (; offset < len; offset++) {
		const code = arg.charCodeAt(offset);
		if (code > 127) break;
		mem[ptr + offset] = code;
	}
	if (offset !== len) {
		if (offset !== 0) arg = arg.slice(offset);
		ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
		const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
		const ret = cachedTextEncoder.encodeInto(arg, view);
		offset += ret.written;
		ptr = realloc(ptr, len, offset, 1) >>> 0;
	}
	WASM_VECTOR_LEN = offset;
	return ptr;
}
function takeFromExternrefTable0(idx) {
	const value = wasm.__wbindgen_externrefs.get(idx);
	wasm.__externref_table_dealloc(idx);
	return value;
}
let cachedTextDecoder = new TextDecoder("utf-8", {
	ignoreBOM: true,
	fatal: true
});
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
	numBytesDecoded += len;
	if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
		cachedTextDecoder = new TextDecoder("utf-8", {
			ignoreBOM: true,
			fatal: true
		});
		cachedTextDecoder.decode();
		numBytesDecoded = len;
	}
	return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
const cachedTextEncoder = new TextEncoder();
if (!("encodeInto" in cachedTextEncoder)) cachedTextEncoder.encodeInto = function(arg, view) {
	const buf = cachedTextEncoder.encode(arg);
	view.set(buf);
	return {
		read: arg.length,
		written: buf.length
	};
};
let WASM_VECTOR_LEN = 0;
let wasm;
function __wbg_finalize_init(instance, module) {
	wasm = instance.exports;
	cachedDataViewMemory0 = null;
	cachedUint8ArrayMemory0 = null;
	wasm.__wbindgen_start();
	return wasm;
}
async function __wbg_load(module, imports) {
	if (typeof Response === "function" && module instanceof Response) {
		if (!module.ok) throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
		if (typeof WebAssembly.instantiateStreaming === "function") try {
			return await WebAssembly.instantiateStreaming(module, imports);
		} catch (e) {
			if (expectedResponseType(module.type) && module.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
			else throw e;
		}
		const bytes = await module.arrayBuffer();
		return await WebAssembly.instantiate(bytes, imports);
	} else {
		const instance = await WebAssembly.instantiate(module, imports);
		if (instance instanceof WebAssembly.Instance) return {
			instance,
			module
		};
		else return instance;
	}
	function expectedResponseType(type) {
		switch (type) {
			case "basic":
			case "cors":
			case "default": return true;
		}
		return false;
	}
}
async function __wbg_init(module_or_path) {
	if (wasm !== void 0) return wasm;
	if (module_or_path !== void 0) {
		if (Object.getPrototypeOf(module_or_path) === Object.prototype) ({module_or_path} = module_or_path);
		else console.warn("using deprecated parameters for the initialization function; pass a single object instead");
	}
	if (module_or_path === void 0) module_or_path = "/wasm/vtracer_bg.wasm";
	const imports = __wbg_get_imports();
	if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) module_or_path = fetch(module_or_path);
	const { instance, module } = await __wbg_load(await module_or_path, imports);
	return __wbg_finalize_init(instance, module);
}
//#endregion
//#region src/wasm.ts
let ready = null;
/**
* Instantiate the wasm module (fetching `vtracer_bg.wasm` next to this
* module's own URL) and let concurrent callers share the one instance.
*
* A failed attempt is not cached, so a transient network error can be retried
* instead of poisoning the tracer for the rest of the session.
*/
function load() {
	if (ready) return ready;
	const attempt = __wbg_init().then(() => void 0).catch((error) => {
		ready = null;
		throw toError(error);
	});
	ready = attempt;
	return attempt;
}
/**
* Trace an RGBA buffer. Must be called after {@link load}; the wasm call is
* synchronous and blocks the calling thread for its whole duration.
*/
function trace(pixels, width, height, options, onProgress) {
	try {
		return convert_pixels(pixels, width, height, options, onProgress ? (phase, fraction) => {
			onProgress(phase, fraction);
		} : void 0);
	} catch (error) {
		throw toError(error);
	}
}
function toError(value) {
	if (value instanceof Error) return value;
	if (typeof value === "object" && value !== null && "message" in value) return new Error(String(value.message));
	return new Error(String(value));
}
//#endregion
//#region src/worker.ts
const scope = self;
/**
* Start instantiating the wasm module now rather than on the first message, so
* fetching and compiling the binary overlaps with the image decode. The
* handlers `await load()` as well: it returns the same in-flight promise, and
* starts a fresh attempt if this one failed. The extra handler keeps a failed
* prefetch from surfacing as an unhandled rejection in the worker console.
*/
load().catch(() => {});
scope.onmessage = (event) => {
	handle(event.data);
};
async function handle(request) {
	if (!request || typeof request.id !== "number") return;
	try {
		switch (request.type) {
			case "convert":
				await convert(request);
				break;
			case "convert-pixels": await convertPixels(request);
		}
	} catch (error) {
		post({
			id: request.id,
			type: "error",
			error: toError(error).message
		});
	}
}
async function convert(request) {
	const { id, bitmap, maxWidth, maxHeight, options, reportProgress } = request;
	try {
		await load();
		const raster = rasterize(bitmap, maxWidth, maxHeight);
		post({
			id,
			type: "success",
			svg: trace(raster.pixels, raster.width, raster.height, options, progressReporter(id, reportProgress))
		});
	} finally {
		bitmap.close();
	}
}
async function convertPixels(request) {
	const { id, pixels, width, height, options, reportProgress } = request;
	await load();
	post({
		id,
		type: "success",
		svg: trace(pixels, width, height, options, progressReporter(id, reportProgress))
	});
}
/**
* Draw the bitmap onto a canvas at the requested size and hand back the RGBA
* bytes. Downscaling happens on the canvas rather than in the tracer, so the
* clustering works on fewer pixels instead of more.
*/
function rasterize(bitmap, maxWidth, maxHeight) {
	const scale = Math.min(1, (maxWidth ?? bitmap.width) / bitmap.width, (maxHeight ?? bitmap.height) / bitmap.height);
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	if (typeof OffscreenCanvas === "undefined") throw new Error("tracing an image in a worker needs OffscreenCanvas (Chrome 69+, Firefox 105+, Safari 16.4+); pass raw pixels to convertPixels on older browsers");
	const context = new OffscreenCanvas(width, height).getContext("2d", { willReadFrequently: true });
	if (!context) throw new Error("unable to create a 2d canvas context");
	context.drawImage(bitmap, 0, 0, width, height);
	const { data } = context.getImageData(0, 0, width, height);
	return {
		pixels: new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
		width,
		height
	};
}
/**
* Coalesce progress into ~2% steps per phase: clustering reports far more
* often than a progress bar can use, and every update is a cross-thread
* message.
*/
function progressReporter(id, enabled) {
	if (!enabled) return;
	let lastPhase = "";
	let lastFraction = -1;
	return (phase, fraction) => {
		if (phase === lastPhase && fraction - lastFraction < .02) return;
		lastPhase = phase;
		lastFraction = fraction;
		post({
			id,
			type: "progress",
			phase,
			fraction
		});
	};
}
function post(message) {
	scope.postMessage(message);
}
//#endregion
