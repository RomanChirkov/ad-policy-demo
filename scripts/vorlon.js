var vorlonBaseURL="";
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.io=e()}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(_dereq_,module,exports){module.exports=_dereq_("./lib/")},{"./lib/":2}],2:[function(_dereq_,module,exports){var url=_dereq_("./url");var parser=_dereq_("socket.io-parser");var Manager=_dereq_("./manager");var debug=_dereq_("debug")("socket.io-client");module.exports=exports=lookup;var cache=exports.managers={};function lookup(uri,opts){if(typeof uri=="object"){opts=uri;uri=undefined}opts=opts||{};var parsed=url(uri);var source=parsed.source;var id=parsed.id;var io;if(opts.forceNew||opts["force new connection"]||false===opts.multiplex){debug("ignoring socket cache for %s",source);io=Manager(source,opts)}else{if(!cache[id]){debug("new io instance for %s",source);cache[id]=Manager(source,opts)}io=cache[id]}return io.socket(parsed.path)}exports.protocol=parser.protocol;exports.connect=lookup;exports.Manager=_dereq_("./manager");exports.Socket=_dereq_("./socket")},{"./manager":3,"./socket":5,"./url":6,debug:10,"socket.io-parser":46}],3:[function(_dereq_,module,exports){var url=_dereq_("./url");var eio=_dereq_("engine.io-client");var Socket=_dereq_("./socket");var Emitter=_dereq_("component-emitter");var parser=_dereq_("socket.io-parser");var on=_dereq_("./on");var bind=_dereq_("component-bind");var object=_dereq_("object-component");var debug=_dereq_("debug")("socket.io-client:manager");var indexOf=_dereq_("indexof");var Backoff=_dereq_("backo2");module.exports=Manager;function Manager(uri,opts){if(!(this instanceof Manager))return new Manager(uri,opts);if(uri&&"object"==typeof uri){opts=uri;uri=undefined}opts=opts||{};opts.path=opts.path||"/socket.io";this.nsps={};this.subs=[];this.opts=opts;this.reconnection(opts.reconnection!==false);this.reconnectionAttempts(opts.reconnectionAttempts||Infinity);this.reconnectionDelay(opts.reconnectionDelay||1e3);this.reconnectionDelayMax(opts.reconnectionDelayMax||5e3);this.randomizationFactor(opts.randomizationFactor||.5);this.backoff=new Backoff({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()});this.timeout(null==opts.timeout?2e4:opts.timeout);this.readyState="closed";this.uri=uri;this.connected=[];this.encoding=false;this.packetBuffer=[];this.encoder=new parser.Encoder;this.decoder=new parser.Decoder;this.autoConnect=opts.autoConnect!==false;if(this.autoConnect)this.open()}Manager.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var nsp in this.nsps){this.nsps[nsp].emit.apply(this.nsps[nsp],arguments)}};Manager.prototype.updateSocketIds=function(){for(var nsp in this.nsps){this.nsps[nsp].id=this.engine.id}};Emitter(Manager.prototype);Manager.prototype.reconnection=function(v){if(!arguments.length)return this._reconnection;this._reconnection=!!v;return this};Manager.prototype.reconnectionAttempts=function(v){if(!arguments.length)return this._reconnectionAttempts;this._reconnectionAttempts=v;return this};Manager.prototype.reconnectionDelay=function(v){if(!arguments.length)return this._reconnectionDelay;this._reconnectionDelay=v;this.backoff&&this.backoff.setMin(v);return this};Manager.prototype.randomizationFactor=function(v){if(!arguments.length)return this._randomizationFactor;this._randomizationFactor=v;this.backoff&&this.backoff.setJitter(v);return this};Manager.prototype.reconnectionDelayMax=function(v){if(!arguments.length)return this._reconnectionDelayMax;this._reconnectionDelayMax=v;this.backoff&&this.backoff.setMax(v);return this};Manager.prototype.timeout=function(v){if(!arguments.length)return this._timeout;this._timeout=v;return this};Manager.prototype.maybeReconnectOnOpen=function(){if(!this.reconnecting&&this._reconnection&&this.backoff.attempts===0){this.reconnect()}};Manager.prototype.open=Manager.prototype.connect=function(fn){debug("readyState %s",this.readyState);if(~this.readyState.indexOf("open"))return this;debug("opening %s",this.uri);this.engine=eio(this.uri,this.opts);var socket=this.engine;var self=this;this.readyState="opening";this.skipReconnect=false;var openSub=on(socket,"open",function(){self.onopen();fn&&fn()});var errorSub=on(socket,"error",function(data){debug("connect_error");self.cleanup();self.readyState="closed";self.emitAll("connect_error",data);if(fn){var err=new Error("Connection error");err.data=data;fn(err)}else{self.maybeReconnectOnOpen()}});if(false!==this._timeout){var timeout=this._timeout;debug("connect attempt will timeout after %d",timeout);var timer=setTimeout(function(){debug("connect attempt timed out after %d",timeout);openSub.destroy();socket.close();socket.emit("error","timeout");self.emitAll("connect_timeout",timeout)},timeout);this.subs.push({destroy:function(){clearTimeout(timer)}})}this.subs.push(openSub);this.subs.push(errorSub);return this};Manager.prototype.onopen=function(){debug("open");this.cleanup();this.readyState="open";this.emit("open");var socket=this.engine;this.subs.push(on(socket,"data",bind(this,"ondata")));this.subs.push(on(this.decoder,"decoded",bind(this,"ondecoded")));this.subs.push(on(socket,"error",bind(this,"onerror")));this.subs.push(on(socket,"close",bind(this,"onclose")))};Manager.prototype.ondata=function(data){this.decoder.add(data)};Manager.prototype.ondecoded=function(packet){this.emit("packet",packet)};Manager.prototype.onerror=function(err){debug("error",err);this.emitAll("error",err)};Manager.prototype.socket=function(nsp){var socket=this.nsps[nsp];if(!socket){socket=new Socket(this,nsp);this.nsps[nsp]=socket;var self=this;socket.on("connect",function(){socket.id=self.engine.id;if(!~indexOf(self.connected,socket)){self.connected.push(socket)}})}return socket};Manager.prototype.destroy=function(socket){var index=indexOf(this.connected,socket);if(~index)this.connected.splice(index,1);if(this.connected.length)return;this.close()};Manager.prototype.packet=function(packet){debug("writing packet %j",packet);var self=this;if(!self.encoding){self.encoding=true;this.encoder.encode(packet,function(encodedPackets){for(var i=0;i<encodedPackets.length;i++){self.engine.write(encodedPackets[i])}self.encoding=false;self.processPacketQueue()})}else{self.packetBuffer.push(packet)}};Manager.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var pack=this.packetBuffer.shift();this.packet(pack)}};Manager.prototype.cleanup=function(){var sub;while(sub=this.subs.shift())sub.destroy();this.packetBuffer=[];this.encoding=false;this.decoder.destroy()};Manager.prototype.close=Manager.prototype.disconnect=function(){this.skipReconnect=true;this.backoff.reset();this.readyState="closed";this.engine&&this.engine.close()};Manager.prototype.onclose=function(reason){debug("close");this.cleanup();this.backoff.reset();this.readyState="closed";this.emit("close",reason);if(this._reconnection&&!this.skipReconnect){this.reconnect()}};Manager.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var self=this;if(this.backoff.attempts>=this._reconnectionAttempts){debug("reconnect failed");this.backoff.reset();this.emitAll("reconnect_failed");this.reconnecting=false}else{var delay=this.backoff.duration();debug("will wait %dms before reconnect attempt",delay);this.reconnecting=true;var timer=setTimeout(function(){if(self.skipReconnect)return;debug("attempting reconnect");self.emitAll("reconnect_attempt",self.backoff.attempts);self.emitAll("reconnecting",self.backoff.attempts);if(self.skipReconnect)return;self.open(function(err){if(err){debug("reconnect attempt error");self.reconnecting=false;self.reconnect();self.emitAll("reconnect_error",err.data)}else{debug("reconnect success");self.onreconnect()}})},delay);this.subs.push({destroy:function(){clearTimeout(timer)}})}};Manager.prototype.onreconnect=function(){var attempt=this.backoff.attempts;this.reconnecting=false;this.backoff.reset();this.updateSocketIds();this.emitAll("reconnect",attempt)}},{"./on":4,"./socket":5,"./url":6,backo2:7,"component-bind":8,"component-emitter":9,debug:10,"engine.io-client":11,indexof:42,"object-component":43,"socket.io-parser":46}],4:[function(_dereq_,module,exports){module.exports=on;function on(obj,ev,fn){obj.on(ev,fn);return{destroy:function(){obj.removeListener(ev,fn)}}}},{}],5:[function(_dereq_,module,exports){var parser=_dereq_("socket.io-parser");var Emitter=_dereq_("component-emitter");var toArray=_dereq_("to-array");var on=_dereq_("./on");var bind=_dereq_("component-bind");var debug=_dereq_("debug")("socket.io-client:socket");var hasBin=_dereq_("has-binary");module.exports=exports=Socket;var events={connect:1,connect_error:1,connect_timeout:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1};var emit=Emitter.prototype.emit;function Socket(io,nsp){this.io=io;this.nsp=nsp;this.json=this;this.ids=0;this.acks={};if(this.io.autoConnect)this.open();this.receiveBuffer=[];this.sendBuffer=[];this.connected=false;this.disconnected=true}Emitter(Socket.prototype);Socket.prototype.subEvents=function(){if(this.subs)return;var io=this.io;this.subs=[on(io,"open",bind(this,"onopen")),on(io,"packet",bind(this,"onpacket")),on(io,"close",bind(this,"onclose"))]};Socket.prototype.open=Socket.prototype.connect=function(){if(this.connected)return this;this.subEvents();this.io.open();if("open"==this.io.readyState)this.onopen();return this};Socket.prototype.send=function(){var args=toArray(arguments);args.unshift("message");this.emit.apply(this,args);return this};Socket.prototype.emit=function(ev){if(events.hasOwnProperty(ev)){emit.apply(this,arguments);return this}var args=toArray(arguments);var parserType=parser.EVENT;if(hasBin(args)){parserType=parser.BINARY_EVENT}var packet={type:parserType,data:args};if("function"==typeof args[args.length-1]){debug("emitting packet with ack id %d",this.ids);this.acks[this.ids]=args.pop();packet.id=this.ids++}if(this.connected){this.packet(packet)}else{this.sendBuffer.push(packet)}return this};Socket.prototype.packet=function(packet){packet.nsp=this.nsp;this.io.packet(packet)};Socket.prototype.onopen=function(){debug("transport is open - connecting");if("/"!=this.nsp){this.packet({type:parser.CONNECT})}};Socket.prototype.onclose=function(reason){debug("close (%s)",reason);this.connected=false;this.disconnected=true;delete this.id;this.emit("disconnect",reason)};Socket.prototype.onpacket=function(packet){if(packet.nsp!=this.nsp)return;switch(packet.type){case parser.CONNECT:this.onconnect();break;case parser.EVENT:this.onevent(packet);break;case parser.BINARY_EVENT:this.onevent(packet);break;case parser.ACK:this.onack(packet);break;case parser.BINARY_ACK:this.onack(packet);break;case parser.DISCONNECT:this.ondisconnect();break;case parser.ERROR:this.emit("error",packet.data);break}};Socket.prototype.onevent=function(packet){var args=packet.data||[];debug("emitting event %j",args);if(null!=packet.id){debug("attaching ack callback to event");args.push(this.ack(packet.id))}if(this.connected){emit.apply(this,args)}else{this.receiveBuffer.push(args)}};Socket.prototype.ack=function(id){var self=this;var sent=false;return function(){if(sent)return;sent=true;var args=toArray(arguments);debug("sending ack %j",args);var type=hasBin(args)?parser.BINARY_ACK:parser.ACK;self.packet({type:type,id:id,data:args})}};Socket.prototype.onack=function(packet){debug("calling ack %s with %j",packet.id,packet.data);var fn=this.acks[packet.id];fn.apply(this,packet.data);delete this.acks[packet.id]};Socket.prototype.onconnect=function(){this.connected=true;this.disconnected=false;this.emit("connect");this.emitBuffered()};Socket.prototype.emitBuffered=function(){var i;for(i=0;i<this.receiveBuffer.length;i++){emit.apply(this,this.receiveBuffer[i])}this.receiveBuffer=[];for(i=0;i<this.sendBuffer.length;i++){this.packet(this.sendBuffer[i])}this.sendBuffer=[]};Socket.prototype.ondisconnect=function(){debug("server disconnect (%s)",this.nsp);this.destroy();this.onclose("io server disconnect")};Socket.prototype.destroy=function(){if(this.subs){for(var i=0;i<this.subs.length;i++){this.subs[i].destroy()}this.subs=null}this.io.destroy(this)};Socket.prototype.close=Socket.prototype.disconnect=function(){if(this.connected){debug("performing disconnect (%s)",this.nsp);this.packet({type:parser.DISCONNECT})}this.destroy();if(this.connected){this.onclose("io client disconnect")}return this}},{"./on":4,"component-bind":8,"component-emitter":9,debug:10,"has-binary":38,"socket.io-parser":46,"to-array":50}],6:[function(_dereq_,module,exports){(function(global){var parseuri=_dereq_("parseuri");var debug=_dereq_("debug")("socket.io-client:url");module.exports=url;function url(uri,loc){var obj=uri;var loc=loc||global.location;if(null==uri)uri=loc.protocol+"//"+loc.host;if("string"==typeof uri){if("/"==uri.charAt(0)){if("/"==uri.charAt(1)){uri=loc.protocol+uri}else{uri=loc.hostname+uri}}if(!/^(https?|wss?):\/\//.test(uri)){debug("protocol-less url %s",uri);if("undefined"!=typeof loc){uri=loc.protocol+"//"+uri}else{uri="https://"+uri}}debug("parse %s",uri);obj=parseuri(uri)}if(!obj.port){if(/^(http|ws)$/.test(obj.protocol)){obj.port="80"}else if(/^(http|ws)s$/.test(obj.protocol)){obj.port="443"}}obj.path=obj.path||"/";obj.id=obj.protocol+"://"+obj.host+":"+obj.port;obj.href=obj.protocol+"://"+obj.host+(loc&&loc.port==obj.port?"":":"+obj.port);return obj}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{debug:10,parseuri:44}],7:[function(_dereq_,module,exports){module.exports=Backoff;function Backoff(opts){opts=opts||{};this.ms=opts.min||100;this.max=opts.max||1e4;this.factor=opts.factor||2;this.jitter=opts.jitter>0&&opts.jitter<=1?opts.jitter:0;this.attempts=0}Backoff.prototype.duration=function(){var ms=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var rand=Math.random();var deviation=Math.floor(rand*this.jitter*ms);ms=(Math.floor(rand*10)&1)==0?ms-deviation:ms+deviation}return Math.min(ms,this.max)|0};Backoff.prototype.reset=function(){this.attempts=0};Backoff.prototype.setMin=function(min){this.ms=min};Backoff.prototype.setMax=function(max){this.max=max};Backoff.prototype.setJitter=function(jitter){this.jitter=jitter}},{}],8:[function(_dereq_,module,exports){var slice=[].slice;module.exports=function(obj,fn){if("string"==typeof fn)fn=obj[fn];if("function"!=typeof fn)throw new Error("bind() requires a function");var args=slice.call(arguments,2);return function(){return fn.apply(obj,args.concat(slice.call(arguments)))}}},{}],9:[function(_dereq_,module,exports){module.exports=Emitter;function Emitter(obj){if(obj)return mixin(obj)}function mixin(obj){for(var key in Emitter.prototype){obj[key]=Emitter.prototype[key]}return obj}Emitter.prototype.on=Emitter.prototype.addEventListener=function(event,fn){this._callbacks=this._callbacks||{};(this._callbacks[event]=this._callbacks[event]||[]).push(fn);return this};Emitter.prototype.once=function(event,fn){var self=this;this._callbacks=this._callbacks||{};function on(){self.off(event,on);fn.apply(this,arguments)}on.fn=fn;this.on(event,on);return this};Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(event,fn){this._callbacks=this._callbacks||{};if(0==arguments.length){this._callbacks={};return this}var callbacks=this._callbacks[event];if(!callbacks)return this;if(1==arguments.length){delete this._callbacks[event];return this}var cb;for(var i=0;i<callbacks.length;i++){cb=callbacks[i];if(cb===fn||cb.fn===fn){callbacks.splice(i,1);break}}return this};Emitter.prototype.emit=function(event){this._callbacks=this._callbacks||{};var args=[].slice.call(arguments,1),callbacks=this._callbacks[event];if(callbacks){callbacks=callbacks.slice(0);for(var i=0,len=callbacks.length;i<len;++i){callbacks[i].apply(this,args)}}return this};Emitter.prototype.listeners=function(event){this._callbacks=this._callbacks||{};return this._callbacks[event]||[]};Emitter.prototype.hasListeners=function(event){return!!this.listeners(event).length}},{}],10:[function(_dereq_,module,exports){module.exports=debug;function debug(name){if(!debug.enabled(name))return function(){};return function(fmt){fmt=coerce(fmt);var curr=new Date;var ms=curr-(debug[name]||curr);debug[name]=curr;fmt=name+" "+fmt+" +"+debug.humanize(ms);window.console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}}debug.names=[];debug.skips=[];debug.enable=function(name){try{localStorage.debug=name}catch(e){}var split=(name||"").split(/[\s,]+/),len=split.length;for(var i=0;i<len;i++){name=split[i].replace("*",".*?");if(name[0]==="-"){debug.skips.push(new RegExp("^"+name.substr(1)+"$"))}else{debug.names.push(new RegExp("^"+name+"$"))}}};debug.disable=function(){debug.enable("")};debug.humanize=function(ms){var sec=1e3,min=60*1e3,hour=60*min;if(ms>=hour)return(ms/hour).toFixed(1)+"h";if(ms>=min)return(ms/min).toFixed(1)+"m";if(ms>=sec)return(ms/sec|0)+"s";return ms+"ms"};debug.enabled=function(name){for(var i=0,len=debug.skips.length;i<len;i++){if(debug.skips[i].test(name)){return false}}for(var i=0,len=debug.names.length;i<len;i++){if(debug.names[i].test(name)){return true}}return false};function coerce(val){if(val instanceof Error)return val.stack||val.message;return val}try{if(window.localStorage)debug.enable(localStorage.debug)}catch(e){}},{}],11:[function(_dereq_,module,exports){module.exports=_dereq_("./lib/")},{"./lib/":12}],12:[function(_dereq_,module,exports){module.exports=_dereq_("./socket");module.exports.parser=_dereq_("engine.io-parser")},{"./socket":13,"engine.io-parser":25}],13:[function(_dereq_,module,exports){(function(global){var transports=_dereq_("./transports");var Emitter=_dereq_("component-emitter");var debug=_dereq_("debug")("engine.io-client:socket");var index=_dereq_("indexof");var parser=_dereq_("engine.io-parser");var parseuri=_dereq_("parseuri");var parsejson=_dereq_("parsejson");var parseqs=_dereq_("parseqs");module.exports=Socket;function noop(){}function Socket(uri,opts){if(!(this instanceof Socket))return new Socket(uri,opts);opts=opts||{};if(uri&&"object"==typeof uri){opts=uri;uri=null}if(uri){uri=parseuri(uri);opts.host=uri.host;opts.secure=uri.protocol=="https"||uri.protocol=="wss";opts.port=uri.port;if(uri.query)opts.query=uri.query}this.secure=null!=opts.secure?opts.secure:global.location&&"https:"==location.protocol;if(opts.host){var pieces=opts.host.split(":");opts.hostname=pieces.shift();if(pieces.length){opts.port=pieces.pop()}else if(!opts.port){opts.port=this.secure?"443":"80"}}this.agent=opts.agent||false;this.hostname=opts.hostname||(global.location?location.hostname:"localhost");this.port=opts.port||(global.location&&location.port?location.port:this.secure?443:80);this.query=opts.query||{};if("string"==typeof this.query)this.query=parseqs.decode(this.query);this.upgrade=false!==opts.upgrade;this.path=(opts.path||"/engine.io").replace(/\/$/,"")+"/";this.forceJSONP=!!opts.forceJSONP;this.jsonp=false!==opts.jsonp;this.forceBase64=!!opts.forceBase64;this.enablesXDR=!!opts.enablesXDR;this.timestampParam=opts.timestampParam||"t";this.timestampRequests=opts.timestampRequests;this.transports=opts.transports||["polling","websocket"];this.readyState="";this.writeBuffer=[];this.callbackBuffer=[];this.policyPort=opts.policyPort||843;this.rememberUpgrade=opts.rememberUpgrade||false;this.binaryType=null;this.onlyBinaryUpgrades=opts.onlyBinaryUpgrades;this.pfx=opts.pfx||null;this.key=opts.key||null;this.passphrase=opts.passphrase||null;this.cert=opts.cert||null;this.ca=opts.ca||null;this.ciphers=opts.ciphers||null;this.rejectUnauthorized=opts.rejectUnauthorized||null;this.open()}Socket.priorWebsocketSuccess=false;Emitter(Socket.prototype);Socket.protocol=parser.protocol;Socket.Socket=Socket;Socket.Transport=_dereq_("./transport");Socket.transports=_dereq_("./transports");Socket.parser=_dereq_("engine.io-parser");Socket.prototype.createTransport=function(name){debug('creating transport "%s"',name);var query=clone(this.query);query.EIO=parser.protocol;query.transport=name;if(this.id)query.sid=this.id;var transport=new transports[name]({agent:this.agent,hostname:this.hostname,port:this.port,secure:this.secure,path:this.path,query:query,forceJSONP:this.forceJSONP,jsonp:this.jsonp,forceBase64:this.forceBase64,enablesXDR:this.enablesXDR,timestampRequests:this.timestampRequests,timestampParam:this.timestampParam,policyPort:this.policyPort,socket:this,pfx:this.pfx,key:this.key,passphrase:this.passphrase,cert:this.cert,ca:this.ca,ciphers:this.ciphers,rejectUnauthorized:this.rejectUnauthorized});return transport};function clone(obj){var o={};for(var i in obj){if(obj.hasOwnProperty(i)){o[i]=obj[i]}}return o}Socket.prototype.open=function(){var transport;if(this.rememberUpgrade&&Socket.priorWebsocketSuccess&&this.transports.indexOf("websocket")!=-1){transport="websocket"}else if(0==this.transports.length){var self=this;setTimeout(function(){self.emit("error","No transports available")},0);return}else{transport=this.transports[0]}this.readyState="opening";var transport;try{transport=this.createTransport(transport)}catch(e){this.transports.shift();this.open();return}transport.open();this.setTransport(transport)};Socket.prototype.setTransport=function(transport){debug("setting transport %s",transport.name);var self=this;if(this.transport){debug("clearing existing transport %s",this.transport.name);this.transport.removeAllListeners()}this.transport=transport;transport.on("drain",function(){self.onDrain()}).on("packet",function(packet){self.onPacket(packet)}).on("error",function(e){self.onError(e)}).on("close",function(){self.onClose("transport close")})};Socket.prototype.probe=function(name){debug('probing transport "%s"',name);var transport=this.createTransport(name,{probe:1}),failed=false,self=this;Socket.priorWebsocketSuccess=false;function onTransportOpen(){if(self.onlyBinaryUpgrades){var upgradeLosesBinary=!this.supportsBinary&&self.transport.supportsBinary;failed=failed||upgradeLosesBinary}if(failed)return;debug('probe transport "%s" opened',name);transport.send([{type:"ping",data:"probe"}]);transport.once("packet",function(msg){if(failed)return;if("pong"==msg.type&&"probe"==msg.data){debug('probe transport "%s" pong',name);self.upgrading=true;self.emit("upgrading",transport);if(!transport)return;Socket.priorWebsocketSuccess="websocket"==transport.name;debug('pausing current transport "%s"',self.transport.name);self.transport.pause(function(){if(failed)return;if("closed"==self.readyState)return;debug("changing transport and sending upgrade packet");cleanup();self.setTransport(transport);transport.send([{type:"upgrade"}]);self.emit("upgrade",transport);transport=null;self.upgrading=false;self.flush()})}else{debug('probe transport "%s" failed',name);var err=new Error("probe error");err.transport=transport.name;self.emit("upgradeError",err)}})}function freezeTransport(){if(failed)return;failed=true;cleanup();transport.close();transport=null}function onerror(err){var error=new Error("probe error: "+err);error.transport=transport.name;freezeTransport();debug('probe transport "%s" failed because of error: %s',name,err);self.emit("upgradeError",error)}function onTransportClose(){onerror("transport closed")}function onclose(){onerror("socket closed")}function onupgrade(to){if(transport&&to.name!=transport.name){debug('"%s" works - aborting "%s"',to.name,transport.name);freezeTransport()}}function cleanup(){transport.removeListener("open",onTransportOpen);transport.removeListener("error",onerror);transport.removeListener("close",onTransportClose);self.removeListener("close",onclose);self.removeListener("upgrading",onupgrade)}transport.once("open",onTransportOpen);transport.once("error",onerror);transport.once("close",onTransportClose);this.once("close",onclose);this.once("upgrading",onupgrade);transport.open()};Socket.prototype.onOpen=function(){debug("socket open");this.readyState="open";Socket.priorWebsocketSuccess="websocket"==this.transport.name;this.emit("open");this.flush();if("open"==this.readyState&&this.upgrade&&this.transport.pause){debug("starting upgrade probes");for(var i=0,l=this.upgrades.length;i<l;i++){this.probe(this.upgrades[i])}}};Socket.prototype.onPacket=function(packet){if("opening"==this.readyState||"open"==this.readyState){debug('socket receive: type "%s", data "%s"',packet.type,packet.data);this.emit("packet",packet);this.emit("heartbeat");switch(packet.type){case"open":this.onHandshake(parsejson(packet.data));break;case"pong":this.setPing();break;case"error":var err=new Error("server error");err.code=packet.data;this.emit("error",err);break;case"message":this.emit("data",packet.data);this.emit("message",packet.data);break}}else{debug('packet received with socket readyState "%s"',this.readyState)}};Socket.prototype.onHandshake=function(data){this.emit("handshake",data);this.id=data.sid;this.transport.query.sid=data.sid;this.upgrades=this.filterUpgrades(data.upgrades);this.pingInterval=data.pingInterval;this.pingTimeout=data.pingTimeout;this.onOpen();if("closed"==this.readyState)return;this.setPing();this.removeListener("heartbeat",this.onHeartbeat);this.on("heartbeat",this.onHeartbeat)};Socket.prototype.onHeartbeat=function(timeout){clearTimeout(this.pingTimeoutTimer);var self=this;self.pingTimeoutTimer=setTimeout(function(){if("closed"==self.readyState)return;self.onClose("ping timeout")},timeout||self.pingInterval+self.pingTimeout)};Socket.prototype.setPing=function(){var self=this;clearTimeout(self.pingIntervalTimer);self.pingIntervalTimer=setTimeout(function(){debug("writing ping packet - expecting pong within %sms",self.pingTimeout);self.ping();self.onHeartbeat(self.pingTimeout)},self.pingInterval)};Socket.prototype.ping=function(){this.sendPacket("ping")};Socket.prototype.onDrain=function(){for(var i=0;i<this.prevBufferLen;i++){if(this.callbackBuffer[i]){this.callbackBuffer[i]()}}this.writeBuffer.splice(0,this.prevBufferLen);this.callbackBuffer.splice(0,this.prevBufferLen);this.prevBufferLen=0;if(this.writeBuffer.length==0){this.emit("drain")}else{this.flush()}};Socket.prototype.flush=function(){if("closed"!=this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){debug("flushing %d packets in socket",this.writeBuffer.length);this.transport.send(this.writeBuffer);this.prevBufferLen=this.writeBuffer.length;this.emit("flush")}};Socket.prototype.write=Socket.prototype.send=function(msg,fn){this.sendPacket("message",msg,fn);return this};Socket.prototype.sendPacket=function(type,data,fn){if("closing"==this.readyState||"closed"==this.readyState){return}var packet={type:type,data:data};this.emit("packetCreate",packet);this.writeBuffer.push(packet);this.callbackBuffer.push(fn);this.flush()};Socket.prototype.close=function(){if("opening"==this.readyState||"open"==this.readyState){this.readyState="closing";var self=this;function close(){self.onClose("forced close");debug("socket closing - telling transport to close");self.transport.close()}function cleanupAndClose(){self.removeListener("upgrade",cleanupAndClose);self.removeListener("upgradeError",cleanupAndClose);close()}function waitForUpgrade(){self.once("upgrade",cleanupAndClose);self.once("upgradeError",cleanupAndClose)}if(this.writeBuffer.length){this.once("drain",function(){if(this.upgrading){waitForUpgrade()}else{close()}})}else if(this.upgrading){waitForUpgrade()}else{close()}}return this};Socket.prototype.onError=function(err){debug("socket error %j",err);Socket.priorWebsocketSuccess=false;this.emit("error",err);this.onClose("transport error",err)};Socket.prototype.onClose=function(reason,desc){if("opening"==this.readyState||"open"==this.readyState||"closing"==this.readyState){debug('socket close with reason: "%s"',reason);var self=this;clearTimeout(this.pingIntervalTimer);clearTimeout(this.pingTimeoutTimer);setTimeout(function(){self.writeBuffer=[];self.callbackBuffer=[];self.prevBufferLen=0},0);this.transport.removeAllListeners("close");this.transport.close();this.transport.removeAllListeners();this.readyState="closed";this.id=null;this.emit("close",reason,desc)}};Socket.prototype.filterUpgrades=function(upgrades){var filteredUpgrades=[];for(var i=0,j=upgrades.length;i<j;i++){if(~index(this.transports,upgrades[i]))filteredUpgrades.push(upgrades[i])}return filteredUpgrades}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./transport":14,"./transports":15,"component-emitter":9,debug:22,"engine.io-parser":25,indexof:42,parsejson:34,parseqs:35,parseuri:36}],14:[function(_dereq_,module,exports){var parser=_dereq_("engine.io-parser");var Emitter=_dereq_("component-emitter");module.exports=Transport;function Transport(opts){this.path=opts.path;this.hostname=opts.hostname;this.port=opts.port;this.secure=opts.secure;this.query=opts.query;this.timestampParam=opts.timestampParam;this.timestampRequests=opts.timestampRequests;this.readyState="";this.agent=opts.agent||false;this.socket=opts.socket;this.enablesXDR=opts.enablesXDR;this.pfx=opts.pfx;this.key=opts.key;this.passphrase=opts.passphrase;this.cert=opts.cert;this.ca=opts.ca;this.ciphers=opts.ciphers;this.rejectUnauthorized=opts.rejectUnauthorized}Emitter(Transport.prototype);Transport.timestamps=0;Transport.prototype.onError=function(msg,desc){var err=new Error(msg);err.type="TransportError";err.description=desc;this.emit("error",err);return this};Transport.prototype.open=function(){if("closed"==this.readyState||""==this.readyState){this.readyState="opening";this.doOpen()}return this};Transport.prototype.close=function(){if("opening"==this.readyState||"open"==this.readyState){this.doClose();this.onClose()}return this};Transport.prototype.send=function(packets){if("open"==this.readyState){this.write(packets)}else{throw new Error("Transport not open")}};Transport.prototype.onOpen=function(){this.readyState="open";this.writable=true;this.emit("open")};Transport.prototype.onData=function(data){var packet=parser.decodePacket(data,this.socket.binaryType);this.onPacket(packet)};Transport.prototype.onPacket=function(packet){this.emit("packet",packet)};Transport.prototype.onClose=function(){this.readyState="closed";this.emit("close")}},{"component-emitter":9,"engine.io-parser":25}],15:[function(_dereq_,module,exports){(function(global){var XMLHttpRequest=_dereq_("xmlhttprequest");var XHR=_dereq_("./polling-xhr");var JSONP=_dereq_("./polling-jsonp");var websocket=_dereq_("./websocket");exports.polling=polling;exports.websocket=websocket;function polling(opts){var xhr;var xd=false;var xs=false;var jsonp=false!==opts.jsonp;if(global.location){var isSSL="https:"==location.protocol;var port=location.port;if(!port){port=isSSL?443:80}xd=opts.hostname!=location.hostname||port!=opts.port;xs=opts.secure!=isSSL}opts.xdomain=xd;opts.xscheme=xs;xhr=new XMLHttpRequest(opts);if("open"in xhr&&!opts.forceJSONP){return new XHR(opts)}else{if(!jsonp)throw new Error("JSONP disabled");return new JSONP(opts)}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./polling-jsonp":16,"./polling-xhr":17,"./websocket":19,xmlhttprequest:20}],16:[function(_dereq_,module,exports){(function(global){var Polling=_dereq_("./polling");var inherit=_dereq_("component-inherit");module.exports=JSONPPolling;var rNewline=/\n/g;var rEscapedNewline=/\\n/g;var callbacks;var index=0;function empty(){}function JSONPPolling(opts){Polling.call(this,opts);
this.query=this.query||{};if(!callbacks){if(!global.___eio)global.___eio=[];callbacks=global.___eio}this.index=callbacks.length;var self=this;callbacks.push(function(msg){self.onData(msg)});this.query.j=this.index;if(global.document&&global.addEventListener){global.addEventListener("beforeunload",function(){if(self.script)self.script.onerror=empty},false)}}inherit(JSONPPolling,Polling);JSONPPolling.prototype.supportsBinary=false;JSONPPolling.prototype.doClose=function(){if(this.script){this.script.parentNode.removeChild(this.script);this.script=null}if(this.form){this.form.parentNode.removeChild(this.form);this.form=null;this.iframe=null}Polling.prototype.doClose.call(this)};JSONPPolling.prototype.doPoll=function(){var self=this;var script=document.createElement("script");if(this.script){this.script.parentNode.removeChild(this.script);this.script=null}script.async=true;script.src=this.uri();script.onerror=function(e){self.onError("jsonp poll error",e)};var insertAt=document.getElementsByTagName("script")[0];insertAt.parentNode.insertBefore(script,insertAt);this.script=script;var isUAgecko="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);if(isUAgecko){setTimeout(function(){var iframe=document.createElement("iframe");document.body.appendChild(iframe);document.body.removeChild(iframe)},100)}};JSONPPolling.prototype.doWrite=function(data,fn){var self=this;if(!this.form){var form=document.createElement("form");var area=document.createElement("textarea");var id=this.iframeId="eio_iframe_"+this.index;var iframe;form.className="socketio";form.style.position="absolute";form.style.top="-1000px";form.style.left="-1000px";form.target=id;form.method="POST";form.setAttribute("accept-charset","utf-8");area.name="d";form.appendChild(area);document.body.appendChild(form);this.form=form;this.area=area}this.form.action=this.uri();function complete(){initIframe();fn()}function initIframe(){if(self.iframe){try{self.form.removeChild(self.iframe)}catch(e){self.onError("jsonp polling iframe removal error",e)}}try{var html='<iframe src="javascript:0" name="'+self.iframeId+'">';iframe=document.createElement(html)}catch(e){iframe=document.createElement("iframe");iframe.name=self.iframeId;iframe.src="javascript:0"}iframe.id=self.iframeId;self.form.appendChild(iframe);self.iframe=iframe}initIframe();data=data.replace(rEscapedNewline,"\\\n");this.area.value=data.replace(rNewline,"\\n");try{this.form.submit()}catch(e){}if(this.iframe.attachEvent){this.iframe.onreadystatechange=function(){if(self.iframe.readyState=="complete"){complete()}}}else{this.iframe.onload=complete}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./polling":18,"component-inherit":21}],17:[function(_dereq_,module,exports){(function(global){var XMLHttpRequest=_dereq_("xmlhttprequest");var Polling=_dereq_("./polling");var Emitter=_dereq_("component-emitter");var inherit=_dereq_("component-inherit");var debug=_dereq_("debug")("engine.io-client:polling-xhr");module.exports=XHR;module.exports.Request=Request;function empty(){}function XHR(opts){Polling.call(this,opts);if(global.location){var isSSL="https:"==location.protocol;var port=location.port;if(!port){port=isSSL?443:80}this.xd=opts.hostname!=global.location.hostname||port!=opts.port;this.xs=opts.secure!=isSSL}}inherit(XHR,Polling);XHR.prototype.supportsBinary=true;XHR.prototype.request=function(opts){opts=opts||{};opts.uri=this.uri();opts.xd=this.xd;opts.xs=this.xs;opts.agent=this.agent||false;opts.supportsBinary=this.supportsBinary;opts.enablesXDR=this.enablesXDR;opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;return new Request(opts)};XHR.prototype.doWrite=function(data,fn){var isBinary=typeof data!=="string"&&data!==undefined;var req=this.request({method:"POST",data:data,isBinary:isBinary});var self=this;req.on("success",fn);req.on("error",function(err){self.onError("xhr post error",err)});this.sendXhr=req};XHR.prototype.doPoll=function(){debug("xhr poll");var req=this.request();var self=this;req.on("data",function(data){self.onData(data)});req.on("error",function(err){self.onError("xhr poll error",err)});this.pollXhr=req};function Request(opts){this.method=opts.method||"GET";this.uri=opts.uri;this.xd=!!opts.xd;this.xs=!!opts.xs;this.async=false!==opts.async;this.data=undefined!=opts.data?opts.data:null;this.agent=opts.agent;this.isBinary=opts.isBinary;this.supportsBinary=opts.supportsBinary;this.enablesXDR=opts.enablesXDR;this.pfx=opts.pfx;this.key=opts.key;this.passphrase=opts.passphrase;this.cert=opts.cert;this.ca=opts.ca;this.ciphers=opts.ciphers;this.rejectUnauthorized=opts.rejectUnauthorized;this.create()}Emitter(Request.prototype);Request.prototype.create=function(){var opts={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;var xhr=this.xhr=new XMLHttpRequest(opts);var self=this;try{debug("xhr open %s: %s",this.method,this.uri);xhr.open(this.method,this.uri,this.async);if(this.supportsBinary){xhr.responseType="arraybuffer"}if("POST"==this.method){try{if(this.isBinary){xhr.setRequestHeader("Content-type","application/octet-stream")}else{xhr.setRequestHeader("Content-type","text/plain;charset=UTF-8")}}catch(e){}}if("withCredentials"in xhr){xhr.withCredentials=true}if(this.hasXDR()){xhr.onload=function(){self.onLoad()};xhr.onerror=function(){self.onError(xhr.responseText)}}else{xhr.onreadystatechange=function(){if(4!=xhr.readyState)return;if(200==xhr.status||1223==xhr.status){self.onLoad()}else{setTimeout(function(){self.onError(xhr.status)},0)}}}debug("xhr data %s",this.data);xhr.send(this.data)}catch(e){setTimeout(function(){self.onError(e)},0);return}if(global.document){this.index=Request.requestsCount++;Request.requests[this.index]=this}};Request.prototype.onSuccess=function(){this.emit("success");this.cleanup()};Request.prototype.onData=function(data){this.emit("data",data);this.onSuccess()};Request.prototype.onError=function(err){this.emit("error",err);this.cleanup(true)};Request.prototype.cleanup=function(fromError){if("undefined"==typeof this.xhr||null===this.xhr){return}if(this.hasXDR()){this.xhr.onload=this.xhr.onerror=empty}else{this.xhr.onreadystatechange=empty}if(fromError){try{this.xhr.abort()}catch(e){}}if(global.document){delete Request.requests[this.index]}this.xhr=null};Request.prototype.onLoad=function(){var data;try{var contentType;try{contentType=this.xhr.getResponseHeader("Content-Type").split(";")[0]}catch(e){}if(contentType==="application/octet-stream"){data=this.xhr.response}else{if(!this.supportsBinary){data=this.xhr.responseText}else{data="ok"}}}catch(e){this.onError(e)}if(null!=data){this.onData(data)}};Request.prototype.hasXDR=function(){return"undefined"!==typeof global.XDomainRequest&&!this.xs&&this.enablesXDR};Request.prototype.abort=function(){this.cleanup()};if(global.document){Request.requestsCount=0;Request.requests={};if(global.attachEvent){global.attachEvent("onunload",unloadHandler)}else if(global.addEventListener){global.addEventListener("beforeunload",unloadHandler,false)}}function unloadHandler(){for(var i in Request.requests){if(Request.requests.hasOwnProperty(i)){Request.requests[i].abort()}}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./polling":18,"component-emitter":9,"component-inherit":21,debug:22,xmlhttprequest:20}],18:[function(_dereq_,module,exports){var Transport=_dereq_("../transport");var parseqs=_dereq_("parseqs");var parser=_dereq_("engine.io-parser");var inherit=_dereq_("component-inherit");var debug=_dereq_("debug")("engine.io-client:polling");module.exports=Polling;var hasXHR2=function(){var XMLHttpRequest=_dereq_("xmlhttprequest");var xhr=new XMLHttpRequest({xdomain:false});return null!=xhr.responseType}();function Polling(opts){var forceBase64=opts&&opts.forceBase64;if(!hasXHR2||forceBase64){this.supportsBinary=false}Transport.call(this,opts)}inherit(Polling,Transport);Polling.prototype.name="polling";Polling.prototype.doOpen=function(){this.poll()};Polling.prototype.pause=function(onPause){var pending=0;var self=this;this.readyState="pausing";function pause(){debug("paused");self.readyState="paused";onPause()}if(this.polling||!this.writable){var total=0;if(this.polling){debug("we are currently polling - waiting to pause");total++;this.once("pollComplete",function(){debug("pre-pause polling complete");--total||pause()})}if(!this.writable){debug("we are currently writing - waiting to pause");total++;this.once("drain",function(){debug("pre-pause writing complete");--total||pause()})}}else{pause()}};Polling.prototype.poll=function(){debug("polling");this.polling=true;this.doPoll();this.emit("poll")};Polling.prototype.onData=function(data){var self=this;debug("polling got data %s",data);var callback=function(packet,index,total){if("opening"==self.readyState){self.onOpen()}if("close"==packet.type){self.onClose();return false}self.onPacket(packet)};parser.decodePayload(data,this.socket.binaryType,callback);if("closed"!=this.readyState){this.polling=false;this.emit("pollComplete");if("open"==this.readyState){this.poll()}else{debug('ignoring poll - transport state "%s"',this.readyState)}}};Polling.prototype.doClose=function(){var self=this;function close(){debug("writing close packet");self.write([{type:"close"}])}if("open"==this.readyState){debug("transport open - closing");close()}else{debug("transport not open - deferring close");this.once("open",close)}};Polling.prototype.write=function(packets){var self=this;this.writable=false;var callbackfn=function(){self.writable=true;self.emit("drain")};var self=this;parser.encodePayload(packets,this.supportsBinary,function(data){self.doWrite(data,callbackfn)})};Polling.prototype.uri=function(){var query=this.query||{};var schema=this.secure?"https":"http";var port="";if(false!==this.timestampRequests){query[this.timestampParam]=+new Date+"-"+Transport.timestamps++}if(!this.supportsBinary&&!query.sid){query.b64=1}query=parseqs.encode(query);if(this.port&&("https"==schema&&this.port!=443||"http"==schema&&this.port!=80)){port=":"+this.port}if(query.length){query="?"+query}return schema+"://"+this.hostname+port+this.path+query}},{"../transport":14,"component-inherit":21,debug:22,"engine.io-parser":25,parseqs:35,xmlhttprequest:20}],19:[function(_dereq_,module,exports){var Transport=_dereq_("../transport");var parser=_dereq_("engine.io-parser");var parseqs=_dereq_("parseqs");var inherit=_dereq_("component-inherit");var debug=_dereq_("debug")("engine.io-client:websocket");var WebSocket=_dereq_("ws");module.exports=WS;function WS(opts){var forceBase64=opts&&opts.forceBase64;if(forceBase64){this.supportsBinary=false}Transport.call(this,opts)}inherit(WS,Transport);WS.prototype.name="websocket";WS.prototype.supportsBinary=true;WS.prototype.doOpen=function(){if(!this.check()){return}var self=this;var uri=this.uri();var protocols=void 0;var opts={agent:this.agent};opts.pfx=this.pfx;opts.key=this.key;opts.passphrase=this.passphrase;opts.cert=this.cert;opts.ca=this.ca;opts.ciphers=this.ciphers;opts.rejectUnauthorized=this.rejectUnauthorized;this.ws=new WebSocket(uri,protocols,opts);if(this.ws.binaryType===undefined){this.supportsBinary=false}this.ws.binaryType="arraybuffer";this.addEventListeners()};WS.prototype.addEventListeners=function(){var self=this;this.ws.onopen=function(){self.onOpen()};this.ws.onclose=function(){self.onClose()};this.ws.onmessage=function(ev){self.onData(ev.data)};this.ws.onerror=function(e){self.onError("websocket error",e)}};if("undefined"!=typeof navigator&&/iPad|iPhone|iPod/i.test(navigator.userAgent)){WS.prototype.onData=function(data){var self=this;setTimeout(function(){Transport.prototype.onData.call(self,data)},0)}}WS.prototype.write=function(packets){var self=this;this.writable=false;for(var i=0,l=packets.length;i<l;i++){parser.encodePacket(packets[i],this.supportsBinary,function(data){try{self.ws.send(data)}catch(e){debug("websocket closed before onclose event")}})}function ondrain(){self.writable=true;self.emit("drain")}setTimeout(ondrain,0)};WS.prototype.onClose=function(){Transport.prototype.onClose.call(this)};WS.prototype.doClose=function(){if(typeof this.ws!=="undefined"){this.ws.close()}};WS.prototype.uri=function(){var query=this.query||{};var schema=this.secure?"wss":"ws";var port="";if(this.port&&("wss"==schema&&this.port!=443||"ws"==schema&&this.port!=80)){port=":"+this.port}if(this.timestampRequests){query[this.timestampParam]=+new Date}if(!this.supportsBinary){query.b64=1}query=parseqs.encode(query);if(query.length){query="?"+query}return schema+"://"+this.hostname+port+this.path+query};WS.prototype.check=function(){return!!WebSocket&&!("__initialize"in WebSocket&&this.name===WS.prototype.name)}},{"../transport":14,"component-inherit":21,debug:22,"engine.io-parser":25,parseqs:35,ws:37}],20:[function(_dereq_,module,exports){var hasCORS=_dereq_("has-cors");module.exports=function(opts){var xdomain=opts.xdomain;var xscheme=opts.xscheme;var enablesXDR=opts.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!xdomain||hasCORS)){return new XMLHttpRequest}}catch(e){}try{if("undefined"!=typeof XDomainRequest&&!xscheme&&enablesXDR){return new XDomainRequest}}catch(e){}if(!xdomain){try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}}},{"has-cors":40}],21:[function(_dereq_,module,exports){module.exports=function(a,b){var fn=function(){};fn.prototype=b.prototype;a.prototype=new fn;a.prototype.constructor=a}},{}],22:[function(_dereq_,module,exports){exports=module.exports=_dereq_("./debug");exports.log=log;exports.formatArgs=formatArgs;exports.save=save;exports.load=load;exports.useColors=useColors;exports.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"];function useColors(){return"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}exports.formatters.j=function(v){return JSON.stringify(v)};function formatArgs(){var args=arguments;var useColors=this.useColors;args[0]=(useColors?"%c":"")+this.namespace+(useColors?" %c":" ")+args[0]+(useColors?"%c ":" ")+"+"+exports.humanize(this.diff);if(!useColors)return args;var c="color: "+this.color;args=[args[0],c,"color: inherit"].concat(Array.prototype.slice.call(args,1));var index=0;var lastC=0;args[0].replace(/%[a-z%]/g,function(match){if("%"===match)return;index++;if("%c"===match){lastC=index}});args.splice(lastC,0,c);return args}function log(){return"object"==typeof console&&"function"==typeof console.log&&Function.prototype.apply.call(console.log,console,arguments)}function save(namespaces){try{if(null==namespaces){localStorage.removeItem("debug")}else{localStorage.debug=namespaces}}catch(e){}}function load(){var r;try{r=localStorage.debug}catch(e){}return r}exports.enable(load())},{"./debug":23}],23:[function(_dereq_,module,exports){exports=module.exports=debug;exports.coerce=coerce;exports.disable=disable;exports.enable=enable;exports.enabled=enabled;exports.humanize=_dereq_("ms");exports.names=[];exports.skips=[];exports.formatters={};var prevColor=0;var prevTime;function selectColor(){return exports.colors[prevColor++%exports.colors.length]}function debug(namespace){function disabled(){}disabled.enabled=false;function enabled(){var self=enabled;var curr=+new Date;var ms=curr-(prevTime||curr);self.diff=ms;self.prev=prevTime;self.curr=curr;prevTime=curr;if(null==self.useColors)self.useColors=exports.useColors();if(null==self.color&&self.useColors)self.color=selectColor();var args=Array.prototype.slice.call(arguments);args[0]=exports.coerce(args[0]);if("string"!==typeof args[0]){args=["%o"].concat(args)}var index=0;args[0]=args[0].replace(/%([a-z%])/g,function(match,format){if(match==="%")return match;index++;var formatter=exports.formatters[format];if("function"===typeof formatter){var val=args[index];match=formatter.call(self,val);args.splice(index,1);index--}return match});if("function"===typeof exports.formatArgs){args=exports.formatArgs.apply(self,args)}var logFn=enabled.log||exports.log||console.log.bind(console);logFn.apply(self,args)}enabled.enabled=true;var fn=exports.enabled(namespace)?enabled:disabled;fn.namespace=namespace;return fn}function enable(namespaces){exports.save(namespaces);var split=(namespaces||"").split(/[\s,]+/);var len=split.length;for(var i=0;i<len;i++){if(!split[i])continue;namespaces=split[i].replace(/\*/g,".*?");if(namespaces[0]==="-"){exports.skips.push(new RegExp("^"+namespaces.substr(1)+"$"))}else{exports.names.push(new RegExp("^"+namespaces+"$"))}}}function disable(){exports.enable("")}function enabled(name){var i,len;for(i=0,len=exports.skips.length;i<len;i++){if(exports.skips[i].test(name)){return false}}for(i=0,len=exports.names.length;i<len;i++){if(exports.names[i].test(name)){return true}}return false}function coerce(val){if(val instanceof Error)return val.stack||val.message;return val}},{ms:24}],24:[function(_dereq_,module,exports){var s=1e3;var m=s*60;var h=m*60;var d=h*24;var y=d*365.25;module.exports=function(val,options){options=options||{};if("string"==typeof val)return parse(val);return options.long?long(val):short(val)};function parse(str){var match=/^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);if(!match)return;var n=parseFloat(match[1]);var type=(match[2]||"ms").toLowerCase();switch(type){case"years":case"year":case"y":return n*y;case"days":case"day":case"d":return n*d;case"hours":case"hour":case"h":return n*h;case"minutes":case"minute":case"m":return n*m;case"seconds":case"second":case"s":return n*s;case"ms":return n}}function short(ms){if(ms>=d)return Math.round(ms/d)+"d";if(ms>=h)return Math.round(ms/h)+"h";if(ms>=m)return Math.round(ms/m)+"m";if(ms>=s)return Math.round(ms/s)+"s";return ms+"ms"}function long(ms){return plural(ms,d,"day")||plural(ms,h,"hour")||plural(ms,m,"minute")||plural(ms,s,"second")||ms+" ms"}function plural(ms,n,name){if(ms<n)return;if(ms<n*1.5)return Math.floor(ms/n)+" "+name;return Math.ceil(ms/n)+" "+name+"s"}},{}],25:[function(_dereq_,module,exports){(function(global){var keys=_dereq_("./keys");var hasBinary=_dereq_("has-binary");var sliceBuffer=_dereq_("arraybuffer.slice");var base64encoder=_dereq_("base64-arraybuffer");var after=_dereq_("after");var utf8=_dereq_("utf8");var isAndroid=navigator.userAgent.match(/Android/i);var isPhantomJS=/PhantomJS/i.test(navigator.userAgent);var dontSendBlobs=isAndroid||isPhantomJS;exports.protocol=3;var packets=exports.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6};var packetslist=keys(packets);var err={type:"error",data:"parser error"};var Blob=_dereq_("blob");exports.encodePacket=function(packet,supportsBinary,utf8encode,callback){if("function"==typeof supportsBinary){callback=supportsBinary;supportsBinary=false}if("function"==typeof utf8encode){callback=utf8encode;utf8encode=null}var data=packet.data===undefined?undefined:packet.data.buffer||packet.data;if(global.ArrayBuffer&&data instanceof ArrayBuffer){return encodeArrayBuffer(packet,supportsBinary,callback)}else if(Blob&&data instanceof global.Blob){return encodeBlob(packet,supportsBinary,callback)}if(data&&data.base64){return encodeBase64Object(packet,callback)}var encoded=packets[packet.type];if(undefined!==packet.data){encoded+=utf8encode?utf8.encode(String(packet.data)):String(packet.data)}return callback(""+encoded)};function encodeBase64Object(packet,callback){var message="b"+exports.packets[packet.type]+packet.data.data;return callback(message)}function encodeArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback)}var data=packet.data;var contentArray=new Uint8Array(data);var resultBuffer=new Uint8Array(1+data.byteLength);resultBuffer[0]=packets[packet.type];for(var i=0;i<contentArray.length;i++){resultBuffer[i+1]=contentArray[i]}return callback(resultBuffer.buffer)}function encodeBlobAsArrayBuffer(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback)}var fr=new FileReader;fr.onload=function(){packet.data=fr.result;exports.encodePacket(packet,supportsBinary,true,callback)};return fr.readAsArrayBuffer(packet.data)}function encodeBlob(packet,supportsBinary,callback){if(!supportsBinary){return exports.encodeBase64Packet(packet,callback)}if(dontSendBlobs){return encodeBlobAsArrayBuffer(packet,supportsBinary,callback)}var length=new Uint8Array(1);length[0]=packets[packet.type];var blob=new Blob([length.buffer,packet.data]);return callback(blob)}exports.encodeBase64Packet=function(packet,callback){var message="b"+exports.packets[packet.type];if(Blob&&packet.data instanceof Blob){var fr=new FileReader;fr.onload=function(){var b64=fr.result.split(",")[1];callback(message+b64)};return fr.readAsDataURL(packet.data)}var b64data;try{b64data=String.fromCharCode.apply(null,new Uint8Array(packet.data))}catch(e){var typed=new Uint8Array(packet.data);var basic=new Array(typed.length);for(var i=0;i<typed.length;i++){basic[i]=typed[i]}b64data=String.fromCharCode.apply(null,basic)}message+=global.btoa(b64data);return callback(message)};exports.decodePacket=function(data,binaryType,utf8decode){if(typeof data=="string"||data===undefined){if(data.charAt(0)=="b"){return exports.decodeBase64Packet(data.substr(1),binaryType)}if(utf8decode){try{data=utf8.decode(data)}catch(e){return err}}var type=data.charAt(0);if(Number(type)!=type||!packetslist[type]){return err}if(data.length>1){return{type:packetslist[type],data:data.substring(1)}}else{return{type:packetslist[type]}}}var asArray=new Uint8Array(data);var type=asArray[0];var rest=sliceBuffer(data,1);if(Blob&&binaryType==="blob"){rest=new Blob([rest])}return{type:packetslist[type],data:rest}};exports.decodeBase64Packet=function(msg,binaryType){var type=packetslist[msg.charAt(0)];if(!global.ArrayBuffer){return{type:type,data:{base64:true,data:msg.substr(1)}}}var data=base64encoder.decode(msg.substr(1));if(binaryType==="blob"&&Blob){data=new Blob([data])}return{type:type,data:data}};exports.encodePayload=function(packets,supportsBinary,callback){if(typeof supportsBinary=="function"){callback=supportsBinary;supportsBinary=null}var isBinary=hasBinary(packets);if(supportsBinary&&isBinary){if(Blob&&!dontSendBlobs){return exports.encodePayloadAsBlob(packets,callback)}return exports.encodePayloadAsArrayBuffer(packets,callback)}if(!packets.length){return callback("0:")}function setLengthHeader(message){return message.length+":"+message}function encodeOne(packet,doneCallback){exports.encodePacket(packet,!isBinary?false:supportsBinary,true,function(message){doneCallback(null,setLengthHeader(message))})}map(packets,encodeOne,function(err,results){return callback(results.join(""))})};function map(ary,each,done){var result=new Array(ary.length);var next=after(ary.length,done);var eachWithIndex=function(i,el,cb){each(el,function(error,msg){result[i]=msg;cb(error,result)})};for(var i=0;i<ary.length;i++){eachWithIndex(i,ary[i],next)}}exports.decodePayload=function(data,binaryType,callback){if(typeof data!="string"){return exports.decodePayloadAsBinary(data,binaryType,callback)}if(typeof binaryType==="function"){callback=binaryType;binaryType=null}var packet;if(data==""){return callback(err,0,1)}var length="",n,msg;for(var i=0,l=data.length;i<l;i++){var chr=data.charAt(i);if(":"!=chr){length+=chr}else{if(""==length||length!=(n=Number(length))){return callback(err,0,1)}msg=data.substr(i+1,n);if(length!=msg.length){return callback(err,0,1)}if(msg.length){packet=exports.decodePacket(msg,binaryType,true);if(err.type==packet.type&&err.data==packet.data){return callback(err,0,1)}var ret=callback(packet,i+n,l);if(false===ret)return}i+=n;length=""}}if(length!=""){return callback(err,0,1)}};exports.encodePayloadAsArrayBuffer=function(packets,callback){if(!packets.length){return callback(new ArrayBuffer(0))}function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(data){return doneCallback(null,data)})}map(packets,encodeOne,function(err,encodedPackets){var totalLength=encodedPackets.reduce(function(acc,p){var len;if(typeof p==="string"){len=p.length}else{len=p.byteLength}return acc+len.toString().length+len+2},0);var resultArray=new Uint8Array(totalLength);var bufferIndex=0;encodedPackets.forEach(function(p){var isString=typeof p==="string";var ab=p;if(isString){var view=new Uint8Array(p.length);for(var i=0;i<p.length;i++){view[i]=p.charCodeAt(i)}ab=view.buffer}if(isString){resultArray[bufferIndex++]=0}else{resultArray[bufferIndex++]=1}var lenStr=ab.byteLength.toString();for(var i=0;i<lenStr.length;i++){resultArray[bufferIndex++]=parseInt(lenStr[i])}resultArray[bufferIndex++]=255;var view=new Uint8Array(ab);for(var i=0;i<view.length;i++){resultArray[bufferIndex++]=view[i]}});return callback(resultArray.buffer)})};exports.encodePayloadAsBlob=function(packets,callback){function encodeOne(packet,doneCallback){exports.encodePacket(packet,true,true,function(encoded){var binaryIdentifier=new Uint8Array(1);binaryIdentifier[0]=1;if(typeof encoded==="string"){var view=new Uint8Array(encoded.length);for(var i=0;i<encoded.length;i++){view[i]=encoded.charCodeAt(i)}encoded=view.buffer;binaryIdentifier[0]=0}var len=encoded instanceof ArrayBuffer?encoded.byteLength:encoded.size;var lenStr=len.toString();var lengthAry=new Uint8Array(lenStr.length+1);for(var i=0;i<lenStr.length;i++){lengthAry[i]=parseInt(lenStr[i])}lengthAry[lenStr.length]=255;if(Blob){var blob=new Blob([binaryIdentifier.buffer,lengthAry.buffer,encoded]);doneCallback(null,blob)}})}map(packets,encodeOne,function(err,results){return callback(new Blob(results))})};exports.decodePayloadAsBinary=function(data,binaryType,callback){if(typeof binaryType==="function"){callback=binaryType;binaryType=null}var bufferTail=data;var buffers=[];var numberTooLong=false;while(bufferTail.byteLength>0){var tailArray=new Uint8Array(bufferTail);var isString=tailArray[0]===0;var msgLength="";for(var i=1;;i++){if(tailArray[i]==255)break;if(msgLength.length>310){numberTooLong=true;break}msgLength+=tailArray[i]}if(numberTooLong)return callback(err,0,1);bufferTail=sliceBuffer(bufferTail,2+msgLength.length);msgLength=parseInt(msgLength);var msg=sliceBuffer(bufferTail,0,msgLength);if(isString){try{msg=String.fromCharCode.apply(null,new Uint8Array(msg))}catch(e){var typed=new Uint8Array(msg);msg="";for(var i=0;i<typed.length;i++){msg+=String.fromCharCode(typed[i])}}}buffers.push(msg);bufferTail=sliceBuffer(bufferTail,msgLength)}var total=buffers.length;buffers.forEach(function(buffer,i){callback(exports.decodePacket(buffer,binaryType,true),i,total)})}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./keys":26,after:27,"arraybuffer.slice":28,"base64-arraybuffer":29,blob:30,"has-binary":31,utf8:33}],26:[function(_dereq_,module,exports){module.exports=Object.keys||function keys(obj){var arr=[];var has=Object.prototype.hasOwnProperty;for(var i in obj){if(has.call(obj,i)){arr.push(i)}}return arr}},{}],27:[function(_dereq_,module,exports){module.exports=after;function after(count,callback,err_cb){var bail=false;err_cb=err_cb||noop;proxy.count=count;return count===0?callback():proxy;function proxy(err,result){if(proxy.count<=0){throw new Error("after called too many times")}--proxy.count;if(err){bail=true;callback(err);callback=err_cb}else if(proxy.count===0&&!bail){callback(null,result)}}}function noop(){}},{}],28:[function(_dereq_,module,exports){module.exports=function(arraybuffer,start,end){var bytes=arraybuffer.byteLength;start=start||0;end=end||bytes;if(arraybuffer.slice){return arraybuffer.slice(start,end)}if(start<0){start+=bytes}if(end<0){end+=bytes}if(end>bytes){end=bytes}if(start>=bytes||start>=end||bytes===0){return new ArrayBuffer(0)}var abv=new Uint8Array(arraybuffer);var result=new Uint8Array(end-start);for(var i=start,ii=0;i<end;i++,ii++){result[ii]=abv[i]}return result.buffer}},{}],29:[function(_dereq_,module,exports){(function(chars){"use strict";exports.encode=function(arraybuffer){var bytes=new Uint8Array(arraybuffer),i,len=bytes.length,base64="";for(i=0;i<len;i+=3){base64+=chars[bytes[i]>>2];base64+=chars[(bytes[i]&3)<<4|bytes[i+1]>>4];base64+=chars[(bytes[i+1]&15)<<2|bytes[i+2]>>6];base64+=chars[bytes[i+2]&63]}if(len%3===2){base64=base64.substring(0,base64.length-1)+"="}else if(len%3===1){base64=base64.substring(0,base64.length-2)+"=="}return base64};exports.decode=function(base64){var bufferLength=base64.length*.75,len=base64.length,i,p=0,encoded1,encoded2,encoded3,encoded4;if(base64[base64.length-1]==="="){bufferLength--;if(base64[base64.length-2]==="="){bufferLength--}}var arraybuffer=new ArrayBuffer(bufferLength),bytes=new Uint8Array(arraybuffer);for(i=0;i<len;i+=4){encoded1=chars.indexOf(base64[i]);encoded2=chars.indexOf(base64[i+1]);encoded3=chars.indexOf(base64[i+2]);encoded4=chars.indexOf(base64[i+3]);bytes[p++]=encoded1<<2|encoded2>>4;bytes[p++]=(encoded2&15)<<4|encoded3>>2;bytes[p++]=(encoded3&3)<<6|encoded4&63}return arraybuffer}})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")},{}],30:[function(_dereq_,module,exports){(function(global){var BlobBuilder=global.BlobBuilder||global.WebKitBlobBuilder||global.MSBlobBuilder||global.MozBlobBuilder;var blobSupported=function(){try{var b=new Blob(["hi"]);return b.size==2}catch(e){return false}}();var blobBuilderSupported=BlobBuilder&&BlobBuilder.prototype.append&&BlobBuilder.prototype.getBlob;function BlobBuilderConstructor(ary,options){options=options||{};var bb=new BlobBuilder;for(var i=0;i<ary.length;i++){bb.append(ary[i])}return options.type?bb.getBlob(options.type):bb.getBlob()}module.exports=function(){if(blobSupported){return global.Blob}else if(blobBuilderSupported){return BlobBuilderConstructor}else{return undefined}}()}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],31:[function(_dereq_,module,exports){(function(global){var isArray=_dereq_("isarray");module.exports=hasBinary;function hasBinary(data){function _hasBinary(obj){if(!obj)return false;if(global.Buffer&&global.Buffer.isBuffer(obj)||global.ArrayBuffer&&obj instanceof ArrayBuffer||global.Blob&&obj instanceof Blob||global.File&&obj instanceof File){return true}if(isArray(obj)){for(var i=0;i<obj.length;i++){if(_hasBinary(obj[i])){return true}}}else if(obj&&"object"==typeof obj){if(obj.toJSON){obj=obj.toJSON()}for(var key in obj){if(obj.hasOwnProperty(key)&&_hasBinary(obj[key])){return true}}}return false}return _hasBinary(data)}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{isarray:32}],32:[function(_dereq_,module,exports){module.exports=Array.isArray||function(arr){return Object.prototype.toString.call(arr)=="[object Array]"}},{}],33:[function(_dereq_,module,exports){(function(global){(function(root){var freeExports=typeof exports=="object"&&exports;var freeModule=typeof module=="object"&&module&&module.exports==freeExports&&module;var freeGlobal=typeof global=="object"&&global;if(freeGlobal.global===freeGlobal||freeGlobal.window===freeGlobal){root=freeGlobal}var stringFromCharCode=String.fromCharCode;function ucs2decode(string){var output=[];var counter=0;var length=string.length;var value;var extra;while(counter<length){value=string.charCodeAt(counter++);if(value>=55296&&value<=56319&&counter<length){extra=string.charCodeAt(counter++);if((extra&64512)==56320){output.push(((value&1023)<<10)+(extra&1023)+65536)}else{output.push(value);counter--}}else{output.push(value)}}return output}function ucs2encode(array){var length=array.length;var index=-1;var value;var output="";while(++index<length){value=array[index];if(value>65535){value-=65536;
output+=stringFromCharCode(value>>>10&1023|55296);value=56320|value&1023}output+=stringFromCharCode(value)}return output}function createByte(codePoint,shift){return stringFromCharCode(codePoint>>shift&63|128)}function encodeCodePoint(codePoint){if((codePoint&4294967168)==0){return stringFromCharCode(codePoint)}var symbol="";if((codePoint&4294965248)==0){symbol=stringFromCharCode(codePoint>>6&31|192)}else if((codePoint&4294901760)==0){symbol=stringFromCharCode(codePoint>>12&15|224);symbol+=createByte(codePoint,6)}else if((codePoint&4292870144)==0){symbol=stringFromCharCode(codePoint>>18&7|240);symbol+=createByte(codePoint,12);symbol+=createByte(codePoint,6)}symbol+=stringFromCharCode(codePoint&63|128);return symbol}function utf8encode(string){var codePoints=ucs2decode(string);var length=codePoints.length;var index=-1;var codePoint;var byteString="";while(++index<length){codePoint=codePoints[index];byteString+=encodeCodePoint(codePoint)}return byteString}function readContinuationByte(){if(byteIndex>=byteCount){throw Error("Invalid byte index")}var continuationByte=byteArray[byteIndex]&255;byteIndex++;if((continuationByte&192)==128){return continuationByte&63}throw Error("Invalid continuation byte")}function decodeSymbol(){var byte1;var byte2;var byte3;var byte4;var codePoint;if(byteIndex>byteCount){throw Error("Invalid byte index")}if(byteIndex==byteCount){return false}byte1=byteArray[byteIndex]&255;byteIndex++;if((byte1&128)==0){return byte1}if((byte1&224)==192){var byte2=readContinuationByte();codePoint=(byte1&31)<<6|byte2;if(codePoint>=128){return codePoint}else{throw Error("Invalid continuation byte")}}if((byte1&240)==224){byte2=readContinuationByte();byte3=readContinuationByte();codePoint=(byte1&15)<<12|byte2<<6|byte3;if(codePoint>=2048){return codePoint}else{throw Error("Invalid continuation byte")}}if((byte1&248)==240){byte2=readContinuationByte();byte3=readContinuationByte();byte4=readContinuationByte();codePoint=(byte1&15)<<18|byte2<<12|byte3<<6|byte4;if(codePoint>=65536&&codePoint<=1114111){return codePoint}}throw Error("Invalid UTF-8 detected")}var byteArray;var byteCount;var byteIndex;function utf8decode(byteString){byteArray=ucs2decode(byteString);byteCount=byteArray.length;byteIndex=0;var codePoints=[];var tmp;while((tmp=decodeSymbol())!==false){codePoints.push(tmp)}return ucs2encode(codePoints)}var utf8={version:"2.0.0",encode:utf8encode,decode:utf8decode};if(typeof define=="function"&&typeof define.amd=="object"&&define.amd){define(function(){return utf8})}else if(freeExports&&!freeExports.nodeType){if(freeModule){freeModule.exports=utf8}else{var object={};var hasOwnProperty=object.hasOwnProperty;for(var key in utf8){hasOwnProperty.call(utf8,key)&&(freeExports[key]=utf8[key])}}}else{root.utf8=utf8}})(this)}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],34:[function(_dereq_,module,exports){(function(global){var rvalidchars=/^[\],:{}\s]*$/;var rvalidescape=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;var rvalidtokens=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;var rvalidbraces=/(?:^|:|,)(?:\s*\[)+/g;var rtrimLeft=/^\s+/;var rtrimRight=/\s+$/;module.exports=function parsejson(data){if("string"!=typeof data||!data){return null}data=data.replace(rtrimLeft,"").replace(rtrimRight,"");if(global.JSON&&JSON.parse){return JSON.parse(data)}if(rvalidchars.test(data.replace(rvalidescape,"@").replace(rvalidtokens,"]").replace(rvalidbraces,""))){return new Function("return "+data)()}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],35:[function(_dereq_,module,exports){exports.encode=function(obj){var str="";for(var i in obj){if(obj.hasOwnProperty(i)){if(str.length)str+="&";str+=encodeURIComponent(i)+"="+encodeURIComponent(obj[i])}}return str};exports.decode=function(qs){var qry={};var pairs=qs.split("&");for(var i=0,l=pairs.length;i<l;i++){var pair=pairs[i].split("=");qry[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1])}return qry}},{}],36:[function(_dereq_,module,exports){var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];module.exports=function parseuri(str){var src=str,b=str.indexOf("["),e=str.indexOf("]");if(b!=-1&&e!=-1){str=str.substring(0,b)+str.substring(b,e).replace(/:/g,";")+str.substring(e,str.length)}var m=re.exec(str||""),uri={},i=14;while(i--){uri[parts[i]]=m[i]||""}if(b!=-1&&e!=-1){uri.source=src;uri.host=uri.host.substring(1,uri.host.length-1).replace(/;/g,":");uri.authority=uri.authority.replace("[","").replace("]","").replace(/;/g,":");uri.ipv6uri=true}return uri}},{}],37:[function(_dereq_,module,exports){var global=function(){return this}();var WebSocket=global.WebSocket||global.MozWebSocket;module.exports=WebSocket?ws:null;function ws(uri,protocols,opts){var instance;if(protocols){instance=new WebSocket(uri,protocols)}else{instance=new WebSocket(uri)}return instance}if(WebSocket)ws.prototype=WebSocket.prototype},{}],38:[function(_dereq_,module,exports){(function(global){var isArray=_dereq_("isarray");module.exports=hasBinary;function hasBinary(data){function _hasBinary(obj){if(!obj)return false;if(global.Buffer&&global.Buffer.isBuffer(obj)||global.ArrayBuffer&&obj instanceof ArrayBuffer||global.Blob&&obj instanceof Blob||global.File&&obj instanceof File){return true}if(isArray(obj)){for(var i=0;i<obj.length;i++){if(_hasBinary(obj[i])){return true}}}else if(obj&&"object"==typeof obj){if(obj.toJSON){obj=obj.toJSON()}for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)&&_hasBinary(obj[key])){return true}}}return false}return _hasBinary(data)}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{isarray:39}],39:[function(_dereq_,module,exports){module.exports=_dereq_(32)},{}],40:[function(_dereq_,module,exports){var global=_dereq_("global");try{module.exports="XMLHttpRequest"in global&&"withCredentials"in new global.XMLHttpRequest}catch(err){module.exports=false}},{global:41}],41:[function(_dereq_,module,exports){module.exports=function(){return this}()},{}],42:[function(_dereq_,module,exports){var indexOf=[].indexOf;module.exports=function(arr,obj){if(indexOf)return arr.indexOf(obj);for(var i=0;i<arr.length;++i){if(arr[i]===obj)return i}return-1}},{}],43:[function(_dereq_,module,exports){var has=Object.prototype.hasOwnProperty;exports.keys=Object.keys||function(obj){var keys=[];for(var key in obj){if(has.call(obj,key)){keys.push(key)}}return keys};exports.values=function(obj){var vals=[];for(var key in obj){if(has.call(obj,key)){vals.push(obj[key])}}return vals};exports.merge=function(a,b){for(var key in b){if(has.call(b,key)){a[key]=b[key]}}return a};exports.length=function(obj){return exports.keys(obj).length};exports.isEmpty=function(obj){return 0==exports.length(obj)}},{}],44:[function(_dereq_,module,exports){var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];module.exports=function parseuri(str){var m=re.exec(str||""),uri={},i=14;while(i--){uri[parts[i]]=m[i]||""}return uri}},{}],45:[function(_dereq_,module,exports){(function(global){var isArray=_dereq_("isarray");var isBuf=_dereq_("./is-buffer");exports.deconstructPacket=function(packet){var buffers=[];var packetData=packet.data;function _deconstructPacket(data){if(!data)return data;if(isBuf(data)){var placeholder={_placeholder:true,num:buffers.length};buffers.push(data);return placeholder}else if(isArray(data)){var newData=new Array(data.length);for(var i=0;i<data.length;i++){newData[i]=_deconstructPacket(data[i])}return newData}else if("object"==typeof data&&!(data instanceof Date)){var newData={};for(var key in data){newData[key]=_deconstructPacket(data[key])}return newData}return data}var pack=packet;pack.data=_deconstructPacket(packetData);pack.attachments=buffers.length;return{packet:pack,buffers:buffers}};exports.reconstructPacket=function(packet,buffers){var curPlaceHolder=0;function _reconstructPacket(data){if(data&&data._placeholder){var buf=buffers[data.num];return buf}else if(isArray(data)){for(var i=0;i<data.length;i++){data[i]=_reconstructPacket(data[i])}return data}else if(data&&"object"==typeof data){for(var key in data){data[key]=_reconstructPacket(data[key])}return data}return data}packet.data=_reconstructPacket(packet.data);packet.attachments=undefined;return packet};exports.removeBlobs=function(data,callback){function _removeBlobs(obj,curKey,containingObject){if(!obj)return obj;if(global.Blob&&obj instanceof Blob||global.File&&obj instanceof File){pendingBlobs++;var fileReader=new FileReader;fileReader.onload=function(){if(containingObject){containingObject[curKey]=this.result}else{bloblessData=this.result}if(!--pendingBlobs){callback(bloblessData)}};fileReader.readAsArrayBuffer(obj)}else if(isArray(obj)){for(var i=0;i<obj.length;i++){_removeBlobs(obj[i],i,obj)}}else if(obj&&"object"==typeof obj&&!isBuf(obj)){for(var key in obj){_removeBlobs(obj[key],key,obj)}}}var pendingBlobs=0;var bloblessData=data;_removeBlobs(bloblessData);if(!pendingBlobs){callback(bloblessData)}}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./is-buffer":47,isarray:48}],46:[function(_dereq_,module,exports){var debug=_dereq_("debug")("socket.io-parser");var json=_dereq_("json3");var isArray=_dereq_("isarray");var Emitter=_dereq_("component-emitter");var binary=_dereq_("./binary");var isBuf=_dereq_("./is-buffer");exports.protocol=4;exports.types=["CONNECT","DISCONNECT","EVENT","BINARY_EVENT","ACK","BINARY_ACK","ERROR"];exports.CONNECT=0;exports.DISCONNECT=1;exports.EVENT=2;exports.ACK=3;exports.ERROR=4;exports.BINARY_EVENT=5;exports.BINARY_ACK=6;exports.Encoder=Encoder;exports.Decoder=Decoder;function Encoder(){}Encoder.prototype.encode=function(obj,callback){debug("encoding packet %j",obj);if(exports.BINARY_EVENT==obj.type||exports.BINARY_ACK==obj.type){encodeAsBinary(obj,callback)}else{var encoding=encodeAsString(obj);callback([encoding])}};function encodeAsString(obj){var str="";var nsp=false;str+=obj.type;if(exports.BINARY_EVENT==obj.type||exports.BINARY_ACK==obj.type){str+=obj.attachments;str+="-"}if(obj.nsp&&"/"!=obj.nsp){nsp=true;str+=obj.nsp}if(null!=obj.id){if(nsp){str+=",";nsp=false}str+=obj.id}if(null!=obj.data){if(nsp)str+=",";str+=json.stringify(obj.data)}debug("encoded %j as %s",obj,str);return str}function encodeAsBinary(obj,callback){function writeEncoding(bloblessData){var deconstruction=binary.deconstructPacket(bloblessData);var pack=encodeAsString(deconstruction.packet);var buffers=deconstruction.buffers;buffers.unshift(pack);callback(buffers)}binary.removeBlobs(obj,writeEncoding)}function Decoder(){this.reconstructor=null}Emitter(Decoder.prototype);Decoder.prototype.add=function(obj){var packet;if("string"==typeof obj){packet=decodeString(obj);if(exports.BINARY_EVENT==packet.type||exports.BINARY_ACK==packet.type){this.reconstructor=new BinaryReconstructor(packet);if(this.reconstructor.reconPack.attachments===0){this.emit("decoded",packet)}}else{this.emit("decoded",packet)}}else if(isBuf(obj)||obj.base64){if(!this.reconstructor){throw new Error("got binary data when not reconstructing a packet")}else{packet=this.reconstructor.takeBinaryData(obj);if(packet){this.reconstructor=null;this.emit("decoded",packet)}}}else{throw new Error("Unknown type: "+obj)}};function decodeString(str){var p={};var i=0;p.type=Number(str.charAt(0));if(null==exports.types[p.type])return error();if(exports.BINARY_EVENT==p.type||exports.BINARY_ACK==p.type){var buf="";while(str.charAt(++i)!="-"){buf+=str.charAt(i);if(i==str.length)break}if(buf!=Number(buf)||str.charAt(i)!="-"){throw new Error("Illegal attachments")}p.attachments=Number(buf)}if("/"==str.charAt(i+1)){p.nsp="";while(++i){var c=str.charAt(i);if(","==c)break;p.nsp+=c;if(i==str.length)break}}else{p.nsp="/"}var next=str.charAt(i+1);if(""!==next&&Number(next)==next){p.id="";while(++i){var c=str.charAt(i);if(null==c||Number(c)!=c){--i;break}p.id+=str.charAt(i);if(i==str.length)break}p.id=Number(p.id)}if(str.charAt(++i)){try{p.data=json.parse(str.substr(i))}catch(e){return error()}}debug("decoded %s as %j",str,p);return p}Decoder.prototype.destroy=function(){if(this.reconstructor){this.reconstructor.finishedReconstruction()}};function BinaryReconstructor(packet){this.reconPack=packet;this.buffers=[]}BinaryReconstructor.prototype.takeBinaryData=function(binData){this.buffers.push(binData);if(this.buffers.length==this.reconPack.attachments){var packet=binary.reconstructPacket(this.reconPack,this.buffers);this.finishedReconstruction();return packet}return null};BinaryReconstructor.prototype.finishedReconstruction=function(){this.reconPack=null;this.buffers=[]};function error(data){return{type:exports.ERROR,data:"parser error"}}},{"./binary":45,"./is-buffer":47,"component-emitter":9,debug:10,isarray:48,json3:49}],47:[function(_dereq_,module,exports){(function(global){module.exports=isBuf;function isBuf(obj){return global.Buffer&&global.Buffer.isBuffer(obj)||global.ArrayBuffer&&obj instanceof ArrayBuffer}}).call(this,typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],48:[function(_dereq_,module,exports){module.exports=_dereq_(32)},{}],49:[function(_dereq_,module,exports){(function(window){var getClass={}.toString,isProperty,forEach,undef;var isLoader=typeof define==="function"&&define.amd;var nativeJSON=typeof JSON=="object"&&JSON;var JSON3=typeof exports=="object"&&exports&&!exports.nodeType&&exports;if(JSON3&&nativeJSON){JSON3.stringify=nativeJSON.stringify;JSON3.parse=nativeJSON.parse}else{JSON3=window.JSON=nativeJSON||{}}var isExtended=new Date(-0xc782b5b800cec);try{isExtended=isExtended.getUTCFullYear()==-109252&&isExtended.getUTCMonth()===0&&isExtended.getUTCDate()===1&&isExtended.getUTCHours()==10&&isExtended.getUTCMinutes()==37&&isExtended.getUTCSeconds()==6&&isExtended.getUTCMilliseconds()==708}catch(exception){}function has(name){if(has[name]!==undef){return has[name]}var isSupported;if(name=="bug-string-char-index"){isSupported="a"[0]!="a"}else if(name=="json"){isSupported=has("json-stringify")&&has("json-parse")}else{var value,serialized='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if(name=="json-stringify"){var stringify=JSON3.stringify,stringifySupported=typeof stringify=="function"&&isExtended;if(stringifySupported){(value=function(){return 1}).toJSON=value;try{stringifySupported=stringify(0)==="0"&&stringify(new Number)==="0"&&stringify(new String)=='""'&&stringify(getClass)===undef&&stringify(undef)===undef&&stringify()===undef&&stringify(value)==="1"&&stringify([value])=="[1]"&&stringify([undef])=="[null]"&&stringify(null)=="null"&&stringify([undef,getClass,null])=="[null,null,null]"&&stringify({a:[value,true,false,null,"\x00\b\n\f\r	"]})==serialized&&stringify(null,value)==="1"&&stringify([1,2],null,1)=="[\n 1,\n 2\n]"&&stringify(new Date(-864e13))=='"-271821-04-20T00:00:00.000Z"'&&stringify(new Date(864e13))=='"+275760-09-13T00:00:00.000Z"'&&stringify(new Date(-621987552e5))=='"-000001-01-01T00:00:00.000Z"'&&stringify(new Date(-1))=='"1969-12-31T23:59:59.999Z"'}catch(exception){stringifySupported=false}}isSupported=stringifySupported}if(name=="json-parse"){var parse=JSON3.parse;if(typeof parse=="function"){try{if(parse("0")===0&&!parse(false)){value=parse(serialized);var parseSupported=value["a"].length==5&&value["a"][0]===1;if(parseSupported){try{parseSupported=!parse('"	"')}catch(exception){}if(parseSupported){try{parseSupported=parse("01")!==1}catch(exception){}}if(parseSupported){try{parseSupported=parse("1.")!==1}catch(exception){}}}}}catch(exception){parseSupported=false}}isSupported=parseSupported}}return has[name]=!!isSupported}if(!has("json")){var functionClass="[object Function]";var dateClass="[object Date]";var numberClass="[object Number]";var stringClass="[object String]";var arrayClass="[object Array]";var booleanClass="[object Boolean]";var charIndexBuggy=has("bug-string-char-index");if(!isExtended){var floor=Math.floor;var Months=[0,31,59,90,120,151,181,212,243,273,304,334];var getDay=function(year,month){return Months[month]+365*(year-1970)+floor((year-1969+(month=+(month>1)))/4)-floor((year-1901+month)/100)+floor((year-1601+month)/400)}}if(!(isProperty={}.hasOwnProperty)){isProperty=function(property){var members={},constructor;if((members.__proto__=null,members.__proto__={toString:1},members).toString!=getClass){isProperty=function(property){var original=this.__proto__,result=property in(this.__proto__=null,this);this.__proto__=original;return result}}else{constructor=members.constructor;isProperty=function(property){var parent=(this.constructor||constructor).prototype;return property in this&&!(property in parent&&this[property]===parent[property])}}members=null;return isProperty.call(this,property)}}var PrimitiveTypes={"boolean":1,number:1,string:1,undefined:1};var isHostType=function(object,property){var type=typeof object[property];return type=="object"?!!object[property]:!PrimitiveTypes[type]};forEach=function(object,callback){var size=0,Properties,members,property;(Properties=function(){this.valueOf=0}).prototype.valueOf=0;members=new Properties;for(property in members){if(isProperty.call(members,property)){size++}}Properties=members=null;if(!size){members=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"];forEach=function(object,callback){var isFunction=getClass.call(object)==functionClass,property,length;var hasProperty=!isFunction&&typeof object.constructor!="function"&&isHostType(object,"hasOwnProperty")?object.hasOwnProperty:isProperty;for(property in object){if(!(isFunction&&property=="prototype")&&hasProperty.call(object,property)){callback(property)}}for(length=members.length;property=members[--length];hasProperty.call(object,property)&&callback(property));}}else if(size==2){forEach=function(object,callback){var members={},isFunction=getClass.call(object)==functionClass,property;for(property in object){if(!(isFunction&&property=="prototype")&&!isProperty.call(members,property)&&(members[property]=1)&&isProperty.call(object,property)){callback(property)}}}}else{forEach=function(object,callback){var isFunction=getClass.call(object)==functionClass,property,isConstructor;for(property in object){if(!(isFunction&&property=="prototype")&&isProperty.call(object,property)&&!(isConstructor=property==="constructor")){callback(property)}}if(isConstructor||isProperty.call(object,property="constructor")){callback(property)}}}return forEach(object,callback)};if(!has("json-stringify")){var Escapes={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"};var leadingZeroes="000000";var toPaddedString=function(width,value){return(leadingZeroes+(value||0)).slice(-width)};var unicodePrefix="\\u00";var quote=function(value){var result='"',index=0,length=value.length,isLarge=length>10&&charIndexBuggy,symbols;if(isLarge){symbols=value.split("")}for(;index<length;index++){var charCode=value.charCodeAt(index);switch(charCode){case 8:case 9:case 10:case 12:case 13:case 34:case 92:result+=Escapes[charCode];break;default:if(charCode<32){result+=unicodePrefix+toPaddedString(2,charCode.toString(16));break}result+=isLarge?symbols[index]:charIndexBuggy?value.charAt(index):value[index]}}return result+'"'};var serialize=function(property,object,callback,properties,whitespace,indentation,stack){var value,className,year,month,date,time,hours,minutes,seconds,milliseconds,results,element,index,length,prefix,result;try{value=object[property]}catch(exception){}if(typeof value=="object"&&value){className=getClass.call(value);if(className==dateClass&&!isProperty.call(value,"toJSON")){if(value>-1/0&&value<1/0){if(getDay){date=floor(value/864e5);for(year=floor(date/365.2425)+1970-1;getDay(year+1,0)<=date;year++);for(month=floor((date-getDay(year,0))/30.42);getDay(year,month+1)<=date;month++);date=1+date-getDay(year,month);time=(value%864e5+864e5)%864e5;hours=floor(time/36e5)%24;minutes=floor(time/6e4)%60;seconds=floor(time/1e3)%60;milliseconds=time%1e3}else{year=value.getUTCFullYear();month=value.getUTCMonth();date=value.getUTCDate();hours=value.getUTCHours();minutes=value.getUTCMinutes();seconds=value.getUTCSeconds();milliseconds=value.getUTCMilliseconds()}value=(year<=0||year>=1e4?(year<0?"-":"+")+toPaddedString(6,year<0?-year:year):toPaddedString(4,year))+"-"+toPaddedString(2,month+1)+"-"+toPaddedString(2,date)+"T"+toPaddedString(2,hours)+":"+toPaddedString(2,minutes)+":"+toPaddedString(2,seconds)+"."+toPaddedString(3,milliseconds)+"Z"}else{value=null}}else if(typeof value.toJSON=="function"&&(className!=numberClass&&className!=stringClass&&className!=arrayClass||isProperty.call(value,"toJSON"))){value=value.toJSON(property)}}if(callback){value=callback.call(object,property,value)}if(value===null){return"null"}className=getClass.call(value);if(className==booleanClass){return""+value}else if(className==numberClass){return value>-1/0&&value<1/0?""+value:"null"}else if(className==stringClass){return quote(""+value)}if(typeof value=="object"){for(length=stack.length;length--;){if(stack[length]===value){throw TypeError()}}stack.push(value);results=[];prefix=indentation;indentation+=whitespace;if(className==arrayClass){for(index=0,length=value.length;index<length;index++){element=serialize(index,value,callback,properties,whitespace,indentation,stack);results.push(element===undef?"null":element)}result=results.length?whitespace?"[\n"+indentation+results.join(",\n"+indentation)+"\n"+prefix+"]":"["+results.join(",")+"]":"[]"}else{forEach(properties||value,function(property){var element=serialize(property,value,callback,properties,whitespace,indentation,stack);if(element!==undef){results.push(quote(property)+":"+(whitespace?" ":"")+element)}});result=results.length?whitespace?"{\n"+indentation+results.join(",\n"+indentation)+"\n"+prefix+"}":"{"+results.join(",")+"}":"{}"}stack.pop();return result}};JSON3.stringify=function(source,filter,width){var whitespace,callback,properties,className;if(typeof filter=="function"||typeof filter=="object"&&filter){if((className=getClass.call(filter))==functionClass){callback=filter}else if(className==arrayClass){properties={};for(var index=0,length=filter.length,value;index<length;value=filter[index++],(className=getClass.call(value),className==stringClass||className==numberClass)&&(properties[value]=1));}}if(width){if((className=getClass.call(width))==numberClass){if((width-=width%1)>0){for(whitespace="",width>10&&(width=10);whitespace.length<width;whitespace+=" ");}}else if(className==stringClass){whitespace=width.length<=10?width:width.slice(0,10)}}return serialize("",(value={},value[""]=source,value),callback,properties,whitespace,"",[])}}if(!has("json-parse")){var fromCharCode=String.fromCharCode;var Unescapes={92:"\\",34:'"',47:"/",98:"\b",116:"	",110:"\n",102:"\f",114:"\r"};var Index,Source;var abort=function(){Index=Source=null;throw SyntaxError()};var lex=function(){var source=Source,length=source.length,value,begin,position,isSigned,charCode;while(Index<length){charCode=source.charCodeAt(Index);switch(charCode){case 9:case 10:case 13:case 32:Index++;break;case 123:case 125:case 91:case 93:case 58:case 44:value=charIndexBuggy?source.charAt(Index):source[Index];Index++;return value;case 34:for(value="@",Index++;Index<length;){charCode=source.charCodeAt(Index);if(charCode<32){abort()}else if(charCode==92){charCode=source.charCodeAt(++Index);switch(charCode){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:value+=Unescapes[charCode];Index++;break;case 117:begin=++Index;for(position=Index+4;Index<position;Index++){charCode=source.charCodeAt(Index);if(!(charCode>=48&&charCode<=57||charCode>=97&&charCode<=102||charCode>=65&&charCode<=70)){abort()}}value+=fromCharCode("0x"+source.slice(begin,Index));break;default:abort()}}else{if(charCode==34){break}charCode=source.charCodeAt(Index);begin=Index;while(charCode>=32&&charCode!=92&&charCode!=34){charCode=source.charCodeAt(++Index)}value+=source.slice(begin,Index)}}if(source.charCodeAt(Index)==34){Index++;return value}abort();default:begin=Index;if(charCode==45){isSigned=true;charCode=source.charCodeAt(++Index)}if(charCode>=48&&charCode<=57){if(charCode==48&&(charCode=source.charCodeAt(Index+1),charCode>=48&&charCode<=57)){abort()}isSigned=false;for(;Index<length&&(charCode=source.charCodeAt(Index),charCode>=48&&charCode<=57);Index++);if(source.charCodeAt(Index)==46){position=++Index;for(;position<length&&(charCode=source.charCodeAt(position),charCode>=48&&charCode<=57);position++);if(position==Index){abort()}Index=position}charCode=source.charCodeAt(Index);if(charCode==101||charCode==69){charCode=source.charCodeAt(++Index);if(charCode==43||charCode==45){Index++}for(position=Index;position<length&&(charCode=source.charCodeAt(position),charCode>=48&&charCode<=57);position++);if(position==Index){abort()}Index=position}return+source.slice(begin,Index)}if(isSigned){abort()}if(source.slice(Index,Index+4)=="true"){Index+=4;return true}else if(source.slice(Index,Index+5)=="false"){Index+=5;return false}else if(source.slice(Index,Index+4)=="null"){Index+=4;return null}abort()}}return"$"};var get=function(value){var results,hasMembers;if(value=="$"){abort()}if(typeof value=="string"){if((charIndexBuggy?value.charAt(0):value[0])=="@"){return value.slice(1)}if(value=="["){results=[];for(;;hasMembers||(hasMembers=true)){value=lex();if(value=="]"){break}if(hasMembers){if(value==","){value=lex();if(value=="]"){abort()}}else{abort()}}if(value==","){abort()}results.push(get(value))}return results}else if(value=="{"){results={};for(;;hasMembers||(hasMembers=true)){value=lex();if(value=="}"){break}if(hasMembers){if(value==","){value=lex();if(value=="}"){abort()}}else{abort()}}if(value==","||typeof value!="string"||(charIndexBuggy?value.charAt(0):value[0])!="@"||lex()!=":"){abort()}results[value.slice(1)]=get(lex())}return results}abort()}return value};var update=function(source,property,callback){var element=walk(source,property,callback);if(element===undef){delete source[property]}else{source[property]=element}};var walk=function(source,property,callback){var value=source[property],length;if(typeof value=="object"&&value){if(getClass.call(value)==arrayClass){for(length=value.length;length--;){update(value,length,callback)}}else{forEach(value,function(property){update(value,property,callback)})}}return callback.call(source,property,value)};JSON3.parse=function(source,callback){var result,value;Index=0;Source=""+source;result=get(lex());if(lex()!="$"){abort()}Index=Source=null;return callback&&getClass.call(callback)==functionClass?walk((value={},value[""]=result,value),"",callback):result}}}if(isLoader){define(function(){return JSON3})}})(this)},{}],50:[function(_dereq_,module,exports){module.exports=toArray;function toArray(list,index){var array=[];index=index||0;for(var i=index||0;i<list.length;i++){array[i-index]=list[i]}return array}},{}]},{},[1])(1)});
!function(e){"use strict";var t=function(){this.cssImportStatements=[],this.cssKeyframeStatements=[],this.cssRegex=new RegExp("([\\s\\S]*?){([\\s\\S]*?)}","gi"),this.cssMediaQueryRegex="((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})",this.cssKeyframeRegex="((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})",this.combinedCSSRegex="((\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",this.cssCommentsRegex="(\\/\\*[\\s\\S]*?\\*\\/)",this.cssImportStatementRegex=new RegExp("@import .*?;","gi")};t.prototype.stripComments=function(e){var t=new RegExp(this.cssCommentsRegex,"gi");return e.replace(t,"")},t.prototype.parseCSS=function(e){if(void 0===e)return[];for(var t=[];;){var o=this.cssImportStatementRegex.exec(e);if(null===o)break;this.cssImportStatements.push(o[0]),t.push({selector:"@imports",type:"imports",styles:o[0]})}e=e.replace(this.cssImportStatementRegex,"");for(var n,r=new RegExp(this.cssKeyframeRegex,"gi");;){if(n=r.exec(e),null===n)break;t.push({selector:"@keyframes",type:"keyframes",styles:n[0]})}e=e.replace(r,"");for(var i=new RegExp(this.combinedCSSRegex,"gi");;){if(n=i.exec(e),null===n)break;var s="";s=void 0===n[2]?n[5].split("\r\n").join("\n").trim():n[2].split("\r\n").join("\n").trim();var a=new RegExp(this.cssCommentsRegex,"gi"),l=a.exec(s);if(null!==l&&(s=s.replace(a,"").trim()),-1!==s.indexOf("@media")){var c={selector:s,type:"media",subStyles:this.parseCSS(n[3]+"\n}")};null!==l&&(c.comments=l[0]),t.push(c)}else{var d=this.parseRules(n[6]),u={selector:s,rules:d};"@font-face"===s&&(u.type="font-face"),null!==l&&(u.comments=l[0]),t.push(u)}}return t},t.prototype.parseRules=function(e){e=e.split("\r\n").join("\n");var t=[];e=e.split(";");for(var o=0;o<e.length;o++){var n=e[o];if(n=n.trim(),-1!==n.indexOf(":")){n=n.split(":");var r=n[0].trim(),i=n.slice(1).join(":").trim();if(r.length<1||i.length<1)continue;t.push({directive:r,value:i})}else"base64,"==n.trim().substr(0,7)?t[t.length-1].value+=n.trim():n.length>0&&t.push({directive:"",value:n,defective:!0})}return t},t.prototype.findCorrespondingRule=function(e,t,o){void 0===o&&(o=!1);for(var n=!1,r=0;r<e.length&&(e[r].directive!=t||(n=e[r],o!==e[r].value));r++);return n},t.prototype.findBySelector=function(e,t,o){void 0===o&&(o=!1);for(var n=[],r=0;r<e.length;r++)o===!1?e[r].selector===t&&n.push(e[r]):-1!==e[r].selector.indexOf(t)&&n.push(e[r]);if(n.length<2)return n;var i=n[0];for(r=1;r<n.length;r++)this.intelligentCSSPush([i],n[r]);return[i]},t.prototype.deleteBySelector=function(e,t){for(var o=[],n=0;n<e.length;n++)e[n].selector!==t&&o.push(e[n]);return o},t.prototype.compressCSS=function(e){for(var t=[],o={},n=0;n<e.length;n++){var r=e[n];if(o[r.selector]!==!0){var i=this.findBySelector(e,r.selector);0!==i.length&&(t.push(i[0]),o[r.selector]=!0)}}return t},t.prototype.cssDiff=function(e,t){if(e.selector!==t.selector)return!1;if("media"===e.type||"media"===t.type)return!1;for(var o,n,r={selector:e.selector,rules:[]},i=0;i<e.rules.length;i++)o=e.rules[i],n=this.findCorrespondingRule(t.rules,o.directive,o.value),n===!1?r.rules.push(o):o.value!==n.value&&r.rules.push(o);for(var s=0;s<t.rules.length;s++)n=t.rules[s],o=this.findCorrespondingRule(e.rules,n.directive),o===!1&&(n.type="DELETED",r.rules.push(n));return 0===r.rules.length?!1:r},t.prototype.intelligentMerge=function(e,t,o){void 0===o&&(o=!1);for(var n=0;n<t.length;n++)this.intelligentCSSPush(e,t[n],o);for(n=0;n<e.length;n++){var r=e[n];"media"!==r.type&&"keyframes"!==r.type&&(r.rules=this.compactRules(r.rules))}},t.prototype.intelligentCSSPush=function(e,t,o){var n=(t.selector,!1);if(void 0===o&&(o=!1),o===!1){for(var r=0;r<e.length;r++)if(e[r].selector===t.selector){n=e[r];break}}else for(var i=e.length-1;i>-1;i--)if(e[i].selector===t.selector){n=e[i];break}if(n===!1)e.push(t);else if("media"!==t.type)for(var s=0;s<t.rules.length;s++){var a=t.rules[s],l=this.findCorrespondingRule(n.rules,a.directive);l===!1?n.rules.push(a):"DELETED"==a.type?l.type="DELETED":l.value=a.value}else n.subStyles=t.subStyles},t.prototype.compactRules=function(e){for(var t=[],o=0;o<e.length;o++)"DELETED"!==e[o].type&&t.push(e[o]);return t},t.prototype.getCSSForEditor=function(e,t){void 0===t&&(t=0);var o="";void 0===e&&(e=this.css);for(var n=0;n<e.length;n++)"imports"==e[n].type&&(o+=e[n].styles+"\n\n");for(n=0;n<e.length;n++){var r=e[n];if(void 0!==r.selector){var i="";void 0!==r.comments&&(i=r.comments+"\n"),"media"==r.type?(o+=i+r.selector+"{\n",o+=this.getCSSForEditor(r.subStyles,t+1),o+="}\n\n"):"keyframes"!==r.type&&"imports"!==r.type&&(o+=this.getSpaces(t)+i+r.selector+" {\n",o+=this.getCSSOfRules(r.rules,t+1),o+=this.getSpaces(t)+"}\n\n")}}for(n=0;n<e.length;n++)"keyframes"==e[n].type&&(o+=e[n].styles+"\n\n");return o},t.prototype.getImports=function(e){for(var t=[],o=0;o<e.length;o++)"imports"==e[o].type&&t.push(e[o].styles);return t},t.prototype.getCSSOfRules=function(e,t){for(var o="",n=0;n<e.length;n++)void 0!==e[n]&&(o+=void 0===e[n].defective?this.getSpaces(t)+e[n].directive+" : "+e[n].value+";\n":this.getSpaces(t)+e[n].value+";\n");return o||"\n"},t.prototype.getSpaces=function(e){for(var t="",o=0;4*e>o;o++)t+=" ";return t},t.prototype.applyNamespacing=function(e,t){var o=e,n="."+this.cssPreviewNamespace;void 0!==t&&(n=t),"string"==typeof e&&(o=this.parseCSS(e));for(var r=0;r<o.length;r++){var i=o[r];if(!(i.selector.indexOf("@font-face")>-1||i.selector.indexOf("keyframes")>-1||i.selector.indexOf("@import")>-1||i.selector.indexOf(".form-all")>-1||i.selector.indexOf("#stage")>-1))if("media"!==i.type){for(var s=i.selector.split(","),a=[],l=0;l<s.length;l++)-1===s[l].indexOf(".supernova")?a.push(n+" "+s[l]):a.push(s[l]);i.selector=a.join(",")}else i.subStyles=this.applyNamespacing(i.subStyles,t)}return o},t.prototype.clearNamespacing=function(e,t){void 0===t&&(t=!1);var o=e,n="."+this.cssPreviewNamespace;"string"==typeof e&&(o=this.parseCSS(e));for(var r=0;r<o.length;r++){var i=o[r];if("media"!==i.type){for(var s=i.selector.split(","),a=[],l=0;l<s.length;l++)a.push(s[l].split(n+" ").join(""));i.selector=a.join(",")}else i.subStyles=this.clearNamespacing(i.subStyles,!0)}return t===!1?this.getCSSForEditor(o):o},t.prototype.createStyleElement=function(e,t,o){if(void 0===o&&(o=!1),this.testMode===!1&&"nonamespace"!==o&&(t=this.applyNamespacing(t)),"string"!=typeof t&&(t=this.getCSSForEditor(t)),o===!0&&(t=this.getCSSForEditor(this.parseCSS(t))),this.testMode!==!1)return this.testMode("create style #"+e,t);var n=document.getElementById(e);n&&n.parentNode.removeChild(n);var r=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.id=e,i.type="text/css",r.appendChild(i),i.styleSheet&&!i.sheet?i.styleSheet.cssText=t:i.appendChild(document.createTextNode(t))},e.cssjs=t}(this);var VORLON;!function(e){var t=function(){function t(){}return t.QuerySelectorById=function(e,t){return e.querySelector?e.querySelector("#"+t):document.getElementById(t)},t.SetImmediate=function(e){window.setImmediate?setImmediate(e):setTimeout(e,0)},t.setLocalStorageValue=function(e,t){if(localStorage)try{localStorage.setItem(e,t)}catch(o){}},t.getLocalStorageValue=function(e){if(localStorage)try{return localStorage.getItem(e)}catch(t){return""}},t.Hook=function(e,t,o){var n=e[t];return e[t]=function(){for(var t=[],r=0;r<arguments.length;r++)t[r-0]=arguments[r];o(t),n.apply(e,t)},n},t.HookProperty=function(t,o,n){var r=t[o];Object.defineProperty(t,o,{get:function(){return n&&n(e.Tools.getCallStack(1)),r}})},t.getCallStack=function(e){e=e||0;try{throw new Error}catch(t){for(var o=t.stack.split("\n"),n=0,r=2+e,i=o.length;i>r;r++)if(o[r].indexOf("http://")>=0){n=r;break}var s={stack:t.stack},a=o[n],l=a.indexOf("http://")||a.indexOf("https://");if(l>0){var c=a.indexOf(")",l);0>c&&(c=a.length-1);var d=a.substr(l,c-l),u=d.indexOf(":",d.lastIndexOf("/"));s.file=d.substr(0,u)}return s}},t.CreateCookie=function(e,t,o){var n;if(o){var r=new Date;r.setTime(r.getTime()+24*o*60*60*1e3),n="; expires="+r.toUTCString()}else n="";document.cookie=e+"="+t+n+"; path=/"},t.ReadCookie=function(e){for(var t=e+"=",o=document.cookie.split(";"),n=0;n<o.length;n++){for(var r=o[n];" "===r.charAt(0);)r=r.substring(1,r.length);if(0===r.indexOf(t))return r.substring(t.length,r.length)}return""},t.CreateGUID=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,o="x"===e?t:3&t|8;return o.toString(16)})},t.RemoveEmpties=function(e){for(var t=e.length,o=t-1;o>=0;o--)e[o]||(e.splice(o,1),t--);return t},t.AddClass=function(e,o){if(e.classList){if(o.indexOf(" ")<0)e.classList.add(o);else{var n=o.split(" ");t.RemoveEmpties(n);for(var r=0,i=n.length;i>r;r++)e.classList.add(n[r])}return e}var s,a=e.className,l=a.split(" "),c=t.RemoveEmpties(l);if(o.indexOf(" ")>=0){for(n=o.split(" "),t.RemoveEmpties(n),r=0;c>r;r++){var d=n.indexOf(l[r]);d>=0&&n.splice(d,1)}n.length>0&&(s=n.join(" "))}else{var u=!1;for(r=0;c>r;r++)if(l[r]===o){u=!0;break}u||(s=o)}return s&&(e.className=c>0&&l[0].length>0?a+" "+s:s),e},t.RemoveClass=function(e,o){if(e.classList){if(0===e.classList.length)return e;var n=o.split(" ");t.RemoveEmpties(n);for(var r=0,i=n.length;i>r;r++)e.classList.remove(n[r]);return e}var s=e.className;if(o.indexOf(" ")>=0)n=o.split(" "),t.RemoveEmpties(n);else{if(s.indexOf(o)<0)return e;n=[o]}var a,l=s.split(" "),c=t.RemoveEmpties(l);for(r=c-1;r>=0;r--)n.indexOf(l[r])>=0&&(l.splice(r,1),a=!0);return a&&(e.className=l.join(" ")),e},t.ToggleClass=function(e,o,n){e.className.match(o)?(t.RemoveClass(e,o),n&&n(!1)):(t.AddClass(e,o),n&&n(!0))},t.htmlToString=function(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;")},t}();e.Tools=t;var o=function(){function e(e,t,o,n){this.childs=[],e&&(this.element=document.createElement(e),t&&(this.element.className=t),o&&o.appendChild(this.element),this.parent=n,n&&n.childs.push(this))}return e.forElement=function(t){var o=new e(null);return o.element=t,o},e.prototype.addClass=function(e){return this.element.classList.add(e),this},e.prototype.toggleClass=function(e){return this.element.classList.toggle(e),this},e.prototype.className=function(e){return this.element.className=e,this},e.prototype.opacity=function(e){return this.element.style.opacity=e,this},e.prototype.display=function(e){return this.element.style.display=e,this},e.prototype.hide=function(){return this.element.style.display="none",this},e.prototype.visibility=function(e){return this.element.style.visibility=e,this},e.prototype.text=function(e){return this.element.textContent=e,this},e.prototype.html=function(e){return this.element.innerHTML=e,this},e.prototype.attr=function(e,t){return this.element.setAttribute(e,t),this},e.prototype.editable=function(e){return this.element.contentEditable=e?"true":"false",this},e.prototype.style=function(e,t){return this.element.style[e]=t,this},e.prototype.appendTo=function(e){return e.appendChild(this.element),this},e.prototype.append=function(t,o,n){var r=new e(t,o,this.element,this);return n&&n(r),this},e.prototype.createChild=function(t,o){var n=new e(t,o,this.element,this);return n},e.prototype.click=function(e){return this.element.addEventListener("click",e),this},e.prototype.blur=function(e){return this.element.addEventListener("blur",e),this},e.prototype.keydown=function(e){return this.element.addEventListener("keydown",e),this},e}();e.FluentDOM=o}(VORLON||(VORLON={}));var VORLON;!function(e){!function(e){e[e.Client=0]="Client",e[e.Dashboard=1]="Dashboard",e[e.Both=2]="Both"}(e.RuntimeSide||(e.RuntimeSide={}));e.RuntimeSide;!function(e){e[e.OneOne=0]="OneOne",e[e.MulticastReceiveOnly=1]="MulticastReceiveOnly",e[e.Multicast=2]="Multicast"}(e.PluginType||(e.PluginType={}));e.PluginType}(VORLON||(VORLON={}));var VORLON;!function(e){var t=function(){function t(t){this.name=t,this._ready=!0,this._id="",this._type=e.PluginType.OneOne,this.traceLog=function(e){console.log(e)},this.traceNoop=function(){},this.loadingDirectory="http://localhost:1337/vorlon/plugins",this.debug=e.Core.debug}return Object.defineProperty(t.prototype,"Type",{get:function(){return this._type},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"debug",{get:function(){return this._debug},set:function(e){this._debug=e,this.trace=e?this.traceLog:this.traceNoop},enumerable:!0,configurable:!0}),t.prototype.getID=function(){return this._id},t.prototype.isReady=function(){return this._ready},t}();e.BasePlugin=t}(VORLON||(VORLON={}));var __extends=this&&this.__extends||function(e,t){function o(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);o.prototype=t.prototype,e.prototype=new o},VORLON;!function(e){var t=function(t){function o(e){t.call(this,e)}return __extends(o,t),o.prototype.startClientSide=function(){},o.prototype.onRealtimeMessageReceivedFromDashboardSide=function(){},o.prototype.sendToDashboard=function(t){e.Core.Messenger&&e.Core.Messenger.sendRealtimeMessage(this.getID(),t,e.RuntimeSide.Client,"message")},o.prototype.sendCommandToDashboard=function(t,o){void 0===o&&(o=null),e.Core.Messenger&&(this.trace(this.getID()+" send command to dashboard "+t),e.Core.Messenger.sendRealtimeMessage(this.getID(),o,e.RuntimeSide.Client,"message",t))},o.prototype.refresh=function(){console.error("Please override plugin.refresh()")},o.prototype._loadNewScriptAsync=function(e,t,o){function n(){var o=document.createElement("script");o.setAttribute("src",i+e),o.onload=t;var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(o,n)}var r=this,i="";i=0===this.loadingDirectory.indexOf("http")?this.loadingDirectory+"/"+this.name+"/":vorlonBaseURL+"/"+this.loadingDirectory+"/"+this.name+"/",!o||document.body?n():document.addEventListener("DOMContentLoaded",function(){r._loadNewScriptAsync(e,t,o)})},o}(e.BasePlugin);e.ClientPlugin=t}(VORLON||(VORLON={}));var __extends=this&&this.__extends||function(e,t){function o(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);o.prototype=t.prototype,e.prototype=new o},VORLON;!function(e){var t=function(t){function o(o,n,r){t.call(this,o),this.htmlFragmentUrl=n,this.cssStyleSheetUrl=r,this.debug=e.Core.debug}return __extends(o,t),o.prototype.startDashboardSide=function(){},o.prototype.onRealtimeMessageReceivedFromClientSide=function(){},o.prototype.sendToClient=function(t){e.Core.Messenger&&e.Core.Messenger.sendRealtimeMessage(this.getID(),t,e.RuntimeSide.Dashboard,"message")},o.prototype.sendCommandToClient=function(t,o){void 0===o&&(o=null),e.Core.Messenger&&(this.trace(this.getID()+" send command to client "+t),e.Core.Messenger.sendRealtimeMessage(this.getID(),o,e.RuntimeSide.Dashboard,"message",t))},o.prototype.sendCommandToPluginClient=function(t,o,n){void 0===n&&(n=null),e.Core.Messenger&&(this.trace(this.getID()+" send command to plugin client "+o),e.Core.Messenger.sendRealtimeMessage(t,n,e.RuntimeSide.Dashboard,"protocol",o))},o.prototype.sendCommandToPluginDashboard=function(t,o,n){void 0===n&&(n=null),e.Core.Messenger&&(this.trace(this.getID()+" send command to plugin dashboard "+o),e.Core.Messenger.sendRealtimeMessage(t,n,e.RuntimeSide.Client,"protocol",o))},o.prototype._insertHtmlContentAsync=function(e,t){var o=this,n=vorlonBaseURL+"/"+this.loadingDirectory+"/"+this.name+"/",r=!1;e||(e=document.createElement("div"),document.body.appendChild(e),r=!0);var i=new XMLHttpRequest;i.open("GET",n+this.htmlFragmentUrl,!0),i.onreadystatechange=function(){if(4===i.readyState){if(200!==i.status)throw new Error("Error status: "+i.status+" - Unable to load "+n+o.htmlFragmentUrl);e.innerHTML=o._stripContent(i.responseText);var s=document.getElementsByTagName("head")[0],a=document.createElement("link");a.type="text/css",a.rel="stylesheet",a.href=n+o.cssStyleSheetUrl,a.media="screen",s.appendChild(a);var l=e.children[0];r&&(l.className="alone"),t(l)}},i.send(null)},o.prototype._stripContent=function(e){var t=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,o=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im;if(e){e=e.replace(t,"");var n=e.match(o);n&&(e=n[1])}return e},o}(e.BasePlugin);e.DashboardPlugin=t}(VORLON||(VORLON={}));var VORLON;!function(e){var t=function(){function t(t,o,n,r,i){var s=this;switch(this._isConnected=!1,this._isConnected=!1,this._sessionId=n,this._clientId=r,e.Core._listenClientId=i,this._serverUrl=o,t){case e.RuntimeSide.Client:this._socket=io.connect(o),this._isConnected=!0;break;case e.RuntimeSide.Dashboard:this._socket=io.connect(o+"/dashboard"),this._isConnected=!0}if(this.isConnected){var a=io.Manager(o);a.on("connect_error",function(e){s.onError&&s.onError(e)}),this._socket.on("message",function(e){var t=JSON.parse(e);s.onRealtimeMessageReceived&&s.onRealtimeMessageReceived(t)}),this._socket.on("helo",function(t){e.Core._listenClientId=t,s.onHeloReceived&&s.onHeloReceived(t)}),this._socket.on("identify",function(e){s.onIdentifyReceived&&s.onIdentifyReceived(e)}),this._socket.on("stoplisten",function(){s.onStopListenReceived&&s.onStopListenReceived()}),this._socket.on("refreshclients",function(){s.onRefreshClients&&s.onRefreshClients()}),this._socket.on("addclient",function(e){s.onAddClient&&s.onAddClient(e)}),this._socket.on("removeclient",function(e){s.onRemoveClient&&s.onRemoveClient(e)}),this._socket.on("reload",function(t){e.Core._listenClientId=t,s.onReload&&s.onReload(t)})}}return Object.defineProperty(t.prototype,"isConnected",{get:function(){return this._isConnected},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"clientId",{set:function(e){this._clientId=e},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"socketId",{get:function(){return this._socket.id},enumerable:!0,configurable:!0}),t.prototype.stopListening=function(){this._socket&&this._socket.removeAllListeners()},t.prototype.sendRealtimeMessage=function(t,o,n,r,i){void 0===r&&(r="message");var s={metadata:{pluginID:t,side:n,sessionId:this._sessionId,clientId:this._clientId,listenClientId:e.Core._listenClientId},data:o};if(i&&(s.command=i),!this.isConnected)return this.onRealtimeMessageReceived&&this.onRealtimeMessageReceived(s),void 0;if(""!==e.Core._listenClientId||"message"!==r){var a=JSON.stringify(s);this._socket.emit(r,a)}},t.prototype.sendMonitoringMessage=function(e,t){var o=new XMLHttpRequest;o.onreadystatechange=function(){4===o.readyState&&200===o.status},o.open("POST",this._serverUrl+"api/push"),o.setRequestHeader("Content-type","application/json;charset=UTF-8");var n=JSON.stringify({_idsession:this._sessionId,id:e,message:t});o.send(n)},t.prototype.getMonitoringMessage=function(e,t,o,n){void 0===o&&(o="-20"),void 0===n&&(n="-1");var r=new XMLHttpRequest;r.onreadystatechange=function(){4===r.readyState?200===r.status?t&&t(JSON.parse(r.responseText)):t&&t(null):t&&t(null)},r.open("GET",this._serverUrl+"api/range/"+this._sessionId+"/"+e+"/"+o+"/"+n),r.send()},t}();e.ClientMessenger=t}(VORLON||(VORLON={}));var VORLON;!function(e){var t=function(){function t(){this._clientPlugins=new Array,this._dashboardPlugins=new Array,this._socketIOWaitCount=0,this.debug=!1,this._RetryTimeout=1002}return Object.defineProperty(t.prototype,"Messenger",{get:function(){return e.Core._messenger},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"ClientPlugins",{get:function(){return e.Core._clientPlugins},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"DashboardPlugins",{get:function(){return e.Core._dashboardPlugins},enumerable:!0,configurable:!0}),t.prototype.RegisterClientPlugin=function(t){e.Core._clientPlugins.push(t)},t.prototype.RegisterDashboardPlugin=function(t){e.Core._dashboardPlugins.push(t)},t.prototype.StopListening=function(){e.Core._messenger&&(e.Core._messenger.stopListening(),delete e.Core._messenger)},t.prototype.StartClientSide=function(t,o,n){var r=this;if(void 0===t&&(t="'http://localhost:1337/'"),void 0===o&&(o=""),void 0===n&&(n=""),e.Core._side=e.RuntimeSide.Client,e.Core._sessionID=o,e.Core._listenClientId=n,void 0===window.io)return this._socketIOWaitCount<10?(this._socketIOWaitCount++,setTimeout(function(){console.log("Vorlon.js: waiting for socket.io to load..."),e.Core.StartClientSide(t,o,n)},1e3)):(console.log("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file."),e.Core.ShowError("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file.",0)),void 0;var i=e.Tools.ReadCookie("vorlonJS_clientId");i||(i=e.Tools.CreateGUID(),e.Tools.CreateCookie("vorlonJS_clientId",i,1)),e.Core._messenger&&(e.Core._messenger.stopListening(),delete e.Core._messenger),e.Core._messenger=new e.ClientMessenger(e.Core._side,t,o,i,n),e.Core.Messenger.onRealtimeMessageReceived=e.Core._Dispatch,e.Core.Messenger.onHeloReceived=e.Core._OnIdentificationReceived,e.Core.Messenger.onIdentifyReceived=e.Core._OnIdentifyReceived,e.Core.Messenger.onStopListenReceived=e.Core._OnStopListenReceived,e.Core.Messenger.onError=e.Core._OnError,e.Core.Messenger.onReload=e.Core._OnReloadClient;var s={ua:navigator.userAgent};e.Core.Messenger.sendRealtimeMessage("",s,e.Core._side,"helo");for(var a=0;a<e.Core._clientPlugins.length;a++){var l=e.Core._clientPlugins[a];l.startClientSide()}window.addEventListener("beforeunload",function(){e.Core.Messenger.sendRealtimeMessage("",{socketid:e.Core.Messenger.socketId},e.Core._side,"clientclosed")},!1),setTimeout(function(){r.startClientDirtyCheck()},500)},t.prototype.startClientDirtyCheck=function(){var t=this;if(!document.body)return setTimeout(function(){t.startClientDirtyCheck()},200),void 0;var o=window.MutationObserver||window.WebKitMutationObserver||null;if(o){document.body.__vorlon||(document.body.__vorlon={});var n={attributes:!0,childList:!0,subtree:!0,characterData:!0};document.body.__vorlon._observerMutationObserver=new o(function(t){var o=!1,n=!1,r=[];t.forEach(function(t){if(n){for(var i=0;i<r.length;i++)clearTimeout(r[i]);n=!1}return t.target&&t.target.__vorlon&&t.target.__vorlon.ignore?(n=!0,void 0):t.previousSibling&&t.previousSibling.__vorlon&&t.previousSibling.__vorlon.ignore?(n=!0,void 0):(t.target&&!o&&t.target.__vorlon&&t.target.parentNode&&t.target.parentNode.__vorlon&&t.target.parentNode.__vorlon.internalId&&r.push(setTimeout(function(){var o=null;t&&t.target&&t.target.parentNode&&t.target.parentNode.__vorlon&&t.target.parentNode.__vorlon.internalId&&(o=t.target.parentNode.__vorlon.internalId),e.Core.Messenger.sendRealtimeMessage("ALL_PLUGINS",{type:"contentchanged",internalId:o},e.Core._side,"message")},300)),o=!0,void 0)})}),document.body.__vorlon._observerMutationObserver.observe(document.body,n)}else{console.log("dirty check using html string");var r;document.body&&(r=document.body.innerHTML),setInterval(function(){var t=document.body.innerHTML;r!=t&&(r=t,e.Core.Messenger.sendRealtimeMessage("ALL_PLUGINS",{type:"contentchanged"},e.Core._side,"message"))},2e3)}},t.prototype.StartDashboardSide=function(t,o,n,r){if(void 0===t&&(t="'http://localhost:1337/'"),void 0===o&&(o=""),void 0===n&&(n=""),void 0===r&&(r=null),e.Core._side=e.RuntimeSide.Dashboard,e.Core._sessionID=o,e.Core._listenClientId=n,e.Core._errorNotifier=document.createElement("x-notify"),e.Core._errorNotifier.setAttribute("type","error"),e.Core._errorNotifier.setAttribute("position","top"),e.Core._errorNotifier.setAttribute("duration",5e3),e.Core._messageNotifier=document.createElement("x-notify"),e.Core._messageNotifier.setAttribute("position","top"),e.Core._messageNotifier.setAttribute("duration",4e3),document.body.appendChild(e.Core._errorNotifier),document.body.appendChild(e.Core._messageNotifier),void 0===window.io)return this._socketIOWaitCount<10?(this._socketIOWaitCount++,setTimeout(function(){console.log("Vorlon.js: waiting for socket.io to load..."),e.Core.StartDashboardSide(t,o,n,r)},1e3)):(console.log("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file."),e.Core.ShowError("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file.",0)),void 0;var i=e.Tools.ReadCookie("vorlonJS_clientId");i||(i=e.Tools.CreateGUID(),e.Tools.CreateCookie("vorlonJS_clientId",i,1)),e.Core._messenger&&(e.Core._messenger.stopListening(),delete e.Core._messenger),e.Core._messenger=new e.ClientMessenger(e.Core._side,t,o,i,n),e.Core.Messenger.onRealtimeMessageReceived=e.Core._Dispatch,e.Core.Messenger.onHeloReceived=e.Core._OnIdentificationReceived,e.Core.Messenger.onIdentifyReceived=e.Core._OnIdentifyReceived,e.Core.Messenger.onStopListenReceived=e.Core._OnStopListenReceived,e.Core.Messenger.onError=e.Core._OnError;var s={ua:navigator.userAgent};e.Core.Messenger.sendRealtimeMessage("",s,e.Core._side,"helo");for(var a=0;a<e.Core._dashboardPlugins.length;a++){var l=e.Core._dashboardPlugins[a];l.startDashboardSide(r?r(l.getID()):null)}},t.prototype._OnStopListenReceived=function(){e.Core._listenClientId=""},t.prototype._OnIdentifyReceived=function(t){if(e.Core._side===e.RuntimeSide.Dashboard)e.Core._messageNotifier.innerHTML=t,e.Core._messageNotifier.show();else{var o=document.createElement("div");o.className="vorlonIdentifyNumber",o.style.position="absolute",o.style.left="0",o.style.top="50%",o.style.marginTop="-150px",o.style.width="100%",o.style.height="300px",o.style.fontFamily="Arial",o.style.fontSize="300px",o.style.textAlign="center",o.style.color="white",o.style.textShadow="2px 2px 5px black",o.style.zIndex="100",o.innerHTML=t,document.body.appendChild(o),setTimeout(function(){document.body.removeChild(o)},4e3)}},t.prototype.ShowError=function(t,o){if(void 0===o&&(o=5e3),e.Core._side===e.RuntimeSide.Dashboard)e.Core._errorNotifier.innerHTML=t,e.Core._errorNotifier.setAttribute("duration",o),e.Core._errorNotifier.show();else{var n=document.createElement("div");n.style.position="absolute",n.style.top="0",n.style.left="0",n.style.width="100%",n.style.height="100px",n.style.backgroundColor="red",n.style.textAlign="center",n.style.fontSize="30px",n.style.paddingTop="20px",n.style.color="white",n.style.fontFamily="consolas",n.style.zIndex="1001",n.innerHTML=t,document.body.appendChild(n),o&&setTimeout(function(){document.body.removeChild(n)},o)}},t.prototype._OnError=function(t){e.Core.ShowError("Error while connecting to server. Server may be offline.<BR>Error message: "+t.message)},t.prototype._OnIdentificationReceived=function(t){if(e.Core._listenClientId=t,e.Core._side===e.RuntimeSide.Client)for(var o=0;o<e.Core._clientPlugins.length;o++){var n=e.Core._clientPlugins[o];n.refresh()}else{var r=document.querySelector(".dashboard-plugins-overlay");e.Tools.AddClass(r,"hidden"),e.Tools.RemoveClass(r,"bounce"),document.getElementById("test").style.visibility="visible"}},t.prototype._OnReloadClient=function(){document.location.reload()},t.prototype._RetrySendingRealtimeMessage=function(t,o){setTimeout(function(){return t.isReady()?(e.Core._DispatchFromClientPluginMessage(t,o),void 0):(e.Core._RetrySendingRealtimeMessage(t,o),void 0)},e.Core._RetryTimeout)},t.prototype._Dispatch=function(t){return t.metadata?("ALL_PLUGINS"==t.metadata.pluginID?(e.Core._clientPlugins.forEach(function(o){e.Core._DispatchPluginMessage(o,t)}),e.Core._dashboardPlugins.forEach(function(o){e.Core._DispatchPluginMessage(o,t)})):(e.Core._clientPlugins.forEach(function(o){return o.getID()===t.metadata.pluginID?(e.Core._DispatchPluginMessage(o,t),void 0):void 0}),e.Core._dashboardPlugins.forEach(function(o){return o.getID()===t.metadata.pluginID?(e.Core._DispatchPluginMessage(o,t),void 0):void 0})),void 0):(console.error("invalid message "+JSON.stringify(t)),void 0)},t.prototype._DispatchPluginMessage=function(t,o){t.trace("received "+JSON.stringify(o)),o.metadata.side===e.RuntimeSide.Client?t.isReady()?e.Core._DispatchFromClientPluginMessage(t,o):e.Core._RetrySendingRealtimeMessage(t,o):e.Core._DispatchFromDashboardPluginMessage(t,o)},t.prototype._DispatchFromClientPluginMessage=function(e,t){if(t.command&&e.DashboardCommands){var o=e.DashboardCommands[t.command];if(o)return o.call(e,t.data),void 0}e.onRealtimeMessageReceivedFromClientSide(t.data)},t.prototype._DispatchFromDashboardPluginMessage=function(e,t){if(t.command&&e.ClientCommands){var o=e.ClientCommands[t.command];if(o)return o.call(e,t.data),void 0}e.onRealtimeMessageReceivedFromDashboardSide(t.data)},t}();e._Core=t,e.Core=new t}(VORLON||(VORLON={}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VORLON;
(function (VORLON) {
    var InteractiveConsoleClient = (function (_super) {
        __extends(InteractiveConsoleClient, _super);
        function InteractiveConsoleClient() {
            var _this = this;
            _super.call(this, "interactiveConsole");
            this._cache = [];
            this._pendingEntries = [];
            this._maxBatchSize = 50;
            this._maxBatchTimeout = 200;
            this._objPrototype = Object.getPrototypeOf({});
            this._hooks = {
                clear: null,
                dir: null,
                log: null,
                debug: null,
                error: null,
                warn: null,
                info: null
            };
            this._ready = false;
            this._id = "CONSOLE";
            this.traceLog = function (msg) {
                if (_this._hooks && _this._hooks.log) {
                    _this._hooks.log.call(console, msg);
                }
                else {
                    console.log(msg);
                }
            };
        }
        InteractiveConsoleClient.prototype.inspect = function (obj, context, deepness) {
            if (!obj || typeof obj != "object") {
                return null;
            }
            var objProperties = Object.getOwnPropertyNames(obj);
            var proto = Object.getPrototypeOf(obj);
            var res = {
                functions: [],
                properties: []
            };
            if (proto && proto != this._objPrototype)
                res.proto = this.inspect(proto, context, deepness + 1);
            for (var i = 0, l = objProperties.length; i < l; i++) {
                var p = objProperties[i];
                var propertyType = "";
                if (p === '__vorlon')
                    continue;
                try {
                    var objValue = context[p];
                    propertyType = typeof objValue;
                    if (propertyType === 'function') {
                        res.functions.push(p);
                    }
                    else if (propertyType === 'undefined') {
                        res.properties.push({ name: p, val: undefined });
                    }
                    else if (propertyType === 'null') {
                        res.properties.push({ name: p, val: null });
                    }
                    else if (propertyType === 'object') {
                        if (deepness > 5) {
                            res.properties.push({ name: p, val: "Vorlon cannot inspect deeper, try inspecting the proper object directly" });
                        }
                        else {
                            res.properties.push({ name: p, val: this.inspect(objValue, objValue, deepness + 1) });
                        }
                    }
                    else {
                        res.properties.push({ name: p, val: objValue.toString() });
                    }
                }
                catch (exception) {
                    this.trace('error reading property ' + p + ' of type ' + propertyType);
                    this.trace(exception);
                    res.properties.push({ name: p, val: "oups, Vorlon has an error reading this " + propertyType + " property..." });
                }
            }
            res.functions = res.functions.sort(function (a, b) {
                var lowerAName = a.toLowerCase();
                var lowerBName = b.toLowerCase();
                if (lowerAName > lowerBName)
                    return 1;
                if (lowerAName < lowerBName)
                    return -1;
                return 0;
            });
            res.properties = res.properties.sort(function (a, b) {
                var lowerAName = a.name.toLowerCase();
                var lowerBName = b.name.toLowerCase();
                if (lowerAName > lowerBName)
                    return 1;
                if (lowerAName < lowerBName)
                    return -1;
                return 0;
            });
            return res;
        };
        InteractiveConsoleClient.prototype.getMessages = function (messages) {
            var resmessages = [];
            if (messages && messages.length > 0) {
                for (var i = 0, l = messages.length; i < l; i++) {
                    var msg = messages[i];
                    if (typeof msg === 'string' || typeof msg === 'number') {
                        resmessages.push(msg);
                    }
                    else {
                        if (msg == window || msg == document) {
                            resmessages.push('VORLON : object cannot be inspected, too big...');
                        }
                        else {
                            resmessages.push(this.inspect(msg, msg, 0));
                        }
                    }
                }
            }
            return resmessages;
        };
        InteractiveConsoleClient.prototype.addEntry = function (entry) {
            this._cache.push(entry);
            //non batch send
            //this.sendCommandToDashboard('entries', { entries: [entry] });
            this._pendingEntries.push(entry);
            if (this._pendingEntries.length > this._maxBatchSize) {
                this.sendPendings();
            }
            else {
                this.checkPendings();
            }
        };
        InteractiveConsoleClient.prototype.checkPendings = function () {
            var _this = this;
            if (!this._pendingEntriesTimeout) {
                this._pendingEntriesTimeout = setTimeout(function () {
                    _this._pendingEntriesTimeout = null;
                    _this.sendPendings();
                }, this._maxBatchTimeout);
            }
        };
        InteractiveConsoleClient.prototype.sendPendings = function () {
            var currentPendings = this._pendingEntries;
            this._pendingEntries = [];
            this.sendCommandToDashboard('entries', { entries: currentPendings });
        };
        InteractiveConsoleClient.prototype.batchSend = function (items) {
            if (this._pendingEntriesTimeout) {
                clearTimeout(this._pendingEntriesTimeout);
                this._pendingEntriesTimeout = null;
            }
            var batch = [];
            for (var i = 0, l = items.length; i < l; i++) {
                if (batch.length < this._maxBatchSize) {
                    batch.push(items[i]);
                }
                else {
                    this.sendCommandToDashboard('entries', { entries: batch });
                    batch = [];
                }
            }
            this.sendCommandToDashboard('entries', { entries: batch });
        };
        InteractiveConsoleClient.prototype.startClientSide = function () {
            var _this = this;
            this._cache = [];
            this._pendingEntries = [];
            // Overrides clear, log, error and warn
            this._hooks.clear = VORLON.Tools.Hook(window.console, "clear", function () {
                _this.clearClientConsole();
            });
            this._hooks.dir = VORLON.Tools.Hook(window.console, "dir", function (message) {
                var data = {
                    messages: _this.getMessages(message),
                    type: "dir"
                };
                _this.addEntry(data);
            });
            this._hooks.log = VORLON.Tools.Hook(window.console, "log", function (message) {
                var data = {
                    messages: _this.getMessages(message),
                    type: "log"
                };
                _this.addEntry(data);
            });
            this._hooks.debug = VORLON.Tools.Hook(window.console, "debug", function (message) {
                var data = {
                    messages: _this.getMessages(message),
                    type: "debug"
                };
                _this.addEntry(data);
            });
            this._hooks.info = VORLON.Tools.Hook(window.console, "info", function (message) {
                var data = {
                    messages: _this.getMessages(message),
                    type: "info"
                };
                _this.addEntry(data);
            });
            this._hooks.warn = VORLON.Tools.Hook(window.console, "warn", function (message) {
                var data = {
                    messages: _this.getMessages(message),
                    type: "warn"
                };
                _this.addEntry(data);
            });
            this._hooks.error = VORLON.Tools.Hook(window.console, "error", function (message) {
                var data = {
                    messages: _this.getMessages(message),
                    type: "error"
                };
                _this.addEntry(data);
            });
            // Override Error constructor
            var previousError = Error;
            Error = (function (message) {
                var error = new previousError(message);
                var data = {
                    messages: _this.getMessages(message),
                    type: "exception"
                };
                _this.addEntry(data);
                return error;
            });
            window.addEventListener('error', function (err) {
                if (err && err.error) {
                    //this.addEntry({ messages: [err.error.message], type: "exception" });
                    _this.addEntry({ messages: [err.error.stack], type: "exception" });
                }
            });
        };
        InteractiveConsoleClient.prototype.clearClientConsole = function () {
            this.sendCommandToDashboard('clear');
            this._cache = [];
        };
        InteractiveConsoleClient.prototype.evalOrderFromDashboard = function (order) {
            try {
                eval(order);
            }
            catch (e) {
                console.error("Unable to execute order: " + e.message);
            }
        };
        InteractiveConsoleClient.prototype.refresh = function () {
            var _this = this;
            //delay sending cache to dashboard to let other plugins load...
            setTimeout(function () {
                _this.sendCommandToDashboard("clear");
                _this.batchSend(_this._cache);
            }, 300);
        };
        return InteractiveConsoleClient;
    })(VORLON.ClientPlugin);
    VORLON.InteractiveConsoleClient = InteractiveConsoleClient;
    InteractiveConsoleClient.prototype.ClientCommands = {
        order: function (data) {
            var plugin = this;
            plugin.evalOrderFromDashboard(data.order);
        },
        clear: function (data) {
            var plugin = this;
            console.clear();
        }
    };
    // Register
    VORLON.Core.RegisterClientPlugin(new InteractiveConsoleClient());
})(VORLON || (VORLON = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VORLON;
(function (VORLON) {
    var DOMExplorerClient = (function (_super) {
        __extends(DOMExplorerClient, _super);
        function DOMExplorerClient() {
            _super.call(this, "domExplorer");
            this._internalId = 0;
            this._globalloadactive = false;
            this._id = "DOM";
            //this.debug = true;
            this._ready = false;
        }
        DOMExplorerClient.GetAppliedStyles = function (node) {
            // Style sheets
            var styleNode = new Array();
            var sheets = document.styleSheets;
            var style;
            var appliedStyles = new Array();
            var index;
            for (var c = 0; c < sheets.length; c++) {
                var rules = sheets[c].rules || sheets[c].cssRules;
                if (!rules) {
                    continue;
                }
                for (var r = 0; r < rules.length; r++) {
                    var rule = rules[r];
                    var selectorText = rule.selectorText;
                    try {
                        var matchedElts = document.querySelectorAll(selectorText);
                        for (index = 0; index < matchedElts.length; index++) {
                            var element = matchedElts[index];
                            style = rule.style;
                            if (element === node) {
                                for (var i = 0; i < style.length; i++) {
                                    if (appliedStyles.indexOf(style[i]) === -1) {
                                        appliedStyles.push(style[i]);
                                    }
                                }
                            }
                        }
                    }
                    catch (e) {
                    }
                }
            }
            // Local style
            style = node.style;
            if (style) {
                for (index = 0; index < style.length; index++) {
                    if (appliedStyles.indexOf(style[index]) === -1) {
                        appliedStyles.push(style[index]);
                    }
                }
            }
            // Get effective styles
            var winObject = document.defaultView || window;
            for (index = 0; index < appliedStyles.length; index++) {
                var appliedStyle = appliedStyles[index];
                if (winObject.getComputedStyle) {
                    styleNode.push(appliedStyle + ":" + winObject.getComputedStyle(node, "").getPropertyValue(appliedStyle));
                }
            }
            return styleNode;
        };
        DOMExplorerClient.prototype._packageNode = function (node) {
            if (!node)
                return;
            var packagedNode = {
                id: node.id,
                type: node.nodeType,
                name: node.localName,
                classes: node.className,
                content: null,
                hasChildNodes: false,
                attributes: node.attributes ? Array.prototype.map.call(node.attributes, function (attr) {
                    return [attr.name, attr.value];
                }) : [],
                //styles: DOMExplorerClient.GetAppliedStyles(node),
                children: [],
                isEmpty: false,
                rootHTML: null,
                internalId: VORLON.Tools.CreateGUID()
            };
            if (node.innerHTML === "") {
                packagedNode.isEmpty = true;
            }
            if (packagedNode.type == "3" || node.nodeName === "#comment") {
                if (node.nodeName === "#comment") {
                    packagedNode.name = "#comment";
                }
                packagedNode.content = node.textContent;
            }
            if (node.__vorlon && node.__vorlon.internalId) {
                packagedNode.internalId = node.__vorlon.internalId;
            }
            else {
                if (!node.__vorlon) {
                    node.__vorlon = {};
                }
                node.__vorlon.internalId = packagedNode.internalId;
            }
            return packagedNode;
        };
        DOMExplorerClient.prototype._packageDOM = function (root, packagedObject, withChildsNodes, highlightElementID) {
            if (withChildsNodes === void 0) { withChildsNodes = false; }
            if (highlightElementID === void 0) { highlightElementID = ""; }
            if (!root.childNodes || root.childNodes.length === 0) {
                return;
            }
            for (var index = 0; index < root.childNodes.length; index++) {
                var node = root.childNodes[index];
                var packagedNode = this._packageNode(node);
                var b = false;
                if (node.childNodes && node.childNodes.length > 1 || (node && node.nodeName && (node.nodeName.toLowerCase() === "script" || node.nodeName.toLowerCase() === "style"))) {
                    packagedNode.hasChildNodes = true;
                }
                else if (withChildsNodes || node.childNodes.length == 1) {
                    this._packageDOM(node, packagedNode, withChildsNodes, highlightElementID);
                    b = true;
                }
                if (highlightElementID !== "" && (!b && withChildsNodes)) {
                    this._packageDOM(node, packagedNode, withChildsNodes, highlightElementID);
                }
                if (node.__vorlon && node.__vorlon.ignore) {
                    return;
                }
                packagedObject.children.push(packagedNode);
                if (highlightElementID === packagedNode.internalId) {
                    highlightElementID = "";
                }
            }
        };
        DOMExplorerClient.prototype._packageAndSendDOM = function (element, highlightElementID) {
            if (highlightElementID === void 0) { highlightElementID = ""; }
            this._internalId = 0;
            var packagedObject = this._packageNode(element);
            this._packageDOM(element, packagedObject, false, highlightElementID);
            if (highlightElementID)
                packagedObject.highlightElementID = highlightElementID;
            this.sendCommandToDashboard('refreshNode', packagedObject);
        };
        DOMExplorerClient.prototype._markForRefresh = function () {
            this.refresh();
        };
        DOMExplorerClient.prototype.startClientSide = function () {
        };
        DOMExplorerClient.prototype._getElementByInternalId = function (internalId, node) {
            if (!node) {
                return null;
            }
            if (node.__vorlon && node.__vorlon.internalId === internalId) {
                return node;
            }
            if (!node.children) {
                return null;
            }
            for (var index = 0; index < node.children.length; index++) {
                var result = this._getElementByInternalId(internalId, node.children[index]);
                if (result) {
                    return result;
                }
            }
            return null;
        };
        DOMExplorerClient.prototype.getInnerHTML = function (internalId) {
            var element = this._getElementByInternalId(internalId, document.documentElement);
            if (element)
                this.sendCommandToDashboard("innerHTML", { internalId: internalId, innerHTML: element.innerHTML });
        };
        DOMExplorerClient.prototype.getComputedStyleById = function (internalId) {
            var element = this._getElementByInternalId(internalId, document.documentElement);
            if (element) {
                var winObject = document.defaultView || window;
                if (winObject.getComputedStyle) {
                    var styles = winObject.getComputedStyle(element);
                    var l = [];
                    for (var style in styles) {
                        if (isNaN(style) && style !== "parentRule" && style !== "length" && style !== "cssText" && typeof styles[style] !== 'function' && styles[style]) {
                            l.push({ name: style, value: styles[style] });
                        }
                    }
                    this.sendCommandToDashboard("setComputedStyle", l);
                }
            }
        };
        DOMExplorerClient.prototype.getStyle = function (internalId) {
            var element = this._getElementByInternalId(internalId, document.documentElement);
            if (element) {
                var winObject = document.defaultView || window;
                if (winObject.getComputedStyle) {
                    var styles = winObject.getComputedStyle(element);
                    var layoutStyle = {
                        border: {
                            rightWidth: styles.borderRightWidth,
                            leftWidth: styles.borderLeftWidth,
                            topWidth: styles.borderTopWidth,
                            bottomWidth: styles.borderBottomWidth
                        },
                        margin: {
                            bottom: styles.marginBottom,
                            left: styles.marginLeft,
                            top: styles.marginTop,
                            right: styles.marginRight
                        },
                        padding: {
                            bottom: styles.paddingBottom,
                            left: styles.paddingLeft,
                            top: styles.paddingTop,
                            right: styles.paddingRight
                        },
                        size: {
                            width: styles.width,
                            height: styles.height
                        }
                    };
                    this.sendCommandToDashboard("setLayoutStyle", layoutStyle);
                }
            }
        };
        DOMExplorerClient.prototype.saveInnerHTML = function (internalId, innerHTML) {
            var element = this._getElementByInternalId(internalId, document.documentElement);
            if (element) {
                element.innerHTML = innerHTML;
            }
            this.refreshbyId(internalId);
        };
        DOMExplorerClient.prototype._offsetFor = function (element) {
            var p = element.getBoundingClientRect();
            var w = element.offsetWidth;
            var h = element.offsetHeight;
            //console.log("check offset for highlight " + p.top + "," + p.left);
            return { x: p.top - element.scrollTop, y: p.left - element.scrollLeft, width: w, height: h };
        };
        DOMExplorerClient.prototype.setClientHighlightedElement = function (elementId) {
            var element = this._getElementByInternalId(elementId, document.documentElement);
            if (!element) {
                return;
            }
            if (!this._overlay) {
                this._overlay = document.createElement("div");
                this._overlay.id = "vorlonOverlay";
                this._overlay.style.position = "fixed";
                this._overlay.style.backgroundColor = "rgba(255,255,0,0.4)";
                this._overlay.style.pointerEvents = "none";
                this._overlay.__vorlon = { ignore: true };
                document.body.appendChild(this._overlay);
            }
            this._overlay.style.display = "block";
            var position = this._offsetFor(element);
            this._overlay.style.top = (position.x + document.body.scrollTop) + "px";
            this._overlay.style.left = (position.y + document.body.scrollLeft) + "px";
            this._overlay.style.width = position.width + "px";
            this._overlay.style.height = position.height + "px";
        };
        DOMExplorerClient.prototype.unhighlightClientElement = function (internalId) {
            if (this._overlay)
                this._overlay.style.display = "none";
        };
        DOMExplorerClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
        };
        DOMExplorerClient.prototype.refresh = function () {
            var _this = this;
            //sometimes refresh is called before document was loaded
            if (!document.body) {
                setTimeout(function () {
                    _this.refresh();
                }, 200);
                return;
            }
            var packagedObject = this._packageNode(document.documentElement);
            this._packageDOM(document.documentElement, packagedObject, this._globalloadactive, null);
            this.sendCommandToDashboard('init', packagedObject);
        };
        DOMExplorerClient.prototype.inspect = function () {
            var _this = this;
            if (document.elementFromPoint) {
                if (this._overlayInspect)
                    return;
                this.trace("INSPECT");
                this._overlayInspect = document.createElement("DIV");
                this._overlayInspect.__vorlon = { ignore: true };
                this._overlayInspect.style.position = "fixed";
                this._overlayInspect.style.left = "0";
                this._overlayInspect.style.right = "0";
                this._overlayInspect.style.top = "0";
                this._overlayInspect.style.bottom = "0";
                this._overlayInspect.style.zIndex = "5000000000000000";
                this._overlayInspect.style.touchAction = "manipulation";
                this._overlayInspect.style.backgroundColor = "rgba(255,0,0,0.3)";
                document.body.appendChild(this._overlayInspect);
                var event = "mousedown";
                if (this._overlayInspect.onpointerdown !== undefined) {
                    event = "pointerdown";
                }
                this._overlayInspect.addEventListener(event, function (arg) {
                    var evt = arg;
                    _this.trace("tracking element at " + evt.clientX + "/" + evt.clientY);
                    _this._overlayInspect.parentElement.removeChild(_this._overlayInspect);
                    var el = document.elementFromPoint(evt.clientX, evt.clientY);
                    if (el) {
                        _this.trace("element found");
                        _this.openElementInDashboard(el);
                    }
                    else {
                        _this.trace("element not found");
                    }
                    _this._overlayInspect = null;
                });
            }
            else {
                //TODO : send message back to dashboard and disable button
                this.trace("VORLON, inspection not supported");
            }
        };
        DOMExplorerClient.prototype.openElementInDashboard = function (element) {
            if (element) {
                var parentId = this.getFirstParentWithInternalId(element);
                if (parentId) {
                    this.refreshbyId(parentId, this._packageNode(element).internalId);
                }
            }
        };
        DOMExplorerClient.prototype.setStyle = function (internaID, property, newValue) {
            var element = this._getElementByInternalId(internaID, document.documentElement);
            element.style[property] = newValue;
        };
        DOMExplorerClient.prototype.globalload = function (value) {
            this._globalloadactive = value;
            if (this._globalloadactive) {
                this.refresh();
            }
        };
        DOMExplorerClient.prototype.getFirstParentWithInternalId = function (node) {
            if (!node)
                return null;
            if (node.parentNode && node.parentNode.__vorlon && node.parentNode.__vorlon.internalId) {
                return node.parentNode.__vorlon.internalId;
            }
            else
                return this.getFirstParentWithInternalId(node.parentNode);
        };
        DOMExplorerClient.prototype.getMutationObeserverAvailability = function () {
            var mutationObserver = window.MutationObserver || window.WebKitMutationObserver || null;
            if (mutationObserver) {
                this.sendCommandToDashboard('mutationObeserverAvailability', { availability: true });
            }
            else {
                this.sendCommandToDashboard('mutationObeserverAvailability', { availability: false });
            }
        };
        DOMExplorerClient.prototype.searchDOMBySelector = function (selector, position) {
            if (position === void 0) { position = 0; }
            var length = 0;
            try {
                if (selector) {
                    var elements = document.querySelectorAll(selector);
                    length = elements.length;
                    if (elements.length) {
                        if (!elements[position])
                            position = 0;
                        var parentId = this.getFirstParentWithInternalId(elements[position]);
                        if (parentId) {
                            this.refreshbyId(parentId, this._packageNode(elements[position]).internalId);
                        }
                        if (position < elements.length + 1) {
                            position++;
                        }
                    }
                }
            }
            catch (e) {
            }
            this.sendCommandToDashboard('searchDOMByResults', { length: length, selector: selector, position: position });
        };
        DOMExplorerClient.prototype.setAttribute = function (internaID, attributeName, attributeOldName, attributeValue) {
            var element = this._getElementByInternalId(internaID, document.documentElement);
            if (attributeName !== "attributeName") {
                try {
                    element.removeAttribute(attributeOldName);
                }
                catch (e) { }
                if (attributeName)
                    element.setAttribute(attributeName, attributeValue);
                if (attributeName && attributeName.indexOf('on') === 0) {
                    element[attributeName] = function () {
                        try {
                            eval(attributeValue);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    };
                }
            }
        };
        DOMExplorerClient.prototype.refreshbyId = function (internaID, internalIdToshow) {
            if (internalIdToshow === void 0) { internalIdToshow = ""; }
            if (internaID && internalIdToshow) {
                this._packageAndSendDOM(this._getElementByInternalId(internaID, document.documentElement), internalIdToshow);
            }
            else if (internaID) {
                this._packageAndSendDOM(this._getElementByInternalId(internaID, document.documentElement));
            }
        };
        DOMExplorerClient.prototype.setElementValue = function (internaID, value) {
            var element = this._getElementByInternalId(internaID, document.documentElement);
            element.innerHTML = value;
        };
        DOMExplorerClient.prototype.getNodeStyle = function (internalID) {
            var element = this._getElementByInternalId(internalID, document.documentElement);
            if (element) {
                var styles = DOMExplorerClient.GetAppliedStyles(element);
                this.sendCommandToDashboard('nodeStyle', { internalID: internalID, styles: styles });
            }
        };
        return DOMExplorerClient;
    })(VORLON.ClientPlugin);
    VORLON.DOMExplorerClient = DOMExplorerClient;
    DOMExplorerClient.prototype.ClientCommands = {
        getMutationObeserverAvailability: function () {
            var plugin = this;
            plugin.getMutationObeserverAvailability();
        },
        style: function (data) {
            var plugin = this;
            plugin.setStyle(data.order, data.property, data.newValue);
        },
        searchDOMBySelector: function (data) {
            var plugin = this;
            plugin.searchDOMBySelector(data.selector, data.position);
        },
        setSettings: function (data) {
            var plugin = this;
            if (data && data.globalload != null)
                plugin.globalload(data.globalload);
        },
        saveinnerHTML: function (data) {
            var plugin = this;
            plugin.saveInnerHTML(data.order, data.innerhtml);
        },
        attribute: function (data) {
            var plugin = this;
            plugin.setAttribute(data.order, data.attributeName, data.attributeOldName, data.attributeValue);
        },
        setElementValue: function (data) {
            var plugin = this;
            plugin.setElementValue(data.order, data.value);
        },
        select: function (data) {
            var plugin = this;
            plugin.unhighlightClientElement();
            plugin.setClientHighlightedElement(data.order);
            plugin.getNodeStyle(data.order);
        },
        unselect: function (data) {
            var plugin = this;
            plugin.unhighlightClientElement(data.order);
        },
        highlight: function (data) {
            var plugin = this;
            plugin.unhighlightClientElement();
            plugin.setClientHighlightedElement(data.order);
        },
        unhighlight: function (data) {
            var plugin = this;
            plugin.unhighlightClientElement(data.order);
        },
        refreshNode: function (data) {
            var plugin = this;
            plugin.refreshbyId(data.order);
        },
        getNodeStyles: function (data) {
            var plugin = this;
            console.log("get node style");
            //plugin.refreshbyId(data.order);
        },
        refresh: function () {
            var plugin = this;
            plugin.refresh();
        },
        inspect: function () {
            var plugin = this;
            plugin.inspect();
        },
        getInnerHTML: function (data) {
            var plugin = this;
            plugin.getInnerHTML(data.order);
        },
        getStyle: function (data) {
            var plugin = this;
            plugin.getStyle(data.order);
        },
        getComputedStyleById: function (data) {
            var plugin = this;
            plugin.getComputedStyleById(data.order);
        }
    };
    // Register
    VORLON.Core.RegisterClientPlugin(new DOMExplorerClient());
})(VORLON || (VORLON = {}));
var VORLON;
(function (VORLON) {
    var FeatureSupported = (function () {
        function FeatureSupported() {
        }
        return FeatureSupported;
    })();
    VORLON.FeatureSupported = FeatureSupported;
})(VORLON || (VORLON = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VORLON;
(function (VORLON) {
    var ModernizrReportClient = (function (_super) {
        __extends(ModernizrReportClient, _super);
        function ModernizrReportClient() {
            _super.call(this, "modernizrReport");
            this.supportedFeatures = [];
            this._ready = false;
            this._id = "MODERNIZR";
            //this.debug = true;
        }
        ModernizrReportClient.prototype.startClientSide = function () {
            this.loadModernizrFeatures();
        };
        ModernizrReportClient.prototype.loadModernizrFeatures = function () {
            var _this = this;
            this.trace("loading modernizr script");
            this._loadNewScriptAsync("modernizr.js", function () {
                _this.trace("modernizr script loaded");
                _this.checkSupportedFeatures();
            }, true);
        };
        ModernizrReportClient.prototype.checkSupportedFeatures = function () {
            if (Modernizr) {
                this.trace("checkin client features with Modernizr");
                this.supportedFeatures = [];
                this.supportedFeatures.push({ featureName: "Application cache", isSupported: Modernizr.applicationcache, type: "html" });
                this.supportedFeatures.push({ featureName: "Audio tag", isSupported: Modernizr.audio, type: "html" });
                this.supportedFeatures.push({ featureName: "background-size", isSupported: Modernizr.backgroundsize, type: "css" });
                this.supportedFeatures.push({ featureName: "border-image", isSupported: Modernizr.borderimage, type: "css" });
                this.supportedFeatures.push({ featureName: "border-radius", isSupported: Modernizr.borderradius, type: "css" });
                this.supportedFeatures.push({ featureName: "box-shadow", isSupported: Modernizr.boxshadow, type: "css" });
                this.supportedFeatures.push({ featureName: "canvas", isSupported: Modernizr.canvas, type: "html" });
                this.supportedFeatures.push({ featureName: "canvas text", isSupported: Modernizr.canvastext, type: "html" });
                this.supportedFeatures.push({ featureName: "CSS Animations", isSupported: Modernizr.cssanimations, type: "css" });
                this.supportedFeatures.push({ featureName: "CSS Columns", isSupported: Modernizr.csscolumns, type: "css" });
                this.supportedFeatures.push({ featureName: "CSS Gradients", isSupported: Modernizr.cssgradients, type: "css" });
                this.supportedFeatures.push({ featureName: "CSS Reflections", isSupported: Modernizr.cssreflections, type: "css" });
                this.supportedFeatures.push({ featureName: "CSS Transforms", isSupported: Modernizr.csstransforms, type: "css" });
                this.supportedFeatures.push({ featureName: "CSS Transforms 3d", isSupported: Modernizr.csstransforms3d, type: "css" });
                this.supportedFeatures.push({ featureName: "CSS Transitions", isSupported: Modernizr.csstransitions, type: "css" });
                this.supportedFeatures.push({ featureName: "Drag'n'drop", isSupported: Modernizr.draganddrop, type: "html" });
                this.supportedFeatures.push({ featureName: "Flexbox", isSupported: Modernizr.flexbox, type: "css" });
                this.supportedFeatures.push({ featureName: "@font-face", isSupported: Modernizr.fontface, type: "css" });
                this.supportedFeatures.push({ featureName: "CSS Generated Content (:before/:after)", isSupported: Modernizr.generatedcontent, type: "css" });
                this.supportedFeatures.push({ featureName: "Geolocation API", isSupported: Modernizr.geolocation, type: "misc" });
                this.supportedFeatures.push({ featureName: "hashchange Event", isSupported: Modernizr.hashchange, type: "html" });
                this.supportedFeatures.push({ featureName: "History Management", isSupported: Modernizr.history, type: "html" });
                this.supportedFeatures.push({ featureName: "Color Values hsla()", isSupported: Modernizr.hsla, type: "css" });
                this.supportedFeatures.push({ featureName: "IndexedDB", isSupported: Modernizr.indexeddb, type: "html" });
                this.supportedFeatures.push({ featureName: "Inline SVG in HTML5", isSupported: Modernizr.inlinesvg, type: "misc" });
                this.supportedFeatures.push({ featureName: "Input Attribute autocomplete", isSupported: Modernizr.input.autocomplete, type: "html" });
                /* TO DO: Inputs... */
                this.supportedFeatures.push({ featureName: "localStorage", isSupported: Modernizr.localstorage, type: "html" });
                this.supportedFeatures.push({ featureName: "Multiple backgrounds", isSupported: Modernizr.multiplebgs, type: "css" });
                this.supportedFeatures.push({ featureName: "opacity", isSupported: Modernizr.opacity, type: "css" });
                this.supportedFeatures.push({ featureName: "Cross-window Messaging", isSupported: Modernizr.postmessage, type: "html" });
                this.supportedFeatures.push({ featureName: "Color Values rgba()", isSupported: Modernizr.rgba, type: "css" });
                this.supportedFeatures.push({ featureName: "sessionStorage", isSupported: Modernizr.sessionstorage, type: "html" });
                this.supportedFeatures.push({ featureName: "SVG SMIL animation", isSupported: Modernizr.smil, type: "misc" });
                this.supportedFeatures.push({ featureName: "SVG", isSupported: Modernizr.svg, type: "misc" });
                this.supportedFeatures.push({ featureName: "SVG Clipping Paths", isSupported: Modernizr.svgclippaths, type: "misc" });
                this.supportedFeatures.push({ featureName: "text-shadow", isSupported: Modernizr.textshadow, type: "css" });
                this.supportedFeatures.push({ featureName: "Touch Events", isSupported: Modernizr.touch, type: "misc" });
                this.supportedFeatures.push({ featureName: "Video", isSupported: Modernizr.video, type: "html" });
                this.supportedFeatures.push({ featureName: "WebGL", isSupported: Modernizr.webgl, type: "misc" });
                this.supportedFeatures.push({ featureName: "Web Sockets", isSupported: ("WebSocket" in window), type: "html" });
                this.supportedFeatures.push({ featureName: "Web SQL Database", isSupported: Modernizr.websqldatabase, type: "html" });
                this.supportedFeatures.push({ featureName: "Web Workers", isSupported: Modernizr.webworkers, type: "html" });
                this.supportedFeatures.push({ featureName: "A [download] attribute", isSupported: Modernizr.adownload, type: "noncore" });
                this.supportedFeatures.push({ featureName: "Mozilla Audio Data API", isSupported: Modernizr.audiodata, type: "noncore" });
                this.supportedFeatures.push({ featureName: "HTML5 Web Audio API", isSupported: Modernizr.webaudio, type: "noncore" });
                this.supportedFeatures.push({ featureName: "Battery Status API", isSupported: Modernizr.battery, type: "noncore" });
                this.supportedFeatures.push({ featureName: "Low Battery Level", isSupported: Modernizr.lowbattery, type: "noncore" });
                this.supportedFeatures.push({ featureName: "Blob Constructor", isSupported: Modernizr.blobconstructor, type: "noncore" });
                this.supportedFeatures.push({ featureName: "Canvas toDataURL image/jpeg", isSupported: Modernizr.todataurljpeg, type: "noncore" });
                this.supportedFeatures.push({ featureName: "Canvas toDataURL image/png", isSupported: Modernizr.todataurlpng, type: "noncore" });
                this.supportedFeatures.push({ featureName: "Canvas toDataURL image/webp", isSupported: Modernizr.todataurlwebp, type: "noncore" });
                this.supportedFeatures.push({ featureName: "HTML5 Content Editable Attribute", isSupported: Modernizr.contenteditable, type: "noncore" });
                this.supportedFeatures.push({ featureName: "Content Security Policy", isSupported: Modernizr.contentsecuritypolicy, type: "noncore" });
                this.supportedFeatures.push({ featureName: "HTML5 Context Menu", isSupported: Modernizr.contextmenu, type: "noncore" });
                this.supportedFeatures.push({ featureName: "Cookie", isSupported: Modernizr.cookies, type: "noncore" });
                this.supportedFeatures.push({ featureName: "Cross-Origin Resource Sharing", isSupported: Modernizr.cors, type: "noncore" });
                this.supportedFeatures.push({ featureName: "CSS background-position Shorthand", isSupported: Modernizr.bgpositionshorthand, type: "noncore" });
                this.supportedFeatures.push({ featureName: "CSS background-position-x/y", isSupported: Modernizr.bgpositionxy, type: "noncore" });
                this.supportedFeatures.push({ featureName: "CSS background-repeat: space", isSupported: Modernizr.bgrepeatspace, type: "noncore" });
                this.supportedFeatures.push({ featureName: "CSS background-repeat: round", isSupported: Modernizr.bgrepeatround, type: "noncore" });
                this.supportedFeatures.push({ featureName: "CSS background-size: cover", isSupported: Modernizr.bgsizecover, type: "noncore" });
                this.supportedFeatures.push({ featureName: "CSS Box Sizing", isSupported: Modernizr.boxsizing, type: "noncore" });
                this.supportedFeatures.push({ featureName: "CSS Calc", isSupported: Modernizr.csscalc, type: "noncore" });
                this.supportedFeatures.push({ featureName: "CSS Cubic Bezier Range", isSupported: Modernizr.cubicbezierrange, type: "noncore" });
                this.supportedFeatures.push({ featureName: "Gamepad", isSupported: Modernizr.gamepads, type: "noncore" });
                //this.supportedFeatures.push({ featureName: "", isSupported: Modernizr.display-runin, type: "noncore" });
                //this.supportedFeatures.push({ featureName: "", isSupported: Modernizr.display-table, type: "noncore" });
                this.sendFeaturesToDashboard();
            }
        };
        ModernizrReportClient.prototype.sendFeaturesToDashboard = function () {
            var message = {};
            message.features = this.supportedFeatures || [];
            this.trace("sending " + message.features.length + " features");
            this.sendCommandToDashboard("clientfeatures", message);
        };
        ModernizrReportClient.prototype.refresh = function () {
            this.trace("refreshing Modernizr");
            if (this.supportedFeatures && this.supportedFeatures.length) {
                this.sendFeaturesToDashboard();
            }
            else {
                this.loadModernizrFeatures();
            }
        };
        return ModernizrReportClient;
    })(VORLON.ClientPlugin);
    VORLON.ModernizrReportClient = ModernizrReportClient;
    ModernizrReportClient.prototype.ClientCommands = {
        refresh: function (data) {
            var plugin = this;
            plugin.refresh();
        }
    };
    // Register
    VORLON.Core.RegisterClientPlugin(new ModernizrReportClient());
})(VORLON || (VORLON = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VORLON;
(function (VORLON) {
    var ObjectExplorerClient = (function (_super) {
        __extends(ObjectExplorerClient, _super);
        function ObjectExplorerClient() {
            _super.call(this, "objectExplorer");
            this._objPrototype = Object.getPrototypeOf({});
            this.STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
            this.ARGUMENT_NAMES = /([^\s,]+)/g;
            this.rootProperty = 'window';
            this._id = "OBJEXPLORER";
            this._ready = false;
        }
        ObjectExplorerClient.prototype.getFunctionArgumentNames = function (func) {
            var result = [];
            try {
                var fnStr = func.toString().replace(this.STRIP_COMMENTS, '');
                result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(this.ARGUMENT_NAMES);
                if (result === null)
                    result = [];
            }
            catch (exception) {
                console.error(exception);
            }
            return result;
        };
        ObjectExplorerClient.prototype.inspect = function (path, obj, context) {
            if (obj === undefined)
                return null;
            var res = {
                proto: null,
                fullpath: path.join('.'),
                name: path[path.length - 1],
                functions: [],
                properties: [],
                contentFetched: true,
                type: typeof obj
            };
            this.trace("inspecting " + res.fullpath + " as " + res.type);
            if (res.type === "function") {
                return res;
            }
            else if (obj === null) {
                res.type = "null";
                res.value = null;
                return res;
            }
            else if (res.type !== "object") {
                res.value = obj.toString();
                return res;
            }
            var objProperties = Object.getOwnPropertyNames(obj);
            var proto = Object.getPrototypeOf(obj);
            if (proto && proto != this._objPrototype)
                res.proto = this.inspect(path, proto, context);
            for (var i = 0, l = objProperties.length; i < l; i++) {
                var p = objProperties[i];
                var propertyType = "";
                if (p === '__vorlon')
                    continue;
                var propPath = JSON.parse(JSON.stringify(path));
                propPath.push(p);
                try {
                    var objValue = context[p];
                    propertyType = typeof objValue;
                    if (propertyType === 'function') {
                        res.functions.push({
                            name: p,
                            fullpath: propPath.join('.'),
                            args: this.getFunctionArgumentNames(objValue)
                        });
                    }
                    else if (propertyType === 'undefined') {
                        res.properties.push({
                            name: p,
                            type: propertyType,
                            fullpath: propPath.join('.'),
                            value: undefined
                        });
                    }
                    else if (propertyType === 'null') {
                        res.properties.push({
                            name: p,
                            type: propertyType,
                            fullpath: propPath.join('.'),
                            value: null
                        });
                    }
                    else if (propertyType === 'object') {
                        var desc = {
                            name: p,
                            type: propertyType,
                            fullpath: propPath.join('.'),
                            contentFetched: false
                        };
                        if (objValue === null) {
                            desc.type = "null";
                            desc.contentFetched = true;
                        }
                        res.properties.push(desc);
                    }
                    else {
                        res.properties.push({
                            name: p,
                            fullpath: propPath.join('.'),
                            type: propertyType,
                            value: objValue.toString()
                        });
                    }
                }
                catch (exception) {
                    this.trace('error reading property ' + p + ' of type ' + propertyType);
                    this.trace(exception);
                    res.properties.push({
                        name: p,
                        type: propertyType,
                        fullpath: propPath.join('.'),
                        val: "oups, Vorlon has an error reading this " + propertyType + " property..."
                    });
                }
            }
            res.functions = res.functions.sort(function (a, b) {
                var lowerAName = a.name.toLowerCase();
                var lowerBName = b.name.toLowerCase();
                if (lowerAName > lowerBName)
                    return 1;
                if (lowerAName < lowerBName)
                    return -1;
                return 0;
            });
            res.properties = res.properties.sort(function (a, b) {
                var lowerAName = a.name.toLowerCase();
                var lowerBName = b.name.toLowerCase();
                if (lowerAName > lowerBName)
                    return 1;
                if (lowerAName < lowerBName)
                    return -1;
                return 0;
            });
            return res;
        };
        ObjectExplorerClient.prototype._getProperty = function (propertyPath) {
            var selectedObj = window;
            var tokens = [this.rootProperty];
            this.trace("getting obj at " + propertyPath);
            if (propertyPath && propertyPath !== this.rootProperty) {
                tokens = propertyPath.split('.');
                if (tokens && tokens.length) {
                    for (var i = 0, l = tokens.length; i < l; i++) {
                        selectedObj = selectedObj[tokens[i]];
                        if (selectedObj === undefined) {
                            this.trace(tokens[i] + " not found");
                            break;
                        }
                    }
                }
            }
            if (selectedObj === undefined) {
                console.log('not found');
                return { type: 'notfound', name: 'not found', val: null, functions: [], properties: [], contentFetched: false, fullpath: null };
            }
            var res = this.inspect(tokens, selectedObj, selectedObj);
            return res;
        };
        ObjectExplorerClient.prototype._packageAndSendObjectProperty = function (path) {
            path = path || this._currentPropertyPath;
            var packagedObject = this._getProperty(path);
            this.sendCommandToDashboard('update', packagedObject);
            //this.sendToDashboard({ type: type, path: packagedObject.fullpath, property: packagedObject });
        };
        ObjectExplorerClient.prototype.startClientSide = function () {
        };
        ObjectExplorerClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
            //switch (receivedObject.type) {
            //    case "query":
            //        this._currentPropertyPath = receivedObject.path;
            //        this._packageAndSendObjectProperty(receivedObject.type);
            //        break;
            //    case "queryContent":
            //        this._packageAndSendObjectProperty(receivedObject.type, receivedObject.path);
            //        break;
            //    default:
            //        break;
            //}
        };
        ObjectExplorerClient.prototype.query = function (path) {
            this._currentPropertyPath = path;
            var packagedObject = this._getProperty(path);
            this.sendCommandToDashboard('root', packagedObject);
        };
        ObjectExplorerClient.prototype.queryContent = function (path) {
            var packagedObject = this._getProperty(path);
            this.sendCommandToDashboard('content', packagedObject);
        };
        ObjectExplorerClient.prototype.refresh = function () {
            this.query(this._currentPropertyPath);
        };
        return ObjectExplorerClient;
    })(VORLON.ClientPlugin);
    VORLON.ObjectExplorerClient = ObjectExplorerClient;
    ObjectExplorerClient.prototype.ClientCommands = {
        query: function (data) {
            var plugin = this;
            plugin.query(data.path);
        },
        queryContent: function (data) {
            var plugin = this;
            plugin.queryContent(data.path);
        }
    };
    // Register
    VORLON.Core.RegisterClientPlugin(new ObjectExplorerClient());
})(VORLON || (VORLON = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VORLON;
(function (VORLON) {
    var WebStandardsClient = (function (_super) {
        __extends(WebStandardsClient, _super);
        function WebStandardsClient() {
            _super.call(this, "webstandards");
            this._currentAnalyze = {};
            this.browserDetectionHook = {
                userAgent: [],
                appVersion: [],
                appName: [],
                product: [],
                vendor: [],
            };
            this.exceptions = [
                "vorlon.max.js",
                "vorlon.min.js",
                "vorlon.js",
                "google-analytics.com"
            ];
            this._id = "WEBSTANDARDS";
            this._ready = true;
            //this.debug = true;            
        }
        WebStandardsClient.prototype.refresh = function () {
            //override this method with cleanup work that needs to happen
            //as the user switches between clients on the dashboard
        };
        // Start the clientside code
        WebStandardsClient.prototype.startClientSide = function () {
            this.hook(window.navigator, "userAgent");
            this.hook(window.navigator, "appVersion");
            this.hook(window.navigator, "appName");
            this.hook(window.navigator, "product");
            this.hook(window.navigator, "vendor");
        };
        WebStandardsClient.prototype.hook = function (root, prop) {
            var _this = this;
            VORLON.Tools.HookProperty(root, prop, function (stack) {
                //this.trace("browser detection " + stack.file);
                //this.trace(stack.stack);
                if (stack.file) {
                    if (_this.exceptions.some(function (s) { return stack.file.indexOf(s) >= 0; })) {
                        //this.trace("skip browser detection access " + stack.file)
                        return;
                    }
                }
                _this.browserDetectionHook[prop].push(stack);
            });
        };
        WebStandardsClient.prototype.capitalizeFirstLetter = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
        WebStandardsClient.prototype.startNewAnalyze = function (data) {
            var allHTML = document.documentElement.outerHTML;
            this.sendedHTML = allHTML;
            var node = document.doctype;
            if (node) {
                var doctypeHtml = "<!DOCTYPE "
                    + node.name
                    + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
                    + (!node.publicId && node.systemId ? ' SYSTEM' : '')
                    + (node.systemId ? ' "' + node.systemId + '"' : '')
                    + '>';
                this._doctype = {
                    html: doctypeHtml,
                    name: node.name,
                    publicId: node.publicId,
                    systemId: node.systemId
                };
            }
            var inlineStylesheets = document.querySelectorAll("style");
            var stylesheetErrors = null;
            if (data.analyzeCssFallback) {
                stylesheetErrors = {};
                if (inlineStylesheets.length) {
                    for (var x = 0; x < inlineStylesheets.length; x++) {
                        this.analyzeCssDocument("inline " + [x], inlineStylesheets[x].innerHTML, data.id, stylesheetErrors);
                    }
                }
            }
            this.sendCommandToDashboard("htmlContent", { html: allHTML, doctype: this._doctype, url: window.location, browserDetection: this.browserDetectionHook, id: data.id, stylesheetErrors: stylesheetErrors });
        };
        WebStandardsClient.prototype.checkIfNoPrefix = function (rules, prefix) {
            var present = false;
            if (rules && rules.length)
                for (var i = 0; i < rules.length; i++) {
                    if (rules[i].directive.indexOf(prefix) === 0) {
                        present = true;
                        break;
                    }
                }
            if (!present) {
                present = this.checkIfMsPrefix(rules, prefix);
            }
            return present;
        };
        WebStandardsClient.prototype.checkIfMsPrefix = function (rules, prefix) {
            var present = false;
            if (rules && rules.length)
                for (var i = 0; i < rules.length; i++) {
                    if (rules[i].directive.indexOf('-ms-' + prefix) === 0) {
                        present = true;
                        break;
                    }
                }
            return present;
        };
        WebStandardsClient.prototype.unprefixedPropertyName = function (property) {
            return property.replace("-webkit-", "").replace("-moz-", "").replace("-o-", "").replace("-ms-", "");
        };
        WebStandardsClient.prototype.checkPrefix = function (rules) {
            var errorList = [];
            if (rules && rules.length)
                for (var i = 0; i < rules.length; i++) {
                    if (rules[i].directive.indexOf('-webkit') === 0) {
                        var _unprefixedPropertyName = this.unprefixedPropertyName(rules[i].directive);
                        var good = this.checkIfNoPrefix(rules, _unprefixedPropertyName);
                        if (!good) {
                            var divTest = document.createElement('div');
                            divTest.style['webkit' + this.capitalizeFirstLetter(_unprefixedPropertyName)] = rules[i].value;
                            if (divTest.style[_unprefixedPropertyName] == divTest.style['webkit' + this.capitalizeFirstLetter(_unprefixedPropertyName)]) {
                                good = true;
                            }
                        }
                        if (!good) {
                            errorList.push(rules[i].directive);
                        }
                    }
                }
            return errorList;
        };
        WebStandardsClient.prototype.analyzeCssDocument = function (url, content, id, results) {
            var parser = new cssjs();
            var parsed = parser.parseCSS(content);
            // console.log("processing css " + url);
            for (var i = 0; i < parsed.length; i++) {
                var selector = parsed[i].selector;
                var rules = parsed[i].rules;
                var resultsList = this.checkPrefix(rules);
                if (resultsList.length > 0) {
                    if (!results[url])
                        results[url] = {};
                    if (!results[url][selector])
                        results[url][selector] = [];
                    for (var x = 0; x < resultsList.length; x++) {
                        results[url][selector].push(resultsList[x]);
                    }
                }
            }
        };
        WebStandardsClient.prototype.fetchDocument = function (data, localFetch) {
            var _this = this;
            if (localFetch === void 0) { localFetch = false; }
            var xhr = null;
            var completed = false;
            var timeoutRef = null;
            if (!data || !data.url) {
                this.trace("invalid fetch request");
                return;
            }
            var documentUrl = data.url;
            if (documentUrl.indexOf("//") === 0) {
                documentUrl = window.location.protocol + documentUrl;
            }
            documentUrl = this.getAbsolutePath(documentUrl);
            if (documentUrl.indexOf("http") === 0) {
                //external resources may not have Access Control headers, we make a proxied request to prevent CORS issues
                var serverurl = VORLON.Core._messenger._serverUrl;
                if (serverurl[serverurl.length - 1] !== '/')
                    serverurl = serverurl + "/";
                var target = this.getAbsolutePath(data.url);
                documentUrl = serverurl + "httpproxy/fetch?fetchurl=" + encodeURIComponent(target);
            }
            this.trace("fetching " + documentUrl);
            try {
                xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            completed = true;
                            clearTimeout(timeoutRef);
                            var encoding = xhr.getResponseHeader("X-VorlonProxyEncoding") || xhr.getResponseHeader("content-encoding");
                            var contentLength = xhr.getResponseHeader("content-length");
                            _this.trace("encoding for " + data.url + " is " + encoding);
                            var stylesheetErrors = null;
                            if (data.type === "stylesheet" && data.analyzeCssFallback === true) {
                                stylesheetErrors = {};
                                _this.analyzeCssDocument(data.url, xhr.responseText, data.id, stylesheetErrors);
                            }
                            //TODO getting encoding is not working in IE (but do in Chrome), must try on other browsers because getting it may enable performance rules
                            _this.sendCommandToDashboard("documentContent", { id: data.id, url: data.url, status: xhr.status, content: xhr.responseText, contentLength: contentLength, encoding: encoding, stylesheetErrors: stylesheetErrors });
                        }
                        else {
                            completed = true;
                            clearTimeout(timeoutRef);
                            _this.sendCommandToDashboard("documentContent", { id: data.id, url: data.url, status: xhr.status, content: null, error: xhr.statusText });
                        }
                    }
                };
                xhr.open("GET", documentUrl, true);
                xhr.send(null);
                timeoutRef = setTimeout(function () {
                    if (!completed) {
                        completed = true;
                        _this.trace("fetch timeout for " + data.url);
                        xhr.abort();
                        _this.sendCommandToDashboard("documentContent", { id: data.id, url: data.url, status: null, content: null, error: "timeout" });
                    }
                }, 20 * 1000);
            }
            catch (e) {
                console.error(e);
                completed = true;
                clearTimeout(timeoutRef);
                this.sendCommandToDashboard("documentContent", { id: data.id, url: data.url, status: 0, content: null, error: e.message });
            }
        };
        WebStandardsClient.prototype.getAbsolutePath = function (url) {
            var a = document.createElement('a');
            a.href = url;
            return a.href;
        };
        return WebStandardsClient;
    })(VORLON.ClientPlugin);
    VORLON.WebStandardsClient = WebStandardsClient;
    WebStandardsClient.prototype.ClientCommands = {
        startNewAnalyze: function (data) {
            var plugin = this;
            plugin.startNewAnalyze(data);
        },
        fetchDocument: function (data) {
            var plugin = this;
            plugin.fetchDocument(data);
        }
    };
    //Register the plugin with vorlon core
    VORLON.Core.RegisterClientPlugin(new WebStandardsClient());
})(VORLON || (VORLON = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VORLON;
(function (VORLON) {
    var XHRPanelClient = (function (_super) {
        __extends(XHRPanelClient, _super);
        function XHRPanelClient() {
            _super.call(this, "xhrPanel");
            this.hooked = false;
            this.cache = [];
            this._id = "XHRPANEL";
            this._ready = false;
        }
        XHRPanelClient.prototype.refresh = function () {
            this.sendStateToDashboard();
            this.sendCacheToDashboard();
        };
        XHRPanelClient.prototype.sendStateToDashboard = function () {
            this.sendCommandToDashboard('state', { hooked: this.hooked });
        };
        XHRPanelClient.prototype.sendCacheToDashboard = function () {
            for (var i = 0, l = this.cache.length; i < l; i++) {
                this.sendCommandToDashboard('xhr', this.cache[i]);
            }
        };
        XHRPanelClient.prototype.clearClientCache = function () {
            this.cache = [];
        };
        // This code will run on the client //////////////////////
        XHRPanelClient.prototype.startClientSide = function () {
            //this.setupXMLHttpRequestHook();
        };
        XHRPanelClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
        };
        XHRPanelClient.prototype.setupXMLHttpRequestHook = function () {
            var that = this;
            var w = window;
            w.___XMLHttpRequest = w.XMLHttpRequest;
            var XmlHttpRequestProxy = function () {
                var xhr = new w.___XMLHttpRequest();
                var data = {
                    id: VORLON.Tools.CreateGUID(),
                    url: null,
                    status: null,
                    statusText: null,
                    method: null,
                    responseType: null,
                    responseHeaders: null,
                    requestHeaders: [],
                    readyState: 0,
                };
                that.cache.push(data);
                xhr.__open = xhr.open;
                xhr.__send = xhr.send;
                xhr.__setRequestHeader = xhr.setRequestHeader;
                //todo catch send to get posted data
                //see https://msdn.microsoft.com/en-us/library/hh772834(v=vs.85).aspx
                xhr.open = function () {
                    data.method = arguments[0];
                    data.url = arguments[1];
                    that.trace('request for ' + data.url);
                    that.sendCommandToDashboard('xhr', data);
                    xhr.__open.apply(xhr, arguments);
                    return xhr.__open.apply(xhr, arguments);
                };
                xhr.setRequestHeader = function () {
                    var header = {
                        name: arguments[0],
                        value: arguments[1]
                    };
                    data.requestHeaders.push(header);
                    return xhr.__setRequestHeader.apply(xhr, arguments);
                };
                xhr.addEventListener('readystatechange', function () {
                    data.readyState = xhr.readyState;
                    that.trace('STATE CHANGED ' + data.readyState);
                    if (data.readyState === 4) {
                        data.responseType = xhr.responseType;
                        data.status = xhr.status;
                        data.statusText = xhr.statusText;
                        if (xhr.getAllResponseHeaders)
                            data.responseHeaders = xhr.getAllResponseHeaders();
                        that.trace('LOADED !!!');
                    }
                    that.sendCommandToDashboard('xhr', data);
                });
                return xhr;
            };
            w.XMLHttpRequest = XmlHttpRequestProxy;
            this.hooked = true;
            this.sendStateToDashboard();
        };
        XHRPanelClient.prototype.removeXMLHttpRequestHook = function () {
            if (this.hooked) {
                this.trace('xhrPanel remove hook');
                var w = window;
                w.XMLHttpRequest = w.___XMLHttpRequest;
                this.hooked = false;
                this.sendStateToDashboard();
            }
        };
        XHRPanelClient.prototype._render = function (tagname, parentNode, classname, value) {
            var elt = document.createElement(tagname);
            elt.className = classname || '';
            if (value)
                elt.innerHTML = value;
            parentNode.appendChild(elt);
            return elt;
        };
        return XHRPanelClient;
    })(VORLON.ClientPlugin);
    VORLON.XHRPanelClient = XHRPanelClient;
    XHRPanelClient.prototype.ClientCommands = {
        start: function (data) {
            var plugin = this;
            plugin.setupXMLHttpRequestHook();
        },
        stop: function (data) {
            var plugin = this;
            plugin.removeXMLHttpRequestHook();
        },
        getState: function (data) {
            var plugin = this;
            plugin.sendStateToDashboard();
        },
        clear: function (data) {
            var plugin = this;
            plugin.clearClientCache();
        }
    };
    //Register the plugin with vorlon core
    VORLON.Core.RegisterClientPlugin(new XHRPanelClient());
})(VORLON || (VORLON = {}));
var VORLON;
(function (VORLON) {
    var PerformanceItem = (function () {
        function PerformanceItem() {
        }
        return PerformanceItem;
    })();
    VORLON.PerformanceItem = PerformanceItem;
})(VORLON || (VORLON = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VORLON;
(function (VORLON) {
    var NetworkMonitorClient = (function (_super) {
        __extends(NetworkMonitorClient, _super);
        function NetworkMonitorClient() {
            _super.call(this, "networkMonitor");
            this.performanceItems = [];
            //this.debug = true;
            this._ready = true;
        }
        NetworkMonitorClient.prototype.getID = function () {
            return "NETWORK";
        };
        NetworkMonitorClient.prototype.sendClientData = function () {
            this.trace("network monitor sending data ");
            var entries = window.performance.getEntries();
            //console.log(entries);
            this.performanceItems = [];
            for (var i = 0; i < entries.length; i++) {
                this.performanceItems.push({
                    name: entries[i].name,
                    type: entries[i].initiatorType,
                    startTime: entries[i].startTime,
                    duration: entries[i].duration,
                    redirectStart: entries[i].redirectStart,
                    redirectDuration: entries[i].redirectEnd - entries[i].redirectStart,
                    dnsStart: entries[i].domainLookupStart,
                    dnsDuration: entries[i].domainLookupEnd - entries[i].domainLookupStart,
                    tcpStart: entries[i].connectStart,
                    tcpDuration: entries[i].connectEnd - entries[i].connectStart,
                    requestStart: entries[i].requestStart,
                    requestDuration: entries[i].responseStart - entries[i].requestStart,
                    responseStart: entries[i].responseStart,
                    responseDuration: (entries[i].responseStart == 0 ? 0 : entries[i].responseEnd - entries[i].responseStart)
                });
            }
            //console.log(this.performanceItems);
            var message = {};
            message.entries = this.performanceItems;
            this.sendCommandToDashboard("performanceItems", message);
        };
        NetworkMonitorClient.prototype.refresh = function () {
            this.sendClientData();
        };
        return NetworkMonitorClient;
    })(VORLON.ClientPlugin);
    VORLON.NetworkMonitorClient = NetworkMonitorClient;
    NetworkMonitorClient.prototype.ClientCommands = {
        refresh: function (data) {
            var plugin = this;
            plugin.sendClientData();
        }
    };
    //Register the plugin with vorlon core 
    VORLON.Core.RegisterClientPlugin(new NetworkMonitorClient());
})(VORLON || (VORLON = {}));
var VORLON;
(function (VORLON) {
    var KeyValue = (function () {
        function KeyValue() {
        }
        return KeyValue;
    })();
    VORLON.KeyValue = KeyValue;
})(VORLON || (VORLON = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VORLON;
(function (VORLON) {
    var ResourcesExplorerClient = (function (_super) {
        __extends(ResourcesExplorerClient, _super);
        function ResourcesExplorerClient() {
            var _this = this;
            _super.call(this, "resourcesExplorer");
            this.localStorageList = [];
            this.sessionStorageList = [];
            this.cookiesList = [];
            this._ready = true;
            this._id = "RESOURCES";
            //this.debug = true;
            window.addEventListener("load", function () {
                _this.sendClientData();
            });
        }
        ResourcesExplorerClient.prototype.sendClientData = function () {
            // LOCAL STORAGE
            this.localStorageList = [];
            for (var i = 0; i < localStorage.length; i++) {
                this.localStorageList.push({ "key": localStorage.key(i), "value": localStorage.getItem(localStorage.key(i)) });
            }
            // SESSION STORAGE
            this.sessionStorageList = [];
            for (var i = 0; i < sessionStorage.length; i++) {
                this.sessionStorageList.push({ "key": sessionStorage.key(i), "value": sessionStorage.getItem(sessionStorage.key(i)) });
            }
            // COOKIES
            this.cookiesList = [];
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var keyValue = cookies[i].split('=');
                this.cookiesList.push({ "key": keyValue[0], "value": keyValue[1] });
            }
            var message = {};
            message.localStorageList = this.localStorageList;
            message.sessionStorageList = this.sessionStorageList;
            message.cookiesList = this.cookiesList;
            this.sendCommandToDashboard("resourceitems", message);
        };
        ResourcesExplorerClient.prototype.refresh = function () {
            this.sendClientData();
        };
        return ResourcesExplorerClient;
    })(VORLON.ClientPlugin);
    VORLON.ResourcesExplorerClient = ResourcesExplorerClient;
    ResourcesExplorerClient.prototype.ClientCommands = {
        refresh: function (data) {
            var plugin = this;
            plugin.refresh();
        }
    };
    //Register the plugin with vorlon core 
    VORLON.Core.RegisterClientPlugin(new ResourcesExplorerClient());
})(VORLON || (VORLON = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VORLON;
(function (VORLON) {
    var DeviceClient = (function (_super) {
        __extends(DeviceClient, _super);
        function DeviceClient() {
            _super.call(this, "device");
            this._ready = true;
        }
        //Return unique id for your plugin
        DeviceClient.prototype.getID = function () {
            return "DEVICE";
        };
        DeviceClient.prototype.refresh = function () {
            // override this method with cleanup work that needs to happen
            // as the user switches between clients on the dashboard
            var _this = this;
            if (typeof verge === 'undefined' || typeof res === 'undefined') {
                return;
            }
            //sometimes refresh is called before document was loaded
            if (!document.body) {
                setTimeout(function () {
                    _this.refresh();
                }, 200);
                return;
            }
            // user agent string
            var userAgent = this.getUserAgent();
            // console.info('User agent:', userAgent);
            // meta viewport tag
            var metaViewport = this.getMetaViewport();
            // console.info('Meta viewport:', metaViewport);
            // screen widths
            var screenWidths = this.getScreenWidths();
            // console.info('Screen widths', screenWidths);
            // screen resolution
            var resolution = this.getResolution();
            // console.info('Resolution', resolution);
            // root font size
            var rootFontSize = this.getRootFontSize();
            // console.info('Root font size:', rootFontSize);
            // viewport
            var viewport = this.getViewport();
            // console.info('Viewport', viewport);
            // pixel ratio
            var pixelRatio = this.getPixelRatio();
            // console.info('Pixel ratio:', pixelRatio);
            var data = {
                userAgent: userAgent,
                metaViewport: metaViewport,
                screenWidths: screenWidths,
                resolution: resolution,
                rootFontSize: rootFontSize,
                viewport: viewport,
                pixelRatio: pixelRatio
            };
            var message = {
                type: 'full',
                data: data
            };
            this.sendToDashboard(message);
        };
        DeviceClient.prototype.refreshResize = function () {
            if (typeof verge === 'undefined') {
                return;
            }
            var data = {
                screenWidths: this.getScreenWidths(),
                viewport: this.getViewport(),
            };
            var message = {
                type: 'resize',
                data: data
            };
            this.sendToDashboard(message);
            // console.log('Device information refreshed for resize.');
        };
        DeviceClient.prototype.getUserAgent = function () {
            return navigator.userAgent;
        };
        DeviceClient.prototype.getMetaViewport = function () {
            var metaViewportTag = document.querySelector('meta[name="viewport"]');
            var metaViewport;
            if ((metaViewport !== null || metaViewport === []) && typeof metaViewportTag != 'undefined' && metaViewportTag != null) {
                metaViewport = metaViewportTag.outerHTML;
            }
            else {
                console.log('No meta viewport tag found.');
                metaViewport = 'No meta viewport tag found.';
            }
            return metaViewport;
        };
        DeviceClient.prototype.getScreenWidths = function () {
            return {
                screenWidth: screen.width,
                screenAvailWidth: screen.availWidth,
                windowInnerWidth: window.innerWidth,
                bodyClientWidth: document.body.clientWidth,
            };
        };
        DeviceClient.prototype.getResolution = function () {
            return {
                dpi: res.dpi(),
                dppx: res.dppx(),
                dpcm: res.dpcm()
            };
        };
        DeviceClient.prototype.getRootFontSize = function () {
            // returns the root font size in pixels
            var htmlRoot = document.getElementsByTagName('html')[0];
            return parseInt(window.getComputedStyle(htmlRoot, null).getPropertyValue('font-size'));
        };
        DeviceClient.prototype.getViewport = function () {
            var rootFontSize = this.getRootFontSize();
            return {
                aspectRatio: verge.aspect(screen),
                width: verge.viewportW(),
                widthEm: (verge.viewportW() / rootFontSize).toFixed(0),
            };
        };
        DeviceClient.prototype.getPixelRatio = function () {
            // pixel ratio refers to ratio between physical pixels and logical pixels
            // see http://stackoverflow.com/a/8785677 for more information
            var pixelRatio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
            pixelRatio = pixelRatio.toFixed(2);
            return pixelRatio;
        };
        // This code will run on the client //////////////////////
        // Start the clientside code
        DeviceClient.prototype.startClientSide = function () {
            // load the "res" and "verge" libraries
            var _this = this;
            this._loadNewScriptAsync("res.min.js", function () {
                if (res) {
                    _this.refresh();
                }
            });
            this._loadNewScriptAsync("verge.min.js", function () {
                if (verge) {
                    _this.refresh();
                }
            });
            // update certain information when the page is resized
            window.addEventListener('resize', this.refreshResize.bind(this));
        };
        // Handle messages from the dashboard, on the client
        DeviceClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
            // the dashboard shouldn't be sending anything
        };
        return DeviceClient;
    })(VORLON.ClientPlugin);
    VORLON.DeviceClient = DeviceClient;
    // Register the plugin with vorlon core
    VORLON.Core.RegisterClientPlugin(new DeviceClient());
})(VORLON || (VORLON = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VORLON;
(function (VORLON) {
    var UnitTestRunnerClient = (function (_super) {
        __extends(UnitTestRunnerClient, _super);
        //public localStorageList: KeyValue[] = [];
        function UnitTestRunnerClient() {
            _super.call(this, "unitTestRunner");
            this._ready = false;
        }
        UnitTestRunnerClient.prototype.getID = function () {
            return "UNITTEST";
        };
        UnitTestRunnerClient.prototype.startClientSide = function () {
            var _this = this;
            this._loadNewScriptAsync("qunit.js", function () {
                var self = _this;
                _this._ready = true;
                QUnit.testDone(function (details) {
                    //console.log("QUnit.testDone");
                    //console.log(details);
                    var message = {};
                    message.commandType = "testDone";
                    message.name = details.name;
                    message.module = details.module;
                    message.failed = details.failed;
                    message.passed = details.passed;
                    message.total = details.total;
                    message.runtime = details.runtime;
                    _this.sendToDashboard(message);
                });
                QUnit.done(function (details) {
                    //console.log("QUnit.done");
                    //console.log(details);
                    var message = {};
                    message.commandType = "done";
                    message.failed = details.failed;
                    message.passed = details.passed;
                    message.total = details.total;
                    message.runtime = details.runtime;
                    _this.sendToDashboard(message);
                });
            });
        };
        UnitTestRunnerClient.prototype.refresh = function () {
        };
        UnitTestRunnerClient.prototype.runTest = function (testContent) {
            eval(testContent);
        };
        UnitTestRunnerClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
        };
        return UnitTestRunnerClient;
    })(VORLON.ClientPlugin);
    VORLON.UnitTestRunnerClient = UnitTestRunnerClient;
    UnitTestRunnerClient.prototype.ClientCommands = {
        runTest: function (data) {
            var plugin = this;
            plugin.runTest(data);
        }
    };
    //Register the plugin with vorlon core 
    VORLON.Core.RegisterClientPlugin(new UnitTestRunnerClient());
})(VORLON || (VORLON = {}));

 (function() { VORLON.Core.StartClientSide('http://localhost:1337/', 'default'); }());