/*!
 * Grapnel
 * https://github.com/baseprime/grapnel.git
 * 
 * @author Greg Sabia Tucker <greg@narrowlabs.com>
 * @link http://basepri.me
 * @version 0.7.1
 * 
 * Released under MIT License. See LICENSE.txt or http://opensource.org/licenses/MIT
 */
var Grapnel=function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";var i=n(1).default,r=n(3).default,s=n(4).default;i.MiddlewareStack=s,i.Route=r,e=t.exports=i},function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var h=n(2),u=n(3),l=n(4),c=function(t){function e(t){i(this,e);var n=r(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return n._maxListeners=1/0,n.options={},n.options=Object.assign({},e.defaults,t),"object"===o(n.options.target)&&"function"==typeof n.options.target.addEventListener&&(n.options.target.addEventListener("hashchange",function(){n.emit("hashchange")}),n.options.target.addEventListener("popstate",function(t){return(!n.state||null!==n.state.previousState)&&void n.emit("navigate")})),n}return s(e,t),a(e,[{key:"add",value:function(t){var e=Array.prototype.slice.call(arguments,1,-1),n=Array.prototype.slice.call(arguments,-1)[0],i=this.options.root+t,r=new u.default(i),s=function(){var t=r.parse(this.path());if(t.match){var s={req:t,route:i,params:t.params,regex:t.match},o=new l.default(this,s).enqueue(e.concat(n));if(this.emit("match",o,t),!o.runCallback)return this;if(o.previousState=this.state,this.state=o,o.parent()&&o.parent().propagateEvent===!1)return o.propagateEvent=!1,this;o.callback()}return this}.bind(this),o=!this.options.pushState&&this.options.isWindow?"hashchange":"navigate";return s().on(o,s)}},{key:"get",value:function(){return this.add.apply(this,arguments)}},{key:"trigger",value:function(){return this.emit.apply(this,arguments)}},{key:"bind",value:function(){return this.on.apply(this,arguments)}},{key:"context",value:function(t){var e=this,n=Array.prototype.slice.call(arguments,1);return function(){for(var i=arguments.length,r=Array(i),s=0;s<i;s++)r[s]=arguments[s];var o=r[0],a=r.length>2?Array.prototype.slice.call(r,1,-1):[],h=Array.prototype.slice.call(r,-1)[0],u="/"!==t.slice(-1)&&"/"!==o&&""!==o?t+"/":t,l="/"!==o.substr(0,1)?o:o.substr(1),c=u+l;return e.add.apply(e,[c].concat(n).concat(a).concat([h]))}}},{key:"navigate",value:function(t,e){return this.path(t,e).emit("navigate"),this}},{key:"path",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=this.options.target,i=void 0,r=e.title;if("string"==typeof t){if(this.options.pushState&&"function"==typeof n.history.pushState){var s=e.state||n.history.state;i=this.options.root?this.options.root+t:t,n.history.pushState(s,r,i)}else if(n.location){var o=this.options.root?this.options.root+t:t;n.location.hash=(this.options.hashBang?"!":"")+o}else n.pathname=t||"";return this}if("undefined"==typeof t)return i=this.options.pushState?n.location.pathname.replace(this.options.root,""):!this.options.pushState&&n.location?n.location.hash?n.location.hash.split(this.options.hashBang?"#!":"#")[1]:"":n._pathname||"";if(t===!1){if(this.options.pushState&&"function"==typeof n.history.pushState){var a=e.state||n.history.state;n.history.pushState(a,r,this.options.root||"/")}else n.location&&(n.location.hash=this.options.hashBang?"!":"");return this}}}],[{key:"listen",value:function(){var t=void 0,n=void 0;return(arguments.length<=0?void 0:arguments[0])&&(arguments.length<=1?void 0:arguments[1])?(t=arguments.length<=0?void 0:arguments[0],n=arguments.length<=1?void 0:arguments[1]):n=arguments.length<=0?void 0:arguments[0],function(){for(var t in n)this.add.call(this,t,n[t]);return this}.call(new e(t||{}))}},{key:"toString",value:function(){return this.name}}]),e}(h.EventEmitter);c.defaults={root:"",target:"object"===("undefined"==typeof window?"undefined":o(window))?window:{},isWindow:"object"===("undefined"==typeof window?"undefined":o(window)),pushState:!1,hashBang:!1},e.default=c},function(t,e){"use strict";function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(t){return"function"==typeof t}function r(t){return"number"==typeof t}function s(t){return"object"===("undefined"==typeof t?"undefined":a(t))&&null!==t}function o(t){return void 0===t}var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};t.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(t){if(!r(t)||t<0||isNaN(t))throw TypeError("n must be a positive number");return this._maxListeners=t,this},n.prototype.emit=function(t){var e,n,r,a,h,u;if(this._events||(this._events={}),"error"===t&&(!this._events.error||s(this._events.error)&&!this._events.error.length)){if(e=arguments[1],e instanceof Error)throw e;var l=new Error('Uncaught, unspecified "error" event. ('+e+")");throw l.context=e,l}if(n=this._events[t],o(n))return!1;if(i(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:a=Array.prototype.slice.call(arguments,1),n.apply(this,a)}else if(s(n))for(a=Array.prototype.slice.call(arguments,1),u=n.slice(),r=u.length,h=0;h<r;h++)u[h].apply(this,a);return!0},n.prototype.addListener=function(t,e){var r;if(!i(e))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",t,i(e.listener)?e.listener:e),this._events[t]?s(this._events[t])?this._events[t].push(e):this._events[t]=[this._events[t],e]:this._events[t]=e,s(this._events[t])&&!this._events[t].warned&&(r=o(this._maxListeners)?n.defaultMaxListeners:this._maxListeners,r&&r>0&&this._events[t].length>r&&(this._events[t].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[t].length),"function"==typeof console.trace&&console.trace())),this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(t,e){function n(){this.removeListener(t,n),r||(r=!0,e.apply(this,arguments))}if(!i(e))throw TypeError("listener must be a function");var r=!1;return n.listener=e,this.on(t,n),this},n.prototype.removeListener=function(t,e){var n,r,o,a;if(!i(e))throw TypeError("listener must be a function");if(!this._events||!this._events[t])return this;if(n=this._events[t],o=n.length,r=-1,n===e||i(n.listener)&&n.listener===e)delete this._events[t],this._events.removeListener&&this.emit("removeListener",t,e);else if(s(n)){for(a=o;a-- >0;)if(n[a]===e||n[a].listener&&n[a].listener===e){r=a;break}if(r<0)return this;1===n.length?(n.length=0,delete this._events[t]):n.splice(r,1),this._events.removeListener&&this.emit("removeListener",t,e)}return this},n.prototype.removeAllListeners=function(t){var e,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[t]&&delete this._events[t],this;if(0===arguments.length){for(e in this._events)"removeListener"!==e&&this.removeAllListeners(e);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[t],i(n))this.removeListener(t,n);else if(n)for(;n.length;)this.removeListener(t,n[n.length-1]);return delete this._events[t],this},n.prototype.listeners=function(t){var e;return e=this._events&&this._events[t]?i(this._events[t])?[this._events[t]]:this._events[t].slice():[]},n.prototype.listenerCount=function(t){if(this._events){var e=this._events[t];if(i(e))return 1;if(e)return e.length}return 0},n.listenerCount=function(t,e){return t.listenerCount(e)}},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(e){n(this,t),this.keys=[],this.strict=!1,this.sensitive=!1,this.path=e,this.regex=this.create()}return i(t,[{key:"parse",value:function(t){var e=this,n=t.match(this.regex),i={match:n,params:{},keys:this.keys,matches:(n||[]).slice(1)};return i.matches.forEach(function(t,n){var r=e.keys[n]&&e.keys[n].name?e.keys[n].name:n;i.params[r]=t?decodeURIComponent(t):void 0}),i}},{key:"create",value:function(){var t=this;if(this.path instanceof RegExp)return this.path;this.path instanceof Array&&(this.path="("+this.path.join("|")+")");var e=this.path.concat(this.strict?"":"/?").replace(/\/\(/g,"(?:/").replace(/\+/g,"__plus__").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,function(e,n,i,r,s,o){return t.keys.push({name:r,optional:!!o}),n=n||"",""+(o?"":n)+"(?:"+(o?n:"")+(i||"")+(s||i&&"([^/.]+?)"||"([^/]+?)")+")"+(o||"")}).replace(/([\/.])/g,"\\$1").replace(/__plus__/g,"(.+)").replace(/\*/g,"(.*)");return new RegExp("^"+e+"$",this.sensitive?"":"i")}}]),t}();e.default=r},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(e,i){return n(this,t),this.runCallback=!0,this.callbackRan=!0,this.propagateEvent=!0,this.stack=t.global.slice(0),this.router=e,this.value=e.path(),Object.assign(this,i),this}return i(t,[{key:"preventDefault",value:function(){this.runCallback=!1}},{key:"stopPropagation",value:function(){this.propagateEvent=!1}},{key:"parent",value:function(){var t=!(!this.previousState||!this.previousState.value||this.previousState.value!=this.value);return!!t&&this.previousState}},{key:"callback",value:function(){this.callbackRan=!0,this.timeStamp=Date.now(),this.next()}},{key:"enqueue",value:function(t,e){for(var n=Array.isArray(t)?e<t.length?t.reverse():t:[t];n.length;)this.stack.splice(e||this.stack.length+1,0,n.shift());return this}},{key:"next",value:function(){var t=this;return this.stack.shift().call(this.router,this.req,this,function(){return t.next()})}}]),t}();r.global=[],e.default=r}]);
export default Grapnel;
//# sourceMappingURL=grapnel.min.js.map